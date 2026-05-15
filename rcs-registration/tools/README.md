# RCS Operator Tools

These tools are local RightOnQ operator helpers for the RCS onboarding pilot.

Operator tools call the authenticated Apps Script Execution API through the clean `rcsOperatorAction` route. Public customer submissions use the public v31 web app. The tools do not store PINs in this repo. Always use `--dry-run` first, then run the live command only when the Apps Script-side PIN has been configured.

## Apps Script Auth

Operator tools use the named clasp/OAuth login:

- clasp user: `rightonq-gog`;
- local OAuth credential source: `~/.clasprc.json`;
- Apps Script project config: `rcs-registration/google-apps-script/.clasp.json`;
- clean API executable deployment: `AKfycbyG5yW-r0sfaKt1bwUUGFAHHdQoKK8wBCfR1riVxvYamu9YhfOBpRJhnRL_5iBP0VSC`;
- public customer web app deployment: `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6`.

Operator wrappers call `scripts.run` against the clean API executable deployment ID in `.clasp.json` with `devMode: false`. They are pinned to the deployed operator API version rather than Apps Script HEAD.

Override knobs, only if needed:

- `RCS_ONBOARDING_CLASP_USER` changes the named clasp credential used by operator tools.
- `RCS_ONBOARDING_CLASP_PROJECT` changes the `.clasp.json` path used to find the operator API deployment ID.
- `CLASPRC_JSON` changes the clasp credential store path.

## Public Endpoint Environment

The public Part A proof helper still uses a web app URL for fake/valid customer submissions. It resolves the public endpoint in this order:

1. `RCS_ONBOARDING_PUBLIC_WEB_APP_URL`;
2. `RCS_ONBOARDING_WEB_APP_URL`;
3. built-in public v31 deployment URL.

The proof helper uses the authenticated operator API for creating the private test application and reading the snapshot.

## Tools

| Tool | Purpose | Local PIN |
| --- | --- | --- |
| `operator-create-application.mjs` | Create a private application record/link from a qualified CRM or outreach handoff. | `RCS_ONBOARDING_CREATE_PIN` |
| `operator-status.mjs` | Read the guarded operator snapshot for one application. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-review.mjs` | Update the internal review checklist and optionally mark Part A accepted. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-trusthub-kyc.mjs` | Update the internal Trust Hub KYC tracking row and sync the application Trust Hub status. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-rc-bundle.mjs` | Update the internal UK RC Bundle tracking row. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-billing.mjs` | Update the internal billing/payment tracking row. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `proof-public-part-a-submit.mjs` | Create a private test link, submit Part A through the public path, then prove Trust Hub KYC and UK RC Bundle tracking rows were created. | `RCS_ONBOARDING_CREATE_PIN` and `RCS_ONBOARDING_OPERATOR_PIN` |
| `revolut-sandbox-proof.mjs` | Prepare and test Revolut sandbox Hosted Checkout requests. | No RCS PIN; uses `REVOLUT_MERCHANT_API_SECRET` for live sandbox calls |
| `revolut-webhook-verify.mjs` | Verify Revolut webhook signatures/timestamp tolerance against captured sandbox payloads. | No RCS PIN; uses `REVOLUT_WEBHOOK_SIGNING_SECRET` for real samples |

## Safety Rules

- Do not paste real PINs into chat, docs, commits, or command examples.
- Do not pass PINs as command arguments.
- Use environment variables only.
- Keep `~/.clasprc.json` and downloaded Google OAuth client JSON files out of the repo. The root `.gitignore` blocks common clasp/client-secret filename patterns, but still treat those files as live credentials.
- Keep Revolut Merchant API secrets and webhook signing secrets out of the repo, chat, screenshots, and command examples.
- Do not store passport, driving licence, government ID, proof-of-address, or DOB data in these tools, the static app, or the Google Sheet.
- Treat private application links as client-specific.

## Create A Private Application Link

Dry run:

```bash
node rcs-registration/tools/operator-create-application.mjs \
  --legal-business-name "Example Trading Ltd" \
  --trading-name "Example Trading" \
  --primary-contact-name "Jane Smith" \
  --primary-contact-email jane@example.com \
  --primary-contact-phone "+44 7700 900123" \
  --crm-company-id CRM-COMPANY-EXAMPLE \
  --crm-deal-id CRM-DEAL-EXAMPLE \
  --campaign-code RCS1 \
  --message-code INTRO-1 \
  --qualified-use-case "Transactional customer updates" \
  --package-interest "Local Time Only" \
  --sales-context "Qualified by outreach" \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_CREATE_PIN="..." node rcs-registration/tools/operator-create-application.mjs \
  --legal-business-name "Example Trading Ltd" \
  --trading-name "Example Trading" \
  --primary-contact-name "Jane Smith" \
  --primary-contact-email jane@example.com \
  --primary-contact-phone "+44 7700 900123" \
  --crm-company-id CRM-COMPANY-EXAMPLE \
  --crm-deal-id CRM-DEAL-EXAMPLE \
  --campaign-code RCS1 \
  --message-code INTRO-1 \
  --qualified-use-case "Transactional customer updates" \
  --package-interest "Local Time Only" \
  --sales-context "Qualified by outreach"
```

