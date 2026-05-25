# RightOnQ RCS Registration Pack Readiness Map

Status: current source of truth for registration-pack readiness, updated Monday 25 May 2026.

Scope:

- Map current Twilio RCS Sender and Secondary Compliance Profile requirements to the RightOnQ intake/tracking model.
- Identify what is already captured, what is tracked internally, and what still needs manual follow-up or build work before any submission.
- Keep RCS Sender submission, Trust Hub submission, callback configuration, sender-pool movement, phone-number movement, and message sending behind separate explicit gates.

No Twilio or Trust Hub action was performed for this map: no Twilio API call, no Google Sheet write, no Trust Hub submission, no RCS Sender creation, no message send. A Google Cloud proof-asset host was later deployed separately as `roq-rcs-proof-assets`; it serves approved public proof files from a private GCS bucket.

## Test Fixture Vs Real Client Readiness

The passing final-pack preflight on
`ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747` proves the hosted proof-pack
mechanism, not real-client readiness.

Current readiness distinction:

- Test-fixture proof pack: mechanism proved.
- Real-client proof pack: not started until client-approved logo, banner,
  opt-in proof, and review video assets exist and pass the same hosted URL
  checks.
- Provider submission, go-live, and usage pull: keep `not_started` until a
  separate explicit approval moves each gate.
- Banner submission size: interim/unresolved pending Twilio ticket `#26791676`;
  keep both the `1440 x 448` master and `1140 x 448` Twilio export paths alive
  until Twilio replies or RightOnQ records a deliberate decision.

This map supersedes the dated 2026-05-20 staging note for current readiness
status without rewriting that historical candidate snapshot.

## Source Anchors

Current public Twilio docs checked:

- `https://www.twilio.com/docs/rcs/onboarding`
- `https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles`
- `https://www.twilio.com/docs/rcs/send-an-rcs-message`
- `https://www.twilio.com/docs/messaging/services`

Local RightOnQ source checked:

- `index.html`
- `google-apps-script/Code.gs`
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
- `RCS_TWILIO_4_HANDOVER_2026-05-12.md`

## Status Legend

| Status | Meaning |
|---|---|
| Ready | Captured or tracked well enough for the current pilot model. |
| Tracked | Internal tracking field exists, but a real value still has to be supplied before submission. |
| Manual follow-up | Needs collection or confirmation outside the current public Part A form before submission. |
| Build gap | A workflow/tooling step is still missing before this can be treated as ready. |
| Hard stop | Must be complete before RCS Sender or compliance submission. |

## RCS Sender Public Profile

| Requirement | Current RightOnQ source | Status | Notes / next action |
|---|---|---|---|
| Sender display name | Part A `displayName`; `Twilio setup` `RBM sender name` | Ready | Collected and seeded into tracking. Client approves name/logo in Part B before submission. |
| Sender description | Part A `senderDescription` | Ready | Max 100 characters in the current form. Needs RightOnQ review for clarity before submission. |
| Logo image | Part A `logoUpload` validates PNG/JPEG, 224 x 224 px, max 50 KB | Build gap | Twilio requires a publicly accessible URL. Current form validates metadata and local preview only. Must host approved asset and store `RBM logo URL`. |
| Banner image | Part A `bannerUpload` validates PNG/JPEG, 1440 x 448 px Google/RBM master, max 200 KB | Build gap | Twilio requires a publicly accessible URL. Current interim stance is to keep a 1440 x 448 master internally and retain the 1140 x 448 Twilio export path, but the final Twilio submission size remains unresolved pending ticket `#26791676`. Host the approved submission derivative and store that exact submitted `RBM banner URL`; retain the 1440 master for reusable client packs and visual QA. |
| Brand/accent colour | Part A `brandColour` | Ready | Captured as hex. |
| Customer-facing email | Part A `customerEmail` | Ready | Needs internal review that it belongs to the brand where possible. |
| Customer-facing phone | Part A `customerPhone` | Ready | Needs internal review that it is reachable and brand-appropriate. |
| Customer-facing website | Part A `customerWebsite`; also `businessWebsite` | Ready | Internal review already has website/domain and public links checks. |
| Privacy policy URL | Part A `privacyPolicyUrl` | Ready | Internal review should confirm the page is live and relevant to messaging/data use. |
| Terms URL | Part A `termsUrl` | Ready | Internal review should confirm live/relevant page. |

## RCS Compliance Registration

