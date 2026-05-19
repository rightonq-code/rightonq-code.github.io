# RCS Onboarding / Product Bridge Note For Professor

Status: architecture handover note for review
Date: 2026-05-19
Author: Codex, RCS onboarding lane

## Purpose

This note explains a small but important architecture correction in the RCS onboarding lane.

The RCS onboarding build is running in parallel with the main RightOnQ product build. During the latest work, we noticed that one planned next step in onboarding could accidentally duplicate a responsibility that already belongs to the product backend. This note sets out what was built, what we discovered, the risk, and the proposed path forward.

The requested review is practical: should the build team agree with this boundary, adjust it, or stop the onboarding lane from going further in this direction?

## STRAW Summary

### Stop

We paused before adding persistence/dedupe to the standalone Twilio callback receiver in the onboarding repo.

### Think

The onboarding lane needs callback readiness for RCS/Twilio setup, but the main product already has a durable provider-webhook/event-journal model. If onboarding grows its own persistent callback backend, RightOnQ could end up with two competing message-event truths.

### Research

Local sources checked:

- `rightonq-system/docs/rightonq_system_blueprint_v1.md`
- `rightonq-system/docs/build_progress_tracker.md`
- `rightonq-system/docs/OPEN_THREADS.md`
- `rightonq-system/backend/app/api/routes/webhooks.py`
- `rightonq-system/backend/app/services/webhook_processing/service.py`
- `rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
- `rightonq-code.github.io/rcs-registration/RCS_REGISTRATION_PACK_READINESS_MAP.md`
- `rightonq-code.github.io/rcs-registration/cloud-run/twilio-callback/README.md`

Primary external source anchors checked or rechecked:

- Twilio RCS onboarding: https://www.twilio.com/docs/rcs/onboarding
- Twilio Messaging Service / status callback concepts: https://www.twilio.com/docs/messaging/services
- Twilio webhook request validation: https://www.twilio.com/docs/usage/security
- Twilio Trust Hub Secondary Compliance Profiles: https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles
- Google RCS Business Messaging launch approval: https://developers.google.com/business-communications/rcs-business-messaging/guides/launch/launch-approval

### Ask

The build team should confirm:

1. Should production Twilio delivery/status callbacks ultimately terminate in `rightonq-system`, not the onboarding Cloud Run callback proof?
2. Should onboarding produce an activation handover contract instead of owning live message-event persistence?
3. Should identity/supporting-document collection stay Twilio-managed or secure-admin-only, rather than passing raw passport/ID documents through the static form, Google Sheet, or normal onboarding logs?

### WIN

Recommended direction: keep onboarding as the activation/provisioning factory; keep the main product as the live messaging/event system; add an explicit activation handover contract between them.

## What The Onboarding Lane Has Built

The onboarding lane is no longer just a public form. It now contains a structured pilot workflow for:

- Part A application capture and internal review.
- Revolut registration-fee payment/order tracking.
- Google Apps Script / Sheet operator APIs.
- Trust Hub / Secondary Compliance Profile tracking fields.
- UK RC Bundle/fallback tracking fields.
- One Twilio subaccount per proof customer.
- A proof Twilio Messaging Service in that subaccount.
- Hosted proof-asset route through Cloud Run and private GCS.
- A dedicated Twilio Messaging callback Cloud Run receiver.

The latest Twilio callback receiver is deliberately limited:

- It validates Twilio signatures.
- It accepts form-encoded status callbacks.
- It projects conservative fields such as `MessageSid`, `EventSid`, `MessageStatus`, `EventType`, `ErrorCode`, and a read-receipt signal.
- It returns accepted/rejected responses.
- It does not configure the Messaging Service callback URL.
- It does not send messages.
- It does not write Sheets.
- It does not write Firestore.
- It does not submit an RCS sender or compliance profile.
- It does not move phone numbers or sender pools.

That work is useful as a provider-shape proof and staging test. It has not changed the live product path.

## What The Product Build Already Owns

The main product build in `rightonq-system` has already merged WP8 delivery-webhook ingestion.

The product backend now has:

- `POST /webhooks/provider`
- Twilio signature verification
- form-encoded callback parsing
- `message_events`
- `message_event_processing`
- correlation by `OutboundMessage.provider_message_id`
- duplicate `EventSid` handling
- unmatched authentic webhook journaling
- delivery-state projection for delivered / failed / undelivered

The product blueprint is clear that RightOnQ is built around:

- one message
- one visible card
- recipient-level delivery/response state
- append-only event history
- operator-visible simplicity

That means production delivery/reply/read-event truth belongs in the main product's event journal, not in an onboarding-only side system.

## What We Noticed Was Not Quite Right

The onboarding handover had a natural next suggestion: add Firestore persistence/dedupe to the Twilio callback receiver, still record-only, before configuring any Messaging Service callback URL.

That is technically sensible if the onboarding callback receiver is only a standalone proof endpoint.

But after checking the product build, it becomes risky if treated as the future production callback path. It could create:

- duplicate callback endpoints
- duplicate dedupe models
- callback events split between Firestore and Postgres
- uncertainty about whether the product board or onboarding records are the real source of message history
- extra migration work later to move proof data into the product event journal

This is not an emergency. Nothing needs reversing. But it is the point where the lanes should be interlocked deliberately.

## Proposed Architecture

### Rule 1: Onboarding provisions readiness

The onboarding system owns the journey from interested customer to approved/activated customer.

It should track:

- application status
- review status
- registration fee/payment evidence
- legal business details
- RCS sender pack readiness
- hosted logo/banner/opt-in/video proof URLs
- Twilio subaccount SID
- Twilio Messaging Service SID
- Trust Hub / Secondary Compliance Profile status
- UK RC Bundle/fallback readiness
- provider submission status
- approval/go-live status
- manual pause / risk flags

### Rule 2: Product owns live messaging

The product backend owns:

- real outbound sends
- provider message IDs for live sends
- delivery callbacks
- replies/confirmations
- read receipts when supported and deliberately modelled
- message cards
- message event journal
- recipient delivery and response state
- reminders and card closure

### Rule 3: The bridge is activation handover

When onboarding reaches "approved and ready to use", it should hand a controlled activation payload to the product.

Suggested activation handover fields:

```text
application_id
client_id
account_id / product_account_id
legal_business_name
trading_name / sender_display_name
customer_primary_contact
twilio_subaccount_sid
twilio_messaging_service_sid
rbm_agent_id / rcs_sender_id
fallback_sender_id / fallback_phone_sid
rc_bundle_sid
secondary_compliance_profile_sid
approved_logo_url
approved_banner_url
approved_opt_in_proof_urls
approved_review_video_url
provider_submission_status
go_live_status
billing_activation_date
channel_mode = sms_only | rcs_ready | rcs_primary_sms_fallback
manual_pause_flag
```

The product should not infer live RCS readiness merely because a Twilio subaccount or Messaging Service exists. It should only accept RCS enablement from an explicit activation state.

### Rule 4: Callback proof stays proof until product ownership is decided

The existing onboarding callback receiver can remain useful for:

- signature proof
- RCS callback-shape rehearsal
- READ/read-receipt observation
- provider documentation checks
- sandbox/proof subaccount testing

But before configuring the proof Messaging Service callback URL, the build team should decide one of these:

1. Configure callbacks directly to `rightonq-system` if the product environment is ready.
2. Keep the onboarding callback receiver as staging-only and document that it is not production source of truth.
3. Add temporary Firestore persistence only if it is explicitly named as proof/staging telemetry, with a clear migration/discard plan.

My recommendation is option 2 for now, moving toward option 1 when the product environment is ready.

## Compliance / ID Evidence Boundary

There is a separate interesting build lane around Trust Hub / identity evidence.

Current RightOnQ onboarding already has tracking fields for:

- representative validation statuses
- end-user SIDs
- supporting document SID
- evidence provider
- evidence inquiry/registration IDs
- evidence requested/submitted/approved/rejected timestamps
- internal KYC notes

The existing plan is conservative: do not collect passports, driving licences, government ID, proof-of-address documents, or raw ID scans in the static public form or Google Sheet path.

Recommended build boundary:

- Public Part A can collect business facts and representative contact details.
- If Twilio requires extra identity/address evidence, route it through a secure Twilio-managed or secure-admin path.
- Store only Twilio IDs, statuses, timestamps, and rejection/exception reasons in RightOnQ records.
- Do not store raw ID documents in Sheets, static form submissions, GitHub, chat logs, or normal operator notes.

Potential future build, if Twilio flow supports it:

- A secure evidence gateway that sends the client into Twilio/Trust Hub/Compliance Embeddable or another approved secure upload flow.
- RightOnQ stores the resulting inquiry/document/verification IDs and status callbacks, not the document content.

This could become a strong onboarding feature, but it should be built as a compliance-safe evidence handoff, not as a general file-upload box.

## What We Should Do Next

Recommended next onboarding build slice:

1. Create the activation handover contract in the onboarding docs/model.
2. Mark the Twilio callback receiver as staging/proof-only until production callback ownership is confirmed.
3. Update the readiness map to replace "add callback persistence/dedupe before callback configuration" with a clearer build-team decision gate.
4. Continue normal onboarding work on registration pack readiness, Trust Hub/Secondary Compliance Profile preflight, and secure evidence-route design.

Do not yet:

- configure the proof Messaging Service callback URL;
- add full permanent callback persistence in onboarding;
- submit an RCS sender;
- submit Trust Hub / Secondary Compliance Profile;
- move phone numbers or sender pools;
- set production recipients to `preferred_channel='rcs'`;
- send RCS traffic.

## Questions For Professor / Build Team

1. Do you agree that production Twilio status callbacks should ultimately land in `rightonq-system`, not the onboarding Cloud Run proof receiver?
2. Do you agree that onboarding should create an activation payload rather than own live message-event persistence?
3. Should the activation payload be written first as documentation only, or should we add a machine-readable JSON schema/tool next?
4. Should secure ID/evidence handling be treated as a separate onboarding work package before any real Secondary Compliance Profile submission?
5. Is there any product reason for onboarding to keep a separate callback/event store beyond temporary proof telemetry?

## Bottom Line

No reversal is needed.

The onboarding work is useful and should continue, but the lane should turn slightly:

- onboarding provisions and proves readiness;
- product owns live messaging and live event history;
- the bridge is an explicit activation handover contract.

This keeps the two builds interlocked without letting onboarding become a second product backend.
