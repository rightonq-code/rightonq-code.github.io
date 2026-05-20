#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { assessAssetUrls } from "./proof-asset-url-preflight.mjs";
import { assessProofPack } from "./proof-pack-preflight.mjs";
import { assessVideoReadiness } from "./proof-video-preflight.mjs";

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/final-pack-preflight.mjs --snapshot-file operator-status.json",
    "  node rcs-registration/tools/final-pack-preflight.mjs --snapshot-file operator-status.json --strict",
    "  node rcs-registration/tools/final-pack-preflight.mjs --snapshot-file operator-status.json --skip-asset-url-check",
    "  node rcs-registration/tools/final-pack-preflight.mjs --self-test",
    "",
    "Options:",
    "  --snapshot-file PATH       JSON output from operator-status.mjs",
    "  --banner-profile PROFILE   Passed to proof-asset-url-preflight.mjs (default: twilio = 1140x448 submission export)",
    "  --skip-asset-url-check     Do not fetch public asset URLs; run local snapshot checks only",
    "  --strict                   Exit non-zero for warnings as well as blockers",
    "  --self-test                Run offline fake-snapshot checks",
    "",
    "Safety:",
    "  This is a gate aggregator. It does not write Apps Script, Sheets, Twilio, Revolut, or Google Cloud.",
    "  By default it fetches public proof asset URLs read-only. Use --skip-asset-url-check for fully offline mode."
  ].join("\n");
}

function parseArgs(argv) {
  const options = { bannerProfile: "twilio" };
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
    if (token === "--skip-asset-url-check") {
      options.skipAssetUrlCheck = true;
      continue;
    }
    if (token === "--snapshot-file") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --snapshot-file");
      options.snapshotFile = value;
      index += 1;
      continue;
    }
    if (token === "--banner-profile") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --banner-profile");
      if (!["twilio", "google", "twilio-onboarding-doc", "either"].includes(value)) {
        throw new Error("--banner-profile must be twilio, google, twilio-onboarding-doc, or either");
      }
      options.bannerProfile = value;
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

function getApplicationId(snapshot) {
  return (
    snapshot?.applicationId ||
    snapshot?.application?.applicationId ||
    snapshot?.twilioSetup?.["Application ID"] ||
    snapshot?.twilioSetup?.applicationId ||
    ""
  );
}

function summarize(section) {
  return {
    ok: Boolean(section.ok),
    blockers: section.summary?.blockers || 0,
    warnings: section.summary?.warnings || 0,
    info: section.summary?.info || 0
  };
}

function aggregateCounts(sections) {
  return Object.values(sections).reduce(
    function(total, section) {
      if (!section || section.skipped) return total;
      total.blockers += section.summary?.blockers || 0;
      total.warnings += section.summary?.warnings || 0;
      total.info += section.summary?.info || 0;
      return total;
    },
    { blockers: 0, warnings: 0, info: 0 }
  );
}

async function assessFinalPack(snapshot, options = {}) {
  const proofPack = assessProofPack(snapshot);
  const proofVideo = assessVideoReadiness(snapshot);
  const assetUrls = options.skipAssetUrlCheck
    ? {
        skipped: true,
        ok: null,
        summary: { blockers: 0, warnings: 0, info: 1, assets: 0 },
        note: "Skipped by --skip-asset-url-check."
      }
    : await assessAssetUrls(snapshot, { bannerProfile: options.bannerProfile || "twilio" });

  const sections = { proofPack, proofVideo, assetUrls };
  const totals = aggregateCounts(sections);
  const assetReady = assetUrls.skipped ? false : assetUrls.ok && (assetUrls.summary?.warnings || 0) === 0;
  const finalPackReady =
    proofPack.readyForProviderSubmission === true &&
    proofVideo.videoReadyForFinalPackReview === true &&
    assetReady;

  return {
    ok: totals.blockers === 0,
    finalPackReady,
    applicationId: getApplicationId(snapshot),
    summary: {
      blockers: totals.blockers,
      warnings: totals.warnings,
      info: totals.info,
      assetUrlCheckSkipped: Boolean(assetUrls.skipped)
    },
    sections: {
      proofPack: summarize(proofPack),
      proofVideo: summarize(proofVideo),
      assetUrls: assetUrls.skipped
        ? { skipped: true, ok: null, blockers: 0, warnings: 0, info: 1 }
        : {
            ...summarize(assetUrls),
            assets: assetUrls.summary?.assets || 0,
            bannerProfile: assetUrls.bannerProfile || options.bannerProfile || "twilio"
          }
    },
    details: {
      proofPack,
      proofVideo,
      assetUrls
    },
    note: "Final pack preflight only. Provider submission still requires explicit RightOnQ approval and a separate submission action."
  };
}

