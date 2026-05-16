# Revolut Sandbox Proof Plan

Created: 2026-05-15
Owner: RCS-Twilio-4
Status: first live sandbox registration-handling-fee payment proof passed; not production implementation

## Purpose

Prove the Revolut-first billing assumptions before wiring live customer payment flow into the RCS onboarding application.

The proof should answer whether RightOnQ can safely use Revolut for:

- the one-off `£100 + VAT` RCS registration handling fee;
- a saved customer/payment method;
- the post-approval monthly platform fee for `RightOnQ UK` or `RightOnQ Global`;
- later PAYG/top-up payments;
- webhook-based status reconciliation.

## Current Design Assumption

Customer flow should become:

1. customer chooses `RightOnQ UK` or `RightOnQ Global`;
2. customer pays the `£100 + VAT` registration handling fee through Revolut;
3. Revolut returns/updates order and payment status;
4. RightOnQ records `registration_fee_paid`;
5. RightOnQ creates/reveals the private Part A link;
6. monthly platform billing starts only after RCS approval and ready-to-use setup.

Important billing posture:

- RightOnQ owns the billing brain unless sandbox proof shows Revolut subscriptions can safely own the exact required behaviour.
- Do not assume Stripe-style subscriptions.
- Prove both paths:
  - Revolut Subscriptions API for the monthly plan, if it supports the delayed/approval-gated start we need;
  - RightOnQ-owned monthly scheduler using merchant-initiated transactions against a saved payment method.
- If both are technically possible, prefer the simpler operational route that keeps customer experience clear and credit risk controlled.

## Revolut Docs Checked

Official Revolut Merchant docs reviewed on 2026-05-15:

- Sandbox: use the sandbox Merchant account, sandbox API keys, and `https://sandbox-merchant.revolut.com/` instead of production endpoints.
- Hosted Checkout Page via API: backend creates an order and receives `id` plus `checkout_url`; customer completes payment on Revolut's hosted page; backend should use webhooks or polling to verify status.
- Customers/saved payment methods: payment methods are generated as part of payment, not directly created by RightOnQ.
- Merchant-initiated charges: to charge later, create an order for a customer with a saved payment method, then pay for that order using the saved payment method ID/type.
- Subscriptions: Revolut has a Subscriptions API with plans, variations, hosted onboarding/setup orders, saved payment method capture, lifecycle tracking, and billing-cycle history.
- Webhooks: Revolut supports order lifecycle events such as `ORDER_AUTHORISED` and `ORDER_COMPLETED`; delivery order is not guaranteed, so RightOnQ must treat webhook handling as idempotent.
- Current Hosted Checkout API guidance says order creation must be done server-side because the Merchant API secret must not be exposed to frontend code.
- `merchant_order_data.reference` is the internal reference field at order creation; webhook payloads expose this back as `merchant_order_ext_ref`, so RightOnQ should treat both names as the same business reference crossing different API surfaces.
- Refunds can be full or partial, but only for completed orders, and should use `Idempotency-Key` to avoid duplicate refund processing. Revolut's current refund request body uses `merchant_order_data.reference`; the refund response creates a new order with `type: refund` and `related_order_id` pointing back to the paid order.
- Merchant-initiated saved-method payments require a payment method saved for the merchant; customer-only saved methods are not enough for unattended monthly charges.
- Webhook callback headers include `Revolut-Request-Timestamp` and `Revolut-Signature`; the webhook creation response includes a `signing_secret`.
- Webhook signature verification uses:
  - payload to sign: `v1.{Revolut-Request-Timestamp}.{raw-payload}`;
  - HMAC SHA-256 with the webhook `signing_secret` as the key;
  - expected header format: `v1=<hex digest>`;
  - support for multiple comma-separated signatures during signing-secret rotation;
  - a recommended 5-minute timestamp tolerance to reduce replay risk.

Potential doc/API naming caution:

- Current Revolut order docs show `merchant_order_data.reference` as the internal order reference field.
- External feedback mentioned `merchant_order_ext_ref`; verify the exact field name in the selected API version during sandbox proof.
- For RightOnQ, the external reference should be the `applicationId` wherever Revolut supports it, so webhooks can route directly back to the application.

## Live Sandbox Proof Results - 2026-05-16

First happy-path registration-fee payment proof passed using the Revolut Merchant sandbox.

Inputs:

- RightOnQ application ID / Revolut reference: `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`
- Amount: `12000` minor units (`GBP 120.00`, representing `GBP 100 + VAT`)
- API base URL: `https://sandbox-merchant.revolut.com/api`
- API version: `2026-04-20`
- Secret handling: `REVOLUT_MERCHANT_API_SECRET` was pasted into the local terminal prompt only, then unset. It was not pasted into chat, docs, commits, or command history as a literal value.

