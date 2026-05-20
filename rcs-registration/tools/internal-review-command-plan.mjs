#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { assessInternalReview } from "./internal-review-preflight.mjs";

const HARD_REVIEW_ARGS = [
  ["--legal-company-check", "passed"],
  ["--website-domain-check", "passed"],
  ["--public-links-check", "passed"],
  ["--message-purpose-examples-check", "passed"],
  ["--consent-opt-out-check", "passed"],
  ["--phone-preview-readiness", "ready"]
];

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/internal-review-command-plan.mjs --snapshot-file operator-status.json",
    "  node rcs-registration/tools/internal-review-command-plan.mjs --self-test",
    "",
    "Options:",
    "  --snapshot-file PATH   JSON output from operator-status.mjs",
    "  --self-test            Run offline fake-snapshot checks",
    "",
    "Safety:",
    "  Offline only. This tool does not call Apps Script, Google Sheets, Twilio, Revolut, Google Cloud, or any provider API.",
    "  It prints a human review plan and future operator-review.mjs command templates; it does not mutate state."
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

function normalise(value) {
  return String(value || "").trim().toLowerCase();
}

function snapshotApplicationId(snapshot) {
  return (
    snapshot?.applicationId ||
    snapshot?.application?.applicationId ||
    snapshot?.internalReview?.["Application ID"] ||
    "ROQ-RCS-..."
  );
}

function valueFrom(record, label, fallback) {
  const value = record?.[label] ?? fallback ?? "";
  return value === null || value === undefined ? "" : String(value).trim();
}

function shellQuote(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:@=+-]+$/.test(text)) return text;
  return "'" + text.replace(/'/g, "'\"'\"'") + "'";
}

function commandLine(args) {
  return [
    "node rcs-registration/tools/operator-review.mjs \\",
    ...args.map(function([name, value], index) {
      const suffix = index === args.length - 1 ? "" : " \\";
      if (value === true) return "  " + name + suffix;
      return "  " + name + " " + shellQuote(value) + suffix;
    })
  ].join("\n");
}

function liveCommand(args) {
  return [
    'printf "Paste RCS_ONBOARDING_OPERATOR_PIN: "',
    "read -rs RCS_ONBOARDING_OPERATOR_PIN",
    'printf "\\n"',
    "",
    "export RCS_ONBOARDING_OPERATOR_PIN",
    commandLine(args),
    "unset RCS_ONBOARDING_OPERATOR_PIN"
  ].join("\n");
}

function buildOperatorArgs(snapshot, options = {}) {
  const internalReview = snapshot.internalReview || {};
  const applicationId = snapshotApplicationId(snapshot);
  const kycValue = valueFrom(internalReview, "KYC/Trust Hub check", "pending_trust_hub_review") || "pending_trust_hub_review";
  const fallbackValue = valueFrom(internalReview, "SMS fallback/RC bundle check", "pending") || "pending";
  const nextAction = options.nextAction || "Prepare the phone name and logo preview.";
  const notes = options.notes || "Part A accepted after RightOnQ internal review evidence passed; KYC/Trust Hub and SMS fallback/RC bundle remain tracked provider lanes where applicable.";

  return [
    ["--application-id", applicationId],
    ["--review-status", "accepted"],
    ["--part-a-accepted", true],
    ["--confirm-part-a-acceptance", true],
    ...HARD_REVIEW_ARGS,
    ["--kyc-trust-hub-check", kycValue],
    ["--sms-fallback-rc-bundle-check", fallbackValue],
    ["--next-action", nextAction],
    ["--operator-name", "RightOnQ"],
    ["--notes", notes]
  ];
}

function buildReviewPlan(snapshot) {
  const assessment = assessInternalReview(snapshot);
  const baseArgs = buildOperatorArgs(snapshot);
  const dryRunArgs = [...baseArgs, ["--dry-run", true]];
  const blocked = assessment.blockers.length > 0;

  return {
    ok: true,
    applicationId: assessment.applicationId || snapshotApplicationId(snapshot),
    preflight: {
      hardGatePassed: assessment.ok,
      fullyClean: assessment.readyForPartAAcceptance,
      summary: assessment.summary,
      blockers: assessment.blockers,
      warnings: assessment.warnings,
      info: assessment.info
    },
    nextAction: blocked
      ? "Do not run Part A acceptance yet. Complete the blocker fields from the internal review evidence, refresh the operator snapshot, then rerun this planner."
      : "Review the warnings, rerun the dry-run command, then run the live command only after explicit RightOnQ approval.",
    commands: {
      dryRun: commandLine(dryRunArgs),
      liveTemplate: blocked ? "" : liveCommand(baseArgs)
    },
    safety: [
      "Offline command plan only; no state changed.",
      "The live command remains PIN-gated by operator-review.mjs.",
      "Do not use the live template until the evidence behind every passed checklist item has actually been reviewed.",
      "Do not move provider submission, go-live, usage pull, callback configuration, sender pool, or message sending from this step."
    ]
  };
}

function makeReadySnapshot() {
  return {
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
      "KYC/Trust Hub check": "pending_trust_hub_review",
      "SMS fallback/RC bundle check": "pending",
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

function makeBlockedSnapshot() {
  const snapshot = makeReadySnapshot();
  snapshot.applicationId = "ROQ-RCS-TEST-BLOCKED";
  snapshot.application.applicationId = "ROQ-RCS-TEST-BLOCKED";
  snapshot.internalReview["Application ID"] = "ROQ-RCS-TEST-BLOCKED";
  snapshot.internalReview["Legal/company check"] = "pending";
  snapshot.internalReview["Phone preview readiness"] = "pending";
  return snapshot;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  const ready = buildReviewPlan(makeReadySnapshot());
  assert(ready.preflight.hardGatePassed === true, "ready plan should pass hard gate");
  assert(ready.commands.liveTemplate.includes("RCS_ONBOARDING_OPERATOR_PIN"), "ready plan should include live template");
  assert(ready.commands.dryRun.includes("--dry-run"), "ready plan should include dry-run command");

  const blocked = buildReviewPlan(makeBlockedSnapshot());
  assert(blocked.preflight.hardGatePassed === false, "blocked plan should fail hard gate");
  assert(blocked.commands.liveTemplate === "", "blocked plan should not include live template");
  assert(blocked.preflight.blockers.some(item => item.code === "pending_legalCompanyCheck"), "blocked plan should include review blocker");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      ready: ready.preflight.summary,
      blocked: blocked.preflight.summary
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
  printResult(buildReviewPlan(snapshot));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(function(error) {
    console.error(error.message);
    process.exit(1);
  });
}

export { buildReviewPlan };
