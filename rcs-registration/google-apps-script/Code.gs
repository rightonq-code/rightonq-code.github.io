const SPREADSHEET_ID = "1_C85rMaDWS0-VnXbtYQzRBS1trgN8kFf4hAnHfT3R-0";
const SHEET_NAME = "Part A submissions";
const APPLICATIONS_SHEET_NAME = "Applications";
const PART_B_APPROVALS_SHEET_NAME = "Part B approvals";
const PART_B_VIDEO_APPROVALS_SHEET_NAME = "Part B video approvals";
const STATUS_EVENTS_SHEET_NAME = "Status events";
const COMMUNICATIONS_SHEET_NAME = "Communications";
const INTERNAL_REVIEWS_SHEET_NAME = "Internal reviews";
const TRUST_HUB_KYC_SHEET_NAME = "Trust Hub KYC";
const UK_RC_BUNDLES_SHEET_NAME = "UK RC bundles";
const TWILIO_SETUP_SHEET_NAME = "Twilio setup";
const BILLING_SHEET_NAME = "Billing";
const PAYMENT_ORDERS_SHEET_NAME = "Payment orders";
const PUBLIC_FORM_URL = "https://rightonq-code.github.io/rcs-registration/index.html";
const NOTIFY_EMAIL = "adam@rightonq.co.uk";
const NOTIFY_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const NOTIFY_RATE_LIMIT_MAX = 5;
const PART_A_PAYMENT_READY_STATUSES = [
  "registration_fee_paid",
  "registration_fee_manually_confirmed",
  "registration_fee_waived"
];
const FAULT_CATEGORIES = [
  "roq_fault",
  "client_fault",
  "external_provider",
  "mixed"
];
const FAULT_CATEGORY_REQUIRED_STATUSES = [
  "rejected",
  "part_a_changes_needed",
  "provider_changes_requested"
];
const PART_A_CORRECTION_EVENT_TYPE = "part_a_correction";
const OPERATOR_REASON_TEXT_LIMIT = 500;
const PART_A_CORRECTABLE_FIELDS = {
  legalBusinessName: { label: "Legal business name" },
  tradingName: { label: "Trading name" },
  senderDisplayName: { label: "Sender display name" },
  companiesHouseNumber: { label: "Companies House number", material: true },
  businessWebsite: { label: "Business website" },
  businessIndustry: { label: "Business industry" },
  customerEmail: { label: "Customer-facing email" },
  customerPhone: { label: "Customer-facing phone" },
  customerWebsite: { label: "Customer-facing website" },
  privacyPolicyUrl: { label: "Privacy policy URL" },
  termsUrl: { label: "Terms URL" },
  senderDescription: { label: "Public profile description" },
  brandColour: { label: "Brand colour" },
  primaryUseCase: { label: "Primary use case" },
  useCaseDescription: { label: "Use case description" },
  messageTrigger: { label: "Message trigger" },
  exampleMessageOne: { label: "Example message 1" },
  exampleMessageTwo: { label: "Example message 2" },
  helpSampleMessage: { label: "HELP sample message" },
  stopSampleMessage: { label: "STOP sample message" },
  optInDescription: { label: "Opt-in description" },
  optOutDescription: { label: "Opt-out description" },
  consentRoutes: { label: "Consent routes" },
  monthlyVolume: { label: "Monthly volume" },
  launchCountries: { label: "Launch countries" },
  notes: { label: "Notes" }
};
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
  "Trust Hub status",
  "Provider status",
  "Created at",
  "Updated at",
  "Last client action at",
  "Last internal action at",
  "Internal owner",
  "Next action owner",
  "Next action note",
  "Internal notes",
  "Fault category",
  "Status reason",
  "Prep work started at",
  "Prep work started by",
  "Prep work start reason"
];
const PART_B_APPROVAL_HEADERS = [
  "Received at",
  "Application ID",
  "Stage",
  "Decision",
  "Tester invite received",
  "Name/logo decision",
  "Issue categories",
  "Issue notes",
  "Registration status",
  "Part B status",
  "Submission JSON",
  "Last updated"
];
const PART_B_VIDEO_APPROVAL_HEADERS = [
  "Received at",
  "Application ID",
  "Stage",
  "Decision",
  "Approval checklist",
  "Changes requested",
  "Change notes",
  "Registration status",
  "Part B status",
  "Submission JSON",
  "Last updated"
];
const STATUS_EVENT_HEADERS = [
  "Received at",
  "Application ID",
  "Event type",
  "Previous registration status",
  "New registration status",
  "Previous Part A status",
  "New Part A status",
  "Previous Part B status",
  "New Part B status",
  "Billing status",
  "Twilio status",
  "Trust Hub status",
  "Provider status",
  "Next action owner",
  "Next action note",
  "Internal owner",
  "Internal notes",
  "Changed by",
  "Source",
  "Submission JSON",
  "Last updated",
  "Fault category",
  "Status reason"
];
const COMMUNICATION_HEADERS = [
  "Created at",
  "Application ID",
  "Communication code",
  "Audience",
  "Recipient email",
  "Recipient name",
  "Subject",
  "Status",
  "Trigger status",
  "Send method",
  "Body",
  "Related event",
  "Last updated"
];
const BILLING_HEADERS = [
  "Created at",
  "Application ID",
  "Client ID",
  "Billing status",
  "Registration fee GBP",
  "Registration fee VAT treatment",
  "Registration fee acknowledgement",
  "Payment provider",
  "Provider customer ID",
  "Checkout/order ID",
  "Payment ID",
  "Payment method ID",
  "Payment status",
  "Payment received at",
  "Refund status",
  "Refund reason",
  "Refund amount GBP",
  "Refund processed at",
  "Monthly plan",
  "Monthly base fee GBP",
  "Monthly billing starts at",
  "Next billing cycle date",
  "Usage/top-up status",
  "Internal notes",
  "Last updated",
  "Usage credit balance GBP",
  "Top-up threshold GBP",
  "Top-up amount GBP",
  "Auto top-up status",
  "Last top-up attempt at",
  "Last top-up status",
  "Last payment status",
  "Billing pause flag",
  "Billing pause reason"
];
const PAYMENT_ORDER_HEADERS = [
  "Created at",
  "Application ID",
  "Revolut order ID",
  "Order state",
  "Amount minor",
  "Currency",
  "Checkout URL",
  "Merchant order reference",
  "Idempotency key",
  "Payment ID",
  "Payment state",
  "Order purpose",
  "Superseded",
  "Internal notes",
  "Last updated"
];
const PAYMENT_ORDER_OPEN_STATES = ["creating", "pending", "processing", "authorised", "authorized"];
const PAYMENT_ORDER_PAID_STATES = ["completed"];
const INTERNAL_REVIEW_HEADERS = [
  "Created at",
  "Application ID",
  "Review status",
  "Assigned owner",
  "Legal/company check",
  "Website/domain check",
  "Public links check",
  "Message purpose/examples check",
  "Consent/opt-out check",
  "KYC/Trust Hub check",
  "SMS fallback/RC bundle check",
  "Phone preview readiness",
  "Next action",
  "Notes",
  "Source status",
  "Last updated"
];
const TRUST_HUB_KYC_HEADERS = [
  "Created at",
  "Application ID",
  "Client ID",
  "Primary customer profile SID",
  "Secondary compliance profile SID",
  "Trust Hub policy SID",
  "Trust Hub profile friendly name",
  "Trust Hub status",
  "Trust Hub status updated at",
  "Trust Hub status callback configured",
  "Trust Hub rejection reason",
  "Trust Hub error code",
  "Trust Hub error detail",
  "Business identity",
  "Business type",
  "Business industry",
  "Business registration identifier",
  "Business registration number",
  "Business regions of operation",
  "Business website match status",
  "Address SID",
  "Address validation status",
  "Supporting document SID",
  "Business info end user SID",
  "Authorised rep 1 end user SID",
  "Authorised rep 2 end user SID",
  "Authorised rep 1 validation status",
  "Authorised rep 2 validation status",
  "Authorised rep exception code",
  "Authorised rep exception action",
  "Evidence collection mode",
  "Evidence status",
  "Evidence provider",
  "Evidence inquiry ID",
  "Evidence registration ID",
  "Evidence requested at",
  "Evidence submitted at",
  "Evidence approved at",
  "Evidence rejected at",
  "Evidence rejection reason",
  "Primary profile assignment status",
  "Business info assignment status",
  "Rep 1 assignment status",
  "Rep 2 assignment status",
  "Address assignment status",
  "Evaluation status",
  "Evaluation last run at",
  "Evaluation error summary",
  "Channel endpoint assignment status",
  "Phone number SID",
  "KYC internal notes",
  "Last updated"
];
const UK_RC_BUNDLE_HEADERS = [
  "Created at",
  "Application ID",
  "Client ID",
  "RC bundle SID",
  "RC bundle status",
  "RC bundle status updated at",
  "RC bundle rejection reason",
  "RC bundle error code",
  "RC bundle error detail",
  "End business legal name",
  "Business registration number",
  "Number type",
  "Phone number SID",
  "Phone number",
  "Phone number assignment status",
  "Address SID",
  "Supporting document SID",
  "Compliance owner",
  "Fallback required",
  "Internal notes",
  "Last updated",
  "Compliance embeddable supported",
  "Compliance embeddable inquiry ID",
  "Compliance embeddable registration ID",
  "Compliance embeddable status",
  "Compliance embeddable rejection code",
  "Compliance embeddable rejection reason",
  "Compliance embeddable last event",
  "Compliance embeddable last event at"
];
const TWILIO_SETUP_HEADERS = [
  "Created at",
  "Application ID",
  "Client ID",
  "Twilio subaccount SID",
  "Twilio subaccount friendly name",
  "Twilio messaging service SID",
  "RBM agent ID",
  "RBM sender name",
  "RBM logo URL",
  "RBM banner URL",
  "Provider submission reference",
  "Provider submission status",
  "Provider submitted at",
  "Provider last checked at",
  "Provider notes",
  "Phone preview status",
  "Phone preview sent at",
  "Review video URL",
  "Review video status",
  "Registration pack status",
  "Go-live status",
  "Go-live date",
  "Usage pull status",
  "Usage last pulled at",
  "Usage period start",
  "Usage period end",
  "Usage cost GBP",
  "Usage reconciliation status",
  "Manual pause flag",
  "Manual pause reason",
  "Opt-in proof URL(s)",
  "Internal notes",
  "Last updated"
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
  "rejected",
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
      trustHubStatus: applicationRecord["Trust Hub status"] || "",
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
    if (isOperatorOnlyAction(payload.action)) {
      return jsonResponse({
        ok: false,
        rejected: true,
        error: "Operator action is not supported on the public endpoint. Use the authenticated operator API."
      });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (payload.action === "submitNameLogoApproval") {
      return jsonResponse(submitNameLogoApproval(spreadsheet, payload));
    }
    if (payload.action === "submitVideoApproval") {
      return jsonResponse(submitVideoApproval(spreadsheet, payload));
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
    validatePartAPublicSubmissionAccess(spreadsheet, applicationId, payload.privateApplicationToken);

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
      JSON.stringify(sanitiseAuditPayload(payload)),
      "",
      "Not started",
      "",
      "",
      now,
      safeCell(asList(payload.expansionInterest).join(", ")),
      safeCell(payload.termsVersion)
    ]);

    upsertApplicationRecord(spreadsheet, payload, {
      applicationId: applicationId,
      registrationStatus: registrationStatus,
      partAStatus: partAStatus,
      now: now
    });

    queueInternalReview(spreadsheet, {
      applicationId: applicationId,
      applicationRecord: payload,
      triggerStatus: registrationStatus,
      now: now
    });

    queueTrustHubKyc(spreadsheet, {
      applicationId: applicationId,
      applicationRecord: payload,
      now: now
    });

    queueUkRcBundle(spreadsheet, {
      applicationId: applicationId,
      applicationRecord: payload,
      now: now
    });

    queueTwilioSetup(spreadsheet, {
      applicationId: applicationId,
      applicationRecord: payload,
      now: now
    });

    queueBilling(spreadsheet, {
      applicationId: applicationId,
      applicationRecord: payload,
      now: now
    });

    queueCommunication(spreadsheet, "part_a_received", {
      applicationId: applicationId,
      applicationRecord: payload,
      triggerStatus: registrationStatus,
      relatedEvent: "Part A submitted",
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

function isOperatorOnlyAction(action) {
  const operatorActions = {
    createApplicationDraft: true,
    getOperatorSnapshot: true,
    updateApplicationStatus: true,
    markPrepWorkStarted: true,
    recordPartACorrection: true,
    updateBilling: true,
    checkActiveCheckout: true,
    recordPaymentOrder: true,
    lookupPaymentOrder: true,
    updateInternalReview: true,
    ensurePrivateApplicationLink: true,
    updateTrustHubKyc: true,
    updateUkRcBundle: true,
    updateTwilioSetup: true
  };
  return Boolean(action && operatorActions[action]);
}

function rcsOperatorAction(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    if (!payload || !payload.action) throw new Error("Missing operator action");
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (payload.action === "createApplicationDraft") {
      requireCreatePin(payload);
      return serialiseExecutionApiValue(createApplicationDraft(spreadsheet, payload));
    }
    if (payload.action === "getOperatorSnapshot") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(getOperatorSnapshot(spreadsheet, payload));
    }
    if (payload.action === "updateApplicationStatus") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(updateApplicationStatus(spreadsheet, payload));
    }
    if (payload.action === "markPrepWorkStarted") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(markPrepWorkStarted(spreadsheet, payload));
    }
    if (payload.action === "recordPartACorrection") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(recordPartACorrection(spreadsheet, payload));
    }
    if (payload.action === "updateBilling") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(updateBilling(spreadsheet, payload));
    }
    if (payload.action === "checkActiveCheckout") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(checkActiveCheckout(spreadsheet, payload));
    }
    if (payload.action === "recordPaymentOrder") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(recordPaymentOrder(spreadsheet, payload));
    }
    if (payload.action === "lookupPaymentOrder") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(lookupPaymentOrder(spreadsheet, payload));
    }
    if (payload.action === "updateInternalReview") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(updateInternalReview(spreadsheet, payload));
    }
    if (payload.action === "ensurePrivateApplicationLink") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(ensurePrivateApplicationLink(spreadsheet, payload));
    }
    if (payload.action === "updateTrustHubKyc") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(updateTrustHubKyc(spreadsheet, payload));
    }
    if (payload.action === "updateUkRcBundle") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(updateUkRcBundle(spreadsheet, payload));
    }
    if (payload.action === "updateTwilioSetup") {
      requireOperatorPin(payload);
      return serialiseExecutionApiValue(updateTwilioSetup(spreadsheet, payload));
    }

    throw new Error("Unsupported operator action: " + payload.action);
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

