const SPREADSHEET_ID = "1_C85rMaDWS0-VnXbtYQzRBS1trgN8kFf4hAnHfT3R-0";
const SHEET_NAME = "Part A submissions";
const NOTIFY_EMAIL = "adam@rightonq.co.uk";

function doGet() {
  return jsonResponse({
    ok: true,
    service: "RightOnQ RCS Part A Intake",
    sheetName: SHEET_NAME
  });
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
    const countries = asList(payload.regions);
    const usSelected = countries.indexOf("United States") !== -1 ? "Yes" : "No";

    sheet.appendRow([
      now,
      submissionId,
      "New",
      firstValue(payload.displayName, payload.tradingName, payload.legalBusinessName),
      payload.legalBusinessName || "",
      payload.tradingName || "",
      payload.displayName || "",
      payload.companiesHouseNumber || "",
      payload.businessWebsite || "",
      payload.primaryContactName || "",
      payload.primaryContactEmail || "",
      payload.primaryContactPhone || "",
      payload.authorizedRepName || "",
      payload.authorizedRepEmail || "",
      payload.businessIndustry || "",
      payload.primaryUseCase || "",
      payload.monthlyVolume || "",
      countries.join(", "),
      usSelected,
      usSelected === "Yes" ? "Not yet agreed" : "Not applicable",
      payload.organicTraffic || "",
      payload.existingSmsTraffic || "",
      payload.privacyPolicyUrl || "",
      payload.termsUrl || "",
      asList(payload.consentRoute).join(", "),
      payload.optOutDescription || "",
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
      submissionId: submissionId,
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

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
