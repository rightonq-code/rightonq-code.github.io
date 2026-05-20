#!/usr/bin/env node

import { runOperatorAction } from "./operator-api-client.mjs";

const DEFAULT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec";

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun",
  "confirm-live-proof": "confirmLiveProof"
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
    "  node rcs-registration/tools/proof-public-part-b-guards.mjs --dry-run",
    "  RCS_ONBOARDING_CREATE_PIN=... RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/proof-public-part-b-guards.mjs --confirm-live-proof",
    "",
    "Purpose:",
    "  Creates a synthetic private draft application, then proves the public Part B endpoints reject out-of-order name/logo and video approvals.",
    "",
    "Safety:",
    "  Defaults to --dry-run behavior unless --confirm-live-proof is supplied.",
    "  Live proof creates one synthetic draft application for guard testing.",
    "  The expected public endpoint result is a rejection; successful Part B approval is treated as a failure.",
    "  PINs and private application tokens are never printed."
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

function resolvePublicWebAppUrl() {
  return process.env.RCS_ONBOARDING_PUBLIC_WEB_APP_URL ||
    process.env.RCS_ONBOARDING_WEB_APP_URL ||
    DEFAULT_WEB_APP_URL;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
}

function buildApplicationId(options) {
  return options.applicationId || "ROQ-RCS-TEST-PUBLIC-PARTB-GUARD-" + timestamp();
}

function buildCreatePayload(options, applicationId) {
  const createPin = process.env.RCS_ONBOARDING_CREATE_PIN;
  if (!options.dryRun && !options.confirmLiveProof) {
    throw new Error("Use --dry-run or add --confirm-live-proof for the live guard proof");
  }
  if (options.confirmLiveProof && !createPin) {
    throw new Error("Set RCS_ONBOARDING_CREATE_PIN before running the live guard proof");
  }

  const legalName = options.legalBusinessName || "TEST Public Part B Guard Proof Ltd";
  const tradingName = options.tradingName || "TEST Public Part B Guard Proof";
  const contactName = options.primaryContactName || "Test Part B Guard";
  const contactEmail = options.primaryContactEmail || "test-public-partb-guard@example.com";
  const contactPhone = options.primaryContactPhone || "+44 7000 000004";

  const payload = {
    action: "createApplicationDraft",
    applicationId,
    legalBusinessName: legalName,
    tradingName,
    displayName: tradingName,
    primaryContactName: contactName,
    primaryContactEmail: contactEmail,
    primaryContactPhone: contactPhone,
    crmCompanyId: "CRM-COMPANY-PUBLIC-PARTB-GUARD-TEST",
    crmDealId: "CRM-DEAL-PUBLIC-PARTB-GUARD-TEST",
    campaignCode: "RCS1",
    messageCode: "PUBLIC-PARTB-GUARD-PROOF",
    qualifiedUseCase: "Transactional customer updates",
    packageInterest: "RightOnQ UK",
    packageName: "RightOnQ UK",
    billingStatus: "registration_fee_pending",
    salesContext: "Public Part B order guard proof"
  };

  if (options.confirmLiveProof) payload.createPin = createPin;
  return payload;
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

function extractToken(privateApplicationLink) {
  if (!privateApplicationLink) throw new Error("Operator API did not return privateApplicationLink");
  const url = new URL(privateApplicationLink);
  const token = url.searchParams.get("applicationToken") ||
    url.searchParams.get("privateApplicationToken") ||
    url.searchParams.get("token");
  if (!token) throw new Error("Private application token was not present in created link");
  return token;
}

function buildNameLogoPayload(applicationId, privateApplicationToken) {
  return {
    action: "submitNameLogoApproval",
    applicationId,
    privateApplicationToken,
    decision: "approve",
    testerReceived: "yes",
    nameLogoDecision: "approve",
    issueCategories: [],
    issueNotes: "",
    submittedAt: new Date().toISOString()
  };
}

function buildVideoPayload(applicationId, privateApplicationToken) {
  return {
    action: "submitVideoApproval",
    applicationId,
    privateApplicationToken,
    decision: "approve",
    approvalChecklist: [
      "sender_name",
      "logo",
      "message_examples",
      "permission_route",
      "opt_out_route"
    ],
    changeCategories: [],
    changeNotes: "",
    submittedAt: new Date().toISOString()
  };
}

function sanitisePayload(payload) {
  const copy = JSON.parse(JSON.stringify(payload));
  if (copy.createPin) copy.createPin = "[redacted]";
  if (copy.operatorPin) copy.operatorPin = "[redacted]";
  if (copy.privateApplicationToken) copy.privateApplicationToken = "[redacted]";
  return copy;
}

async function postJsonAllowFailure(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow"
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Non-JSON response from Apps Script: " + text.slice(0, 500));
  }
}

