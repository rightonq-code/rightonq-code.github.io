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
- Cloud Run locations: https://cloud.google.com/run/docs/locations
- Secret Manager locations: https://cloud.google.com/secret-manager/docs/locations
- Cloud Firestore locations: https://firebase.google.com/docs/firestore/locations
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
  - in source-only record mode, enriches fresh non-duplicate `ORDER_COMPLETED` events when a Merchant API secret and fetch implementation are configured.
- `cloud-run/revolut-webhook/dedupe.mjs`
  - builds payload-stable receipt keys and Firestore document IDs.
  - stores application context in `logicalDedupeKey`, not in the document ID.
  - includes an in-memory test store and a Firestore adapter source.
  - the source skeleton can log dedupe create/duplicate decisions, but it is not deployed and has not written to the live Firestore database yet.
- `cloud-run/revolut-webhook/enrich.mjs`
  - source-only Revolut order enrichment helper.
  - retrieves `/orders/{order_id}` through an injected fetch function.
  - summarises order/payment fields without returning tokens, full payment-method IDs, raw bodies, or secrets.
  - classifies payment vs refund orders and returns the order ID that should be used for the Payment orders ledger lookup.
  - local self-test uses fake orders and fake fetch only; no Revolut call is made.

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
- `state`: one of `received`, `processing`, `enrichment_required`, `mapped`, `ignored`, `applied`, `failed`
- `billingUpdateApplied`: boolean
- `billingStatus`
- `paymentStatus`
- `refundStatus`
- `provisionalBillingStatus`
- `provisionalPaymentStatus`
- `provisionalRefundStatus`
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
5. If it exists in `applied`, `mapped`, `ignored`, or `enrichment_required`, return duplicate/no-op for record-only mode. `enrichment_required` is terminal only for the current record-only endpoint; the later automatic apply flow must introduce a separate progress state before any Billing side effect.
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

Observed sandbox refund order retrieval:

```json
{
  "id": "6a0872b4-89b8-a82d-884b-703f6470c124",
  "type": "refund",
  "state": "completed",
  "amount": 12000,
  "currency": "GBP",
  "relatedOrderId": "6a0866ef-9b11-a041-bfa2-e973e15e564d"
}
```

The actual sandbox proof confirms the refund order type is lowercase `refund` and the original checkout order is exposed as `relatedOrderId` in the local proof-tool summary. The enrichment helper accepts both raw Revolut snake_case (`related_order_id`) and summary camelCase (`relatedOrderId`) forms.

Rules:

1. Always enrich `ORDER_COMPLETED` before any live Billing update until refund-vs-payment distinguishability is independently proven.
2. If the enriched order type is `refund` (case-insensitive), route through refund lifecycle logic, not the registration-fee-paid path.
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

## Google Cloud Boundary

Status: planning decision only. Do not create, enable, deploy, or edit Google Cloud resources until this boundary is confirmed in the Google Cloud console and explicitly approved.

Traffic expectation:

- RightOnQ registration-fee volume is low compared with an online shop.
- Optimise for correctness, auditability, duplicate safety, and low operational maintenance rather than high throughput.
- Managed services are preferred over custom servers.

Recommended boundary:

- Google account / organisation: `rightonq.co.uk` / RightOnQ-controlled Google account.
- Google Cloud project: `RightOnQ-GOG` / `rightonq-gog` / project number `872475523113`.
- Organisation/folder: `rightonq.co.uk`, directly under the Workspace organisation; no folder shown in the read-only console check.
- Boundary status: confirmed reachable from the correct `adam@rightonq.co.uk` Workspace account on 2026-05-16. An earlier wrong-account browser check is superseded.
- Do not use `Personal-GOG` / `personal-gog-490412` for this webhook unless Adam explicitly reverses this later. It appears personal/dev-adjacent, not the intended Revolut/payment infrastructure boundary.
- Runtime: Cloud Run functions / Functions Framework Node.js source deployment for `roq-rcs-revolut-webhook`.
- Proposed region: `europe-west2` / London. Official docs list `europe-west2` for Cloud Run, Secret Manager, and Cloud Firestore, making it the natural UK-first choice for a UK-based RightOnQ workflow. Confirm availability in the console before any action.
- Dedupe/event store: Firestore Native mode, collection `revolut_webhook_events`.
- Billing state: linked on 2026-05-16 to billing account `My Billing Account` / `01D966-E98801-B3C276` under `rightonq.co.uk`. Adam reported on 2026-05-17 that the Google Cloud account was activated to full billing while retaining the trial credit/time window. Activation is complete; spend still needs to stay behind the budget and explicit approval controls below.
- Budget state: `RightOnQ-GOG safety budget` created on 2026-05-17 under billing account `My Billing Account` / `01D966-E98801-B3C276`, scoped to project `RightOnQ-GOG` / `rightonq-gog`, all services, monthly specified amount `GBP 10.00`, actual-spend alerts at 50%, 90%, and 100%, with default email alerts to billing admins/users. This is an alert guardrail only; Google Cloud budgets do not cap or stop resource/API consumption.
- Firestore state: created on 2026-05-17 in project `RightOnQ-GOG` / `rightonq-gog`. Database ID `(default)`, Standard edition, Firestore in Native mode, regional location `europe-west2` / London, restrictive security rules denying all reads/writes by default. The console did not show an explicit API-enable interstitial; Cloud Firestore API is now active for the project. No application code has written to this database yet.
- Cloud Run state: available as a product page, but no services exist and the Cloud Run Services page warned that clicking "Create service" will enable the Cloud Run Admin API. Enabling/deploying Cloud Run is a separate explicit action.
- Secret Manager state: Secret Manager API (`secretmanager.googleapis.com`) enabled on 2026-05-17 in project `RightOnQ-GOG` / `rightonq-gog`. Two regional sandbox secrets now exist in `europe-west2` / London. `roq-rcs-revolut-webhook-signing-secret-sandbox` has version 2 Enabled and version 1 Destroyed; consumers should use version `latest`. `roq-rcs-revolut-merchant-api-secret-sandbox` has version 1 Enabled. Both current `latest` values were verified through Secret Manager on 2026-05-17: the webhook signing secret matched a known Revolut HMAC fixture, and the Merchant API secret retrieved known sandbox order `6a08b551-d18e-a506-9cfa-6a27983dd1de` with HTTP 200. The sandbox Merchant API key had briefly been entered into the wrong secret before that wrong version was destroyed; rotation was recommended as hygiene, but Adam explicitly chose not to rotate the sandbox key on 2026-05-17. This sandbox exception must not be carried into live/production secret handling.
- Service account state: dedicated webhook service account created on 2026-05-17: `roq-rcs-revolut-webhook@rightonq-gog.iam.gserviceaccount.com`. Display name / ID `roq-rcs-revolut-webhook`; description `Runs the RightOnQ RCS Revolut webhook record-only Cloud Run endpoint`; unique ID `105980809530711130186`; status Enabled. It has no project roles and no keys. The pre-existing `gog-keep-access@rightonq-gog.iam.gserviceaccount.com` account is for gog CLI / Google Keep domain-wide delegation and must not be reused for this webhook.
- Secret store: Secret Manager.
- Initial endpoint mode: record-only. It may verify, dedupe, log, and later enrich; it must not update Apps Script Billing automatically.

