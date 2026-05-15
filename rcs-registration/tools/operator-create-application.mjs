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
  "crm-company-id": "crmCompanyId",
  "crm-deal-id": "crmDealId",
  "crm-source-record-url": "crmSourceRecordUrl",
  "client-name": "displayName",
  "legal-business-name": "legalBusinessName",
  "trading-name": "tradingName",
  "primary-contact-name": "primaryContactName",
  "primary-contact-email": "primaryContactEmail",
  "primary-contact-phone": "primaryContactPhone",
  "campaign-code": "campaignCode",
  "message-code": "messageCode",
  "qualified-use-case": "qualifiedUseCase",
  "package-interest": "packageInterest",
  "handoff-date": "handoffDate",
  "sales-context": "salesContext",
  "package-name": "packageName",
  "billing-status": "billingStatus",
  "trust-hub-status": "trustHubStatus",
  "internal-owner": "internalOwner",
  "next-action-owner": "nextActionOwner",
  "next-action-note": "nextActionNote",
  "internal-notes": "internalNotes"
};

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun"
};

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_CREATE_PIN=... node rcs-registration/tools/operator-create-application.mjs --legal-business-name \"ABC Ltd\" --primary-contact-email client@example.com",
    "",
    "Common fields:",
    "  --application-id ROQ-RCS-...       Optional; generated if omitted",
    "  --client-id CLIENT-001",
    "  --crm-company-id ...",
    "  --crm-deal-id ...",
    "  --crm-source-record-url ...",
    "  --legal-business-name \"ABC Ltd\"",
    "  --trading-name \"ABC\"",
    "  --client-name \"ABC\"",
    "  --primary-contact-name \"Jane Smith\"",
    "  --primary-contact-email jane@example.com",
    "  --primary-contact-phone +447700900123",
    "  --campaign-code RCS1",
    "  --message-code INTRO-1",
    "  --qualified-use-case \"Transactional customer updates\"",
    "  --package-interest \"Local Time Only\"",
    "  --sales-context \"Qualified by Roy\"",
    "",
    "Safety:",
    "  The create PIN is read from RCS_ONBOARDING_CREATE_PIN.",
    "  The PIN is never printed and should not be passed as a command argument.",
    "  Use --dry-run to print the payload without sending it.",
    "  A successful live run returns a private application link; treat that link as client-specific."
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
  const createPin = process.env.RCS_ONBOARDING_CREATE_PIN;
  if (!options.dryRun && !createPin) {
    throw new Error("Set RCS_ONBOARDING_CREATE_PIN before creating a live application link");
  }

  const payload = {
    action: "createApplicationDraft"
  };

  Object.keys(FIELD_ALIASES).forEach(function(rawName) {
    const fieldName = FIELD_ALIASES[rawName];
    if (options[fieldName] !== undefined) payload[fieldName] = options[fieldName];
  });

  if (!options.dryRun) payload.createPin = createPin;
  return payload;
}

function sanitisePayload(payload) {
  const copy = { ...payload };
  if (copy.createPin) copy.createPin = "[redacted]";
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
