# RCS Operator Tools

These tools are local RightOnQ operator helpers for the RCS onboarding pilot.

Operator tools call the authenticated Apps Script Execution API through the clean `rcsOperatorAction` route. Public customer submissions use the public web app deployment. The tools do not store PINs in this repo. Always use `--dry-run` first, then run the live command only when the Apps Script-side PIN has been configured.

## Apps Script Auth

Operator tools use the named clasp/OAuth login:

- clasp user: `rightonq-gog`;
- local OAuth credential source: `~/.clasprc.json`;
- Apps Script project config: `rcs-registration/google-apps-script/.clasp.json`;
- clean API executable deployment: `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9` at Apps Script version `44`;
- public customer web app deployment: `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` at Apps Script version `45`.

Operator wrappers call `scripts.run` against the clean API executable deployment ID in `.clasp.json` with `devMode: false`. They are pinned to the deployed operator API version rather than Apps Script HEAD.

Override knobs, only if needed:

- `RCS_ONBOARDING_CLASP_USER` changes the named clasp credential used by operator tools.
- `RCS_ONBOARDING_CLASP_PROJECT` changes the `.clasp.json` path used to find the operator API deployment ID.
- `CLASPRC_JSON` changes the clasp credential store path.

## Public Endpoint Environment

The public Part A proof helper still uses a web app URL for fake/valid customer submissions. It resolves the public endpoint in this order:

1. `RCS_ONBOARDING_PUBLIC_WEB_APP_URL`;
2. `RCS_ONBOARDING_WEB_APP_URL`;
3. built-in public web app deployment URL.

The proof helper uses the authenticated operator API for creating the private test application and reading the snapshot.

## Tools

| Tool | Purpose | Local PIN |
| --- | --- | --- |
| `operator-create-application.mjs` | Create a private application record/link from a qualified CRM or outreach handoff. | `RCS_ONBOARDING_CREATE_PIN` |
| `operator-status.mjs` | Read the guarded operator snapshot for one application. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `internal-review-preflight.mjs` | Offline Internal reviews checker for a saved `operator-status.mjs` JSON snapshot before Part A acceptance. | No PIN; local JSON only |
| `operator-review.mjs` | Update the internal review checklist and optionally mark Part A accepted. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-trusthub-kyc.mjs` | Update the internal Trust Hub KYC tracking row and sync the application Trust Hub status. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-rc-bundle.mjs` | Update the internal UK RC Bundle tracking row. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-twilio-setup.mjs` | Update the internal Twilio setup, provider submission, hosted asset/proof URL, usage-pull, and manual pause tracking row. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-twilio-subaccount-link.mjs` | Resolve a Twilio subaccount by friendly name and link it into the internal Twilio setup row with redacted terminal output. | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-billing.mjs` | Update the internal billing/payment tracking row. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-payment-order.mjs` | Check, append, or look up Revolut payment-order ledger snapshots for active-checkout protection. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `proof-pack-preflight.mjs` | Offline proof-pack checker for a saved `operator-status.mjs` JSON snapshot before provider submission. | No PIN; local JSON only |
| `proof-video-preflight.mjs` | Offline proof-video readiness checker for review-video URL/status and client approval state in a saved operator snapshot. | No PIN; local JSON only |
| `proof-asset-url-preflight.mjs` | Read-only public URL/content check for logo, banner, opt-in proof, and review video assets in a saved operator snapshot. | No PIN; public URL fetches only |
| `twilio-account-inventory.mjs` | Read-only Twilio parent/subaccount/Messaging Service inventory preflight before provider-connected setup. | `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` |
| `twilio-subaccount-create.mjs` | Create one clearly named Twilio subaccount after a duplicate-name preflight. | `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` |
| `twilio-subaccount-messaging-inventory.mjs` | Read-only Messaging Service and sender-pool inventory inside a named Twilio subaccount. | `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` |
| `twilio-subaccount-messaging-service-create.mjs` | Create one Messaging Service inside a named Twilio subaccount after a duplicate-name preflight. | `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` |
| `proof-public-part-a-submit.mjs` | Create a private test link, submit Part A through the public path, then prove Trust Hub KYC and UK RC Bundle tracking rows were created. | `RCS_ONBOARDING_CREATE_PIN` and `RCS_ONBOARDING_OPERATOR_PIN` |
| `proof-public-part-b-guards.mjs` | Create a synthetic draft application, then prove public Part B approval endpoints reject out-of-order calls. | `RCS_ONBOARDING_CREATE_PIN` and `RCS_ONBOARDING_OPERATOR_PIN` for live proof |
| `revolut-sandbox-proof.mjs` | Prepare and test Revolut sandbox Hosted Checkout requests. | No RCS PIN; uses `REVOLUT_MERCHANT_API_SECRET` for live sandbox calls |
| `revolut-webhook-verify.mjs` | Verify Revolut webhook signatures/timestamp tolerance against captured sandbox payloads. | No RCS PIN; uses `REVOLUT_WEBHOOK_SIGNING_SECRET` for real samples |
| `revolut-webhook-map.mjs` | Map a verified Revolut webhook payload into a proposed `operator-billing.mjs --dry-run` update. | No RCS PIN; performs no writes |
| `revolut-webhook-handler.mjs` | Offline endpoint-core proof: verify headers/body, map payload, and return public/internal handler results without writes. | No RCS PIN; fake-data self-test only for now |

