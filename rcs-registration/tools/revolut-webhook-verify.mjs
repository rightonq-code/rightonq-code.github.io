#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";

const SIGNATURE_VERSION = "v1";
const DEFAULT_TOLERANCE_SECONDS = 300;
const SAMPLE_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_SECRET = "wsk_TEST_DO_NOT_USE_IN_PRODUCTION";

const BOOLEAN_FLAGS = {
  "self-test": "selfTest",
  "skip-timestamp-tolerance": "skipTimestampTolerance"
};

const VALUE_FLAGS = {
  "payload": "payload",
  "payload-file": "payloadFile",
  "timestamp": "timestamp",
  "signature": "signature",
  "tolerance-seconds": "toleranceSeconds"
};

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/revolut-webhook-verify.mjs --self-test",
    "  REVOLUT_WEBHOOK_SIGNING_SECRET=... node rcs-registration/tools/revolut-webhook-verify.mjs --payload-file webhook.json --timestamp 1683650202360 --signature 'v1=...'",
    "",
    "Options:",
    "  --self-test                    Run a local fake-signature positive/negative proof",
    "  --payload '{...}'              Raw webhook payload string, exactly as received",
    "  --payload-file webhook.json    File containing raw webhook payload",
    "  --timestamp 1683650202360      Revolut-Request-Timestamp header value",
    "  --signature 'v1=...'           Revolut-Signature header value; comma-separated signatures are supported",
    "  --tolerance-seconds 300        Timestamp replay tolerance; defaults to 300 seconds",
    "  --skip-timestamp-tolerance     Verify HMAC only; useful for archived samples",
    "",
    "Environment:",
    "  REVOLUT_WEBHOOK_SIGNING_SECRET Required unless --self-test is used",
    "",
    "Safety:",
    "  Keep webhook signing secrets in environment variables or a secret manager.",
    "  Do not paste webhook signing secrets into chat, docs, commits, or command examples.",
    "  The verifier does not print the signing secret or computed HMAC."
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

    const fieldName = VALUE_FLAGS[rawName];
    if (!fieldName) throw new Error("Unknown option: " + token);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
    options[fieldName] = value;
    index += 1;
  }
  return options;
}

function readPayload(options) {
  if (options.payload && options.payloadFile) {
    throw new Error("Use either --payload or --payload-file, not both");
  }
  if (options.payloadFile) return fs.readFileSync(options.payloadFile, "utf8");
  if (options.payload) return options.payload;
  throw new Error("Provide --payload or --payload-file");
}

function parseToleranceSeconds(value) {
  if (value === undefined) return DEFAULT_TOLERANCE_SECONDS;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("--tolerance-seconds must be a non-negative number");
  }
  return parsed;
}

function computeSignature({ secret, timestamp, payload }) {
  const payloadToSign = `${SIGNATURE_VERSION}.${timestamp}.${payload}`;
  const digest = crypto
    .createHmac("sha256", Buffer.from(secret, "utf8"))
    .update(Buffer.from(payloadToSign, "utf8"))
    .digest("hex");
  return `${SIGNATURE_VERSION}=${digest}`;
}

function parseSignatureHeader(header) {
  return String(header || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      const separatorIndex = value.indexOf("=");
      if (separatorIndex === -1) return { version: "", digest: "" };
      return {
        version: value.slice(0, separatorIndex),
        digest: value.slice(separatorIndex + 1)
      };
    });
}

