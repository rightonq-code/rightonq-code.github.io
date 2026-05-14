# RCS Operator Tools

These tools are local RightOnQ operator helpers for the RCS onboarding pilot.

They call the deployed Apps Script web app, but they do not store PINs in this repo. Always use `--dry-run` first, then run the live command only when the Apps Script-side PIN has been configured.

## Tools

| Tool | Purpose | Local PIN |
| --- | --- | --- |
| `operator-create-application.mjs` | Create a private application record/link from a qualified CRM or outreach handoff. | `RCS_ONBOARDING_CREATE_PIN` |
| `operator-status.mjs` | Read the guarded operator snapshot for one application. | `RCS_ONBOARDING_OPERATOR_PIN` |
| `operator-review.mjs` | Update the internal review checklist and optionally mark Part A accepted. | `RCS_ONBOARDING_OPERATOR_PIN` |

## Safety Rules

- Do not paste real PINs into chat, docs, commits, or command examples.
- Do not pass PINs as command arguments.
- Use environment variables only.
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

## Recommended Operator Order

1. Create the private application link with `operator-create-application.mjs`.
2. Check the application with `operator-status.mjs`.
3. After the customer submits Part A, check status again.
4. Complete RightOnQ review using `operator-review.mjs`.
5. Check status again with `operator-status.mjs`.

## If A Tool Fails

- `ONBOARDING_CREATE_PIN is not configured`: the Apps Script-side create PIN is missing.
- `ONBOARDING_OPERATOR_PIN is not configured`: the Apps Script-side operator PIN is missing.
- `Invalid onboarding create PIN`: the local create PIN does not match the Apps Script property.
- `Invalid onboarding operator PIN`: the local operator PIN does not match the Apps Script property.
- `Non-JSON response from Apps Script`: the web app URL may be wrong, redeployed incorrectly, or blocked by an auth/config issue.
