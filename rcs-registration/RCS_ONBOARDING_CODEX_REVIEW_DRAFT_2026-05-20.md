# RCS onboarding Codex review draft

> **REFERENCE / HISTORY (2026-05-28).** A point-in-time second-pair review brief from 2026-05-20, not current product truth. Live architecture: `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md`; current lane state is on `main` and in `RCS_TWILIO_4_HANDOVER_2026-05-12.md`.

Date: 2026-05-20

Status: draft for second-pair review. This is not a provider submission pack and not a request to perform live Twilio, Google, Trust Hub, callback, sender-pool, phone-number, or message-send actions.

## Purpose

This note is for Codex, Professor, MRBLUE, Uncle Six, or any build reviewer who needs to analyse the RCS onboarding lane without reconstructing it from chat.

The question is:

Are we building the right scaffold for RightOnQ RCS onboarding, and have we correctly separated onboarding/provisioning work from the live RightOnQ messaging product?

## Executive recap

The RCS onboarding lane is a provisioning and approval factory. It should collect and verify the material needed to register a client RCS sender, prepare the public proof pack, manage client approvals, track Twilio/Google/Trust Hub state, and then hand an approved sender into the main product.

It should not become a second live messaging product.

Current centre of gravity:

```text
Part A details
-> internal review
-> payment/order evidence
-> Twilio subaccount and Messaging Service proof
-> hosted proof assets
-> review/proof video
-> client Part B approval
-> provider/carrier submission
-> approval wait
-> activation handover to rightonq-system
```

The recent correction is important: the review video is approval evidence, not product runtime infrastructure. It is the `Use case video URL` / agent preview video required for review.

## What is already built or proved

In `/Users/macpro/rightonq-code.github.io/rcs-registration`:

- Static Part A intake and Part B storyboard/review flow exist in `index.html`.
- Google Apps Script / Sheet-backed tracking exists for Applications, Billing, Payment orders, Trust Hub KYC, UK RC bundles, Twilio setup, Status events, Communications, Internal reviews, Part B approvals, and Part B video approvals.
- Operator tools exist for status readback, payment order records, Twilio setup records, and Twilio subaccount linking.
- Header/order drift issues were fixed and proof-tested in prior slices.
- A proof Twilio subaccount was created and linked.
- A proof Twilio Messaging Service was created and linked.
- Cloud Run proof asset hosting was proved for placeholder logo, banner, opt-in proof image, and review video URLs.
- A dedicated Twilio callback Cloud Run receiver exists, but it is record-only/proof-only and is not configured on the proof Messaging Service.
- The current architecture scaffold is documented in:
  - `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md`
  - `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_PRODUCT_BRIDGE_FOR_PROFESSOR.md`
  - `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_REGISTRATION_PACK_READINESS_MAP.md`
  - `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`

## Where we drifted

After proving hosted proof asset URLs, the work moved toward a Twilio callback receiver.

That receiver was not wasted. It was a useful proof of signature validation and callback-shape handling. The risk is not the code itself; the risk is architectural ownership.

If onboarding keeps growing callback persistence, dedupe, delivery-state projection, and message-event truth, RightOnQ may end up with two competing product backends:

- onboarding repo / Cloud Run / Firestore style tracking;
- `rightonq-system` / Postgres / provider event journal / delivery projection.

That would be the wrong direction unless the core product team explicitly chooses it.

## What should be parked

Do not delete these items now. Park them as proof/staging infrastructure until the build team reviews the ownership boundary.

- Twilio callback receiver persistence/dedupe inside onboarding.
- Configuring the proof Messaging Service callback URL.
- Sender-pool movement.
- Phone-number movement.
- Live RCS message sending.
- RCS Sender submission.
- Secondary Compliance Profile / Trust Hub submission.
- Any automatic live Billing writes from provider/payment events.
- Any production callback/event store in onboarding.

The callback receiver should remain documented as proof-only unless the product team decides otherwise.

## What should not be deleted

Nothing obvious should be deleted at this stage.