Observed results:

- Create-order call succeeded.
- Revolut returned order ID `6a082426-a2c7-ae93-bcf2-5f3a5e75af5b`, token `66b0fb6a-e9ed-488b-88ba-987a95841108`, state `pending`, reference `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`, customer ID `ca1466ba-0058-4f41-a758-ae8fbcf38dc2`, and a hosted checkout URL.
- Repeating create-order with the same `Idempotency-Key` created a second order, ID `6a08245f-ad3a-a1b5-848c-d0395ea20303`, token `dd1e2496-ac67-454c-b70f-df58d0ce1cf9`, customer ID `f62fc775-9ae9-4dbf-a343-9e61d26e7443`.
- Revolut's current create-order docs do not document `Idempotency-Key` for order creation. Treat create-order as not idempotent in the RightOnQ design.
- Listing orders by `merchant_order_data_reference` returned both pending orders for the application ID. Therefore RightOnQ must enforce one active registration-fee order per application in its own Billing lane before creating another Revolut order.
- Direct order retrieval returns the checkout URL while the order is pending. List-order results did not include checkout URLs, so RightOnQ should store the returned checkout URL/token at create time.
- The newer order `6a08245f-ad3a-a1b5-848c-d0395ea20303` was paid through sandbox Hosted Checkout using Revolut sandbox test card data supplied by Revolut.
- The hosted checkout originally redirected to a RightOnQ URL that showed a 404 after payment. The API still confirmed successful payment, so this was a frontend redirect/return-page issue, not a payment proof failure. A static `payment-return.html` page has now been added for future checkout returns.
- After payment, order retrieval returned state `completed` with embedded payment ID `6a082633-a973-ac00-837c-e68c28186597`, payment state `captured`, payment type `card`, amount `12000`, currency `GBP`.
- The separate payment-list endpoint returned an array directly, not `{ payments: [...] }`; `revolut-sandbox-proof.mjs` now handles both response shapes.
- The corrected `--retrieve-payments` command returned one captured payment for order `6a08245f-ad3a-a1b5-848c-d0395ea20303`.

Build impact:

- Revolut Merchant Hosted Checkout is viable for the one-off `GBP 100 + VAT` registration-fee gate.
- RightOnQ must not rely on Revolut create-order idempotency. Store/check Billing state before creating a checkout order.
- Store at least: Revolut order ID, token or checkout URL while pending, customer ID, payment ID, order/payment state, amount/currency, and the application reference.
- The RightOnQ return URL now has a static `payment-return.html` page. It confirms browser return only; payment still needs to be verified through Revolut order/webhook state before Billing changes.
- Webhook capture/signature verification, full-refund proof, declined-attempt proof, and terminal failed-payment proof have passed. Saved-method/MIT proof and subscription proof remain outstanding.
- Declined-attempt proof has passed. A hosted-checkout order can emit `ORDER_PAYMENT_DECLINED` for one attempt and later emit `ORDER_AUTHORISED` / `ORDER_COMPLETED` for the same order after a successful retry.

## Full Refund Proof Results - 2026-05-16

Full refund proof passed against the fresh return-page sandbox order.

Original paid order:

- Application/reference: `ROQ-RCS-TEST-RETURN-PAGE-20260516-001`
- Order ID: `6a0866ef-9b11-a041-bfa2-e973e15e564d`
- Payment ID: `6a08673c-80db-a36d-97a3-ec673b09e3cd`
- Original order state before refund: `completed`
- Original payment state before refund: `captured`
- Amount/currency: `12000 GBP`

Refund command:

- Refund amount: `12000 GBP`
- Refund reference: `ROQ-RCS-TEST-RETURN-PAGE-20260516-001-REFUND-001`
- Idempotency key: `refund-ROQ-RCS-TEST-RETURN-PAGE-20260516-001`
- Secret handling: `REVOLUT_MERCHANT_API_SECRET` was pasted into the local terminal prompt only, then unset. It was not pasted into chat, docs, commits, or command history as a literal value.

Observed refund result:

- Refund request returned `ok: true`.
- Revolut returned refund order ID `6a0872b4-89b8-a82d-884b-703f6470c124`.
- Refund response summary exposed `type: "REFUND"` and `state: "PROCESSING"`.
- Embedded refund payment ID was `6a0872b4-395a-a536-8ca5-0ab9c27056af` with state `COMPLETED`.
- Immediate retrieval of the original order returned `refundedAmount: 12000`, while the original order remained `state: "completed"`.
- `retrieve-payments` for the original order continued to return the original captured card payment. Do not rely on the original payment-list response alone to infer refund state.

Build impact:

