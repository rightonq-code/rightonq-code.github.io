#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import {
  DEFAULT_TOLERANCE_SECONDS,
  computeSignature,
  verifyWebhook
} from "./revolut-webhook-verify.mjs";
import { mapWebhookPayload } from "./revolut-webhook-map.mjs";

const SAMPLE_SECRET = "wsk_TEST_DO_NOT_USE_IN_PRODUCTION";
const SAMPLE_COMPLETED_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";
const SAMPLE_REFUND_PAYLOAD = "{\"event\":\"ORDER_COMPLETED\",\"order_id\":\"refund_order_TEST\"}";

function normaliseHeaders(headers = {}) {
  const normalised = {};
  if (headers && typeof headers.forEach === "function") {
    headers.forEach((value, key) => {
      normalised[String(key).toLowerCase()] = String(value);
    });
    return normalised;
  }

  Object.entries(headers || {}).forEach(([key, value]) => {
    normalised[String(key).toLowerCase()] = Array.isArray(value)
      ? value.join(",")
      : String(value);
  });
  return normalised;
}

function getHeader(headers, name) {
  return normaliseHeaders(headers)[name.toLowerCase()] || "";
}

function rawBodyToString(rawBody) {
  if (typeof rawBody === "string") return rawBody;
  if (Buffer.isBuffer(rawBody)) return rawBody.toString("utf8");
  throw new Error("rawBody must be the exact raw request body as a string or Buffer");
}

function jsonResponse(status, body, internal = {}) {
  return {
    status,
    headers: {
      "Content-Type": "application/json"
    },
    body,
    internal
  };
}

function handleRevolutWebhook({
  rawBody,
  headers,
  signingSecret,
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
  enrichedOrder = null,
  applicationId = "",
  receivedAt = ""
}) {
  if (!signingSecret) {
    return jsonResponse(500, {
      ok: false,
      accepted: false,
      reason: "missing_signing_secret"
    });
  }

  const payload = rawBodyToString(rawBody);
  const timestamp = getHeader(headers, "Revolut-Request-Timestamp");
  const signature = getHeader(headers, "Revolut-Signature");
  if (!timestamp || !signature) {
    return jsonResponse(400, {
      ok: false,
      accepted: false,
      reason: "missing_revolut_signature_headers",
      timestampPresent: Boolean(timestamp),
      signaturePresent: Boolean(signature)
    });
  }

  const verification = verifyWebhook({
    secret: signingSecret,
    timestamp,
    payload,
    signatureHeader: signature,
    toleranceSeconds,
    skipTimestampTolerance: false
  });
  if (!verification.ok) {
    return jsonResponse(401, {
      ok: false,
      accepted: false,
      reason: "verification_failed"
    }, {
      verification
    });
  }

  try {
    const mapping = mapWebhookPayload(payload, {
      requestTimestamp: timestamp,
      receivedAt,
      enrichedOrder,
      applicationId
    });

    if (mapping.enrichmentRequired) {
      return jsonResponse(202, {
        ok: true,
        accepted: true,
        action: "enrichment_required",
        billingUpdateApplied: false
      }, {
        verification,
        mapping
      });
    }

    if (!mapping.mapped) {
      return jsonResponse(202, {
        ok: true,
        accepted: true,
        action: "unmapped_event",
        billingUpdateApplied: false
      }, {
        verification,
        mapping
      });
    }

    return jsonResponse(202, {
      ok: true,
      accepted: true,
      action: "verified_mapped_dry_run",
      dedupeRequired: true,
      billingUpdateApplied: false
    }, {
      verification,
      mapping
    });
  } catch (error) {
    return jsonResponse(400, {
      ok: false,
      accepted: false,
      reason: "mapping_failed",
      message: error.message
    }, {
      verification
    });
  }
}

function signedHeaders(payload, timestamp = String(Date.now())) {
  return {
    "Revolut-Request-Timestamp": timestamp,
    "Revolut-Signature": computeSignature({
      secret: SAMPLE_SECRET,
      timestamp,
      payload
    })
  };
}

function runSelfTest() {
  const completed = handleRevolutWebhook({
    rawBody: SAMPLE_COMPLETED_PAYLOAD,
    headers: signedHeaders(SAMPLE_COMPLETED_PAYLOAD),
    signingSecret: SAMPLE_SECRET
  });
  const invalidSignature = handleRevolutWebhook({
    rawBody: SAMPLE_COMPLETED_PAYLOAD.replace("ORDER_COMPLETED", "ORDER_FAILED"),
    headers: signedHeaders(SAMPLE_COMPLETED_PAYLOAD),
    signingSecret: SAMPLE_SECRET
  });
  const refundNeedsEnrichment = handleRevolutWebhook({
    rawBody: SAMPLE_REFUND_PAYLOAD,
    headers: signedHeaders(SAMPLE_REFUND_PAYLOAD),
    signingSecret: SAMPLE_SECRET
  });

  const passed = completed.status === 202
    && completed.body.action === "verified_mapped_dry_run"
    && completed.internal.mapping.operatorBillingArgs.paymentStatus === "paid"
    && invalidSignature.status === 401
    && invalidSignature.body.reason === "verification_failed"
    && invalidSignature.internal.verification.signatureMatched === false
    && refundNeedsEnrichment.status === 202
    && refundNeedsEnrichment.body.action === "enrichment_required"
    && refundNeedsEnrichment.internal.mapping.enrichmentRequired === true;

  return {
    ok: passed,
    mode: "self_test",
    cases: {
      completed,
      invalidSignature,
      refundNeedsEnrichment
    },
    note: "Self-test uses fake sample payloads only. It does not call Revolut, Apps Script, or Google Sheets."
  };
}

function main() {
  if (process.argv.includes("--self-test")) {
    const result = runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  console.log("Usage: node rcs-registration/tools/revolut-webhook-handler.mjs --self-test");
}

export {
  handleRevolutWebhook,
  normaliseHeaders,
  getHeader,
  rawBodyToString,
  runSelfTest
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
