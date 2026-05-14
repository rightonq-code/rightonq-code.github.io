#!/usr/bin/env node

const DEFAULT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec";

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun"
};

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "legal-business-name": "legalBusinessName",
  "trading-name": "tradingName",
  "primary-contact-email": "primaryContactEmail",
  "primary-contact-name": "primaryContactName",
  "primary-contact-phone": "primaryContactPhone"
};

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_CREATE_PIN=... RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/proof-public-part-a-submit.mjs",
    "",
    "Purpose:",
    "  Creates a private test application, submits Part A through the public Apps Script submission path,",
    "  then reads a redacted operator snapshot to prove Trust Hub KYC and UK RC Bundle rows were created.",
    "",
    "Safety:",
    "  PINs are read from environment variables only.",
    "  The private application token/link is not printed.",
    "  Use --dry-run to print redacted payloads without sending anything."
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

    const fieldName = FIELD_ALIASES[rawName];
    if (!fieldName) throw new Error("Unknown option: " + token);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
    options[fieldName] = value;
    index += 1;
  }
  return options;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
}

function buildApplicationId(options) {
  return options.applicationId || `ROQ-RCS-TEST-PUBLIC-PARTA-${timestamp()}`;
}

function buildCreatePayload(options, applicationId) {
  const createPin = process.env.RCS_ONBOARDING_CREATE_PIN;
  if (!options.dryRun && !createPin) {
    throw new Error("Set RCS_ONBOARDING_CREATE_PIN before running the live proof");
  }

  const legalName = options.legalBusinessName || "TEST Public Part A Proof Ltd";
  const tradingName = options.tradingName || "TEST Public Part A Proof";
  const contactName = options.primaryContactName || "Test Public Submitter";
  const contactEmail = options.primaryContactEmail || "test-public-parta@example.com";
  const contactPhone = options.primaryContactPhone || "+44 7000 000003";

  const payload = {
    action: "createApplicationDraft",
    applicationId,
    legalBusinessName: legalName,
    tradingName,
    displayName: tradingName,
    primaryContactName: contactName,
    primaryContactEmail: contactEmail,
    primaryContactPhone: contactPhone,
    crmCompanyId: "CRM-COMPANY-PUBLIC-PARTA-TEST",
    crmDealId: "CRM-DEAL-PUBLIC-PARTA-TEST",
    campaignCode: "RCS1",
    messageCode: "PUBLIC-PARTA-PROOF",
    qualifiedUseCase: "Transactional customer updates",
    packageInterest: "Local Time Only",
    salesContext: "Public Part A submission proof"
  };

  if (!options.dryRun) payload.createPin = createPin;
  return payload;
}

function buildPartAPayload(createPayload, applicationId, privateApplicationToken) {
  return {
    applicationId,
    privateApplicationToken,
    registrationStatus: "part_a_submitted",
    partAStatus: "part_a_submitted",
    submissionId: `RCS-${timestamp().slice(0, 8)}-PUBLIC-PARTA-PROOF`,
    submittedAt: new Date().toISOString(),
    legalBusinessName: createPayload.legalBusinessName,
    tradingName: createPayload.tradingName,
    companiesHouseNumber: "12345678",
    companyType: "Private limited company",
    registrationCountry: "United Kingdom",
    registeredAddressLine1: "1 Test Street",
    registeredAddressLine2: "",
    registeredCity: "London",
    registeredCounty: "",
    registeredPostcode: "EC1A 1AA",
    registeredAddress: "1 Test Street\nLondon\nEC1A 1AA\nUnited Kingdom",
    businessWebsite: "https://example.com",
    primaryContactName: createPayload.primaryContactName,
    primaryContactEmail: createPayload.primaryContactEmail,
    primaryContactPhone: createPayload.primaryContactPhone,
    authorizedRepName: createPayload.primaryContactName,
    authorizedRepEmail: createPayload.primaryContactEmail,
    authorizedRepTitle: "Director",
    businessIndustry: "Retail",
    displayName: createPayload.displayName,
    brandColour: "#3f8cff",
    customerEmail: createPayload.primaryContactEmail,
    customerPhone: createPayload.primaryContactPhone,
    customerWebsite: "https://example.com",
    privacyPolicyUrl: "https://example.com/privacy",
    termsUrl: "https://example.com/terms",
    notificationEmail: createPayload.primaryContactEmail,
    primaryUseCase: "Transactional",
    senderDescription: "Order updates and service messages from TEST Public Part A Proof.",
    monthlyVolume: "Under 10,000",
    messageTrigger: "Customers receive messages after placing an order or requesting a service update.",
    useCaseDescription: "Transactional customer updates about orders, appointments, support and service progress.",
    exampleMessageOne: "Hi Alex, your order from TEST Public Part A Proof has been received. Reply HELP for support or STOP to opt out.",
    exampleMessageTwo: "Your appointment is confirmed for Friday at 10:00. Reply HELP for support or STOP to opt out.",
    helpSampleMessage: "Thanks for contacting TEST Public Part A Proof. For help, email support@example.com or call +44 7000 000003.",
    stopSampleMessage: "You have opted out of TEST Public Part A Proof messages. You will not receive further RCS updates.",
    consentRoute: ["website_form"],
    consentRoutes: ["website_form"],
    optInDescription: "Customers tick an optional consent box on the website before receiving RCS updates.",
    optOutDescription: "Customers can reply STOP at any time. STOP is shown in message examples and honoured before further sends.",
    reviewerAccess: "Test proof submission only.",
    regions: ["United Kingdom"],
    organicTraffic: "",
    existingSmsTraffic: "",
    accuracyDeclaration: "Confirmed",
    agencySubmissionDeclaration: "Confirmed",
    signatoryName: createPayload.primaryContactName,
    signatoryTitle: "Director",
    iphonePreviewNumber: "+44 7000 000003",
    androidPreviewNumber: "",
    signoffDate: new Date().toISOString().slice(0, 10),
    logoUpload: {
      name: "test-logo.png",
      width: 224,
      height: 224,
      valid: true
    },
    bannerUpload: {
      name: "test-banner.png",
      width: 1440,
      height: 448,
      valid: true
    },
    templateVersion: "2026-05-06"
  };
}