The callback proof, proof asset host, Twilio subaccount proof, Messaging Service proof, and Sheet tracking all have value. They show the lane can safely reach provider-adjacent infrastructure. The better action is to label boundaries clearly and stop the next slices from drifting into runtime product ownership.

## Official requirements checked

Primary sources to re-open during review:

- Twilio RCS onboarding: https://www.twilio.com/docs/rcs/onboarding
- Google RCS launch approval: https://developers.google.com/business-communications/rcs-business-messaging/guides/launch/launch-approval

Current source reading:

- Twilio says RCS setup can take four to six weeks or longer for multiple regions.
- Twilio public sender details require public URL assets, including:
  - logo image: 224 x 224 px, max 50 KB;
  - banner image: 1140 x 448 px, max 200 KB;
  - privacy policy URL;
  - terms of service URL;
  - contact details.
- Twilio compliance registration requires authorised representative contact details, opt-in/opt-out descriptions, opt-in proof images at public URLs, use-case description, and a video showing the use case in action at a public URL.
- Twilio names this field `Use case video URL` and describes it as a public video showing core sender functionality and opt-out capabilities, for review purposes only.
- Google says launch approval requires agent information, testing, STOP/opt-out implementation, and an agent preview video / screen recording that matches the declared use case and clearly demonstrates STOP functionality.
- Google also asks for review access or public videos showing primary/secondary use cases, working links/actions, and opt-out capability.

Important local implication:

There is a live source discrepancy, not a simple local typo. Google/RBM documentation uses a 1440 x 448 banner/hero image. Twilio RCS onboarding documentation currently shows 1140 x 448. Isa Bell / Twilio Digital Sales later confirmed on 2026-05-20 that RightOnQ should keep a 1440 x 448 master internally and export a 1140 x 448 file for the actual Twilio sender-profile submission. The local form should keep collecting the 1440 x 448 master, and the submission pack should track the exact 1140 x 448 derivative/URL submitted through Twilio.

## User-provided Twilio evidence

Adam supplied a screenshot from Josh Lucañas at Twilio dated May 19, 2026, stating that once the RCS sender application is completed, RightOnQ can draft the client's video requirements, and Twilio will review it for compliance as a prerequisite for carrier approval.

This supports the correction above:

- the video belongs in the onboarding/provider approval lane;
- it is not the same thing as the runtime Messaging Service callback URL;
- the next central work should be proof-video/proof-pack readiness, not callback persistence.

## What to fill in next

### 1. Fix source-of-truth asset requirements

Update local docs and form validation/copy so the banner requirement shows the current source conflict:

```text
Google/RBM master: 1440 x 448 px, max 200 KB
Twilio RCS onboarding doc: 1140 x 448 px, max 200 KB
Action: keep master asset, prepare 1140 x 448 Twilio submission derivative
```

Check for unqualified `1440 x 448` or `1140 x 448` references in:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`
- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_REGISTRATION_PACK_READINESS_MAP.md`
- any operator/readiness docs that repeat dimensions.

### 2. Refocus on the proof-video workflow

The next real build should make the proof video path explicit and testable.

Minimum expected video content:

- sender display name and brand context;
- declared use case;
- opt-in/permission route;
- representative outbound RCS message;
- recipient interaction or response where relevant;
- STOP/opt-out route and the exact opt-out response;
- no real customer data;
- public hosted URL readback.

The existing browser video generator in `index.html` is a starting point. It should be reviewed against Twilio/Google requirements before being treated as submission-quality.

### 3. Replace placeholder hosted assets with approved files

Cloud Run proof asset hosting is proved, but current URLs point to placeholder proof files.

Before submission:

- approved logo file hosted and read back;
- approved banner file hosted and read back;
- approved opt-in proof image hosted and read back;
- approved review/proof video hosted and read back;
- tracking updated conservatively in `Twilio setup`;
- `Provider submission status` remains `not_started` until explicit submission approval.

### 4. Tighten Part B approval

Part B should explicitly cover:

- sender name/logo phone preview approval;
- review video approval;
- change request path;
- final submission approval gate.

