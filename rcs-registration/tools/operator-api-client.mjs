import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
const APPS_SCRIPT_DIR = resolve(TOOLS_DIR, "../google-apps-script");
const DEFAULT_CLASP_USER = "rightonq-gog";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function getCredentialStorePath() {
  return process.env.CLASPRC_JSON || resolve(homedir(), ".clasprc.json");
}

function getClaspProjectPath() {
  return process.env.RCS_ONBOARDING_CLASP_PROJECT ||
    resolve(APPS_SCRIPT_DIR, ".clasp.json");
}

function getClaspUser() {
  return process.env.RCS_ONBOARDING_CLASP_USER || DEFAULT_CLASP_USER;
}

function pickNamedCredential(store, user) {
  const tokens = store.tokens || {};
  const credential = tokens[user];
  if (!credential) {
    throw new Error(
      "Named clasp credential '" + user + "' was not found. Run clasp -u " + user + " login first."
    );
  }
  if (!credential.client_id || !credential.client_secret || !credential.refresh_token) {
    throw new Error("Named clasp credential '" + user + "' is missing OAuth fields.");
  }
  return credential;
}

async function getAccessToken() {
  const store = await readJson(getCredentialStorePath());
  const credential = pickNamedCredential(store, getClaspUser());
  const body = new URLSearchParams({
    client_id: credential.client_id,
    client_secret: credential.client_secret,
    refresh_token: credential.refresh_token,
    grant_type: "refresh_token"
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Unable to refresh Google access token");
  }
  return data.access_token;
}

async function getScriptId() {
  const project = await readJson(getClaspProjectPath());
  if (!project.scriptId) throw new Error("scriptId missing from .clasp.json");
  return project.scriptId;
}

function formatExecutionError(error) {
  const details = error && Array.isArray(error.details) ? error.details : [];
  const execution = details.find(item => item && item.errorMessage);
  if (!execution) return error && error.message ? error.message : "Apps Script execution failed";

  const stack = (execution.scriptStackTraceElements || [])
    .map(item => item.function + ":" + item.lineNumber)
    .join(", ");
  return execution.errorMessage + (stack ? " [" + stack + "]" : "");
}

export async function runOperatorAction(payload) {
  const [accessToken, scriptId] = await Promise.all([getAccessToken(), getScriptId()]);
  const response = await fetch("https://script.googleapis.com/v1/scripts/" + scriptId + ":run", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      function: "rcsOperatorAction",
      parameters: [payload],
      devMode: true
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    throw new Error(formatExecutionError(data.error));
  }
  return data.response && Object.prototype.hasOwnProperty.call(data.response, "result")
    ? data.response.result
    : data.response;
}
