#!/usr/bin/env node

const DEFAULT_LIMIT = 20;

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun",
  "include-senders": "includeSenders"
};

const VALUE_FLAGS = {
  "friendly-name": "friendlyName",
  "limit": "limit",
  "messaging-service-sid": "messagingServiceSid"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/twilio-subaccount-messaging-inventory.mjs --friendly-name \"RightOnQ RCS proof customer - 2026-05-19\" --dry-run",
    "  TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... node rcs-registration/tools/twilio-subaccount-messaging-inventory.mjs --friendly-name \"...\" --include-senders",
    "",
    "Options:",
    "  --friendly-name NAME              Required Twilio subaccount friendly name to inspect",
    "  --include-senders                 Also list sender-pool resources for discovered/provided Messaging Services",
    "  --messaging-service-sid MG...      Limit sender-pool readback to one Messaging Service",
    "  --limit 20                         Page size for list calls; defaults to 20",
    "  --dry-run                          Print planned read-only requests without calling Twilio",
    "",
    "Environment:",
    "  TWILIO_ACCOUNT_SID                 Required parent account SID for live lookup",
    "  TWILIO_AUTH_TOKEN                  Required parent auth token for live lookup",
    "",
    "Safety:",
    "  This tool performs read-only GET requests.",
    "  It resolves the subaccount by friendly name, then uses the subaccount SID/auth token for Messaging API reads.",
    "  It never prints the parent auth token, subaccount auth token, or full Twilio Account SIDs."
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

function getLimit(options) {
  const parsed = Number(options.limit || DEFAULT_LIMIT);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 1000) {
    throw new Error("--limit must be an integer from 1 to 1000");
  }
  return parsed;
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

function phoneNumberSummary(sender) {
  return {
    sid: sender.sid || "",
    phoneNumber: sender.phone_number || "",
    countryCode: sender.country_code || "",
    capability: sender.capabilities || {},
    dateCreated: sender.date_created || "",
    dateUpdated: sender.date_updated || ""
  };
}

function genericSenderSummary(sender) {
  return {
    sid: sender.sid || "",
    alphaSender: sender.alpha_sender || "",
    shortCode: sender.short_code || "",
    countryCode: sender.country_code || "",
    dateCreated: sender.date_created || "",
    dateUpdated: sender.date_updated || ""
  };
}

function validateOptions(options) {
  const friendlyName = normaliseName(options.friendlyName);
  if (!friendlyName) throw new Error("--friendly-name is required");
  return friendlyName;
}

function requestPlan(friendlyName, options) {
  const limit = getLimit(options);
  const requests = [
    {
      label: "subaccount_lookup",
      method: "GET",
      url: "https://api.twilio.com/2010-04-01/Accounts.json?FriendlyName=" +
        encodeURIComponent(friendlyName) + "&PageSize=" + limit
    },
    {
      label: "subaccount_messaging_services",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services?PageSize=" + limit,
      auth: "resolved subaccount SID/auth token"
    }
  ];

  const serviceSid = options.messagingServiceSid || "";
  if (options.includeSenders && serviceSid) {
    requests.push({
      label: "configured_service_phone_numbers",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/PhoneNumbers?PageSize=" + limit,
      auth: "resolved subaccount SID/auth token"
    });
    requests.push({
      label: "configured_service_alpha_senders",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/AlphaSenders?PageSize=" + limit,
      auth: "resolved subaccount SID/auth token"
    });
    requests.push({
      label: "configured_service_short_codes",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/ShortCodes?PageSize=" + limit,
      auth: "resolved subaccount SID/auth token"
    });
  }

  return requests;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const friendlyName = validateOptions(options);
  const plan = requestPlan(friendlyName, options);

  if (options.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      action: "twilioSubaccountMessagingInventory",
      readOnly: true,
      friendlyName,
      requests: plan,
      notes: [
        "No Twilio API call was made.",
        "Live mode resolves the subaccount by friendly name using parent credentials.",
        "Live mode uses the resolved subaccount SID/auth token only in memory for Messaging API reads.",
        "No Messaging Service, sender, RCS sender, phone number, compliance, or message resource is created."
      ]
    }, null, 2));
    return;
  }

  const parentAccountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const parentAuthToken = requireEnv("TWILIO_AUTH_TOKEN");
  const parentAuthorization = basicAuth(parentAccountSid, parentAuthToken);

  const accountResponse = await twilioGet(plan[0].url, parentAuthorization);
  const accounts = Array.isArray(accountResponse.accounts) ? accountResponse.accounts : [];
  const matches = accounts.filter(account => normaliseName(account.friendly_name) === friendlyName);
  if (matches.length !== 1) {
    throw new Error("Expected exactly one Twilio subaccount named '" + friendlyName + "', found " + matches.length);
  }

  const subaccount = matches[0];
  if (!subaccount.sid || !subaccount.auth_token) {
    throw new Error("Matched Twilio subaccount did not include both sid and auth_token");
  }
  const subaccountAuthorization = basicAuth(subaccount.sid, subaccount.auth_token);
  const services = await twilioGet("https://messaging.twilio.com/v1/Services?PageSize=" + getLimit(options), subaccountAuthorization);
  const serviceItems = Array.isArray(services.services) ? services.services : [];

  const result = {
    ok: true,
    action: "twilioSubaccountMessagingInventory",
    readOnly: true,
    subaccount: accountSummary(subaccount),
    messagingServices: serviceItems.map(serviceSummary),
    senderPools: []
  };

  if (options.includeSenders) {
    const selectedSid = options.messagingServiceSid || "";
    const selectedServices = selectedSid
      ? serviceItems.filter(service => service.sid === selectedSid).concat(
          serviceItems.some(service => service.sid === selectedSid) ? [] : [{ sid: selectedSid }]
        )
      : serviceItems;

    for (const service of selectedServices) {
      const serviceSid = service.sid;
      const [phoneNumbers, alphaSenders, shortCodes] = await Promise.all([
        twilioGet("https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/PhoneNumbers?PageSize=" + getLimit(options), subaccountAuthorization),
        twilioGet("https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/AlphaSenders?PageSize=" + getLimit(options), subaccountAuthorization),
        twilioGet("https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/ShortCodes?PageSize=" + getLimit(options), subaccountAuthorization)
      ]);
      result.senderPools.push({
        messagingServiceSid: serviceSid,
        phoneNumbers: (phoneNumbers.phone_numbers || []).map(phoneNumberSummary),
        alphaSenders: (alphaSenders.alpha_senders || []).map(genericSenderSummary),
        shortCodes: (shortCodes.short_codes || []).map(genericSenderSummary)
      });
    }
  }

  console.log(JSON.stringify(redactTwilioAccountSids(result), null, 2));
}

main().catch(function(error) {
  console.error(redactTwilioAccountSids(error.message));
  process.exit(1);
});