Note: `operator-twilio-setup.mjs` and the expanded Billing/RC Bundle fields are live on the clean API executable deployment at version `44`; public customer submissions use the public web app deployment at version `45`. Version `39` kept missing Sheet headers append-only, repaired the known `Applications` header drift, and proved the Slice 9B Twilio setup tracking row readback. Version `40` hardened append writers to write by the live Sheet header row before any provider-connected slice. Version `42` preserves numeric zero values through shared Sheet row readback. Version `43` preserves numeric zero values in full operator snapshots and `operator-status.mjs` redacts Twilio Account SIDs from terminal output. Version `44` adds `Opt-in proof URL(s)` to Twilio setup tracking and proves hosted asset/proof URL readback. Version `45` adds public Part B order guards to the web app deployment.

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

Expected live result: JSON containing application status, latest internal review, Trust Hub KYC row, UK RC Bundle row, recent status events, and queued communications. The snapshot also includes the latest `twilioSetup` row, and `operator-status.mjs` redacts full Twilio Account SIDs in terminal output.

## Check Internal Review Readiness

Offline check from a saved `operator-status.mjs` snapshot:

```bash
node rcs-registration/tools/internal-review-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-current-operator-snapshot.json
```

Expected result: JSON showing whether the internal Part A review has blockers or warnings before `operator-review.mjs --part-a-accepted` is used.

Self-test:

```bash
node rcs-registration/tools/internal-review-preflight.mjs --self-test
```

Safety: this tool is local/offline only. It does not call Apps Script, Google Sheets, Twilio, Revolut, Google Cloud, or any provider API. It treats legal/company, website/domain, public links, message purpose/examples, consent/opt-out, and phone-preview readiness as Part A acceptance gates. It treats KYC/Trust Hub and SMS fallback/RC bundle as explicit pending lanes that may continue after Part A acceptance, as long as they are not blocked or ambiguous.

The live `operator-review.mjs --part-a-accepted` path is guarded too: it refuses Part A acceptance unless `--confirm-part-a-acceptance` and `--review-status accepted` are both supplied after this preflight has passed.

## Approve Part A After Internal Review

Dry run:

