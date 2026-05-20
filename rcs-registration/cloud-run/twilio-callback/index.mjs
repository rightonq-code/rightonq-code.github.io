#!/usr/bin/env node

import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const AUTH_TOKEN_ENV = "TWILIO_AUTH_TOKEN";
const PUBLIC_BASE_URL_ENV = "TWILIO_CALLBACK_PUBLIC_BASE_URL";
const SAMPLE_AUTH_TOKEN = "twilio_auth_token_TEST_DO_NOT_USE";
const SAMPLE_URL = "https://roq-rcs-twilio-callback.example.test/twilio/status";
const SAMPLE_PARAMS = {
  MessageSid: "SM00000000000000000000000000000000",
  MessageStatus: "delivered",
  From: "rcs:roq-proof-sender",
  To: "+447000000003",
  EventType: "READ",
  ErrorCode: "",
  ChannelStatusMessage: ""
};

function sendJson(res, status, body) {
  res.status(status);
  res.set("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(body));
}

function parseFormBody(rawBody) {
  const params = new URLSearchParams(Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody || ""));
  const parsed = {};
  for (const [key, value] of params.entries()) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      const current = parsed[key];
      parsed[key] = Array.isArray(current) ? [...current, value] : [current, value];
    } else {
      parsed[key] = value;
    }
  }
  return parsed;
}

function normaliseBody(body, rawBody) {
  if (body && typeof body === "object" && !Buffer.isBuffer(body) && !Array.isArray(body)) {
    return { ...body };
  }
  return parseFormBody(rawBody);
}

function getHeader(req, name) {
  if (typeof req.get === "function") return req.get(name) || "";
  const headers = req.headers || {};
  const lowerName = name.toLowerCase();
  return headers[name] || headers[lowerName] || "";
}

function getRequestPathAndQuery(req) {
  const rawUrl = req.originalUrl || req.url || "/";
  if (String(rawUrl).startsWith("http://") || String(rawUrl).startsWith("https://")) {
    const parsed = new URL(rawUrl);
    return `${parsed.pathname}${parsed.search}`;
  }
  return rawUrl;
}

function buildPublicUrl(req, env = process.env) {
  const configuredBase = env[PUBLIC_BASE_URL_ENV] || "";
  if (configuredBase) {
    const base = configuredBase.replace(/\/+$/, "");
    const pathAndQuery = getRequestPathAndQuery(req).startsWith("/")
      ? getRequestPathAndQuery(req)
      : `/${getRequestPathAndQuery(req)}`;
    return `${base}${pathAndQuery}`;
  }

  const protocol = getHeader(req, "x-forwarded-proto") || req.protocol || "https";
  const host = getHeader(req, "x-forwarded-host") || getHeader(req, "host");
  return `${protocol}://${host}${getRequestPathAndQuery(req)}`;
}

function flattenParamEntries(params = {}) {
  const entries = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) entries.push([key, String(item)]);
    } else {
      entries.push([key, String(value)]);
    }
  }
  return entries;
}

export function computeTwilioSignature({ authToken, url, params }) {
  const signed = flattenParamEntries(params)
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .reduce((buffer, [key, value]) => `${buffer}${key}${value}`, url);
  return crypto
    .createHmac("sha1", Buffer.from(authToken, "utf8"))
    .update(Buffer.from(signed, "utf8"))
    .digest("base64");
}

