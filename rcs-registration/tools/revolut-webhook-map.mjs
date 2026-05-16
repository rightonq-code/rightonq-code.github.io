#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";

const SAMPLE_COMPLETED_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_DECLINED_PAYLOAD = "{\"event\":\"ORDER_PAYMENT_DECLINED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_REFUND_COMPLETED_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"refund_order_TEST\"}";
const SAMPLE_REFUND_ORDER = {
  id: "refund_order_TEST",
  type: "REFUND",
  state: "PROCESSING",
  payments: [
    {
      id: "refund_payment_TEST",
      state: "COMPLETED"
    }
  ]
};

const BOOLEAN_FLAGS = {
  "self-test": "selfTest"
};

const VALUE_FLAGS = {
  "payload": "payload",
  "payload-file": "payloadFile",
  "enriched-order": "enrichedOrder",
  "enriched-order-file": "enrichedOrderFile",
  "application-id": "applicationId",
  "request-timestamp": "requestTimestamp",
  "received-at": "receivedAt"
};

const EVENT_MAP = {
  ORDER_COMPLETED: {
    billingStatus: "registration_fee_paid",
    paymentStatus: "paid",
    note: "Revolut reported ORDER_COMPLETED."
  },
  ORDER_AUTHORISED: {
    billingStatus: "registration_fee_pending",
    paymentStatus: "authorised",
    note: "Revolut reported ORDER_AUTHORISED. Do not mark registration fee paid until ORDER_COMPLETED is received."
  },
  ORDER_CANCELLED: {
    billingStatus: "registration_fee_cancelled",
    paymentStatus: "cancelled",
    note: "Revolut reported ORDER_CANCELLED."
  },
  ORDER_FAILED: {
    billingStatus: "registration_fee_failed",
    paymentStatus: "failed",
    note: "Revolut reported ORDER_FAILED."
  },
  ORDER_PAYMENT_DECLINED: {
    billingStatus: "registration_fee_failed",
    paymentStatus: "declined",
    note: "Revolut reported ORDER_PAYMENT_DECLINED."
  },
  ORDER_PAYMENT_FAILED: {
    billingStatus: "registration_fee_failed",
    paymentStatus: "failed",
    note: "Revolut reported ORDER_PAYMENT_FAILED."
  },
  ORDER_PAYMENT_AUTHENTICATION_CHALLENGED: {
    billingStatus: "registration_fee_pending",
    paymentStatus: "authentication_challenged",
    note: "Revolut reported ORDER_PAYMENT_AUTHENTICATION_CHALLENGED."
  },
  ORDER_PAYMENT_AUTHENTICATED: {
    billingStatus: "registration_fee_pending",
    paymentStatus: "authenticated",
    note: "Revolut reported ORDER_PAYMENT_AUTHENTICATED."
  }
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/revolut-webhook-map.mjs --self-test",
    "  node rcs-registration/tools/revolut-webhook-map.mjs --payload-file webhook.json --request-timestamp 1683650202360",
    "  node rcs-registration/tools/revolut-webhook-map.mjs --payload-file webhook.json --enriched-order-file order.json --application-id ROQ-RCS-...",
    "",
    "Options:",
    "  --self-test                    Run local fake-data mapping proofs",
    "  --payload '{...}'              Debug only; raw Revolut webhook payload",
    "  --payload-file webhook.json    Preferred for captured webhook payloads",
    "  --enriched-order '{...}'       Debug only; retrieved Revolut order JSON",
    "  --enriched-order-file order.json",
    "  --application-id ROQ-RCS-...   Required to map refund-order events after enrichment",
    "  --request-timestamp 168...     Revolut-Request-Timestamp header, used for paymentReceivedAt when relevant",
    "  --received-at 2026-05-15T...   Explicit received timestamp override",
    "",
    "Safety:",
    "  Run this only after signature verification has passed.",
    "  This tool performs no network calls and does not update the Sheet.",
    "  It prints a proposed operator-billing dry-run command only."
  ].join("\n");
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }
    if (!token.startsWith("--")) throw new Error("Unexpected argument: " + token);

    const rawName = token.slice(2);
    if (Object.prototype.hasOwnProperty.call(BOOLEAN_FLAGS, rawName)) {
      options[BOOLEAN_FLAGS[rawName]] = true;
      continue;
    }

    const fieldName = VALUE_FLAGS[rawName];
    if (!fieldName) throw new Error("Unknown option: " + token);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
    options[fieldName] = value;
    index += 1;
  }
  return options;
}

function readPayload(options) {
  if (options.payload && options.payloadFile) {
    throw new Error("Use either --payload or --payload-file, not both");
  }
  if (options.payloadFile) return fs.readFileSync(options.payloadFile, "utf8");
  if (options.payload) return options.payload;
  throw new Error("Provide --payload or --payload-file");
}

