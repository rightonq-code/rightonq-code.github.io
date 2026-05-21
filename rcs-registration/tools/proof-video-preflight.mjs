#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";

const APPROVED_VIDEO_STATUSES = new Set([
  "client_approved",
  "approved",
  "approved_for_submission",
  "final_approved"
]);

const REVIEWED_PACK_STATUSES = new Set([
  "proof_pack_reviewed",
  "final_pack_review_ready",
  "client_approved",
  "approved",
  "approved_for_submission",
  "final_approved"
]);

const VIDEO_APPROVED_PART_B_STATUSES = new Set([
  "video_approved",
  "provider_review",
  "approved",
  "live"
]);

const VIDEO_CHANGE_STATUSES = new Set([
  "video_changes_requested",
  "name_logo_changes_requested"
]);

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/proof-video-preflight.mjs --snapshot-file operator-status.json",
    "  node rcs-registration/tools/proof-video-preflight.mjs --snapshot-file operator-status.json --strict",
    "  node rcs-registration/tools/proof-video-preflight.mjs --self-test",
    "",
    "Options:",
    "  --snapshot-file PATH   JSON output from operator-status.mjs",
    "  --strict               Exit non-zero for warnings as well as blockers",
    "  --self-test            Run offline fake-snapshot checks",
    "",
    "Safety:",
    "  Offline only. This tool does not call Apps Script, Twilio, Revolut, Google Cloud, or public URLs.",
    "  It reads a local operator snapshot and reports review-video readiness only."
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

function add(list, code, message, field) {
  const item = { code, message };
  if (field) item.field = field;
  list.push(item);
}

function getApplicationId(snapshot) {
  return (
    snapshot.applicationId ||
    snapshot.application?.applicationId ||
    snapshot.twilioSetup?.["Application ID"] ||
    snapshot.twilioSetup?.applicationId ||
    ""
  );
}

function looksPlaceholder(value) {
  const lower = String(value || "").toLowerCase();
  return (
    lower.includes("example.com") ||
    lower.includes("placeholder") ||
    lower.includes("proof-only") ||
    lower.includes("draft") ||
    lower.includes("hosted_url_proof_only")
  );
}

function hasRecentVideoApprovalSignal(snapshot) {
  const events = Array.isArray(snapshot.recentStatusEvents) ? snapshot.recentStatusEvents : [];
  const communications = Array.isArray(snapshot.queuedCommunications) ? snapshot.queuedCommunications : [];
  return events.some(record => {
    const type = valueFrom(record, "Event type", "eventType");
    const newStatus = valueFrom(record, "New Part B status", "newPartBStatus");
    return type === "part_b_video_response" || type === "video_approved" || newStatus === "video_approved";
  }) || communications.some(record => {
    const code = valueFrom(record, "Communication code", "communicationCode");
    const trigger = valueFrom(record, "Trigger status", "triggerStatus");
    return code === "video_approved_received" || trigger === "video_approved";
  });
}

function assessVideoReadiness(snapshot) {
  const blockers = [];
  const warnings = [];
  const info = [];

  if (!snapshot || typeof snapshot !== "object") {
    add(blockers, "invalid_snapshot", "Snapshot must be a JSON object.");
    return buildResult(snapshot, blockers, warnings, info);
  }

  const applicationId = getApplicationId(snapshot);
  const application = snapshot.application || {};
  const twilioSetup = snapshot.twilioSetup || {};

  if (!applicationId) {
    add(blockers, "missing_application_id", "Snapshot is missing an application ID.", "applicationId");
  }
  if (!twilioSetup || !Object.keys(twilioSetup).length) {
    add(blockers, "missing_twilio_setup", "Snapshot is missing the Twilio setup row.", "twilioSetup");
  }

  const reviewVideoUrl = valueFrom(twilioSetup, "Review video URL", "reviewVideoUrl");
  if (!reviewVideoUrl) {
    add(blockers, "missing_review_video_url", "Review video URL is missing.", "Review video URL");
  } else if (!/^https:\/\//i.test(reviewVideoUrl)) {
    add(blockers, "non_https_review_video_url", "Review video URL must be a public HTTPS URL.", "Review video URL");
  } else if (looksPlaceholder(reviewVideoUrl)) {
    add(blockers, "placeholder_review_video_url", "Review video URL still looks like placeholder/proof-only material.", "Review video URL");
  }

  const reviewVideoStatus = valueFrom(twilioSetup, "Review video status", "reviewVideoStatus");
  if (!reviewVideoStatus || reviewVideoStatus === "not_started") {
    add(blockers, "video_not_client_approved", "Review video status is not yet client-approved.", "Review video status");
  } else if (looksPlaceholder(reviewVideoStatus)) {
    add(blockers, "video_status_placeholder", "Review video status still looks placeholder/proof-only.", "Review video status");
  } else if (!APPROVED_VIDEO_STATUSES.has(reviewVideoStatus)) {
    add(blockers, "video_status_unclear", "Review video status is '" + reviewVideoStatus + "'; expected client_approved or equivalent.", "Review video status");
  }

  const partBStatus = valueFrom(application, "Part B status", "partBStatus") || application.registrationStatus || "";
  if (!partBStatus) {
    add(blockers, "missing_part_b_status", "Application Part B status is missing.", "partBStatus");
  } else if (VIDEO_CHANGE_STATUSES.has(partBStatus)) {
    add(blockers, "video_changes_unresolved", "Application Part B status is '" + partBStatus + "'; resolve requested changes before final video readiness.", "partBStatus");
  } else if (partBStatus === "name_logo_approved") {
    add(blockers, "video_not_approved_by_client", "Name/logo is approved, but the review video is not yet approved by the client.", "partBStatus");
  } else if (!VIDEO_APPROVED_PART_B_STATUSES.has(partBStatus)) {
    add(blockers, "part_b_not_video_approved", "Application Part B status is '" + partBStatus + "'; expected video_approved or later.", "partBStatus");
  }

  const registrationPackStatus = valueFrom(twilioSetup, "Registration pack status", "registrationPackStatus");
  if (!registrationPackStatus || registrationPackStatus === "not_started") {
    add(warnings, "pack_not_reviewed", "Registration pack status is not yet reviewed/approved.", "Registration pack status");
  } else if (looksPlaceholder(registrationPackStatus)) {
    add(warnings, "pack_status_placeholder", "Registration pack status still looks placeholder/proof-only.", "Registration pack status");
  } else if (!REVIEWED_PACK_STATUSES.has(registrationPackStatus)) {
    add(warnings, "pack_status_unclear", "Registration pack status is '" + registrationPackStatus + "'; confirm this means reviewed/approved.", "Registration pack status");
  }

  if (!hasRecentVideoApprovalSignal(snapshot)) {
    add(warnings, "no_recent_video_approval_signal", "No recent video approval status event or queued communication was found in the snapshot. This may be normal if the approval is older than the recent snapshot window.");
  }

  if (blockers.length === 0 && warnings.length === 0) {
    add(info, "video_ready", "Review video appears client-approved and ready for final pack review.");
  } else if (blockers.length === 0) {
    add(info, "video_no_blockers", "No review-video blockers found, but warnings remain before final pack readiness.");
  }

  return buildResult(snapshot, blockers, warnings, info);
}

