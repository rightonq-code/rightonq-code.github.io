const SPREADSHEET_ID = "1_C85rMaDWS0-VnXbtYQzRBS1trgN8kFf4hAnHfT3R-0";
const SHEET_NAME = "Part A submissions";
const APPLICATIONS_SHEET_NAME = "Applications";
const PUBLIC_FORM_URL = "https://rightonq-code.github.io/rcs-registration/index.html";
const NOTIFY_EMAIL = "adam@rightonq.co.uk";
const APPLICATION_HEADERS = [
  "Application ID",
  "Client ID",
  "CRM company ID",
  "CRM deal ID",
  "CRM source record URL",
  "Private application token",
  "Client name",
  "Legal business name",
  "Trading name",
  "Primary contact name",
  "Primary contact email",
  "Primary contact phone",
  "Campaign code",
  "Message code",
  "Qualified use case",
  "Package interest",
  "Handoff date",
  "Sales context",
  "Package name",
  "Registration status",
  "Billing status",
  "Part A status",
  "Part B status",
  "Twilio status",
  "Provider status",
  "Internal owner",
  "Created at",
  "Updated at",
  "Last client action at",
  "Last internal action at",
  "Next action owner",
  "Next action note",
  "Internal notes"
];
const REGISTRATION_STATUS_ORDER = [
  "draft",
  "application_created",
  "part_a_submitted",
  "part_a_internal_review",
  "part_a_changes_needed",
  "part_a_accepted",
  "phone_preview_sent",
  "name_logo_approved",
  "name_logo_changes_requested",
  "video_preparing",
  "video_ready_for_review",
  "video_approved",
  "video_changes_requested",
  "registration_submitted",
  "provider_review",
  "provider_changes_requested",
  "approved",
  "live",
  "paused_billing",
  "paused_operational"
];

function doGet(event) {
  const applicationId = event && event.parameter && event.parameter.applicationId;
  const applicationToken = event && event.parameter && firstValue(
    event.parameter.applicationToken,
    event.parameter.privateApplicationToken,
    event.parameter.private_application_token,
    event.parameter.token
  );
  if (applicationId || applicationToken) return jsonResponse(getApplicationStatus({
    applicationId: applicationId,
    privateApplicationToken: applicationToken
  }));

  return jsonResponse({
    ok: true,
    service: "RightOnQ RCS Part A Intake",
    sheetName: SHEET_NAME
  });
}

