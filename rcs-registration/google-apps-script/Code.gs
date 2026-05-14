const SPREADSHEET_ID = "1_C85rMaDWS0-VnXbtYQzRBS1trgN8kFf4hAnHfT3R-0";
const SHEET_NAME = "Part A submissions";
const NOTIFY_EMAIL = "adam@rightonq.co.uk";

function doGet(event) {
  const applicationId = event && event.parameter && event.parameter.applicationId;
  if (applicationId) return jsonResponse(getApplicationStatus(applicationId));

  return jsonResponse({
    ok: true,
    service: "RightOnQ RCS Part A Intake",
    sheetName: SHEET_NAME
  });
}

function getApplicationStatus(applicationId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Sheet tab not found: " + SHEET_NAME);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return {
      ok: true,
      found: false,
      applicationId: applicationId,
      registrationStatus: "draft",
      partAStatus: "draft"
    };
  }

  const headers = values[0].map(function(header) { return String(header); });
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) throw new Error("Application ID column not found");

  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    const row = values[rowIndex];
    if (String(row[applicationIdColumn]) !== String(applicationId)) continue;

    return {
      ok: true,
      found: true,
      applicationId: applicationId,
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
    applicationId: applicationId,
    registrationStatus: "draft",
    partAStatus: "draft"
  };
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = parsePayload(event);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet tab not found: " + SHEET_NAME);

    const now = new Date();
    const submissionId = payload.submissionId || buildSubmissionId(payload, now);
    const applicationId = payload.applicationId || buildApplicationId(payload, now);
    const registrationStatus = payload.registrationStatus || "part_a_submitted";
    const partAStatus = payload.partAStatus || "part_a_submitted";
    const countries = asList(payload.regions);
    const usSelected = countries.indexOf("United States") !== -1 ? "Yes" : "No";

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
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
