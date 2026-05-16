# Revolut Webhook Endpoint Design

Status: design slice only. No endpoint has been deployed, no webhook URL has been changed in Revolut, and no live Billing write is enabled from webhooks.

Last updated: 2026-05-16.

## Decision

Use a small Google Cloud Run function/service as the real Revolut webhook entrypoint, not GitHub Pages and not the existing Apps Script public web app.

Rationale:

- GitHub Pages is static and cannot receive webhook `POST` requests.
- The webhook must verify the exact raw request body plus the `Revolut-Request-Timestamp` and `Revolut-Signature` headers before trusting the event.
- Google Cloud Run functions for Node.js expose HTTP request/response objects and, per Google docs, provide access to parsed `req.body` and `req.rawBody`.
- Cloud Run can use Secret Manager for the Revolut webhook signing secret and Merchant API secret. Google docs recommend Secret Manager rather than environment variables for secrets.
- Cloud Run has normal request/container logging through Cloud Logging, which is useful for webhook audit and debugging.
- Apps Script remains the Sheets/operator API layer. Do not use the Apps Script public web app as the direct Revolut webhook entrypoint unless it separately proves exact raw body and custom-header access.

Official docs checked:

- Cloud Run Node.js / HTTP functions: https://docs.cloud.google.com/run/docs/write-http-functions
- Cloud Run Node.js runtime: https://docs.cloud.google.com/run/docs/runtimes/nodejs
- Cloud Run environment variables and Secret Manager recommendation: https://docs.cloud.google.com/run/docs/configuring/services/environment-variables
- Cloud Run logging: https://docs.cloud.google.com/run/docs/logging
- Firestore add/set document model: https://firebase.google.com/docs/firestore/manage-data/add-data

## Endpoint Boundary

Initial endpoint name: `roq-rcs-revolut-webhook`.

Initial route: `POST /revolut/webhook`.

The endpoint must:

1. Read the exact raw body as bytes/string.
2. Read `Revolut-Request-Timestamp` and `Revolut-Signature` headers case-insensitively.
3. Verify HMAC and timestamp before JSON parsing or mapping.
4. Return a small public response to Revolut.
5. Store internal diagnostics in logs/dedupe records, not in the public response.
6. Record/check dedupe before any Billing write.
7. Enrich `ORDER_COMPLETED` events before treating them as paid.
8. Call the Apps Script operator API only after the event is verified, deduped, mapped, and safe to apply.

The endpoint must not:

- print webhook signing secrets, Merchant API secrets, OAuth refresh tokens, PINs, raw card data, or full request bodies in logs;
- return internal diagnostics, dry-run commands, raw payload, HMACs, or secrets to Revolut;
- use the verifier CLI `--skip-timestamp-tolerance` behavior;
- directly trust `ORDER_COMPLETED` as registration-fee-paid without order-type proof;
- call public Apps Script `doPost` for operator updates.

## Existing Local Primitives

These files are the source of truth for the first endpoint implementation:

- `tools/revolut-webhook-verify.mjs`
  - exports `verifyWebhook`, `computeSignature`, and timestamp/signature helpers.
  - verifies `v1.{timestamp}.{rawBody}` HMAC.
  - enforces timestamp tolerance unless the CLI-only archived-sample flag is used.
- `tools/revolut-webhook-map.mjs`
  - exports `mapWebhookPayload`, `buildOperatorBillingArgs`, and `EVENT_MAP`.
  - maps verified events into proposed Billing arguments.
  - returns `enrichmentRequired` when application context is missing.
- `tools/revolut-webhook-handler.mjs`
  - offline endpoint-core proof.
  - verifies first, maps second.
  - returns `body` for the public HTTP response and `internal` for diagnostics.
  - performs no network calls and no writes.

## Dedupe Store

Use Firestore Native mode as the first dedupe store.

Collection: `revolut_webhook_events`.

Document ID:

```text
sha256(dedupeKey)
```

Where `dedupeKey` should be:

```text
revolut:{event}:{orderId}:{applicationId-or-resolved-context}
```

