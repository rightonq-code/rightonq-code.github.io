# Revolut Sandbox Proof Plan

Created: 2026-05-15
Owner: RCS-Twilio-4
Status: draft proof plan, not production implementation

## Purpose

Prove the Revolut-first billing assumptions before wiring live customer payment flow into the RCS onboarding application.

The proof should answer whether RightOnQ can safely use Revolut for:

- the one-off `£100 + VAT` RCS registration fee;
- a saved customer/payment method;
- the post-approval monthly platform fee for `RightOnQ UK` or `RightOnQ Global`;
- later PAYG/top-up payments;
- webhook-based status reconciliation.

## Current Design Assumption

Customer flow should become:

1. customer chooses `RightOnQ UK` or `RightOnQ Global`;
2. customer pays the `£100 + VAT` registration fee through Revolut;
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
- Refunds can be full or partial, but only for completed orders, and should use `Idempotency-Key` to avoid duplicate refund processing.
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

## Proof Questions

### A. One-off registration fee

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

- Can a full sandbox refund be created for the registration fee?
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

Dry run the refund shape:

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

1. Create one registration-fee order with a fixed idempotency key.
2. Run the exact same create command again with the same idempotency key and confirm the returned order identity/status does not duplicate the payment attempt.
3. Retrieve the order by ID.
4. List orders by `merchant_order_data_reference` using the same application ID.
5. Open the checkout URL in a browser and complete one sandbox card payment.
6. Retrieve the order and payment list after payment.
7. Capture one sandbox webhook payload plus headers and verify it with
   `revolut-webhook-verify.mjs`.
8. Map the verified webhook with `revolut-webhook-map.mjs` and review the proposed Billing update.
9. Update the existing Billing row with `operator-billing.mjs` using provider/order/payment IDs only.
10. Run one failed/declined sandbox payment if Revolut sandbox provides a suitable test card.
11. Run a full refund only after the order reaches `completed`.
12. Record webhook requirements, but do not expose a public webhook endpoint until signature verification is wired into that endpoint.

## Proof Success Criteria

Minimum useful proof:

- sandbox order created for `£120.00`;
- response includes `id` and `checkout_url`;
- order can be retrieved by ID;
- `applicationId` appears in Revolut reference/metadata fields and can route the order back to the application;
- idempotency behaviour is observed with a repeated request;
- hosted checkout page opens;
- successful sandbox payment changes order/payment state as expected;
- failed sandbox payment can be observed and mapped;
- full refund path is observed and mapped;
- captured webhook signature verifies locally using the raw payload and Revolut headers;
- verified webhook payload maps to the expected Billing status without writing to the Sheet;
- IDs/statuses can be copied into the existing `Billing` sheet through `operator-billing.mjs`.

Stronger proof:

- saved payment method can be retrieved for merchant-initiated use;
- follow-up merchant-initiated charge can be created against the saved method;
- subscription plan/variation created in sandbox;
- subscription setup order created and checkout URL retrieved;
- first renewal date can be delayed/updated;
- webhook endpoint receives and verifies events.

## Current Next Action

Get or create a Revolut Business Sandbox Merchant account and sandbox Merchant API Secret key. Do not paste the key into chat. Use it locally through an environment variable or a future secret-loader helper.

No live Revolut call has been made yet. The local helpers have passed dry-run checks for create order, refund, saved-method payment payloads, fake-data webhook signature verification, and fake-data webhook-to-billing mapping.
