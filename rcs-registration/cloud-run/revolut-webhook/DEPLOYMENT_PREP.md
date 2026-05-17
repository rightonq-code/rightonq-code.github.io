# Revolut Webhook Cloud Run Deployment Runbook

Status: first sandbox record-only Cloud Run service deployed on 2026-05-17. Do not change the Revolut webhook URL from this file without a fresh explicit approval and proof pass.

## Target

- Project: `RightOnQ-GOG` / `rightonq-gog` / `872475523113`
- Region: `europe-west2` / London
- Service name: `roq-rcs-revolut-webhook`
- Runtime shape: Cloud Run functions / Functions Framework source deployment
- Runtime: Node.js 22
- Entry point / target: `revolutWebhook`
- Deploy source root: `rcs-registration`
- Entry module: `cloud-run/revolut-webhook/index.mjs`
- Runtime service account: `roq-rcs-revolut-webhook@rightonq-gog.iam.gserviceaccount.com`

## Deployed Sandbox Service

- Service URL: `https://roq-rcs-revolut-webhook-872475523113.europe-west2.run.app`
- Latest revision: `roq-rcs-revolut-webhook-00003-ss7`
- Traffic: latest built revision has 100% traffic
- Cloud Build ID: `bdb4a239-1585-440f-a61d-5805fa3df927`
- Cloud Build trigger: created by the Cloud Run repository deploy flow
- Revolut webhook URL: not changed

## Deployed Mode

The deployed sandbox service must stay record-only:

- verify Revolut signatures and timestamps;
- write dedupe/event records to Firestore;
- enrich fresh non-duplicate `ORDER_COMPLETED` events through the sandbox Merchant API;
- log redacted record-mode fields only;
- do not call Apps Script;
- do not update Billing;
- do not enable the public payment gate;
- do not change the Revolut webhook URL until the deployed endpoint is proven.

## Cloud Run Settings

The first sandbox deploy used these settings:

| Setting | Value |
| --- | --- |
| Region | `europe-west2` / London |
| Deploy type | Function / inline source or source deployment |
| Runtime | Node.js 22 |
| Entry point | `revolutWebhook` |
| Deploy source root | `rcs-registration` |
| Service account | `roq-rcs-revolut-webhook@rightonq-gog.iam.gserviceaccount.com` |
| Ingress | All |
| Authentication | Allow public access |
| Billing | Request-based |
| Service minimum instances | `0` |
| Service maximum instances | `2` for the first sandbox proof |
| Revision min/max instances | Leave blank |
| CPU | `1` |
| Memory | `512 MiB` |
| Concurrency | `10` for the first sandbox proof |
| Request timeout | `60 seconds` |
| Startup CPU boost | Leave enabled |

Why public access is expected: Revolut is an external webhook sender and cannot be expected to present Google IAM credentials. The security boundary for this endpoint is the Revolut HMAC signature, timestamp tolerance, method check, raw-body requirement, Firestore dedupe, and record-only behaviour. Cloud Run authentication should be revisited if Revolut later supports an authenticated delivery mechanism.

Why the source root is `rcs-registration`: the Cloud Run entry module imports shared verified webhook primitives from `rcs-registration/tools/`. Deploying only `rcs-registration/cloud-run/revolut-webhook/` would omit those shared modules and break the runtime import. The root `rcs-registration/package.json` points Functions Framework at `cloud-run/revolut-webhook/index.mjs` while keeping the shared `tools/` files inside the deployed source tree.

The deploy root has a `.gcloudignore` allowlist so the upload is limited to:

- `package.json`;
- `cloud-run/revolut-webhook/**`;
- `tools/revolut-webhook-handler.mjs`;
- `tools/revolut-webhook-map.mjs`;
- `tools/revolut-webhook-verify.mjs`.

There is currently no committed `package-lock.json` for `rcs-registration`. That is acceptable for the first sandbox proof, but adding a lockfile before a long-lived production deploy would improve dependency reproducibility.

## Environment And Secrets

Set these runtime environment variables:

| Variable | Source |
| --- | --- |
| `REVOLUT_WEBHOOK_SIGNING_SECRET` | Global Secret Manager secret `roq-rcs-revolut-webhook-signing-secret-sandbox-global`, version `latest` |
| `REVOLUT_MERCHANT_API_SECRET` | Global Secret Manager secret `roq-rcs-revolut-merchant-api-secret-sandbox-global`, version `latest` |
| `REVOLUT_MERCHANT_API_BASE_URL` | Plain value `https://sandbox-merchant.revolut.com/api` |
| `REVOLUT_API_VERSION` | Plain value `2026-04-20` |

Cloud Run secret references must use the global Secret Manager namespace. Google Cloud Run documentation states that Cloud Run does not support regional secrets, and the console rejected the original `europe-west2` regional secret resource IDs during the first deploy attempt. The two original regional sandbox secrets remain intact and verified; the two `-global` secrets are automatically replicated copies created only so Cloud Run can wire them as environment variables.

For the first sandbox proof, using Secret Manager version `latest` is acceptable because the current secret values have already been verified and no live payment key is involved. For production/live secrets, prefer pinned versions and a deliberate rotation plan.

## IAM State

Already done:

- the runtime service account has `roles/secretmanager.secretAccessor` directly on each regional sandbox secret and each Cloud Run global sandbox secret;
- no project-wide Secret Manager role was granted;
- the runtime service account has project-level `roles/datastore.user` / Cloud Datastore User on `RightOnQ-GOG`, which was the narrowest practical console path for server-side Firestore data access;
- no service account keys exist.

Notes:

- Firestore Security Rules are for mobile/web client access and are not the IAM mechanism for this server-side Cloud Run service account.
- The console did not expose a database-level IAM panel for `roles/datastore.user`; project-level IAM was used.
- Do not grant Owner, Editor, Datastore Owner, Firebase Admin, or service account keys.

## Cost Guardrails

- The `RightOnQ-GOG safety budget` is present at `GBP 10.00` per month with 50%, 90%, and 100% actual-spend alerts.
- The budget is alert-only; it does not cap or stop spend.
- Keep min instances at `0`.
- Keep first sandbox max instances low (`2`) and concurrency modest (`10`).
- Do not create production/live secrets or deploy a live endpoint in this slice.

## Stop Conditions

Stop before redeploying or changing service configuration if any of these happen:

- project is not `RightOnQ-GOG` / `rightonq-gog`;
- account is not `adam@rightonq.co.uk`;
- region cannot be set to `europe-west2`;
- service account dropdown does not show `roq-rcs-revolut-webhook`;
- either Cloud Run global sandbox secret is missing from the secret picker:
  - `roq-rcs-revolut-webhook-signing-secret-sandbox-global`;
  - `roq-rcs-revolut-merchant-api-secret-sandbox-global`;
- console asks to create service account keys;
- console asks for broad Owner/Editor permissions;
- console tries to create production/live secrets;
- console tries to change the Revolut webhook URL;
- Cloud Run deploy/redeploy summary differs from this runbook.
- deploy source root is shown as `rcs-registration/cloud-run/revolut-webhook` instead of `rcs-registration`.
- the deploy upload omits `tools/revolut-webhook-handler.mjs`, `tools/revolut-webhook-map.mjs`, or `tools/revolut-webhook-verify.mjs`.

## Proof After Deployment

The deployment has completed, but the endpoint still needs proof before any Revolut webhook URL change:

1. Confirm a `GET` or non-POST request returns `405 method_not_allowed`.
2. Confirm a POST without raw body/signature cannot be accepted.
3. Send one captured sandbox webhook body/signature/timestamp within tolerance, or use a fresh Revolut sandbox event.
4. Confirm the HTTP response is small and public-safe.
5. Confirm one Firestore document appears in `revolut_webhook_events`.
6. Confirm a duplicate delivery does not trigger a second enrichment call or duplicate write.
7. Only after that, consider changing the Revolut sandbox webhook URL.
