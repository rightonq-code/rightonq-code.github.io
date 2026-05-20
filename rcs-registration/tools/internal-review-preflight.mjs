#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";

const HARD_REVIEW_FIELDS = [
  ["Legal/company check", "legalCompanyCheck"],
  ["Website/domain check", "websiteDomainCheck"],
  ["Public links check", "publicLinksCheck"],
  ["Message purpose/examples check", "messagePurposeExamplesCheck"],
  ["Consent/opt-out check", "consentOptOutCheck"]
];

const PASS_VALUES = new Set(["passed", "pass", "accepted", "approved", "ok", "complete", "completed", "ready"]);
const READY_VALUES = new Set(["ready", "passed", "accepted", "approved", "ok", "complete", "completed"]);
const KYC_PART_A_VALUES = new Set([
  "pending_trust_hub_review",
  "pending_review",
  "pending",
  "passed",
  "accepted",
  "approved",
  "not_required",
  "not_required_for_launch"
]);
const FALLBACK_PART_A_VALUES = new Set([
  "pending",
  "pending_review",
  "to_be_confirmed",
  "passed",
  "accepted",
  "approved",
  "not_required",
  "not_required_for_launch"
]);

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/internal-review-preflight.mjs --snapshot-file operator-status.json",
    "  node rcs-registration/tools/internal-review-preflight.mjs --snapshot-file operator-status.json --strict",
    "  node rcs-registration/tools/internal-review-preflight.mjs --self-test",
    "",
    "Options:",
    "  --snapshot-file PATH   JSON output from operator-status.mjs",
    "  --strict               Exit non-zero for warnings as well as blockers",
    "  --self-test            Run offline fake-snapshot checks",
    "",
    "Safety:",
    "  Offline only. This tool does not call Apps Script, Google Sheets, Twilio, Revolut, Google Cloud, or any provider API.",
    "  It reads a local JSON snapshot and reports whether the internal Part A review is ready for acceptance."
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
    if (token === "--strict") {
      options.strict = true;
      continue;
    }
    if (token === "--self-test") {
      options.selfTest = true;
      continue;
    }
    if (token === "--snapshot-file") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --snapshot-file");
      options.snapshotFile = value;
      index += 1;
      continue;
    }
    throw new Error("Unknown option: " + token);
  }
  return options;
}

function readSnapshot(path) {
  const raw = fs.readFileSync(path, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("Snapshot file is not valid JSON: " + error.message);
  }
}

function valueFrom(record, label, camelName) {
  if (!record || typeof record !== "object") return "";
  const value = record[label] ?? record[camelName] ?? "";
  return value === null || value === undefined ? "" : String(value).trim();
}

function normalise(value) {
  return String(value || "").trim().toLowerCase();
}

function add(list, code, message, field) {
  list.push({ code, message, field });
}

function getApplicationId(snapshot) {
  return (
    snapshot.applicationId ||
    snapshot.application?.applicationId ||
    snapshot.internalReview?.["Application ID"] ||
    snapshot.internalReview?.applicationId ||
    ""
  );
}

function hasValue(record, fieldName) {
  return Boolean(record && String(record[fieldName] || "").trim());
}