- Revolut sandbox can process a full refund for the registration handling fee.
- RightOnQ should store refund order ID, refund payment ID where present, refund amount/currency, refund status, refund reference, and original order ID.
- Billing/refund state should be derived from the original order's `refunded_amount`/refund order lifecycle and future refund webhooks, not from the original order payment-list alone.
- Refund lifecycle mapping now has a real event-name proof, but still needs enrichment-backed implementation before any automated Billing write.

## Refund Webhook Proof Results - 2026-05-16

Revolut emitted a refund-order webhook after the full refund proof.

Captured refund webhook:

- webhook.site request ID: `d6d383cf-8ea0-4ca1-ab9d-b4859ed7cd6b`
- Received: `2026-05-16 14:35:54 UTC`
- Body byte count: `77`
- `Revolut-Request-Timestamp`: `1778938554035`
- `Revolut-Signature`: `v1=a361810e16d0e225acb184404dd1fc301ce85c2a5538e730d23b9a9618de946a`

Raw payload:

```json
{"event":"ORDER_COMPLETED","order_id":"6a0872b4-89b8-a82d-884b-703f6470c124"}
```

Verification:

- Raw payload was saved to `/tmp/revolut-webhook-d6d38.json`.
- Signature verification with the local webhook signing secret returned `signatureMatched: true`.
- Archived-sample verification used `--skip-timestamp-tolerance` and returned `ok: true`.
- The future live webhook endpoint must not skip timestamp tolerance.

Mapping result:

- The webhook event name is still `ORDER_COMPLETED`.
- The `order_id` is the refund order ID, not the original paid order ID.
- No `merchant_order_ext_ref` was present.
- No refund payment ID or refund-specific field was present in the webhook body.
- `revolut-webhook-map.mjs` now returns `mapped: false` and `enrichmentRequired: true` for this shape instead of producing a Billing update.
- With an enriched refund order and the application ID supplied, `revolut-webhook-map.mjs` classifies the event as `refund_order` and produces a refund-status dry-run. It does not overwrite the original checkout/order ID.

Enriched refund mapping dry-run:

```json
{
  "mapped": true,
  "classification": "refund_order",
  "applicationId": "ROQ-RCS-TEST-RETURN-PAGE-20260516-001",
  "orderId": "6a0872b4-89b8-a82d-884b-703f6470c124",
  "operatorBillingArgs": {
    "paymentProvider": "revolut",
    "paymentStatus": "refunded",
    "refundStatus": "refunded",
    "refundProcessedAt": "2026-05-16T13:35:54.035Z"
  }
}
```

Build impact:

- A refund webhook cannot be routed directly to an application from the webhook body alone.
- The live webhook endpoint must retrieve/enrich the Revolut order by `order_id`.
- If the enriched order is `type = REFUND`, route through refund lifecycle logic using the original/related order, not the normal paid registration-fee path.
- Do not treat every `ORDER_COMPLETED` event as `registration_fee_paid`; it depends on the enriched order type.
- The application ID for refund events must come from RightOnQ's ledger/original-order lookup, or from an explicit operator-supplied value during local dry-runs.

## Proof Questions

### A. One-off registration handling fee

- Can a sandbox Merchant order be created for `12000` minor units (`£120.00`, representing `£100 + VAT`)?
- Does the API treat `12000` as `£120.00` in GBP minor units?
- Does the response include a stable order `id` and customer-facing `checkout_url`?
- Can RightOnQ set the `applicationId` as the Revolut external/reference field?
- Does the reference come back in order retrieval and webhook payloads?
- Does an `Idempotency-Key` header prevent duplicate order creation on retry?
- Can the order include customer email/name safely?
- What exact order states are returned before and after test payment?

### B. Hosted payment experience

- Does the hosted page look acceptable with Revolut branding/customisation?
- Can a customer complete payment with Revolut sandbox test cards?
- What happens on failure/decline test cards?
- What happens on 3DS challenge failure or abandoned checkout?
- Can a success redirect return to a RightOnQ URL with enough context to continue?

### C. Saved payment method / merchant-initiated billing

- Can the initial registration-fee payment save a payment method for merchant-initiated use?
- What exact parameter or hosted checkout/subscription setting records explicit consent to future merchant-initiated charges?
- How should that consent be worded/stored on the RightOnQ side?
- If not through Hosted Checkout alone, does Revolut require the widget/subscription setup flow instead?
- Can sandbox create a customer, attach a saved payment method, and reuse it across a fresh checkout/payment?
- Can RightOnQ retrieve saved methods filtered for merchant-initiated use?
- Can a follow-up order be charged without the customer present?
- Which IDs must be stored:
  - customer ID;
  - payment method ID;
  - payment method type;
  - subscription ID;
  - order ID;
  - payment ID?

