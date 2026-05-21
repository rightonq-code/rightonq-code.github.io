#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { runOperatorAction } from "./operator-api-client.mjs";

const DEFAULT_OUTPUT_FILE = "/private/tmp/roq-rcs-current-operator-snapshot.json";

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-status.mjs --application-id ROQ-RCS-...",
    "",
    "Options:",
    "  --application-id ROQ-RCS-...   Required application ID",
    "  --output /private/tmp/file     Write the redacted snapshot to this 0600 file",
    "  --dry-run                     Print the guarded request payload without sending it",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  The PIN is never printed and should not be passed as a command argument.",
    "  Live runs write the redacted snapshot to a non-hidden file directly inside /private/tmp."
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    outputFile: DEFAULT_OUTPUT_FILE
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }
    if (token === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (token === "--application-id") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --application-id");
      options.applicationId = value;
      index += 1;
      continue;
    }
    if (token === "--output") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --output");
      options.outputFile = value;
      index += 1;
      continue;
    }
    throw new Error("Unknown option: " + token);
  }
  return options;
}

function buildPayload(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live operator status check");
  }

  const payload = {
    action: "getOperatorSnapshot",
    applicationId: options.applicationId
  };
  if (!options.dryRun) payload.operatorPin = operatorPin;
  return payload;
}

function sanitisePayload(payload) {
  const copy = { ...payload };
  if (copy.operatorPin) copy.operatorPin = "[redacted]";
  return copy;
}

function redactTwilioAccountSids(value) {
  if (Array.isArray(value)) return value.map(redactTwilioAccountSids);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactTwilioAccountSids(item)])
    );
  }
  if (typeof value === "string") {
    return value.replace(/AC[0-9a-fA-F]{32}/g, "[twilio-account-sid-redacted]");
  }
  return value;
}

function assertNoForbiddenSnapshotKeys(value, pathParts = []) {
  if (Array.isArray(value)) {
    value.forEach(function(item, index) {
      assertNoForbiddenSnapshotKeys(item, pathParts.concat(String(index)));
    });
    return;
  }
  if (!value || typeof value !== "object") return;

  Object.entries(value).forEach(function([key, item]) {
    const nextPath = pathParts.concat(key);
    if (key === "Private application token") {
      throw new Error("Refusing to write operator snapshot containing forbidden key: " + nextPath.join("."));
    }
    assertNoForbiddenSnapshotKeys(item, nextPath);
  });
}

function validateOutputFile(outputFile) {
  const root = "/private/tmp";
  const resolved = path.resolve(outputFile);
  if (path.dirname(resolved) !== root) {
    throw new Error("Refusing to write snapshot outside /private/tmp");
  }
  if (path.basename(resolved).startsWith(".")) {
    throw new Error("Refusing to write snapshot to a hidden file");
  }
  return resolved;
}

async function writePrivateJsonFile(outputFile, value) {
  const resolved = validateOutputFile(outputFile);
  try {
    const stat = await fs.lstat(resolved);
    if (stat.isSymbolicLink()) {
      throw new Error("Refusing to write snapshot through a symlink");
    }
  } catch (error) {
    if (error && error.code !== "ENOENT") throw error;
  }

  const tmp = resolved + ".tmp-" + process.pid + "-" + Date.now();
  let handle;
  try {
    handle = await fs.open(tmp, "wx", 0o600);
    await handle.writeFile(JSON.stringify(value, null, 2) + "\n", "utf8");
    await handle.sync();
    await handle.chmod(0o600);
    await handle.close();
    handle = null;
    await fs.rename(tmp, resolved);
    await fs.chmod(resolved, 0o600);
  } finally {
    if (handle) await handle.close().catch(function() {});
    await fs.rm(tmp, { force: true }).catch(function() {});
  }
  return resolved;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const outputFile = validateOutputFile(options.outputFile);
  const payload = buildPayload(options);
  if (options.dryRun) {
    console.log(JSON.stringify(sanitisePayload(payload), null, 2));
    return;
  }

  const result = redactTwilioAccountSids(await runOperatorAction(payload));
  assertNoForbiddenSnapshotKeys(result);
  const writtenFile = await writePrivateJsonFile(outputFile, result);
  console.log(JSON.stringify({
    ok: result.ok === true,
    applicationId: result.applicationId || options.applicationId,
    generatedAt: result.generatedAt || "",
    snapshotWritten: true,
    outputFile: writtenFile,
    note: "Redacted operator snapshot written with mode 0600. Use --output to choose a non-hidden file directly inside /private/tmp."
  }, null, 2));
}

main().catch(function(error) {
  console.error(redactTwilioAccountSids(error.message));
  process.exit(1);
});