function getApplicationStatus(applicationId) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const criteria = typeof applicationId === "object" ? applicationId : { applicationId: applicationId };
  const applicationRecord = findApplicationRecord(spreadsheet, criteria);
  if (applicationRecord) {
    const recordToken = applicationRecord["Private application token"];
    if (recordToken && String(recordToken) !== String(criteria.privateApplicationToken || "")) {
      return {
        ok: true,
        found: false,
        applicationId: criteria.applicationId || "",
        registrationStatus: "draft",
        partAStatus: "draft"
      };
    }

    return {
      ok: true,
      found: true,
      applicationId: applicationRecord["Application ID"] || criteria.applicationId,
      registrationStatus: applicationRecord["Registration status"] || "draft",
      partAStatus: applicationRecord["Part A status"] || "draft",
      partBStatus: applicationRecord["Part B status"] || "",
      billingStatus: applicationRecord["Billing status"] || "",
      twilioStatus: applicationRecord["Twilio status"] || "",
      providerStatus: applicationRecord["Provider status"] || "",
      reviewStatus: "",
      partBVideoStatus: "",
      nextActionOwner: applicationRecord["Next action owner"] || "",
      nextActionNote: applicationRecord["Next action note"] || "",
      notes: applicationRecord["Internal notes"] || "",
      lastUpdated: serialiseDate(applicationRecord["Updated at"])
    };
  }

  if (criteria.privateApplicationToken) {
    return {
      ok: true,
      found: false,
      applicationId: criteria.applicationId || "",
      registrationStatus: "draft",
      partAStatus: "draft"
    };
  }

  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Sheet tab not found: " + SHEET_NAME);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return {
      ok: true,
      found: false,
      applicationId: criteria.applicationId || "",
      registrationStatus: "draft",
      partAStatus: "draft"
    };
  }

  const headers = values[0].map(function(header) { return String(header); });
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) throw new Error("Application ID column not found");

  if (!criteria.applicationId) {
    return {
      ok: true,
      found: false,
      applicationId: "",
      registrationStatus: "draft",
      partAStatus: "draft"
    };
  }

  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    const row = values[rowIndex];
    if (String(row[applicationIdColumn]) !== String(criteria.applicationId)) continue;

    return {
      ok: true,
      found: true,
      applicationId: criteria.applicationId,
      registrationStatus: readColumn(row, headers, "Registration status") || "part_a_submitted",
      partAStatus: readColumn(row, headers, "Part A status") || "part_a_submitted",
      reviewStatus: readColumn(row, headers, "Review status"),
      partBVideoStatus: readColumn(row, headers, "Part B video status"),
      notes: readColumn(row, headers, "Notes"),
      lastUpdated: serialiseDate(readColumn(row, headers, "Last updated"))
    };
  }

  return {
    ok: true,
    found: false,
    applicationId: criteria.applicationId || "",
    registrationStatus: "draft",
    partAStatus: "draft"
  };
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = parsePayload(event);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (payload.action === "createApplicationDraft") {
      requireCreatePin(payload);
      return jsonResponse(createApplicationDraft(spreadsheet, payload));
    }

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet tab not found: " + SHEET_NAME);

    const now = new Date();
    const submissionId = payload.submissionId || buildSubmissionId(payload, now);
    const applicationId = payload.applicationId || buildApplicationId(payload, now);
    const registrationStatus = payload.registrationStatus || "part_a_submitted";
    const partAStatus = payload.partAStatus || "part_a_submitted";
    const countries = asList(payload.regions);
    const usSelected = countries.indexOf("United States") !== -1 ? "Yes" : "No";
    validateApplicationTokenForSubmission(spreadsheet, applicationId, payload.privateApplicationToken);

    sheet.appendRow([
      now,
      safeCell(applicationId),
      submissionId,
      safeCell(registrationStatus),
      safeCell(partAStatus),
      "New",
      safeCell(firstValue(payload.displayName, payload.tradingName, payload.legalBusinessName)),
      safeCell(payload.legalBusinessName),
      safeCell(payload.tradingName),
      safeCell(payload.displayName),
      safeCell(payload.companiesHouseNumber),
      safeCell(payload.businessWebsite),
      safeCell(payload.primaryContactName),
      safeCell(payload.primaryContactEmail),
      safeCell(payload.primaryContactPhone),
      safeCell(payload.authorizedRepName),
      safeCell(payload.authorizedRepEmail),
      safeCell(payload.businessIndustry),
      safeCell(payload.primaryUseCase),
      safeCell(payload.monthlyVolume),
      safeCell(countries.join(", ")),
      usSelected,
      usSelected === "Yes" ? "Not yet agreed" : "Not applicable",
      safeCell(payload.organicTraffic),
      safeCell(payload.existingSmsTraffic),
      safeCell(payload.privacyPolicyUrl),
      safeCell(payload.termsUrl),
      safeCell(asList(payload.consentRoute).join(", ")),
      safeCell(payload.optOutDescription),
      JSON.stringify(payload),
      "",
      "Not started",
      "",
      "",
      now
    ]);

    upsertApplicationRecord(spreadsheet, payload, {
      applicationId: applicationId,
      registrationStatus: registrationStatus,
      partAStatus: partAStatus,
      now: now
    });

    notifyAdam(payload, submissionId, countries, usSelected);

    return jsonResponse({
      ok: true,
      applicationId: applicationId,
      submissionId: submissionId,
      registrationStatus: registrationStatus,
      receivedAt: now.toISOString()
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message || String(error)
    });
  } finally {
    lock.releaseLock();
  }
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Missing POST body");
  }
  return JSON.parse(event.postData.contents);
}

function requireCreatePin(payload) {
  const configuredPin = PropertiesService.getScriptProperties().getProperty("ONBOARDING_CREATE_PIN");
  if (!configuredPin) throw new Error("ONBOARDING_CREATE_PIN is not configured");
  if (!payload.createPin || String(payload.createPin) !== String(configuredPin)) {
    throw new Error("Invalid onboarding create PIN");
  }
}

function createApplicationDraft(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId || buildApplicationId(payload, now);
  const privateApplicationToken = payload.privateApplicationToken || buildPrivateApplicationToken();
  const registrationStatus = payload.registrationStatus || "application_created";
  const partAStatus = payload.partAStatus || "draft";

  upsertApplicationRecord(spreadsheet, {
    ...payload,
    privateApplicationToken: privateApplicationToken
  }, {
    applicationId: applicationId,
    registrationStatus: registrationStatus,
    partAStatus: partAStatus,
    now: now,
    lastClientActionAt: ""
  });

  return {
    ok: true,
    applicationId: applicationId,
    registrationStatus: registrationStatus,
    partAStatus: partAStatus,
    privateApplicationLink: buildPrivateApplicationLink(applicationId, privateApplicationToken),
    createdAt: now.toISOString()
  };
}