function requireOperatorPin(payload) {
  const configuredPin = PropertiesService.getScriptProperties().getProperty("ONBOARDING_OPERATOR_PIN");
  if (!configuredPin) throw new Error("ONBOARDING_OPERATOR_PIN is not configured");
  if (!payload.operatorPin || String(payload.operatorPin) !== String(configuredPin)) {
    throw new Error("Invalid onboarding operator PIN");
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

  queueBilling(spreadsheet, {
    applicationId: applicationId,
    applicationRecord: payload,
    now: now
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

function ensurePrivateApplicationLink(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");
  if (!payload.confirmPrivateLinkRepair) {
    throw new Error("Refusing private application link repair without explicit confirmation.");
  }

  const applicationRecords = findApplicationRecords(spreadsheet, { applicationId: applicationId });
  if (applicationRecords.length === 0) throw new Error("Application not found for private link repair.");
  if (applicationRecords.length > 1) {
    throw new Error("Multiple application rows found for private link repair; refusing to choose one.");
  }
  const applicationRecord = applicationRecords[0];

  let privateApplicationToken = applicationRecord["Private application token"];
  const created = !privateApplicationToken;
  if (created) {
    privateApplicationToken = buildPrivateApplicationToken();
    updateApplicationControlFields(spreadsheet, applicationId, {
      "Private application token": privateApplicationToken,
      "Updated at": now,
      "Last internal action at": now
    });
  }

  return {
    ok: true,
    applicationId: applicationId,
    privateApplicationLink: buildPrivateApplicationLink(applicationId, privateApplicationToken),
    privateApplicationLinkCreated: created,
    note: created
      ? "Private application token was missing and has been repaired for this application row only."
      : "Existing private application token was reused for this application row."
  };
}

function submitNameLogoApproval(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  validateApplicationTokenForSubmission(spreadsheet, applicationId, payload.privateApplicationToken);
  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  validateNameLogoApprovalWindow(applicationRecord);

  const decision = payload.decision || deriveNameLogoDecision(payload);
  const issueCategories = asList(payload.issueCategories);
  const approved = decision === "approve";
  const registrationStatus = approved ? "name_logo_approved" : "name_logo_changes_requested";
  const partBStatus = registrationStatus;
  const nextActionNote = approved
    ? "Prepare the RCS application review video."
    : "Review name/logo feedback before video work starts.";

  const sheet = getOrCreateSheet(spreadsheet, PART_B_APPROVALS_SHEET_NAME, PART_B_APPROVAL_HEADERS);
  sheet.appendRow([
    now,
    safeCell(applicationId),
    "B2 name/logo approval",
    safeCell(decision),
    safeCell(payload.testerReceived),
    safeCell(payload.nameLogoDecision),
    safeCell(issueCategories.join(", ")),
    safeCell(payload.issueNotes),
    safeCell(registrationStatus),
    safeCell(partBStatus),
    JSON.stringify(sanitiseAuditPayload(payload)),
    now
  ]);

  updateApplicationControlFields(spreadsheet, applicationId, {
    "Registration status": registrationStatus,
    "Part B status": partBStatus,
    "Updated at": now,
    "Last client action at": now,
    "Next action owner": "RightOnQ",
    "Next action note": nextActionNote
  });

  queueCommunication(spreadsheet, approved ? "name_logo_approved_received" : "name_logo_feedback_received", {
    applicationId: applicationId,
    applicationRecord: findApplicationRecord(spreadsheet, { applicationId: applicationId }),
    triggerStatus: registrationStatus,
    relatedEvent: "B2 name/logo response",
    now: now
  });

  notifyNameLogoApproval(payload, decision, issueCategories, registrationStatus);

  return {
    ok: true,
    applicationId: applicationId,
    decision: decision,
    registrationStatus: registrationStatus,
    partBStatus: partBStatus,
    receivedAt: now.toISOString()
  };
}

function deriveNameLogoDecision(payload) {
  if (payload.testerReceived === "not-yet") return "not_yet";
  if (payload.testerReceived === "help") return "help";
  if (payload.nameLogoDecision === "approve") return "approve";
  if (payload.nameLogoDecision === "note") return "note";
  return "issue";
}

function submitVideoApproval(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  validateApplicationTokenForSubmission(spreadsheet, applicationId, payload.privateApplicationToken);
  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  validateVideoApprovalWindow(applicationRecord);

  const decision = payload.decision === "changes_requested" ? "changes_requested" : "approve";
  const approved = decision === "approve";
  const approvalChecklist = asList(payload.approvalChecklist);
  const changeCategories = asList(payload.changeCategories);
  const registrationStatus = approved ? "video_approved" : "video_changes_requested";
  const partBStatus = registrationStatus;
  const nextActionNote = approved
    ? "Prepare final registration pack for explicit submission approval."
    : "Review requested video changes and prepare an amended review video.";

  const sheet = getOrCreateSheet(spreadsheet, PART_B_VIDEO_APPROVALS_SHEET_NAME, PART_B_VIDEO_APPROVAL_HEADERS);
  sheet.appendRow([
    now,
    safeCell(applicationId),
    "B3 video review",
    safeCell(decision),
    safeCell(approvalChecklist.join(", ")),
    safeCell(changeCategories.join(", ")),
    safeCell(payload.changeNotes),
    safeCell(registrationStatus),
    safeCell(partBStatus),
    JSON.stringify(sanitiseAuditPayload(payload)),
    now
  ]);

  updateApplicationControlFields(spreadsheet, applicationId, {
    "Registration status": registrationStatus,
    "Part B status": partBStatus,
    "Updated at": now,
    "Last client action at": now,
    "Next action owner": "RightOnQ",
    "Next action note": nextActionNote
  });

  queueCommunication(spreadsheet, approved ? "video_approved_received" : "video_changes_received", {
    applicationId: applicationId,
    applicationRecord: findApplicationRecord(spreadsheet, { applicationId: applicationId }),
    triggerStatus: registrationStatus,
    relatedEvent: "B3 video response",
    now: now
  });

  notifyVideoApproval(payload, decision, approvalChecklist, changeCategories, registrationStatus);

  return {
    ok: true,
    applicationId: applicationId,
    decision: decision,
    registrationStatus: registrationStatus,
    partBStatus: partBStatus,
    receivedAt: now.toISOString()
  };
}

function validateNameLogoApprovalWindow(applicationRecord) {
  if (!applicationRecord) throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");

  const registrationStatus = String(applicationRecord["Registration status"] || "");
  const partAStatus = String(applicationRecord["Part A status"] || "");
  const partBStatus = String(applicationRecord["Part B status"] || "");
  const partAReady = partAStatus === "part_a_accepted" || registrationStatus === "part_a_accepted";
  const allowedPartBStatuses = ["", "part_b_in_progress", "name_logo_changes_requested"];

  if (!partAReady) {
    throw new Error("Part B name/logo approval is not open yet. RightOnQ must accept Part A first.");
  }
  if (allowedPartBStatuses.indexOf(partBStatus) === -1) {
    throw new Error("Part B name/logo approval is not open for this application status. Please ask RightOnQ for the next step.");
  }
}

function validateVideoApprovalWindow(applicationRecord) {
  if (!applicationRecord) throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");

  const partBStatus = String(applicationRecord["Part B status"] || "");
  const allowedPartBStatuses = ["name_logo_approved", "video_changes_requested"];

  if (allowedPartBStatuses.indexOf(partBStatus) === -1) {
    throw new Error("Part B video approval is not open yet. Name/logo approval must be recorded before the review video can be approved.");
  }
}

function updateApplicationStatus(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const previous = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!previous) throw new Error("Application ID not found");

  validateRegistrationStatus(payload.registrationStatus);
  validateStatusFaultPayload(payload.registrationStatus, payload.faultCategory);
  const updates = buildStatusUpdates(payload, now);
  if (!Object.keys(updates).length) throw new Error("No status fields supplied");

  updateApplicationControlFields(spreadsheet, applicationId, updates);

  const statusResult = appendStatusEvent(spreadsheet, applicationId, previous, updates, payload, now);

  queueStatusCommunication(spreadsheet, payload, previous, updates, now);

  return {
    ok: true,
    applicationId: applicationId,
    registrationStatus: statusResult.registrationStatus,
    partAStatus: statusResult.partAStatus,
    partBStatus: statusResult.partBStatus,
    updatedAt: now.toISOString()
  };
}

function markPrepWorkStarted(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const previous = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!previous) throw new Error("Application ID not found");

  if (previous["Prep work started at"]) {
    return {
      ok: true,
      applicationId: applicationId,
      alreadySet: true,
      prepWorkStartedAt: serialiseDate(previous["Prep work started at"]),
      prepWorkStartedBy: previous["Prep work started by"] || ""
    };
  }

  if (payload.registrationStatus) {
    validateRegistrationStatus(payload.registrationStatus);
    validateStatusFaultPayload(payload.registrationStatus, payload.faultCategory);
  }

  const prepWorkStartedBy = firstValue(payload.changedBy, payload.operatorName, "operator (PIN-authenticated)");
  const updates = {
    "Prep work started at": now,
    "Prep work started by": prepWorkStartedBy,
    "Prep work start reason": normaliseOperatorReasonText(payload.prepWorkStartReason),
    "Updated at": now,
    "Last internal action at": now
  };

  if (payload.registrationStatus) {
    updates["Registration status"] = payload.registrationStatus;
  }
  if (Object.prototype.hasOwnProperty.call(payload, "faultCategory")) {
    updates["Fault category"] = normaliseFaultCategory(payload.faultCategory);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "statusReason")) {
    updates["Status reason"] = normaliseOperatorReasonText(payload.statusReason);
  }

  updateApplicationControlFields(spreadsheet, applicationId, updates);

  let statusResult = {
    registrationStatus: finalValue(updates["Registration status"], previous["Registration status"]),
    partAStatus: previous["Part A status"] || "",
    partBStatus: previous["Part B status"] || ""
  };
  if (payload.registrationStatus) {
    statusResult = appendStatusEvent(spreadsheet, applicationId, previous, updates, {
      ...payload,
      eventType: firstValue(payload.eventType, "prep_work_started")
    }, now);
  }

  return {
    ok: true,
    applicationId: applicationId,
    alreadySet: false,
    prepWorkStartedAt: now.toISOString(),
    prepWorkStartedBy: prepWorkStartedBy,
    registrationStatus: statusResult.registrationStatus,
    partAStatus: statusResult.partAStatus,
    partBStatus: statusResult.partBStatus
  };
}

function recordPartACorrection(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const field = getPartACorrectableField(payload.fieldKey);
  const newValue = normaliseRequiredCorrectionValue(payload.newValue);
  const reason = normaliseRequiredOperatorReasonText(payload.reason);
  const partARecord = findLatestPartASubmissionRecord(spreadsheet, applicationId);
  if (!partARecord) throw new Error("Part A submission not found for application ID: " + applicationId);
  const partASubmissionId = getPartASubmissionId(partARecord);
  if (!partASubmissionId) throw new Error("Part A submission ID not found for application ID: " + applicationId);

  const existingCorrections = findPartACorrectionEvents(spreadsheet, applicationId, partASubmissionId);
  const currentPartA = buildOperatorPartASubmissionSummary(partARecord, existingCorrections);
  const oldValue = firstValue(currentPartA[field.key]);
  const materialChange = field.material ? true : isTruthy(payload.materialChange);
  const clientReconfirmation = normaliseClientReconfirmation(payload);
  const changedBy = firstValue(payload.changedBy, payload.operatorName, "operator (PIN-authenticated)");

  if (field.material && !materialChange) {
    throw new Error("Material correction flag is required for field: " + payload.fieldKey);
  }

  const correctionPayload = {
    ...payload,
    action: "recordPartACorrection",
    eventType: PART_A_CORRECTION_EVENT_TYPE,
    changedBy: changedBy,
    source: firstValue(payload.source, "operator"),
    fieldKey: field.key,
    fieldLabel: field.label,
    submissionId: partASubmissionId,
    oldValue: oldValue,
    newValue: newValue,
    reason: reason,
    materialChange: materialChange,
    clientReconfirmation: clientReconfirmation || null
  };

  appendStatusEvent(spreadsheet, applicationId, applicationRecord, {}, correctionPayload, now);

  return {
    ok: true,
    applicationId: applicationId,
    eventType: PART_A_CORRECTION_EVENT_TYPE,
    fieldKey: field.key,
    fieldLabel: field.label,
    submissionId: partASubmissionId,
    oldValue: oldValue,
    newValue: newValue,
    materialChange: materialChange,
    clientReconfirmation: clientReconfirmation || null,
    changedBy: changedBy,
    recordedAt: now.toISOString()
  };
}

function appendStatusEvent(spreadsheet, applicationId, previous, updates, payload, now) {
  const registrationStatus = finalValue(updates["Registration status"], previous["Registration status"]);
  const partAStatus = finalValue(updates["Part A status"], previous["Part A status"]);
  const partBStatus = finalValue(updates["Part B status"], previous["Part B status"]);

  const sheet = getOrCreateSheet(spreadsheet, STATUS_EVENTS_SHEET_NAME, STATUS_EVENT_HEADERS);
  sheet.appendRow([
    now,
    safeCell(applicationId),
    safeCell(payload.eventType || "manual_status_update"),
    safeCell(previous["Registration status"]),
    safeCell(registrationStatus),
    safeCell(previous["Part A status"]),
    safeCell(partAStatus),
    safeCell(previous["Part B status"]),
    safeCell(partBStatus),
    safeCell(finalValue(updates["Billing status"], previous["Billing status"])),
    safeCell(finalValue(updates["Twilio status"], previous["Twilio status"])),
    safeCell(finalValue(updates["Trust Hub status"], previous["Trust Hub status"])),
    safeCell(finalValue(updates["Provider status"], previous["Provider status"])),
    safeCell(finalValue(updates["Next action owner"], previous["Next action owner"])),
    safeCell(finalValue(updates["Next action note"], previous["Next action note"])),
    safeCell(finalValue(updates["Internal owner"], previous["Internal owner"])),
    safeCell(finalValue(updates["Internal notes"], previous["Internal notes"])),
    safeCell(firstValue(payload.changedBy, payload.operatorName, "RightOnQ")),
    safeCell(firstValue(payload.source, "operator")),
    JSON.stringify(sanitiseAuditPayload(payload)),
    now,
    safeCell(finalValue(updates["Fault category"], previous["Fault category"])),
    safeCell(finalValue(updates["Status reason"], previous["Status reason"]))
  ]);

  return {
    registrationStatus: registrationStatus,
    partAStatus: partAStatus,
    partBStatus: partBStatus
  };
}

function getOperatorSnapshot(spreadsheet, payload) {
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");
  const applicationSummary = buildOperatorApplicationSummary(applicationRecord);
  const partASubmission = findLatestPartASubmissionSummary(spreadsheet, applicationId);
  const internalReview = findLatestRecordByApplicationId(spreadsheet, INTERNAL_REVIEWS_SHEET_NAME, applicationId, INTERNAL_REVIEW_HEADERS);
  const twilioSetup = findLatestRecordByApplicationId(spreadsheet, TWILIO_SETUP_SHEET_NAME, applicationId, TWILIO_SETUP_HEADERS);

  return {
    ok: true,
    applicationId: applicationId,
    application: applicationSummary,
    operatorSubmissionPack: buildOperatorSubmissionPack({
      application: applicationSummary,
      partASubmission: partASubmission,
      internalReview: internalReview,
      twilioSetup: twilioSetup
    }),
    billing: findLatestRecordByApplicationId(spreadsheet, BILLING_SHEET_NAME, applicationId, BILLING_HEADERS),
    activeCheckout: checkActiveCheckout(spreadsheet, payload),
    paymentOrders: findRecentRecordsByApplicationId(spreadsheet, PAYMENT_ORDERS_SHEET_NAME, applicationId, 10, PAYMENT_ORDER_HEADERS),
    internalReview: internalReview,
    trustHubKyc: findLatestRecordByApplicationId(spreadsheet, TRUST_HUB_KYC_SHEET_NAME, applicationId, TRUST_HUB_KYC_HEADERS),
    ukRcBundle: findLatestRecordByApplicationId(spreadsheet, UK_RC_BUNDLES_SHEET_NAME, applicationId, UK_RC_BUNDLE_HEADERS),
    twilioSetup: twilioSetup,
    recentStatusEvents: findRecentRecordsByApplicationId(spreadsheet, STATUS_EVENTS_SHEET_NAME, applicationId, 5),
    queuedCommunications: findRecentRecordsByApplicationId(spreadsheet, COMMUNICATIONS_SHEET_NAME, applicationId, 5),
    generatedAt: new Date().toISOString()
  };
}

function buildOperatorApplicationSummary(record) {
  return {
    applicationId: record["Application ID"] || "",
    clientId: record["Client ID"] || "",
    crmCompanyId: record["CRM company ID"] || "",
    crmDealId: record["CRM deal ID"] || "",
    crmSourceRecordUrl: record["CRM source record URL"] || "",
    clientName: record["Client name"] || "",
    legalBusinessName: record["Legal business name"] || "",
    tradingName: record["Trading name"] || "",
    primaryContactName: record["Primary contact name"] || "",
    primaryContactEmail: record["Primary contact email"] || "",
    primaryContactPhone: record["Primary contact phone"] || "",
    campaignCode: record["Campaign code"] || "",
    messageCode: record["Message code"] || "",
    qualifiedUseCase: record["Qualified use case"] || "",
    packageInterest: record["Package interest"] || "",
    salesContext: record["Sales context"] || "",
    packageName: record["Package name"] || "",
    registrationStatus: record["Registration status"] || "",
    billingStatus: record["Billing status"] || "",
    partAStatus: record["Part A status"] || "",
    partBStatus: record["Part B status"] || "",
    twilioStatus: record["Twilio status"] || "",
    trustHubStatus: record["Trust Hub status"] || "",
    providerStatus: record["Provider status"] || "",
    internalOwner: record["Internal owner"] || "",
    createdAt: serialiseDate(record["Created at"]),
    updatedAt: serialiseDate(record["Updated at"]),
    lastClientActionAt: serialiseDate(record["Last client action at"]),
    lastInternalActionAt: serialiseDate(record["Last internal action at"]),
    nextActionOwner: record["Next action owner"] || "",
    nextActionNote: record["Next action note"] || "",
    internalNotes: record["Internal notes"] || "",
    faultCategory: record["Fault category"] || "",
    statusReason: record["Status reason"] || "",
    prepWorkStartedAt: serialiseDate(record["Prep work started at"]),
    prepWorkStartedBy: record["Prep work started by"] || "",
    prepWorkStartReason: record["Prep work start reason"] || ""
  };
}

function findLatestPartASubmissionSummary(spreadsheet, applicationId) {
  const record = findLatestPartASubmissionRecord(spreadsheet, applicationId);
  if (!record) return {};
  const submissionId = getPartASubmissionId(record);
  return buildOperatorPartASubmissionSummary(record, findPartACorrectionEvents(spreadsheet, applicationId, submissionId));
}

function findLatestPartASubmissionRecord(spreadsheet, applicationId) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) return null;

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = normaliseHeaders(values[0]);
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) return null;

  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][applicationIdColumn]) !== String(applicationId)) continue;
    return rowToObject(values[index], headers);
  }

  return null;
}

