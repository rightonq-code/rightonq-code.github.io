#!/usr/bin/env node

import { runOperatorAction } from "./operator-api-client.mjs";

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "client-id": "clientId",
  "twilio-subaccount-sid": "twilioSubaccountSid",
  "twilio-subaccount-friendly-name": "twilioSubaccountFriendlyName",
  "twilio-messaging-service-sid": "twilioMessagingServiceSid",
  "rbm-agent-id": "rbmAgentId",
  "rbm-sender-name": "rbmSenderName",
  "rbm-logo-url": "rbmLogoUrl",
  "rbm-banner-url": "rbmBannerUrl",
  "provider-submission-reference": "providerSubmissionReference",
  "provider-submission-status": "providerSubmissionStatus",
  "provider-submitted-at": "providerSubmittedAt",
  "provider-last-checked-at": "providerLastCheckedAt",
  "provider-notes": "providerNotes",
  "phone-preview-status": "phonePreviewStatus",
  "phone-preview-sent-at": "phonePreviewSentAt",
  "review-video-url": "reviewVideoUrl",
  "review-video-status": "reviewVideoStatus",
  "registration-pack-status": "registrationPackStatus",
  "go-live-status": "goLiveStatus",
  "go-live-date": "goLiveDate",
  "usage-pull-status": "usagePullStatus",
  "usage-last-pulled-at": "usageLastPulledAt",
  "usage-period-start": "usagePeriodStart",
  "usage-period-end": "usagePeriodEnd",
  "usage-cost-gbp": "usageCostGbp",
  "usage-reconciliation-status": "usageReconciliationStatus",
  "manual-pause-flag": "manualPauseFlag",
  "manual-pause-reason": "manualPauseReason",
  "opt-in-proof-urls": "optInProofUrls",
  "twilio-status": "twilioStatus",
  "internal-notes": "internalNotes",
  "operator-name": "operatorName",
  "changed-by": "changedBy"
};

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun",
  "confirm-provider-state-change": "confirmProviderStateChange"
};

const PROVIDER_GATE_FIELDS = [
  {
    fieldName: "providerSubmissionStatus",
    cliName: "--provider-submission-status",
    safeValue: "not_started"
  },
  {
    fieldName: "goLiveStatus",
    cliName: "--go-live-status",
    safeValue: "not_started"
  },
  {
    fieldName: "usagePullStatus",
    cliName: "--usage-pull-status",
    safeValue: "not_started"
  }
];

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-twilio-setup.mjs --application-id ROQ-RCS-... --twilio-subaccount-sid AC...",
    "",
    "Common fields:",
    "  --application-id                         Required application ID",
    "  --twilio-subaccount-sid AC...",
    "  --twilio-messaging-service-sid MG...",
    "  --rbm-agent-id agent_xxx",
    "  --provider-submission-reference ref_xxx",
    "  --provider-submission-status not_started",
    "  --phone-preview-status sent",
    "  --review-video-url https://...",
    "  --go-live-status not_started",
    "  --usage-pull-status not_started",
    "  --manual-pause-flag yes",
    "  --manual-pause-reason \"Operator note\"",
    "  --opt-in-proof-urls https://...",
    "  --twilio-status setup_in_progress",
    "  --internal-notes \"Operator note\"",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  Store Twilio IDs, status values, URLs, and notes only; do not store credentials, auth tokens, or raw message payloads.",
    "  Provider submission, go-live, and usage-pull statuses must stay not_started unless a separate approval gate has passed.",
    "  Use --confirm-provider-state-change only after explicit approval to move one of those statuses beyond not_started.",
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

function normaliseStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function validateProviderGates(options) {
  const attemptedChanges = PROVIDER_GATE_FIELDS.filter(function(gate) {
    if (options[gate.fieldName] === undefined) return false;
    return normaliseStatus(options[gate.fieldName]) !== gate.safeValue;
  });

  if (attemptedChanges.length === 0) return;
  if (options.confirmProviderStateChange) return;

  const fields = attemptedChanges
    .map(function(gate) {
      return gate.cliName + " " + options[gate.fieldName];
    })
    .join(", ");

  throw new Error(
    "Refusing provider lifecycle state change without --confirm-provider-state-change: " +
      fields +
      ". Run the proof-pack/submission approval gate first, then retry with the explicit confirmation flag."
  );
}

function buildPayload(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");
  validateProviderGates(options);

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live Twilio setup update");
  }

  const payload = {
    action: "updateTwilioSetup",
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

function redactTwilioAccountSids(value) {
  if (Array.isArray(value)) return value.map(redactTwilioAccountSids);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactTwilioAccountSids(item)])
    );
  }
  if (typeof value === "string") {
    return value.replace(/AC[0-9a-fA-F]{32}/g, "[twilio-account-sid-redacted]");
  }
  return value;
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
  console.log(JSON.stringify(redactTwilioAccountSids(result), null, 2));
}

main().catch(function(error) {
  console.error(redactTwilioAccountSids(error.message));
  process.exit(1);
});