function validateApplicationTokenForSubmission(spreadsheet, applicationId, suppliedToken) {
  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) return;

  const existingToken = applicationRecord["Private application token"];
  if (!existingToken) return;
  if (suppliedToken && String(suppliedToken) === String(existingToken)) return;
  throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");
}

function upsertApplicationRecord(spreadsheet, payload, options) {
  const sheet = getOrCreateSheet(spreadsheet, APPLICATIONS_SHEET_NAME, APPLICATION_HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = normaliseHeaders(values[0] || APPLICATION_HEADERS);
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) throw new Error("Application ID column not found in Applications sheet");

  let rowNumber = -1;
  let existing = {};
  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][applicationIdColumn]) !== String(options.applicationId)) continue;
    rowNumber = index + 1;
    existing = rowToObject(values[index], headers);
    break;
  }

  const now = options.now;
  const lastClientActionAt = Object.prototype.hasOwnProperty.call(options, "lastClientActionAt") ? options.lastClientActionAt : now;
  const record = {
    "Application ID": options.applicationId,
    "Client ID": firstValue(payload.clientId, existing["Client ID"]),
    "CRM company ID": firstValue(payload.crmCompanyId, existing["CRM company ID"]),
    "CRM deal ID": firstValue(payload.crmDealId, existing["CRM deal ID"]),
    "CRM source record URL": firstValue(payload.crmSourceRecordUrl, existing["CRM source record URL"]),
    "Private application token": firstValue(payload.privateApplicationToken, existing["Private application token"]),
    "Client name": firstValue(payload.displayName, payload.tradingName, payload.legalBusinessName, existing["Client name"]),
    "Legal business name": firstValue(payload.legalBusinessName, existing["Legal business name"]),
    "Trading name": firstValue(payload.tradingName, existing["Trading name"]),
    "Primary contact name": firstValue(payload.primaryContactName, existing["Primary contact name"]),
    "Primary contact email": firstValue(payload.primaryContactEmail, existing["Primary contact email"]),
    "Primary contact phone": firstValue(payload.primaryContactPhone, existing["Primary contact phone"]),
    "Campaign code": firstValue(payload.campaignCode, existing["Campaign code"]),
    "Message code": firstValue(payload.messageCode, existing["Message code"]),
    "Qualified use case": firstValue(payload.qualifiedUseCase, payload.primaryUseCase, existing["Qualified use case"]),
    "Package interest": firstValue(payload.packageInterest, existing["Package interest"]),
    "Handoff date": firstValue(payload.handoffDate, existing["Handoff date"]),
    "Sales context": firstValue(payload.salesContext, existing["Sales context"]),
    "Package name": firstValue(payload.packageName, existing["Package name"]),
    "Registration status": mostAdvancedStatus(existing["Registration status"], options.registrationStatus),
    "Billing status": firstValue(existing["Billing status"], payload.billingStatus),
    "Part A status": firstValue(options.partAStatus, existing["Part A status"]),
    "Part B status": firstValue(existing["Part B status"], payload.partBStatus),
    "Twilio status": firstValue(existing["Twilio status"], payload.twilioStatus),
    "Provider status": firstValue(existing["Provider status"], payload.providerStatus),
    "Internal owner": firstValue(existing["Internal owner"], payload.internalOwner),
    "Created at": firstValue(existing["Created at"], now),
    "Updated at": now,
    "Last client action at": firstValue(lastClientActionAt, existing["Last client action at"]),
    "Last internal action at": firstValue(existing["Last internal action at"], ""),
    "Next action owner": firstValue(existing["Next action owner"], payload.nextActionOwner),
    "Next action note": firstValue(existing["Next action note"], payload.nextActionNote),
    "Internal notes": firstValue(existing["Internal notes"], payload.internalNotes)
  };

  const row = headers.map(function(header) {
    return safeCell(record[header]);
  });

  if (rowNumber === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  }
}

