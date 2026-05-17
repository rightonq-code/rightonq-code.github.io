# RightOnQ RCS Revolut Webhook

Status: source skeleton plus deployment-prep runbook. This has not been deployed and no Revolut webhook URL has been changed.

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

Deployment is intentionally out of scope for this source folder until Adam explicitly approves it. The Google Cloud boundary now exists: Firestore Native `(default)` is in `europe-west2`, the Cloud Run Admin API is enabled, the original regional sandbox Secret Manager secrets exist, Cloud Run-compatible `-global` sandbox copies exist, and the runtime service account has secret-level access to both global copies. No Cloud Run service/function has been deployed, no deployed revision has written to Firestore, and no Revolut webhook URL has been changed.

Deployment prep is tracked in `DEPLOYMENT_PREP.md`. The runtime service account now has the required Cloud Run global sandbox secret access and project-level `roles/datastore.user` / Cloud Datastore User for Firestore dedupe writes. Do not grant broad Owner/Editor roles and do not create service account keys.

Important packaging note: deploy from source root `rcs-registration`, not from `rcs-registration/cloud-run/revolut-webhook` alone. The endpoint imports shared webhook verification/mapping modules from `rcs-registration/tools`, and the root `rcs-registration/package.json` points Functions Framework at `cloud-run/revolut-webhook/index.mjs`.

The root `.gcloudignore` intentionally allowlists only the runtime package, `cloud-run/revolut-webhook/**`, and the three shared `tools/revolut-webhook-*.mjs` modules needed by the endpoint.

The enrichment helper defaults to the Revolut sandbox Merchant API base URL for local proof work. Any future production deployment must explicitly configure the live Revolut Merchant API base URL and use separate live Secret Manager secrets.

The next live-console slice should be a separate explicit approval before any Cloud Run deployment. The deploy itself must still remain record-only and must not change the Revolut webhook URL until the deployed endpoint is proven.