function readEnrichedOrder(options) {
  if (options.enrichedOrder && options.enrichedOrderFile) {
    throw new Error("Use either --enriched-order or --enriched-order-file, not both");
  }
  const rawOrder = options.enrichedOrderFile
    ? fs.readFileSync(options.enrichedOrderFile, "utf8")
    : options.enrichedOrder || "";
  if (!rawOrder) return null;
  try {
    const parsed = JSON.parse(rawOrder);
    return parsed.order || parsed.refund || parsed;
  } catch (error) {
    throw new Error("Enriched order is not valid JSON: " + error.message);
  }
}

function parsePayload(rawPayload) {
  try {
    return JSON.parse(rawPayload);
  } catch (error) {
    throw new Error("Webhook payload is not valid JSON: " + error.message);
  }
}

function timestampToIso(timestamp) {
  if (!timestamp) return "";
  if (!/^\d+$/.test(String(timestamp))) return "";
  const numeric = Number(timestamp);
  if (!Number.isSafeInteger(numeric)) return "";
  return new Date(numeric).toISOString();
}

function shellQuote(value) {
  const stringValue = String(value);
  if (/^[A-Za-z0-9_./:@+=-]+$/.test(stringValue)) return stringValue;
  return "'" + stringValue.replace(/'/g, "'\"'\"'") + "'";
}

function getPayloadValue(payload, fieldName) {
  const data = payload.data && typeof payload.data === "object" ? payload.data : {};
  return payload[fieldName] || data[fieldName] || "";
}

function buildEnrichmentRequiredResult(payload, reason) {
  const event = payload.event || "";
  const orderId = getPayloadValue(payload, "order_id");
  const applicationId = getPayloadValue(payload, "merchant_order_ext_ref");
  return {
    ok: true,
    mapped: false,
    enrichmentRequired: true,
    event,
    applicationId,
    orderId,
    reason,
    nextAction: "Retrieve the Revolut order by order_id before applying any Billing update. If the order type is REFUND, route through the refund lifecycle using the original/related order, not as a paid registration-fee event."
  };
}

function normaliseOrderType(order) {
  return String(order && order.type || "").trim().toLowerCase();
}

function firstPayment(order) {
  return order && Array.isArray(order.payments) && order.payments.length ? order.payments[0] : {};
}

function buildRefundBillingArgs(payload, options) {
  const order = options.enrichedOrder || {};
  const applicationId = options.applicationId || "";
  if (!applicationId) {
    return buildEnrichmentRequiredResult(payload, "Enriched order is a refund, but no application ID was supplied or found in the ledger.");
  }

  const refundPayment = firstPayment(order);
  const refundOrderId = order.id || getPayloadValue(payload, "order_id");
  const refundPaymentId = refundPayment.id || "";
  const receivedAt = payload.paymentReceivedAt || "";
  const completed = payload.event === "ORDER_COMPLETED";
  const noteParts = [
    "Revolut reported " + (payload.event || "an event") + " for refund order",
    refundOrderId + "."
  ];
  if (refundPaymentId) noteParts.push("Refund payment ID: " + refundPaymentId + ".");

  return {
    applicationId,
    paymentProvider: "revolut",
    paymentStatus: completed ? "refunded" : "refund_processing",
    refundStatus: completed ? "refunded" : "processing",
    refundProcessedAt: completed ? receivedAt : "",
    internalNotes: noteParts.join(" ")
  };
}

function buildOperatorBillingArgs(payload, options = {}) {
  const event = payload.event || "";
  const mapping = EVENT_MAP[event];
  if (!mapping) return null;

  if (normaliseOrderType(options.enrichedOrder) === "refund") {
    return buildRefundBillingArgs(payload, options);
  }

  const applicationId = getPayloadValue(payload, "merchant_order_ext_ref");
  const orderId = getPayloadValue(payload, "order_id");
  const paymentId = getPayloadValue(payload, "payment_id");
  if (!applicationId) {
    return buildEnrichmentRequiredResult(payload, "Webhook payload is missing merchant_order_ext_ref; cannot route directly to an application ID.");
  }
  if (!orderId) {
    return buildEnrichmentRequiredResult(payload, "Webhook payload is missing order_id; cannot record a Revolut order ID.");
  }

  return {
    applicationId,
    billingStatus: mapping.billingStatus,
    paymentProvider: "revolut",
    checkoutOrderId: orderId,
    paymentId,
    paymentStatus: mapping.paymentStatus,
    paymentReceivedAt: mapping.paymentStatus === "paid" ? payload.paymentReceivedAt || "" : "",
    refundStatus: "not_required",
    internalNotes: mapping.note
  };
}

