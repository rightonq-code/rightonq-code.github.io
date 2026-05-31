# RightOnQ RCS Registration Form

Standalone beta form for collecting UK RCS sender registration information.

## Local test URL

Open:

`file:///Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

## Intended hosted path

When published through GitHub Pages, this folder is intended to be served separately from the main website at:

`/rcs-registration/`

The main website should only link to this form when ready. This folder should stay independent from the homepage and general RightOnQ website files.

## How to read this folder

This lane has many files. They fall into three groups. **If you are picking the work back up, start with `index.html` (the client form) and `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md` (what the lane is and is not).**

- **CORE** — the live product path and its current guardrails. Trust these as current.
- **SUPPORT** — the living handover, design notes, and proof/sandbox scaffolding. Useful context; not the product itself. Items marked *(parked)* are deployed-but-inactive or sandbox-only.
- **ARCHIVED / REFERENCE** — superseded, historical, or test-fixture material. Each of these files carries a status banner at its top. Kept for history; do not treat as current product truth.

### CORE

- `index.html` — single-file client-facing RCS Part A / Part B registration form. The front door.
- `tools/` — local operator helpers: create application link, operator snapshot, internal-review and proof-pack/final-pack preflight checkers, Twilio setup lifecycle guardrails. See `tools/README.md`.
- `google-apps-script/` — the Apps Script intake and operator API (`Code.gs`) behind the form, plus deployment notes. See `google-apps-script/README.md`.
- `cloud-run/proof-assets/` — small public Cloud Run proxy serving approved RCS proof assets from a private GCS bucket.
- `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md` — architecture scaffold for the whole lane: what onboarding owns, what the product owns, progress, proof-video focus, callback and secure-evidence boundaries, activation handover.
- `RCS_REGISTRATION_PACK_READINESS_MAP.md` — source-of-truth map of Twilio RCS Sender / Secondary Compliance Profile requirements against RightOnQ Part A and tracking fields, with the test-fixture-vs-real-client distinction and the submission gates.
- `RCS_PROOF_VIDEO_WORKFLOW.md` — workflow guardrail for preparing, reviewing, hosting, approving, and storing the RCS proof/review video URL.
- `RCS_PROVIDER_SUBMISSION_PREFLIGHT_CHECKLIST.md` — operator guardrail for final proof-pack review before moving provider submission out of `not_started`.
- `RCS_TWILIO_CONSOLE_ASSET_CLARIFICATION_2026-05-22.md` — live note recording the Twilio Console / Help Center asset-size clarification under open ticket `#26791676` and the source/submitted-asset tracking stance.

### SUPPORT

- `RCS_TWILIO_4_HANDOVER_2026-05-12.md` — the current living handover, including the 2026-05-28 recovery re-anchor and post-merge sections. Start here for "what happened and what's next."
- `RCS_ONBOARDING_ACTIVATION_HANDOVER_CONTRACT.md` — design guardrail for the narrow packet handed from onboarding into the main product after approval. Design only, not a live schema.
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` — long build journal and detailed decision record. Reference, not a current task list.
- `RCS_ONBOARDING_PRODUCT_BRIDGE_FOR_PROFESSOR.md` — builder-facing note explaining the onboarding/product boundary and questions for build-team review.
- `RCS_REPO_TRANSFER_CHECKLIST.md` — guardrail for pausing RCS safely before a GitHub ownership transfer.
- `payment-return.html` — Revolut hosted-checkout browser-return page; payment status stays verified by order/webhook records, not by this page.
- `cloud-run/twilio-callback/` — dedicated record-only Twilio status callback receiver. Deployed and signature-proved, but intentionally not configured on any Messaging Service. *(parked)*
- `cloud-run/revolut-webhook/` — Revolut Merchant webhook source. Sandbox/record-only; no live Billing write. *(parked)*
- `REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md` — design-only plan for the future Revolut webhook host, dedupe, enrichment, and no-live-write boundary.
- `REVOLUT_SANDBOX_PROOF.md` — record of the Revolut sandbox payment/webhook proof. Sandbox only, not production.

### ARCHIVED / REFERENCE

Each file below carries a status banner at its top explaining why.

- `RCS_NEXT_SLICE_CHECKLIST_2026-05-23.md` — SUPERSEDED by the RT4 handover recovery re-anchor.
- `RCS_PROOF_ASSET_STAGING_NOTE.md` — SUPERSEDED by `RCS_REGISTRATION_PACK_READINESS_MAP.md`.
- `RCS_ONBOARDING_CODEX_REVIEW_DRAFT_2026-05-20.md` — point-in-time second-pair review brief; reference / history.
- `RCS_PROVIDER_SUBMISSION_ACTION_PACK_2026-05-21.md` — TEST FIXTURE ONLY (test application), not a real submission.
- `RCS_PROVIDER_SUBMISSION_READBACK_2026-05-21.md` — TEST FIXTURE ONLY (test application), not a real submission.
- `RCS_TWILIO_1_HANDOVER_2026-05-06.md` — superseded handover (RCS-Twilio-1 session); history only.
- `RCS_TWILIO_2_HANDOVER_2026-05-11.md` — superseded handover (RCS-Twilio-2 session); history only.
- `RCS_TWILIO_3_HANDOVER_2026-05-12.md` — superseded handover (RCS-Twilio-3 session); history only.
- `backups/` — timestamped local backup copies.