The system already has Part B video approval storage. Review whether the current UI/Sheet/operator tooling clearly distinguishes:

```text
video generated
video hosted
video sent for client review
video approved by client
ready for provider submission
```

### 5. Define the activation handover contract

Onboarding should eventually hand an approved sender to `rightonq-system`.

Suggested handover payload:

```text
client_id
application_id
twilio_subaccount_sid
twilio_messaging_service_sid
rbm_sender_name
rbm_agent_id
approved_logo_url
approved_banner_url
approved_review_video_url
approved_use_case
approved_sample_messages
opt_in_description
opt_out_description
opt_out_response
country_carrier_scope
go_live_status
go_live_date
manual_pause_flag
billing_plan
usage_pull_status
```

This contract should be reviewed by the `rightonq-system` product build team before onboarding writes anything that looks like live message-event truth.

### 6. Secure identity/evidence route

The static public form and Google Sheet path must not collect or store raw passport, driving licence, government ID, proof-of-address, or similar documents.

If Twilio/Trust Hub requires identity or supporting evidence:

- prefer Twilio-managed embeddable / Compliance Embeddable only where the underlying compliance program is supported and account access is enabled;
- otherwise use a separate secure admin/manual route;
- store only provider IDs, inquiry IDs, document SIDs, statuses, timestamps, rejection codes, and notes;
- keep raw documents out of GitHub, chat, normal logs, and Google Sheets.

Latest Isa Bell / Twilio clarification: the Twilio-managed evidence handoff pattern is right for supported compliance programs, but RCS sender onboarding itself is not publicly confirmed as a Compliance Embeddable-supported flow. Treat RCS sender review, UK long-code Regulatory Compliance Bundle, and Secondary Compliance Profile as separate lanes until Twilio confirms account/use-case support for a shared embedded route.

## Questions for Codex / Professor / build reviewers

Please answer these in a strict read-only review first:

1. Is the architecture split correct: onboarding as provisioning/approval factory, `rightonq-system` as live messaging/event product?
2. Should production Twilio/RCS delivery and status callbacks terminate in `rightonq-system` rather than this onboarding repo?
3. Is the callback receiver correctly parked as proof/staging, or should it be removed from the onboarding path entirely?
4. Are the Twilio/Google video requirements accurately represented in the local docs and form?
5. Is the Google/RBM `1440 x 448` master plus possible Twilio `1140 x 448` derivative model correct, or should the source form collect a different master asset?
6. Does the existing browser video generator produce something that can become a submission-quality review video, or should the submission video be produced separately and only tracked/hosted by the onboarding lane?
7. What exact Part B statuses should exist between `video_ready_for_review`, `video_approved`, and `provider_submission_ready`?
8. What is the minimal activation handover contract `rightonq-system` needs on day one after approval?
9. What secure evidence route should be used if Trust Hub/Twilio requires passport/ID/supporting documents?
10. Is there any existing RightOnQ product blueprint that contradicts this onboarding architecture?

## Suggested review commands

Run these read-only from `/Users/macpro/rightonq-code.github.io`:

```bash
git status -sb
git log --oneline -12
rg -n "1440|1140|Use case video|agent preview|review video|callback|Provider submission status|activation handover" rcs-registration
rg -n "passport|driving licence|government ID|proof-of-address|document" rcs-registration
```

Then compare against:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md`
- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_PRODUCT_BRIDGE_FOR_PROFESSOR.md`
- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_REGISTRATION_PACK_READINESS_MAP.md`
- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
- `/Users/macpro/rightonq-system` product docs and provider/event model.

## Recommended next action

Do not resume callback persistence work yet.

First, perform a narrow cleanup and alignment slice:

1. Correct stale or overconfident banner-dimension assumptions.
2. Make the proof-video requirement explicit and consistent.
3. Update the readiness map so the next path is proof pack/video, not callback persistence.
4. Keep provider submission, compliance submission, callback configuration, phone movement, sender-pool movement, and message sending behind separate explicit gates.

After that, build the real proof-video/proof-pack workflow.