```bash
node rcs-registration/tools/operator-review.mjs \
  --application-id ROQ-RCS-... \
  --review-status accepted \
  --part-a-accepted \
  --confirm-part-a-acceptance \
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
  --confirm-part-a-acceptance \
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

## Update Twilio Setup Tracking

Dry run:

```bash
node rcs-registration/tools/operator-twilio-setup.mjs \
  --application-id ROQ-RCS-... \
  --twilio-subaccount-sid AC... \
  --rbm-logo-url https://example.com/logo.png \
  --rbm-banner-url https://example.com/banner.png \
  --opt-in-proof-urls https://example.com/opt-in-proof.png \
  --review-video-url https://example.com/review-video.webm \
  --provider-submission-status not_started \
  --usage-pull-status not_started \
  --manual-pause-flag no \
  --internal-notes "Proof pack tracking update only; provider submission not started." \
  --dry-run
```

Live run:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-twilio-setup.mjs \
  --application-id ROQ-RCS-... \
  --twilio-subaccount-sid AC... \
  --rbm-logo-url https://example.com/logo.png \
  --rbm-banner-url https://example.com/banner.png \
  --opt-in-proof-urls https://example.com/opt-in-proof.png \
  --review-video-url https://example.com/review-video.webm \
  --provider-submission-status not_started \
  --usage-pull-status not_started \
  --manual-pause-flag no \
  --internal-notes "Proof pack tracking update only; provider submission not started."
```

Expected live result: JSON showing the stored Twilio subaccount SID, provider submission status, go-live status, and manual pause flag.

Safety: store Twilio resource IDs, statuses, public asset/proof URLs, and operator notes only. Keep `--provider-submission-status not_started`, `--go-live-status not_started`, and `--usage-pull-status not_started` until a separate explicit submission approval gate has passed. The tool refuses later lifecycle values for those three fields unless `--confirm-provider-state-change` is present. Do not store Twilio auth tokens, API keys, webhook secrets, raw message payloads, customer message content, or private/signed URLs in this workflow.

## Link Twilio Proof Subaccount Into Tracking

This helper resolves the full Twilio subaccount SID by friendly name, writes it
to the internal `Twilio setup` tracking row, and redacts Twilio Account SIDs from
terminal output.

Dry run:

```bash
node rcs-registration/tools/operator-twilio-subaccount-link.mjs \
  --application-id ROQ-RCS-... \
  --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
  --twilio-status subaccount_created \
  --provider-submission-status not_started \
  --go-live-status not_started \
  --usage-pull-status not_started \
  --manual-pause-flag no \
  --internal-notes "Twilio proof subaccount created and linked; no Messaging Service, RCS sender, phone number, message send, or chargeable usage." \
  --dry-run
```

Live run, using the existing 1Password secret wrapper for Twilio credentials and
an operator PIN environment variable for the Sheet update:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." \
  ~/rightonq-infrastructure/scripts/run_with_secrets.sh \
    node rcs-registration/tools/operator-twilio-subaccount-link.mjs \
      --application-id ROQ-RCS-... \
      --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
      --twilio-status subaccount_created \
      --provider-submission-status not_started \
      --go-live-status not_started \
      --usage-pull-status not_started \
      --manual-pause-flag no \
      --internal-notes "Twilio proof subaccount created and linked; no Messaging Service, RCS sender, phone number, message send, or chargeable usage."
```

Expected live result: JSON showing `linked: true` and the operator update result with any Twilio Account SIDs redacted in terminal output. The internal Sheet stores the real resolved SID.

## Twilio Account Inventory Preflight

Dry run:

```bash
node rcs-registration/tools/twilio-account-inventory.mjs --dry-run --include-senders
```

Live read-only run, using the existing 1Password secret wrapper:

```bash
~/rightonq-infrastructure/scripts/run_with_secrets.sh \
  node rcs-registration/tools/twilio-account-inventory.mjs --include-senders
```

Expected live result: JSON showing the parent Twilio account summary, visible accounts, filtered subaccounts, Messaging Services, and sender-pool summary for the configured Messaging Service. The tool performs `GET` requests only and never prints the Twilio auth token.

Safety: this is the first provider-connected preflight step only. It must not create subaccounts, Messaging Services, sender pools, RCS senders, compliance profiles, phone numbers, messages, or chargeable usage.

## Create Twilio Proof Subaccount

Dry run:

```bash
node rcs-registration/tools/twilio-subaccount-create.mjs \
  --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
  --dry-run
