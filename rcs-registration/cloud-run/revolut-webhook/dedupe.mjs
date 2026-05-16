import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const COLLECTION_NAME = "revolut_webhook_events";
const DEFAULT_LEASE_MS = 60 * 1000;
const TERMINAL_RECORD_ONLY_STATES = new Set(["applied", "mapped", "enrichment_required", "ignored"]);

function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function cleanPart(value, fallback = "unknown") {
  const cleaned = String(value || "").trim();
  return cleaned || fallback;
}

function buildReceiptKey({ event, orderId }) {
  return [
    "revolut",
    cleanPart(event),
    cleanPart(orderId)
  ].join(":");
}

function buildLogicalDedupeKey({ event, orderId, applicationId }) {
  return [
    "revolut",
    cleanPart(event),
    cleanPart(orderId),
    cleanPart(applicationId, "unresolved")
  ].join(":");
}

function buildDocumentId(receiptKey) {
  return sha256Hex(receiptKey);
}

function truncate(value, maxLength = 240) {
  const text = String(value || "");
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}

function sanitiseErrorMessage(value) {
  return truncate(String(value || "").replace(/[{}[\]"']/g, ""), 240);
}

function isoNow(now = new Date()) {
  return now instanceof Date ? now.toISOString() : new Date(now).toISOString();
}

function leaseExpiry(now = new Date(), leaseMs = DEFAULT_LEASE_MS) {
  return new Date(new Date(now).getTime() + leaseMs).toISOString();
}

function isExpired(isoTimestamp, now = new Date()) {
  if (!isoTimestamp) return true;
  return new Date(isoTimestamp).getTime() <= new Date(now).getTime();
}

function determineRecordState(mapping) {
  if (mapping.enrichmentRequired) return "enrichment_required";
  if (mapping.mapped) return "mapped";
  return "ignored";
}

function buildDedupeRecord(result, {
  now = new Date(),
  leaseMs = DEFAULT_LEASE_MS
} = {}) {
  const verification = result.internal && result.internal.verification || {};
  const mapping = result.internal && result.internal.mapping || {};
  const operatorBillingArgs = mapping.operatorBillingArgs || {};
  const event = verification.event || mapping.event || "";
  const orderId = verification.orderId || mapping.orderId || "";
  const applicationId = mapping.applicationId || verification.merchantOrderExtRef || "";
  const receiptKey = buildReceiptKey({ event, orderId });

  return {
    documentId: buildDocumentId(receiptKey),
    collection: COLLECTION_NAME,
    receiptKey,
    dedupeKey: receiptKey,
    logicalDedupeKey: buildLogicalDedupeKey({ event, orderId, applicationId }),
    event,
    orderId,
    applicationId,
    classification: mapping.classification || "",
    receivedAt: isoNow(now),
    requestTimestamp: verification.requestTimestamp || "",
    signatureMatched: Boolean(verification.signatureMatched),
    timestampAccepted: Boolean(verification.timestampAccepted),
    state: determineRecordState(mapping),
    billingUpdateApplied: Boolean(result.body && result.body.billingUpdateApplied),
    billingStatus: operatorBillingArgs.billingStatus || "",
    paymentStatus: operatorBillingArgs.paymentStatus || "",
    refundStatus: operatorBillingArgs.refundStatus || "",
    revolutOrderType: mapping.classification || "",
    relatedOrderId: "",
    leaseExpiresAt: leaseExpiry(now, leaseMs),
    errorCode: result.body && result.body.reason || "",
    errorMessage: sanitiseErrorMessage(result.internal && result.internal.message || "")
  };
}

function shouldRecordDedupe(result) {
  const verification = result.internal && result.internal.verification || {};
  return result.status === 202
    && verification.signatureMatched === true
    && verification.timestampAccepted === true
    && Boolean(verification.event)
    && Boolean(verification.orderId);
}

function decideExistingRecord(existing, {
  now = new Date()
} = {}) {
  if (!existing) {
    return {
      decision: "create",
      duplicate: false,
      shouldContinue: true
    };
  }

  if (TERMINAL_RECORD_ONLY_STATES.has(existing.state)) {
    return {
      decision: "duplicate_terminal",
      duplicate: true,
      shouldContinue: false
    };
  }

  // processing/received/failed retry paths are forward scaffolding for the later async apply flow.
  if (existing.state === "processing" && !isExpired(existing.leaseExpiresAt, now)) {
    return {
      decision: "duplicate_in_flight",
      duplicate: true,
      shouldContinue: false
    };
  }

  if ((existing.state === "processing" || existing.state === "received") && isExpired(existing.leaseExpiresAt, now)) {
    return {
      decision: "reacquire_expired_lease",
      duplicate: false,
      shouldContinue: true
    };
  }

  if (existing.state === "failed" && existing.retryable === true) {
    return {
      decision: "retry_failed",
      duplicate: false,
      shouldContinue: true
    };
  }

  if (existing.state === "failed") {
    return {
      decision: "duplicate_failed",
      duplicate: true,
      shouldContinue: false
    };
  }

  return {
    decision: "duplicate_unknown_state",
    duplicate: true,
    shouldContinue: false
  };
}

class InMemoryDedupeStore {
  constructor(initialRecords = []) {
    this.records = new Map();
    initialRecords.forEach((record) => {
      this.records.set(record.documentId, { ...record });
    });
  }

  async record(record, {
    now = new Date()
  } = {}) {
    const existing = this.records.get(record.documentId) || null;
    const decision = decideExistingRecord(existing, { now });
    if (!decision.shouldContinue) {
      return {
        ...decision,
        record: existing
      };
    }

    this.records.set(record.documentId, { ...record });
    return {
      ...decision,
      record
    };
  }

  get(documentId) {
    return this.records.get(documentId) || null;
  }
}

class FirestoreDedupeStore {
  constructor({
    firestore,
    collectionName = COLLECTION_NAME
  }) {
    if (!firestore) throw new Error("Missing Firestore client");
    this.firestore = firestore;
    this.collectionName = collectionName;
  }

  static async fromDefault(options = {}) {
    const { Firestore } = await import("@google-cloud/firestore");
    return new FirestoreDedupeStore({
      firestore: new Firestore(),
      ...options
    });
  }

  async record(record, {
    now = new Date()
  } = {}) {
    const ref = this.firestore.collection(this.collectionName).doc(record.documentId);
    return this.firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const existing = snapshot.exists ? snapshot.data() : null;
      const decision = decideExistingRecord(existing, { now });
      if (!decision.shouldContinue) {
        return {
          ...decision,
          record: existing
        };
      }

      transaction.set(ref, record, { merge: true });
      return {
        ...decision,
        record
      };
    });
  }
}

async function recordDedupeResult(result, {
  store,
  now = new Date(),
  leaseMs = DEFAULT_LEASE_MS
} = {}) {
  if (!store) {
    return {
      recorded: false,
      decision: "no_store",
      duplicate: false
    };
  }

  if (!shouldRecordDedupe(result)) {
    return {
      recorded: false,
      decision: "not_recordable",
      duplicate: false
    };
  }

  const record = buildDedupeRecord(result, { now, leaseMs });
  const stored = await store.record(record, { now });
  return {
    recorded: !stored.duplicate,
    duplicate: stored.duplicate,
    decision: stored.decision,
    documentId: record.documentId,
    receiptKey: record.receiptKey,
    logicalDedupeKey: record.logicalDedupeKey,
    state: stored.record && stored.record.state || record.state,
    record: stored.record
  };
}

function runSelfTest() {
  const now = new Date("2026-05-16T18:30:00.000Z");
  const fakeResult = {
    status: 202,
    body: {
      ok: true,
      accepted: true,
      action: "verified_mapped_dry_run",
      billingUpdateApplied: false
    },
    internal: {
      verification: {
        event: "ORDER_PAYMENT_FAILED",
        orderId: "order_TEST",
        merchantOrderExtRef: "ROQ-RCS-TEST-REVOLUT-WEBHOOK",
        signatureMatched: true,
        timestampAccepted: true,
        requestTimestamp: "1778955702535"
      },
      mapping: {
        mapped: true,
        event: "ORDER_PAYMENT_FAILED",
        orderId: "order_TEST",
        applicationId: "ROQ-RCS-TEST-REVOLUT-WEBHOOK",
        classification: "payment_order",
        operatorBillingArgs: {
          billingStatus: "registration_fee_failed",
          paymentStatus: "failed",
          refundStatus: "not_required"
        }
      }
    }
  };

  const store = new InMemoryDedupeStore();
  const first = buildDedupeRecord(fakeResult, { now });
  const create = store.record(first, { now });
  const duplicate = store.record(first, { now });
  const invalidResult = {
    ...fakeResult,
    status: 401,
    internal: {
      verification: {
        ...fakeResult.internal.verification,
        signatureMatched: false
      }
    }
  };
  const notRecordable = recordDedupeResult(invalidResult, { store, now });
  const unmappedResult = {
    ...fakeResult,
    body: {
      ...fakeResult.body,
      action: "unmapped_event"
    },
    internal: {
      verification: {
        ...fakeResult.internal.verification,
        event: "ORDER_TEST_UNKNOWN"
      },
      mapping: {
        mapped: false,
        event: "ORDER_TEST_UNKNOWN",
        orderId: "order_TEST",
        applicationId: "ROQ-RCS-TEST-REVOLUT-WEBHOOK"
      }
    }
  };
  const ignored = buildDedupeRecord(unmappedResult, { now });
  const unresolved = buildDedupeRecord({
    ...fakeResult,
    internal: {
      ...fakeResult.internal,
      verification: {
        ...fakeResult.internal.verification,
        merchantOrderExtRef: ""
      },
      mapping: {
        ...fakeResult.internal.mapping,
        applicationId: ""
      }
    }
  }, { now });

  const passed = first.receiptKey === "revolut:ORDER_PAYMENT_FAILED:order_TEST"
    && first.logicalDedupeKey === "revolut:ORDER_PAYMENT_FAILED:order_TEST:ROQ-RCS-TEST-REVOLUT-WEBHOOK"
    && unresolved.documentId === first.documentId
    && unresolved.logicalDedupeKey === "revolut:ORDER_PAYMENT_FAILED:order_TEST:unresolved"
    && ignored.state === "ignored";

  return Promise.all([create, duplicate, notRecordable]).then(([created, duplicated, skipped]) => ({
    ok: passed
      && created.decision === "create"
      && created.duplicate === false
      && duplicated.decision === "duplicate_terminal"
      && duplicated.duplicate === true
      && skipped.decision === "not_recordable",
    mode: "self_test",
    cases: {
      first,
      unresolved,
      ignored,
      created,
      duplicated,
      skipped
    },
    note: "Self-test uses fake records and an in-memory store only. It does not call Firestore, Revolut, Apps Script, or Google Sheets."
  }));
}

export {
  COLLECTION_NAME,
  DEFAULT_LEASE_MS,
  FirestoreDedupeStore,
  InMemoryDedupeStore,
  buildDedupeRecord,
  buildDocumentId,
  buildLogicalDedupeKey,
  buildReceiptKey,
  decideExistingRecord,
  recordDedupeResult,
  runSelfTest,
  sanitiseErrorMessage,
  shouldRecordDedupe
};

async function main() {
  if (process.argv.includes("--self-test")) {
    const result = await runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  console.log("Usage: node rcs-registration/cloud-run/revolut-webhook/dedupe.mjs --self-test");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