function assertRejected(result, label, expectedText) {
  if (!result || result.ok !== false) {
    throw new Error(label + " was expected to be rejected, but it was accepted");
  }
  const errorText = String(result.error || "");
  if (!errorText.includes(expectedText)) {
    throw new Error(label + " rejected with unexpected error: " + errorText);
  }
  return {
    ok: result.ok,
    rejected: true,
    error: errorText
  };
}

function summariseSnapshot(snapshot) {
  return {
    ok: snapshot.ok,
    applicationId: snapshot.applicationId,
    application: {
      registrationStatus: snapshot.application && snapshot.application.registrationStatus,
      partAStatus: snapshot.application && snapshot.application.partAStatus,
      partBStatus: snapshot.application && snapshot.application.partBStatus,
      nextActionNote: snapshot.application && snapshot.application.nextActionNote
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

  if (!options.confirmLiveProof) options.dryRun = true;

  const applicationId = buildApplicationId(options);
  const createPayload = buildCreatePayload(options, applicationId);
  const dryRunToken = "[private token from created link]";
  const nameLogoPayload = buildNameLogoPayload(applicationId, dryRunToken);
  const videoPayload = buildVideoPayload(applicationId, dryRunToken);

  if (options.dryRun) {
    console.log(JSON.stringify({
      publicWebAppUrl: resolvePublicWebAppUrl(),
      createPayload: sanitisePayload(createPayload),
      expectedRejectedNameLogoPayload: sanitisePayload(nameLogoPayload),
      expectedRejectedVideoPayload: sanitisePayload(videoPayload),
      snapshotPayload: {
        action: "getOperatorSnapshot",
        applicationId,
        operatorPin: "[redacted]"
      }
    }, null, 2));
    return;
  }

  const publicWebAppUrl = resolvePublicWebAppUrl();
  const created = await runOperatorAction(createPayload);
  const privateApplicationToken = extractToken(created.privateApplicationLink);

  const blockedNameLogo = await postJsonAllowFailure(
    publicWebAppUrl,
    buildNameLogoPayload(applicationId, privateApplicationToken)
  );
  const blockedVideo = await postJsonAllowFailure(
    publicWebAppUrl,
    buildVideoPayload(applicationId, privateApplicationToken)
  );
  const snapshot = await runOperatorAction(buildSnapshotPayload(applicationId));

  console.log(JSON.stringify({
    created: {
      ok: created.ok,
      applicationId: created.applicationId,
      registrationStatus: created.registrationStatus,
      partAStatus: created.partAStatus,
      privateApplicationLinkPresent: Boolean(created.privateApplicationLink)
    },
    blockedNameLogo: assertRejected(blockedNameLogo, "name/logo approval", "Part B name/logo approval is not open yet"),
    blockedVideo: assertRejected(blockedVideo, "video approval", "Part B video approval is not open yet"),
    snapshot: summariseSnapshot(snapshot),
    note: "Live proof creates one synthetic draft application. The public Part B calls are expected to reject before writing Part B approval rows."
  }, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