Expected live result: JSON containing `applicationId` and `privateApplicationLink`.

## Read Operator Snapshot

Dry run:

```bash
node rcs-registration/tools/operator-status.mjs \
  --application-id ROQ-RCS-... \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-status.mjs \
  --application-id ROQ-RCS-...
```

Expected live result: JSON containing application status, latest internal review, Trust Hub KYC row, UK RC Bundle row, recent status events, and queued communications.

## Approve Part A After Internal Review

Dry run:

```bash
node rcs-registration/tools/operator-review.mjs \
  --application-id ROQ-RCS-... \
  --review-status accepted \
  --part-a-accepted \
  --legal-company-check passed \
  --website-domain-check passed \
  --public-links-check passed \
  --message-purpose-examples-check passed \
  --consent-opt-out-check passed \
  --kyc-trust-hub-check pending_trust_hub_review \
  --sms-fallback-rc-bundle-check pending \
  --phone-preview-readiness ready \
  --next-action "Prepare the phone name and logo preview." \
  --operator-name "RightOnQ" \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-review.mjs \
  --application-id ROQ-RCS-... \
  --review-status accepted \
  --part-a-accepted \
  --legal-company-check passed \
  --website-domain-check passed \
  --public-links-check passed \
  --message-purpose-examples-check passed \
  --consent-opt-out-check passed \
  --kyc-trust-hub-check pending_trust_hub_review \
  --sms-fallback-rc-bundle-check pending \
  --phone-preview-readiness ready \
  --next-action "Prepare the phone name and logo preview." \
  --operator-name "RightOnQ"
```

Expected live result: JSON showing `partAAccepted: true`, with `registrationStatus` and `partAStatus` set to `part_a_accepted`.

## Update Trust Hub KYC Tracking

Dry run:

```bash
node rcs-registration/tools/operator-trusthub-kyc.mjs \
  --application-id ROQ-RCS-... \
  --trust-hub-status pending_review \
  --secondary-compliance-profile-sid BUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --evaluation-status not_run \
  --evidence-collection-mode twilio_managed \
  --evidence-status requested \
  --kyc-internal-notes "Secondary profile prepared for manual Twilio review." \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-trusthub-kyc.mjs \
  --application-id ROQ-RCS-... \
  --trust-hub-status pending_review \
  --secondary-compliance-profile-sid BUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --evaluation-status not_run \
  --evidence-collection-mode twilio_managed \
  --evidence-status requested \
  --kyc-internal-notes "Secondary profile prepared for manual Twilio review."
```

Expected live result: JSON showing the latest `trustHubStatus`, any stored secondary profile SID, and evaluation status. This action also syncs `Applications.Trust Hub status`.

Evidence fields are status/ID fields only. Do not store session tokens, passport numbers, driving licence numbers, DOB, proof-of-address files, or identity document files in this workflow.

## Update UK RC Bundle Tracking

Dry run:

```bash
node rcs-registration/tools/operator-rc-bundle.mjs \
  --application-id ROQ-RCS-... \
  --rc-bundle-status pending_review \
  --fallback-required yes \
  --compliance-owner end_business \
  --internal-notes "UK long-code fallback bundle prepared." \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-rc-bundle.mjs \
  --application-id ROQ-RCS-... \
  --rc-bundle-status pending_review \
  --fallback-required yes \
  --compliance-owner end_business \
  --internal-notes "UK long-code fallback bundle prepared."
```

Expected live result: JSON showing the latest `rcBundleStatus`, any stored RC Bundle SID, and fallback status.

## Update Billing Tracking

Dry run:

```bash
node rcs-registration/tools/operator-billing.mjs \
  --application-id ROQ-RCS-... \
  --billing-status registration_fee_paid \
  --payment-provider revolut \
  --checkout-order-id order_... \
  --payment-id pay_... \
  --payment-status paid \
  --monthly-plan "RightOnQ UK" \
  --monthly-base-fee-gbp 25 \
  --refund-status not_required \
  --internal-notes "Registration fee confirmed. No card data stored." \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-billing.mjs \
  --application-id ROQ-RCS-... \
  --billing-status registration_fee_paid \
  --payment-provider revolut \
  --checkout-order-id order_... \
  --payment-id pay_... \
  --payment-status paid \
  --monthly-plan "RightOnQ UK" \
  --monthly-base-fee-gbp 25 \
  --refund-status not_required \
  --internal-notes "Registration fee confirmed. No card data stored."
```

Expected live result: JSON showing `billingStatus`, provider/order/payment references, payment status, and update timestamp. Store provider IDs/statuses only; do not store card details.

## Revolut Sandbox Proof

