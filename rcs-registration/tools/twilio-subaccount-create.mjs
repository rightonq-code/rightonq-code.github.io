#!/usr/bin/env node

const BOOLEAN_FLAGS = {
  "allow-duplicate": "allowDuplicate",
  "confirm-create": "confirmCreate",
  "dry-run": "dryRun"
};

const VALUE_FLAGS = {
  "friendly-name": "friendlyName"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/twilio-subaccount-create.mjs --friendly-name \"RightOnQ RCS proof customer - 2026-05-19\" --dry-run",
    "  TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... node rcs-registration/tools/twilio-subaccount-create.mjs --friendly-name \"...\" --confirm-create",
    "",
    "Options:",
    "  --friendly-name NAME              Required Twilio subaccount friendly name",
    "  --confirm-create                  Required for live creation",
    "  --allow-duplicate                 Allow creation even when a matching friendly name is already visible",
    "  --dry-run                         Print planned read/write requests without calling Twilio",
    "",
    "Environment:",
    "  TWILIO_ACCOUNT_SID                 Required for live calls",
    "  TWILIO_AUTH_TOKEN                  Required for live calls",
    "",
    "Safety:",
    "  This tool performs one duplicate-check GET and, only with --confirm-create, one POST to create a Twilio subaccount.",
    "  It never prints the Twilio auth token.",
    "  It does not create Messaging Services, sender pools, RCS senders, phone numbers, messages, or compliance submissions."
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

function accountSummary(account) {
  return {
    sid: account.sid || "",
    friendlyName: account.friendly_name || "",
    status: account.status || "",
    type: account.type || "",
    ownerAccountSid: account.owner_account_sid || "",
    dateCreated: account.date_created || "",
    dateUpdated: account.date_updated || ""
  };
}

async function twilioRequest(url, authorization, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      Authorization: authorization,
      ...(options.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {})
    },
    body: options.body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.more_info || response.statusText || "Twilio request failed";
    throw new Error(response.status + " " + message + " (" + url + ")");
  }
  return data;
}

function validateOptions(options) {
  const friendlyName = normaliseName(options.friendlyName);
  if (!friendlyName) throw new Error("--friendly-name is required");
  if (friendlyName.length > 64) throw new Error("--friendly-name must be 64 characters or fewer");
  if (!options.dryRun && !options.confirmCreate) {
    throw new Error("Live creation requires --confirm-create");
  }
  return friendlyName;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const friendlyName = validateOptions(options);
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const listUrl = "https://api.twilio.com/2010-04-01/Accounts.json?FriendlyName=" +
    encodeURIComponent(friendlyName) + "&PageSize=20";
  const createUrl = "https://api.twilio.com/2010-04-01/Accounts.json";

  if (options.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      action: "twilioSubaccountCreate",
      friendlyName,
      parentAccountSid: accountSid,
      requests: [
        {
          label: "duplicate_check",
          method: "GET",
          url: listUrl
        },
        {
          label: "create_subaccount",
          method: "POST",
          url: createUrl,
          bodyFields: ["FriendlyName"],
          requires: ["--confirm-create"]
        }
      ],
      notes: [
        "No Twilio API call was made.",
        "Live mode first checks for an existing visible account with the same friendly name.",
        "Live mode creates only a subaccount; no Messaging Service, sender, RCS, phone number, compliance, or message resource is created."
      ]
    }, null, 2));
    return;
  }

  const realAccountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const authToken = requireEnv("TWILIO_AUTH_TOKEN");
  const authorization = basicAuth(realAccountSid, authToken);

  const duplicateResponse = await twilioRequest(listUrl, authorization);
  const accounts = Array.isArray(duplicateResponse.accounts) ? duplicateResponse.accounts : [];
  const matchingAccounts = accounts
    .filter(account => normaliseName(account.friendly_name) === friendlyName)
    .map(accountSummary);

  if (matchingAccounts.length > 0 && !options.allowDuplicate) {
    console.log(JSON.stringify({
      ok: true,
      action: "twilioSubaccountCreate",
      created: false,
      reason: "matching_friendly_name_already_visible",
      friendlyName,
      matchingAccounts
    }, null, 2));
    return;
  }

  const body = new URLSearchParams({ FriendlyName: friendlyName }).toString();
  const createdAccount = await twilioRequest(createUrl, authorization, {
    method: "POST",
    body
  });

  console.log(JSON.stringify({
    ok: true,
    action: "twilioSubaccountCreate",
    created: true,
    friendlyName,
    account: accountSummary(createdAccount)
  }, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
