# RightOnQ RCS Registration Pack Readiness Map

Status: readiness map plus hosted proof-asset route, updated Tuesday 19 May 2026.

Scope:

- Map current Twilio RCS Sender and Secondary Compliance Profile requirements to the RightOnQ intake/tracking model.
- Identify what is already captured, what is tracked internally, and what still needs manual follow-up or build work before any submission.
- Keep RCS Sender submission, Trust Hub submission, callback configuration, sender-pool movement, phone-number movement, and message sending behind separate explicit gates.

No Twilio or Trust Hub action was performed for this map: no Twilio API call, no Google Sheet write, no Trust Hub submission, no RCS Sender creation, no message send. A Google Cloud proof-asset host was later deployed separately as `roq-rcs-proof-assets`; it serves approved public proof files from a private GCS bucket.

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
| Banner image | Part A `bannerUpload` validates PNG/JPEG, 1440 x 448 px Google/RBM master, max 200 KB | Build gap | Twilio requires a publicly accessible URL. Google/RBM public docs use 1440 x 448, while Twilio RCS onboarding docs currently show 1140 x 448. Keep the 1440 x 448 master in Part A, prepare a Twilio-specific derivative if Twilio confirms it, host the approved submission asset, and store the exact submitted `RBM banner URL`. |
| Brand/accent colour | Part A `brandColour` | Ready | Captured as hex. |
| Customer-facing email | Part A `customerEmail` | Ready | Needs internal review that it belongs to the brand where possible. |
| Customer-facing phone | Part A `customerPhone` | Ready | Needs internal review that it is reachable and brand-appropriate. |
| Customer-facing website | Part A `customerWebsite`; also `businessWebsite` | Ready | Internal review already has website/domain and public links checks. |
| Privacy policy URL | Part A `privacyPolicyUrl` | Ready | Internal review should confirm the page is live and relevant to messaging/data use. |
| Terms URL | Part A `termsUrl` | Ready | Internal review should confirm live/relevant page. |

## RCS Compliance Registration

| Requirement | Current RightOnQ source | Status | Notes / next action |
|---|---|---|---|
| Authorised representative contact details | Part A `authorizedRepName`, `authorizedRepEmail`, `authorizedRepTitle`; `primaryContactPhone` captured separately | Manual follow-up | Twilio RCS registration asks for authorised representative contact details. Confirm whether the primary phone is acceptable as the representative phone, and collect a distinct rep phone if Twilio asks for it. Secondary Compliance Profile readiness needs two reps. |
| Message flow / opt-in description | Part A `consentRoute`, `optInDescription` | Ready | Wording still needs RightOnQ quality review before submission. |
| Opt-out description | Part A `optOutDescription`; sample STOP message | Ready | Wording still needs RightOnQ quality review before submission. |
| Opt-in proof images | `Twilio setup` `Opt-in proof URL(s)` | Hard stop / tracked | Twilio requires opt-in policy images hosted on a publicly accessible URL. Tracking and readback are live in operator API version 44. Public URL route is proved through Cloud Run `roq-rcs-proof-assets`; real approved files still need upload/readback. |
| Use-case description | Part A `useCaseDescription`, `messageTrigger`, `primaryUseCase` | Ready | Internal review should confirm the use case is specific and not vague. |
| Example messages | Part A `exampleMessageOne`, `exampleMessageTwo`, `helpSampleMessage`, `stopSampleMessage` | Ready | Internal review should confirm examples match use case and opt-out expectations. |
| Use-case review video URL | Part B video generator/story; `Twilio setup` `Review video URL` | Hard stop / tracked | A public hosted video URL is required before submission. Current system can generate a draft browser WebM showing permission route, primary/secondary messages, HELP, and STOP handling. Public URL route is proved through Cloud Run `roq-rcs-proof-assets`; real reviewed and approved video still needs upload/readback. |
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
| Two authorised representatives | `Trust Hub KYC` has rep 1 and rep 2 SID/status fields | Hard stop / manual follow-up | Public Part A currently captures only one authorised representative. Rep 2 details must be collected before Secondary Profile submission. |
| Physical address | Part A registered address fields; `Trust Hub KYC` `Address SID`, `Address validation status` | Tracked | Address text exists in Part A; Twilio Address SID creation/assignment remains a later provider step. |
| Supporting documents / A-ID evidence | `Trust Hub KYC` `Supporting document SID`, evidence fields | Manual follow-up / exception lane | ID/address evidence is exception-only and must not be part of normal Part A. If Twilio requests it, open a separate A-ID step that routes the client into a secure Twilio-managed or approved secure-admin flow. Store only Twilio IDs, status, timestamps, and rejection notes. |
| Status callback notification | `Trust Hub KYC` `Trust Hub status callback configured` | Build gap | Callback receiver and callback URL configuration are not proved yet. |
| Evaluation/submission status | `Trust Hub KYC` evaluation and status fields | Tracked | Keep not-submitted until explicit compliance gate. |

## Messaging Service / Fallback Readiness

| Requirement | Current RightOnQ source | Status | Notes / next action |
|---|---|---|---|
| Customer subaccount | `Twilio setup` `Twilio subaccount SID`, friendly name | Ready for proof app | Proof subaccount exists and is linked. Terminal readbacks redact full Account SIDs. |
| Messaging Service | `Twilio setup` `Twilio messaging service SID` | Ready for proof app | Proof Messaging Service exists and is linked. Sender pool is intentionally empty. |
| RCS Sender in sender pool | Not yet created or attached | Hard stop | Do not create/attach until registration pack and compliance readiness are complete. |
| SMS/MMS fallback sender | UK RC bundle / sender-pool planning | Hard stop | Phone-number movement and fallback sender decisions must be a separate slice. |
| Callback URLs | Not configured on proof Messaging Service | Build gap | Dedicated Twilio callback receiver is deployed and signature-proved, but the proof Messaging Service callback URL is intentionally not configured yet. Configure only after record-only persistence/dedupe is proved. |
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
- Two authorised representative contact records collected.
- Secure A-ID path chosen for any exception-only ID/address evidence requested by Twilio.
- Trust Hub status callback strategy confirmed or deliberately deferred.

The following must be true before sender-pool/phone-number movement:

- RCS Sender approval or provider-approved test state confirmed.
- UK RC Bundle/fallback number readiness confirmed.
- Fallback number ownership and assignment plan approved.
- Callback receiver persistence/dedupe is ready if moving toward live traffic.
- Billing/top-up/pause controls are ready if any chargeable traffic can occur.

## Recommended Next Slice

Use the proved hosted asset/proof URL workflow next, still without RCS Sender submission:

1. Replace the current placeholder hosted proof files with approved client logo, banner, opt-in proof image, and review video files under the same `rcs-proof/` object paths.
2. Reconfirm each Cloud Run proof-assets URL opens without login.
3. Keep `Review video status` and `Registration pack status` out of submission-ready states until the real approved files are uploaded.
4. Keep `Provider submission status`, `Go-live status`, and `Usage pull status` at `not_started`.

Do not combine this with callback configuration, A-ID implementation, sender-pool movement, compliance submission, RCS Sender submission, or message sending.

Callback note: `roq-rcs-twilio-callback` is deployed and signature-proved, but it is parked as proof/staging infrastructure. Do not configure the proof Messaging Service callback URL until the product/onboarding callback ownership decision is confirmed and the relevant persistence/dedupe path is proved.