function assessInternalReview(snapshot) {
  const blockers = [];
  const warnings = [];
  const info = [];

  if (!snapshot || typeof snapshot !== "object") {
    add(blockers, "invalid_snapshot", "Snapshot must be a JSON object.");
    return buildResult(snapshot, blockers, warnings, info);
  }

  const application = snapshot.application || {};
  const internalReview = snapshot.internalReview || {};
  const billing = snapshot.billing || {};
  const activeCheckout = snapshot.activeCheckout || {};
  const trustHubKyc = snapshot.trustHubKyc || {};
  const ukRcBundle = snapshot.ukRcBundle || {};
  const twilioSetup = snapshot.twilioSetup || {};
  const applicationId = getApplicationId(snapshot);

  if (!applicationId) {
    add(blockers, "missing_application_id", "Snapshot is missing an application ID.", "applicationId");
  }

  if (!Object.keys(application).length) {
    add(blockers, "missing_application", "Snapshot is missing the application summary.", "application");
  }

  if (!Object.keys(internalReview).length) {
    add(blockers, "missing_internal_review", "Snapshot is missing the Internal reviews row.", "internalReview");
  }

  ["legalBusinessName", "tradingName", "primaryContactName", "primaryContactEmail", "qualifiedUseCase"].forEach(function(fieldName) {
    if (!hasValue(application, fieldName)) {
      add(blockers, "missing_" + fieldName, "Application summary is missing " + fieldName + ".", fieldName);
    }
  });

  const registrationStatus = normalise(application.registrationStatus);
  const partAStatus = normalise(application.partAStatus || application.registrationStatus);
  if (!partAStatus) {
    add(blockers, "missing_part_a_status", "Application is missing Part A status.", "partAStatus");
  } else if (partAStatus === "part_a_accepted") {
    add(info, "part_a_already_accepted", "Part A is already accepted in this snapshot.");
  } else if (partAStatus !== "part_a_submitted") {
    add(blockers, "part_a_not_submitted", "Part A status is '" + partAStatus + "'; expected part_a_submitted before acceptance.", "partAStatus");
  }

  if (registrationStatus && registrationStatus !== partAStatus && partAStatus !== "part_a_accepted") {
    add(warnings, "registration_part_a_status_mismatch", "Registration status and Part A status differ; confirm the application state before accepting Part A.", "registrationStatus");
  }

  const reviewStatus = normalise(valueFrom(internalReview, "Review status", "reviewStatus"));
  if (!reviewStatus) {
    add(blockers, "missing_review_status", "Internal review status is missing.", "Review status");
  } else if (["changes_needed", "rejected", "blocked"].includes(reviewStatus)) {
    add(blockers, "review_status_blocks_acceptance", "Internal review status is '" + reviewStatus + "'.", "Review status");
  } else if (reviewStatus === "accepted") {
    add(info, "review_already_accepted", "Internal review is already accepted in this snapshot.");
  } else if (reviewStatus !== "pending_review") {
    add(warnings, "review_status_unusual", "Internal review status is '" + reviewStatus + "'; confirm this is expected before acceptance.", "Review status");
  }

  HARD_REVIEW_FIELDS.forEach(function([label, camelName]) {
    const value = normalise(valueFrom(internalReview, label, camelName));
    if (!value) {
      add(blockers, "missing_" + camelName, label + " is missing.", label);
      return;
    }
    if (!PASS_VALUES.has(value)) {
      add(blockers, "pending_" + camelName, label + " is '" + value + "'; it must be passed before Part A acceptance.", label);
    }
  });

  const kycValue = normalise(valueFrom(internalReview, "KYC/Trust Hub check", "kycTrustHubCheck"));
  if (!kycValue) {
    add(warnings, "missing_kyc_trust_hub_check", "KYC/Trust Hub check is missing; Part A can hold this as pending_trust_hub_review, but it should be explicit.", "KYC/Trust Hub check");
  } else if (!KYC_PART_A_VALUES.has(kycValue)) {
    add(blockers, "kyc_trust_hub_blocks_acceptance", "KYC/Trust Hub check is '" + kycValue + "'; expected pending_trust_hub_review, passed, or not_required at Part A acceptance.", "KYC/Trust Hub check");
  } else if (kycValue.includes("pending")) {
    add(warnings, "kyc_trust_hub_pending", "KYC/Trust Hub remains pending after Part A; this is expected provider-lane work, not a reason to store raw ID evidence.", "KYC/Trust Hub check");
  }

  const fallbackValue = normalise(valueFrom(internalReview, "SMS fallback/RC bundle check", "smsFallbackRcBundleCheck"));
  if (!fallbackValue) {
    add(warnings, "missing_sms_fallback_rc_bundle_check", "SMS fallback/RC bundle check is missing; keep the pending lane explicit before Part A acceptance.", "SMS fallback/RC bundle check");
  } else if (!FALLBACK_PART_A_VALUES.has(fallbackValue)) {
    add(blockers, "sms_fallback_blocks_acceptance", "SMS fallback/RC bundle check is '" + fallbackValue + "'; expected pending, passed, not_required, or to_be_confirmed at Part A acceptance.", "SMS fallback/RC bundle check");
  } else if (["pending", "pending_review", "to_be_confirmed"].includes(fallbackValue)) {
    add(warnings, "sms_fallback_pending", "SMS fallback/RC bundle remains a tracked pending lane after Part A.", "SMS fallback/RC bundle check");
  }

  const phonePreviewValue = normalise(valueFrom(internalReview, "Phone preview readiness", "phonePreviewReadiness"));
  if (!phonePreviewValue) {
    add(blockers, "missing_phone_preview_readiness", "Phone preview readiness is missing.", "Phone preview readiness");
  } else if (!READY_VALUES.has(phonePreviewValue)) {
    add(blockers, "phone_preview_not_ready", "Phone preview readiness is '" + phonePreviewValue + "'; expected ready before Part A acceptance.", "Phone preview readiness");
  }

  const nextAction = valueFrom(internalReview, "Next action", "nextAction");
  if (!nextAction) {
    add(warnings, "missing_next_action", "Internal review next action is missing.", "Next action");
  }

  const billingStatus = normalise(valueFrom(billing, "Billing status", "billingStatus"));
  const activeCheckoutDecision = normalise(activeCheckout.decision);
  if (billingStatus && billingStatus !== "registration_fee_paid" && activeCheckoutDecision !== "already_paid") {
    add(warnings, "registration_fee_not_confirmed", "Billing status is '" + billingStatus + "' and active checkout is not already_paid.", "Billing status");
  } else if (billingStatus && billingStatus !== "registration_fee_paid" && activeCheckoutDecision === "already_paid") {
    add(warnings, "billing_row_not_synced_to_paid", "Active checkout says already_paid, but Billing status is '" + billingStatus + "'. Treat this as proof/sandbox evidence until reconciled.", "Billing status");
  }

  const trustHubStatus = normalise(valueFrom(trustHubKyc, "Trust Hub status", "trustHubStatus"));
  if (trustHubStatus && !["not_started", "pending_review", "in_progress", "approved"].includes(trustHubStatus)) {
    add(warnings, "trust_hub_status_unusual", "Trust Hub status is '" + trustHubStatus + "'; confirm before Part A acceptance.", "Trust Hub status");
  }

  const evidenceMode = normalise(valueFrom(trustHubKyc, "Evidence collection mode", "evidenceCollectionMode"));
  if (evidenceMode && !["not_required", "exception_only", "twilio_managed"].includes(evidenceMode)) {
    add(warnings, "evidence_collection_mode_unusual", "Evidence collection mode is '" + evidenceMode + "'; do not collect raw ID documents in the static app or Sheet.", "Evidence collection mode");
  }

  const rcBundleStatus = normalise(valueFrom(ukRcBundle, "RC bundle status", "rcBundleStatus"));
  if (rcBundleStatus && !["not_started", "pending_review", "in_progress", "approved"].includes(rcBundleStatus)) {
    add(warnings, "rc_bundle_status_unusual", "UK RC Bundle status is '" + rcBundleStatus + "'; confirm before Part A acceptance.", "RC bundle status");
  }

  const providerStatus = normalise(application.providerStatus);
  const providerSubmissionStatus = normalise(valueFrom(twilioSetup, "Provider submission status", "providerSubmissionStatus"));
  if (providerStatus && providerStatus !== "not_started") {
    add(blockers, "provider_status_premature", "Application provider status is '" + providerStatus + "'; provider work should not start before Part A acceptance.", "providerStatus");
  }
  if (providerSubmissionStatus && providerSubmissionStatus !== "not_started") {
    add(blockers, "provider_submission_premature", "Provider submission status is '" + providerSubmissionStatus + "'; expected not_started before final provider gate.", "Provider submission status");
  }

  if (blockers.length === 0 && warnings.length === 0) {
    add(info, "internal_review_clean", "No blockers or warnings found in this offline internal-review snapshot.");
  } else if (blockers.length === 0) {
    add(info, "no_blockers", "No blockers found, but warnings remain before accepting Part A.");
  }

  return buildResult(snapshot, blockers, warnings, info);
}