function buildOperatorPartASubmissionSummary(record, correctionEvents) {
  const payload = parseOperatorSubmissionJson(record["Submission JSON"]);
  const consentRoutes = firstValue(
    record["Consent route"],
    record["Consent routes"],
    Array.isArray(payload.consentRoutes) ? payload.consentRoutes.join(", ") : "",
    Array.isArray(payload.consentRoute) ? payload.consentRoute.join(", ") : "",
    payload.consentRoute
  );
  const regions = firstValue(
    record["Regions"],
    Array.isArray(payload.regions) ? payload.regions.join(", ") : "",
    payload.regions
  );

  const summary = {
    receivedAt: serialiseOperatorValue(record["Received at"]),
    submissionId: firstValue(record["Submission ID"], payload.submissionId),
    registrationStatus: firstValue(record["Registration status"], payload.registrationStatus),
    partAStatus: firstValue(record["Part A status"], payload.partAStatus),
    reviewStatus: firstValue(record["Review status"], payload.reviewStatus),
    legalBusinessName: firstValue(record["Legal business name"], payload.legalBusinessName),
    tradingName: firstValue(record["Trading name"], payload.tradingName),
    senderDisplayName: firstValue(record["Sender display name"], record["Client name"], payload.displayName),
    companiesHouseNumber: firstValue(record["Companies House number"], payload.companiesHouseNumber),
    businessWebsite: firstValue(record["Business website"], payload.businessWebsite),
    businessIndustry: firstValue(record["Business industry"], payload.businessIndustry),
    primaryUseCase: firstValue(record["Primary use case"], payload.primaryUseCase),
    senderDescription: firstValue(record["Public profile description"], payload.senderDescription),
    brandColour: firstValue(record["Brand colour"], payload.brandColour),
    customerEmail: firstValue(record["Customer-facing email"], payload.customerEmail),
    customerPhone: firstValue(record["Customer-facing phone"], payload.customerPhone),
    customerWebsite: firstValue(record["Customer-facing website"], payload.customerWebsite, payload.businessWebsite),
    privacyPolicyUrl: firstValue(record["Privacy policy URL"], payload.privacyPolicyUrl),
    termsUrl: firstValue(record["Terms URL"], record["Terms and conditions URL"], payload.termsUrl),
    consentRoutes: consentRoutes,
    optInDescription: firstValue(record["Opt-in description"], payload.optInDescription),
    optOutDescription: firstValue(record["Opt-out description"], payload.optOutDescription),
    useCaseDescription: firstValue(record["Use case description"], payload.useCaseDescription),
    messageTrigger: firstValue(record["Message trigger"], payload.messageTrigger),
    exampleMessageOne: firstValue(record["Example message 1"], payload.exampleMessageOne),
    exampleMessageTwo: firstValue(record["Example message 2"], payload.exampleMessageTwo),
    helpSampleMessage: firstValue(record["HELP sample message"], payload.helpSampleMessage),
    stopSampleMessage: firstValue(record["STOP sample message"], payload.stopSampleMessage),
    launchCountries: regions,
    monthlyVolume: firstValue(record["Monthly volume"], payload.monthlyVolume),
    usSelected: firstValue(record["US selected"], payload.usSelected),
    usFeeStatus: firstValue(record["US fee status"], payload.usFeeStatus),
    notes: firstValue(record["Notes"], payload.notes),
    lastUpdated: serialiseOperatorValue(record["Last updated"])
  };
  return applyPartACorrections(summary, correctionEvents || []);
}

function getPartASubmissionId(record) {
  const payload = parseOperatorSubmissionJson(record["Submission JSON"]);
  return firstValue(record["Submission ID"], payload.submissionId);
}

function parseOperatorSubmissionJson(value) {
  if (!value || typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function findPartACorrectionEvents(spreadsheet, applicationId, submissionId) {
  const sheet = spreadsheet.getSheetByName(STATUS_EVENTS_SHEET_NAME);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = normaliseHeaders(values[0]);
  const applicationIdColumn = headers.indexOf("Application ID");
  const eventTypeColumn = headers.indexOf("Event type");
  const auditColumn = headers.indexOf("Submission JSON");
  if (applicationIdColumn === -1 || eventTypeColumn === -1 || auditColumn === -1) return [];
  const targetSubmissionId = firstValue(submissionId);

  const corrections = [];
  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][applicationIdColumn]) !== String(applicationId)) continue;
    if (String(values[index][eventTypeColumn]) !== PART_A_CORRECTION_EVENT_TYPE) continue;
    const auditPayload = parseOperatorSubmissionJson(values[index][auditColumn]);
    if (targetSubmissionId && String(firstValue(auditPayload.submissionId)) !== String(targetSubmissionId)) continue;
    const field = PART_A_CORRECTABLE_FIELDS[auditPayload.fieldKey];
    if (!field) continue;
    corrections.push({
      rowNumber: index + 1,
      fieldKey: auditPayload.fieldKey,
      fieldLabel: auditPayload.fieldLabel || field.label,
      submissionId: firstValue(auditPayload.submissionId),
      oldValue: firstValue(auditPayload.oldValue),
      newValue: firstValue(auditPayload.newValue),
      reason: firstValue(auditPayload.reason),
      materialChange: auditPayload.materialChange === true || String(auditPayload.materialChange).toLowerCase() === "true",
      clientReconfirmation: firstValue(auditPayload.clientReconfirmation),
      changedBy: firstValue(auditPayload.changedBy, auditPayload.operatorName),
      recordedAt: serialiseOperatorValue(values[index][headers.indexOf("Received at")])
    });
  }
  return corrections;
}

function applyPartACorrections(summary, correctionEvents) {
  const output = { ...summary };
  const latestByField = {};

  for (let index = correctionEvents.length - 1; index >= 0; index -= 1) {
    const event = correctionEvents[index];
    if (!event || latestByField[event.fieldKey]) continue;
    latestByField[event.fieldKey] = event;
  }

  const appliedCorrections = {};
  const providerSubmissionGates = [];
  Object.keys(latestByField).forEach(function(fieldKey) {
    const event = latestByField[fieldKey];
    output[fieldKey] = event.newValue;
    appliedCorrections[fieldKey] = {
      fieldKey: fieldKey,
      fieldLabel: event.fieldLabel,
      submissionId: event.submissionId,
      oldValue: event.oldValue,
      newValue: event.newValue,
      reason: event.reason,
      materialChange: event.materialChange,
      clientReconfirmation: event.clientReconfirmation,
      changedBy: event.changedBy,
      recordedAt: event.recordedAt,
      rowNumber: event.rowNumber
    };

    if (fieldKey === "companiesHouseNumber" && event.materialChange && !event.clientReconfirmation) {
      providerSubmissionGates.push({
        fieldKey: fieldKey,
        fieldLabel: event.fieldLabel,
        gate: "client_reconfirmation_required",
        message: "Provider submission is gated pending client reconfirmation of the corrected Companies House number."
      });
    }
  });

  output.corrections = appliedCorrections;
  output.providerSubmissionCorrectionGate = providerSubmissionGates.length ? "gated" : "clear";
  output.providerSubmissionCorrectionGateReasons = providerSubmissionGates;
  return output;
}