function makeReadySnapshot() {
  return {
    ok: true,
    applicationId: "ROQ-RCS-TEST-FINAL-PACK-READY",
    application: {
      applicationId: "ROQ-RCS-TEST-FINAL-PACK-READY",
      legalBusinessName: "Example Ltd",
      tradingName: "Example",
      primaryContactEmail: "owner@example.com",
      partAStatus: "part_a_accepted",
      partBStatus: "video_approved",
      registrationStatus: "video_approved"
    },
    internalReview: {
      "Review status": "accepted"
    },
    twilioSetup: {
      "Application ID": "ROQ-RCS-TEST-FINAL-PACK-READY",
      "RBM logo URL": "https://assets.example.test/final/logo.png",
      "RBM banner URL": "https://assets.example.test/final/banner.png",
      "Opt-in proof URL(s)": "https://assets.example.test/final/opt-in.png",
      "Review video URL": "https://assets.example.test/final/review-video.webm",
      "Review video status": "client_approved",
      "Registration pack status": "proof_pack_reviewed",
      "Provider submission status": "not_started",
      "Go-live status": "not_started",
      "Usage pull status": "not_started",
      "Manual pause flag": "no"
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

function makeBlockedSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-FINAL-PACK-BLOCKED";
  snapshot.application.applicationId = "ROQ-RCS-TEST-FINAL-PACK-BLOCKED";
  snapshot.application.partAStatus = "part_a_submitted";
  snapshot.application.partBStatus = "name_logo_approved";
  snapshot.application.registrationStatus = "name_logo_approved";
  snapshot.internalReview["Review status"] = "pending_review";
  snapshot.twilioSetup["Application ID"] = "ROQ-RCS-TEST-FINAL-PACK-BLOCKED";
  snapshot.twilioSetup["Review video URL"] = "https://example.com/rightonq-proof-review-video.webm";
  snapshot.twilioSetup["Review video status"] = "placeholder_hosted_url_proof";
  snapshot.twilioSetup["Registration pack status"] = "hosted_url_proof_only";
  snapshot.recentStatusEvents = [];
  snapshot.queuedCommunications = [];
  return snapshot;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runSelfTest() {
  const ready = await assessFinalPack(makeReadySnapshot(), { skipAssetUrlCheck: true });
  assert(ready.ok === true, "ready offline snapshot should have no blockers");
  assert(ready.finalPackReady === false, "ready offline snapshot should not be final-ready when asset URL check is skipped");
  assert(ready.summary.assetUrlCheckSkipped === true, "ready offline snapshot should record skipped asset URL check");

  const blocked = await assessFinalPack(makeBlockedSnapshot(), { skipAssetUrlCheck: true });
  assert(blocked.ok === false, "blocked snapshot should have blockers");
  assert(blocked.finalPackReady === false, "blocked snapshot should not be final-ready");
  assert(blocked.sections.proofPack.blockers > 0, "blocked snapshot should have proof-pack blockers");
  assert(blocked.sections.proofVideo.blockers > 0, "blocked snapshot should have proof-video blockers");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      readyOffline: ready.summary,
      blockedOffline: blocked.summary
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
    printResult(await runSelfTest());
    return;
  }
  if (!options.snapshotFile) throw new Error("Missing --snapshot-file");

  const snapshot = readSnapshot(options.snapshotFile);
  const result = await assessFinalPack(snapshot, options);
  printResult(result);

  if (result.summary.blockers > 0 || (options.strict && result.summary.warnings > 0)) {
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(function(error) {
    console.error(error.message);
    process.exit(1);
  });
}

export { assessFinalPack };
