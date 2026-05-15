#!/usr/bin/env node

import fs from "node:fs";

const SAMPLE_COMPLETED_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_DECLINED_PAYLOAD = "{\"event\":\"ORDER_PAYMENT_DECLINED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";

const BOOLEAN_FLAGS = {
  "self-test": "selfTest"
};

const VALUE_FLAGS = {
  "payload": "payload",
  "payload-file": "payloadFile",
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
    "",
    "Options:",
    "  --self-test                    Run local fake-data mapping proofs",
    "  --payload '{...}'              Debug only; raw Revolut webhook payload",
    "  --payload-file webhook.json    Preferred for captured webhook payloads",
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

function buildOperatorBillingArgs(payload) {
  const event = payload.event || "";
  const mapping = EVENT_MAP[event];
  if (!mapping) return null;

  const data = payload.data && typeof payload.data === "object" ? payload.data : {};
  const applicationId = payload.merchant_order_ext_ref || data.merchant_order_ext_ref || "";
  const orderId = payload.order_id || data.order_id || "";
  const paymentId = payload.payment_id || data.payment_id || "";
  if (!applicationId) {
    throw new Error("Webhook payload is missing merchant_order_ext_ref; cannot route to an application ID");
  }
  if (!orderId) {
    throw new Error("Webhook payload is missing order_id; cannot record Revolut order ID");
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
    "--application-id", args.applicationId,
    "--billing-status", args.billingStatus,
    "--payment-provider", args.paymentProvider,
    "--checkout-order-id", args.checkoutOrderId,
    "--payment-status", args.paymentStatus,
    "--refund-status", args.refundStatus,
    "--internal-notes", args.internalNotes
  ];
  if (args.paymentId) {
    parts.push("--payment-id", args.paymentId);
  }
  if (args.paymentReceivedAt) {
    parts.push("--payment-received-at", args.paymentReceivedAt);
  }
  return parts.map(shellQuote).join(" ");
}

function mapWebhookPayload(rawPayload, options = {}) {
  const payload = parsePayload(rawPayload);
  const receivedAt = options.receivedAt || timestampToIso(options.requestTimestamp);
  if (receivedAt) payload.paymentReceivedAt = receivedAt;
  const operatorBillingArgs = buildOperatorBillingArgs(payload);
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

  if (!operatorBillingArgs.applicationId.startsWith("ROQ-RCS-")) {
    warnings.push("merchant_order_ext_ref does not look like a RightOnQ application ID; review before applying any billing update.");
  }

  return {
    ok: true,
    mapped: true,
    event,
    applicationId: operatorBillingArgs.applicationId,
    orderId: operatorBillingArgs.checkoutOrderId,
    dedupeKey: [
      "revolut",
      event,
      operatorBillingArgs.checkoutOrderId,
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
  const passed = completed.mapped
    && completed.operatorBillingArgs.billingStatus === "registration_fee_paid"
    && completed.operatorBillingArgs.paymentStatus === "paid"
    && declined.mapped
    && declined.operatorBillingArgs.billingStatus === "registration_fee_failed"
    && declined.operatorBillingArgs.paymentStatus === "declined";

  return {
    ok: passed,
    mode: "self_test",
    cases: {
      completed,
      declined
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

  const result = mapWebhookPayload(readPayload(options), options);
  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