function chooseOperatorPackValue(candidates) {
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const value = firstValue(candidate.value);
    if (!value) continue;
    return {
      value: value,
      source: candidate.source || ""
    };
  }
  return {
    value: "",
    source: ""
  };
}

function partACorrectionSource(partA, fieldKey, fallbackSource) {
  const correction = partA && partA.corrections ? partA.corrections[fieldKey] : null;
  return correction ? "Operator correction overlay / " + (correction.fieldLabel || fieldKey) : fallbackSource;
}

function buildOperatorSubmissionPack(context) {
  const application = context.application || {};
  const partA = context.partASubmission || {};
  const twilioSetup = context.twilioSetup || {};
  const internalReview = context.internalReview || {};
  const packFields = {
    senderDisplayName: chooseOperatorPackValue([
      { value: twilioSetup["RBM sender name"], source: "Twilio setup / RBM sender name" },
      { value: partA.senderDisplayName, source: partACorrectionSource(partA, "senderDisplayName", "Part A submission / sender display name") },
      { value: application.clientName, source: "Applications / client name" },
      { value: application.tradingName, source: "Applications / trading name" },
      { value: application.legalBusinessName, source: "Applications / legal business name" }
    ]),
    legalBusinessName: chooseOperatorPackValue([
      { value: partA.legalBusinessName, source: partACorrectionSource(partA, "legalBusinessName", "Part A submission / legal business name") },
      { value: application.legalBusinessName, source: "Applications / legal business name" }
    ]),
    tradingName: chooseOperatorPackValue([
      { value: partA.tradingName, source: partACorrectionSource(partA, "tradingName", "Part A submission / trading name") },
      { value: application.tradingName, source: "Applications / trading name" }
    ]),
    senderDescription: chooseOperatorPackValue([{ value: partA.senderDescription, source: partACorrectionSource(partA, "senderDescription", "Part A submission / public profile description") }]),
    brandColour: chooseOperatorPackValue([{ value: partA.brandColour, source: partACorrectionSource(partA, "brandColour", "Part A submission / brand colour") }]),
    customerEmail: chooseOperatorPackValue([{ value: partA.customerEmail, source: partACorrectionSource(partA, "customerEmail", "Part A submission / customer-facing email") }]),
    customerPhone: chooseOperatorPackValue([{ value: partA.customerPhone, source: partACorrectionSource(partA, "customerPhone", "Part A submission / customer-facing phone") }]),
    customerWebsite: chooseOperatorPackValue([
      { value: partA.customerWebsite, source: partACorrectionSource(partA, "customerWebsite", "Part A submission / customer-facing website") },
      { value: partA.businessWebsite, source: partACorrectionSource(partA, "businessWebsite", "Part A submission / business website") }
    ]),
    privacyPolicyUrl: chooseOperatorPackValue([{ value: partA.privacyPolicyUrl, source: partACorrectionSource(partA, "privacyPolicyUrl", "Part A submission / privacy policy URL") }]),
    termsUrl: chooseOperatorPackValue([{ value: partA.termsUrl, source: partACorrectionSource(partA, "termsUrl", "Part A submission / terms URL") }]),
    rbmLogoUrl: chooseOperatorPackValue([{ value: twilioSetup["RBM logo URL"], source: "Twilio setup / reviewed hosted RBM logo URL" }]),
    rbmBannerUrl: chooseOperatorPackValue([{ value: twilioSetup["RBM banner URL"], source: "Twilio setup / reviewed hosted RBM banner URL" }]),
    primaryUseCase: chooseOperatorPackValue([
      { value: partA.primaryUseCase, source: partACorrectionSource(partA, "primaryUseCase", "Part A submission / primary use case") },
      { value: application.qualifiedUseCase, source: "Applications / qualified use case" }
    ]),
    useCaseDescription: chooseOperatorPackValue([{ value: partA.useCaseDescription, source: partACorrectionSource(partA, "useCaseDescription", "Part A submission / use-case description") }]),
    messageTrigger: chooseOperatorPackValue([{ value: partA.messageTrigger, source: partACorrectionSource(partA, "messageTrigger", "Part A submission / message trigger") }]),
    exampleMessageOne: chooseOperatorPackValue([{ value: partA.exampleMessageOne, source: partACorrectionSource(partA, "exampleMessageOne", "Part A submission / example message 1") }]),
    exampleMessageTwo: chooseOperatorPackValue([{ value: partA.exampleMessageTwo, source: partACorrectionSource(partA, "exampleMessageTwo", "Part A submission / example message 2") }]),
    helpSampleMessage: chooseOperatorPackValue([{ value: partA.helpSampleMessage, source: partACorrectionSource(partA, "helpSampleMessage", "Part A submission / HELP sample message") }]),
    stopSampleMessage: chooseOperatorPackValue([{ value: partA.stopSampleMessage, source: partACorrectionSource(partA, "stopSampleMessage", "Part A submission / STOP sample message") }]),
    consentRoutes: chooseOperatorPackValue([{ value: partA.consentRoutes, source: partACorrectionSource(partA, "consentRoutes", "Part A submission / consent routes") }]),
    optInDescription: chooseOperatorPackValue([{ value: partA.optInDescription, source: partACorrectionSource(partA, "optInDescription", "Part A submission / opt-in description") }]),
    optOutDescription: chooseOperatorPackValue([{ value: partA.optOutDescription, source: partACorrectionSource(partA, "optOutDescription", "Part A submission / opt-out description") }]),
    optInProofUrls: chooseOperatorPackValue([{ value: twilioSetup["Opt-in proof URL(s)"], source: "Twilio setup / reviewed hosted opt-in proof URL(s)" }]),
    reviewVideoUrl: chooseOperatorPackValue([{ value: twilioSetup["Review video URL"], source: "Twilio setup / reviewed hosted review video URL" }]),
    launchCountries: chooseOperatorPackValue([{ value: partA.launchCountries, source: partACorrectionSource(partA, "launchCountries", "Part A submission / launch countries") }])
  };

  return {
    purpose: "Internal operator copy view for manual Twilio RCS Sender submission preparation. This is not approval to submit.",
    applicationId: firstValue(application.applicationId, partA.applicationId, twilioSetup["Application ID"]),
    senderProfile: {
      senderDisplayName: packFields.senderDisplayName.value,
      legalBusinessName: packFields.legalBusinessName.value,
      tradingName: packFields.tradingName.value,
      senderDescription: packFields.senderDescription.value,
      brandColour: packFields.brandColour.value,
      customerEmail: packFields.customerEmail.value,
      customerPhone: packFields.customerPhone.value,
      customerWebsite: packFields.customerWebsite.value,
      privacyPolicyUrl: packFields.privacyPolicyUrl.value,
      termsUrl: packFields.termsUrl.value,
      rbmLogoUrl: packFields.rbmLogoUrl.value,
      rbmBannerUrl: packFields.rbmBannerUrl.value
    },
    useCaseAndConsent: {
      primaryUseCase: packFields.primaryUseCase.value,
      useCaseDescription: packFields.useCaseDescription.value,
      messageTrigger: packFields.messageTrigger.value,
      exampleMessageOne: packFields.exampleMessageOne.value,
      exampleMessageTwo: packFields.exampleMessageTwo.value,
      helpSampleMessage: packFields.helpSampleMessage.value,
      stopSampleMessage: packFields.stopSampleMessage.value,
      consentRoutes: packFields.consentRoutes.value,
      optInDescription: packFields.optInDescription.value,
      optOutDescription: packFields.optOutDescription.value,
      optInProofUrls: packFields.optInProofUrls.value,
      reviewVideoUrl: packFields.reviewVideoUrl.value,
      launchCountries: packFields.launchCountries.value
    },
    reviewAndGates: {
      partAStatus: firstValue(application.partAStatus, partA.partAStatus),
      partBStatus: application.partBStatus || "",
      internalReviewStatus: internalReview["Review status"] || "",
      reviewVideoStatus: twilioSetup["Review video status"] || "",
      registrationPackStatus: twilioSetup["Registration pack status"] || "",
      providerSubmissionStatus: twilioSetup["Provider submission status"] || "not_started",
      providerSubmissionCorrectionGate: partA.providerSubmissionCorrectionGate || "clear",
      providerSubmissionCorrectionGateReasons: partA.providerSubmissionCorrectionGateReasons || [],
      goLiveStatus: twilioSetup["Go-live status"] || "not_started",
      usagePullStatus: twilioSetup["Usage pull status"] || "not_started",
      manualPauseFlag: twilioSetup["Manual pause flag"] || ""
    },
    canonicalSources: {
      senderProfile: {
        senderDisplayName: packFields.senderDisplayName.source,
        legalBusinessName: packFields.legalBusinessName.source,
        tradingName: packFields.tradingName.source,
        senderDescription: packFields.senderDescription.source,
        brandColour: packFields.brandColour.source,
        customerEmail: packFields.customerEmail.source,
        customerPhone: packFields.customerPhone.source,
        customerWebsite: packFields.customerWebsite.source,
        privacyPolicyUrl: packFields.privacyPolicyUrl.source,
        termsUrl: packFields.termsUrl.source,
        rbmLogoUrl: packFields.rbmLogoUrl.source,
        rbmBannerUrl: packFields.rbmBannerUrl.source
      },
      useCaseAndConsent: {
        primaryUseCase: packFields.primaryUseCase.source,
        useCaseDescription: packFields.useCaseDescription.source,
        messageTrigger: packFields.messageTrigger.source,
        exampleMessageOne: packFields.exampleMessageOne.source,
        exampleMessageTwo: packFields.exampleMessageTwo.source,
        helpSampleMessage: packFields.helpSampleMessage.source,
        stopSampleMessage: packFields.stopSampleMessage.source,
        consentRoutes: packFields.consentRoutes.source,
        optInDescription: packFields.optInDescription.source,
        optOutDescription: packFields.optOutDescription.source,
        optInProofUrls: packFields.optInProofUrls.source,
        reviewVideoUrl: packFields.reviewVideoUrl.source,
        launchCountries: packFields.launchCountries.source
      },
      reviewAndGates: {
        partAStatus: "Applications / Part A status, falling back to Part A submission status",
        partBStatus: "Applications / Part B status",
        internalReviewStatus: "Internal reviews / Review status",
        reviewVideoStatus: "Twilio setup / Review video status",
        registrationPackStatus: "Twilio setup / Registration pack status",
        providerSubmissionStatus: "Twilio setup / Provider submission status",
        providerSubmissionCorrectionGate: "Part A correction overlay / provider submission gate",
        providerSubmissionCorrectionGateReasons: "Part A correction overlay / provider submission gate reasons",
        goLiveStatus: "Twilio setup / Go-live status",
        usagePullStatus: "Twilio setup / Usage pull status",
        manualPauseFlag: "Twilio setup / Manual pause flag"
      }
    },
    operatorInstruction: "Run final-pack-preflight against this snapshot and do not submit to Twilio unless the gate is green and RightOnQ explicitly approves provider submission."
  };
}

function updateInternalReview(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const reviewResult = upsertInternalReviewRecord(spreadsheet, payload, now);
  let statusResult = null;
  if (payload.partAAccepted === true || payload.partAAccepted === "true" || payload.reviewStatus === "accepted") {
    const statusPayload = {
      applicationId: applicationId,
      registrationStatus: "part_a_accepted",
      partAStatus: "part_a_accepted",
      nextActionOwner: "RightOnQ",
      nextActionNote: firstValue(payload.nextAction, "Prepare the phone name and logo preview."),
      eventType: "internal_review_completed",
      changedBy: firstValue(payload.changedBy, payload.operatorName, "RightOnQ"),
      source: "internal_review"
    };
    if (payload.assignedOwner) statusPayload.internalOwner = payload.assignedOwner;
    if (payload.notes) statusPayload.internalNotes = payload.notes;
    statusResult = updateApplicationStatus(spreadsheet, statusPayload);
  }

  return {
    ok: true,
    applicationId: applicationId,
    reviewStatus: reviewResult.reviewStatus,
    partAAccepted: Boolean(statusResult),
    registrationStatus: statusResult ? statusResult.registrationStatus : applicationRecord["Registration status"],
    partAStatus: statusResult ? statusResult.partAStatus : applicationRecord["Part A status"],
    updatedAt: now.toISOString()
  };
}