### D. Subscriptions

- Can RightOnQ create subscription plans for:
  - `RightOnQ UK` at `£25 + VAT/month`;
  - `RightOnQ Global` at `£49 + VAT/month`?
- Can a subscription be created but delayed until approval/ready-to-use?
- Can renewal date be updated to start after the 4-6 week registration period?
- Can upgrades/downgrades happen at the end of a billing cycle without pro-rata credits?
- What webhook events are emitted for subscription creation, setup payment, renewal, failure, cancellation, and plan changes?
- If subscriptions do not match the operating model, can RightOnQ instead use saved-method MIT charges from its own monthly scheduler?

### E. PAYG / top-up control

- Is PAYG credit better as separate one-off orders rather than Revolut subscription usage?
- Can RightOnQ create top-up orders for fixed amounts, e.g. `£50 + VAT`, `£100 + VAT`?
- Can later top-ups use a saved merchant-initiated payment method?
- What is the cleanest way to pause sending if top-up fails?

### F. Refunds

- Can a full sandbox refund be created for the registration handling fee?
- Can a partial refund be created if needed?
- Which refund IDs/statuses are returned?
- What webhook events are emitted for refund created, refund completed, refund failed, or equivalent states?
- How should `Billing.Refund status`, `Refund reason`, `Refund amount GBP`, and `Refund processed at` be mapped?

### G. Webhooks and reconciliation

- Can webhook URLs be created in sandbox?
- Which event types are available for orders/subscriptions?
- Does Revolut sign webhook payloads and expose a signing secret?
- What are the exact signature/timestamp headers in sandbox?
- What HMAC/signature algorithm is used?
- Can RightOnQ verify signatures locally?
- What should RightOnQ return for verified events, duplicate events, and failed signature verification?
- Are retries delivered if the endpoint fails?
- Does webhook order differ from payment lifecycle order?

### H. Endpoint hardening before launch

- Do not link the public website to the gateway until public/operator endpoint hardening lands.
- Public submissions should be payment/token gated before external traffic is invited.
- Operator actions should move to a separate Google-authenticated deployment or equivalent private path.
- MailApp notifications to Adam need throttling or should move fully into the `Communications` queue before external traffic.
- `changedBy` is currently operator-supplied and therefore spoofable; per-operator attribution should be added when operator auth is hardened.

## Data Safety Boundary

RightOnQ should store:

- Revolut customer ID;
- order ID;
- checkout URL only while needed;
- payment ID;
- payment method ID/type;
- subscription ID;
- webhook event IDs;
- status values;
- timestamps;
- operator notes.

RightOnQ should not store:

- card number;
- CVV;
- raw card details;
- bank credentials;
- raw webhook secrets in repo;
- API keys in repo, chat, screenshots, or command history where avoidable.

## Local Proof Tool

Initial helper:

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs --dry-run
```

Dry run with an application reference and repeatable idempotency key:

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --dry-run \
  --application-id ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901 \
  --idempotency-key proof-ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901
```

Dry run the refund shape. The refund reference is sent as
`merchant_order_data.reference`; webhook payloads may expose the same business
reference as `merchant_order_ext_ref`.

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --dry-run \
  --refund-order \
  --order-id order_TEST \
  --refund-amount 12000 \
  --refund-reference ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901 \
  --idempotency-key refund-ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901
```

Dry run a later merchant-initiated saved-method payment shape:

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --dry-run \
  --pay-order \
  --order-id order_TEST \
  --payment-method-id pm_TEST \
  --payment-method-type card \
  --payment-initiator merchant \
  --idempotency-key mit-ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901
```

Webhook signature self-test, using fake data only:

```bash
node rcs-registration/tools/revolut-webhook-verify.mjs --self-test
node rcs-registration/tools/revolut-webhook-map.mjs --self-test
```

Verify a captured sandbox webhook sample locally:

```bash
export REVOLUT_WEBHOOK_SIGNING_SECRET="wsk_sandbox_..."
node rcs-registration/tools/revolut-webhook-verify.mjs \
  --payload-file /path/to/revolut-webhook-payload.json \
  --timestamp "1683650202360" \
  --signature "v1=..."
unset REVOLUT_WEBHOOK_SIGNING_SECRET
```

When using a real `wsk_...` value, prefer a local secret loader or a shell setup that avoids saving the secret in history. The command above is a shape example, not a request to paste secrets into chat or docs.

Important: use the raw webhook body exactly as Revolut delivered it. Do not pretty-print,
trim, reorder, or re-serialise the JSON before verification.
Use `--payload-file` for real captures; `--payload` is only for tiny debug examples
because shell quoting can alter the body and command history can retain it.
If verification fails with `signatureMatched: false`, first check for an added trailing
newline, formatter changes, or a payload copied after JSON re-serialisation.
The verifier's `--skip-timestamp-tolerance` flag is only for old archived samples. The
future live webhook endpoint must enforce the Revolut timestamp window.

