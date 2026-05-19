#!/usr/bin/env node

import { runOperatorAction } from "./operator-api-client.mjs";

const DEFAULT_TWILIO_STATUS = "subaccount_created";
const DEFAULT_PROVIDER_STATUS = "not_started";
const DEFAULT_GO_LIVE_STATUS = "not_started";
const DEFAULT_USAGE_PULL_STATUS = "not_started";
const DEFAULT_MANUAL_PAUSE_FLAG = "no";

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun"
};

const VALUE_FLAGS = {
  "application-id": "applicationId",
  "friendly-name": "friendlyName",
  "twilio-status": "twilioStatus",
  "provider-submission-status": "providerSubmissionStatus",
  "go-live-status": "goLiveStatus",
  "usage-pull-status": "usagePullStatus",
  "manual-pause-flag": "manualPauseFlag",
  "internal-notes": "internalNotes",
  "operator-name": "operatorName",
  "changed-by": "changedBy"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/operator-twilio-subaccount-link.mjs --application-id ROQ-RCS-... --friendly-name \"RightOnQ RCS proof customer - 2026-05-19\" --dry-run",
    "  TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-twilio-subaccount-link.mjs --application-id ROQ-RCS-... --friendly-name \"...\"",
    "",
    "Options:",
    "  --application-id ROQ-RCS-...       Required application ID",
    "  --friendly-name NAME               Required Twilio subaccount friendly name to look up",
    "  --twilio-status VALUE              Defaults to subaccount_created",
    "  --provider-submission-status VALUE Defaults to not_started",
    "  --go-live-status VALUE             Defaults to not_started",
    "  --usage-pull-status VALUE          Defaults to not_started",
    "  --manual-pause-flag yes|no         Defaults to no",
    "  --internal-notes TEXT",
    "  --dry-run                          Print planned lookup/update without calling Twilio or Apps Script",
    "",
    "Environment:",
    "  TWILIO_ACCOUNT_SID                 Required for live Twilio lookup",
    "  TWILIO_AUTH_TOKEN                  Required for live Twilio lookup",
    "  RCS_ONBOARDING_OPERATOR_PIN         Required for live Apps Script update",
    "",
    "Safety:",
    "  Live mode performs one Twilio GET by friendly name and one operator update.",
    "  It stores the resolved Twilio subaccount SID in the internal tracking Sheet.",
    "  It redacts Twilio Account SIDs from terminal output and never prints Twilio auth tokens or operator PINs."
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

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error("Missing " + name);
  return value;
}

function normaliseName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

function basicAuth(accountSid, authToken) {
  return "Basic " + Buffer.from(accountSid + ":" + authToken).toString("base64");
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

async function twilioGet(url, authorization) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: authorization }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.more_info || response.statusText || "Twilio request failed";
    throw new Error(response.status + " " + message + " (" + url + ")");
  }
  return data;
}

function validateOptions(options) {
  const applicationId = normaliseName(options.applicationId);
  const friendlyName = normaliseName(options.friendlyName);
  if (!applicationId) throw new Error("--application-id is required");
  if (!friendlyName) throw new Error("--friendly-name is required");
  if (!options.dryRun && !process.env.RCS_ONBOARDING_OPERATOR_PIN) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live link update");
  }
  return { applicationId, friendlyName };
}

function buildPayload(options, applicationId, friendlyName, subaccountSid) {
  return {
    action: "updateTwilioSetup",
    applicationId,
    twilioSubaccountSid: subaccountSid,
    twilioSubaccountFriendlyName: friendlyName,
    twilioStatus: options.twilioStatus || DEFAULT_TWILIO_STATUS,
    providerSubmissionStatus: options.providerSubmissionStatus || DEFAULT_PROVIDER_STATUS,
    goLiveStatus: options.goLiveStatus || DEFAULT_GO_LIVE_STATUS,
    usagePullStatus: options.usagePullStatus || DEFAULT_USAGE_PULL_STATUS,
    manualPauseFlag: options.manualPauseFlag || DEFAULT_MANUAL_PAUSE_FLAG,
    internalNotes: options.internalNotes || "",
    ...(options.operatorName ? { operatorName: options.operatorName } : {}),
    ...(options.changedBy ? { changedBy: options.changedBy } : {})
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const { applicationId, friendlyName } = validateOptions(options);
  const lookupUrl = "https://api.twilio.com/2010-04-01/Accounts.json?FriendlyName=" +
    encodeURIComponent(friendlyName) + "&PageSize=20";
  const plannedPayload = buildPayload(options, applicationId, friendlyName, "[resolved-by-friendly-name]");

  if (options.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      action: "operatorTwilioSubaccountLink",
      lookup: {
        method: "GET",
        url: lookupUrl
      },
      operatorPayload: plannedPayload,
      notes: [
        "No Twilio API call was made.",
        "No Apps Script operator update was made.",
        "Live mode resolves the Twilio subaccount SID by friendly name and writes it to the Twilio setup tracking row."
      ]
    }, null, 2));
    return;
  }

  const accountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const authToken = requireEnv("TWILIO_AUTH_TOKEN");
  const authorization = basicAuth(accountSid, authToken);
  const lookupResponse = await twilioGet(lookupUrl, authorization);
  const accounts = Array.isArray(lookupResponse.accounts) ? lookupResponse.accounts : [];
  const matches = accounts.filter(account => normaliseName(account.friendly_name) === friendlyName);

  if (matches.length !== 1) {
    throw new Error("Expected exactly one Twilio subaccount named '" + friendlyName + "', found " + matches.length);
  }
  const match = matches[0];
  if (!match.sid) throw new Error("Matched Twilio subaccount did not include a SID");

  const payload = {
    ...buildPayload(options, applicationId, friendlyName, match.sid),
    operatorPin: process.env.RCS_ONBOARDING_OPERATOR_PIN
  };
  const result = await runOperatorAction(payload);

  console.log(JSON.stringify(redactTwilioAccountSids({
    ok: true,
    action: "operatorTwilioSubaccountLink",
    linked: true,
    applicationId,
    friendlyName,
    twilioStatus: payload.twilioStatus,
    providerSubmissionStatus: payload.providerSubmissionStatus,
    operatorResult: result
  }), null, 2));
}

main().catch(function(error) {
  console.error(redactTwilioAccountSids(error.message));
  process.exit(1);
});