function upsertInternalReviewRecord(spreadsheet, payload, now) {
  const sheet = getOrCreateSheet(spreadsheet, INTERNAL_REVIEWS_SHEET_NAME, INTERNAL_REVIEW_HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = normaliseHeaders(values[0] || INTERNAL_REVIEW_HEADERS);
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) throw new Error("Application ID column not found in Internal reviews sheet");

  let rowNumber = -1;
  let existing = {};
  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][applicationIdColumn]) !== String(payload.applicationId)) continue;
    rowNumber = index + 1;
    existing = rowToObject(values[index], headers);
    break;
  }

  const fieldMap = {
    reviewStatus: "Review status",
    assignedOwner: "Assigned owner",
    legalCompanyCheck: "Legal/company check",
    websiteDomainCheck: "Website/domain check",
    publicLinksCheck: "Public links check",
    messagePurposeExamplesCheck: "Message purpose/examples check",
    consentOptOutCheck: "Consent/opt-out check",
    kycTrustHubCheck: "KYC/Trust Hub check",
    smsFallbackRcBundleCheck: "SMS fallback/RC bundle check",
    phonePreviewReadiness: "Phone preview readiness",
    nextAction: "Next action",
    notes: "Notes",
    sourceStatus: "Source status"
  };

  const record = {};
  INTERNAL_REVIEW_HEADERS.forEach(function(header) {
    record[header] = firstValue(existing[header], "");
  });
  record["Created at"] = firstValue(existing["Created at"], now);
  record["Application ID"] = payload.applicationId;
  record["Last updated"] = now;

  Object.keys(fieldMap).forEach(function(payloadKey) {
    if (!Object.prototype.hasOwnProperty.call(payload, payloadKey)) return;
    record[fieldMap[payloadKey]] = payload[payloadKey];
  });

  const row = headers.map(function(header) {
    return safeCell(record[header]);
  });

  if (rowNumber === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  }

  return {
    reviewStatus: record["Review status"]
  };
}

function updateTrustHubKyc(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const result = upsertTrackingRecord(
    spreadsheet,
    TRUST_HUB_KYC_SHEET_NAME,
    TRUST_HUB_KYC_HEADERS,
    buildTrustHubKycFieldMap(),
    payload,
    now
  );

  if (Object.prototype.hasOwnProperty.call(payload, "trustHubStatus")) {
    updateApplicationStatus(spreadsheet, {
      applicationId: applicationId,
      trustHubStatus: payload.trustHubStatus,
      eventType: "trust_hub_kyc_updated",
      changedBy: firstValue(payload.changedBy, payload.operatorName, "RightOnQ"),
      source: "trust_hub_kyc",
      internalNotes: firstValue(payload.kycInternalNotes, applicationRecord["Internal notes"])
    });
  }

  return {
    ok: true,
    applicationId: applicationId,
    trustHubStatus: result.record["Trust Hub status"] || "",
    secondaryComplianceProfileSid: result.record["Secondary compliance profile SID"] || "",
    evaluationStatus: result.record["Evaluation status"] || "",
    updatedAt: now.toISOString()
  };
}

function updateUkRcBundle(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const result = upsertTrackingRecord(
    spreadsheet,
    UK_RC_BUNDLES_SHEET_NAME,
    UK_RC_BUNDLE_HEADERS,
    buildUkRcBundleFieldMap(),
    payload,
    now
  );

  if (Object.prototype.hasOwnProperty.call(payload, "rcBundleStatus")) {
    const statusPayload = {
      applicationId: applicationId,
      eventType: "uk_rc_bundle_updated",
      changedBy: firstValue(payload.changedBy, payload.operatorName, "RightOnQ"),
      source: "uk_rc_bundle"
    };
    const internalNotes = firstValue(payload.internalNotes, applicationRecord["Internal notes"]);
    if (internalNotes) statusPayload.internalNotes = internalNotes;
    updateApplicationStatus(spreadsheet, statusPayload);
  }

  return {
    ok: true,
    applicationId: applicationId,
    rcBundleStatus: result.record["RC bundle status"] || "",
    rcBundleSid: result.record["RC bundle SID"] || "",
    fallbackRequired: result.record["Fallback required"] || "",
    updatedAt: now.toISOString()
  };
}

function updateTwilioSetup(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const result = upsertTrackingRecord(
    spreadsheet,
    TWILIO_SETUP_SHEET_NAME,
    TWILIO_SETUP_HEADERS,
    buildTwilioSetupFieldMap(),
    payload,
    now
  );

  const statusPayload = {
    applicationId: applicationId,
    eventType: "twilio_setup_updated",
    changedBy: firstValue(payload.changedBy, payload.operatorName, "RightOnQ"),
    source: "twilio_setup"
  };
  if (Object.prototype.hasOwnProperty.call(payload, "twilioStatus")) {
    statusPayload.twilioStatus = payload.twilioStatus;
  }
  if (Object.prototype.hasOwnProperty.call(payload, "providerSubmissionStatus")) {
    statusPayload.providerStatus = payload.providerSubmissionStatus;
  }
  if (Object.prototype.hasOwnProperty.call(payload, "manualPauseFlag") && String(payload.manualPauseFlag || "").toLowerCase() === "yes") {
    statusPayload.registrationStatus = "paused_operational";
  }
  const internalNotes = firstValue(payload.internalNotes, payload.providerNotes, applicationRecord["Internal notes"]);
  if (internalNotes) statusPayload.internalNotes = internalNotes;

  if (statusPayload.twilioStatus || statusPayload.providerStatus || statusPayload.registrationStatus || statusPayload.internalNotes) {
    updateApplicationStatus(spreadsheet, statusPayload);
  }

  return {
    ok: true,
    applicationId: applicationId,
    twilioSubaccountSid: result.record["Twilio subaccount SID"] || "",
    providerSubmissionStatus: result.record["Provider submission status"] || "",
    goLiveStatus: result.record["Go-live status"] || "",
    manualPauseFlag: result.record["Manual pause flag"] || "",
    updatedAt: now.toISOString()
  };
}

function updateBilling(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const billingPayload = { ...payload };
  const existingBillingRecord = findLatestRecordByApplicationId(
    spreadsheet,
    BILLING_SHEET_NAME,
    applicationId,
    BILLING_HEADERS
  );
  applyDefaultPayloadValue(billingPayload, "registrationFeeGbp", existingBillingRecord["Registration fee GBP"], "100");
  applyDefaultPayloadValue(billingPayload, "registrationFeeVatTreatment", existingBillingRecord["Registration fee VAT treatment"], "+ VAT");
  applyDefaultPayloadValue(billingPayload, "refundStatus", existingBillingRecord["Refund status"], "not_required");
  applyDefaultPayloadValue(billingPayload, "usageTopUpStatus", existingBillingRecord["Usage/top-up status"], "not_started");
  applyDefaultPayloadValue(
    billingPayload,
    "monthlyPlan",
    existingBillingRecord["Monthly plan"],
    firstValue(applicationRecord["Package name"], applicationRecord["Package interest"])
  );

  const result = upsertTrackingRecord(
    spreadsheet,
    BILLING_SHEET_NAME,
    BILLING_HEADERS,
    buildBillingFieldMap(),
    billingPayload,
    now
  );

  if (Object.prototype.hasOwnProperty.call(payload, "billingStatus")) {
    updateApplicationStatus(spreadsheet, {
      applicationId: applicationId,
      billingStatus: payload.billingStatus,
      eventType: "billing_updated",
      changedBy: firstValue(payload.changedBy, payload.operatorName, "RightOnQ"),
      source: "billing",
      internalNotes: firstValue(payload.internalNotes, applicationRecord["Internal notes"])
    });
  }

  return {
    ok: true,
    applicationId: applicationId,
    billingStatus: result.record["Billing status"] || "",
    paymentProvider: result.record["Payment provider"] || "",
    checkoutOrderId: result.record["Checkout/order ID"] || "",
    paymentStatus: result.record["Payment status"] || "",
    usageTopUpStatus: result.record["Usage/top-up status"] || "",
    usageCreditBalanceGbp: result.record["Usage credit balance GBP"] || "",
    billingPauseFlag: result.record["Billing pause flag"] || "",
    updatedAt: now.toISOString()
  };
}

function checkActiveCheckout(spreadsheet, payload) {
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");

  const latestOrders = findLatestPaymentOrderSnapshots(spreadsheet, applicationId);
  const paidOrder = latestOrders.find(function(record) {
    return !isTruthy(record["Superseded"]) && PAYMENT_ORDER_PAID_STATES.indexOf(normaliseState(record["Order state"])) !== -1;
  });
  if (paidOrder) {
    return {
      ok: true,
      applicationId: applicationId,
      decision: "already_paid",
      canCreateCheckout: false,
      order: buildPaymentOrderSummary(paidOrder),
      reason: "A non-superseded Revolut order is already completed for this application."
    };
  }

  const activeOrder = latestOrders.find(function(record) {
    return !isTruthy(record["Superseded"]) && PAYMENT_ORDER_OPEN_STATES.indexOf(normaliseState(record["Order state"])) !== -1;
  });
  if (activeOrder) {
    return {
      ok: true,
      applicationId: applicationId,
      decision: "reuse",
      canCreateCheckout: false,
      order: buildPaymentOrderSummary(activeOrder),
      reason: "A non-superseded Revolut checkout is still open for this application."
    };
  }

  return {
    ok: true,
    applicationId: applicationId,
    decision: "safe_to_create",
    canCreateCheckout: true,
    order: null,
    reason: "No completed or open non-superseded Revolut checkout was found for this application."
  };
}

function recordPaymentOrder(spreadsheet, payload) {
  const now = new Date();
  const applicationId = payload.applicationId;
  if (!applicationId) throw new Error("Missing application ID");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("Application ID not found");
  if (!payload.revolutOrderId && normaliseState(payload.orderState) !== "creating") {
    throw new Error("Missing Revolut order ID");
  }

  const record = {
    "Created at": firstValue(payload.orderCreatedAt, now),
    "Application ID": applicationId,
    "Revolut order ID": firstValue(payload.revolutOrderId, payload.checkoutOrderId),
    "Order state": firstValue(payload.orderState, "pending"),
    "Amount minor": payload.amountMinor,
    "Currency": payload.currency,
    "Checkout URL": payload.checkoutUrl,
    "Merchant order reference": firstValue(payload.merchantOrderReference, payload.reference, applicationId),
    "Idempotency key": payload.idempotencyKey,
    "Payment ID": payload.paymentId,
    "Payment state": payload.paymentState,
    "Order purpose": firstValue(payload.orderPurpose, "registration_fee"),
    "Superseded": firstValue(payload.superseded, "no"),
    "Internal notes": payload.internalNotes,
    "Last updated": now
  };

  appendTrackingRecord(spreadsheet, PAYMENT_ORDERS_SHEET_NAME, PAYMENT_ORDER_HEADERS, record);
  const activeCheckout = checkActiveCheckout(spreadsheet, { applicationId: applicationId });

  return {
    ok: true,
    applicationId: applicationId,
    revolutOrderId: record["Revolut order ID"] || "",
    orderState: record["Order state"] || "",
    orderPurpose: record["Order purpose"] || "",
    activeCheckout: activeCheckout,
    updatedAt: now.toISOString()
  };
}

function lookupPaymentOrder(spreadsheet, payload) {
  const revolutOrderId = firstValue(payload.revolutOrderId, payload.checkoutOrderId, payload.orderId);
  if (!revolutOrderId) throw new Error("Missing Revolut order ID");

  const record = findLatestPaymentOrderByRevolutOrderId(spreadsheet, revolutOrderId);
  if (!record) {
    return {
      ok: true,
      found: false,
      revolutOrderId: revolutOrderId,
      reason: "No Payment orders ledger row was found for this Revolut order ID."
    };
  }

  return {
    ok: true,
    found: true,
    applicationId: record["Application ID"] || "",
    revolutOrderId: revolutOrderId,
    order: buildPaymentOrderSummary(record),
    reason: "Found the latest Payment orders ledger row for this Revolut order ID."
  };
}

function findLatestPaymentOrderSnapshots(spreadsheet, applicationId) {
  const records = findRecentRecordsByApplicationId(spreadsheet, PAYMENT_ORDERS_SHEET_NAME, applicationId, 200, PAYMENT_ORDER_HEADERS);
  const seen = {};
  return records.filter(function(record) {
    const orderId = record["Revolut order ID"] || "";
    const key = orderId || [
      record["Created at"] || "",
      record["Order state"] || "",
      record["Checkout URL"] || ""
    ].join("|");
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function findLatestPaymentOrderByRevolutOrderId(spreadsheet, revolutOrderId) {
  const sheet = spreadsheet.getSheetByName(PAYMENT_ORDERS_SHEET_NAME);
  if (!sheet) return null;
  const values = sheet.getDataRange().getValues();
  const headers = normaliseHeaders(values[0] || PAYMENT_ORDER_HEADERS);
  const orderIdColumn = headers.indexOf("Revolut order ID");
  if (orderIdColumn === -1) throw new Error("Revolut order ID column not found in Payment orders sheet");

  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][orderIdColumn]) === String(revolutOrderId)) {
      return rowToObject(values[index], headers);
    }
  }
  return null;
}

function buildPaymentOrderSummary(record) {
  return {
    applicationId: record["Application ID"] || "",
    revolutOrderId: record["Revolut order ID"] || "",
    orderState: record["Order state"] || "",
    amountMinor: record["Amount minor"] === 0 ? 0 : record["Amount minor"] || "",
    currency: record["Currency"] || "",
    checkoutUrlPresent: Boolean(record["Checkout URL"]),
    checkoutUrl: record["Checkout URL"] || "",
    merchantOrderReference: record["Merchant order reference"] || "",
    idempotencyKey: record["Idempotency key"] || "",
    paymentId: record["Payment ID"] || "",
    paymentState: record["Payment state"] || "",
    orderPurpose: record["Order purpose"] || "",
    superseded: record["Superseded"] || "",
    lastUpdated: serialiseDate(record["Last updated"] || "")
  };
}

function normaliseState(value) {
  return String(value || "").trim().toLowerCase();
}