function buildDryRunCommand(args) {
  const parts = [
    "node",
    "rcs-registration/tools/operator-billing.mjs",
    "--dry-run",
    "--application-id", args.applicationId
  ];
  [
    ["--billing-status", args.billingStatus],
    ["--payment-provider", args.paymentProvider],
    ["--checkout-order-id", args.checkoutOrderId],
    ["--payment-status", args.paymentStatus],
    ["--refund-status", args.refundStatus],
    ["--refund-processed-at", args.refundProcessedAt],
    ["--internal-notes", args.internalNotes]
  ].forEach(function(pair) {
    if (pair[1]) parts.push(pair[0], pair[1]);
  });
  [
    ["--payment-id", args.paymentId],
    ["--payment-received-at", args.paymentReceivedAt],
    ["--refund-amount-gbp", args.refundAmountGbp],
    ["--refund-reason", args.refundReason]
  ].forEach(function(pair) {
    if (pair[1]) parts.push(pair[0], pair[1]);
  });
  return parts.map(shellQuote).join(" ");
}

function mapWebhookPayload(rawPayload, options = {}) {
  const payload = parsePayload(rawPayload);
  const receivedAt = options.receivedAt || timestampToIso(options.requestTimestamp);
  if (receivedAt) payload.paymentReceivedAt = receivedAt;
  const operatorBillingArgs = buildOperatorBillingArgs(payload, options);
  const event = payload.event || "";
  const warnings = [];

  if (!operatorBillingArgs) {
    return {
      ok: true,
      mapped: false,
      event,
      applicationId: payload.merchant_order_ext_ref || "",
      orderId: payload.order_id || payload.data && payload.data.order_id || "",
      reason: "No billing mapping is defined for this Revolut event yet."
    };
  }

  if (operatorBillingArgs.mapped === false && operatorBillingArgs.enrichmentRequired) {
    return operatorBillingArgs;
  }

  if (!operatorBillingArgs.applicationId.startsWith("ROQ-RCS-")) {
    warnings.push("merchant_order_ext_ref does not look like a RightOnQ application ID; review before applying any billing update.");
  }

  return {
    ok: true,
    mapped: true,
    event,
    applicationId: operatorBillingArgs.applicationId,
    orderId: operatorBillingArgs.checkoutOrderId || getPayloadValue(payload, "order_id"),
    classification: normaliseOrderType(options.enrichedOrder) === "refund" ? "refund_order" : "payment_order",
    dedupeKey: [
      "revolut",
      event,
      operatorBillingArgs.checkoutOrderId || getPayloadValue(payload, "order_id"),
      operatorBillingArgs.applicationId
    ].join(":"),
    warnings,
    operatorBillingArgs,
    operatorBillingDryRunCommand: buildDryRunCommand(operatorBillingArgs)
  };
}

function runSelfTest() {
  const completed = mapWebhookPayload(SAMPLE_COMPLETED_PAYLOAD, {
    requestTimestamp: String(Date.now())
  });
  const declined = mapWebhookPayload(SAMPLE_DECLINED_PAYLOAD, {
    requestTimestamp: String(Date.now())
  });
  const refundCompleted = mapWebhookPayload(SAMPLE_REFUND_COMPLETED_PAYLOAD, {
    requestTimestamp: String(Date.now())
  });
  const refundCompletedEnriched = mapWebhookPayload(SAMPLE_REFUND_COMPLETED_PAYLOAD, {
    requestTimestamp: String(Date.now()),
    enrichedOrder: SAMPLE_REFUND_ORDER,
    applicationId: "ROQ-RCS-TEST-REVOLUT-WEBHOOK"
  });
  const passed = completed.mapped
    && completed.operatorBillingArgs.billingStatus === "registration_fee_paid"
    && completed.operatorBillingArgs.paymentStatus === "paid"
    && declined.mapped
    && declined.operatorBillingArgs.billingStatus === "registration_fee_failed"
    && declined.operatorBillingArgs.paymentStatus === "declined"
    && refundCompleted.mapped === false
    && refundCompleted.enrichmentRequired === true
    && refundCompletedEnriched.mapped
    && refundCompletedEnriched.classification === "refund_order"
    && refundCompletedEnriched.operatorBillingArgs.refundStatus === "refunded";

  return {
    ok: passed,
    mode: "self_test",
    cases: {
      completed,
      declined,
      refundCompleted,
      refundCompletedEnriched
    },
    note: "Self-test uses fake sample payloads only. No network calls or Sheet updates are made."
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  if (options.selfTest) {
    const result = runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  const result = mapWebhookPayload(readPayload(options), {
    ...options,
    enrichedOrder: readEnrichedOrder(options)
  });
  console.log(JSON.stringify(result, null, 2));
}

export {
  EVENT_MAP,
  timestampToIso,
  buildEnrichmentRequiredResult,
  buildOperatorBillingArgs,
  buildDryRunCommand,
  mapWebhookPayload,
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
