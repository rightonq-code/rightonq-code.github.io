# RightOnQ RCS Registration Form

Standalone beta form for collecting UK RCS sender registration information.

## Local test URL

Open:

`file:///Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

## Intended hosted path

When published through GitHub Pages, this folder is intended to be served separately from the main website at:

`/rcs-registration/`

The main website should only link to this form when ready. This folder should stay independent from the homepage and general RightOnQ website files.

## Contents

- `index.html` - single-file RCS registration form
- `payment-return.html` - Revolut hosted-checkout return page; it confirms browser return only, while payment status remains verified by order/webhook records
- `cloud-run/proof-assets/` - small public Cloud Run proxy for approved RCS proof assets stored in private GCS
- `cloud-run/twilio-callback/` - dedicated record-only Twilio Messaging status callback receiver
- `REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md` - design-only plan for the future Revolut webhook host, dedupe store, enrichment flow, and no-live-Billing-write boundary
- `RCS_REGISTRATION_PACK_READINESS_MAP.md` - source-only map of Twilio RCS Sender / Secondary Compliance Profile requirements against RightOnQ Part A and internal tracking fields
- `RCS_PROVIDER_SUBMISSION_PREFLIGHT_CHECKLIST.md` - operator guardrail for final proof-pack review before moving provider submission out of `not_started`
- `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md` - short architecture scaffold for the whole onboarding lane, including current progress, proof-video focus, callback boundary, and product activation handover
- `RCS_ONBOARDING_ACTIVATION_HANDOVER_CONTRACT.md` - design guardrail for the narrow packet handed from onboarding into the main RightOnQ product after approval
- `RCS_REPO_TRANSFER_CHECKLIST.md` - SECURITY-2 / BUGS guardrail for pausing RCS safely before a GitHub ownership transfer
- `RCS_ONBOARDING_PRODUCT_BRIDGE_FOR_PROFESSOR.md` - builder-facing note explaining the onboarding/product boundary and questions for Professor/build team review
- `RCS_ONBOARDING_CODEX_REVIEW_DRAFT_2026-05-20.md` - read-only second-pair review brief covering the current scaffold, parked work, proof-video correction, and questions for Codex/Professor/build reviewers
- `RCS_TWILIO_1_HANDOVER_2026-05-06.md` - detailed handover notes from the first build session
- `backups/` - timestamped local backup copies