function isTruthy(value) {
  return ["yes", "true", "1", "superseded"].indexOf(normaliseState(value)) !== -1;
}

function appendTrackingRecord(spreadsheet, sheetName, headersList, record) {
  const sheet = getOrCreateSheet(spreadsheet, sheetName, headersList);
  const headers = normaliseHeaders(sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headersList.length)).getValues()[0]);
  sheet.appendRow(headers.map(function(header) {
    return safeCell(record[header]);
  }));
}

function applyDefaultPayloadValue(payload, key, existingValue, defaultValue) {
  if (Object.prototype.hasOwnProperty.call(payload, key)) return;
  if (firstValue(existingValue, "")) return;
  const value = firstValue(defaultValue, "");
  if (!value) return;
  payload[key] = value;
}

function upsertTrackingRecord(spreadsheet, sheetName, headersList, fieldMap, payload, now) {
  const sheet = getOrCreateSheet(spreadsheet, sheetName, headersList);
  const values = sheet.getDataRange().getValues();
  const headers = normaliseHeaders(values[0] || headersList);
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) throw new Error("Application ID column not found in " + sheetName + " sheet");

  let rowNumber = -1;
  let existing = {};
  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][applicationIdColumn]) !== String(payload.applicationId)) continue;
    rowNumber = index + 1;
    existing = rowToObject(values[index], headers);
    break;
  }

  const record = {};
  headersList.forEach(function(header) {
    record[header] = firstValue(existing[header], "");
  });
  record["Created at"] = firstValue(existing["Created at"], now);
  record["Application ID"] = payload.applicationId;
  record["Last updated"] = now;

  Object.keys(fieldMap).forEach(function(payloadKey) {
    if (!Object.prototype.hasOwnProperty.call(payload, payloadKey)) return;
    record[fieldMap[payloadKey]] = payload[payloadKey];
  });

  if (Object.prototype.hasOwnProperty.call(record, "Trust Hub status updated at") && Object.prototype.hasOwnProperty.call(payload, "trustHubStatus")) {
    record["Trust Hub status updated at"] = now;
  }
  if (Object.prototype.hasOwnProperty.call(record, "RC bundle status updated at") && Object.prototype.hasOwnProperty.call(payload, "rcBundleStatus")) {
    record["RC bundle status updated at"] = now;
  }

  const row = headers.map(function(header) {
    return safeCell(record[header]);
  });

  if (rowNumber === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  }

  return {
    record: record
  };
}

function buildTrustHubKycFieldMap() {
  return {
    clientId: "Client ID",
    primaryCustomerProfileSid: "Primary customer profile SID",
    secondaryComplianceProfileSid: "Secondary compliance profile SID",
    trustHubPolicySid: "Trust Hub policy SID",
    trustHubProfileFriendlyName: "Trust Hub profile friendly name",
    trustHubStatus: "Trust Hub status",
    trustHubStatusCallbackConfigured: "Trust Hub status callback configured",
    trustHubRejectionReason: "Trust Hub rejection reason",
    trustHubErrorCode: "Trust Hub error code",
    trustHubErrorDetail: "Trust Hub error detail",
    businessIdentity: "Business identity",
    businessType: "Business type",
    businessIndustry: "Business industry",
    businessRegistrationIdentifier: "Business registration identifier",
    businessRegistrationNumber: "Business registration number",
    businessRegionsOfOperation: "Business regions of operation",
    businessWebsiteMatchStatus: "Business website match status",
    addressSid: "Address SID",
    addressValidationStatus: "Address validation status",
    supportingDocumentSid: "Supporting document SID",
    businessInfoEndUserSid: "Business info end user SID",
    authorisedRep1EndUserSid: "Authorised rep 1 end user SID",
    authorisedRep2EndUserSid: "Authorised rep 2 end user SID",
    authorisedRep1ValidationStatus: "Authorised rep 1 validation status",
    authorisedRep2ValidationStatus: "Authorised rep 2 validation status",
    authorisedRepExceptionCode: "Authorised rep exception code",
    authorisedRepExceptionAction: "Authorised rep exception action",
    evidenceCollectionMode: "Evidence collection mode",
    evidenceStatus: "Evidence status",
    evidenceProvider: "Evidence provider",
    evidenceInquiryId: "Evidence inquiry ID",
    evidenceRegistrationId: "Evidence registration ID",
    evidenceRequestedAt: "Evidence requested at",
    evidenceSubmittedAt: "Evidence submitted at",
    evidenceApprovedAt: "Evidence approved at",
    evidenceRejectedAt: "Evidence rejected at",
    evidenceRejectionReason: "Evidence rejection reason",
    primaryProfileAssignmentStatus: "Primary profile assignment status",
    businessInfoAssignmentStatus: "Business info assignment status",
    rep1AssignmentStatus: "Rep 1 assignment status",
    rep2AssignmentStatus: "Rep 2 assignment status",
    addressAssignmentStatus: "Address assignment status",
    evaluationStatus: "Evaluation status",
    evaluationLastRunAt: "Evaluation last run at",
    evaluationErrorSummary: "Evaluation error summary",
    channelEndpointAssignmentStatus: "Channel endpoint assignment status",
    phoneNumberSid: "Phone number SID",
    kycInternalNotes: "KYC internal notes"
  };
}

function buildUkRcBundleFieldMap() {
  return {
    clientId: "Client ID",
    complianceEmbeddableSupported: "Compliance embeddable supported",
    complianceEmbeddableInquiryId: "Compliance embeddable inquiry ID",
    complianceEmbeddableRegistrationId: "Compliance embeddable registration ID",
    complianceEmbeddableStatus: "Compliance embeddable status",
    complianceEmbeddableRejectionCode: "Compliance embeddable rejection code",
    complianceEmbeddableRejectionReason: "Compliance embeddable rejection reason",
    complianceEmbeddableLastEvent: "Compliance embeddable last event",
    complianceEmbeddableLastEventAt: "Compliance embeddable last event at",
    rcBundleSid: "RC bundle SID",
    rcBundleStatus: "RC bundle status",
    rcBundleRejectionReason: "RC bundle rejection reason",
    rcBundleErrorCode: "RC bundle error code",
    rcBundleErrorDetail: "RC bundle error detail",
    endBusinessLegalName: "End business legal name",
    businessRegistrationNumber: "Business registration number",
    numberType: "Number type",
    phoneNumberSid: "Phone number SID",
    phoneNumber: "Phone number",
    phoneNumberAssignmentStatus: "Phone number assignment status",
    addressSid: "Address SID",
    supportingDocumentSid: "Supporting document SID",
    complianceOwner: "Compliance owner",
    fallbackRequired: "Fallback required",
    internalNotes: "Internal notes"
  };
}

function buildTwilioSetupFieldMap() {
  return {
    clientId: "Client ID",
    twilioSubaccountSid: "Twilio subaccount SID",
    twilioSubaccountFriendlyName: "Twilio subaccount friendly name",
    twilioMessagingServiceSid: "Twilio messaging service SID",
    rbmAgentId: "RBM agent ID",
    rbmSenderName: "RBM sender name",
    rbmLogoUrl: "RBM logo URL",
    rbmBannerUrl: "RBM banner URL",
    providerSubmissionReference: "Provider submission reference",
    providerSubmissionStatus: "Provider submission status",
    providerSubmittedAt: "Provider submitted at",
    providerLastCheckedAt: "Provider last checked at",
    providerNotes: "Provider notes",
    phonePreviewStatus: "Phone preview status",
    phonePreviewSentAt: "Phone preview sent at",
    reviewVideoUrl: "Review video URL",
    reviewVideoStatus: "Review video status",
    registrationPackStatus: "Registration pack status",
    goLiveStatus: "Go-live status",
    goLiveDate: "Go-live date",
    usagePullStatus: "Usage pull status",
    usageLastPulledAt: "Usage last pulled at",
    usagePeriodStart: "Usage period start",
    usagePeriodEnd: "Usage period end",
    usageCostGbp: "Usage cost GBP",
    usageReconciliationStatus: "Usage reconciliation status",
    manualPauseFlag: "Manual pause flag",
    manualPauseReason: "Manual pause reason",
    optInProofUrls: "Opt-in proof URL(s)",
    internalNotes: "Internal notes"
  };
}

function buildBillingFieldMap() {
  return {
    clientId: "Client ID",
    billingStatus: "Billing status",
    registrationFeeGbp: "Registration fee GBP",
    registrationFeeVatTreatment: "Registration fee VAT treatment",
    registrationFeeAcknowledgement: "Registration fee acknowledgement",
    paymentProvider: "Payment provider",
    providerCustomerId: "Provider customer ID",
    checkoutOrderId: "Checkout/order ID",
    paymentId: "Payment ID",
    paymentMethodId: "Payment method ID",
    paymentStatus: "Payment status",
    paymentReceivedAt: "Payment received at",
    refundStatus: "Refund status",
    refundReason: "Refund reason",
    refundAmountGbp: "Refund amount GBP",
    refundProcessedAt: "Refund processed at",
    monthlyPlan: "Monthly plan",
    monthlyBaseFeeGbp: "Monthly base fee GBP",
    monthlyBillingStartsAt: "Monthly billing starts at",
    nextBillingCycleDate: "Next billing cycle date",
    usageTopUpStatus: "Usage/top-up status",
    usageCreditBalanceGbp: "Usage credit balance GBP",
    topUpThresholdGbp: "Top-up threshold GBP",
    topUpAmountGbp: "Top-up amount GBP",
    autoTopUpStatus: "Auto top-up status",
    lastTopUpAttemptAt: "Last top-up attempt at",
    lastTopUpStatus: "Last top-up status",
    lastPaymentStatus: "Last payment status",
    billingPauseFlag: "Billing pause flag",
    billingPauseReason: "Billing pause reason",
    internalNotes: "Internal notes"
  };
}

function validateRegistrationStatus(status) {
  if (!status) return;
  if (REGISTRATION_STATUS_ORDER.indexOf(status) !== -1) return;
  throw new Error("Unknown registration status: " + status);
}

function normaliseFaultCategory(faultCategory) {
  const value = String(faultCategory || "").trim();
  if (!value) return "";
  if (FAULT_CATEGORIES.indexOf(value) !== -1) return value;
  throw new Error("Unknown fault category: " + value);
}

function validateStatusFaultPayload(registrationStatus, faultCategory) {
  const normalisedFaultCategory = normaliseFaultCategory(faultCategory);
  if (registrationStatus && FAULT_CATEGORY_REQUIRED_STATUSES.indexOf(registrationStatus) !== -1 && !normalisedFaultCategory) {
    throw new Error("Fault category is required for registration status: " + registrationStatus);
  }
}

function getPartACorrectableField(fieldKey) {
  const key = String(fieldKey || "").trim();
  if (!key) throw new Error("Missing Part A correction field key");
  if (key === "regions") {
    throw new Error("Part A field is not correctable by key 'regions'; use canonical key 'launchCountries'");
  }
  const field = PART_A_CORRECTABLE_FIELDS[key];
  if (!field) throw new Error("Part A field is not correctable: " + key);
  return {
    key: key,
    label: field.label,
    material: Boolean(field.material)
  };
}

function normaliseRequiredCorrectionValue(value) {
  if (value === null || value === undefined) {
    throw new Error("Missing Part A correction value");
  }
  const text = String(value).trim();
  if (!text) throw new Error("Blank values not permitted; field-clearing is not supported in v1");
  return text;
}

function normaliseRequiredOperatorReasonText(value) {
  const text = normaliseOperatorReasonText(value);
  if (!text) throw new Error("Correction reason is required");
  return text;
}

function normaliseClientReconfirmation(payload) {
  const text = firstValue(
    payload.clientReconfirmation,
    payload.clientReconfirmationNote,
    payload.reconfirmationNote
  );
  return text ? String(text).trim() : "";
}

function buildStatusUpdates(payload, now) {
  const updates = {};
  const fieldMap = {
    registrationStatus: "Registration status",
    billingStatus: "Billing status",
    partAStatus: "Part A status",
    partBStatus: "Part B status",
    twilioStatus: "Twilio status",
    trustHubStatus: "Trust Hub status",
    providerStatus: "Provider status",
    internalOwner: "Internal owner",
    nextActionOwner: "Next action owner",
    nextActionNote: "Next action note",
    internalNotes: "Internal notes",
    faultCategory: "Fault category",
    statusReason: "Status reason"
  };

  Object.keys(fieldMap).forEach(function(payloadKey) {
    if (!Object.prototype.hasOwnProperty.call(payload, payloadKey)) return;
    if (payloadKey === "faultCategory") {
      updates[fieldMap[payloadKey]] = normaliseFaultCategory(payload[payloadKey]);
      return;
    }
    if (payloadKey === "statusReason") {
      updates[fieldMap[payloadKey]] = normaliseOperatorReasonText(payload[payloadKey]);
      return;
    }
    updates[fieldMap[payloadKey]] = payload[payloadKey];
  });

  if (Object.keys(updates).length) {
    updates["Updated at"] = now;
    updates["Last internal action at"] = now;
  }

  return updates;
}

function queueStatusCommunication(spreadsheet, payload, applicationRecord, updates, now) {
  const status = updates["Registration status"];
  const templatesByStatus = {
    part_a_accepted: "part_a_accepted",
    phone_preview_sent: "phone_preview_sent",
    video_ready_for_review: "video_ready_for_review",
    registration_submitted: "registration_submitted"
  };
  const templateCode = templatesByStatus[status];
  if (!templateCode) return;

  queueCommunication(spreadsheet, templateCode, {
    applicationId: payload.applicationId,
    applicationRecord: applicationRecord,
    triggerStatus: status,
    relatedEvent: payload.eventType || "manual_status_update",
    now: now
  });
}

