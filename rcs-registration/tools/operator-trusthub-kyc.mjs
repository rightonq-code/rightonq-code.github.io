#!/usr/bin/env node

const DEFAULT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec";

function resolveOperatorWebAppUrl() {
  return process.env.RCS_ONBOARDING_OPERATOR_WEB_APP_URL ||
    process.env.RCS_ONBOARDING_WEB_APP_URL ||
    DEFAULT_WEB_APP_URL;
}

const FIELD_ALIASES = {
  "application-id": "applicationId",
  "client-id": "clientId",
  "primary-customer-profile-sid": "primaryCustomerProfileSid",
  "secondary-compliance-profile-sid": "secondaryComplianceProfileSid",
  "trust-hub-policy-sid": "trustHubPolicySid",
  "trust-hub-profile-friendly-name": "trustHubProfileFriendlyName",
  "trust-hub-status": "trustHubStatus",
  "trust-hub-status-callback-configured": "trustHubStatusCallbackConfigured",
  "trust-hub-rejection-reason": "trustHubRejectionReason",
  "trust-hub-error-code": "trustHubErrorCode",
  "trust-hub-error-detail": "trustHubErrorDetail",
  "business-identity": "businessIdentity",
  "business-type": "businessType",
  "business-industry": "businessIndustry",
  "business-registration-identifier": "businessRegistrationIdentifier",
  "business-registration-number": "businessRegistrationNumber",
  "business-regions-of-operation": "businessRegionsOfOperation",
  "business-website-match-status": "businessWebsiteMatchStatus",
  "address-sid": "addressSid",
  "address-validation-status": "addressValidationStatus",
  "supporting-document-sid": "supportingDocumentSid",
  "business-info-end-user-sid": "businessInfoEndUserSid",
  "authorised-rep-1-end-user-sid": "authorisedRep1EndUserSid",
  "authorised-rep-2-end-user-sid": "authorisedRep2EndUserSid",
  "authorised-rep-1-validation-status": "authorisedRep1ValidationStatus",
  "authorised-rep-2-validation-status": "authorisedRep2ValidationStatus",
  "authorised-rep-exception-code": "authorisedRepExceptionCode",
  "authorised-rep-exception-action": "authorisedRepExceptionAction",
  "evidence-collection-mode": "evidenceCollectionMode",
  "evidence-status": "evidenceStatus",
  "evidence-provider": "evidenceProvider",
  "evidence-inquiry-id": "evidenceInquiryId",
  "evidence-registration-id": "evidenceRegistrationId",
  "evidence-requested-at": "evidenceRequestedAt",
  "evidence-submitted-at": "evidenceSubmittedAt",
  "evidence-approved-at": "evidenceApprovedAt",
  "evidence-rejected-at": "evidenceRejectedAt",
  "evidence-rejection-reason": "evidenceRejectionReason",
  "primary-profile-assignment-status": "primaryProfileAssignmentStatus",
  "business-info-assignment-status": "businessInfoAssignmentStatus",
  "rep-1-assignment-status": "rep1AssignmentStatus",
  "rep-2-assignment-status": "rep2AssignmentStatus",
  "address-assignment-status": "addressAssignmentStatus",
  "evaluation-status": "evaluationStatus",
  "evaluation-last-run-at": "evaluationLastRunAt",
  "evaluation-error-summary": "evaluationErrorSummary",
  "channel-endpoint-assignment-status": "channelEndpointAssignmentStatus",
  "phone-number-sid": "phoneNumberSid",
  "kyc-internal-notes": "kycInternalNotes",
  "operator-name": "operatorName",
  "changed-by": "changedBy"
};

const BOOLEAN_FLAGS = {
  "dry-run": "dryRun"
};

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-trusthub-kyc.mjs --application-id ROQ-RCS-... --trust-hub-status pending_review",
    "",
    "Common fields:",
    "  --application-id                         Required application ID",
    "  --trust-hub-status pending_review        Updates Trust Hub KYC row and Applications.Trust Hub status",
    "  --secondary-compliance-profile-sid BU...",
    "  --trust-hub-policy-sid RN...",
    "  --business-website-match-status passed",
    "  --evaluation-status passed",
    "  --authorised-rep-exception-code 18019",
    "  --authorised-rep-exception-action request_twilio_managed_id_check",
    "  --evidence-collection-mode twilio_managed",
    "  --evidence-status requested",
    "  --evidence-inquiry-id inq_xxxxxxxxxxxxxxxxxxxxxxxx",
    "  --kyc-internal-notes \"Operator note\"",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  Do not use this tool to store passport, driving licence, DOB, proof-of-address, or raw identity documents.",
    "  Use --dry-run to print the payload without sending it."
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

function buildPayload(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live Trust Hub update");
  }

  const payload = {
    action: "updateTrustHubKyc",
    applicationId: options.applicationId
  };

  Object.keys(FIELD_ALIASES).forEach(function(rawName) {
    const fieldName = FIELD_ALIASES[rawName];
    if (fieldName === "applicationId") return;
    if (options[fieldName] !== undefined) payload[fieldName] = options[fieldName];
  });

  if (!options.dryRun) payload.operatorPin = operatorPin;
  return payload;
}

function sanitisePayload(payload) {
  const copy = { ...payload };
  if (copy.operatorPin) copy.operatorPin = "[redacted]";
  return copy;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const payload = buildPayload(options);
  if (options.dryRun) {
    console.log(JSON.stringify(sanitisePayload(payload), null, 2));
    return;
  }

  const webAppUrl = resolveOperatorWebAppUrl();
  const result = await postJson(webAppUrl, payload);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