function safeHexEqual(leftHex, rightHex) {
  if (!/^[0-9a-f]+$/i.test(leftHex) || !/^[0-9a-f]+$/i.test(rightHex)) return false;
  const left = Buffer.from(leftHex, "hex");
  const right = Buffer.from(rightHex, "hex");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function checkTimestamp(timestamp, toleranceSeconds) {
  if (!/^\d+$/.test(String(timestamp))) {
    return {
      ok: false,
      reason: "timestamp_not_numeric",
      ageSeconds: null
    };
  }

  const timestampMs = Number(timestamp);
  if (!Number.isSafeInteger(timestampMs)) {
    return {
      ok: false,
      reason: "timestamp_not_safe_integer",
      ageSeconds: null
    };
  }

  const ageSeconds = Math.abs(Date.now() - timestampMs) / 1000;
  return {
    ok: ageSeconds <= toleranceSeconds,
    reason: ageSeconds <= toleranceSeconds ? "" : "timestamp_outside_tolerance",
    ageSeconds: Number(ageSeconds.toFixed(3))
  };
}

function extractEventSummary(payload) {
  try {
    const parsed = JSON.parse(payload);
    return {
      event: parsed.event || "",
      orderId: parsed.order_id || "",
      merchantOrderExtRef: parsed.merchant_order_ext_ref || "",
      payloadJson: true
    };
  } catch (_error) {
    return {
      event: "",
      orderId: "",
      merchantOrderExtRef: "",
      payloadJson: false
    };
  }
}

function verifyWebhook({ secret, timestamp, payload, signatureHeader, toleranceSeconds, skipTimestampTolerance }) {
  const expected = computeSignature({ secret, timestamp, payload });
  const expectedDigest = expected.slice(`${SIGNATURE_VERSION}=`.length);
  const candidates = parseSignatureHeader(signatureHeader);
  const signatureMatched = candidates.some((candidate) => (
    candidate.version === SIGNATURE_VERSION && safeHexEqual(candidate.digest, expectedDigest)
  ));
  const timestampCheck = skipTimestampTolerance
    ? { ok: true, reason: "skipped", ageSeconds: null }
    : checkTimestamp(timestamp, toleranceSeconds);
  const summary = extractEventSummary(payload);

  return {
    ok: signatureMatched && timestampCheck.ok,
    signatureMatched,
    timestampAccepted: timestampCheck.ok,
    timestampReason: timestampCheck.reason,
    timestampAgeSeconds: timestampCheck.ageSeconds,
    toleranceSeconds,
    signatureVersion: SIGNATURE_VERSION,
    signatureCount: candidates.length,
    event: summary.event,
    orderId: summary.orderId,
    merchantOrderExtRef: summary.merchantOrderExtRef,
    payloadJson: summary.payloadJson
  };
}

function runSelfTest() {
  const timestamp = String(Date.now());
  const validSignature = computeSignature({
    secret: SAMPLE_SECRET,
    timestamp,
    payload: SAMPLE_PAYLOAD
  });
  const valid = verifyWebhook({
    secret: SAMPLE_SECRET,
    timestamp,
    payload: SAMPLE_PAYLOAD,
    signatureHeader: validSignature,
    toleranceSeconds: DEFAULT_TOLERANCE_SECONDS,
    skipTimestampTolerance: false
  });
  const tampered = verifyWebhook({
    secret: SAMPLE_SECRET,
    timestamp,
    payload: SAMPLE_PAYLOAD.replace("ORDER_COMPLETED", "ORDER_FAILED"),
    signatureHeader: validSignature,
    toleranceSeconds: DEFAULT_TOLERANCE_SECONDS,
    skipTimestampTolerance: false
  });
  const stale = verifyWebhook({
    secret: SAMPLE_SECRET,
    timestamp: "1683650202360",
    payload: SAMPLE_PAYLOAD,
    signatureHeader: computeSignature({
      secret: SAMPLE_SECRET,
      timestamp: "1683650202360",
      payload: SAMPLE_PAYLOAD
    }),
    toleranceSeconds: DEFAULT_TOLERANCE_SECONDS,
    skipTimestampTolerance: false
  });

  const passed = valid.ok && !tampered.ok && !tampered.signatureMatched && !stale.ok && stale.signatureMatched && !stale.timestampAccepted;
  return {
    ok: passed,
    mode: "self_test",
    cases: {
      valid,
      tamperedPayload: tampered,
      staleTimestamp: stale
    },
    note: "Self-test uses fake sample data only. No Revolut secret is required or printed."
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  if (options.selfTest) {
    const result = runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  const secret = process.env.REVOLUT_WEBHOOK_SIGNING_SECRET;
  if (!secret) throw new Error("Set REVOLUT_WEBHOOK_SIGNING_SECRET before verifying a real webhook sample");
  if (!options.timestamp) throw new Error("--timestamp is required");
  if (!options.signature) throw new Error("--signature is required");

  const result = verifyWebhook({
    secret,
    timestamp: options.timestamp,
    payload: readPayload(options),
    signatureHeader: options.signature,
    toleranceSeconds: parseToleranceSeconds(options.toleranceSeconds),
    skipTimestampTolerance: Boolean(options.skipTimestampTolerance)
  });

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
