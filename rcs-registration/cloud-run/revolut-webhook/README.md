# RightOnQ RCS Revolut Webhook

Status: source skeleton only. This has not been deployed and no Revolut webhook URL has been changed.

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
npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test
npm --prefix rcs-registration/cloud-run/revolut-webhook run dedupe-self-test
npm --prefix rcs-registration/cloud-run/revolut-webhook run enrichment-self-test
```

Expected result: `ok: true`.

Deployment is intentionally out of scope for this slice. The source now expects the deployed runtime to use Firestore for dedupe, but no Firestore database has been enabled, no Secret Manager bindings have been configured, and no Cloud Run service/function has been deployed.

The enrichment helper defaults to the Revolut sandbox Merchant API base URL for local proof work. Any future production deployment must explicitly configure the live Revolut Merchant API base URL and use separate live Secret Manager secrets.

The next slice should be Google Cloud boundary verification: confirm the project, region, Firestore Native state, Secret Manager names, and IAM/service account plan before any console or `gcloud` action.
