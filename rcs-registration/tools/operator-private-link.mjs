#!/usr/bin/env node

import { chmod, lstat, open, rename, rm } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { runOperatorAction } from "./operator-api-client.mjs";

const DEFAULT_OUTPUT_FILE = "/private/tmp/roq-rcs-private-link.txt";
const OUTPUT_ROOT = "/private/tmp";

function usage() {
  return [
    "Usage:",
    "  RCS_ONBOARDING_OPERATOR_PIN=... node rcs-registration/tools/operator-private-link.mjs --application-id ROQ-RCS-... --confirm-private-link-repair",
    "",
    "Options:",
    "  --application-id ROQ-RCS-...          Required application ID",
    "  --output /private/tmp/link.txt        Optional; defaults to " + DEFAULT_OUTPUT_FILE,
    "  --output-file /private/tmp/link.txt   Alias for --output",
    "  --confirm-private-link-repair         Required for live run",
    "  --dry-run                            Print the sanitized payload only",
    "",
    "Safety:",
    "  The operator PIN is read from RCS_ONBOARDING_OPERATOR_PIN.",
    "  The private application link is written to a chmod 600 local file and is not printed.",
    "  The Apps Script action only creates a token if this exact application row is missing one.",
    "  The output file is write-on-demand, short-lived handoff storage, not durable storage."
  ].join("\n");
}

function parseArgs(argv) {
  const options = { outputFile: DEFAULT_OUTPUT_FILE };
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
    if (token === "--confirm-private-link-repair") {
      options.confirmPrivateLinkRepair = true;
      continue;
    }
    if (token === "--application-id" || token === "--output" || token === "--output-file") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
      if (token === "--application-id") options.applicationId = value;
      if (token === "--output" || token === "--output-file") options.outputFile = value;
      index += 1;
      continue;
    }
    throw new Error("Unknown option: " + token);
  }
  return options;
}

function buildPayload(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");
  if (!options.confirmPrivateLinkRepair) {
    throw new Error("Refusing live private-link repair without --confirm-private-link-repair");
  }

  const payload = {
    action: "ensurePrivateApplicationLink",
    applicationId: options.applicationId,
    confirmPrivateLinkRepair: true
  };

  const operatorPin = process.env.RCS_ONBOARDING_OPERATOR_PIN;
  if (!options.dryRun && !operatorPin) {
    throw new Error("Set RCS_ONBOARDING_OPERATOR_PIN before running a live private-link repair");
  }
  if (!options.dryRun) payload.operatorPin = operatorPin;

  return payload;
}

function validateOutputFile(path) {
  const resolved = resolve(path);
  const root = resolve(OUTPUT_ROOT);
  if (dirname(resolved) !== root || basename(resolved).startsWith(".")) {
    throw new Error("--output must be a non-hidden file directly inside " + OUTPUT_ROOT);
  }
  return resolved;
}

function sanitisePayload(payload) {
  const copy = { ...payload };
  if (copy.operatorPin) copy.operatorPin = "[redacted]";
  return copy;
}

async function writePrivateLink(path, privateApplicationLink) {
  if (!privateApplicationLink) throw new Error("Operator API did not return a private application link");
  const temporaryPath = path + ".tmp-" + process.pid + "-" + Date.now();
  let handle;

  try {
    const existing = await lstat(path).catch(error => {
      if (error && error.code === "ENOENT") return null;
      throw error;
    });
    if (existing && existing.isSymbolicLink()) {
      throw new Error("Refusing to write private link through a symlink: " + path);
    }

    handle = await open(temporaryPath, "wx", 0o600);
    await handle.writeFile(privateApplicationLink);
    await handle.sync();
    await handle.close();
    handle = null;
    await chmod(temporaryPath, 0o600);
    await rename(temporaryPath, path);
    await chmod(path, 0o600);
  } finally {
    if (handle) await handle.close().catch(() => {});
    await rm(temporaryPath, { force: true }).catch(() => {});
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const payload = buildPayload(options);
  const outputFile = validateOutputFile(options.outputFile);
  if (options.dryRun) {
    console.log(JSON.stringify(sanitisePayload(payload), null, 2));
    return;
  }

  const result = await runOperatorAction(payload);
  await writePrivateLink(outputFile, result.privateApplicationLink);

  console.log(JSON.stringify({
    ok: result.ok,
    applicationId: result.applicationId,
    privateApplicationLinkCreated: result.privateApplicationLinkCreated,
    privateApplicationLinkWritten: true,
    outputFile: outputFile,
    note: result.note
  }, null, 2));
}

main().catch(function(error) {
  console.error(error.message);
  process.exit(1);
});