```

Live run, using the existing 1Password secret wrapper:

```bash
~/rightonq-infrastructure/scripts/run_with_secrets.sh \
  node rcs-registration/tools/twilio-subaccount-create.mjs \
    --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
    --confirm-create
```

Expected live result: JSON showing either `created: true` with the new subaccount SID/status, or `created: false` if a visible account already has the same friendly name. The tool performs a duplicate-check `GET` before the create `POST` and never prints the Twilio auth token.

Safety: this tool creates only a Twilio subaccount. It does not create Messaging Services, sender pools, RCS senders, phone numbers, messages, compliance profiles, or chargeable usage.

## Twilio Subaccount Messaging Inventory

Dry run:

```bash
node rcs-registration/tools/twilio-subaccount-messaging-inventory.mjs \
  --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
  --include-senders \
  --dry-run
```

Live read-only run, using the existing 1Password secret wrapper:

```bash
~/rightonq-infrastructure/scripts/run_with_secrets.sh \
  node rcs-registration/tools/twilio-subaccount-messaging-inventory.mjs \
    --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
    --include-senders
```

Expected live result: JSON showing the named subaccount summary, Messaging Services in that subaccount, and sender-pool summaries for those services. The tool resolves the subaccount by friendly name using parent credentials, then uses the resolved subaccount SID/auth token only in memory for Messaging API reads. It never prints auth tokens or full Twilio Account SIDs.

Safety: this tool performs read-only `GET` requests only. It does not create Messaging Services, sender pools, RCS senders, phone numbers, messages, compliance profiles, or chargeable usage.

## Create Twilio Subaccount Messaging Service

Dry run:

```bash
node rcs-registration/tools/twilio-subaccount-messaging-service-create.mjs \
  --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
  --messaging-service-friendly-name "RightOnQ RCS proof messaging" \
  --usecase notifications \
  --dry-run
```

Live run, using the existing 1Password secret wrapper:

```bash
~/rightonq-infrastructure/scripts/run_with_secrets.sh \
  node rcs-registration/tools/twilio-subaccount-messaging-service-create.mjs \
    --friendly-name "RightOnQ RCS proof customer - 2026-05-19" \
    --messaging-service-friendly-name "RightOnQ RCS proof messaging" \
    --usecase notifications \
    --confirm-create
```

Expected live result: JSON showing either `created: true` with the new Messaging Service SID/friendly name/use case, or `created: false` if a service with the same friendly name already exists in the subaccount. The tool resolves the subaccount by friendly name, checks existing Messaging Services, then creates one Messaging Service only.

Safety: this tool creates only a Messaging Service. It does not create sender pools, RCS senders, phone numbers, messages, compliance profiles, or chargeable usage.

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

## Check Or Record Payment Orders

Check whether an application already has a completed or open Revolut checkout before
creating another order:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-payment-order.mjs \
  --check-active \
  --application-id ROQ-RCS-...
```

Expected decisions:

- `already_paid`: a non-superseded completed order exists; do not create a new checkout.
- `reuse`: a non-superseded open order exists; reuse the stored checkout URL.
- `safe_to_create`: no completed/open order was found.

Record a created Revolut order snapshot after a successful sandbox/order-create call:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-payment-order.mjs \
  --record \
  --application-id ROQ-RCS-... \
  --revolut-order-id order_... \
  --order-state pending \
  --amount-minor 12000 \
  --currency GBP \
  --checkout-url https://sandbox-checkout.revolut.com/payment-link/... \
  --merchant-order-reference ROQ-RCS-... \
  --idempotency-key proof-ROQ-RCS-... \
  --order-purpose registration_fee \
  --internal-notes "Sandbox order created. No card data stored."
```

Look up the latest ledger snapshot by Revolut order ID:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-payment-order.mjs \
  --lookup \
  --revolut-order-id order_...
```

