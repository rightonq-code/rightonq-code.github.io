# RightOnQ RCS Revolut Webhook

Status: source skeleton plus first sandbox record-only Cloud Run deployment, endpoint proof passed, and Revolut sandbox Merchant webhook now pointed at Cloud Run with real sandbox delivery proof passed.

This folder is the first Cloud Run / Cloud Functions source shape for the future Revolut Merchant webhook endpoint.

Current behaviour:

- requires `POST`;
- requires `req.rawBody`;
- reads `Revolut-Request-Timestamp` and `Revolut-Signature` through the shared handler;
- reads `REVOLUT_WEBHOOK_SIGNING_SECRET` from the runtime environment, which should be Secret Manager-backed when deployed;
- verifies before mapping;
- returns only the small public response body;
- logs only redacted record-mode fields, including rejected-method and missing-raw-body cases;
- wires `FirestoreDedupeStore.fromDefault()` into the exported runtime handler, while local self-tests still use an injected in-memory store;
- enriches fresh, non-duplicate `ORDER_COMPLETED` events in record-only mode when a Merchant API secret and fetch implementation are configured;
- skips enrichment for duplicate `ORDER_COMPLETED` events and all non-completed events;
- performs no live Revolut call in local self-tests, no Apps Script call, and no Billing update.

Local fake-data self-test:

```bash
npm --prefix rcs-registration run self-test
npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test
npm --prefix rcs-registration/cloud-run/revolut-webhook run dedupe-self-test
npm --prefix rcs-registration/cloud-run/revolut-webhook run enrichment-self-test
```

Expected result: `ok: true`.

The first sandbox Cloud Run service now exists at `https://roq-rcs-revolut-webhook-872475523113.europe-west2.run.app`. It was deployed from the `rcs-registration-part-a-b-20260507` branch through Cloud Build, with latest revision `roq-rcs-revolut-webhook-00003-ss7` receiving 100% traffic. Live endpoint proof passed on 2026-05-17: unsigned traffic failed closed, a signed proof event returned `HTTP 202`, Firestore wrote exactly one dedupe document, and a duplicate signed delivery was logged as `duplicate_terminal` without a second write. The Google Cloud boundary now exists: Firestore Native `(default)` is in `europe-west2`, the original regional sandbox Secret Manager secrets exist, Cloud Run-compatible `-global` sandbox copies exist, and the runtime service account has secret-level access to both global copies.

On 2026-05-18, the existing Revolut sandbox Merchant webhook `e6f32548-ffef-4f77-92fa-a0d2ae0b7dea` was updated from the temporary `webhook.site` URL to the Cloud Run URL above, preserving the original six events (`ORDER_FAILED`, `ORDER_PAYMENT_FAILED`, `ORDER_COMPLETED`, `ORDER_PAYMENT_DECLINED`, `ORDER_CANCELLED`, `ORDER_AUTHORISED`) and without rotating the signing secret. A real sandbox checkout order `6a0ae033-fef3-a25e-b781-b0c4011e158f` / `ROQ-RCS-CLOUDRUN-WEBHOOK-PROOF-20260518094729` then delivered `ORDER_AUTHORISED` and `ORDER_COMPLETED` webhooks from Revolut (`Revolut-Octopus 1.0`) to Cloud Run. Both returned `HTTP 202`, matched signatures, wrote one Firestore document per event, and kept `billingUpdateApplied: false`. The `ORDER_COMPLETED` event enriched successfully as `payment_order`.

Deployment prep is tracked in `DEPLOYMENT_PREP.md`. The runtime service account now has the required Cloud Run global sandbox secret access and project-level `roles/datastore.user` / Cloud Datastore User for Firestore dedupe writes. Do not grant broad Owner/Editor roles and do not create service account keys.

Important packaging note: deploy from source root `rcs-registration`, not from `rcs-registration/cloud-run/revolut-webhook` alone. The endpoint imports shared webhook verification/mapping modules from `rcs-registration/tools`, and the root `rcs-registration/package.json` points Functions Framework at `cloud-run/revolut-webhook/index.mjs`.

The root `.gcloudignore` intentionally allowlists only the runtime package, `cloud-run/revolut-webhook/**`, and the three shared `tools/revolut-webhook-*.mjs` modules needed by the endpoint.

The enrichment helper defaults to the Revolut sandbox Merchant API base URL for local proof work. Any future production deployment must explicitly configure the live Revolut Merchant API base URL and use separate live Secret Manager secrets.

The next slice should use the real-delivery proof as the baseline and keep the service record-only until automatic Billing writes are separately designed, reviewed, and explicitly approved.
