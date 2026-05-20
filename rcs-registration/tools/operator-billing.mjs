#!/usr/bin/env node

import { runOperatorAction } from "./operator-api-client.mjs";

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "client-id": "clientId",
  "billing-status": "billingStatus",
  "registration-fee-gbp": "registrationFeeGbp",
  "registration-fee-vat-treatment": "registrationFeeVatTreatment",
  "registration-fee-acknowledgement": "registrationFeeAcknowledgement",
  "payment-provider": "paymentProvider",
  "provider-customer-id": "providerCustomerId",
  "checkout-order-id": "checkoutOrderId",
  "payment-id": "paymentId",
  "payment-method-id": "paymentMethodId",
  "payment-status": "paymentStatus",
  "payment-received-at": "paymentReceivedAt",
  "refund-status": "refundStatus",
  "refund-reason": "refundReason",
  "refund-amount-gbp": "refundAmountGbp",
  "refund-processed-at": "refundProcessedAt",
  "monthly-plan": "monthlyPlan",
  "monthly-base-fee-gbp": "monthlyBaseFeeGbp",
  "monthly-billing-starts-at": "monthlyBillingStartsAt",
  "next-billing-cycle-date": "nextBillingCycleDate",
  "usage-top-up-status": "usageTopUpStatus",
  "usage-credit-balance-gbp": "usageCreditBalanceGbp",
  "top-up-threshold-gbp": "topUpThresholdGbp",
  "top-up-amount-gbp": "topUpAmountGbp",
  "auto-top-up-status": "autoTopUpStatus",
  "last-top-up-attempt-at": "lastTopUpAttemptAt",
  "last-top-up-status": "lastTopUpStatus",
  "last-payment-status": "lastPaymentStatus",
  "billing-pause-flag": "billingPauseFlag",
  "billing-pause-reason": "billingPauseReason",
  "internal-notes": "internalNotes",
  "operator-name": "operatorName",
  "changed-by": "changedBy"
};

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun"
};

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-billing.mjs --application-id ROQ-RCS-... --billing-status registration_fee_paid",
    "",
    "Common fields:",
    "  --application-id                         Required application ID",
    "  --billing-status registration_fee_pending",
    "  --billing-status registration_fee_paid",
    "  --payment-provider revolut",
    "  --checkout-order-id order_xxxxxxxxxxxxx",
    "  --payment-id pay_xxxxxxxxxxxxx",
    "  --payment-status paid",
    "  --payment-received-at 2026-05-15T13:45:00Z",
    "  --monthly-plan \"RightOnQ UK\"",
    "  --monthly-base-fee-gbp 25",
    "  --usage-credit-balance-gbp 50",
    "  --top-up-threshold-gbp 10",
    "  --auto-top-up-status not_configured",
    "  --billing-pause-flag no",
    "  --refund-status not_required",
    "  --internal-notes \"Operator note\"",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  Store payment provider IDs, statuses, timestamps, and notes only; do not store card numbers or sensitive payment data.",
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

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live billing update");
  }

  const payload = {
    action: "updateBilling",
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
