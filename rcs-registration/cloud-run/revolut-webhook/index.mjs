#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { computeSignature } from "../../tools/revolut-webhook-verify.mjs";
import { handleRevolutWebhook } from "../../tools/revolut-webhook-handler.mjs";
import {
  FirestoreDedupeStore,
  InMemoryDedupeStore,
  recordDedupeResult
} from "./dedupe.mjs";
import {
  DEFAULT_API_BASE_URL,
  DEFAULT_API_VERSION,
  enrichRevolutOrder
} from "./enrich.mjs";

const SIGNING_SECRET_ENV = "REVOLUT_WEBHOOK_SIGNING_SECRET";
const MERCHANT_API_SECRET_ENV = "REVOLUT_MERCHANT_API_SECRET";
const MERCHANT_API_BASE_URL_ENV = "REVOLUT_MERCHANT_API_BASE_URL";
const REVOLUT_API_VERSION_ENV = "REVOLUT_API_VERSION";
const SAMPLE_SECRET = "wsk_TEST_DO_NOT_USE_IN_PRODUCTION";
const SAMPLE_MERCHANT_SECRET = "sk_test_DO_NOT_USE_IN_PRODUCTION";
const SAMPLE_PAYLOAD = "{\"event\":\"ORDER_PAYMENT_FAILED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_COMPLETED_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"order_completed_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_REFUND_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"refund_order_TEST\"}";
let runtimeDedupeStorePromise = null;

function getRawBody(req) {
  if (typeof req.rawBody === "string" || Buffer.isBuffer(req.rawBody)) return req.rawBody;
  return null;
}

function sendJson(res, status, body) {
  res.status(status);
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}

function buildRecordOnlyLog(result) {
  const verification = result.internal && result.internal.verification || {};
  const mapping = result.internal && result.internal.mapping || {};
  const operatorBillingArgs = mapping.operatorBillingArgs || {};
  const isCompletionEvent = (verification.event || mapping.event || "") === "ORDER_COMPLETED";

  return {
    component: "roq-rcs-revolut-webhook",
    mode: "record_only",
    status: result.status,
    action: result.body && result.body.action || result.body && result.body.reason || "",
    accepted: Boolean(result.body && result.body.accepted),
    event: verification.event || mapping.event || "",
    orderId: verification.orderId || mapping.orderId || "",
    applicationId: mapping.applicationId || verification.merchantOrderExtRef || "",
    mapped: Boolean(mapping.mapped),
    enrichmentRequired: Boolean(mapping.enrichmentRequired),
    billingUpdateApplied: Boolean(result.body && result.body.billingUpdateApplied),
    billingStatus: isCompletionEvent ? "" : operatorBillingArgs.billingStatus || "",
    paymentStatus: isCompletionEvent ? "" : operatorBillingArgs.paymentStatus || "",
    refundStatus: isCompletionEvent ? "" : operatorBillingArgs.refundStatus || "",
    provisionalBillingStatus: isCompletionEvent ? operatorBillingArgs.billingStatus || "" : "",
    provisionalPaymentStatus: isCompletionEvent ? operatorBillingArgs.paymentStatus || "" : "",
    provisionalRefundStatus: isCompletionEvent ? operatorBillingArgs.refundStatus || "" : "",
    timestampAccepted: Boolean(verification.timestampAccepted),
    signatureMatched: Boolean(verification.signatureMatched)
  };
}

function buildRejectionLog({
  status,
  reason,
  method = "",
  error = ""
}) {
  return {
    component: "roq-rcs-revolut-webhook",
    mode: "record_only",
    status,
    action: reason,
    accepted: false,
    method,
    mapped: false,
    enrichmentRequired: false,
    billingUpdateApplied: false,
    timestampAccepted: false,
    signatureMatched: false,
    dedupeDecision: "not_attempted",
    dedupeRecorded: false,
    dedupeDuplicate: false,
    receiptKey: "",
    dedupeDocumentId: "",
    dedupeState: "",
    error
  };
}