| Requirement | Current RightOnQ source | Status | Notes / next action |
|---|---|---|---|
| Authorised representative contact details | Part A `authorizedRepName`, `authorizedRepEmail`, `authorizedRepTitle`; `primaryContactPhone` captured separately | Manual follow-up | Isa Bell / Twilio Digital Sales clarified on 2026-05-21 that branded RCS onboarding public docs show one authorised representative: first name, last name, email, business title, and business website URL. Confirm whether the primary phone is acceptable if Twilio asks for a phone. Do not treat a second representative as part of the branded RCS sender form. |
| Message flow / opt-in description | Part A `consentRoute`, `optInDescription` | Ready | Wording still needs RightOnQ quality review before submission. |
| Opt-out description | Part A `optOutDescription`; sample STOP message | Ready | Wording still needs RightOnQ quality review before submission. |
| Opt-in proof image / policy URL | `Twilio setup` `Opt-in proof URL(s)` | Hard stop / tracked | Isa Bell / Twilio Digital Sales clarified on 2026-05-21 that public docs accept a publicly accessible URL to a screenshot of the opt-in page, the webpage where the consumer opts in, or a document explaining the opt-in flow. No public dimensions, file type, max size, or image-count limit is published for this specific asset. RightOnQ's operating standard is one clear, full, legible, branded proof artifact at a public URL unless Twilio asks for more. Tracking and readback are live in operator API version 44. |
| Use-case description | Part A `useCaseDescription`, `messageTrigger`, `primaryUseCase` | Ready | Internal review should confirm the use case is specific and not vague. |
| Example messages | Part A `exampleMessageOne`, `exampleMessageTwo`, `helpSampleMessage`, `stopSampleMessage` | Ready | Internal review should confirm examples match use case and opt-out expectations. |
| Use-case review video URL | Part B video generator/story; `Twilio setup` `Review video URL` | Hard stop / tracked | A public hosted video URL is required before submission. Twilio Digital Sales confirmed on 2026-05-20 that the public docs do not publish a strict file type, max length, or live/test-sender capture requirement. Current system can generate a representative browser WebM showing permission route, primary/secondary messages, HELP, and STOP handling. Public URL route is proved through Cloud Run `roq-rcs-proof-assets`; real reviewed and approved video still needs upload/readback. |
| RCS launch countries | Part A `regions` | Ready for RCS launch planning | Do not confuse with Trust Hub operating regions. US fees and extra checks remain separate. |
| Provider submission reference/status | `Twilio setup` `Provider submission reference`, `Provider submission status`, submitted/checked timestamps | Tracked | Keep `not_started` until explicit submission approval. |

## Secondary Compliance Profile / Trust Hub

| Requirement | Current RightOnQ source | Status | Notes / next action |
|---|---|---|---|
| Approved primary business compliance profile | Parent account profile state, not proved by this map | Manual follow-up | Must be confirmed in Twilio before Secondary Profile creation/submission. Parent legal name should be `Continuity AI Ltd`. |
| Secondary Compliance Profile SID | `Trust Hub KYC` `Secondary compliance profile SID` | Tracked | Empty until created/resolved. |
| Business name and website | Part A `legalBusinessName`, `businessWebsite`; tracking profile friendly name | Ready | Must be exact legal entity for legal-name fields. |
| Business identity | `Trust Hub KYC` `Business identity`; current queue seeds `direct_customer` | Tracked | Needs deliberate value before real Secondary Profile submission, especially for ISV/end-client modelling. |
| Business type | Part A `companyType`; `Trust Hub KYC` `Business type` | Ready | UK company-type list exists. |
| Business industry | Part A `businessIndustry`; `Trust Hub KYC` `Business industry` | Ready | Needs internal review for closest fit. |
| Registration identifier and number | Part A `companiesHouseNumber`; `Trust Hub KYC` `Business registration identifier`, `Business registration number` | Ready | Current UK identifier is `UK:CRN`. |
| Operating regions | `Trust Hub KYC` `Business regions of operation` | Manual follow-up | Not the same as Part A RCS destination countries. Must collect/confirm separately. |
| Additional authorised representative records | `Trust Hub KYC` has rep 1 and rep 2 SID/status fields | Manual follow-up / policy-specific | Keep this separate from branded RCS sender submission. Public RCS docs currently show one authorised representative. If a separate Secondary Compliance Profile / Trust Hub lane is required, confirm the live Twilio policy/account requirement and collect any extra representative details in that lane, not as a normal Part A/RCS hard stop. |
| Physical address | Part A registered address fields; `Trust Hub KYC` `Address SID`, `Address validation status` | Tracked | Address text exists in Part A; Twilio Address SID creation/assignment remains a later provider step. |
| Supporting documents / A-ID evidence | `Trust Hub KYC` `Supporting document SID`, evidence fields | Manual follow-up / exception lane | ID/address evidence is exception-only and must not be part of normal Part A. If Twilio requests it, open a separate A-ID step. Safest design assumption from Isa Bell / Twilio Digital Sales on 2026-05-21 is Twilio-managed evidence collection where the exact lane supports it; do not standardise on RightOnQ manually storing passport, ID, or address documents. Use Compliance Embeddable only where the underlying compliance program is supported and account access is enabled; do not hard-code it as a universal Secondary Compliance Profile/RCS path. Store only Twilio IDs, inquiry/registration IDs, document SIDs, status, timestamps, and rejection/failure notes; do not store raw uploaded files. |
| Status callback notification | `Trust Hub KYC` `Trust Hub status callback configured` | Build gap | Callback receiver and callback URL configuration are not proved yet. |
| Evaluation/submission status | `Trust Hub KYC` evaluation and status fields | Tracked | Keep not-submitted until explicit compliance gate. |