This ledger is the active-checkout source of truth. The Billing row may mirror the
latest provider IDs for readability, but checkout creation guards must read the
`Payment orders` ledger, not the single Billing checkout/order cell.
Refund webhook enrichment should also resolve application context from this ledger or
the original-order record before writing any Billing update.

## Offline Proof Pack Preflight

This checker reads a saved operator snapshot JSON file and reports whether the
proof pack has missing URLs, placeholder-looking proof assets, premature provider
status movement, missing Part B video approval, or missing approval signals. It
performs no Apps Script, Twilio, Revolut, Google Cloud, or provider calls.

Save a snapshot first:

```bash
RCS_ONBOARDING_OPERATOR_PIN="..." node rcs-registration/tools/operator-status.mjs \
  --application-id ROQ-RCS-... > /tmp/roq-rcs-operator-snapshot.json
```

Run the offline check:

```bash
node rcs-registration/tools/proof-pack-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json
```

Most final submission gates are blockers: missing or placeholder proof URLs,
unclear review-video status, unreviewed registration-pack status, unaccepted
Part A, missing or pending internal review, and missing core business fields all
return `ok: false`. Use `--strict` if any remaining warnings should also fail
the command:

```bash
node rcs-registration/tools/proof-pack-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json \
  --strict
```

Local self-test:

```bash
node rcs-registration/tools/proof-pack-preflight.mjs --self-test
```

Expected result: JSON with `blockers`, `warnings`, and
`readyForProviderSubmission`. Even a clean result is still only a preflight; the
provider submission action needs separate explicit RightOnQ approval.

The checker blocks provider submission unless `partBStatus` is `video_approved`
or later. `name_logo_approved` is not enough because the review/proof video still
needs client approval.

## Offline Proof Video Preflight

This checker reads a saved operator snapshot and reports whether the review video
is still draft/placeholder material or has reached the client-approved state
needed for final pack review.

```bash
node rcs-registration/tools/proof-video-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json
```

Use `--strict` if warnings should also fail the command:

```bash
node rcs-registration/tools/proof-video-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json \
  --strict
```

Local self-test:

```bash
node rcs-registration/tools/proof-video-preflight.mjs --self-test
```

Expected result: JSON with `blockers`, `warnings`, and
`videoReadyForFinalPackReview`. It does not fetch the video URL; use
`proof-asset-url-preflight.mjs` for public URL/content checks.

Latest proof against `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`: the checker
correctly returned `ok: false` because the hosted review-video URL/status still
look placeholder-only and the application has not reached `video_approved`.

## Public Proof Asset URL Preflight

This checker reads a saved operator snapshot and fetches the public asset URLs
only. It verifies that the logo, banner, opt-in proof image, and review video are
reachable, use plausible content types, and meet the image constraints that can
be checked mechanically.

```bash
node rcs-registration/tools/proof-asset-url-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json
```

Default banner profile is `twilio`, using the `1440x448` size shown by Twilio
Help, Twilio Console evidence, and Google's current RBM agent-banner guidance.
Use `--banner-profile twilio-onboarding-doc` to check the `1140x448` size still
shown by Twilio's RCS onboarding page, or `--banner-profile either` when
comparing the documented discrepancy.

```bash
node rcs-registration/tools/proof-asset-url-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json \
  --banner-profile either
```

Local self-test:

```bash
node rcs-registration/tools/proof-asset-url-preflight.mjs --self-test
```

Safety: this tool is read-only. It fetches public URLs and does not call Apps
Script, Twilio, Revolut, Google Cloud APIs, or Google Sheets. A clean asset URL
result is not provider-submission approval; run the full proof-pack preflight and
record explicit RightOnQ approval before any submission action.

Latest proof against `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`: all four hosted
asset URLs were publicly reachable. The current banner is `1440x448`, so it now
passes the default `twilio` profile and the `google` profile. It fails only under
`--banner-profile twilio-onboarding-doc`, which preserves the single Twilio
onboarding-page `1140x448` discrepancy for comparison.