function sanitiseErrorForLog(error) {
  return String(error && error.message || error || "").replace(/[{}[\]"']/g, "").slice(0, 240);
}

async function getRuntimeDedupeStore() {
  if (!runtimeDedupeStorePromise) {
    runtimeDedupeStorePromise = FirestoreDedupeStore.fromDefault();
  }

  try {
    return await runtimeDedupeStorePromise;
  } catch (error) {
    runtimeDedupeStorePromise = null;
    throw error;
  }
}

function isRecordableForDedupe(result) {
  const verification = result.internal && result.internal.verification || {};
  return result.status === 202
    && verification.signatureMatched === true
    && verification.timestampAccepted === true
    && Boolean(verification.event)
    && Boolean(verification.orderId);
}

async function resolveDedupeStore(result, {
  dedupeStore = null,
  dedupeStoreFactory = null
} = {}) {
  if (dedupeStore) return dedupeStore;
  if (!dedupeStoreFactory || !isRecordableForDedupe(result)) return null;
  return dedupeStoreFactory();
}

function shouldAttemptRecordOnlyEnrichment(result, dedupe) {
  const verification = result.internal && result.internal.verification || {};
  return result.status === 202
    && verification.signatureMatched === true
    && verification.timestampAccepted === true
    && verification.event === "ORDER_COMPLETED"
    && Boolean(verification.orderId)
    && !dedupe.duplicate;
}

function buildSkippedEnrichment(reason = "not_required") {
  return {
    attempted: false,
    ok: false,
    reason,
    classification: "",
    ledgerLookupOrderId: "",
    requiresPaymentOrderLookup: false,
    warnings: [],
    orderType: "",
    orderState: "",
    relatedOrderId: ""
  };
}

async function runRecordOnlyEnrichment(result, dedupe, {
  env = process.env,
  fetchImpl = globalThis.fetch
} = {}) {
  const verification = result.internal && result.internal.verification || {};
  if (!shouldAttemptRecordOnlyEnrichment(result, dedupe)) {
    return buildSkippedEnrichment(verification.event === "ORDER_COMPLETED" && dedupe.duplicate
      ? "duplicate"
      : "not_required");
  }

  const merchantApiSecret = env[MERCHANT_API_SECRET_ENV] || "";
  if (!merchantApiSecret) return buildSkippedEnrichment("missing_merchant_api_secret");

  try {
    const enrichment = await enrichRevolutOrder(verification.orderId, {
      fetchImpl,
      merchantApiSecret,
      apiBaseUrl: env[MERCHANT_API_BASE_URL_ENV] || DEFAULT_API_BASE_URL,
      apiVersion: env[REVOLUT_API_VERSION_ENV] || DEFAULT_API_VERSION
    });
    return {
      attempted: true,
      ok: true,
      reason: "",
      classification: enrichment.classification || "",
      ledgerLookupOrderId: enrichment.ledgerLookupOrderId || "",
      requiresPaymentOrderLookup: Boolean(enrichment.requiresPaymentOrderLookup),
      warnings: enrichment.warnings || [],
      orderType: enrichment.order && enrichment.order.normalisedType || "",
      orderState: enrichment.order && enrichment.order.state || "",
      relatedOrderId: enrichment.order && enrichment.order.relatedOrderId || ""
    };
  } catch (error) {
    return {
      ...buildSkippedEnrichment("enrichment_failed"),
      attempted: true,
      error: String(error.message || error).replace(/[{}[\]"']/g, "").slice(0, 240)
    };
  }
}

async function handleHttpRequest(req, {
  env = process.env,
  logger = console,
  dedupeStore = null,
  dedupeStoreFactory = null,
  fetchImpl = globalThis.fetch
} = {}) {
  if (req.method !== "POST") {
    logger.info(JSON.stringify(buildRejectionLog({
      status: 405,
      reason: "method_not_allowed",
      method: req.method || ""
    })));
    return {
      status: 405,
      body: {
        ok: false,
        accepted: false,
        reason: "method_not_allowed"
      }
    };
  }

  const rawBody = getRawBody(req);
  if (rawBody === null) {
    logger.info(JSON.stringify(buildRejectionLog({
      status: 500,
      reason: "raw_body_unavailable",
      method: req.method || ""
    })));
    return {
      status: 500,
      body: {
        ok: false,
        accepted: false,
        reason: "raw_body_unavailable"
      }
    };
  }

  const result = handleRevolutWebhook({
    rawBody,
    headers: req.headers || {},
    signingSecret: env[SIGNING_SECRET_ENV] || ""
  });
  let activeDedupeStore = null;
  try {
    activeDedupeStore = await resolveDedupeStore(result, {
      dedupeStore,
      dedupeStoreFactory
    });
  } catch (error) {
    logger.info(JSON.stringify({
      ...buildRecordOnlyLog(result),
      status: 500,
      action: "dedupe_store_unavailable",
      accepted: false,
      dedupeDecision: "not_attempted",
      dedupeRecorded: false,
      dedupeDuplicate: false,
      receiptKey: "",
      dedupeDocumentId: "",
      dedupeState: "",
      enrichmentAttempted: false,
      enrichmentOk: false,
      enrichmentSkippedReason: "dedupe_store_unavailable",
      enrichmentClassification: "",
      enrichmentLedgerLookupOrderId: "",
      enrichmentRequiresPaymentOrderLookup: false,
      enrichmentWarnings: [],
      enrichedOrderType: "",
      enrichedOrderState: "",
      enrichedRelatedOrderId: "",
      enrichmentError: "",
      error: sanitiseErrorForLog(error)
    }));
    return {
      status: 500,
      body: {
        ok: false,
        accepted: false,
        reason: "dedupe_store_unavailable"
      }
    };
  }
  const dedupe = await recordDedupeResult(result, {
    store: activeDedupeStore
  });
  const enrichment = await runRecordOnlyEnrichment(result, dedupe, {
    env,
    fetchImpl
  });

  logger.info(JSON.stringify({
    ...buildRecordOnlyLog(result),
    dedupeDecision: dedupe.decision,
    dedupeRecorded: Boolean(dedupe.recorded),
    dedupeDuplicate: Boolean(dedupe.duplicate),
    receiptKey: dedupe.receiptKey || "",
    dedupeDocumentId: dedupe.documentId || "",
    dedupeState: dedupe.state || "",
    enrichmentAttempted: Boolean(enrichment.attempted),
    enrichmentOk: Boolean(enrichment.ok),
    enrichmentSkippedReason: enrichment.reason || "",
    enrichmentClassification: enrichment.classification || "",
    enrichmentLedgerLookupOrderId: enrichment.ledgerLookupOrderId || "",
    enrichmentRequiresPaymentOrderLookup: Boolean(enrichment.requiresPaymentOrderLookup),
    enrichmentWarnings: enrichment.warnings || [],
    enrichedOrderType: enrichment.orderType || "",
    enrichedOrderState: enrichment.orderState || "",
    enrichedRelatedOrderId: enrichment.relatedOrderId || "",
    enrichmentError: enrichment.error || ""
  }));
  return {
    status: result.status,
    body: result.body
  };
}

async function revolutWebhook(req, res) {
  const result = await handleHttpRequest(req, {
    dedupeStoreFactory: getRuntimeDedupeStore
  });
  sendJson(res, result.status, result.body);
}

function signedHeaders(payload, timestamp = String(Date.now())) {
  return {
    "revolut-request-timestamp": timestamp,
    "revolut-signature": computeSignature({
      secret: SAMPLE_SECRET,
      timestamp,
      payload
    })
  };
}

async function runSelfTest() {
  const logs = [];
  const enrichmentCalls = [];
  const dedupeStore = new InMemoryDedupeStore();
  let dedupeStoreFactoryCalls = 0;
  let failingDedupeStoreFactoryCalls = 0;
  const dedupeStoreFactory = async () => {
    dedupeStoreFactoryCalls += 1;
    return dedupeStore;
  };
  const failingDedupeStoreFactory = async () => {
    failingDedupeStoreFactoryCalls += 1;
    throw new Error("fake Firestore dedupe store unavailable");
  };
  const logger = {
    info(message) {
      logs.push(JSON.parse(message));
    }
  };
  const fetchImpl = async (url, options) => {
    enrichmentCalls.push({
      url,
      method: options.method,
      authorizationPresent: Boolean(options.headers.Authorization)
    });
    const isRefund = url.endsWith("/orders/refund_order_TEST");
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify(isRefund ? {
          id: "refund_order_TEST",
          type: "refund",
          state: "completed",
          related_order_id: "order_completed_TEST",
          payments: [
            {
              id: "refund_payment_TEST",
              state: "completed"
            }
          ]
        } : {
          id: "order_completed_TEST",
          type: "payment",
          state: "completed",
          merchant_order_data: {
            reference: "ROQ-RCS-TEST-REVOLUT-WEBHOOK"
          },
          merchant_order_ext_ref: "ROQ-RCS-TEST-REVOLUT-WEBHOOK",
          payments: [
            {
              id: "payment_TEST",
              state: "captured"
            }
          ]
        });
      }
    };
  };

  const valid = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    dedupeStore,
    logger
  });
  const duplicate = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    dedupeStore,
    logger
  });
  const completedPayment = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_COMPLETED_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_COMPLETED_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET,
      [MERCHANT_API_SECRET_ENV]: SAMPLE_MERCHANT_SECRET
    },
    dedupeStoreFactory,
    fetchImpl,
    logger
  });
  const completedPaymentDuplicate = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_COMPLETED_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_COMPLETED_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET,
      [MERCHANT_API_SECRET_ENV]: SAMPLE_MERCHANT_SECRET
    },
    dedupeStoreFactory,
    fetchImpl,
    logger
  });
  const refundCompleted = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_REFUND_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_REFUND_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET,
      [MERCHANT_API_SECRET_ENV]: SAMPLE_MERCHANT_SECRET
    },
    dedupeStore,
    fetchImpl,
    logger
  });

  const missingRawBody = await handleHttpRequest({
    method: "POST",
    body: JSON.parse(SAMPLE_PAYLOAD),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    logger
  });

  const wrongMethod = await handleHttpRequest({
    method: "GET",
    rawBody: Buffer.from("", "utf8"),
    headers: {}
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    logger
  });

  const dedupeStoreUnavailable = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_COMPLETED_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_COMPLETED_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET,
      [MERCHANT_API_SECRET_ENV]: SAMPLE_MERCHANT_SECRET
    },
    dedupeStoreFactory: failingDedupeStoreFactory,
    fetchImpl,
    logger
  });

  const missingSecret = await handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {},
    dedupeStore,
    logger
  });

  const passed = valid.status === 202
    && valid.body.action === "verified_mapped_dry_run"
    && valid.body.billingUpdateApplied === false
    && duplicate.status === 202
    && duplicate.body.action === "verified_mapped_dry_run"
    && completedPayment.status === 202
    && completedPayment.body.action === "verified_mapped_dry_run"
    && completedPaymentDuplicate.status === 202
    && refundCompleted.status === 202
    && refundCompleted.body.action === "enrichment_required"
    && missingRawBody.status === 500
    && missingRawBody.body.reason === "raw_body_unavailable"
    && wrongMethod.status === 405
    && wrongMethod.body.reason === "method_not_allowed"
    && dedupeStoreUnavailable.status === 500
    && dedupeStoreUnavailable.body.reason === "dedupe_store_unavailable"
    && missingSecret.status === 500
    && missingSecret.body.reason === "missing_signing_secret"
    && logs.length === 9
    && logs[0].event === "ORDER_PAYMENT_FAILED"
    && logs[0].paymentStatus === "failed"
    && logs[0].dedupeDecision === "create"
    && logs[1].dedupeDecision === "duplicate_terminal"
    && logs[2].event === "ORDER_COMPLETED"
    && logs[2].dedupeState === "enrichment_required"
    && logs[2].billingStatus === ""
    && logs[2].provisionalBillingStatus === "registration_fee_paid"
    && logs[2].paymentStatus === ""
    && logs[2].provisionalPaymentStatus === "paid"
    && logs[2].enrichmentAttempted === true
    && logs[2].enrichmentClassification === "payment_order"
    && logs[2].enrichmentLedgerLookupOrderId === "order_completed_TEST"
    && logs[3].dedupeDecision === "duplicate_terminal"
    && logs[3].enrichmentAttempted === false
    && logs[3].enrichmentSkippedReason === "duplicate"
    && logs[4].action === "enrichment_required"
    && logs[4].enrichmentAttempted === true
    && logs[4].enrichmentClassification === "refund_order"
    && logs[4].enrichmentLedgerLookupOrderId === "order_completed_TEST"
    && logs[5].action === "raw_body_unavailable"
    && logs[5].dedupeDecision === "not_attempted"
    && logs[6].action === "method_not_allowed"
    && logs[6].dedupeDecision === "not_attempted"
    && logs[7].action === "dedupe_store_unavailable"
    && logs[7].event === "ORDER_COMPLETED"
    && logs[7].signatureMatched === true
    && logs[7].enrichmentAttempted === false
    && logs[7].dedupeDecision === "not_attempted"
    && logs[7].error === "fake Firestore dedupe store unavailable"
    && logs[8].action === "missing_signing_secret"
    && logs[8].dedupeDecision === "not_recordable"
    && dedupeStoreFactoryCalls === 2
    && failingDedupeStoreFactoryCalls === 1
    && enrichmentCalls.length === 2
    && !Object.prototype.hasOwnProperty.call(logs[0], "rawBody")
    && !Object.prototype.hasOwnProperty.call(logs[0], "signature")
    && !Object.prototype.hasOwnProperty.call(logs[5], "rawBody")
    && !Object.prototype.hasOwnProperty.call(logs[5], "signature")
    && !JSON.stringify({ logs, enrichmentCalls }).includes(SAMPLE_MERCHANT_SECRET);

  return {
    ok: passed,
    mode: "self_test",
    cases: {
      valid,
      duplicate,
      completedPayment,
      completedPaymentDuplicate,
      refundCompleted,
      missingRawBody,
      wrongMethod,
      dedupeStoreUnavailable,
      missingSecret
    },
    logs,
    enrichmentCalls,
    dedupeStoreFactoryCalls,
    failingDedupeStoreFactoryCalls,
    note: "Self-test uses fake payloads, fake secrets, and an injected fake fetch only. It does not call Revolut, Firestore, Apps Script, or Google Sheets."
  };
}

async function main() {
  if (process.argv.includes("--self-test")) {
    const result = await runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  console.log("Usage: npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test");
}

export {
  buildRecordOnlyLog,
  buildRejectionLog,
  getRuntimeDedupeStore,
  handleHttpRequest,
  runRecordOnlyEnrichment,
  revolutWebhook,
  runSelfTest
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
