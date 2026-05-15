#!/usr/bin/env node

const DEFAULT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec";

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

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow"
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error("Non-JSON response from Apps Script: " + text.slice(0, 500));
  }
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Apps Script request failed with HTTP " + response.status);
  }
  return data;
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

  const webAppUrl = process.env.RCS_ONBOARDING_WEB_APP_URL || DEFAULT_WEB_APP_URL;
  const result = await postJson(webAppUrl, payload);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
