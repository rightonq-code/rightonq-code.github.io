# RightOnQ RCS Onboarding Architecture Blueprint

> ## ⚠️ CURRENT CORRECTIONS (2026-05-30) — READ FIRST
> Some specifics later in this document are **superseded**. Where this notice and the body conflict, **this notice wins.**
> - **Proof video:** the PRIMARY artifact is a **real-device iPhone screen recording** of the branded message → HELP → STOP → START exchange. The animated/browser generator is **demoted to fallback/storyboard** and is being moved **off the public page** — it is RightOnQ internal IP, never a client-facing feature.
> - **Banner spec:** **1440 × 448, ≤200KB, JPEG/PNG ONLY.** The "1140 × 448 Twilio export" mentioned below is **WRONG — disregard it.**
> - **Use-case / samples (UK/GB):** every submission goes in as **multi-use with BOTH a promotional AND a transactional/service sample.** RightOnQ handles the Twilio category/sample formatting **in the back office** — the client is **not** asked to pick a Twilio category.
> - **Pricing, refund policy, and exact build specs** are governed **per-slice by RightOnQ**, not in this public document.

Status: current build scaffold for RCS onboarding
Date: 2026-05-20
Audience: MRBLUE, Professor, build agents, RCS onboarding agents

## Purpose

This file is the short architecture view of the RightOnQ RCS onboarding build.

The long handover files prove what happened. The main build plan records detailed decisions. This file explains the shape of the system:

- what we are building;
- what the onboarding lane owns;
- what the main product owns;
- how far through the build we are;
- where the lane drifted slightly;
- what the next correct build slices are.

## One Sentence

RightOnQ RCS onboarding is the controlled path that turns a qualified UK business into an approved, provisioned, RCS-ready RightOnQ customer, then hands that customer into the main product for live messaging.

## What This Is

The onboarding system is an activation and evidence factory.

It collects, checks, hosts, tracks, and submits the information needed for RCS approval and customer activation:

- commercial acceptance;
- registration fee/payment evidence;
- business identity and legal details;
- authorised representative details;
- consent and opt-out wording;
- opt-in proof images;
- sender display name, logo, banner, and brand colour;
- use-case description and example messages;
- review/proof video URL;
- Twilio subaccount and Messaging Service setup;
- Trust Hub / Secondary Compliance Profile tracking;
- UK RC Bundle / SMS fallback tracking;
- provider submission and approval status;
- activation handover into the product.

## What This Is Not

This onboarding lane is not the live RightOnQ messaging product.

It must not become the long-term owner of:

- live outbound message sends;
- production delivery callbacks;
- reply/confirmation state;
- live read-receipt state;
- the operator card board;
- message event history;
- reminders and card closure.

Those belong in `rightonq-system`.

## Current Architecture Split

### Onboarding Owns

Onboarding owns everything before activation:

```text
lead / qualified customer
  -> Part A application
  -> internal review
  -> registration fee/payment evidence
  -> asset and proof pack
  -> Twilio / Trust Hub / RCS setup tracking
  -> provider submission
  -> approval wait
  -> ready-to-use activation handover
```

### Product Owns

The main product owns everything after activation:

```text
activated customer
  -> product account
  -> recipients and channel policy
  -> message creation
  -> send/schedule
  -> delivery callbacks
  -> replies/confirmations
  -> event journal
  -> visible card board
  -> reminders/history/closure
```

## Current Build State

### Completed / Proved

The onboarding lane has already proved:

- standalone Part A public form and submission path;
- Google Apps Script operator API and Sheet tracking;
- application snapshot/readback tooling;
- internal review tracking;
- billing/payment-order tracking;
- Revolut sandbox payment and webhook proofs;
- append-only Sheet reconciliation fixes;
- Trust Hub / KYC / UK RC Bundle tracking fields;
- Twilio setup tracking fields;
- proof Twilio subaccount creation and link;
- proof Twilio Messaging Service creation and link;
- hosted public proof-asset route through Cloud Run and private GCS;
- placeholder hosted URLs for logo, banner, opt-in proof, and review video;
- record-only Twilio callback receiver, signature-proved but not configured on the Messaging Service;
- builder-facing product bridge note for Professor.
- hidden proof studio export for draft opt-in proof PNG and draft review video WebM.

### Not Yet Done

The onboarding lane has not yet completed:

