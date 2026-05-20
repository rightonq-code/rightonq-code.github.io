#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";

const IMAGE_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"]);

const BANNER_PROFILES = {
  twilio: { width: 1140, height: 448, label: "Twilio current RCS onboarding" },
  google: { width: 1440, height: 448, label: "Google RBM agent information" }
};

const ASSET_FIELDS = [
  {
    label: "RBM logo URL",
    codeName: "logo",
    kind: "image",
    maxBytes: 50 * 1024,
    dimensions: [{ width: 224, height: 224, label: "Twilio/Google logo" }]
  },
  {
    label: "RBM banner URL",
    codeName: "banner",
    kind: "image",
    maxBytes: 200 * 1024,
    banner: true
  },
  {
    label: "Opt-in proof URL(s)",
    codeName: "optInProof",
    kind: "image"
  },
  {
    label: "Review video URL",
    codeName: "reviewVideo",
    kind: "video"
  }
];

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/proof-asset-url-preflight.mjs --snapshot-file operator-status.json",
    "  node rcs-registration/tools/proof-asset-url-preflight.mjs --snapshot-file operator-status.json --banner-profile twilio",
    "  node rcs-registration/tools/proof-asset-url-preflight.mjs --self-test",
    "",
    "Options:",
    "  --snapshot-file PATH       JSON output from operator-status.mjs",
    "  --banner-profile PROFILE   twilio, google, or either (default: twilio)",
    "  --self-test                Run offline fake-fetch checks",
    "",
    "Safety:",
    "  Read-only. This tool fetches public proof asset URLs only.",
    "  It does not call Apps Script, Twilio, Revolut, Google Cloud APIs, or write Sheets."
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
    if (token === "--banner-profile") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for --banner-profile");
      if (!["twilio", "google", "either"].includes(value)) {
        throw new Error("--banner-profile must be twilio, google, or either");
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

function valueFrom(record, label, camelName) {
  if (!record || typeof record !== "object") return "";
  const value = record[label] ?? record[camelName] ?? "";
  return value === null || value === undefined ? "" : String(value).trim();
}

function splitUrls(value) {
  return String(value || "")
    .split(/[,\n]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function add(list, code, message, field, url) {
  const item = { code, message };
  if (field) item.field = field;
  if (url) item.url = url;
  list.push(item);
}

function getApplicationId(snapshot) {
  return (
    snapshot.applicationId ||
    snapshot.application?.applicationId ||
    snapshot.twilioSetup?.["Application ID"] ||
    snapshot.twilioSetup?.applicationId ||
    ""
  );
}

function contentLengthFrom(headers) {
  const range = headers.get("content-range");
  if (range) {
    const match = range.match(/\/(\d+)$/);
    if (match) return Number(match[1]);
  }
  const length = headers.get("content-length");
  return length ? Number(length) : null;
}

function normaliseContentType(value) {
  return String(value || "").split(";")[0].trim().toLowerCase();
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchImageMeta(url, fetcher) {
  const response = await fetcher(url, {
    method: "GET",
    headers: { Range: "bytes=0-262143" }
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    ok: response.ok || response.status === 206,
    status: response.status,
    contentType: normaliseContentType(response.headers.get("content-type")),
    contentLength: contentLengthFrom(response.headers),
    bytesRead: buffer.length,
    dimensions: parseImageDimensions(buffer)
  };
}

async function fetchVideoMeta(url, fetcher) {
  let response = await fetcher(url, { method: "HEAD" });
  if (!response.ok || !response.headers.get("content-type")) {
    response = await fetcher(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" }
    });
  }
  return {
    ok: response.ok || response.status === 206,
    status: response.status,
    contentType: normaliseContentType(response.headers.get("content-type")),
    contentLength: contentLengthFrom(response.headers)
  };
}

function parseImageDimensions(buffer) {
  if (buffer.length >= 24 && buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return {
      format: "png",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2) break;
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        return {
          format: "jpeg",
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5)
        };
      }
      offset += 2 + length;
    }
  }

  return null;
}

function expectedBannerDimensions(profile) {
  if (profile === "either") return [BANNER_PROFILES.twilio, BANNER_PROFILES.google];
  return [BANNER_PROFILES[profile]];
}

function dimensionsMatch(dimensions, expected) {
  return expected.some(item => item.width === dimensions.width && item.height === dimensions.height);
}

function describeDimensions(expected) {
  return expected.map(item => item.width + "x" + item.height + " (" + item.label + ")").join(" or ");
}

async function assessAssetUrls(snapshot, options = {}) {
  const fetcher = options.fetcher || fetchWithTimeout;
  const bannerProfile = options.bannerProfile || "twilio";
  const blockers = [];
  const warnings = [];
  const info = [];
  const assets = [];

  if (!snapshot || typeof snapshot !== "object") {
    add(blockers, "invalid_snapshot", "Snapshot must be a JSON object.");
    return buildResult(snapshot, blockers, warnings, info, assets, bannerProfile);
  }

  const twilioSetup = snapshot.twilioSetup || {};
  if (!twilioSetup || !Object.keys(twilioSetup).length) {
    add(blockers, "missing_twilio_setup", "Snapshot is missing the Twilio setup row.", "twilioSetup");
  }

  for (const field of ASSET_FIELDS) {
    const urls = splitUrls(valueFrom(twilioSetup, field.label));
    if (!urls.length) {
      add(blockers, "missing_" + field.codeName + "_url", field.label + " is missing.", field.label);
      continue;
    }

    for (const url of urls) {
      if (!/^https:\/\//i.test(url)) {
        add(blockers, "non_https_" + field.codeName + "_url", field.label + " must use a public HTTPS URL.", field.label, url);
        continue;
      }

      try {
        if (field.kind === "image") {
          const meta = await fetchImageMeta(url, fetcher);
          const asset = { field: field.label, url, kind: field.kind, ...meta };
          assets.push(asset);
          validateImageField(field, meta, bannerProfile, blockers, warnings, info, url);
        } else {
          const meta = await fetchVideoMeta(url, fetcher);
          const asset = { field: field.label, url, kind: field.kind, ...meta };
          assets.push(asset);
          validateVideoField(field, meta, blockers, warnings, url);
        }
      } catch (error) {
        add(blockers, "fetch_failed_" + field.codeName, field.label + " could not be fetched: " + error.message, field.label, url);
      }
    }
  }

  if (blockers.length === 0 && warnings.length === 0) {
    add(info, "asset_urls_clean", "All checked proof asset URLs are reachable and match the selected asset constraints.");
  }

  return buildResult(snapshot, blockers, warnings, info, assets, bannerProfile);
}

function validateImageField(field, meta, bannerProfile, blockers, warnings, info, url) {
  if (!meta.ok) {
    add(blockers, "http_" + field.codeName + "_url", field.label + " returned HTTP " + meta.status + ".", field.label, url);
    return;
  }
  if (!IMAGE_CONTENT_TYPES.has(meta.contentType)) {
    add(blockers, "invalid_" + field.codeName + "_content_type", field.label + " must be PNG or JPEG; got '" + (meta.contentType || "unknown") + "'.", field.label, url);
  }
  if (!meta.dimensions) {
    add(blockers, "unknown_" + field.codeName + "_dimensions", field.label + " dimensions could not be read as PNG/JPEG.", field.label, url);
    return;
  }
  if (field.maxBytes && meta.contentLength && meta.contentLength > field.maxBytes) {
    add(blockers, "oversize_" + field.codeName, field.label + " is " + meta.contentLength + " bytes; max is " + field.maxBytes + " bytes.", field.label, url);
  } else if (field.maxBytes && !meta.contentLength) {
    add(warnings, "unknown_" + field.codeName + "_size", field.label + " size could not be confirmed from response headers.", field.label, url);
  }

  if (field.banner) {
    const expected = expectedBannerDimensions(bannerProfile);
    const dimensions = meta.dimensions;
    if (!dimensionsMatch(dimensions, expected)) {
      add(blockers, "invalid_banner_dimensions", "RBM banner URL is " + dimensions.width + "x" + dimensions.height + "; expected " + describeDimensions(expected) + ".", field.label, url);
      return;
    }
    const twilio = BANNER_PROFILES.twilio;
    const google = BANNER_PROFILES.google;
    if (dimensions.width === twilio.width && dimensions.height === twilio.height) {
      add(info, "banner_profile_twilio", "Banner matches Twilio current RCS onboarding dimensions.", field.label, url);
    } else if (dimensions.width === google.width && dimensions.height === google.height) {
      add(info, "banner_profile_google", "Banner matches Google RBM agent dimensions.", field.label, url);
    }
    return;
  }

  if (field.dimensions && !dimensionsMatch(meta.dimensions, field.dimensions)) {
    add(blockers, "invalid_" + field.codeName + "_dimensions", field.label + " is " + meta.dimensions.width + "x" + meta.dimensions.height + "; expected " + describeDimensions(field.dimensions) + ".", field.label, url);
  }
}

function validateVideoField(field, meta, blockers, warnings, url) {
  if (!meta.ok) {
    add(blockers, "http_" + field.codeName + "_url", field.label + " returned HTTP " + meta.status + ".", field.label, url);
    return;
  }
  if (!meta.contentType.startsWith("video/")) {
    add(blockers, "invalid_" + field.codeName + "_content_type", field.label + " should return a video content type; got '" + (meta.contentType || "unknown") + "'.", field.label, url);
  }
  if (!meta.contentLength) {
    add(warnings, "unknown_" + field.codeName + "_size", field.label + " size could not be confirmed from response headers.", field.label, url);
  }
}

function buildResult(snapshot, blockers, warnings, info, assets, bannerProfile) {
  const applicationId = snapshot && typeof snapshot === "object" ? getApplicationId(snapshot) : "";
  return {
    ok: blockers.length === 0,
    applicationId,
    bannerProfile,
    summary: {
      blockers: blockers.length,
      warnings: warnings.length,
      info: info.length,
      assets: assets.length
    },
    blockers,
    warnings,
    info,
    assets,
    note: "Read-only public asset URL preflight. Provider submission still requires the full proof-pack preflight and explicit RightOnQ approval."
  };
}

function makePng(width, height) {
  const buffer = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

function fakeResponse(body, headers = {}, status = 200) {
  return new Response(body, { status, headers });
}

function fakeFetcher(fixtures) {
  return async function(url, options = {}) {
    const fixture = fixtures[url];
    if (!fixture) return fakeResponse("", { "content-type": "text/plain" }, 404);
    if (options.method === "HEAD") {
      return fakeResponse("", fixture.headers, fixture.status || 200);
    }
    return fakeResponse(fixture.body, fixture.headers, fixture.status || 200);
  };
}

function makeReadySnapshot(baseUrl) {
  return {
    applicationId: "ROQ-RCS-TEST-ASSET-READY",
    twilioSetup: {
      "Application ID": "ROQ-RCS-TEST-ASSET-READY",
      "RBM logo URL": baseUrl + "/logo.png",
      "RBM banner URL": baseUrl + "/banner.png",
      "Opt-in proof URL(s)": baseUrl + "/opt-in.png",
      "Review video URL": baseUrl + "/review.webm"
    }
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runSelfTest() {
  const baseUrl = "https://assets.example.test";
  const fixtures = {
    [baseUrl + "/logo.png"]: {
      body: makePng(224, 224),
      headers: { "content-type": "image/png", "content-length": String(40 * 1024) }
    },
    [baseUrl + "/banner.png"]: {
      body: makePng(1140, 448),
      headers: { "content-type": "image/png", "content-length": String(150 * 1024) }
    },
    [baseUrl + "/opt-in.png"]: {
      body: makePng(800, 600),
      headers: { "content-type": "image/png", "content-length": String(60 * 1024) }
    },
    [baseUrl + "/review.webm"]: {
      body: Buffer.from("video"),
      headers: { "content-type": "video/webm", "content-length": String(1024 * 1024) }
    }
  };

  const ready = await assessAssetUrls(makeReadySnapshot(baseUrl), {
    fetcher: fakeFetcher(fixtures),
    bannerProfile: "twilio"
  });
  assert(ready.ok === true, "ready snapshot should pass");
  assert(ready.summary.assets === 4, "ready snapshot should check four assets");

  const badSnapshot = makeReadySnapshot(baseUrl);
  badSnapshot.twilioSetup["RBM logo URL"] = baseUrl + "/opt-in.png";
  badSnapshot.twilioSetup["RBM banner URL"] = baseUrl + "/logo.png";
  badSnapshot.twilioSetup["Review video URL"] = "http://assets.example.test/review.webm";
  const bad = await assessAssetUrls(badSnapshot, {
    fetcher: fakeFetcher(fixtures),
    bannerProfile: "twilio"
  });
  assert(bad.ok === false, "bad snapshot should fail");
  assert(bad.blockers.some(item => item.code === "invalid_logo_dimensions"), "bad snapshot should flag logo dimensions");
  assert(bad.blockers.some(item => item.code === "invalid_banner_dimensions"), "bad snapshot should flag banner dimensions");
  assert(bad.blockers.some(item => item.code === "non_https_reviewVideo_url"), "bad snapshot should flag non-HTTPS video");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      ready: ready.summary,
      bad: bad.summary
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
  printResult(await assessAssetUrls(snapshot, options));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(function(error) {
    console.error(error.message);
    process.exit(1);
  });
}

export { assessAssetUrls, parseImageDimensions };