After signature verification passes, map the webhook to a proposed Billing update:

```bash
node rcs-registration/tools/revolut-webhook-map.mjs \
  --payload-file /path/to/revolut-webhook-payload.json \
  --request-timestamp "1683650202360"
```

The mapper is deliberately dry-run only. It prints proposed `operatorBillingArgs`, a
`dedupeKey`, and an `operator-billing.mjs --dry-run` command. Review the output before
running any live operator billing update. It warns if `merchant_order_ext_ref` does not
look like a `ROQ-RCS-...` application ID.

For live sandbox use, set the secret in the terminal environment, not in the repo:

```bash
export REVOLUT_MERCHANT_API_SECRET="sk_sandbox_..."
node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --create-registration-order \
  --application-id ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901 \
  --idempotency-key proof-ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901
unset REVOLUT_MERCHANT_API_SECRET
```

To prove idempotency, run the same live sandbox command twice with the same
`--idempotency-key` and confirm Revolut does not create two separate customer
orders for the same application/payment attempt.

Optional environment:

```bash
export REVOLUT_MERCHANT_API_BASE_URL="https://sandbox-merchant.revolut.com/api"
export REVOLUT_API_VERSION="2026-04-20"
```

First live sandbox sequence, once Bugs has the sandbox Merchant API secret:

1. Create one registration-fee order with a fixed idempotency key. Done on 2026-05-16.
2. Run the exact same create command again with the same idempotency key and confirm behaviour. Done on 2026-05-16; Revolut created a second order, so RightOnQ must enforce duplicate protection internally.
3. Retrieve the order by ID. Done on 2026-05-16.
4. List orders by `merchant_order_data_reference` using the same application ID. Done on 2026-05-16.
5. Open the checkout URL in a browser and complete one sandbox card payment. Done on 2026-05-16.
6. Retrieve the order and payment list after payment. Done on 2026-05-16.
7. Capture one sandbox webhook payload plus headers and verify it with
   `revolut-webhook-verify.mjs`. Done on 2026-05-16.
8. Map the verified webhook with `revolut-webhook-map.mjs` and review the proposed Billing update. Done on 2026-05-16 as dry-run.
8a. Add a customer-facing payment return page so future hosted-checkout redirects do not land on a 404. Done on 2026-05-16 with `payment-return.html`.
8b. Run a fresh sandbox Hosted Checkout using the neutral payment-return URL. Done on 2026-05-16; Revolut returned to the payment-return page and API retrieval confirmed completed/captured state.
9. Update the existing Billing row with `operator-billing.mjs` using provider/order/payment IDs only.
10. Run one failed/declined sandbox payment if Revolut sandbox provides a suitable test card. Done on 2026-05-16 as a declined-attempt proof; the same hosted-checkout order later completed after a successful retry.
11. Run a full refund only after the order reaches `completed`. Done on 2026-05-16 against order `6a0866ef-9b11-a041-bfa2-e973e15e564d`; original order retrieval returned `refundedAmount: 12000`.
11a. Capture and verify the refund-order webhook. Done on 2026-05-16; Revolut sent `ORDER_COMPLETED` for refund order `6a0872b4-89b8-a82d-884b-703f6470c124` without `merchant_order_ext_ref`, and the mapper now returns `enrichmentRequired`.
12. Run a terminal failed-payment sandbox proof. Done on 2026-05-16 with Revolut's 3DS verification failure test card; Revolut emitted `ORDER_PAYMENT_FAILED`.
13. Record webhook requirements, but do not expose a public webhook endpoint until signature verification is wired into that endpoint.

## Proof Success Criteria

Minimum useful proof:

- sandbox order created for `£120.00`; done.
- response includes `id` and `checkout_url`; done.
- order can be retrieved by ID; done.
- `applicationId` appears in Revolut reference/metadata fields and can route the order back to the application; done for create/retrieve/list.
- idempotency behaviour is observed with a repeated request; done, and create-order is not idempotent in the observed sandbox behaviour.
- hosted checkout page opens; done.
- successful sandbox payment changes order/payment state as expected; done.
- fresh hosted checkout returns to `payment-return.html` instead of a 404; done.
- failed/declined sandbox payment attempt can be observed and mapped; done for retryable `ORDER_PAYMENT_DECLINED` on order `6a08af68-51f9-ae4b-be9e-c388fc6f400e`, and terminal `ORDER_PAYMENT_FAILED` on order `6a08b551-d18e-a506-9cfa-6a27983dd1de`.
- full refund path is observed; refund webhook event-name/field shape is observed, and enrichment-backed Billing implementation remains to do;
- captured webhook signature verifies locally using the raw payload and Revolut headers; done for archived sample. Signature matched; timestamp was outside the 5-minute live replay window by the time it was verified.
- verified webhook payload maps to the expected Billing status without writing to the Sheet; done.
- IDs/statuses can be copied into the existing `Billing` sheet through `operator-billing.mjs`; dry-run done, live update not yet run.

