#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";

const REQUIRED_NOT_STARTED_FIELDS = [
  ["Provider submission status", "providerSubmissionStatus"],
  ["Go-live status", "goLiveStatus"],
  ["Usage pull status", "usagePullStatus"]
];

const PROOF_URL_FIELDS = [
  ["RBM logo URL", "logo"],
  ["RBM banner URL", "banner"],
  ["Opt-in proof URL(s)", "optInProof"],
  ["Review video URL", "reviewVideo"]
];

const APPROVED_VIDEO_STATUSES = new Set([
  "client_approved",
  "approved",
  "approved_for_submission",
  "final_approved"
]);

const REVIEWED_PACK_STATUSES = new Set([
  "proof_pack_reviewed",
  "client_approved",
  "approved",
  "approved_for_submission",
  "final_approved"
]);

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/proof-pack-preflight.mjs --snapshot-file operator-status.json",
    "  node rcs-registration/tools/proof-pack-preflight.mjs --snapshot-file operator-status.json --strict",
    "  node rcs-registration/tools/proof-pack-preflight.mjs --self-test",
    "",
    "Options:",
    "  --snapshot-file PATH   JSON output from operator-status.mjs",
    "  --strict               Exit non-zero for warnings as well as blockers",
    "  --self-test            Run offline fake-snapshot checks",
    "",
    "Safety:",
    "  Offline only. This tool does not call Apps Script, Twilio, Revolut, Google Cloud, or any provider API.",
    "  It reads a local JSON snapshot and reports proof-pack readiness only."
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
  list.push({ code, message, field });
}

