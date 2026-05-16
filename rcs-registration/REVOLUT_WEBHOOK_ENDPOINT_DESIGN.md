# Revolut Webhook Endpoint Design

Status: design plus local source skeleton. No endpoint has been deployed, no webhook URL has been changed in Revolut, and no live Billing write is enabled from webhooks.

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
- `cloud-run/revolut-webhook/index.mjs`
  - first Cloud Run / Functions Framework source skeleton.
  - requires `POST`, `req.rawBody`, and `REVOLUT_WEBHOOK_SIGNING_SECRET`.
  - returns only the public handler body.
  - logs redacted record-mode fields only.
- `cloud-run/revolut-webhook/dedupe.mjs`
  - builds payload-stable receipt keys and Firestore document IDs.
  - stores application context in `logicalDedupeKey`, not in the document ID.
  - includes an in-memory test store and a Firestore adapter source.
  - the source skeleton can log dedupe create/duplicate decisions, but it is not deployed or connected to a live Firestore database yet.

## Dedupe Store

Use Firestore Native mode as the first dedupe store.

Collection: `revolut_webhook_events`.

Document ID:

```text
sha256(receiptKey)
```

Where `receiptKey` must be payload-stable across first receipt, enrichment, and Revolut retries:

```text
revolut:{event}:{orderId}
```

Do not include `applicationId`, resolved context, classification, or enrichment-derived values in the Firestore document ID. A retry of the same webhook will resend the original payload, so the document ID must be derivable from fields present before enrichment.

Store the richer logical/audit key separately as a field:

```text
logicalDedupeKey = revolut:{event}:{orderId}:{applicationId-or-unresolved}
```

Record fields:

- `receiptKey`
- `dedupeKey`
- `logicalDedupeKey`
- `event`
- `orderId`
- `applicationId`
- `classification`
- `receivedAt`
- `requestTimestamp`
- `signatureMatched`
- `timestampAccepted`
- `state`: one of `received`, `processing`, `enrichment_required`, `mapped`, `applied`, `failed`
- `billingUpdateApplied`: boolean
- `billingStatus`
- `paymentStatus`
- `refundStatus`
- `revolutOrderType`
- `relatedOrderId`
- `leaseExpiresAt`
- `errorCode`
- `errorMessage`: sanitised/truncated; do not store raw payload fragments

Atomic behavior:

1. Start a Firestore transaction.
2. Compute `receiptKey = revolut:{event}:{orderId}` from the verified payload.
3. Check `sha256(receiptKey)`.
4. If it does not exist, create it as `received` with a short lease.
5. If it exists in `applied`, `mapped`, or `enrichment_required`, return duplicate/no-op for record-only mode.
6. If it exists in `processing` and the lease has not expired, return duplicate/in-flight.
7. If it exists in `processing` or `received` and the lease has expired, reacquire the lease and continue.
8. If it exists in `failed`, retry only when the failure is marked retryable; otherwise keep failed and return no-op.
9. Never perform the same Billing write twice. When automatic apply is later enabled, transition to `applied` only after the Apps Script operator API call succeeds.

`duplicate` is a response outcome, not a stored state.

Do not use the Google Sheet as the dedupe source of truth. Sheets are still useful for operator-visible Billing/Payment-order state, but dedupe needs an atomic store.

## Enrichment Rules

The webhook body alone is not enough for all cases.

Observed refund webhook:

```json
{"event":"ORDER_COMPLETED","order_id":"6a0872b4-89b8-a82d-884b-703f6470c124"}
```

That event did not include `merchant_order_ext_ref`, refund-specific fields, or the refund payment ID.

Rules:

1. Always enrich `ORDER_COMPLETED` before any live Billing update until refund-vs-payment distinguishability is independently proven.
2. If the enriched order type is `REFUND`, route through refund lifecycle logic, not the registration-fee-paid path.
3. If the event is missing `merchant_order_ext_ref`, retrieve/enrich the order and resolve application context through the RightOnQ Payment orders ledger or original/related order.
4. For refund-order webhooks, use the enriched refund order's original/related order ID, then call `lookupPaymentOrder(originalOrderId)` to resolve the RightOnQ application ID. Calling `lookupPaymentOrder(refundOrderId)` is expected to return not found because the Payment orders ledger stores original checkout/payment orders.
5. Verify signature/timestamp once at initial receipt. Do not call the full handler again after a slow enrichment step; use `mapWebhookPayload` with the already verified raw payload and enriched order.

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

1. Add a small Cloud Run function source folder. Done locally in `cloud-run/revolut-webhook`; not deployed.
2. Import `handleRevolutWebhook`. Done.
3. Pass `req.rawBody`, `req.headers`, and signing secret from Secret Manager. Source skeleton reads `REVOLUT_WEBHOOK_SIGNING_SECRET`; deployment must wire it from Secret Manager.
4. Return only `result.body` to Revolut. Done in source skeleton.
5. Log/store only redacted `result.internal`. Source skeleton logs redacted record-mode fields only.
6. Add Firestore dedupe in record-only mode. Source primitives and adapter exist; deployment wiring to the real Google project/database is still to do.
7. Add order enrichment using the Revolut Merchant API secret from Secret Manager.
8. Use `lookupPaymentOrder` on the original/related order ID from refund-order enrichment to resolve application context when refund events arrive without `merchant_order_ext_ref`.
9. Keep Billing updates disabled until the record-only path has been proven with sandbox webhooks.

## Open Questions

- Exact Google project/account boundary for the Cloud Run service: likely `rightonq-gog`, but confirm before any deployment.
- Whether to use Cloud Run functions source deployment or a small Cloud Run service container.
- Whether Firestore is already enabled in the project; if not, enablement is a separate explicit console step.
- Whether Revolut retry behavior expects a `2xx` for enrichment-required events. Current design returns `202` to avoid retries while recording the need for internal enrichment.
- How long to retain dedupe/event records.
- Failed/declined sandbox paths are now captured: retryable `ORDER_PAYMENT_DECLINED` and terminal `ORDER_PAYMENT_FAILED`.
