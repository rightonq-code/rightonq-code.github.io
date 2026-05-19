#!/usr/bin/env node

import { pathToFileURL } from "node:url";

const BUCKET_ENV = "PROOF_ASSETS_BUCKET";
const PUBLIC_PREFIX_ENV = "PROOF_ASSETS_PUBLIC_PREFIX";
const DEFAULT_PUBLIC_PREFIX = "rcs-proof/";
const MAX_ASSET_BYTES_ENV = "PROOF_ASSETS_MAX_BYTES";
const DEFAULT_MAX_ASSET_BYTES = 100 * 1024 * 1024;
let storagePromise = null;

function sendJson(res, status, body) {
  res.status(status);
  res.set("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(body));
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalisePrefix(value = DEFAULT_PUBLIC_PREFIX) {
  const trimmed = String(value || DEFAULT_PUBLIC_PREFIX).replace(/^\/+/, "");
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function getRequestPath(req) {
  const raw = req.path || new URL(req.url || "/", "https://rightonq.invalid").pathname;
  try {
    return decodeURIComponent(String(raw).replace(/^\/+/, ""));
  } catch {
    return "";
  }
}

function resolveObjectName(req, {
  publicPrefix = DEFAULT_PUBLIC_PREFIX
} = {}) {
  const objectName = getRequestPath(req);
  const prefix = normalisePrefix(publicPrefix);
  if (!objectName || objectName.endsWith("/")) return "";
  if (!objectName.startsWith(prefix)) return "";
  if (objectName.includes("\\") || objectName.split("/").includes("..")) return "";
  return objectName;
}

async function getStorage() {
  if (!storagePromise) {
    storagePromise = import("@google-cloud/storage").then(({ Storage }) => new Storage());
  }
  return storagePromise;
}

function setAssetHeaders(res, metadata = {}) {
  if (metadata.contentType) res.set("Content-Type", metadata.contentType);
  if (metadata.cacheControl) {
    res.set("Cache-Control", metadata.cacheControl);
  } else {
    res.set("Cache-Control", "public, max-age=300");
  }
  if (metadata.size) res.set("Content-Length", String(metadata.size));
  if (metadata.etag) res.set("ETag", metadata.etag);
}

async function streamObject({
  bucketName,
  objectName,
  req,
  res,
  maxAssetBytes = DEFAULT_MAX_ASSET_BYTES,
  storageFactory = getStorage
}) {
  const storage = await storageFactory();
  const file = storage.bucket(bucketName).file(objectName);
  let metadata;

  try {
    [metadata] = await file.getMetadata();
  } catch (error) {
    const code = Number(error && (error.code || error.statusCode));
    if (code === 404) return sendJson(res, 404, { ok: false, reason: "asset_not_found" });
    console.error({
      component: "roq-rcs-proof-assets",
      action: "metadata_failed",
      objectName,
      code: code || "",
      message: String(error && error.message || error || "").slice(0, 160)
    });
    return sendJson(res, 502, { ok: false, reason: "asset_metadata_unavailable" });
  }

  const size = Number.parseInt(String(metadata.size || "0"), 10);
  if (Number.isFinite(size) && size > maxAssetBytes) {
    return sendJson(res, 413, { ok: false, reason: "asset_too_large" });
  }

  setAssetHeaders(res, metadata);
  if (req.method === "HEAD") {
    res.status(200).end();
    return null;
  }

  return new Promise(resolve => {
    const stream = file.createReadStream();
    let settled = false;

    stream.on("error", error => {
      if (settled) return;
      settled = true;
      console.error({
        component: "roq-rcs-proof-assets",
        action: "stream_failed",
        objectName,
        message: String(error && error.message || error || "").slice(0, 160)
      });
      if (!res.headersSent) sendJson(res, 502, { ok: false, reason: "asset_stream_unavailable" });
      else res.end();
      resolve(null);
    });

    stream.on("end", () => {
      settled = true;
      resolve(null);
    });

    res.status(200);
    stream.pipe(res);
  });
}

export async function proofAsset(req, res) {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.set("Allow", "GET, HEAD");
    return sendJson(res, 405, { ok: false, reason: "method_not_allowed" });
  }

  const bucketName = process.env[BUCKET_ENV] || "";
  if (!bucketName) return sendJson(res, 500, { ok: false, reason: "missing_bucket_config" });

  const objectName = resolveObjectName(req, {
    publicPrefix: process.env[PUBLIC_PREFIX_ENV] || DEFAULT_PUBLIC_PREFIX
  });
  if (!objectName) return sendJson(res, 404, { ok: false, reason: "asset_not_found" });

  return streamObject({
    bucketName,
    objectName,
    req,
    res,
    maxAssetBytes: parsePositiveInteger(process.env[MAX_ASSET_BYTES_ENV], DEFAULT_MAX_ASSET_BYTES)
  });
}

function runSelfTest() {
  const cases = [
    ["/rcs-proof/app/logo.png", "rcs-proof/app/logo.png"],
    ["/rcs-proof/app/", ""],
    ["/private/logo.png", ""],
    ["/rcs-proof/../secret.txt", ""],
    ["/rcs-proof/app/%5Csecret.txt", ""]
  ];

  for (const [path, expected] of cases) {
    const actual = resolveObjectName({ path });
    if (actual !== expected) {
      throw new Error(`resolveObjectName(${path}) returned ${actual}, expected ${expected}`);
    }
  }

  console.log(JSON.stringify({ ok: true, component: "roq-rcs-proof-assets" }));
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href && !process.argv.includes("--self-test")) {
  console.log("This module is intended to run through Functions Framework.");
}