Runtime service account:

```text
roq-rcs-revolut-webhook@rightonq-gog.iam.gserviceaccount.com
```

Minimum intended permissions, subject to console/IAM verification:

- read the Revolut webhook signing secret;
- later read the Revolut Merchant API secret for enrichment;
- read/write Firestore documents in the dedupe/event collection;
- write Cloud Logging entries.

Sandbox Secret Manager secrets:

```text
roq-rcs-revolut-webhook-signing-secret-sandbox
roq-rcs-revolut-merchant-api-secret-sandbox
```

Later production names should be separate, not reused:

```text
roq-rcs-revolut-webhook-signing-secret-live
roq-rcs-revolut-merchant-api-secret-live
```

Pre-deployment checklist:

1. Keep the `RightOnQ-GOG safety budget` in place as an alert-only guardrail; do not treat it as a spending cap.
2. Confirm billing/permissions are suitable for Cloud Run, Secret Manager, Firestore, and Cloud Logging.
3. Confirm `europe-west2` / London as the target region for Cloud Run, Secret Manager, and logging.
4. Confirm minimum IAM roles for the existing runtime service account.
5. Grant only the runtime service account least-privilege access to the regional sandbox secrets.
6. Confirm the endpoint will start in record-only mode.
7. Confirm Revolut sandbox webhook URL change will be a separate explicit action after deployment proof.

Forbidden until explicitly approved:

- enabling Cloud Run Admin API;
- creating service account keys or IAM grants;
- deploying Cloud Run;
- changing the Revolut webhook URL;
- enabling automatic Apps Script Billing updates;
- enabling strict public payment gating based on webhook state.

## First Implementation Plan

1. Add a small Cloud Run function source folder. Done locally in `cloud-run/revolut-webhook`; not deployed.
2. Import `handleRevolutWebhook`. Done.
3. Pass `req.rawBody`, `req.headers`, and signing secret from Secret Manager. Source skeleton reads `REVOLUT_WEBHOOK_SIGNING_SECRET`; deployment must wire it from Secret Manager.
4. Return only `result.body` to Revolut. Done in source skeleton.
5. Log/store only redacted `result.internal`. Source skeleton logs redacted record-mode fields only.
6. Add Firestore dedupe in record-only mode. Source primitives, adapter, and exported runtime-handler wiring exist; deployment to a real Google project/database is still to do.
7. Add order enrichment using the Revolut Merchant API secret from Secret Manager. Source helper exists in `cloud-run/revolut-webhook/enrich.mjs` and is wired into the source-only record-mode handler for fresh non-duplicate `ORDER_COMPLETED` events.
8. Use `lookupPaymentOrder` on the original/related order ID from refund-order enrichment to resolve application context when refund events arrive without `merchant_order_ext_ref`. Source helper now returns `ledgerLookupOrderId` for this purpose.
9. Keep Billing updates disabled until the record-only path has been proven with sandbox webhooks.

## Remaining Confirmations

- Confirm `europe-west2` / London in-console as the target region without starting a create/deploy flow where possible.
- Enable Cloud Run Admin API / Cloud Run functions only as a separate explicit console step.
- Confirm minimum IAM roles for the existing runtime service account.
- Do not carry the sandbox "no rotation" exception into production/live secrets.
- Whether Revolut retry behavior expects a `2xx` for enrichment-required events. Current design returns `202` to avoid retries while recording the need for internal enrichment.
- How long to retain dedupe/event records.
- Failed/declined sandbox paths are now captured: retryable `ORDER_PAYMENT_DECLINED` and terminal `ORDER_PAYMENT_FAILED`.