function splitUrls(value) {
  return String(value || "")
    .split(/[,\n]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function isPlaceholderUrl(url) {
  const lower = String(url || "").toLowerCase();
  return (
    lower.includes("example.com") ||
    lower.includes("placeholder") ||
    lower.includes("proof-only") ||
    lower.includes("rightonq-proof-logo") ||
    lower.includes("rightonq-proof-banner") ||
    lower.includes("rightonq-proof-opt-in") ||
    lower.includes("rightonq-proof-review-video")
  );
}

function validateProofUrlField(twilioSetup, label, codeName, blockers, warnings) {
  const value = valueFrom(twilioSetup, label);
  const urls = splitUrls(value);

  if (!urls.length) {
    add(blockers, "missing_" + codeName + "_url", label + " is missing.", label);
    return [];
  }

  urls.forEach(function(url) {
    if (!/^https:\/\//i.test(url)) {
      add(blockers, "non_https_" + codeName + "_url", label + " must use a public HTTPS URL: " + url, label);
      return;
    }
    if (isPlaceholderUrl(url)) {
      add(warnings, "placeholder_" + codeName + "_url", label + " still looks like placeholder/proof-only material: " + url, label);
    }
  });

  return urls;
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

function assessProofPack(snapshot) {
  const blockers = [];
  const warnings = [];
  const info = [];

  if (!snapshot || typeof snapshot !== "object") {
    add(blockers, "invalid_snapshot", "Snapshot must be a JSON object.");
    return buildResult(snapshot, blockers, warnings, info);
  }

  const application = snapshot.application || {};
  const twilioSetup = snapshot.twilioSetup || {};
  const internalReview = snapshot.internalReview || {};
  const applicationId = getApplicationId(snapshot);

  if (!applicationId) {
    add(blockers, "missing_application_id", "Snapshot is missing an application ID.", "applicationId");
  }

  if (!twilioSetup || !Object.keys(twilioSetup).length) {
    add(blockers, "missing_twilio_setup", "Snapshot is missing the Twilio setup row.", "twilioSetup");
  }

  PROOF_URL_FIELDS.forEach(function([label, codeName]) {
    validateProofUrlField(twilioSetup, label, codeName, blockers, warnings);
  });

  REQUIRED_NOT_STARTED_FIELDS.forEach(function([label, camelName]) {
    const value = valueFrom(twilioSetup, label, camelName);
    if (!value) {
      add(blockers, "missing_" + camelName, label + " is missing; keep it explicitly at not_started before submission.", label);
      return;
    }
    if (value !== "not_started") {
      add(blockers, "premature_" + camelName, label + " is '" + value + "'; expected not_started before final submission approval.", label);
    }
  });

  const reviewVideoStatus = valueFrom(twilioSetup, "Review video status", "reviewVideoStatus");
  if (!reviewVideoStatus || reviewVideoStatus === "not_started") {
    add(warnings, "video_not_approved", "Review video status is not yet client-approved.", "Review video status");
  } else if (!APPROVED_VIDEO_STATUSES.has(reviewVideoStatus)) {
    add(warnings, "video_status_unclear", "Review video status is '" + reviewVideoStatus + "'; confirm this means client-approved.", "Review video status");
  }

  const registrationPackStatus = valueFrom(twilioSetup, "Registration pack status", "registrationPackStatus");
  if (!registrationPackStatus || registrationPackStatus === "not_started") {
    add(warnings, "pack_not_reviewed", "Registration pack status is not yet reviewed/approved.", "Registration pack status");
  } else if (!REVIEWED_PACK_STATUSES.has(registrationPackStatus)) {
    add(warnings, "pack_status_unclear", "Registration pack status is '" + registrationPackStatus + "'; confirm this means reviewed/approved.", "Registration pack status");
  }

  const manualPauseFlag = valueFrom(twilioSetup, "Manual pause flag", "manualPauseFlag");
  if (manualPauseFlag && manualPauseFlag !== "no") {
    add(blockers, "manual_pause_active", "Manual pause flag is '" + manualPauseFlag + "'.", "Manual pause flag");
  }

  const partAStatus = application.partAStatus || application.registrationStatus || "";
  if (partAStatus && !["part_a_accepted", "part_b_in_progress", "provider_review", "approved"].includes(partAStatus)) {
    add(warnings, "part_a_not_accepted", "Application Part A status is '" + partAStatus + "'; final proof pack normally follows accepted Part A.", "partAStatus");
  }

  const reviewStatus = valueFrom(internalReview, "Review status", "reviewStatus");
  if (reviewStatus && reviewStatus !== "accepted") {
    add(warnings, "internal_review_not_accepted", "Internal review status is '" + reviewStatus + "'.", "Review status");
  }

  const requiredApplicationFields = [
    ["legalBusinessName", "Legal business name"],
    ["tradingName", "Trading name"],
    ["primaryContactEmail", "Primary contact email"]
  ];
  requiredApplicationFields.forEach(function([fieldName, label]) {
    if (!application[fieldName]) {
      add(warnings, "missing_" + fieldName, label + " is missing from the application snapshot.", fieldName);
    }
  });

  if (blockers.length === 0 && warnings.length === 0) {
    add(info, "proof_pack_clean", "No blockers or warnings found in this offline snapshot.");
  } else if (blockers.length === 0) {
    add(info, "no_blockers", "No blockers found, but warnings remain before provider submission.");
  }

  return buildResult(snapshot, blockers, warnings, info);
}

function buildResult(snapshot, blockers, warnings, info) {
  const applicationId = snapshot && typeof snapshot === "object" ? getApplicationId(snapshot) : "";
  return {
    ok: blockers.length === 0,
    readyForProviderSubmission: blockers.length === 0 && warnings.length === 0,
    applicationId,
    summary: {
      blockers: blockers.length,
      warnings: warnings.length,
      info: info.length
    },
    blockers,
    warnings,
    info,
    note: "Offline proof-pack preflight only. Provider submission still requires explicit RightOnQ approval."
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
      primaryContactEmail: "owner@example.com",
      partAStatus: "part_a_accepted"
    },
    internalReview: {
      "Review status": "accepted"
    },
    twilioSetup: {
      "Application ID": "ROQ-RCS-TEST-READY",
      "RBM logo URL": "https://assets.example-cdn.test/final/logo.png",
      "RBM banner URL": "https://assets.example-cdn.test/final/banner.png",
      "Opt-in proof URL(s)": "https://assets.example-cdn.test/final/opt-in.png",
      "Review video URL": "https://assets.example-cdn.test/final/review-video.webm",
      "Review video status": "client_approved",
      "Registration pack status": "proof_pack_reviewed",
      "Provider submission status": "not_started",
      "Go-live status": "not_started",
      "Usage pull status": "not_started",
      "Manual pause flag": "no"
    }
  };
}

function makeDraftSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-DRAFT";
  snapshot.application.applicationId = "ROQ-RCS-TEST-DRAFT";
  snapshot.application.partAStatus = "part_a_submitted";
  snapshot.internalReview["Review status"] = "pending_review";
  snapshot.twilioSetup["Application ID"] = "ROQ-RCS-TEST-DRAFT";
  snapshot.twilioSetup["RBM logo URL"] = "https://example.com/rightonq-proof-logo.png";
  snapshot.twilioSetup["Review video status"] = "not_started";
  snapshot.twilioSetup["Registration pack status"] = "not_started";
  return snapshot;
}

function makeUnsafeSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-UNSAFE";
  snapshot.application.applicationId = "ROQ-RCS-TEST-UNSAFE";
  snapshot.twilioSetup["Application ID"] = "ROQ-RCS-TEST-UNSAFE";
  snapshot.twilioSetup["Provider submission status"] = "provider_review";
  snapshot.twilioSetup["Go-live status"] = "ready";
  snapshot.twilioSetup["Usage pull status"] = "";
  snapshot.twilioSetup["Manual pause flag"] = "yes";
  delete snapshot.twilioSetup["Review video URL"];
  return snapshot;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  const ready = assessProofPack(makeReadySnapshot());
  assert(ready.ok === true, "ready snapshot should have no blockers");
  assert(ready.readyForProviderSubmission === true, "ready snapshot should have no warnings");

  const draft = assessProofPack(makeDraftSnapshot());
  assert(draft.ok === true, "draft snapshot should have warnings but no blockers");
  assert(draft.readyForProviderSubmission === false, "draft snapshot should not be ready for submission");
  assert(draft.warnings.some(item => item.code === "placeholder_logo_url"), "draft snapshot should flag placeholder logo");
  assert(draft.warnings.some(item => item.code === "video_not_approved"), "draft snapshot should flag video not approved");

  const unsafe = assessProofPack(makeUnsafeSnapshot());
  assert(unsafe.ok === false, "unsafe snapshot should have blockers");
  assert(unsafe.blockers.some(item => item.code === "premature_providerSubmissionStatus"), "unsafe snapshot should flag provider status");
  assert(unsafe.blockers.some(item => item.code === "missing_reviewVideo_url"), "unsafe snapshot should flag missing review video URL");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      ready: ready.summary,
      draft: draft.summary,
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
  const result = assessProofPack(snapshot);
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

export { assessProofPack };
