# Revolut Webhook Cloud Run Deployment Runbook

Status: first sandbox record-only Cloud Run service deployed, endpoint proof passed on 2026-05-17, and Revolut sandbox Merchant webhook pointed at Cloud Run with real sandbox delivery proof passed on 2026-05-18. Do not enable Billing writes from this file without a fresh explicit approval.

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
- Revolut sandbox Merchant webhook URL: `https://roq-rcs-revolut-webhook-872475523113.europe-west2.run.app`

## Endpoint Proof

Completed on 2026-05-17:

1. `GET /` returned `405 method_not_allowed`.
2. Unsigned `POST /` returned `400 missing_revolut_signature_headers`.
3. Signed sandbox proof request returned `HTTP 202` with body:
   `{"ok":true,"accepted":true,"action":"verified_mapped_dry_run","dedupeRequired":true,"billingUpdateApplied":false}`
4. Duplicate signed request for the same event returned the same public-safe `HTTP 202` body.
5. Firestore collection `revolut_webhook_events` contains exactly one document for proof order `roq-rcs-cloudrun-proof-20260517200925`.
6. Firestore proof document:
   - document ID: `1e3762fc7aa304c4692a4e4260d6db91bdd481e4e119396fda47a0fcb31a36d2`;
   - receipt key: `revolut:ORDER_PAYMENT_FAILED:roq-rcs-cloudrun-proof-20260517200925`;
   - state: `mapped`;
   - `signatureMatched`: `true`;
   - `timestampAccepted`: `true`;
   - `billingUpdateApplied`: `false`;
   - `createTime` equals `updateTime`, confirming the duplicate did not modify the document.
7. Cloud Run logs showed first request `dedupeDecision=create`, `dedupeRecorded=true`, `dedupeDuplicate=false`.
8. Cloud Run logs showed duplicate request `dedupeDecision=duplicate_terminal`, `dedupeRecorded=false`, `dedupeDuplicate=true`.
9. No secret values, signatures, raw bodies, Authorization headers, Billing writes, Apps Script calls, IAM changes, Cloud Run config changes, or Revolut webhook URL changes were observed.

## Revolut Sandbox Webhook Switch Proof

Completed on 2026-05-18:

1. Read-only `GET /webhooks` against the Revolut sandbox Merchant API found exactly one webhook:
   - webhook ID: `e6f32548-ffef-4f77-92fa-a0d2ae0b7dea`;
   - old URL: `https://webhook.site/84da51c0-7f70-4475-830a-11a8d002a81f`;
   - events: `ORDER_FAILED`, `ORDER_PAYMENT_FAILED`, `ORDER_COMPLETED`, `ORDER_PAYMENT_DECLINED`, `ORDER_CANCELLED`, `ORDER_AUTHORISED`.
2. The same webhook ID was patched to `https://roq-rcs-revolut-webhook-872475523113.europe-west2.run.app`, preserving all six events exactly.
3. Post-update `GET /webhooks` confirmed exactly one webhook, same ID, new URL, same events.
4. No signing secret, Merchant API secret, raw webhook body, signature, or Authorization header was printed.
5. No webhook was created or deleted, no signing secret was rotated, and no live/production or Business API setting was touched.
6. A fresh sandbox checkout order was created and paid:
   - order ID: `6a0ae033-fef3-a25e-b781-b0c4011e158f`;
   - reference: `ROQ-RCS-CLOUDRUN-WEBHOOK-PROOF-20260518094729`;
   - amount: `12000` / `GBP`.
7. Revolut delivered two real webhook POSTs to Cloud Run with user agent `Revolut-Octopus 1.0`:
   - `ORDER_AUTHORISED` at `2026-05-18T09:50:55.652206Z`;
   - `ORDER_COMPLETED` at `2026-05-18T09:50:56.153Z`.
8. Both events returned `HTTP 202`, had `signatureMatched: true`, `timestampAccepted: true`, and `billingUpdateApplied: false`.
9. Firestore collection `revolut_webhook_events` contains exactly two documents for the proof order, one per actual webhook event:
   - `93c88a300d0b59b81be64e3fd2381331f2b0ffe4caa5d693a9a5186c23563a5d` for `ORDER_AUTHORISED`;
   - `f1fed301783d9799dff2122af8ff4e89e30c42fa9d3b8290bc876cb3da2abb85` for `ORDER_COMPLETED`.
10. The `ORDER_COMPLETED` webhook enriched successfully:
    - `enrichmentAttempted: true`;
    - `enrichmentOk: true`;
    - `enrichmentClassification: payment_order`;
    - `enrichmentLedgerLookupOrderId: 6a0ae033-fef3-a25e-b781-b0c4011e158f`;
    - `enrichedOrderType: payment`;
    - `enrichedOrderState: completed`.
11. No Billing update or Apps Script write occurred.

## Deployed Mode

The deployed sandbox service must stay record-only:

- verify Revolut signatures and timestamps;
- write dedupe/event records to Firestore;
- enrich fresh non-duplicate `ORDER_COMPLETED` events through the sandbox Merchant API;
- log redacted record-mode fields only;
- do not call Apps Script;
- do not update Billing;
- do not enable the public payment gate;
- do not change the Revolut webhook URL again unless a future slice explicitly approves a webhook reconfiguration.

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
- console tries to change the Revolut webhook URL during a Cloud Run redeploy/configuration task;
- Cloud Run deploy/redeploy summary differs from this runbook.
- deploy source root is shown as `rcs-registration/cloud-run/revolut-webhook` instead of `rcs-registration`.
- the deploy upload omits `tools/revolut-webhook-handler.mjs`, `tools/revolut-webhook-map.mjs`, or `tools/revolut-webhook-verify.mjs`.

## Proof After Deployment Or Webhook Changes

Endpoint proof and real Revolut sandbox delivery proof have passed. Keep these proof criteria for future redeploys or webhook changes:

1. Confirm a `GET` or non-POST request returns `405 method_not_allowed`.
2. Confirm a POST without raw body/signature cannot be accepted.
3. Send one captured sandbox webhook body/signature/timestamp within tolerance, or use a fresh Revolut sandbox event.
4. Confirm the HTTP response is small and public-safe.
5. Confirm one Firestore document appears in `revolut_webhook_events`.
6. Confirm a duplicate delivery does not trigger a second enrichment call or duplicate write.
7. If the Revolut sandbox webhook URL is changed again, confirm the webhook ID/events are preserved, then run a fresh real sandbox order proof.
