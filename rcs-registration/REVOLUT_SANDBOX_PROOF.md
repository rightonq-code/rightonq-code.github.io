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

## Revolut Docs Checked

Official Revolut Merchant docs reviewed on 2026-05-15:

- Sandbox: use the sandbox Merchant account, sandbox API keys, and `https://sandbox-merchant.revolut.com/` instead of production endpoints.
- Hosted Checkout Page via API: backend creates an order and receives `id` plus `checkout_url`; customer completes payment on Revolut's hosted page; backend should use webhooks or polling to verify status.
- Customers/saved payment methods: payment methods are generated as part of payment, not directly created by RightOnQ.
- Merchant-initiated charges: to charge later, create an order for a customer with a saved payment method, then pay for that order using the saved payment method ID/type.
- Subscriptions: Revolut has a Subscriptions API with plans, variations, hosted onboarding/setup orders, saved payment method capture, lifecycle tracking, and billing-cycle history.
- Webhooks: Revolut supports order lifecycle events such as `ORDER_AUTHORISED` and `ORDER_COMPLETED`; delivery order is not guaranteed, so RightOnQ must treat webhook handling as idempotent.

## Proof Questions

### A. One-off registration fee

- Can a sandbox Merchant order be created for `12000` minor units (`£120.00`, representing `£100 + VAT`)?
- Does the response include a stable order `id` and customer-facing `checkout_url`?
- Can RightOnQ set an internal reference such as `ROQ-RCS-TEST-...`?
- Can the order include customer email/name safely?
- What exact order states are returned before and after test payment?

### B. Hosted payment experience

- Does the hosted page look acceptable with Revolut branding/customisation?
- Can a customer complete payment with Revolut sandbox test cards?
- What happens on failure/decline test cards?
- Can a success redirect return to a RightOnQ URL with enough context to continue?

### C. Saved payment method / merchant-initiated billing

- Can the initial registration-fee payment save a payment method for merchant-initiated use?
- If not through Hosted Checkout alone, does Revolut require the widget/subscription setup flow instead?
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

### E. PAYG / top-up control

- Is PAYG credit better as separate one-off orders rather than Revolut subscription usage?
- Can RightOnQ create top-up orders for fixed amounts, e.g. `£50 + VAT`, `£100 + VAT`?
- Can later top-ups use a saved merchant-initiated payment method?
- What is the cleanest way to pause sending if top-up fails?

### F. Webhooks and reconciliation

- Can webhook URLs be created in sandbox?
- Which event types are available for orders/subscriptions?
- Does Revolut sign webhook payloads and expose a signing secret?
- Can RightOnQ verify signatures locally?
- Are retries delivered if the endpoint fails?
- Does webhook order differ from payment lifecycle order?

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

For live sandbox use, set the secret in the terminal environment, not in the repo:

```bash
export REVOLUT_MERCHANT_API_SECRET="sk_sandbox_..."
node rcs-registration/tools/revolut-sandbox-proof.mjs --create-registration-order
unset REVOLUT_MERCHANT_API_SECRET
```

Optional environment:

```bash
export REVOLUT_MERCHANT_API_BASE_URL="https://sandbox-merchant.revolut.com/api"
export REVOLUT_API_VERSION="2026-04-20"
```

## Proof Success Criteria

Minimum useful proof:

- sandbox order created for `£120.00`;
- response includes `id` and `checkout_url`;
- order can be retrieved by ID;
- hosted checkout page opens;
- successful sandbox payment changes order/payment state as expected;
- failed sandbox payment can be observed and mapped;
- IDs/statuses can be copied into the existing `Billing` sheet through `operator-billing.mjs`.

Stronger proof:

- saved payment method can be retrieved for merchant-initiated use;
- subscription plan/variation created in sandbox;
- subscription setup order created and checkout URL retrieved;
- first renewal date can be delayed/updated;
- webhook endpoint receives and verifies events.

## Current Next Action

Get or create a Revolut Business Sandbox Merchant account and sandbox Merchant API Secret key. Do not paste the key into chat. Use it locally through an environment variable or a future secret-loader helper.