Dry run:

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --dry-run \
  --application-id ROQ-RCS-... \
  --idempotency-key proof-ROQ-RCS-...
```

Live sandbox order creation:

```bash
REVOLUT_MERCHANT_API_SECRET="..." node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --create-registration-order \
  --application-id ROQ-RCS-... \
  --idempotency-key proof-ROQ-RCS-...
```

Expected live result: JSON showing the Revolut order ID, checkout URL presence, order state, and reference fields. Run the same sandbox create command twice with the same idempotency key to prove retry behaviour before relying on it.

Useful sandbox follow-up reads:

```bash
REVOLUT_MERCHANT_API_SECRET="..." node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --order-id order_...

REVOLUT_MERCHANT_API_SECRET="..." node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --list-orders \
  --reference ROQ-RCS-...

REVOLUT_MERCHANT_API_SECRET="..." node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --retrieve-payments \
  --order-id order_...
```

Refund proof, after a sandbox order is completed:

```bash
REVOLUT_MERCHANT_API_SECRET="..." node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --refund-order \
  --order-id order_... \
  --refund-amount 12000 \
  --refund-reference ROQ-RCS-... \
  --idempotency-key refund-ROQ-RCS-...
```

Saved-method / merchant-initiated payment proof, after sandbox provides a saved method ID:

```bash
REVOLUT_MERCHANT_API_SECRET="..." node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --pay-order \
  --order-id order_... \
  --payment-method-id pm_... \
  --payment-method-type card \
  --payment-initiator merchant \
  --idempotency-key mit-ROQ-RCS-...
```

Webhook signature proof, using fake data only:

```bash
node rcs-registration/tools/revolut-webhook-verify.mjs --self-test
```

Webhook signature proof for a captured sandbox callback:

```bash
export REVOLUT_WEBHOOK_SIGNING_SECRET="..."
node rcs-registration/tools/revolut-webhook-verify.mjs \
  --payload-file /path/to/revolut-webhook-payload.json \
  --timestamp "1683650202360" \
  --signature "v1=..."
unset REVOLUT_WEBHOOK_SIGNING_SECRET
```

Expected result: `ok: true`, `signatureMatched: true`, and `timestampAccepted: true`. Use `--payload-file` for real captures and keep the payload raw; changing whitespace, adding a trailing newline, or re-serialising JSON changes the signature. When using a real `wsk_...` value, prefer a local secret loader or shell setup that avoids saving the secret in history. The verifier's `--skip-timestamp-tolerance` flag is for archived local samples only; the future live webhook endpoint must enforce the timestamp window.

## Recommended Operator Order

1. Create the private application link with `operator-create-application.mjs`.
2. Check the application with `operator-status.mjs`.
3. Confirm registration-fee billing state with `operator-billing.mjs`.
4. After the customer submits Part A, check status again.
5. Complete RightOnQ review using `operator-review.mjs`.
6. Check status again with `operator-status.mjs`.

## Public Part A Submission Proof

Dry run:

```bash
node rcs-registration/tools/proof-public-part-a-submit.mjs --dry-run
```

Live proof:

```bash
RCS_ONBOARDING_CREATE_PIN="..." RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/proof-public-part-a-submit.mjs
```

When the deployment split exists:

```bash
RCS_ONBOARDING_PUBLIC_WEB_APP_URL="https://script.google.com/macros/s/PUBLIC_DEPLOYMENT/exec" \
RCS_ONBOARDING_OPERATOR_WEB_APP_URL="https://script.google.com/macros/s/OPERATOR_DEPLOYMENT/exec" \
RCS_ONBOARDING_CREATE_PIN="..." \
RCS_ONBOARDING_OPERATOR_PIN="..." \
node rcs-registration/tools/proof-public-part-a-submit.mjs
```

Expected live result:

- an attempted fake public Part A submission without a real private application link is rejected;
- a private test application is created;
- a Part A test payload is submitted through the normal public Apps Script path using the private application token;
- the redacted operator snapshot shows:
  - `registrationStatus = part_a_submitted`;
  - an `Internal reviews` row;
  - a `Trust Hub KYC` row;
  - a `UK RC bundles` row;
  - a queued `part_a_received` communication.

The helper does not print the private application token, private link, create PIN, or operator PIN.

## If A Tool Fails

- `ONBOARDING_CREATE_PIN is not configured`: the Apps Script-side create PIN is missing.
- `ONBOARDING_OPERATOR_PIN is not configured`: the Apps Script-side operator PIN is missing.
- `Invalid onboarding create PIN`: the local create PIN does not match the Apps Script property.
- `Invalid onboarding operator PIN`: the local operator PIN does not match the Apps Script property.
- `Named clasp credential 'rightonq-gog' was not found`: rerun the local OAuth login for the `rightonq-gog` clasp user.
- `Unable to refresh Google access token`: the local OAuth credential needs refreshing.
- `Non-JSON response from Apps Script`: public web app proof only; the public URL may be wrong, redeployed incorrectly, or blocked by an auth/config issue.