function safeBase64Equal(leftValue, rightValue) {
  const left = Buffer.from(String(leftValue || ""), "base64");
  const right = Buffer.from(String(rightValue || ""), "base64");
  if (!left.length || left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function verifyTwilioSignature({ authToken, url, params, signatureHeader }) {
  const expected = computeTwilioSignature({ authToken, url, params });
  return {
    ok: safeBase64Equal(expected, signatureHeader),
    expectedLength: expected.length,
    signaturePresent: Boolean(signatureHeader)
  };
}

function deriveChannel({ from = "", channelPrefix = "" } = {}) {
  const fromValue = String(from || "");
  if (fromValue.toLowerCase().startsWith("rcs:")) return "rcs";
  if (channelPrefix) return String(channelPrefix).replace(/:$/, "").toLowerCase();
  if (fromValue.startsWith("+")) return "sms_or_mms";
  return "";
}

function buildProjection(params = {}) {
  return {
    provider_message_id: params.MessageSid || "",
    provider_event_id: params.EventSid || null,
    status: params.MessageStatus || "",
    channel_event: params.EventType || "",
    channel: deriveChannel({
      from: params.From || "",
      channelPrefix: params.ChannelPrefix || ""
    }),
    error_code: params.ErrorCode || "",
    human_error: params.ChannelStatusMessage || "",
    from_present: Boolean(params.From),
    to_present: Boolean(params.To),
    payload_field_count: Object.keys(params).length,
    read_receipt_signal: params.MessageStatus === "read" || params.EventType === "READ",
    raw_payload_preserved: true
  };
}

function redactedLog({ projection, signatureOk, contentType, url }) {
  return {
    component: "roq-rcs-twilio-callback",
    mode: "record_only",
    signatureOk,
    contentType,
    urlPath: (() => {
      try {
        return new URL(url).pathname;
      } catch {
        return "";
      }
    })(),
    providerMessageId: projection.provider_message_id,
    providerEventIdPresent: Boolean(projection.provider_event_id),
    status: projection.status,
    channelEvent: projection.channel_event,
    channel: projection.channel,
    errorCode: projection.error_code,
    humanErrorPresent: Boolean(projection.human_error),
    fieldCount: projection.payload_field_count,
    readReceiptSignal: projection.read_receipt_signal,
    writeApplied: false
  };
}

export async function twilioCallback(req, res) {
  if (req.method !== "POST") {
    res.set("Allow", "POST");
    return sendJson(res, 405, { ok: false, accepted: false, reason: "method_not_allowed" });
  }

  const authToken = process.env[AUTH_TOKEN_ENV] || "";
  if (!authToken) return sendJson(res, 500, { ok: false, accepted: false, reason: "missing_twilio_auth_token" });

  const params = normaliseBody(req.body, req.rawBody);
  const signatureHeader = getHeader(req, "X-Twilio-Signature");
  const publicUrl = buildPublicUrl(req);
  const verification = verifyTwilioSignature({
    authToken,
    url: publicUrl,
    params,
    signatureHeader
  });

  const projection = buildProjection(params);
  console.log(redactedLog({
    projection,
    signatureOk: verification.ok,
    contentType: getHeader(req, "content-type"),
    url: publicUrl
  }));

  if (!verification.ok) {
    return sendJson(res, 403, { ok: false, accepted: false, reason: "invalid_twilio_signature" });
  }

  return sendJson(res, 200, {
    ok: true,
    accepted: true,
    mode: "record_only",
    provider_message_id: projection.provider_message_id,
    provider_event_id: projection.provider_event_id,
    status: projection.status,
    channel_event: projection.channel_event,
    channel: projection.channel,
    error_code: projection.error_code,
    human_error_present: Boolean(projection.human_error),
    read_receipt_signal: projection.read_receipt_signal,
    write_applied: false
  });
}

function runSelfTest() {
  const signature = computeTwilioSignature({
    authToken: SAMPLE_AUTH_TOKEN,
    url: SAMPLE_URL,
    params: SAMPLE_PARAMS
  });
  const valid = verifyTwilioSignature({
    authToken: SAMPLE_AUTH_TOKEN,
    url: SAMPLE_URL,
    params: SAMPLE_PARAMS,
    signatureHeader: signature
  });
  if (!valid.ok) throw new Error("Expected sample signature to verify");

  const invalid = verifyTwilioSignature({
    authToken: SAMPLE_AUTH_TOKEN,
    url: SAMPLE_URL,
    params: { ...SAMPLE_PARAMS, MessageStatus: "failed" },
    signatureHeader: signature
  });
  if (invalid.ok) throw new Error("Expected tampered params to fail verification");

  const projection = buildProjection(SAMPLE_PARAMS);
  if (projection.provider_message_id !== SAMPLE_PARAMS.MessageSid) throw new Error("MessageSid projection failed");
  if (projection.provider_event_id !== null) throw new Error("provider_event_id should default to null");
  if (projection.channel !== "rcs") throw new Error("RCS channel projection failed");
  if (!projection.read_receipt_signal) throw new Error("READ read-receipt signal projection failed");

  const parsed = parseFormBody("MessageSid=SM123&MessageStatus=delivered&ExtraField=kept");
  if (parsed.ExtraField !== "kept") throw new Error("Form parser did not preserve extra field");

  console.log(JSON.stringify({ ok: true, component: "roq-rcs-twilio-callback" }));
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href && !process.argv.includes("--self-test")) {
  console.log("This module is intended to run through Functions Framework.");
}