function buildSnapshotPayload(applicationId) {
  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!operatorPin) throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before reading the live snapshot");
  return {
    action: "getOperatorSnapshot",
    applicationId,
    operatorPin
  };
}

function sanitisePayload(payload) {
  const copy = JSON.parse(JSON.stringify(payload));
  if (copy.createPin) copy.createPin = "[redacted]";
  if (copy.operatorPin) copy.operatorPin = "[redacted]";
  if (copy.privateApplicationToken) copy.privateApplicationToken = "[redacted]";
  return copy;
}

function extractToken(privateApplicationLink) {
  const url = new URL(privateApplicationLink);
  const token = url.searchParams.get("applicationToken") ||
    url.searchParams.get("privateApplicationToken") ||
    url.searchParams.get("token");
  if (!token) throw new Error("Private application token was not present in created link");
  return token;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
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

function summariseSnapshot(snapshot) {
  return {
    ok: snapshot.ok,
    applicationId: snapshot.applicationId,
    application: {
      registrationStatus: snapshot.application && snapshot.application.registrationStatus,
      partAStatus: snapshot.application && snapshot.application.partAStatus,
      trustHubStatus: snapshot.application && snapshot.application.trustHubStatus,
      nextActionOwner: snapshot.application && snapshot.application.nextActionOwner,
      nextActionNote: snapshot.application && snapshot.application.nextActionNote
    },
    internalReview: {
      reviewStatus: snapshot.internalReview && snapshot.internalReview["Review status"],
      kycTrustHubCheck: snapshot.internalReview && snapshot.internalReview["KYC/Trust Hub check"],
      smsFallbackRcBundleCheck: snapshot.internalReview && snapshot.internalReview["SMS fallback/RC bundle check"]
    },
    trustHubKyc: {
      present: Boolean(snapshot.trustHubKyc && snapshot.trustHubKyc["Application ID"]),
      status: snapshot.trustHubKyc && snapshot.trustHubKyc["Trust Hub status"],
      profileName: snapshot.trustHubKyc && snapshot.trustHubKyc["Trust Hub profile friendly name"],
      authorisedRepExceptionAction: snapshot.trustHubKyc && snapshot.trustHubKyc["Authorised rep exception action"]
    },
    ukRcBundle: {
      present: Boolean(snapshot.ukRcBundle && snapshot.ukRcBundle["Application ID"]),
      status: snapshot.ukRcBundle && snapshot.ukRcBundle["RC bundle status"],
      fallbackRequired: snapshot.ukRcBundle && snapshot.ukRcBundle["Fallback required"],
      complianceOwner: snapshot.ukRcBundle && snapshot.ukRcBundle["Compliance owner"]
    },
    recentStatusEventTypes: (snapshot.recentStatusEvents || []).map(event => event["Event type"]).filter(Boolean),
    queuedCommunicationCodes: (snapshot.queuedCommunications || []).map(row => row["Communication code"]).filter(Boolean)
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const applicationId = buildApplicationId(options);
  const createPayload = buildCreatePayload(options, applicationId);
  const dryRunPartAPayload = buildPartAPayload(createPayload, applicationId, "[private token from created link]");

  if (options.dryRun) {
    console.log(JSON.stringify({
      createPayload: sanitisePayload(createPayload),
      partAPayload: sanitisePayload(dryRunPartAPayload),
      snapshotPayload: {
        action: "getOperatorSnapshot",
        applicationId,
        operatorPin: "[redacted]"
      }
    }, null, 2));
    return;
  }

  const webAppUrl = process.env.RCS_ONBOARDING_WEB_APP_URL || DEFAULT_WEB_APP_URL;
  const created = await postJson(webAppUrl, createPayload);
  const privateApplicationToken = extractToken(created.privateApplicationLink);
  const partAPayload = buildPartAPayload(createPayload, applicationId, privateApplicationToken);
  const submitted = await postJson(webAppUrl, partAPayload);
  const snapshot = await postJson(webAppUrl, buildSnapshotPayload(applicationId));

  console.log(JSON.stringify({
    created: {
      ok: created.ok,
      applicationId: created.applicationId,
      registrationStatus: created.registrationStatus,
      partAStatus: created.partAStatus,
      privateApplicationLinkPresent: Boolean(created.privateApplicationLink)
    },
    submitted: {
      ok: submitted.ok,
      applicationId: submitted.applicationId,
      submissionId: submitted.submissionId,
      registrationStatus: submitted.registrationStatus,
      receivedAt: submitted.receivedAt
    },
    snapshot: summariseSnapshot(snapshot)
  }, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
