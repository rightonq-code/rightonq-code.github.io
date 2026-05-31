#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = "https://roq-rcs-proof-assets-872475523113.europe-west2.run.app";
const DEFAULT_BUCKET = "gs://rightonq-rcs-proof-assets";
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];
const VIDEO_EXTENSIONS = [".webm", ".mp4", ".mov"];

const ASSET_SPECS = [
  {
    key: "logo",
    label: "Logo",
    field: "RBM logo URL",
    fileBase: "rightonq-proof-logo",
    required: true,
    kind: "image",
    submittedToTwilio: true,
    dimensions: { width: 224, height: 224 },
    maxBytes: 50 * 1024,
    notes: "Approved sender logo; public, non-sensitive."
  },
  {
    key: "bannerMaster",
    label: "Banner master",
    field: "",
    fileBase: "rightonq-proof-banner-master",
    required: true,
    kind: "image",
    submittedToTwilio: false,
    dimensions: { width: 1440, height: 448 },
    maxBytes: 200 * 1024,
    notes: "Reusable Google/RBM master retained in the client pack; not the Twilio submission URL."
  },
  {
    key: "bannerTwilio",
    label: "Twilio banner export",
    field: "RBM banner URL",
    fileBase: "rightonq-proof-banner",
    required: true,
    kind: "image",
    submittedToTwilio: true,
    dimensions: { width: 1440, height: 448 },
    maxBytes: 200 * 1024,
    notes: "Twilio sender-profile submission export derived from the 1440x448 master."
  },
  {
    key: "optInProof",
    label: "Opt-in proof image",
    field: "Opt-in proof URL(s)",
    fileBase: "rightonq-proof-opt-in",
    required: true,
    kind: "image",
    submittedToTwilio: true,
    dimensions: null,
    maxBytes: null,
    notes: "Public proof of the opt-in route. Twilio has not published a strict dimension for this file in the current evidence."
  },
  {
    key: "reviewVideo",
    label: "Review video",
    field: "Review video URL",
    fileBase: "rightonq-proof-review-video",
    required: true,
    kind: "video",
    submittedToTwilio: true,
    dimensions: null,
    maxBytes: null,
    notes: "Public review/use-case video showing sender, opt-in path, message journey, HELP/support, and STOP/opt-out."
  }
];

function usage() {
  return [
    "Usage:",
    "  node rcs-registration/tools/proof-asset-manifest-plan.mjs --application-id ROQ-RCS-...",
    "  node rcs-registration/tools/proof-asset-manifest-plan.mjs --application-id ROQ-RCS-... --asset-dir /path/to/assets",
    "  node rcs-registration/tools/proof-asset-manifest-plan.mjs --self-test",
    "",
    "Options:",
    "  --application-id ID       Required unless --self-test is used",
    "  --asset-dir PATH          Optional local candidate asset directory to inspect",
    "  --base-url URL            Public proof-assets base URL (default: Cloud Run proof-assets service)",
    "  --bucket-uri URI          GCS bucket URI used for upload target planning",
    "  --self-test               Run offline fake-file checks",
    "",
    "Safety:",
    "  Offline/local only. This tool does not upload files, write Sheets, call Apps Script, call Twilio, call Google Cloud APIs, or mutate state.",
    "  It prints the required proof-asset manifest, target object paths, public URLs, and local validation findings."
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    bucketUri: DEFAULT_BUCKET
  };
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
    if (["--application-id", "--asset-dir", "--base-url", "--bucket-uri"].includes(token)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("Missing value for " + token);
      const name = token.slice(2).replace(/-([a-z])/g, function(_, char) {
        return char.toUpperCase();
      });
      options[name] = value;
      index += 1;
      continue;
    }
    throw new Error("Unknown option: " + token);
  }
  return options;
}

function add(list, code, message, assetKey, pathValue) {
  const item = { code, message };
  if (assetKey) item.asset = assetKey;
  if (pathValue) item.path = pathValue;
  list.push(item);
}

function normaliseBaseUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

function objectPrefix(applicationId) {
  return "rcs-proof/" + applicationId + "/";
}

function targetObject(spec, applicationId, extension) {
  return objectPrefix(applicationId) + spec.fileBase + extension;
}