- real approved client logo/banner upload;
- final logo/banner dimension check before generating approved files; current operating standard from Twilio Digital Sales on 2026-05-20 is 1440 x 448 as the reusable Google/RBM master asset and 1140 x 448 as the Twilio sender-profile submission export, so store the exact submitted Twilio asset URL and retain the master separately;
- real opt-in proof image upload;
- real review/proof video creation;
- client Part B approval of name/logo/video;
- any extra representative collection required by a separate Secondary Compliance Profile / Trust Hub lane;
- end-client Trust Hub operating regions collection;
- Secondary Compliance Profile creation/submission;
- RCS Sender submission;
- UK RC Bundle/fallback number assignment;
- Messaging Service callback configuration;
- sender-pool movement;
- live RCS send;
- activation handover into `rightonq-system`.

## Progress Estimate

This is not a percentage-complete product claim. It is a practical build-readiness estimate.

| Area | State | Estimate |
|---|---:|---:|
| Onboarding scaffold and tracking model | Strong | 70-80% |
| Payment/order proof path | Strong sandbox proof, not full production automation | 65-75% |
| Twilio runtime setup proof | Subaccount and Messaging Service proved | 60-70% |
| Registration proof pack | Structure exists, real assets/video still missing | 45-55% |
| Trust Hub / Secondary Compliance Profile lane | Modelled, not provider-submitted | 35-45% |
| Product activation bridge | Concept documented, not implemented | 15-25% |
| First real customer submission readiness | Not yet ready | 40-50% |

Overall: the lane is well past a prototype form, but not yet at first real submission. The next decisive work is the registration proof pack, especially the review/proof video.

## The Video Correction

This is the most important correction as of 2026-05-20.

The Twilio/Google video requirement is approval evidence, not product runtime infrastructure.

Names in different sources:

- Twilio: `Use case video URL`
- Google/RBM: agent preview video / agent video
- RightOnQ internal: RCS review video / registration proof video

The video should show the declared messaging use case in action and clearly demonstrate opt-out/STOP behaviour. It must be hosted at a publicly accessible URL for review.

The opt-in proof should also stay in the approval-evidence lane. Current Twilio clarification says the opt-in policy URL can point to a screenshot of the opt-in page, the webpage where the consumer opts in, or a document explaining the opt-in flow. No public size/type/count rule is published for that specific proof asset, so RightOnQ's default should be one clear, full, legible, branded artifact unless Twilio asks for more.

This is separate from:

- Twilio status callback URL;
- inbound message webhook URL;
- production delivery-event handling;
- the RightOnQ product event journal.

## Video Build Target

The next build should produce a submission-quality proof video workflow.

The video should show, at minimum:

1. the approved sender display name and logo;
2. the declared use case;
3. one representative outbound message;
4. recipient interaction / reply button or response path where available;
5. HELP/support behaviour if relevant;
6. STOP/opt-out behaviour;
7. a clear note that the video represents the registration use case, not real customer data.

Preferred proof order:

1. real RCS test-device recording if Twilio test sender flow supports it for the proof sender;
2. otherwise a high-quality representative video generated from approved registration data;
3. browser-generated draft video only as a preparation tool until accepted as submission-quality.

The existing public form contains a canvas/MediaRecorder video generator. It now labels the output as a draft registration proof video and shows permission route, primary/secondary messages, HELP, and STOP handling. It remains a preparation tool until RightOnQ reviews it, hosts the final file, gets client approval, and stores the approved public URL.

Detailed workflow guardrail: `RCS_PROOF_VIDEO_WORKFLOW.md`.

## Callback Boundary

The standalone Twilio callback receiver was useful and safe, but it is not the next central path.

Current status:

- service exists;
- signature validation works;
- record-only proof passed;
- no Messaging Service callback URL configured;
- no Firestore persistence;
- no Sheet writes;
- no live traffic.

Decision:

- keep the callback receiver as proof/staging infrastructure;
- pause deeper callback persistence in onboarding;
- do not configure Messaging Service callbacks until the product/onboarding ownership decision is confirmed;
- do not treat Status callback URL as a sender-submission blocker; Isa Bell / Twilio Digital Sales clarified on 2026-05-21 that it is optional in the RCS registration flow and can be configured later before live traffic;
- expect production callbacks to belong in `rightonq-system`, because that repo already owns `message_events`, `message_event_processing`, delivery projection, and cards.

## Secure Evidence Boundary

Public Part A can collect business facts and representative contact details.

It must not collect or store raw passport, driving licence, government ID, or proof-of-address files in:

- the static public form;
- Google Sheets;
- GitHub;
- chat logs;
- normal operator notes;
- public proof-asset storage.

If Twilio requires extra identity or address evidence, the desired build is a separate A-ID secure evidence handoff:

- Twilio-managed flow where the exact compliance lane supports it;
- Compliance Embeddable only where the underlying compliance program is supported and account access is enabled;
- secure-admin route if needed;
- RightOnQ stores only inquiry IDs, document SIDs, status fields, timestamps, and rejection/exception reasons.

