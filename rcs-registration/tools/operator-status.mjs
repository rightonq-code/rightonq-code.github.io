#!/usr/bin/env node

const DEFAULT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec";

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-status.mjs --application-id ROQ-RCS-...",
    "",
    "Options:",
    "  --application-id ROQ-RCS-...   Required application ID",
    "  --dry-run                     Print the guarded request payload without sending it",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  The PIN is never printed and should not be passed as a command argument."
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
    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (token === "--application-id") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --application-id");
      options.applicationId = value;
      index += 1;
      continue;
    }
    throw new Error("Unknown option: " + token);
  }
  return options;
}

function buildPayload(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live operator status check");
  }

  const payload = {
    action: "getOperatorSnapshot",
    applicationId: options.applicationId
  };
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
