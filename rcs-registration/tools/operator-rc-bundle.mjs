#!/usr/bin/env node

const DEFAULT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec";

function resolveOperatorWebAppUrl() {
  return process.env.RCS_ONBOARDING_OPERATOR_WEB_APP_URL ||
    process.env.RCS_ONBOARDING_WEB_APP_URL ||
    DEFAULT_WEB_APP_URL;
}

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "client-id": "clientId",
  "rc-bundle-sid": "rcBundleSid",
  "rc-bundle-status": "rcBundleStatus",
  "rc-bundle-rejection-reason": "rcBundleRejectionReason",
  "rc-bundle-error-code": "rcBundleErrorCode",
  "rc-bundle-error-detail": "rcBundleErrorDetail",
  "end-business-legal-name": "endBusinessLegalName",
  "business-registration-number": "businessRegistrationNumber",
  "number-type": "numberType",
  "phone-number-sid": "phoneNumberSid",
  "phone-number": "phoneNumber",
  "phone-number-assignment-status": "phoneNumberAssignmentStatus",
  "address-sid": "addressSid",
  "supporting-document-sid": "supportingDocumentSid",
  "compliance-owner": "complianceOwner",
  "fallback-required": "fallbackRequired",
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
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-rc-bundle.mjs --application-id ROQ-RCS-... --rc-bundle-status pending_review",
    "",
    "Common fields:",
    "  --application-id                         Required application ID",
    "  --rc-bundle-status pending_review",
    "  --rc-bundle-sid BU...",
    "  --phone-number-sid PN...",
    "  --phone-number +441234567890",
    "  --phone-number-assignment-status assigned",
    "  --fallback-required yes",
    "  --internal-notes \"Operator note\"",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  Store Twilio IDs, status values, and rejection reasons only; do not store raw identity evidence.",
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
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live RC Bundle update");
  }

  const payload = {
    action: "updateUkRcBundle",
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

  const webAppUrl = resolveOperatorWebAppUrl();
  const result = await postJson(webAppUrl, payload);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
