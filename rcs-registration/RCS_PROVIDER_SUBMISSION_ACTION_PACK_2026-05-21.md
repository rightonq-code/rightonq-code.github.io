# RCS Provider Submission Action Pack - 2026-05-21

> **TEST FIXTURE ONLY — NOT A REAL CUSTOMER SUBMISSION (2026-05-28).** Every value here is for the test application `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`. This is an operator drill/reference, not a record of a real provider submission and not real customer data.

Status: operator action pack. This is not proof that a provider submission has
already happened. It is the controlled packet to use when RightOnQ performs the
RCS Sender submission in the provider workflow.

## Approval Gate

RightOnQ approved the next step in chat after the final-pack readback merged to
`main` on 2026-05-21.

Approved scope:

```text
Final pack approved for provider submission.
Provider submission action approved by: Adam / RightOnQ.
Scope: RCS Sender submission only.
Not bundled: Trust Hub submission, A-ID evidence collection, callback config,
sender-pool movement, phone-number movement, message send, go-live, usage pull,
or product activation.
```

Before treating submission as complete, the operator must still perform the
provider workflow and record the actual provider reference/status returned by
Twilio/RBM/Google.

## Application

- Application ID: `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`
- Client / brand: `TEST Public Part A Proof`
- Legal business name: `TEST Public Part A Proof Ltd`
- Business type: `Private limited company`
- Industry: `Retail`
- Registration identifier: `UK:CRN`
- Registration number: `12345678`
- Qualified use case: `Transactional`
- Primary contact: `Test Public Submitter`
- Primary contact email: `test-public-parta@example.com`

## Current Onboarding State

- Registration status: `video_approved`
- Part A status: `part_a_accepted`
- Internal review status: `accepted`
- Part B status: `video_approved`
- Review video status: `client_approved`
- Registration pack status: `final_pack_review_ready`
- Provider submission status: `not_started`
- Go-live status: `not_started`
- Usage pull status: `not_started`

## Submission Evidence URLs

- RBM logo URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-logo.png`
- RBM banner URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-banner.jpg`
- Opt-in proof URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-opt-in.png`
- Review video URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-review-video.webm`

Asset readback already passed with the Twilio banner profile:

- Logo: PNG, `224 x 224`, `21555` bytes
- Banner: JPEG, `1140 x 448`, `12269` bytes
- Opt-in proof: PNG, `1280 x 720`, `528293` bytes
- Review video: WebM, `3101185` bytes

## Provider Workflow Boundary

Use the provider/Twilio RCS Sender workflow for the sender submission. The local
RightOnQ tooling does not create or submit an RCS Sender programmatically.

Do include:

- public sender profile details from Part A;
- logo and Twilio submission banner URLs above;
- opt-in description and opt-in proof URL;
- opt-out / STOP wording and description;
- approved review video URL;
- use-case description and sample message examples;
- one authorised representative for branded RCS sender submission, unless the
  provider workflow explicitly requests more.

Do not include in this action:

- Trust Hub / A-ID evidence submission;
- raw passport, ID, or proof-of-address material in RightOnQ storage;
- callback configuration;
- sender-pool movement;
- phone-number movement;
- message sending;
- go-live or usage pull setup;
- product activation handover.

## After The Provider Workflow Is Submitted

Only after the provider workflow gives a submission reference or visible review
state, record that outcome in RightOnQ tracking.

Use values from the provider screen, not guesses:

```text
Provider submission status: provider_review
Provider submission reference: <provider reference or Twilio/RBM sender/application id>
Provider submitted at: <ISO timestamp>
Registration pack status: leave as final_pack_review_ready unless a separate,
known RightOnQ pack-status value is deliberately approved.
Provider notes: RCS Sender submission only; no Trust Hub/A-ID, callback config,
sender-pool movement, phone-number movement, message send, go-live, usage pull,
or product activation bundled.
```

Command template for the tracking update, to run only after the provider
submission has actually been made:

```bash
cd /Users/macpro/rightonq-rcs-proof-pack-20260521

printf "Paste RCS_ONBOARDING_OPERATOR_PIN: "
read -rs RCS_ONBOARDING_OPERATOR_PIN
printf "\n"

export RCS_ONBOARDING_OPERATOR_PIN

node rcs-registration/tools/operator-twilio-setup.mjs \
  --application-id ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747 \
  --provider-submission-status provider_review \
  --provider-submission-reference "<PROVIDER_REFERENCE>" \
  --provider-submitted-at "<ISO_TIMESTAMP>" \
  --provider-notes "RCS Sender submission only; no Trust Hub/A-ID, callback config, sender-pool movement, phone-number movement, message send, go-live, usage pull, or product activation bundled." \
  --go-live-status not_started \
  --usage-pull-status not_started \
  --manual-pause-flag no \
  --confirm-provider-state-change

unset RCS_ONBOARDING_OPERATOR_PIN
```

Do not run that command until the actual provider submission/reference exists.

## Post-Submission Checks

After the tracking update:

1. Refresh `operator-status.mjs` for the application.
2. Confirm `Provider submission status` is the only lifecycle gate moved.
3. Confirm `Go-live status` and `Usage pull status` remain `not_started`.
4. Confirm no callback URL, sender pool, phone number, message send, Trust Hub,
   A-ID, or product activation field was moved as part of this action.
5. Record provider follow-up requirements separately if Twilio/RBM/Google asks
   for clarification or extra evidence.
