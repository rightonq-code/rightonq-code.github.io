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
    "  --banner-profile PROFILE   Passed to proof-asset-url-preflight.mjs (default: twilio = 1440x448 submission export)",
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

function add(list, code, message, field) {
  list.push({ code, message, field });
}

function assessProviderSamples(snapshot) {
  const blockers = [];
  const warnings = [];
  const info = [];
  const providerSamples = snapshot?.operatorSubmissionPack?.providerSamples || null;

  if (!providerSamples || typeof providerSamples !== "object") {
    add(blockers, "missing_providerSamples", "Operator submission pack is missing typed providerSamples.", "operatorSubmissionPack.providerSamples");
    return buildProviderSamplesResult(snapshot, blockers, warnings, info);
  }

  const gate = providerSamples.gate || "";
  if (gate !== "clear") {
    const reasons = Array.isArray(providerSamples.gateReasons) ? providerSamples.gateReasons : [];
    if (reasons.length) {
      reasons.forEach(function(reason) {
        add(
          blockers,
          "provider_sample_" + (reason.category || "missing"),
          reason.message || "Provider sample gate is not clear.",
          "operatorSubmissionPack.providerSamples"
        );
      });
    } else {
      add(blockers, "provider_samples_gated", "Provider sample gate is not clear.", "operatorSubmissionPack.providerSamples.gate");
    }
  }

  const promotional = providerSamples.promotional || {};
  const transactionalService = providerSamples.transactionalService || {};
  if (!promotional.value || !promotional.source) {
    add(blockers, "missing_promotional_provider_sample", "Promotional provider sample is missing a value or source.", "operatorSubmissionPack.providerSamples.promotional");
  }
  if (!transactionalService.value || !transactionalService.source) {
    add(blockers, "missing_transactional_service_provider_sample", "Transactional/service provider sample is missing a value or source.", "operatorSubmissionPack.providerSamples.transactionalService");
  }

  if (blockers.length === 0 && warnings.length === 0) {
    add(info, "provider_samples_clean", "Typed promotional and transactional/service provider samples are present and sourced.");
  }
  return buildProviderSamplesResult(snapshot, blockers, warnings, info);
}

function buildProviderSamplesResult(snapshot, blockers, warnings, info) {
  return {
    ok: blockers.length === 0,
    providerSamplesReady: blockers.length === 0 && warnings.length === 0,
    applicationId: getApplicationId(snapshot),
    summary: {
      blockers: blockers.length,
      warnings: warnings.length,
      info: info.length
    },
    blockers,
    warnings,
    info,
    note: "Provider sample check only. Provider submission still requires explicit RightOnQ approval."
  };
}

async function assessFinalPack(snapshot, options = {}) {
  const proofPack = assessProofPack(snapshot);
  const proofVideo = assessVideoReadiness(snapshot);
  const providerSamples = assessProviderSamples(snapshot);
  const assetUrls = options.skipAssetUrlCheck
    ? {
        skipped: true,
        ok: null,
        summary: { blockers: 0, warnings: 0, info: 1, assets: 0 },
        note: "Skipped by --skip-asset-url-check."
      }
    : await assessAssetUrls(snapshot, { bannerProfile: options.bannerProfile || "twilio" });

  const sections = { proofPack, proofVideo, providerSamples, assetUrls };
  const totals = aggregateCounts(sections);
  const assetReady = assetUrls.skipped ? false : assetUrls.ok && (assetUrls.summary?.warnings || 0) === 0;
  const finalPackReady =
    proofPack.readyForProviderSubmission === true &&
    proofVideo.videoReadyForFinalPackReview === true &&
    providerSamples.providerSamplesReady === true &&
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
      providerSamples: summarize(providerSamples),
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
      providerSamples,
      assetUrls
    },
    operatorSubmissionPack: snapshot.operatorSubmissionPack || null,
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
    operatorSubmissionPack: {
      purpose: "Internal operator copy view for manual Twilio RCS Sender submission preparation. This is not approval to submit.",
      senderProfile: {
        senderDisplayName: "Example",
        legalBusinessName: "Example Ltd",
        customerWebsite: "https://example.com",
        privacyPolicyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
        rbmLogoUrl: "https://assets.example.test/final/logo.png",
        rbmBannerUrl: "https://assets.example.test/final/banner.png"
      },
      useCaseAndConsent: {
        useCaseDescription: "Transactional customer updates.",
        exampleMessageOne: "Example: your update is ready. Reply HELP or STOP.",
        optInProofUrls: "https://assets.example.test/final/opt-in.png",
        reviewVideoUrl: "https://assets.example.test/final/review-video.webm"
      },
      providerSamples: {
        promotional: {
          value: "Example: subscribe for news and seasonal offers. Reply HELP or STOP.",
          sourceType: "part_a_example",
          sourceField: "exampleMessageTwo",
          source: "Part A submission / exampleMessageTwo"
        },
        transactionalService: {
          value: "Example: your update is ready. Reply HELP or STOP.",
          sourceType: "part_a_example",
          sourceField: "exampleMessageOne",
          source: "Part A submission / exampleMessageOne"
        },
        gate: "clear",
        gateReasons: []
      },
      reviewAndGates: {
        providerSubmissionStatus: "not_started",
        goLiveStatus: "not_started",
        usagePullStatus: "not_started"
      }
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
  assert(ready.operatorSubmissionPack?.senderProfile?.privacyPolicyUrl === "https://example.com/privacy", "ready snapshot should pass through operator submission pack");
  assert(ready.sections.providerSamples.blockers === 0, "ready snapshot should pass provider sample gate");

  const blocked = await assessFinalPack(makeBlockedSnapshot(), { skipAssetUrlCheck: true });
  assert(blocked.ok === false, "blocked snapshot should have blockers");
  assert(blocked.finalPackReady === false, "blocked snapshot should not be final-ready");
  assert(blocked.sections.proofPack.blockers > 0, "blocked snapshot should have proof-pack blockers");
  assert(blocked.sections.proofVideo.blockers > 0, "blocked snapshot should have proof-video blockers");

  const missingSamples = makeReadySnapshot();
  missingSamples.operatorSubmissionPack.providerSamples = {
    promotional: {
      value: "Example: subscribe for news and seasonal offers. Reply HELP or STOP.",
      sourceType: "part_a_example",
      sourceField: "exampleMessageTwo",
      source: "Part A submission / exampleMessageTwo"
    },
    transactionalService: { value: "", sourceType: "", sourceField: "", source: "" },
    gate: "gated",
    gateReasons: [
      {
        category: "transactional_service",
        gate: "provider_sample_missing",
        message: "Provider submission is gated pending an explicitly classified or ROQ-authored transactional/service sample."
      }
    ]
  };
  const sampleBlocked = await assessFinalPack(missingSamples, { skipAssetUrlCheck: true });
  assert(sampleBlocked.ok === false, "missing sample snapshot should have blockers");
  assert(sampleBlocked.sections.providerSamples.blockers > 0, "missing sample snapshot should block provider samples");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      readyOffline: ready.summary,
      blockedOffline: blocked.summary,
      sampleBlocked: sampleBlocked.summary
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