Stronger proof:

- saved payment method can be retrieved for merchant-initiated use;
- follow-up merchant-initiated charge can be created against the saved method;
- subscription plan/variation created in sandbox;
- subscription setup order created and checkout URL retrieved;
- first renewal date can be delayed/updated;
- webhook endpoint receives and verifies events.

## Current Next Action

The terminal failed-payment sandbox proof is now complete. Continue with record-only webhook endpoint design/implementation before public payment gating.

Do not run webhook-driven live Billing updates until dedupe storage and payment enrichment are implemented and proven in record-only mode.

Design note: `REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md` now records the preferred host/dedupe/enrichment design. It recommends a small Google Cloud Run function/service, Firestore Native mode for dedupe/event records, and a record-only first implementation before any automatic Billing writes.

Endpoint design direction started on 2026-05-16:

- `revolut-webhook-verify.mjs` now exports its verification primitives (`verifyWebhook`, `computeSignature`, timestamp/signature helpers) while preserving the CLI.
- `revolut-webhook-map.mjs` now exports mapping primitives (`mapWebhookPayload`, `buildOperatorBillingArgs`, `EVENT_MAP`) while preserving the CLI.
- `revolut-webhook-handler.mjs` now provides an offline endpoint-core proof that verifies headers/body first, maps second, and returns public/internal handler results without calling Revolut, Apps Script, or Google Sheets.
- This lets a future real endpoint import the same tested crypto/mapping code instead of copying it.
- The future endpoint must be a real server/serverless handler that can read the exact raw request body and the `Revolut-Request-Timestamp` / `Revolut-Signature` headers.
- GitHub Pages is static and cannot receive POST webhooks.
- Do not assume the existing Apps Script public web app is suitable for direct Revolut webhook receipt; Apps Script is useful for the operator API and Sheets updates, but the live webhook entrypoint must prove it can read raw body bytes and custom Revolut headers before it is trusted.
- The endpoint pipeline remains: raw body -> signature/timestamp verification -> dedupe -> order/payment enrichment where needed -> Billing update.
- Handler self-test passed for completed-payment mapping, failed-payment mapping, invalid-signature rejection, and refund-event enrichment-required behaviour.
- Integration caution: do not treat a live `ORDER_COMPLETED` event as paid until the endpoint has either enriched the order or otherwise proved it is a payment order, not a refund order. Refund-order webhooks can also arrive as `ORDER_COMPLETED`.
- Integration caution: verify the Revolut signature/timestamp once at first receipt. If later order enrichment is needed, reuse the verified raw payload with `mapWebhookPayload`; do not call the full handler again after a slow enrichment step because the timestamp window may have expired.
- The handler's `mapping_failed` public body intentionally omits parser details; diagnostics stay in the internal object.

The first live sandbox Hosted Checkout payment proof has passed. Sandbox webhook registration/capture also passed. No production Revolut call has been made. No real customer card data has been handled. No live Billing row update has been made from this webhook proof.

## Live Sandbox Payment Return Proof Results - 2026-05-16

Fresh sandbox checkout:

- application/reference: `ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
- order ID: `6a0866ef-9b11-a041-bfa2-e973e15e564d`;
- order token: `7bd10568-e1f1-4d32-a733-0ccd9b0033f9`;
- customer ID: `d565e618-f459-495c-8f7b-e1e51b8a28dd`;
- created amount/currency: `12000 GBP`;
- redirect target was generated by `revolut-sandbox-proof.mjs` using the neutral return-page URL.

Browser return:

- after sandbox payment, the browser landed on `https://www.rightonq.co.uk/rcs-registration/payment-return.html?applicationId=ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
- this proves the checkout return no longer lands on the old generic 404;
- the return URL carries the application ID but does not hard-code `payment=success`.

API retrieval after payment:

- order state: `completed`;
- embedded payment ID: `6a08673c-80db-a36d-97a3-ec673b09e3cd`;
- payment-list endpoint returned one payment for the order;
- payment state: `captured`;
- payment method type: `card`;
- payment amount/currency: `12000 GBP`.

Important nuance:

- the browser-return page is still non-authoritative by design;
- payment state is confirmed by Revolut order/payment retrieval or webhook processing;
- no live Billing row update has been made from this return-page proof.