function findApplicationRecord(spreadsheet, criteria) {
  const sheet = spreadsheet.getSheetByName(APPLICATIONS_SHEET_NAME);
  if (!sheet) return null;

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = normaliseHeaders(values[0]);
  const applicationIdColumn = headers.indexOf("Application ID");
  const tokenColumn = headers.indexOf("Private application token");
  const applicationId = typeof criteria === "object" ? criteria.applicationId : criteria;
  const privateApplicationToken = typeof criteria === "object" ? criteria.privateApplicationToken : "";
  if (applicationIdColumn === -1) return null;

  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    const row = values[rowIndex];
    const idMatches = applicationId && String(row[applicationIdColumn]) === String(applicationId);
    const tokenMatches = privateApplicationToken && tokenColumn !== -1 && String(row[tokenColumn]) === String(privateApplicationToken);
    if (applicationId && privateApplicationToken && (!idMatches || !tokenMatches)) continue;
    if (applicationId && !privateApplicationToken && !idMatches) continue;
    if (!applicationId && privateApplicationToken && !tokenMatches) continue;
    if (!applicationId && !privateApplicationToken) continue;
    return rowToObject(row, headers);
  }

  return null;
}

function getOrCreateSheet(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    const currentHeaders = normaliseHeaders(sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0]);
    const missingHeaders = headers.filter(function(header) {
      return currentHeaders.indexOf(header) === -1;
    });
    if (missingHeaders.length) {
      sheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
    }
  }

  return sheet;
}

function rowToObject(row, headers) {
  const output = {};
  headers.forEach(function(header, index) {
    output[header] = row[index] || "";
  });
  return output;
}

function normaliseHeaders(headers) {
  return headers.map(function(header) {
    return String(header || "").trim();
  }).filter(Boolean);
}

function mostAdvancedStatus(existingStatus, incomingStatus) {
  if (!existingStatus) return incomingStatus || "draft";
  if (!incomingStatus) return existingStatus;

  const existingIndex = REGISTRATION_STATUS_ORDER.indexOf(existingStatus);
  const incomingIndex = REGISTRATION_STATUS_ORDER.indexOf(incomingStatus);
  if (existingIndex === -1 || incomingIndex === -1) return incomingStatus;
  return incomingIndex > existingIndex ? incomingStatus : existingStatus;
}

function notifyAdam(payload, submissionId, countries, usSelected) {
  if (!NOTIFY_EMAIL) return;

  const subject = "New RCS Part A received: " + firstValue(payload.displayName, payload.tradingName, payload.legalBusinessName, submissionId);
  const body = [
    "A new RCS Part A submission has been received.",
    "",
    "Submission ID: " + submissionId,
    "Business: " + (payload.legalBusinessName || ""),
    "Trading/display name: " + firstValue(payload.displayName, payload.tradingName, ""),
    "Contact: " + (payload.primaryContactName || ""),
    "Email: " + (payload.primaryContactEmail || ""),
    "Phone: " + (payload.primaryContactPhone || ""),
    "Use case: " + (payload.primaryUseCase || ""),
    "Public profile description: " + (payload.senderDescription || ""),
    "Launch countries: " + countries.join(", "),
    "United States selected: " + usSelected,
    "",
    "Open the intake sheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit"
  ].join("\n");

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function buildSubmissionId(payload, date) {
  const stamp = Utilities.formatDate(date, "Europe/London", "yyyyMMdd-HHmm");
  const name = firstValue(payload.displayName, payload.tradingName, payload.legalBusinessName, "CLIENT")
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18) || "CLIENT";
  return "RCS-" + stamp + "-" + name;
}

function buildApplicationId(payload, date) {
  const stamp = Utilities.formatDate(date, "Europe/London", "yyyyMMddHHmmss");
  const seed = firstValue(payload.displayName, payload.tradingName, payload.legalBusinessName, "CLIENT")
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18) || "CLIENT";
  return "ROQ-RCS-" + stamp + "-" + seed;
}

function buildPrivateApplicationToken() {
  return Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "").slice(0, 16);
}

function buildPrivateApplicationLink(applicationId, privateApplicationToken) {
  return PUBLIC_FORM_URL
    + "?applicationId=" + encodeURIComponent(applicationId)
    + "&applicationToken=" + encodeURIComponent(privateApplicationToken);
}

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return [value];
}

function firstValue() {
  for (let i = 0; i < arguments.length; i += 1) {
    if (arguments[i]) return arguments[i];
  }
  return "";
}

function readColumn(row, headers, name) {
  const index = headers.indexOf(name);
  if (index === -1) return "";
  return row[index] || "";
}

function serialiseDate(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]") return value.toISOString();
  return String(value);
}

function safeCell(value) {
  if (value === null || value === undefined) return "";
  if (Object.prototype.toString.call(value) === "[object Date]") return value;
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