function buildResult(snapshot, blockers, warnings, info) {
  const applicationId = snapshot && typeof snapshot === "object" ? getApplicationId(snapshot) : "";
  return {
    ok: blockers.length === 0,
    readyForPartAAcceptance: blockers.length === 0 && warnings.length === 0,
    applicationId,
    summary: {
      blockers: blockers.length,
      warnings: warnings.length,
      info: info.length
    },
    blockers,
    warnings,
    info,
    note: "Offline internal-review preflight only. Part A acceptance still requires explicit RightOnQ operator approval."
  };
}

function makeReadySnapshot() {
  return {
    ok: true,
    applicationId: "ROQ-RCS-TEST-READY",
    application: {
      applicationId: "ROQ-RCS-TEST-READY",
      legalBusinessName: "Example Ltd",
      tradingName: "Example",
      primaryContactName: "Jane Smith",
      primaryContactEmail: "jane@example.com",
      qualifiedUseCase: "Transactional",
      registrationStatus: "part_a_submitted",
      partAStatus: "part_a_submitted",
      providerStatus: "not_started"
    },
    internalReview: {
      "Application ID": "ROQ-RCS-TEST-READY",
      "Review status": "pending_review",
      "Legal/company check": "passed",
      "Website/domain check": "passed",
      "Public links check": "passed",
      "Message purpose/examples check": "passed",
      "Consent/opt-out check": "passed",
      "KYC/Trust Hub check": "passed",
      "SMS fallback/RC bundle check": "passed",
      "Phone preview readiness": "ready",
      "Next action": "Prepare the phone name and logo preview."
    },
    billing: {
      "Billing status": "registration_fee_paid"
    },
    trustHubKyc: {
      "Trust Hub status": "not_started",
      "Evidence collection mode": "not_required"
    },
    ukRcBundle: {
      "RC bundle status": "not_started"
    },
    twilioSetup: {
      "Provider submission status": "not_started"
    }
  };
}

function makePendingSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-PENDING";
  snapshot.application.applicationId = "ROQ-RCS-TEST-PENDING";
  snapshot.internalReview["Application ID"] = "ROQ-RCS-TEST-PENDING";
  snapshot.internalReview["Legal/company check"] = "pending";
  snapshot.internalReview["Website/domain check"] = "pending";
  snapshot.internalReview["KYC/Trust Hub check"] = "pending_trust_hub_review";
  snapshot.internalReview["SMS fallback/RC bundle check"] = "pending";
  snapshot.billing["Billing status"] = "registration_fee_pending";
  snapshot.activeCheckout = { decision: "already_paid" };
  return snapshot;
}

function makeUnsafeSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-UNSAFE";
  snapshot.application.applicationId = "ROQ-RCS-TEST-UNSAFE";
  snapshot.internalReview["Application ID"] = "ROQ-RCS-TEST-UNSAFE";
  snapshot.application.providerStatus = "provider_review";
  snapshot.internalReview["Review status"] = "changes_needed";
  snapshot.internalReview["Phone preview readiness"] = "pending";
  snapshot.twilioSetup["Provider submission status"] = "provider_review";
  return snapshot;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  const ready = assessInternalReview(makeReadySnapshot());
  assert(ready.ok === true, "ready snapshot should have no blockers");
  assert(ready.readyForPartAAcceptance === true, "ready snapshot should have no warnings");

  const pending = assessInternalReview(makePendingSnapshot());
  assert(pending.ok === false, "pending snapshot should have blockers");
  assert(pending.blockers.some(item => item.code === "pending_legalCompanyCheck"), "pending snapshot should flag legal/company");
  assert(pending.warnings.some(item => item.code === "kyc_trust_hub_pending"), "pending snapshot should warn on KYC lane");

  const unsafe = assessInternalReview(makeUnsafeSnapshot());
  assert(unsafe.ok === false, "unsafe snapshot should have blockers");
  assert(unsafe.blockers.some(item => item.code === "review_status_blocks_acceptance"), "unsafe snapshot should flag review status");
  assert(unsafe.blockers.some(item => item.code === "provider_submission_premature"), "unsafe snapshot should flag provider submission");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      ready: ready.summary,
      pending: pending.summary,
      unsafe: unsafe.summary
    }
  };
}

function printResult(result) {
  console.log(JSON.stringify(result, null, 2));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  if (options.selfTest) {
    printResult(runSelfTest());
    return;
  }

  if (!options.snapshotFile) throw new Error("Missing --snapshot-file");
  const snapshot = readSnapshot(options.snapshotFile);
  const result = assessInternalReview(snapshot);
  printResult(result);

  if (result.blockers.length > 0 || (options.strict && result.warnings.length > 0)) {
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(function(error) {
    console.error(error.message);
    process.exit(1);
  });
}

export { assessInternalReview };