function buildResult(snapshot, blockers, warnings, info) {
  const applicationId = snapshot && typeof snapshot === "object" ? getApplicationId(snapshot) : "";
  return {
    ok: blockers.length === 0,
    videoReadyForFinalPackReview: blockers.length === 0 && warnings.length === 0,
    applicationId,
    summary: {
      blockers: blockers.length,
      warnings: warnings.length,
      info: info.length
    },
    blockers,
    warnings,
    info,
    note: "Offline proof-video preflight only. Final provider submission still requires asset URL checks, full proof-pack preflight, and explicit RightOnQ approval."
  };
}

function makeReadySnapshot() {
  return {
    applicationId: "ROQ-RCS-TEST-VIDEO-READY",
    application: {
      applicationId: "ROQ-RCS-TEST-VIDEO-READY",
      partBStatus: "video_approved",
      registrationStatus: "video_approved"
    },
    twilioSetup: {
      "Application ID": "ROQ-RCS-TEST-VIDEO-READY",
      "Review video URL": "https://assets.example.test/final/review-video.webm",
      "Review video status": "client_approved",
      "Registration pack status": "proof_pack_reviewed"
    },
    recentStatusEvents: [
      {
        "Event type": "part_b_video_response",
        "New Part B status": "video_approved"
      }
    ],
    queuedCommunications: [
      {
        "Communication code": "video_approved_received",
        "Trigger status": "video_approved"
      }
    ]
  };
}

function makeDraftSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-VIDEO-DRAFT";
  snapshot.application.applicationId = "ROQ-RCS-TEST-VIDEO-DRAFT";
  snapshot.application.partBStatus = "name_logo_approved";
  snapshot.application.registrationStatus = "name_logo_approved";
  snapshot.twilioSetup["Application ID"] = "ROQ-RCS-TEST-VIDEO-DRAFT";
  snapshot.twilioSetup["Review video URL"] = "https://example.com/rightonq-proof-review-video.webm";
  snapshot.twilioSetup["Review video status"] = "placeholder_hosted_url_proof";
  snapshot.twilioSetup["Registration pack status"] = "hosted_url_proof_only";
  snapshot.recentStatusEvents = [];
  snapshot.queuedCommunications = [];
  return snapshot;
}

function makeChangesSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-VIDEO-CHANGES";
  snapshot.application.applicationId = "ROQ-RCS-TEST-VIDEO-CHANGES";
  snapshot.application.partBStatus = "video_changes_requested";
  snapshot.application.registrationStatus = "video_changes_requested";
  snapshot.twilioSetup["Application ID"] = "ROQ-RCS-TEST-VIDEO-CHANGES";
  snapshot.twilioSetup["Review video status"] = "changes_requested";
  snapshot.twilioSetup["Registration pack status"] = "not_started";
  return snapshot;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  const ready = assessVideoReadiness(makeReadySnapshot());
  assert(ready.ok === true, "ready snapshot should have no blockers");
  assert(ready.videoReadyForFinalPackReview === true, "ready snapshot should have no warnings");

  const draft = assessVideoReadiness(makeDraftSnapshot());
  assert(draft.ok === false, "draft snapshot should have blockers");
  assert(draft.blockers.some(item => item.code === "placeholder_review_video_url"), "draft snapshot should flag placeholder video URL");
  assert(draft.blockers.some(item => item.code === "video_status_placeholder"), "draft snapshot should flag placeholder video status");
  assert(draft.blockers.some(item => item.code === "video_not_approved_by_client"), "draft snapshot should flag name/logo-only state");

  const changes = assessVideoReadiness(makeChangesSnapshot());
  assert(changes.ok === false, "changes snapshot should have blockers");
  assert(changes.blockers.some(item => item.code === "video_changes_unresolved"), "changes snapshot should flag unresolved video changes");
  assert(changes.blockers.some(item => item.code === "video_status_unclear"), "changes snapshot should flag unclear video status");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      ready: ready.summary,
      draft: draft.summary,
      changes: changes.summary
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
  const result = assessVideoReadiness(snapshot);
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

export { assessVideoReadiness };