function publicUrl(baseUrl, objectName) {
  return normaliseBaseUrl(baseUrl) + "/" + objectName;
}

function gcsUri(bucketUri, objectName) {
  return String(bucketUri || DEFAULT_BUCKET).replace(/\/+$/, "") + "/" + objectName;
}

function allowedExtensions(spec) {
  return spec.kind === "video" ? VIDEO_EXTENSIONS : IMAGE_EXTENSIONS;
}

function findLocalFile(assetDir, spec) {
  if (!assetDir) return null;
  for (const extension of allowedExtensions(spec)) {
    const candidate = path.join(assetDir, spec.fileBase + extension);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
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

function inspectLocalFile(filePath, spec, blockers, warnings) {
  const stat = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const result = {
    path: filePath,
    extension,
    bytes: stat.size
  };

  if (!allowedExtensions(spec).includes(extension)) {
    add(blockers, "unsupported_extension", spec.label + " has unsupported extension " + extension + ".", spec.key, filePath);
  }

  if (spec.maxBytes && stat.size > spec.maxBytes) {
    add(blockers, "file_too_large", spec.label + " is " + stat.size + " bytes; max is " + spec.maxBytes + " bytes.", spec.key, filePath);
  }

  if (spec.kind === "image") {
    const dimensions = parseImageDimensions(fs.readFileSync(filePath));
    result.dimensions = dimensions;
    if (!dimensions) {
      add(blockers, "unknown_image_dimensions", spec.label + " dimensions could not be read as PNG/JPEG.", spec.key, filePath);
    } else if (spec.dimensions && (dimensions.width !== spec.dimensions.width || dimensions.height !== spec.dimensions.height)) {
      add(
        blockers,
        "invalid_dimensions",
        spec.label + " is " + dimensions.width + "x" + dimensions.height + "; expected " + spec.dimensions.width + "x" + spec.dimensions.height + ".",
        spec.key,
        filePath
      );
    }
  }

  if (spec.kind === "video" && ![".webm", ".mp4"].includes(extension)) {
    add(warnings, "video_extension_review", spec.label + " uses " + extension + "; Twilio has not published a strict type, but WebM/MP4 are the safest review formats.", spec.key, filePath);
  }

  return result;
}

function buildManifest(options) {
  if (!options.applicationId) throw new Error("Missing --application-id");

  const blockers = [];
  const warnings = [];
  const info = [];
  const assetDir = options.assetDir ? path.resolve(options.assetDir) : "";

  if (assetDir && !fs.existsSync(assetDir)) {
    add(blockers, "asset_dir_missing", "Asset directory does not exist: " + assetDir, "assetDir", assetDir);
  } else if (assetDir && !fs.statSync(assetDir).isDirectory()) {
    add(blockers, "asset_dir_not_directory", "Asset path is not a directory: " + assetDir, "assetDir", assetDir);
  }

  const assets = ASSET_SPECS.map(function(spec) {
    const localPath = assetDir && blockers.every(item => item.code !== "asset_dir_missing" && item.code !== "asset_dir_not_directory")
      ? findLocalFile(assetDir, spec)
      : null;
    const extension = localPath ? path.extname(localPath).toLowerCase() : defaultExtension(spec);
    const objectName = targetObject(spec, options.applicationId, extension);
    const inspection = localPath ? inspectLocalFile(localPath, spec, blockers, warnings) : null;

    if (assetDir && spec.required && !localPath) {
      add(blockers, "missing_local_asset", spec.label + " is missing from " + assetDir + " using base name " + spec.fileBase + ".", spec.key);
    }

    return {
      key: spec.key,
      label: spec.label,
      trackingField: spec.field || null,
      required: spec.required,
      submittedToTwilio: spec.submittedToTwilio,
      expected: {
        kind: spec.kind,
        allowedExtensions: allowedExtensions(spec),
        dimensions: spec.dimensions,
        maxBytes: spec.maxBytes
      },
      localPath,
      localInspection: inspection,
      objectName,
      gcsUri: gcsUri(options.bucketUri, objectName),
      publicUrl: publicUrl(options.baseUrl, objectName),
      notes: spec.notes
    };
  });

  if (!assetDir) {
    add(info, "manifest_only", "No --asset-dir supplied; generated required asset plan without local file validation.");
  } else if (!blockers.length && !warnings.length) {
    add(info, "local_assets_clean", "All local candidate assets match the manifest constraints.");
  }

  return {
    ok: blockers.length === 0,
    readyForUpload: Boolean(assetDir) && blockers.length === 0,
    applicationId: options.applicationId,
    assetDir: assetDir || null,
    baseUrl: normaliseBaseUrl(options.baseUrl),
    bucketUri: String(options.bucketUri || DEFAULT_BUCKET).replace(/\/+$/, ""),
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
    operatorTrackingPreview: buildTrackingPreview(assets),
    nextSteps: [
      "Review/approve the source files before upload.",
      "Upload only public, non-sensitive proof assets to the planned GCS object paths.",
      "Run proof-asset-url-preflight.mjs against the refreshed operator snapshot after hosted URLs are recorded.",
      "Do not treat this manifest as provider submission approval."
    ],
    safety: [
      "No upload performed.",
      "No Apps Script, Google Sheets, Twilio, Revolut, or Google Cloud API call performed.",
      "Do not place ID documents, representative evidence, credentials, customer lists, private logs, or provider secrets in proof-assets storage."
    ]
  };
}

function defaultExtension(spec) {
  return spec.kind === "video" ? ".webm" : ".png";
}

function buildTrackingPreview(assets) {
  const preview = {};
  assets.forEach(function(asset) {
    if (asset.trackingField) preview[asset.trackingField] = asset.publicUrl;
  });
  return preview;
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

function makeTempDir() {
  return fs.mkdtempSync(path.join("/tmp", "roq-rcs-asset-manifest-"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  const directory = makeTempDir();
  fs.writeFileSync(path.join(directory, "rightonq-proof-logo.png"), makePng(224, 224));
  fs.writeFileSync(path.join(directory, "rightonq-proof-banner-master.png"), makePng(1440, 448));
  fs.writeFileSync(path.join(directory, "rightonq-proof-banner.png"), makePng(1440, 448));
  fs.writeFileSync(path.join(directory, "rightonq-proof-opt-in.png"), makePng(1200, 800));
  fs.writeFileSync(path.join(directory, "rightonq-proof-review-video.webm"), Buffer.from("webm"));

  const ready = buildManifest({
    applicationId: "ROQ-RCS-TEST-MANIFEST",
    assetDir: directory,
    baseUrl: DEFAULT_BASE_URL,
    bucketUri: DEFAULT_BUCKET
  });
  assert(ready.ok === true, "ready manifest should pass");
  assert(ready.readyForUpload === true, "ready manifest should be upload-ready");
  assert(ready.operatorTrackingPreview["RBM banner URL"].endsWith("/rightonq-proof-banner.png"), "tracking preview should use Twilio banner export");

  fs.writeFileSync(path.join(directory, "rightonq-proof-banner.png"), makePng(1440, 449));
  const bad = buildManifest({
    applicationId: "ROQ-RCS-TEST-MANIFEST",
    assetDir: directory,
    baseUrl: DEFAULT_BASE_URL,
    bucketUri: DEFAULT_BUCKET
  });
  assert(bad.ok === false, "bad manifest should fail");
  assert(bad.blockers.some(item => item.asset === "bannerTwilio" && item.code === "invalid_dimensions"), "bad manifest should flag Twilio banner dimensions");

  const planOnly = buildManifest({
    applicationId: "ROQ-RCS-TEST-MANIFEST",
    baseUrl: DEFAULT_BASE_URL,
    bucketUri: DEFAULT_BUCKET
  });
  assert(planOnly.ok === true, "plan-only manifest should pass without local validation blockers");
  assert(planOnly.readyForUpload === false, "plan-only manifest should not be upload-ready");

  return {
    ok: true,
    selfTest: "passed",
    cases: {
      ready: ready.summary,
      bad: bad.summary,
      planOnly: planOnly.summary
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
  printResult(buildManifest(options));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(function(error) {
    console.error(error.message);
    process.exit(1);
  });
}

export { buildManifest };