For events that cannot be mapped yet, use:

```text
revolut:{event}:{orderId}:unresolved
```

Record fields:

- `dedupeKey`
- `event`
- `orderId`
- `applicationId`
- `classification`
- `receivedAt`
- `requestTimestamp`
- `signatureMatched`
- `timestampAccepted`
- `state`: one of `received`, `enrichment_required`, `mapped`, `applied`, `duplicate`, `failed`
- `billingUpdateApplied`: boolean
- `billingStatus`
- `paymentStatus`
- `refundStatus`
- `revolutOrderType`
- `relatedOrderId`
- `errorCode`
- `errorMessage`

Atomic behavior:

1. Start a Firestore transaction.
2. Check the document ID for the dedupe key.
3. If it exists in `applied`, `mapped`, or `enrichment_required`, return duplicate/no-op.
4. If it does not exist, create it as `received`.
5. Continue processing outside or inside the transaction depending on the final implementation, but never perform the same Billing write twice.

Do not use the Google Sheet as the dedupe source of truth. Sheets are still useful for operator-visible Billing/Payment-order state, but dedupe needs an atomic store.

## Enrichment Rules

The webhook body alone is not enough for all cases.

Observed refund webhook:

```json
{"event":"ORDER_COMPLETED","order_id":"6a0872b4-89b8-a82d-884b-703f6470c124"}
```

That event did not include `merchant_order_ext_ref`, refund-specific fields, or the refund payment ID.

Rules:

1. `ORDER_COMPLETED` must be enriched before any live Billing update unless the endpoint has another reliable proof that the order is a payment order.
2. If the enriched order type is `REFUND`, route through refund lifecycle logic, not the registration-fee-paid path.
3. If the event is missing `merchant_order_ext_ref`, retrieve/enrich the order and resolve application context through the RightOnQ Payment orders ledger or original/related order.
4. Verify signature/timestamp once at initial receipt. Do not call the full handler again after a slow enrichment step; use `mapWebhookPayload` with the already verified raw payload and enriched order.

## Apply Rules

First live implementation should run in dry-run/record-only mode.

Allowed in dry-run/record-only mode:

- verify webhook;
- create/check dedupe record;
- map event;
- enrich order;
- log internal diagnostics without secrets;
- optionally write a non-authoritative event record.

Not allowed until a later explicit slice:

- update Apps Script Billing row automatically;
- mark `registration_fee_paid` automatically;
- mark refund status automatically;
- enable strict public payment gate from webhook state alone.

When automatic apply is finally enabled:

1. Only apply if verification passed.
2. Only apply if dedupe says this event has not already been applied.
3. Only apply if mapping is recognised.
4. Only apply if `ORDER_COMPLETED` has been enriched/typed.
5. Only call `rcsOperatorAction` through the clean operator API, never public `doPost`.
6. Store the final apply result back to the dedupe/event record.

## First Implementation Plan

1. Add a small Cloud Run function source folder in a future slice.
2. Import `handleRevolutWebhook`.
3. Pass `req.rawBody`, `req.headers`, and signing secret from Secret Manager.
4. Return only `result.body` to Revolut.
5. Log/store only redacted `result.internal`.
6. Add Firestore dedupe in record-only mode.
7. Add order enrichment using the Revolut Merchant API secret from Secret Manager.
8. Use `lookupPaymentOrder` to resolve application context when refund events arrive without `merchant_order_ext_ref`.
9. Keep Billing updates disabled until the record-only path has been proven with sandbox webhooks.

## Open Questions

- Exact Google project/account boundary for the Cloud Run service: likely `rightonq-gog`, but confirm before any deployment.
- Whether to use Cloud Run functions source deployment or a small Cloud Run service container.
- Whether Firestore is already enabled in the project; if not, enablement is a separate explicit console step.
- Whether Revolut retry behavior expects a `2xx` for enrichment-required events. Current design returns `202` to avoid retries while recording the need for internal enrichment.
- How long to retain dedupe/event records.
- Whether a failed/declined sandbox card path is available and should be captured before first record-only endpoint registration.