function queueInternalReview(spreadsheet, options) {
  const now = options.now || new Date();
  const record = options.applicationRecord || {};
  const nextAction = [
    "Review Part A for legal/company fit, website/domain match, public links,",
    "message wording, consent/opt-out, KYC readiness, and phone preview readiness."
  ].join(" ");

  const sheet = getOrCreateSheet(spreadsheet, INTERNAL_REVIEWS_SHEET_NAME, INTERNAL_REVIEW_HEADERS);
  sheet.appendRow([
    now,
    safeCell(options.applicationId),
    "pending_review",
    "RightOnQ",
    "pending",
    "pending",
    "pending",
    "pending",
    "pending",
    "pending_trust_hub_review",
    "pending",
    "pending",
    safeCell(nextAction),
    safeCell(buildInternalReviewNotes(record)),
    safeCell(options.triggerStatus),
    now
  ]);
}

function queueTrustHubKyc(spreadsheet, options) {
  const now = options.now || new Date();
  const record = options.applicationRecord || {};
  const sheet = getOrCreateSheet(spreadsheet, TRUST_HUB_KYC_SHEET_NAME, TRUST_HUB_KYC_HEADERS);
  sheet.appendRow([
    now,
    safeCell(options.applicationId),
    safeCell(record.clientId),
    "",
    "",
    "",
    safeCell(firstValue(record.legalBusinessName, record.tradingName, record.displayName)),
    "not_started",
    now,
    "not_configured",
    "",
    "",
    "",
    "direct_customer",
    safeCell(record.companyType),
    safeCell(record.businessIndustry),
    "UK:CRN",
    safeCell(record.companiesHouseNumber),
    "",
    "pending_review",
    "",
    "pending",
    "",
    "",
    "",
    "",
    "pending",
    "not_collected",
    "",
    "",
    "not_required",
    "not_required",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "pending",
    "pending",
    "pending",
    "not_required_for_launch",
    "pending",
    "not_run",
    "",
    "",
    "not_started",
    "",
    safeCell(buildTrustHubKycNotes(record)),
    now
  ]);
}

function buildTrustHubKycNotes(record) {
  const notes = [
    "Legal: " + firstValue(record.legalBusinessName, "not supplied"),
    "CRN: " + firstValue(record.companiesHouseNumber, "not supplied"),
    "Website: " + firstValue(record.businessWebsite, record.customerWebsite, "not supplied"),
    "Primary rep: " + firstValue(record.authorizedRepName, record.primaryContactName, "not supplied"),
    "ID evidence is exception-only; do not store raw ID documents in this Sheet."
  ];
  return notes.join(" | ");
}

function queueUkRcBundle(spreadsheet, options) {
  const now = options.now || new Date();
  const record = options.applicationRecord || {};
  const markets = asList(record.regions);
  const hasUk = markets.indexOf("United Kingdom") !== -1;
  appendTrackingRecord(spreadsheet, UK_RC_BUNDLES_SHEET_NAME, UK_RC_BUNDLE_HEADERS, {
    "Created at": now,
    "Application ID": options.applicationId,
    "Client ID": record.clientId,
    "Compliance embeddable supported": "access_not_confirmed",
    "Compliance embeddable status": hasUk ? "not_started" : "not_required_unless_uk_long_code",
    "RC bundle status": hasUk ? "not_started" : "not_required_unless_uk_long_code",
    "RC bundle status updated at": now,
    "End business legal name": record.legalBusinessName,
    "Business registration number": record.companiesHouseNumber,
    "Number type": "uk_long_code",
    "Phone number assignment status": "not_started",
    "Compliance owner": "end_business",
    "Fallback required": hasUk ? "to_be_confirmed" : "not_required_unless_sms_fallback",
    "Internal notes": buildUkRcBundleNotes(record, hasUk),
    "Last updated": now
  });
}

function buildUkRcBundleNotes(record, hasUk) {
  const notes = [
    "UK launch market selected: " + (hasUk ? "yes" : "no"),
    "RC Bundle is separate from Secondary Compliance Profile.",
    "Assign UK long-code fallback numbers to the end-business bundle before use."
  ];
  if (record.usFeeStatus) notes.push("US fee status: " + record.usFeeStatus);
  return notes.join(" | ");
}

function queueTwilioSetup(spreadsheet, options) {
  const now = options.now || new Date();
  const record = options.applicationRecord || {};
  appendTrackingRecord(spreadsheet, TWILIO_SETUP_SHEET_NAME, TWILIO_SETUP_HEADERS, {
    "Created at": now,
    "Application ID": options.applicationId,
    "Client ID": record.clientId,
    "RBM sender name": firstValue(record.displayName, record.tradingName, record.legalBusinessName),
    "Provider submission status": "not_started",
    "Phone preview status": "not_started",
    "Review video status": "not_started",
    "Registration pack status": "not_started",
    "Go-live status": "not_started",
    "Usage pull status": "not_started",
    "Usage reconciliation status": "not_started",
    "Manual pause flag": "no",
    "Internal notes": buildTwilioSetupNotes(record),
    "Last updated": now
  });
}

function buildTwilioSetupNotes(record) {
  const notes = [
    "Create one Twilio subaccount per client before live sending.",
    "Do not enable chargeable Twilio-backed usage until Trust Hub/RCS approval and billing controls are ready.",
    "Sender: " + firstValue(record.displayName, record.tradingName, record.legalBusinessName, "not supplied")
  ];
  return notes.join(" | ");
}

function queueBilling(spreadsheet, options) {
  const now = options.now || new Date();
  const record = options.applicationRecord || {};
  const payload = {
    applicationId: options.applicationId,
    clientId: record.clientId,
    billingStatus: firstValue(record.billingStatus, "registration_fee_pending"),
    registrationFeeGbp: firstValue(record.registrationFeeGbp, "100"),
    registrationFeeVatTreatment: firstValue(record.registrationFeeVatTreatment, "+ VAT"),
    registrationFeeAcknowledgement: firstValue(record.registrationFeeAcknowledgement, ""),
    paymentProvider: firstValue(record.paymentProvider, "not_selected"),
    providerCustomerId: record.providerCustomerId,
    checkoutOrderId: record.checkoutOrderId,
    paymentId: record.paymentId,
    paymentMethodId: record.paymentMethodId,
    paymentStatus: firstValue(record.paymentStatus, "not_started"),
    paymentReceivedAt: record.paymentReceivedAt,
    refundStatus: firstValue(record.refundStatus, "not_required"),
    refundReason: record.refundReason,
    refundAmountGbp: record.refundAmountGbp,
    refundProcessedAt: record.refundProcessedAt,
    monthlyPlan: firstValue(record.packageName, record.packageInterest),
    monthlyBaseFeeGbp: record.monthlyBaseFeeGbp,
    monthlyBillingStartsAt: record.monthlyBillingStartsAt,
    nextBillingCycleDate: record.nextBillingCycleDate,
    usageTopUpStatus: firstValue(record.usageTopUpStatus, "not_started"),
    usageCreditBalanceGbp: firstValue(record.usageCreditBalanceGbp, ""),
    topUpThresholdGbp: firstValue(record.topUpThresholdGbp, ""),
    topUpAmountGbp: firstValue(record.topUpAmountGbp, ""),
    autoTopUpStatus: firstValue(record.autoTopUpStatus, "not_configured"),
    lastTopUpAttemptAt: record.lastTopUpAttemptAt,
    lastTopUpStatus: firstValue(record.lastTopUpStatus, ""),
    lastPaymentStatus: firstValue(record.lastPaymentStatus, ""),
    billingPauseFlag: firstValue(record.billingPauseFlag, "no"),
    billingPauseReason: record.billingPauseReason,
    internalNotes: buildBillingNotes(record)
  };

  return upsertTrackingRecord(
    spreadsheet,
    BILLING_SHEET_NAME,
    BILLING_HEADERS,
    buildBillingFieldMap(),
    payload,
    now
  );
}

function buildBillingNotes(record) {
  const notes = [
    "Registration fee starts the RCS application work.",
    "Monthly plan starts only after approval and ready-to-use setup.",
    "Live Revolut checkout is not wired yet; use operator updates as payment evidence during pilot."
  ];
  if (record.salesContext) notes.push("Sales context: " + record.salesContext);
  return notes.join(" | ");
}

function buildInternalReviewNotes(record) {
  const notes = [
    "Legal: " + firstValue(record.legalBusinessName, "not supplied"),
    "Brand: " + firstValue(record.displayName, record.tradingName, "not supplied"),
    "Website: " + firstValue(record.businessWebsite, record.customerWebsite, "not supplied"),
    "Use case: " + firstValue(record.primaryUseCase, "not supplied"),
    "KYC: do not request or store ID documents in the static form/Sheet path."
  ];
  return notes.join(" | ");
}

function queueCommunication(spreadsheet, templateCode, options) {
  const now = options.now || new Date();
  const applicationRecord = options.applicationRecord || {};
  const template = buildCommunicationTemplate(templateCode, applicationRecord);
  if (!template) return;

  const sheet = getOrCreateSheet(spreadsheet, COMMUNICATIONS_SHEET_NAME, COMMUNICATION_HEADERS);
  sheet.appendRow([
    now,
    safeCell(options.applicationId),
    safeCell(templateCode),
    safeCell(template.audience),
    safeCell(template.recipientEmail),
    safeCell(template.recipientName),
    safeCell(template.subject),
    "queued_manual_send",
    safeCell(options.triggerStatus),
    "manual",
    safeCell(template.body),
    safeCell(options.relatedEvent),
    now
  ]);
}

function buildCommunicationTemplate(templateCode, applicationRecord) {
  const clientName = firstValue(
    applicationRecord["Primary contact name"],
    applicationRecord.primaryContactName,
    "there"
  );
  const clientEmail = firstValue(
    applicationRecord["Primary contact email"],
    applicationRecord.primaryContactEmail
  );
  const brandName = firstValue(
    applicationRecord["Client name"],
    applicationRecord.displayName,
    applicationRecord.tradingName,
    applicationRecord.legalBusinessName,
    "your RCS application"
  );

  const base = {
    audience: "client",
    recipientEmail: clientEmail,
    recipientName: clientName
  };

  const templates = {
    part_a_received: {
      ...base,
      subject: "RightOnQ has received your RCS Part A details",
      body: "Hi " + clientName + ",\n\nThanks, RightOnQ has received your Part A registration details for " + brandName + ". We will check and process the written details first. Once Part A is accepted, we will move into Part B, starting with the phone name and logo preview.\n\nRightOnQ"
    },
    part_a_accepted: {
      ...base,
      subject: "Your RCS Part A details are ready for the phone preview stage",
      body: "Hi " + clientName + ",\n\nPart A has been checked and accepted for " + brandName + ". RightOnQ can now prepare the phone name and logo preview. We will let you know when the RBM Tester invitation and branded test message have been sent.\n\nRightOnQ"
    },
    phone_preview_sent: {
      ...base,
      subject: "Your RCS phone preview has been sent",
      body: "Hi " + clientName + ",\n\nRightOnQ has sent the RBM Tester invitation and branded test message for " + brandName + ". Please accept the invitation, check how your sender name and logo appear on your phone, then return to Part B to approve it or tell us what needs changing.\n\nRightOnQ"
    },
    name_logo_approved_received: {
      ...base,
      subject: "RightOnQ has received your name and logo approval",
      body: "Hi " + clientName + ",\n\nThanks, we have received your approval for the sender name and logo for " + brandName + ". The next stage is preparing the RCS application review video.\n\nRightOnQ"
    },
    name_logo_feedback_received: {
      ...base,
      subject: "RightOnQ has received your name and logo feedback",
      body: "Hi " + clientName + ",\n\nThanks, we have received your feedback on the phone name/logo preview for " + brandName + ". We will review it before the video stage so any issue can be fixed as early as possible.\n\nRightOnQ"
    },
    video_ready_for_review: {
      ...base,
      subject: "Your RCS review video is ready to check",
      body: "Hi " + clientName + ",\n\nThe RCS application review video for " + brandName + " is ready for you to check. Please review the video, confirm the sender details, message examples, opt-in and opt-out steps, then approve it in Part B or tell us what needs changing.\n\nRightOnQ"
    },
    video_approved_received: {
      ...base,
      subject: "RightOnQ has received your video approval",
      body: "Hi " + clientName + ",\n\nThanks, we have received your approval for the RCS review video for " + brandName + ". RightOnQ can now prepare the registration pack for submission.\n\nRightOnQ"
    },
    video_changes_received: {
      ...base,
      subject: "RightOnQ has received your video change request",
      body: "Hi " + clientName + ",\n\nThanks, we have received your requested changes for the RCS review video for " + brandName + ". We will review and amend the video before submission.\n\nRightOnQ"
    },
    registration_submitted: {
      ...base,
      subject: "Your RCS registration has been submitted",
      body: "Hi " + clientName + ",\n\nRightOnQ has submitted the RCS registration pack for " + brandName + " to the provider and carrier review process. We will keep you updated and flag anything they come back with.\n\nRightOnQ"
    }
  };

  return templates[templateCode] || null;
}

function validateApplicationTokenForSubmission(spreadsheet, applicationId, suppliedToken) {
  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");

  const existingToken = applicationRecord["Private application token"];
  if (!existingToken) throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");
  if (suppliedToken && String(suppliedToken) === String(existingToken)) return;
  throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");
}

