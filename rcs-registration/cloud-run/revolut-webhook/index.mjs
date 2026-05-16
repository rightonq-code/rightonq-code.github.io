#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { computeSignature } from "../../tools/revolut-webhook-verify.mjs";
import { handleRevolutWebhook } from "../../tools/revolut-webhook-handler.mjs";

const SIGNING_SECRET_ENV = "REVOLUT_WEBHOOK_SIGNING_SECRET";
const SAMPLE_SECRET = "wsk_TEST_DO_NOT_USE_IN_PRODUCTION";
const SAMPLE_PAYLOAD = "{\"event\":\"ORDER_PAYMENT_FAILED\",\"order_id\":\"order_TEST\",\"merchant_order_ext_ref\":\"ROQ-RCS-TEST-REVOLUT-WEBHOOK\"}";

function getRawBody(req) {
  if (typeof req.rawBody === "string" || Buffer.isBuffer(req.rawBody)) return req.rawBody;
  return null;
}

function sendJson(res, status, body) {
  res.status(status);
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}

function buildRecordOnlyLog(result) {
  const verification = result.internal && result.internal.verification || {};
  const mapping = result.internal && result.internal.mapping || {};
  const operatorBillingArgs = mapping.operatorBillingArgs || {};

  return {
    component: "roq-rcs-revolut-webhook",
    mode: "record_only",
    status: result.status,
    action: result.body && result.body.action || result.body && result.body.reason || "",
    accepted: Boolean(result.body && result.body.accepted),
    event: verification.event || mapping.event || "",
    orderId: verification.orderId || mapping.orderId || "",
    applicationId: mapping.applicationId || verification.merchantOrderExtRef || "",
    mapped: Boolean(mapping.mapped),
    enrichmentRequired: Boolean(mapping.enrichmentRequired),
    billingUpdateApplied: Boolean(result.body && result.body.billingUpdateApplied),
    billingStatus: operatorBillingArgs.billingStatus || "",
    paymentStatus: operatorBillingArgs.paymentStatus || "",
    refundStatus: operatorBillingArgs.refundStatus || "",
    timestampAccepted: Boolean(verification.timestampAccepted),
    signatureMatched: Boolean(verification.signatureMatched)
  };
}

function handleHttpRequest(req, {
  env = process.env,
  logger = console
} = {}) {
  if (req.method !== "POST") {
    return {
      status: 405,
      body: {
        ok: false,
        accepted: false,
        reason: "method_not_allowed"
      }
    };
  }

  const rawBody = getRawBody(req);
  if (rawBody === null) {
    return {
      status: 500,
      body: {
        ok: false,
        accepted: false,
        reason: "raw_body_unavailable"
      }
    };
  }

  const result = handleRevolutWebhook({
    rawBody,
    headers: req.headers || {},
    signingSecret: env[SIGNING_SECRET_ENV] || ""
  });

  logger.info(JSON.stringify(buildRecordOnlyLog(result)));
  return {
    status: result.status,
    body: result.body
  };
}

function revolutWebhook(req, res) {
  const result = handleHttpRequest(req);
  sendJson(res, result.status, result.body);
}

function signedHeaders(payload, timestamp = String(Date.now())) {
  return {
    "revolut-request-timestamp": timestamp,
    "revolut-signature": computeSignature({
      secret: SAMPLE_SECRET,
      timestamp,
      payload
    })
  };
}

function runSelfTest() {
  const logs = [];
  const logger = {
    info(message) {
      logs.push(JSON.parse(message));
    }
  };

  const valid = handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    logger
  });

  const missingRawBody = handleHttpRequest({
    method: "POST",
    body: JSON.parse(SAMPLE_PAYLOAD),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    logger
  });

  const wrongMethod = handleHttpRequest({
    method: "GET",
    rawBody: Buffer.from("", "utf8"),
    headers: {}
  }, {
    env: {
      [SIGNING_SECRET_ENV]: SAMPLE_SECRET
    },
    logger
  });

  const missingSecret = handleHttpRequest({
    method: "POST",
    rawBody: Buffer.from(SAMPLE_PAYLOAD, "utf8"),
    headers: signedHeaders(SAMPLE_PAYLOAD)
  }, {
    env: {},
    logger
  });

  const passed = valid.status === 202
    && valid.body.action === "verified_mapped_dry_run"
    && valid.body.billingUpdateApplied === false
    && missingRawBody.status === 500
    && missingRawBody.body.reason === "raw_body_unavailable"
    && wrongMethod.status === 405
    && wrongMethod.body.reason === "method_not_allowed"
    && missingSecret.status === 500
    && missingSecret.body.reason === "missing_signing_secret"
    && logs.length === 2
    && logs[0].event === "ORDER_PAYMENT_FAILED"
    && logs[0].paymentStatus === "failed"
    && !Object.prototype.hasOwnProperty.call(logs[0], "rawBody")
    && !Object.prototype.hasOwnProperty.call(logs[0], "signature");

  return {
    ok: passed,
    mode: "self_test",
    cases: {
      valid,
      missingRawBody,
      wrongMethod,
      missingSecret
    },
    logs,
    note: "Self-test uses fake payloads and a fake signing secret only. It does not call Revolut, Firestore, Apps Script, or Google Sheets."
  };
}

function main() {
  if (process.argv.includes("--self-test")) {
    const result = runSelfTest();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exit(1);
    return;
  }

  console.log("Usage: npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test");
}

export {
  buildRecordOnlyLog,
  handleHttpRequest,
  revolutWebhook,
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
