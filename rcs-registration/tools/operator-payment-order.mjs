#!/usr/bin/env node

import { runOperatorAction } from "./operator-api-client.mjs";

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "revolut-order-id": "revolutOrderId",
  "checkout-order-id": "checkoutOrderId",
  "order-state": "orderState",
  "amount-minor": "amountMinor",
  "currency": "currency",
  "checkout-url": "checkoutUrl",
  "merchant-order-reference": "merchantOrderReference",
  "reference": "reference",
  "idempotency-key": "idempotencyKey",
  "payment-id": "paymentId",
  "payment-state": "paymentState",
  "order-purpose": "orderPurpose",
  "superseded": "superseded",
  "internal-notes": "internalNotes",
  "operator-name": "operatorName",
  "changed-by": "changedBy"
};

const BOOLEAN_FLAGS = {
  "check-active": "checkActive",
  "record": "record",
  "dry-run": "dryRun"
};

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-payment-order.mjs --check-active --application-id ROQ-RCS-...",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-payment-order.mjs --record --application-id ROQ-RCS-... --revolut-order-id order_xxx --order-state pending --checkout-url https://...",
    "",
    "Common fields:",
    "  --check-active                         Read active checkout decision only",
    "  --record                               Append a Payment orders ledger snapshot",
    "  --application-id ROQ-RCS-...           Required",
    "  --revolut-order-id <id>",
    "  --order-state pending|authorised|completed|cancelled|failed",
    "  --amount-minor 12000",
    "  --currency GBP",
    "  --checkout-url https://...",
    "  --merchant-order-reference ROQ-RCS-...",
    "  --idempotency-key key",
    "  --payment-id <id>",
    "  --payment-state captured|paid|failed",
    "  --order-purpose registration_fee",
    "  --superseded yes|no",
    "  --internal-notes \"Operator note\"",
    "",
    "Safety:",
    "  This tool stores Revolut order/payment IDs, states, checkout URL/token, and operator notes only.",
    "  Do not store card details, API secrets, webhook signing secrets, or raw webhook payloads.",
    "  Use --dry-run to print the payload without sending it."
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

    const fieldName = FIELD_ALIASES[rawName];
    if (!fieldName) throw new Error("Unknown option: " + token);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
    options[fieldName] = value;
    index += 1;
  }
  return options;
}

function buildPayload(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");
  if (options.checkActive && options.record) throw new Error("Use either --check-active or --record, not both");
  if (!options.checkActive && !options.record) throw new Error("Use --check-active or --record");

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live payment-order action");
  }

  const payload = {
    action: options.checkActive ? "checkActiveCheckout" : "recordPaymentOrder",
    applicationId: options.applicationId
  };

  Object.keys(FIELD_ALIASES).forEach(function(rawName) {
    const fieldName = FIELD_ALIASES[rawName];
    if (fieldName === "applicationId") return;
    if (options[fieldName] !== undefined) payload[fieldName] = options[fieldName];
  });

  if (!options.dryRun) payload.operatorPin = operatorPin;
  return payload;
}

function sanitisePayload(payload) {
  const copy = { ...payload };
  if (copy.operatorPin) copy.operatorPin = "[redacted]";
  return copy;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const payload = buildPayload(options);
  if (options.dryRun) {
    console.log(JSON.stringify(sanitisePayload(payload), null, 2));
    return;
  }

  const result = await runOperatorAction(payload);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