## Messaging Service / Fallback Readiness

| Requirement | Current RightOnQ source | Status | Notes / next action |
|---|---|---|---|
| Customer subaccount | `Twilio setup` `Twilio subaccount SID`, friendly name | Ready for proof app | Proof subaccount exists and is linked. Terminal readbacks redact full Account SIDs. |
| Messaging Service | `Twilio setup` `Twilio messaging service SID` | Ready for proof app | Proof Messaging Service exists and is linked. Sender pool is intentionally empty. |
| RCS Sender in sender pool | Not yet created or attached | Hard stop | Do not create/attach until registration pack and compliance readiness are complete. |
| SMS/MMS fallback sender | UK RC bundle / sender-pool planning | Hard stop | Phone-number movement and fallback sender decisions must be a separate slice. |
| Callback URLs | Not configured on proof Messaging Service | Parked / go-live ownership gate | Dedicated Twilio callback receiver is deployed and signature-proved, but the proof Messaging Service callback URL is intentionally not configured. Isa Bell / Twilio Digital Sales clarified on 2026-05-21 that the RCS sender registration flow treats Status callback URL as optional, not required at submission. Treat callback configuration as go-live/runtime configuration and keep production callback ownership with the product decision. |
| Delivery/status callback parser | `cloud-run/twilio-callback` | Tracked | Dedicated form-encoded Twilio callback receiver is deployed and record-only. It validates signatures, tolerates extra fields, projects `MessageSid`/`MessageStatus`/`EventType`, and detects future read-receipt signals without writing read state. |

## Submission Gates

The following must be true before RCS Sender submission:

- `RBM logo URL` populated with an approved public asset URL.
- `RBM banner URL` populated with an approved public asset URL.
- Opt-in proof image URL or URLs collected and verified public.
- `Review video URL` populated with an approved public video URL.
- Part A public links, use case, examples, consent, and opt-out reviewed internally.
- Client Part B name/logo and video approvals recorded.
- `Provider submission status` still deliberately moved from `not_started` only at submission time.

The following must be true before Secondary Compliance Profile submission:

- Approved primary business compliance profile confirmed.
- Correct parent legal name is `Continuity AI Ltd`; RightOnQ used only as brand/trading name where fields allow it.
- End-client legal name, website, business type, industry, CRN, address, and operating regions confirmed.
- Extra representative records collected only where the separate Secondary Compliance Profile / Trust Hub lane actually requires them.
- Secure A-ID path chosen for any exception-only ID/address evidence requested by Twilio; Twilio-managed collection is preferred where supported, and Compliance Embeddable is used only for supported/enabled compliance programs, not assumed for RCS sender onboarding or every Secondary Compliance Profile exception.
- Trust Hub status callback strategy confirmed or deliberately deferred.

The following must be true before sender-pool/phone-number movement:

- RCS Sender approval or provider-approved test state confirmed.
- UK RC Bundle/fallback number readiness confirmed.
- Fallback number ownership and assignment plan approved.
- Product/onboarding callback ownership is decided, and the chosen production callback path has persistence/dedupe ready if moving toward live traffic.
- Billing/top-up/pause controls are ready if any chargeable traffic can occur.

## Recommended Next Slice

Use the proved hosted asset/proof URL workflow next for a real-client proof
pack, with `RCS_PROOF_VIDEO_WORKFLOW.md` as the video-specific guardrail and
the test-fixture distinction above kept visible, still without RCS Sender
submission:

1. Replace the current placeholder hosted proof files with approved client logo, banner, opt-in proof image, and review video files under the same `rcs-proof/` object paths.
2. Reconfirm each Cloud Run proof-assets URL opens without login.
3. Keep `Review video status` and `Registration pack status` out of submission-ready states until the real approved files are uploaded.
4. Keep `Provider submission status`, `Go-live status`, and `Usage pull status` at `not_started`.

Do not combine this with callback configuration, A-ID implementation, sender-pool movement, compliance submission, RCS Sender submission, or message sending.

Callback note: `roq-rcs-twilio-callback` is deployed and signature-proved, but it is parked as proof/staging infrastructure. Status callback URL is optional at sender submission time, so do not let callback configuration block the proof pack. Configure production callbacks later as a go-live/product-runtime step only after ownership and persistence/dedupe are confirmed.