## Public Part B Guard Proof

Dry run:

```bash
node rcs-registration/tools/proof-public-part-b-guards.mjs --dry-run
```

Live proof:

```bash
RCS_ONBOARDING_CREATE_PIN="..." RCS_ONBOARDING_OPERATOR_PIN="..." \
  node rcs-registration/tools/proof-public-part-b-guards.mjs \
    --confirm-live-proof
```

Expected live result: JSON showing one synthetic draft application was created,
then public name/logo and video approval attempts were both rejected before any
Part B approval rows could be written.

Latest live proof: 2026-05-20 created
`ROQ-RCS-TEST-PUBLIC-PARTB-GUARD-20260520193346`; both out-of-order public Part B
approval attempts were rejected, and the operator snapshot stayed at
`partAStatus: draft` with no Part B status, no recent status events, and no
queued communication codes.

Safety: live proof creates one synthetic draft application. A successful public
Part B approval is treated as a failed proof. Private application tokens and PINs
are never printed.

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

The verifier and mapper are also importable endpoint primitives. A future real webhook handler should import `verifyWebhook` from `revolut-webhook-verify.mjs` and `mapWebhookPayload` from `revolut-webhook-map.mjs` rather than copying the HMAC or event-mapping logic.

The live endpoint must run on infrastructure that can read the raw request body and custom Revolut headers. Do not use GitHub Pages for webhook receipt, and do not trust an Apps Script web app as the direct webhook entrypoint unless it has separately proven access to the exact raw body and `Revolut-Request-Timestamp` / `Revolut-Signature` headers.

Endpoint-core proof, using fake data only:

```bash
node rcs-registration/tools/revolut-webhook-handler.mjs --self-test
```

Expected result: `ok: true`. The handler self-test proves a completed payment maps to `verified_mapped_dry_run`, a failed payment maps to the failed-payment dry-run path, an invalid signature is rejected, and a refund-style event without `merchant_order_ext_ref` returns `enrichment_required`. The returned handler object deliberately separates the small public response body from internal verification/mapping diagnostics; a real endpoint should return only the public body to Revolut.

Before any live Billing update, enrich or otherwise prove the order type for `ORDER_COMPLETED` events; refund-order webhooks can also use `ORDER_COMPLETED`. Verify the signature/timestamp once at receipt, then use mapping/enrichment primitives for later internal processing rather than re-running the whole handler after the timestamp window may have aged.

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

Webhook-to-billing mapping proof, after signature verification passes:

```bash
node rcs-registration/tools/revolut-webhook-map.mjs --self-test

node rcs-registration/tools/revolut-webhook-map.mjs \
  --payload-file /path/to/revolut-webhook-payload.json \
  --request-timestamp "1683650202360"

node rcs-registration/tools/revolut-webhook-map.mjs \
  --payload-file /path/to/refund-webhook-payload.json \
  --enriched-order-file /path/to/retrieved-refund-order.json \
  --application-id ROQ-RCS-... \
  --request-timestamp "1683650202360"
```

Expected happy-path payment result: JSON containing `mapped: true`, a `dedupeKey`, proposed `operatorBillingArgs`, and an `operatorBillingDryRunCommand`. The mapper warns if `merchant_order_ext_ref` does not look like a `ROQ-RCS-...` application ID. If a recognised event is missing `merchant_order_ext_ref`, the mapper returns `mapped: false` with `enrichmentRequired: true`; retrieve the Revolut order by `order_id` before applying any Billing update. This is required for refund webhooks, which can arrive as `ORDER_COMPLETED` for the refund order ID without an application reference.

For refund events, pass the retrieved refund order JSON plus the application ID resolved from the RightOnQ ledger/original order. The mapper then classifies the event as `refund_order` and produces a refund-status dry-run without overwriting the original checkout/order ID. The mapper does not call Apps Script or update the Sheet.

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
