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
- includes a Firestore dedupe-store adapter source, but the local self-test uses an in-memory store;
- performs no Revolut enrichment call, no Apps Script call, and no Billing update.

Local fake-data self-test:

```bash
npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test
```

Expected result: `ok: true`.

Deployment is intentionally out of scope for this slice. Before deployment, add record-only Firestore dedupe and Secret Manager wiring according to `../../REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md`.

The next slice should wire `FirestoreDedupeStore.fromDefault()` into the deployed handler after the Google project, Firestore database, and Secret Manager boundary are explicitly confirmed.
