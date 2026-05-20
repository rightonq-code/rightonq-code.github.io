# RCS proof video workflow

Date: 2026-05-20

Status: onboarding workflow guardrail. This is not a provider submission, not a Twilio API action, not proof that a sender is approved, and not permission to send live RCS traffic.

## Purpose

This document defines how RightOnQ prepares the RCS proof/review video that forms part of the provider and carrier approval evidence pack.

The video is approval evidence. It is not the live RightOnQ messaging product and not a callback or runtime event feature.

Names used by different parties:

- Twilio: use-case video URL
- Google/RBM: agent preview video / agent video
- RightOnQ: RCS proof video / registration review video

## Source Anchors

Official references checked on 2026-05-20:

- Twilio RCS onboarding: `https://www.twilio.com/docs/rcs/onboarding`
- Google RCS launch approval: `https://developers.google.com/business-communications/rcs-business-messaging/guides/launch/launch-approval`

Local source files:

- `index.html`
- `RCS_REGISTRATION_PACK_READINESS_MAP.md`
- `RCS_PROVIDER_SUBMISSION_PREFLIGHT_CHECKLIST.md`
- `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md`

## Hard Rule

The draft video generator is a preparation tool only.

Do not treat a generated browser video as provider-ready until all of these are true:

- RightOnQ has reviewed the video content;
- the client has approved the sender name, logo, and video;
- placeholders have been replaced with approved assets;
- the final video is hosted at a public URL that requires no login;
- the final URL is stored in the Twilio setup tracking row;
- the provider submission preflight checklist has passed.

Keep these statuses at `not_started` until the final submission gate is explicitly approved:

```text
Provider submission status
Go-live status
Usage pull status
```

## Required Story Beats

The proof video should show, at minimum:

1. Sender identity:
   - approved sender display name;
   - approved logo;
   - representative sender profile or branded phone view.
2. Permission / opt-in route:
   - how a person agrees to receive messages;
   - the wording or context that makes consent clear.
3. Primary use-case message:
   - the main message type the business wants to send;
   - the sender identity visible in the message view.
4. Secondary or follow-up message:
   - a second example, HELP, or customer-action path where applicable.
5. HELP/support behaviour:
   - how the recipient can ask for support or get contact details.
6. STOP/opt-out behaviour:
   - recipient sends STOP or equivalent;
   - sender confirms unsubscribe;
   - the video makes opt-out clear without making it the whole product.
7. Review context:
   - video uses representative registration data;
   - no real recipient/customer data is shown.

## Inputs Needed Before Final Video

Required:

- accepted Part A written details;
- reviewed legal business name and Companies House/registration identifier;
- reviewed sender display name;
- approved logo asset;
- approved banner asset or provider-specific derivative;
- approved opt-in proof image or images;
- approved example messages;
- approved HELP and STOP wording;
- approved use-case description and trigger;
- confirmed public website, privacy URL, and terms URL;
- final RightOnQ decision on whether browser-generated representative video is good enough or whether a real-device recording is required.

Do not include:

- raw passport, driving licence, government ID, or proof-of-address material;
- real customer names, phone numbers, message history, or live recipient data;
- Twilio auth tokens, API keys, private URLs, or signed asset URLs;
- callback payloads or delivery-event logs.

## Workflow

### 1. Prepare Draft

Use the existing draft generator in `index.html` to prepare a representative video from the registration pack.

The current generator shows:

- opt-in route;
- sender identity;
- primary message;
- secondary message / HELP route;
- STOP unsubscribe flow;
- closing proof-pack summary.

Draft output should remain labelled as a draft.

### 2. RightOnQ Internal Review

Check:

- business and sender identity are accurate;
- message examples match the declared use case;
- opt-in route is understandable;
- STOP flow is visible and compliant;
- HELP/support route is present;
- no placeholder or fake asset is accidentally represented as final;
- no live product capability is implied beyond the approved use case.

If the browser-generated draft looks too artificial for provider review, switch to a real-device or higher-fidelity recording before client approval.

### 3. Host Review Candidate

Host the review candidate through the approved proof-asset route only.

Current proof route:

```text
https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/<application-id>/<file>
```

The public URL must:

- open without login;
- return `200` or otherwise clearly load in a browser;
- not expose bucket listing or private storage paths;
- use approved final or review-candidate assets only.

### 4. Client Review

Send the hosted video link to the client for review.

Client should confirm:

- sender name is correct;
- logo/profile view is correct;
- messages are accurate;
- opt-in route is accurate;
- STOP/opt-out route is accurate;
- no changes are required.

Video approval is not the same as final provider submission approval.

### 5. Store Approved URL

After client approval, store the approved public video URL in tracking:

```text
Twilio setup -> Review video URL
Twilio setup -> Review video status
Twilio setup -> Registration pack status
```

Recommended conservative values before final provider submission:

```text
Review video status = client_approved
Registration pack status = proof_pack_reviewed
Provider submission status = not_started
Go-live status = not_started
Usage pull status = not_started
```

If exact enum values differ in the operator tools, use the closest conservative value and document the actual field text in the status event notes.

### 6. Final Submission Preflight

Before provider submission, run the full preflight checklist:

- `RCS_PROVIDER_SUBMISSION_PREFLIGHT_CHECKLIST.md`

Use the offline snapshot checker as a mechanical guardrail:

```sh
node rcs-registration/tools/proof-pack-preflight.mjs \
  --snapshot-file /tmp/roq-rcs-operator-snapshot.json \
  --strict
```

Do not submit only because the video is approved. The proof pack also needs final RightOnQ approval.

## Acceptance Checklist

The proof-video workflow is ready for first real submission only when:

- draft generator has produced a reviewable video or a real-device recording has replaced it;
- final logo, banner, opt-in proof, and video URLs are hosted publicly;
- all hosted URLs open without login;
- client has approved name/logo/video;
- RightOnQ has approved the final proof pack;
- no placeholder URL remains in the operator snapshot;
- provider submission preflight has passed;
- provider submission action is separately approved.

## Explicit Non-Goals

This workflow does not:

- configure Twilio callbacks;
- create or submit an RCS Sender;
- submit Trust Hub / Secondary Compliance Profile;
- move phone numbers or sender pools;
- enable usage pulls;
- send test or live customer messages;
- activate the main RightOnQ product.

## Next Build Notes

Likely implementation follow-ups:

1. Add a simple operator-facing proof-video status checklist once exact status values settle.
2. Decide whether the first real submission uses browser-generated representative video or real-device recording.
3. Replace placeholder Cloud Run proof files with approved assets.
4. Record hosted URL readback before client approval.
5. Keep provider submission behind the final preflight gate.
