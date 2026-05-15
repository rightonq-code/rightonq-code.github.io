#!/usr/bin/env node

import { runOperatorAction } from "./operator-api-client.mjs";

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "review-status": "reviewStatus",
  "assigned-owner": "assignedOwner",
  "legal-company-check": "legalCompanyCheck",
  "website-domain-check": "websiteDomainCheck",
  "public-links-check": "publicLinksCheck",
  "message-purpose-examples-check": "messagePurposeExamplesCheck",
  "consent-opt-out-check": "consentOptOutCheck",
  "kyc-trust-hub-check": "kycTrustHubCheck",
  "sms-fallback-rc-bundle-check": "smsFallbackRcBundleCheck",
  "phone-preview-readiness": "phonePreviewReadiness",
  "next-action": "nextAction",
  "source-status": "sourceStatus",
  "operator-name": "operatorName",
  "changed-by": "changedBy",
  notes: "notes"
};

const BOOLEAN_FLAGS = {
  "part-a-accepted": "partAAccepted",
  "dry-run": "dryRun"
};

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-review.mjs --application-id ROQ-RCS-... --review-status accepted --part-a-accepted",
    "",
    "Common fields:",
    "  --application-id                 Required application ID",
    "  --review-status                 pending_review, accepted, changes_needed, etc.",
    "  --part-a-accepted               Also moves Part A to part_a_accepted",
    "  --legal-company-check passed    Updates checklist fields",
    "  --website-domain-check passed",
    "  --public-links-check passed",
    "  --message-purpose-examples-check passed",
    "  --consent-opt-out-check passed",
    "  --kyc-trust-hub-check pending_isa_reply",
    "  --sms-fallback-rc-bundle-check pending",
    "  --phone-preview-readiness ready",
    "  --next-action \"Prepare the phone name and logo preview.\"",
    "  --notes \"Operator note\"",
    "  --operator-name \"RightOnQ\"",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  The PIN is never printed and should not be passed as a command argument.",
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
    if (!token.startsWith("--")) {
      throw new Error("Unexpected argument: " + token);
    }

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
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live operator update");
  }

  const payload = {
    action: "updateInternalReview",
    applicationId: options.applicationId
  };

  Object.keys(FIELD_ALIASES).forEach(function(rawName) {
    const fieldName = FIELD_ALIASES[rawName];
    if (options[fieldName] !== undefined) payload[fieldName] = options[fieldName];
  });

  if (options.partAAccepted) payload.partAAccepted = true;
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
