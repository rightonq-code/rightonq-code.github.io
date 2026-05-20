#!/usr/bin/env node

const DEFAULT_USECASE = "notifications";

const BOOLEAN_FLAGS = {
  "allow-duplicate": "allowDuplicate",
  "confirm-create": "confirmCreate",
  "dry-run": "dryRun"
};

const VALUE_FLAGS = {
  "friendly-name": "friendlyName",
  "messaging-service-friendly-name": "messagingServiceFriendlyName",
  "usecase": "usecase"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/twilio-subaccount-messaging-service-create.mjs --friendly-name \"RightOnQ RCS proof customer - 2026-05-19\" --messaging-service-friendly-name \"RightOnQ RCS proof messaging\" --dry-run",
    "  TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... node rcs-registration/tools/twilio-subaccount-messaging-service-create.mjs --friendly-name \"...\" --messaging-service-friendly-name \"...\" --confirm-create",
    "",
    "Options:",
    "  --friendly-name NAME                         Required Twilio subaccount friendly name",
    "  --messaging-service-friendly-name NAME       Required Messaging Service friendly name",
    "  --usecase VALUE                              Defaults to notifications",
    "  --confirm-create                             Required for live creation",
    "  --allow-duplicate                            Allow creation even when a matching Messaging Service already exists",
    "  --dry-run                                    Print planned requests without calling Twilio",
    "",
    "Environment:",
    "  TWILIO_ACCOUNT_SID                           Required parent account SID for live lookup",
    "  TWILIO_AUTH_TOKEN                            Required parent auth token for live lookup",
    "",
    "Safety:",
    "  This tool resolves the subaccount by friendly name, checks existing Messaging Services, then creates one Messaging Service only with --confirm-create.",
    "  It never prints auth tokens or full Twilio Account SIDs.",
    "  It does not create sender pools, RCS senders, phone numbers, compliance submissions, or messages."
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
  const serviceFriendlyName = normaliseName(options.messagingServiceFriendlyName);
  if (!friendlyName) throw new Error("--friendly-name is required");
  if (!serviceFriendlyName) throw new Error("--messaging-service-friendly-name is required");
  if (serviceFriendlyName.length > 64) {
    throw new Error("--messaging-service-friendly-name must be 64 characters or fewer");
  }
  if (!options.dryRun && !options.confirmCreate) {
    throw new Error("Live creation requires --confirm-create");
  }
  return {
    friendlyName,
    serviceFriendlyName,
    usecase: options.usecase || DEFAULT_USECASE
  };
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

function serviceSummary(service) {
  return {
    sid: service.sid || "",
    friendlyName: service.friendly_name || "",
    usecase: service.usecase || "",
    inboundRequestUrl: service.inbound_request_url || "",
    statusCallback: service.status_callback || "",
    areaCodeGeomatch: service.area_code_geomatch || false,
    smartEncoding: service.smart_encoding || false,
    dateCreated: service.date_created || "",
    dateUpdated: service.date_updated || ""
  };
}

async function resolveSubaccount(friendlyName, parentAuthorization) {
  const lookupUrl = "https://api.twilio.com/2010-04-01/Accounts.json?FriendlyName=" +
    encodeURIComponent(friendlyName) + "&PageSize=20";
  const accountResponse = await twilioRequest(lookupUrl, parentAuthorization);
  const accounts = Array.isArray(accountResponse.accounts) ? accountResponse.accounts : [];
  const matches = accounts.filter(account => normaliseName(account.friendly_name) === friendlyName);
  if (matches.length !== 1) {
    throw new Error("Expected exactly one Twilio subaccount named '" + friendlyName + "', found " + matches.length);
  }
  const subaccount = matches[0];
  if (!subaccount.sid || !subaccount.auth_token) {
    throw new Error("Matched Twilio subaccount did not include both sid and auth_token");
  }
  return subaccount;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const { friendlyName, serviceFriendlyName, usecase } = validateOptions(options);

  if (options.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      action: "twilioSubaccountMessagingServiceCreate",
      subaccountFriendlyName: friendlyName,
      messagingServiceFriendlyName: serviceFriendlyName,
      usecase,
      requests: [
        {
          label: "subaccount_lookup",
          method: "GET",
          url: "https://api.twilio.com/2010-04-01/Accounts.json?FriendlyName=" +
            encodeURIComponent(friendlyName) + "&PageSize=20"
        },
        {
          label: "messaging_services_duplicate_check",
          method: "GET",
          url: "https://messaging.twilio.com/v1/Services?PageSize=20",
          auth: "resolved subaccount SID/auth token"
        },
        {
          label: "create_messaging_service",
          method: "POST",
          url: "https://messaging.twilio.com/v1/Services",
          auth: "resolved subaccount SID/auth token",
          bodyFields: ["FriendlyName", "Usecase"],
          requires: ["--confirm-create"]
        }
      ],
      notes: [
        "No Twilio API call was made.",
        "Live mode creates one Messaging Service only.",
        "No sender pool, RCS sender, phone number, compliance, or message resource is created."
      ]
    }, null, 2));
    return;
  }

  const parentAccountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const parentAuthToken = requireEnv("TWILIO_AUTH_TOKEN");
  const parentAuthorization = basicAuth(parentAccountSid, parentAuthToken);
  const subaccount = await resolveSubaccount(friendlyName, parentAuthorization);
  const subaccountAuthorization = basicAuth(subaccount.sid, subaccount.auth_token);

  const services = await twilioRequest("https://messaging.twilio.com/v1/Services?PageSize=20", subaccountAuthorization);
  const serviceItems = Array.isArray(services.services) ? services.services : [];
  const matchingServices = serviceItems
    .filter(service => normaliseName(service.friendly_name) === serviceFriendlyName)
    .map(serviceSummary);

  if (matchingServices.length > 0 && !options.allowDuplicate) {
    console.log(JSON.stringify(redactTwilioAccountSids({
      ok: true,
      action: "twilioSubaccountMessagingServiceCreate",
      created: false,
      reason: "matching_messaging_service_already_visible",
      subaccount: accountSummary(subaccount),
      messagingServiceFriendlyName: serviceFriendlyName,
      matchingServices
    }), null, 2));
    return;
  }

  const body = new URLSearchParams({
    FriendlyName: serviceFriendlyName,
    Usecase: usecase
  }).toString();
  const createdService = await twilioRequest("https://messaging.twilio.com/v1/Services", subaccountAuthorization, {
    method: "POST",
    body
  });

  console.log(JSON.stringify(redactTwilioAccountSids({
    ok: true,
    action: "twilioSubaccountMessagingServiceCreate",
    created: true,
    subaccount: accountSummary(subaccount),
    messagingService: serviceSummary(createdService)
  }), null, 2));
}

main().catch(function(error) {
  console.error(redactTwilioAccountSids(error.message));
  process.exit(1);
});