function validatePartAPublicSubmissionAccess(spreadsheet, applicationId, suppliedToken) {
  if (!applicationId) throw new Error("Missing application ID");
  if (!suppliedToken) throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");

  const applicationRecord = findApplicationRecord(spreadsheet, { applicationId: applicationId });
  if (!applicationRecord) throw new Error("This application link could not be verified. Please ask RightOnQ for a fresh link.");

  validateApplicationTokenForSubmission(spreadsheet, applicationId, suppliedToken);

  const currentPartAStatus = applicationRecord["Part A status"] || "draft";
  const allowedPartAStatuses = ["draft", "part_a_changes_needed"];
  if (allowedPartAStatuses.indexOf(currentPartAStatus) === -1) {
    throw new Error("Part A has already been submitted for this application. Please ask RightOnQ if you need to make a change.");
  }

  const paymentGateMode = String(PropertiesService.getScriptProperties().getProperty("PART_A_PAYMENT_GATE_MODE") || "advisory").toLowerCase();
  if (paymentGateMode !== "strict") return;

  const billingStatus = applicationRecord["Billing status"] || "";
  if (PART_A_PAYMENT_READY_STATUSES.indexOf(billingStatus) !== -1) return;
  throw new Error("Part A is not open yet. RightOnQ will release this form once the registration fee is confirmed.");
}

function updateApplicationControlFields(spreadsheet, applicationId, updates) {
  const sheet = getOrCreateSheet(spreadsheet, APPLICATIONS_SHEET_NAME, APPLICATION_HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = normaliseHeaders(values[0] || APPLICATION_HEADERS);
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) throw new Error("Application ID column not found in Applications sheet");

  let rowNumber = -1;
  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][applicationIdColumn]) !== String(applicationId)) continue;
    rowNumber = index + 1;
    break;
  }

  if (rowNumber === -1) {
    upsertApplicationRecord(spreadsheet, {}, {
      applicationId: applicationId,
      registrationStatus: updates["Registration status"],
      partAStatus: "",
      now: updates["Updated at"] || new Date(),
      lastClientActionAt: updates["Last client action at"] || ""
    });
    rowNumber = sheet.getLastRow();
  }

  headers.forEach(function(header, index) {
    if (!Object.prototype.hasOwnProperty.call(updates, header)) return;
    sheet.getRange(rowNumber, index + 1).setValue(safeCell(updates[header]));
  });
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
    "Trust Hub status": firstValue(existing["Trust Hub status"], payload.trustHubStatus, "not_started"),
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
  const records = findApplicationRecords(spreadsheet, criteria);
  return records[0] || null;
}

function findApplicationRecords(spreadsheet, criteria) {
  const sheet = getOrCreateSheet(spreadsheet, APPLICATIONS_SHEET_NAME, APPLICATION_HEADERS);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = normaliseHeaders(values[0]);
  const applicationIdColumn = headers.indexOf("Application ID");
  const tokenColumn = headers.indexOf("Private application token");
  const applicationId = typeof criteria === "object" ? criteria.applicationId : criteria;
  const privateApplicationToken = typeof criteria === "object" ? criteria.privateApplicationToken : "";
  if (applicationIdColumn === -1) return [];

  const records = [];
  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    const row = values[rowIndex];
    const idMatches = applicationId && String(row[applicationIdColumn]) === String(applicationId);
    const tokenMatches = privateApplicationToken && tokenColumn !== -1 && String(row[tokenColumn]) === String(privateApplicationToken);
    if (applicationId && privateApplicationToken && (!idMatches || !tokenMatches)) continue;
    if (applicationId && !privateApplicationToken && !idMatches) continue;
    if (!applicationId && privateApplicationToken && !tokenMatches) continue;
    if (!applicationId && !privateApplicationToken) continue;
    records.push(rowToObject(row, headers));
  }

  return records;
}

function findLatestRecordByApplicationId(spreadsheet, sheetName, applicationId, headersList) {
  const records = findRecentRecordsByApplicationId(spreadsheet, sheetName, applicationId, 1, headersList);
  return records.length ? records[0] : {};
}

function findRecentRecordsByApplicationId(spreadsheet, sheetName, applicationId, limit, headersList) {
  const sheet = headersList ? getOrCreateSheet(spreadsheet, sheetName, headersList) : spreadsheet.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = normaliseHeaders(values[0]);
  const applicationIdColumn = headers.indexOf("Application ID");
  if (applicationIdColumn === -1) return [];

  const records = [];
  for (let index = values.length - 1; index >= 1; index -= 1) {
    if (String(values[index][applicationIdColumn]) !== String(applicationId)) continue;
    records.push(sanitiseOperatorRecord(rowToObject(values[index], headers)));
    if (records.length >= limit) break;
  }
  return records;
}

function sanitiseOperatorRecord(record) {
  const output = {};
  Object.keys(record).forEach(function(key) {
    if (key === "Private application token") return;
    if (key === "Submission JSON") {
      output[key] = "[redacted in operator snapshot]";
      return;
    }
    output[key] = serialiseOperatorValue(record[key]);
  });
  return output;
}

function serialiseOperatorValue(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (value === null || typeof value === "undefined") return "";
  if (typeof value === "number") return isFinite(value) ? value : "";
  if (typeof value === "boolean") return value;
  return value || "";
}

function serialiseExecutionApiValue(value) {
  if (value === null || typeof value === "undefined") return "";
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return isNaN(value.getTime()) ? "" : value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(function(item) {
      return serialiseExecutionApiValue(item);
    });
  }
  if (typeof value === "number") {
    return isFinite(value) ? value : "";
  }
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "object") {
    const output = {};
    Object.keys(value).forEach(function(key) {
      const safeKey = String(key);
      if (!safeKey) return;
      output[safeKey] = serialiseExecutionApiValue(value[key]);
    });
    return output;
  }
  return String(value);
}

function getOrCreateSheet(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    if (name === APPLICATIONS_SHEET_NAME) {
      repairApplicationsHeaderDrift(sheet, headers);
    }
    const currentHeaders = normaliseHeaders(sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0]);
    const missingHeaders = headers.filter(function(header) {
      return currentHeaders.indexOf(header) === -1;
    });
    if (missingHeaders.length) {
      const desiredHeaders = currentHeaders.concat(missingHeaders);
      if (sheet.getMaxColumns() < desiredHeaders.length) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), desiredHeaders.length - sheet.getMaxColumns());
      }
      sheet.getRange(1, 1, 1, desiredHeaders.length).setValues([desiredHeaders]);
    }
  }

  return sheet;
}

function repairApplicationsHeaderDrift(sheet, desiredHeaders) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 1) return;

  const currentHeaders = normaliseHeaders(values[0]);
  const internalOwnerColumn = currentHeaders.indexOf("Internal owner");
  const createdAtColumn = currentHeaders.indexOf("Created at");
  const updatedAtColumn = currentHeaders.indexOf("Updated at");
  const lastClientActionAtColumn = currentHeaders.indexOf("Last client action at");
  const lastInternalActionAtColumn = currentHeaders.indexOf("Last internal action at");
  if (internalOwnerColumn === -1 || createdAtColumn === -1 || updatedAtColumn === -1) return;
  if (lastClientActionAtColumn === -1 || lastInternalActionAtColumn === -1) return;
  if (internalOwnerColumn > createdAtColumn) return;

  const driftedRowExists = values.slice(1).some(function(row) {
    return looksLikeSheetTimestamp(row[internalOwnerColumn]) && looksLikeSheetTimestamp(row[createdAtColumn]);
  });
  if (!driftedRowExists) return;

  const extraHeaders = currentHeaders.filter(function(header) {
    return desiredHeaders.indexOf(header) === -1;
  });
  const repairedHeaders = desiredHeaders.concat(extraHeaders);
  if (sheet.getMaxColumns() < repairedHeaders.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), repairedHeaders.length - sheet.getMaxColumns());
  }

  const repairedValues = [repairedHeaders];
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const raw = rowToObject(values[rowIndex], currentHeaders);
    const repairedRecord = {};
    repairedHeaders.forEach(function(header) {
      repairedRecord[header] = firstValue(raw[header], "");
    });

    if (looksLikeSheetTimestamp(raw["Internal owner"]) && looksLikeSheetTimestamp(raw["Created at"])) {
      const oldCreatedAt = raw["Internal owner"];
      const oldUpdatedAt = raw["Created at"];
      const currentUpdatedAt = raw["Updated at"];
      const currentLastClientActionAt = raw["Last client action at"];
      const currentLastInternalActionAt = raw["Last internal action at"];

      repairedRecord["Created at"] = oldCreatedAt;
      if (looksLikeSheetTimestamp(currentLastInternalActionAt) && looksLikeSheetTimestamp(currentUpdatedAt)) {
        repairedRecord["Updated at"] = currentUpdatedAt;
        repairedRecord["Last client action at"] = looksLikeSheetTimestamp(currentLastClientActionAt) ? currentLastClientActionAt : oldUpdatedAt;
        repairedRecord["Last internal action at"] = currentLastInternalActionAt;
      } else {
        repairedRecord["Updated at"] = oldUpdatedAt;
        repairedRecord["Last client action at"] = currentUpdatedAt;
        repairedRecord["Last internal action at"] = currentLastClientActionAt;
      }
      repairedRecord["Internal owner"] = "";
    }

    repairedValues.push(repairedHeaders.map(function(header) {
      return safeCell(repairedRecord[header]);
    }));
  }

  sheet.getRange(1, 1, repairedValues.length, repairedHeaders.length).setValues(repairedValues);
  if (sheet.getLastColumn() > repairedHeaders.length) {
    sheet.getRange(1, repairedHeaders.length + 1, sheet.getLastRow(), sheet.getLastColumn() - repairedHeaders.length).clearContent();
  }
}

function rowToObject(row, headers) {
  const output = {};
  headers.forEach(function(header, index) {
    const value = row[index];
    output[header] = value === 0 ? 0 : value || "";
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
  if (!canSendNotifyEmail("part_a")) return;

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

function notifyNameLogoApproval(payload, decision, issueCategories, registrationStatus) {
  if (!NOTIFY_EMAIL) return;
  if (!canSendNotifyEmail("name_logo")) return;

  const subjectPrefix = decision === "approve" ? "RCS name/logo approved" : "RCS name/logo needs attention";
  const body = [
    "A Part B name/logo response has been received.",
    "",
    "Application ID: " + (payload.applicationId || ""),
    "Decision: " + decision,
    "Tester invite received: " + (payload.testerReceived || ""),
    "Name/logo decision: " + (payload.nameLogoDecision || ""),
    "Issue categories: " + issueCategories.join(", "),
    "Issue notes: " + (payload.issueNotes || ""),
    "Registration status: " + registrationStatus,
    "",
    "Open the intake sheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit"
  ].join("\n");

  MailApp.sendEmail(NOTIFY_EMAIL, subjectPrefix + ": " + (payload.applicationId || "unknown application"), body);
}

function notifyVideoApproval(payload, decision, approvalChecklist, changeCategories, registrationStatus) {
  if (!NOTIFY_EMAIL) return;
  if (!canSendNotifyEmail("video")) return;

  const subjectPrefix = decision === "approve" ? "RCS video approved" : "RCS video changes requested";
  const body = [
    "A Part B video review response has been received.",
    "",
    "Application ID: " + (payload.applicationId || ""),
    "Decision: " + decision,
    "Approval checklist: " + approvalChecklist.join(", "),
    "Changes requested: " + changeCategories.join(", "),
    "Change notes: " + (payload.changeNotes || ""),
    "Registration status: " + registrationStatus,
    "",
    "Open the intake sheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit"
  ].join("\n");

  MailApp.sendEmail(NOTIFY_EMAIL, subjectPrefix + ": " + (payload.applicationId || "unknown application"), body);
}

function canSendNotifyEmail(notificationType) {
  const properties = PropertiesService.getScriptProperties();
  const key = "NOTIFY_RATE_" + String(notificationType || "general").toUpperCase();
  const now = Date.now();
  let state = {};
  try {
    state = JSON.parse(properties.getProperty(key) || "{}");
  } catch (error) {
    state = {};
  }

  if (!state.windowStart || now - Number(state.windowStart) > NOTIFY_RATE_LIMIT_WINDOW_MS) {
    properties.setProperty(key, JSON.stringify({
      windowStart: now,
      count: 1
    }));
    return true;
  }

  const count = Number(state.count || 0);
  if (count >= NOTIFY_RATE_LIMIT_MAX) return false;

  properties.setProperty(key, JSON.stringify({
    windowStart: Number(state.windowStart),
    count: count + 1
  }));
  return true;
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
  return row[index] === 0 ? 0 : row[index] || "";
}

function serialiseDate(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]") return value.toISOString();
  return String(value);
}

function looksLikeSheetTimestamp(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) return true;
  if (typeof value === "number") return value > 40000 && value < 70000;
  if (typeof value !== "string") return false;
  if (!value) return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

function finalValue(incoming, fallback) {
  return incoming === undefined || incoming === null || incoming === "" ? fallback || "" : incoming;
}

function sanitiseAuditPayload(payload) {
  const copy = { ...payload };
  [
    "operatorPin",
    "createPin",
    "privateApplicationToken",
    "applicationToken",
    "private_application_token",
    "token"
  ].forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(copy, key)) copy[key] = "[redacted]";
  });
  return copy;
}

// Plain text only: do not paste secrets, PINs, private links, or raw personal data.
function normaliseOperatorReasonText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim().slice(0, OPERATOR_REASON_TEXT_LIMIT);
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