A-ID is not part of normal Part A. It should open only when Twilio/Trust Hub requests extra evidence, then return the applicant to the normal onboarding path once accepted or resolved. Do not assume RCS sender onboarding itself is Compliance Embeddable-supported, and do not hard-code Compliance Embeddable as the universal route for every Secondary Compliance Profile exception unless Twilio confirms support for RightOnQ's account/use case. For supported embeddable flows, persist inquiry/registration/document references and statuses only, not session tokens or raw document contents.

## Product Activation Handover

When a customer is approved and ready to use, onboarding should hand a controlled activation payload to the product.

Suggested fields:

```text
application_id
client_id
product_account_id
legal_business_name
trading_name
sender_display_name
primary_contact
twilio_subaccount_sid
twilio_messaging_service_sid
rbm_agent_id / rcs_sender_id
secondary_compliance_profile_sid
rc_bundle_sid
fallback_sender_id / fallback_phone_sid
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

The product must not infer RCS readiness from a subaccount or Messaging Service alone.

## Build Rules

1. Keep every provider-changing action behind an explicit gate.
2. Do not bundle RCS Sender submission, Trust Hub submission, callback configuration, sender-pool movement, phone-number movement, or message sending.
3. Do not store raw identity documents in the launch intake path.
4. Do not let onboarding become a second product backend.
5. Do not set production recipients to `preferred_channel='rcs'` until RCS sender approval, fallback setup, readiness proof, and product write gates are complete.
6. Keep payment, provider, product, and finance gates separate.
7. Prefer record-only proof before live writes.

## Next Correct Build Slices

### Slice A: Proof Video Script And Generator Hardening

Build the proof-video path around the official requirement:

- declared use case;
- opt-in route;
- outbound example;
- reply/action path;
- STOP/opt-out;
- no real customer data.

Output:

- local video draft;
- checklist of what the reviewer sees;
- clear status: draft, client review, approved, hosted.

### Slice B: Real Hosted Proof Pack

Replace placeholders with approved files:

- logo;
- banner;
- opt-in proof image;
- review/proof video.

Output:

- freshly verified asset dimensions/limits before upload;
- public Cloud Run proof-asset URLs;
- operator readback;
- `Review video status` and `Registration pack status` updated conservatively.

### Slice C: Part B Approval Flow

Make client approval explicit:

- name/logo phone preview;
- video review;
- changes requested;
- approval recorded;
- submission gate unlocked only after approval.

### Slice D: Trust Hub / Secondary Compliance Preflight

Collect/confirm:

- any extra representative records required by the separate compliance lane;
- operating regions;
- secure A-ID evidence route decision;
- Secondary Compliance Profile creation strategy.

### Slice E: Submission Preparation

Only after A-D:

- prepare RCS Sender submission pack;
- keep provider status `not_started` until explicit approval;
- do not bundle with callback configuration or message sending.

## Open Question: Day One Product Start

There is one known vacuum that belongs partly to the product lane:

After Google/Twilio approval, how does a customer start day one in the RightOnQ product?

Working answer:

- onboarding produces activation payload;
- product creates/enables customer account;
- product stores channel mode and provider IDs;
- product defaults safely, likely SMS-only or gated RCS until all write gates pass;
- operator/product UI handles real messages and event history.

This should become a joint product/onboarding design slice later. It is not required to finish the proof video and submission pack.

## Primary Source Anchors

Official external sources:

- Twilio RCS onboarding: `https://www.twilio.com/docs/rcs/onboarding`
- Google RCS launch approval: `https://developers.google.com/business-communications/rcs-business-messaging/guides/launch/launch-approval`
- Twilio Secondary Compliance Profiles: `https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles`
- Twilio Messaging Services: `https://www.twilio.com/docs/messaging/services`

Local source anchors:

- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
- `RCS_REGISTRATION_PACK_READINESS_MAP.md`
- `RCS_ONBOARDING_PRODUCT_BRIDGE_FOR_PROFESSOR.md`
- `RCS_TWILIO_4_HANDOVER_2026-05-12.md`
- `cloud-run/proof-assets/README.md`
- `cloud-run/twilio-callback/README.md`
- `../rightonq-system/docs/build_progress_tracker.md`
- `../rightonq-system/docs/OPEN_THREADS.md`

## Bottom Line

The architecture is sound if we hold the boundary.

The onboarding lane should now return to the centre of the RCS application path:

```text
proof pack -> review video -> client approval -> provider submission -> approval wait -> activation handover
```

The next real build is the proof-video and hosted proof-pack workflow, not deeper callback persistence.