## Live Sandbox Declined-Attempt Proof Results - 2026-05-16

Fresh sandbox checkout:

- application/reference: `ROQ-RCS-TEST-DECLINED-20260516-001`;
- idempotency key: `roq-rcs-declined-proof-20260516-001`;
- order ID: `6a08af68-51f9-ae4b-be9e-c388fc6f400e`;
- token: `694632ca-a8fa-442e-beb0-61f704e7d377`;
- customer ID: `1a21a8ef-fc6c-442c-863a-fcb2b8fa2a05`;
- amount/currency: `12000 GBP`;
- initial order state: `pending`.

Payment attempts:

- first attempt used Revolut's sandbox insufficient-funds test card and declined;
- declined payment ID from order retrieval: `6a08afb8-937c-ae29-8437-9e0045df3bac`;
- embedded order retrieval showed declined attempt state `declined` and decline reason `insufficient_funds`;
- the payment-list endpoint returned the declined payment attempt but did not include the decline reason;
- the hosted checkout later allowed a successful retry on the same order;
- captured payment ID: `6a08affd-b4b7-ae3e-9d39-4c3eb1c05f79`;
- final order state: `completed`.

Webhook events captured for the same order:

- `ORDER_PAYMENT_DECLINED`
  - webhook.site request ID `6b31a6a4-4a94-4bb2-ba99-7e14dc70afb2`;
  - timestamp `1778954177544`;
  - raw body `{"event":"ORDER_PAYMENT_DECLINED","order_id":"6a08af68-51f9-ae4b-be9e-c388fc6f400e","merchant_order_ext_ref":"ROQ-RCS-TEST-DECLINED-20260516-001"}`;
  - no payment ID in the body.
- `ORDER_AUTHORISED`
  - webhook.site request ID `d128f21f-e2a4-433b-be4e-b70eacba560c`;
  - timestamp `1778954247076`;
  - raw body `{"event":"ORDER_AUTHORISED","order_id":"6a08af68-51f9-ae4b-be9e-c388fc6f400e","merchant_order_ext_ref":"ROQ-RCS-TEST-DECLINED-20260516-001"}`;
  - no payment ID in the body.
- `ORDER_COMPLETED`
  - webhook.site request ID `b7427a92-8b26-48f7-86cb-cff5583fffeb`;
  - timestamp `1778954247253`;
  - raw body `{"event":"ORDER_COMPLETED","order_id":"6a08af68-51f9-ae4b-be9e-c388fc6f400e","merchant_order_ext_ref":"ROQ-RCS-TEST-DECLINED-20260516-001"}`;
  - no payment ID in the body.

Mapping proof:

- `ORDER_PAYMENT_DECLINED` maps to `billingStatus = registration_fee_failed` and `paymentStatus = declined`;
- later `ORDER_COMPLETED` maps to `billingStatus = registration_fee_paid` and `paymentStatus = paid`;
- this confirms the endpoint must process event order carefully and dedupe per event/order, not just final order state.

Build implication:

- a single hosted-checkout order can have multiple payment attempts;
- declined-attempt webhook bodies do not include payment IDs, so payment-attempt correlation requires order retrieval;
- a declined attempt does not necessarily mean the order is terminally failed;
- for customer UX, the hosted checkout may let the customer retry and complete the same order;
- no live Billing row update was made from this declined-attempt proof.

## Live Sandbox Terminal Failed-Payment Proof Results - 2026-05-16

Fresh sandbox checkout:

- application/reference: `ROQ-RCS-TEST-FAILED-20260516-002`;
- idempotency key: `roq-rcs-failed-proof-20260516-002`;
- order ID: `6a08b551-d18e-a506-9cfa-6a27983dd1de`;
- token: `8a814a4f-773c-4bf9-b35c-e4931982c7c2`;
- customer ID: `d8ebb82b-bf3e-4f8a-a7c1-a3a41e515a88`;
- amount/currency: `12000 GBP`;
- initial order state: `pending`.

Browser checkout:

- Revolut sandbox 3DS verification failure test card used: `4242424242424242`;
- source docs checked on 2026-05-16: `https://developer.revolut.com/docs/guides/accept-payments/get-started/test-implementation/test-cards`;
- checkout UI showed: `3DS Verification failed. Please try to pay again or use another card`.

API retrieval after the failed payment:

- order state stayed `pending`;
- embedded payment ID: `6a08b5b0-1eef-af17-9eed-f34734a1db3b`;
- embedded payment state: `failed`;
- embedded decline reason: `customer_challenge_failed`;
- payment-list endpoint returned one payment for the order;
- payment-list state: `failed`;
- payment-list endpoint did not include the decline reason.

Webhook event captured:

- webhook.site request ID `58fcd33e-85fa-4cd3-9a6d-fc6601783e89`;
- received at `2026-05-16 18:21:42 UTC`;
- `Revolut-Request-Timestamp`: `1778955702535`;
- `Revolut-Signature`: `v1=5837d22e50f9e17aa9e49bb066dc09900981be2c3d3b09afa7089e96d1f80b76`;
- raw body `{"event":"ORDER_PAYMENT_FAILED","order_id":"6a08b551-d18e-a506-9cfa-6a27983dd1de","merchant_order_ext_ref":"ROQ-RCS-TEST-FAILED-20260516-002"}`;
- no payment ID, decline reason, or card data appeared in the webhook body.

Mapping proof:

- local mapping of the captured raw body returned `mapped = true`;
- event `ORDER_PAYMENT_FAILED`;
- `billingStatus = registration_fee_failed`;
- `paymentStatus = failed`;
- `checkoutOrderId = 6a08b551-d18e-a506-9cfa-6a27983dd1de`;
- dry-run only; no live Billing row update was made.

Build implication:

- `ORDER_PAYMENT_FAILED` is distinct from the retryable `ORDER_PAYMENT_DECLINED` proof;
- for this 3DS failure case, Revolut emitted exactly one matching webhook and no later `ORDER_AUTHORISED` / `ORDER_COMPLETED` event was observed in the capture window;
- the order can remain `pending` while the payment attempt is terminally `failed`, so the endpoint should treat the event/payment state carefully and avoid assuming order-level `pending` means no failure happened;
- payment ID and decline reason require order/payment enrichment because the webhook body only carries event, order ID, and merchant reference;
- no card data was exposed.

## Live Sandbox Webhook Proof Results - 2026-05-16

Sandbox webhook registration:

- Temporary capture URL: `https://webhook.site/84da51c0-7f70-4475-830a-11a8d002a81f`
- Revolut sandbox webhook ID: `e6f32548-ffef-4f77-92fa-a0d2ae0b7dea`
- Events registered:
  - `ORDER_AUTHORISED`
  - `ORDER_COMPLETED`
  - `ORDER_CANCELLED`
  - `ORDER_FAILED`
  - `ORDER_PAYMENT_DECLINED`
  - `ORDER_PAYMENT_FAILED`
- Signing secret was returned by Revolut and kept in `/tmp/revolut-webhook-create-response.json`; it was not pasted into chat or committed.

Webhook-triggering order:

- Order ID: `6a084d13-d84d-a49b-bb44-916bb9237ba4`
- Token: `6e705351-f49a-4dd0-b0a4-9a979dbbfe7e`
- Customer ID: `ecd04bc4-379a-411a-927e-9ed2b9f8b88d`
- Reference: `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`

Captured webhook events:

- `ORDER_AUTHORISED`
- `ORDER_COMPLETED`

Captured `ORDER_COMPLETED` payload:

```json
{"event":"ORDER_COMPLETED","order_id":"6a084d13-d84d-a49b-bb44-916bb9237ba4","merchant_order_ext_ref":"ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747"}
```

Verification:

- Raw payload was saved to `/tmp/revolut-webhook-5e006.json`.
- Byte count was `145`, matching the browser-agent capture.
- `Revolut-Request-Timestamp`: `1778929033752`
- `Revolut-Signature`: `v1=98380183760c497ac9472d136d9ca121e267337d8309ddc9ef2079b233e478b9`
- Signature verification result with normal 5-minute tolerance:
  - `signatureMatched: true`
  - `timestampAccepted: false`
  - reason: `timestamp_outside_tolerance`
  - age at verification: about `707` seconds
- Archived-sample verification with `--skip-timestamp-tolerance` returned `ok: true`.

Mapping result:

- `ORDER_COMPLETED` mapped to:
  - `billingStatus = registration_fee_paid`
  - `paymentProvider = revolut`
  - `checkoutOrderId = 6a084d13-d84d-a49b-bb44-916bb9237ba4`
  - `paymentStatus = paid`
  - `paymentReceivedAt = 2026-05-16T10:57:13.752Z`
  - `refundStatus = not_required`
- Dedupe key:
  - `revolut:ORDER_COMPLETED:6a084d13-d84d-a49b-bb44-916bb9237ba4:ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`
- `operator-billing.mjs --dry-run` printed the expected proposed update and performed no Sheet write.

Build impact:

- Real Revolut sandbox event names and field paths match the mapper for the happy path.
- The webhook payload does not include `payment_id`; payment ID must be enriched by order/payment retrieval if the Billing row requires it.
- A live webhook endpoint must verify signature and timestamp before mapping; it must not use the CLI-only `--skip-timestamp-tolerance` behaviour.
- A real endpoint also needs dedupe storage before writing Billing updates.
