#!/usr/bin/env node

const DEFAULT_LIMIT = 20;

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun",
  "include-senders": "includeSenders"
};

const VALUE_FLAGS = {
  "limit": "limit",
  "messaging-service-sid": "messagingServiceSid"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/twilio-account-inventory.mjs --dry-run",
    "  TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... node rcs-registration/tools/twilio-account-inventory.mjs",
    "  TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... TWILIO_MESSAGING_SERVICE_SID=... node rcs-registration/tools/twilio-account-inventory.mjs --include-senders",
    "",
    "Options:",
    "  --include-senders                 Also list sender-pool resources for the configured/discovered Messaging Services",
    "  --messaging-service-sid MG...      Limit sender-pool readback to one Messaging Service",
    "  --limit 20                         Page size for list calls; defaults to 20",
    "  --dry-run                          Print planned read-only requests without calling Twilio",
    "",
    "Environment:",
    "  TWILIO_ACCOUNT_SID                 Required for live read-only calls",
    "  TWILIO_AUTH_TOKEN                  Required for live read-only calls",
    "  TWILIO_MESSAGING_SERVICE_SID        Optional; used by --include-senders if present",
    "",
    "Safety:",
    "  This tool performs GET requests only.",
    "  It never prints the Twilio auth token.",
    "  It prints Twilio SIDs, friendly names, statuses, URLs, and sender IDs only."
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

function basicAuth(accountSid, authToken) {
  return "Basic " + Buffer.from(accountSid + ":" + authToken).toString("base64");
}

function requestPlan(accountSid, options) {
  const limit = getLimit(options);
  const serviceSid = options.messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID || "";
  const requests = [
    {
      label: "parent_account",
      method: "GET",
      url: "https://api.twilio.com/2010-04-01/Accounts/" + encodeURIComponent(accountSid) + ".json"
    },
    {
      label: "subaccounts",
      method: "GET",
      url: "https://api.twilio.com/2010-04-01/Accounts.json?PageSize=" + limit
    },
    {
      label: "messaging_services",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services?PageSize=" + limit
    }
  ];

  if (options.includeSenders && serviceSid) {
    requests.push({
      label: "configured_service_phone_numbers",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/PhoneNumbers?PageSize=" + limit
    });
    requests.push({
      label: "configured_service_alpha_senders",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/AlphaSenders?PageSize=" + limit
    });
    requests.push({
      label: "configured_service_short_codes",
      method: "GET",
      url: "https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/ShortCodes?PageSize=" + limit
    });
  }

  return requests;
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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const plan = requestPlan(accountSid, options);
  if (options.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      action: "twilioAccountInventory",
      readOnly: true,
      requests: plan,
      notes: [
        "No Twilio API call was made.",
        "Live mode requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
        "Use ~/rightonq-infrastructure/scripts/run_with_secrets.sh to inject credentials without printing them."
      ]
    }, null, 2));
    return;
  }

  const realAccountSid = requireEnv("TWILIO_ACCOUNT_SID");
  const authToken = requireEnv("TWILIO_AUTH_TOKEN");
  const authorization = basicAuth(realAccountSid, authToken);

  const parent = await twilioGet(plan[0].url.replace(accountSid, realAccountSid), authorization);
  const accounts = await twilioGet(plan[1].url, authorization);
  const services = await twilioGet(plan[2].url, authorization);
  const accountItems = Array.isArray(accounts.accounts) ? accounts.accounts : [];
  const serviceItems = Array.isArray(services.services) ? services.services : [];

  const result = {
    ok: true,
    action: "twilioAccountInventory",
    readOnly: true,
    parentAccount: accountSummary(parent),
    visibleAccounts: accountItems.map(accountSummary),
    subaccounts: accountItems
      .filter(account => account.sid && account.sid !== realAccountSid)
      .map(accountSummary),
    messagingServices: serviceItems.map(serviceSummary),
    senderPools: []
  };

  if (options.includeSenders) {
    const selectedSid = options.messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID || "";
    const selectedServices = selectedSid
      ? serviceItems.filter(service => service.sid === selectedSid).concat(
          serviceItems.some(service => service.sid === selectedSid) ? [] : [{ sid: selectedSid }]
        )
      : serviceItems;

    for (const service of selectedServices) {
      const serviceSid = service.sid;
      const [phoneNumbers, alphaSenders, shortCodes] = await Promise.all([
        twilioGet("https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/PhoneNumbers?PageSize=" + getLimit(options), authorization),
        twilioGet("https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/AlphaSenders?PageSize=" + getLimit(options), authorization),
        twilioGet("https://messaging.twilio.com/v1/Services/" + encodeURIComponent(serviceSid) + "/ShortCodes?PageSize=" + getLimit(options), authorization)
      ]);
      result.senderPools.push({
        messagingServiceSid: serviceSid,
        phoneNumbers: (phoneNumbers.phone_numbers || []).map(phoneNumberSummary),
        alphaSenders: (alphaSenders.alpha_senders || []).map(genericSenderSummary),
        shortCodes: (shortCodes.short_codes || []).map(genericSenderSummary)
      });
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
