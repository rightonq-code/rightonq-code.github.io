# RightOnQ RCS Onboarding Main Build Plan

Created: Thursday 14 May 2026
Creator: RCS-Twilio-4
Project: RightOnQ RCS client onboarding, registration, billing, and launch workflow
Repo: `/Users/macpro/rightonq-code.github.io`
Primary app file today: `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

## Purpose

This is the durable product build document for the RightOnQ RCS onboarding system.

Every successor agent working on the RCS onboarding/product flow should read and update this file as well as their own handover diary. The handover diary records agent-to-agent operational state. This file records the product plan, decisions, workflow, schemas, statuses, and implementation slices.

Keep this file practical and current. When the plan changes, update it here so future agents are not forced to reconstruct the product direction from chat history.

## Current Product View

The RCS registration form is not a standalone public form. It is one screen inside a wider client onboarding system.

### Legal Entity / Brand Naming

Important correction from Bugs on Saturday 16 May 2026:

- The operating UK limited company is `Continuity AI Ltd`.
- `Continuity AI Ltd` was registered at Companies House at the end of March 2026.
- `RightOnQ` is the trading name / product brand of `Continuity AI Ltd`.
- `RightOnQ` is going through trademark application; expected timing from Bugs is roughly 8-10 weeks from 16 May 2026 if no objection is raised.

Implementation rule:

- Use `Continuity AI Ltd` where the legal business/entity name is required.
- Use `RightOnQ` where the customer-facing product, brand, platform, or trading name is required.
- Do not treat `RightOnQ` as the legal business name in Twilio, Revolut, Trust Hub, RC Bundle, privacy, terms, or billing/compliance records.

The client is becoming a RightOnQ customer. The journey needs to cover:

- commercial acceptance;
- payment setup;
- Twilio Trust Hub / client KYC readiness;
- Twilio subaccount/runtime setup;
- RCS registration data capture;
- RightOnQ internal checks;
- phone name/logo preview;
- client approval;
- review video preparation and approval;
- provider/carrier submission;
- approved/live status;
- Twilio usage monitoring;
- prepaid credit/top-up control;
- ongoing RightOnQ service.

The product should feel smooth and clear for clients, but it must also protect RightOnQ from operational and financial risk.

Expected early volume is low, likely a few clients per week rather than dozens per day. Therefore, the first build can use manual internal controls where sensible, as long as the source of truth is structured and the customer experience is calm and professional.

## Current Preferred Commercial/Billing Direction

### Revolut-First Preference

Bugs prefers to use Revolut as much as practical because RightOnQ already banks with Revolut and keeping payment movement under one operational hood has advantages.

The current preferred direction is:

- Use Revolut-first for the pilot if sandbox testing confirms the flow.
- Treat Stripe Billing as the benchmark/fallback, not the automatic first choice.
- Use GoCardless later only if larger UK B2B clients strongly prefer Direct Debit.

### Revolut Role

Revolut should ideally handle:

- initial onboarding checkout/payment;
- payment method saving where supported;
- `£100 + VAT` registration handling fee payment;
- later post-approval monthly subscription payment;
- later prepaid usage credit/top-up payment;
- merchant-initiated top-up orders/charges where supported;
- reporting and reconciliation exports;
- webhook events back into RightOnQ's source of truth.

### RightOnQ-Owned Billing Logic

RightOnQ must still own the service and credit-control logic.

RightOnQ should maintain:

- customer/application ledger;
- prepaid usage credit balance;
- usage deductions;
- auto top-up threshold;
- payment failure state;
- service pause/suspension rules;
- manual override;
- internal notes and audit trail.

Do not rely on Revolut alone as the full SaaS billing brain until its sandbox and operational fit are proven.

### Current Commercial Model Decision

Bugs decided the customer journey should be simple and platform-led:

- no standalone "application only" product for now;
- every client pays a `£100 + VAT` RCS registration handling fee before RightOnQ starts the registration work;
- RightOnQ only accepts registered businesses / companies for this flow, not sole traders or unregistered businesses;
- the customer must confirm they are applying on behalf of a registered business and entering the arrangement for business purposes;
- the fee confirms the business is serious and covers application review, preparation, provider/compliance handling, administration, submission support, phone preview work, and registration follow-up;
- monthly platform fees start only once the RCS sender is approved and ready to use;
- if the RCS sender application is not approved for reasons outside the client's control, the `£100 + VAT` handling fee is refunded in full;
- the handling fee is not refundable once RightOnQ has started the registration handling work, except where the application cannot proceed for reasons outside the customer's control;
- the handling fee is not refundable if the application cannot proceed or is rejected because the business provided inaccurate information, failed required checks, did not complete requested actions, withdrew, or has business/compliance history that prevents approval.

Platform packages:

- `RightOnQ UK`: `£25/month + VAT`, plus messaging costs;
- `RightOnQ Global`: `£49/month + VAT`, plus messaging costs.

Customer-facing pricing principle:

- keep this simple;
- do not charge monthly subscription fees during the 4-6 week registration wait;
- do not offer a low-commitment registration-only path that attracts unsuitable clients.

Important risk rule:

- No client should get live Twilio-backed usage with unlimited postpaid exposure.
- Pause/suspend sending if top-up fails or prepaid usage credit is exhausted.

## Twilio Direction

Use one Twilio subaccount per customer/tenant.

Benefits:

- usage separation;
- credentials separation;
- reporting clarity;
- smaller operational blast radius;
- cleaner future automation.

Important caveat:

- Twilio subaccounts do not make the customer financially responsible to Twilio.
- Subaccount usage is still billed to the parent Twilio account.
- RightOnQ carries the Twilio exposure unless the internal ledger/top-up controls protect it.

RightOnQ should pull/query Twilio usage per subaccount and reconcile it against each client's prepaid balance and invoices/payments.

### Trust Hub / Secondary Compliance Profile Direction

Important discovery on Thursday 14 May 2026:

- Twilio subaccounts and Trust Hub compliance profiles are related but separate resource graphs.
- Subaccounts are runtime/account containers under Twilio `Accounts`.
- Trust Hub stores KYC/compliance profiles under `trusthub.twilio.com/v1`.
- For a RightOnQ-managed client such as `ABC Ltd`, the expected model is:
  - `Continuity AI Ltd`, trading as `RightOnQ`, primary compliance profile remains the approved parent profile;
  - each end-client gets its own Secondary Compliance Profile / Secondary Customer Profile;
  - phone numbers and other channel resources are linked to that compliance profile by assignment resources.
- Treat this as a third onboarding track beside commercial/payment and RCS sender registration.

Updated design assumption after Isa Bell/Twilio follow-up:

- Because Secondary Compliance Profile creation is part of the default RightOnQ onboarding lane, design the canonical intake model for two authorised representatives from the start.
- The first representative remains the primary operational contact/sign-off person.
- The second representative is required for the Secondary Compliance Profile lane, even if the UK RC Bundle lane alone may not independently require two reps.
- If Bugs chooses a lighter first public form, rep 2 can be collected as a follow-up/manual step, but the state model should not treat rep 2 as optional once Secondary Compliance Profile submission is in scope.
- Each representative record, where collected, should support:
  - first name;
  - last name;
  - business/work email;
  - phone number;
  - business title;
  - job position.

Do not collect date of birth, passport, driving licence, government ID, or proof-of-address documents in the launch intake unless Twilio's live flow explicitly requires it. Twilio asks for extra identity evidence if it cannot digitally verify the representative or their association with the business. If that happens, route evidence through a Twilio-managed compliance step where that lane is embeddable-supported, or through a secure manual/admin process, not the current static form and Google Sheet path.

Compliance Embeddable design boundary from Isa/Twilio follow-up:

- UK long-code Regulatory Compliance Bundles are explicitly within Compliance Embeddable scope.
- Follow-up confirmation on Saturday 16 May 2026: this is supported at product-scope level, but not self-serve/default on every account. RightOnQ must complete the Compliance Embeddable access/registration step before building a live UX around it.
- The published ISV pattern also assumes an approved primary business compliance profile with business identity set to ISV/Reseller. This should be the legal `Continuity AI Ltd` profile, with `RightOnQ` as trading/product brand where relevant.
- Generic Trust Hub Secondary Compliance Profile support through Compliance Embeddable is not clearly confirmed by public docs; public docs explicitly list Secondary Customer Profiles for Voice Trust, which is narrower.
- Therefore, treat UK RC Bundle evidence/resubmission as the likely embeddable/self-service lane, but keep Secondary Compliance Profile creation/resubmission RightOnQ/API/Console-managed unless Twilio confirms account/use-case enablement.
- Compliance Embeddable is white-label and does not require the end client to have a Twilio login.
- Compliance Embeddable session tokens are ephemeral; persist `inquiry_id` and `registration_id`, not the session token.
- Twilio's Compliance Embeddable FAQ says data for this product is stored in the US; keep that visible for privacy review.

The field-authority principle is:

- when RCS and Trust Hub ask for overlapping data, RightOnQ should ask the stricter/more precise version once;
- the canonical RightOnQ answer then feeds both the RCS sender registration and Twilio Trust Hub/KYC workflow.

Useful official references checked:

- Twilio Secondary Compliance Profiles: `https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles`
- Twilio Trust Hub overview: `https://www.twilio.com/docs/trust-hub`
- Twilio API: Create a Secondary Customer Profile: `https://www.twilio.com/docs/trust-hub/trusthub-rest-api/api-create-secondary-customer-profile`
- Twilio UK long-code KYC: `https://support.twilio.com/hc/en-us/articles/21038555454875-Know-Your-Customer-KYC-in-the-United-Kingdom`
- Twilio Compliance Embeddable FAQ: `https://help.twilio.com/articles/31769870199707-What-is-the-Compliance-Embeddable`
- Twilio Compliance Embeddable onboarding guide: `https://www.twilio.com/docs/messaging/compliance/toll-free/compliance-embeddable-onboarding`

### Isa Bell Email - Answer Received

Bugs emailed Isa Bell at Twilio on Thursday 14 May 2026 to confirm the build-critical KYC points.

The email asked, in practical terms:

- whether each UK limited-company client should have a Secondary Customer/Compliance Profile under the approved Primary Profile for `Continuity AI Ltd`, trading as `RightOnQ`;
- whether the UK long-code Regulatory Compliance Bundle is separate from, or fed by, the Secondary Customer/Compliance Profile;
- what identity evidence is normally required for the authorised representative of a UK limited company;
- whether RightOnQ can complete or trigger any passport/driving-licence verification through Twilio/Persona without storing copies of personal ID;
- whether one or two authorised representatives are required;
- whether larger/well-established UK limited companies can rely more on Companies House/company records, or whether individual identity verification is always required;
- how UK long-code SMS fallback numbers should be assigned when the number sits inside a RightOnQ-controlled Twilio subaccount.

Isa replied on Thursday 14 May 2026 with these build-impacting answers:

- RightOnQ's ISV model is correct:
  - `Continuity AI Ltd`, trading as `RightOnQ`, keeps the approved Primary Compliance Profile on the parent account;
  - each end-client UK limited company gets its own Secondary Compliance Profile when the brand/entity differs from `Continuity AI Ltd` or the `RightOnQ` brand;
  - Twilio docs now use `Compliance Profile` where older docs may say `Customer Profile`.
- The UK long-code Regulatory Compliance Bundle is separate from the Secondary Compliance Profile:
  - the data overlaps;
  - one does not replace the other;
  - UK long-code fallback numbers should be assigned to the RC Bundle representing the actual end business.
- Personal identity evidence is not a universal upfront intake requirement:
  - baseline UK business-bundle fields are business details, address, registration data, and authorised rep contact details;
  - government ID/passport is an exception path if Twilio cannot digitally verify the representative;
  - do not make passport or driving licence a mandatory upfront intake field.
- First-reply rep guidance was one required primary authorised representative plus optional second backup rep. This is now superseded for the default Secondary Profile lane by the later follow-up: collect/model two reps when Secondary Compliance Profile creation is in scope.
- If avoiding ID storage is important, design exception handling so the end customer enters/uploads evidence directly into a Twilio-managed compliance step or another secure approved route, not by emailing/uploading documents into the static app or Sheet.

Immediate build impact:

- this first reply moved the working assumption from `two reps likely required` to `one required, optional second`;
- Isa's later Compliance Embeddable / Secondary Profile follow-up supersedes that rep-count assumption for the default RightOnQ flow: collect/model two reps when Secondary Compliance Profile creation is part of onboarding;
- keep the current customer-facing form free of ID upload fields;
- keep KYC evidence as exception-only;
- treat Secondary Compliance Profile and UK RC Bundle as two separate operational checklist/status lanes, even though they share data.

### Isa Bell Follow-Up - Embeddable Scope and Rep Count Correction

Bugs later received a more specific Twilio/Isa follow-up about Compliance Embeddable scope, UK RC Bundles, Secondary Compliance Profiles, and representative count.

Build-impacting corrections:

- Compliance Embeddable can be used for Regulatory Compliance Bundles for Long Codes, so the UK long-code RC Bundle lane should be designed as the client self-service / Twilio-managed evidence path where account enablement is available.
- Latest Isa/Twilio follow-up confirms the build matrix as:
  - `UK long-code RC Bundle via Compliance Embeddable`: yes, supported in scope;
  - `Availability by default`: no, prior Compliance Embeddable access/registration is required;
  - `Secondary Compliance Profile via Compliance Embeddable`: do not assume; keep RightOnQ/API/Console-managed for now.
- Public docs do not clearly confirm generic Secondary Compliance Profile support in Compliance Embeddable. They explicitly mention Secondary Customer Profiles for Voice Trust, which is not the same as saying all Trust Hub secondary profile flows are embeddable-supported.
- Do not assume Secondary Compliance Profile evidence/resubmission uses the same embedded UX unless Twilio confirms it for RightOnQ's account/use case.
- Compliance Embeddable can appear inside RightOnQ without visible Twilio branding, but:
  - form content/copy/order is not customizable;
  - it renders in English only;
  - UI styling uses `ThemeSetId`;
  - access requires prior registration/enablement.
- The end client does not need Twilio Console access for an embeddable-supported flow; RightOnQ initializes server-side and embeds the returned inquiry/session flow.
- The session token expires after 24 hours. Persist `inquiry_id` and `registration_id`; regenerate session tokens as needed.
- Compliance Embeddable supports prefilling data from RightOnQ's canonical onboarding record.
- Compliance Embeddable FAQ says data for this product is stored in the US, so privacy wording/review should account for that.

Rep-count correction:

- Secondary Compliance Profile public guidance says to provide contact details for two authorised representatives.
- Because RightOnQ expects a Secondary Compliance Profile per end-client as the default compliance lane, the canonical state model should collect/support two representatives from the start.
- For a lighter first customer form, rep 2 may be collected as a follow-up/manual field before Secondary Profile submission, but the workflow should not treat it as optional once Secondary Profile submission is required.

State-machine / storage impact:

- Keep separate lanes:
  - `Secondary Compliance Profile`;
  - `UK RC Bundle`;
  - `RCS Sender approval`.
- Persist by lane:
  - Compliance Embeddable inquiry: `inquiry_id`, `registration_id`, latest status, rejection code/reason, callback/event history;
  - Secondary profile: `CustomerProfileSid` / secondary profile SID, profile status, rejection reasons, callback/webhook history;
  - UK RC Bundle: Bundle SID, bundle status, evaluation results where used, rejection reasons, callback history.
- Do not persist `inquiry_session_token` as a durable identifier.
- Store IDs/status/rejection reasons/callback history, not raw identity documents.

### AI Reply Verification Pass - 2026-05-16

Bugs asked for the Isa Bell / Twilio AI-assisted reply to be checked against official Twilio documentation.

Verification result: confirmed with nuance.

| Claim | Verification result | Implementation stance |
| --- | --- | --- |
| Compliance Embeddable supports Regulatory Compliance Bundles for Long Codes | Confirmed. Twilio's Compliance Embeddable FAQ lists `Regulatory Compliance Bundles for Long Codes`. | UK RC Bundle lane can target Compliance Embeddable once access is enabled. |
| Compliance Embeddable access requires prior registration | Confirmed. Twilio's onboarding guide says Compliance Embeddable API access requires prior registration. | Do not build a live UX assuming access is already available. |
| ISV flow expects ISV/Reseller primary profile | Confirmed in the Compliance Embeddable onboarding guide, with adjacent Trust Hub docs requiring approved primary profiles for registrations. | Ensure `Continuity AI Ltd`, trading as `RightOnQ`, has the correct primary profile / business identity ready before relying on the embeddable path. |
| Generic Secondary Compliance Profile embeddable support | Not confirmed by public docs. FAQ explicitly lists `Secondary Customer Profiles for Voice Trust`, not generic Trust Hub secondary profiles. | Keep Secondary Compliance Profile RightOnQ/API/Console-managed unless Twilio confirms account/use-case support. |
| Secondary Profile representative count | Confirmed with product-specific nuance. Generic API/policy docs include both `authorized_representative_1` and `authorized_representative_2`, while Voice Integrity docs can treat rep 2 as optional. | Canonical model supports two reps; still fetch/observe live policy requirements dynamically where possible. |
| End client does not need Twilio Console login for embeddable-supported flow | Supported by the self-service white-label embed model, but not found as a literal login statement. | Safe UX assumption for embeddable-supported lanes, but phrase as RightOnQ-hosted/Twilio-managed rather than promising Console details. |
| Prefill, callbacks, session token, data residency | Confirmed. Docs show prefill through initialize API, callbacks including `onReady`, `onInquirySubmitted`, `onComplete`, `onCancel`, `onError`, an ephemeral 24-hour session token, and US data storage. | Persist `inquiry_id` / `registration_id`, not session token; flag US storage for privacy review. |

Official references used:

- Twilio Compliance Embeddable FAQ: `https://help.twilio.com/articles/31769870199707-What-is-the-Compliance-Embeddable`
- Twilio Toll-Free Verification Compliance Embeddable Onboarding Guide: `https://www.twilio.com/docs/messaging/compliance/toll-free/compliance-embeddable-onboarding`
- Twilio Secondary Compliance Profiles: `https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles`
- Twilio API: Create a Secondary Customer Profile: `https://www.twilio.com/docs/trust-hub/trusthub-rest-api/api-create-secondary-customer-profile`
- Twilio Policies Resource: `https://www.twilio.com/docs/trust-hub/trusthub-rest-api/policies`
- Twilio Profiles: `https://www.twilio.com/docs/trust-hub/profiles`

Bottom line:

- The Isa/Twilio AI-assisted reply is reliable enough for current build direction.
- Remaining uncertainty is not architecture; it is account/program enablement and exact live policy requirements.

### Spawned Agent Research - Twilio KYC Docs

Bugs spawned research agents after Isa's reply and pasted the consolidated build impact on Thursday 14 May 2026.

The research supports the current architecture:

- `Continuity AI Ltd`, trading as `RightOnQ`, keeps the approved parent Primary Compliance Profile.
- Each end-client company gets its own Secondary Compliance Profile when the brand/entity differs from `Continuity AI Ltd` or the `RightOnQ` brand.
- If UK long-code SMS fallback is used, RightOnQ should build a separate UK Regulatory Compliance Bundle for the end business, then assign the UK number to that approved bundle.

Earlier intake fields from this research should now be read with the follow-up correction above:

- two authorised representatives where Secondary Compliance Profile submission is in scope, each with:
  - first name;
  - last name;
  - work email;
  - mobile number;
  - business title;
  - job position;
- UK business fields:
  - legal company name;
  - company registration number;
  - website;
  - address;
  - business classification;
  - subassignment flag;
  - optional comments;
- Twilio status tracking:
  - `draft`;
  - `pending_review`;
  - `in_review`;
  - `twilio_approved`;
  - `twilio_rejected`;
  - rejection/error reasons.

Identity evidence remains exception-only:

- `18019`: Twilio could not verify the authorised representative's identity; government ID or passport may be requested.
- `18020`: Twilio needs proof the representative is associated with the business.
- `18057`: digital validation of the authorised representative failed; may need a different representative or an explanation of the company/website connection.

Do not make passport or driving licence a normal upfront field.

RightOnQ document-storage stance:

- Use Twilio-managed compliance collection wherever available.
- Store Twilio IDs, statuses, and rejection reasons rather than raw ID documents.
- Do not promise universally that RightOnQ never touches evidence until Twilio confirms UK RC Bundle / Secondary Profile coverage for the relevant embeddable path.

Remaining uncertainties from the research:

- Whether UK RCS production onboarding consumes the same Trust Hub Secondary Compliance Profile cleanly, or adds separate carrier/RCS-specific checks.
- Whether RightOnQ's Twilio account has the required ISV/subaccount/embeddable capabilities enabled.
- Exact UK long-code purchase enforcement should be tested in the live account before final UX copy.

Research references supplied by the agents:

- Twilio Secondary Compliance Profiles: `https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles`
- Twilio API: Create a Secondary Customer Profile: `https://www.twilio.com/docs/trust-hub/trusthub-rest-api/api-create-secondary-customer-profile`
- Twilio Reading Regulations for the UK Bundle: `https://www.twilio.com/docs/phone-numbers/regulatory/reading-regulations-for-the-uk-bundle`
- Twilio KYC in the United Kingdom: `https://help.twilio.com/articles/21038555454875-Know-Your-Customer-KYC-in-the-United-Kingdom`
- Twilio Regulatory Compliance REST APIs: `https://www.twilio.com/docs/phone-numbers/regulatory/api`
- Twilio Compliance Embeddable onboarding: `https://www.twilio.com/docs/messaging/compliance/toll-free/compliance-embeddable-onboarding`
- Twilio Voice Integrity ISV/subaccount flow: `https://www.twilio.com/docs/voice/spam-monitoring-with-voiceintegrity/voice-integrity-onboarding/voiceintegrity-onboarding-in-the-twilio-console`
- Twilio errors `18019`, `18020`, and `18057`.

## Field Authority Map - Draft 1

Purpose: map each customer/intake field to the strictest downstream requirement so RightOnQ asks once, asks accurately, and does not store sensitive data in the wrong place.

| Field area | Current app state | RCS sender registration | Trust Hub / KYC | UK RC Bundle / long-code | Storage sensitivity | Current action |
| --- | --- | --- | --- | --- | --- | --- |
| Legal business name | Step 1 asks `Legal business name` | Needed | Needed | Likely needed | Normal business data | Keep; helper should say exact Companies House registered name. |
| Trading / brand name | Step 1 asks `Trading name`; Step 2 asks sender display name | Needed for brand/sender | May help explain brand vs legal entity | Not primary | Normal business data | Keep; ensure it does not replace legal name. |
| Companies House number | Step 1 asks `Companies House number` | Useful/needed | Needed as registration number | Likely needed | Normal business data | Keep; consider wording `Companies House company number (CRN)`. |
| Company type | Step 1 asks `Registered company type`; sole traders excluded | Useful | Needed | May be needed | Normal business data | Align options to Twilio-compatible limited-company language where possible. |
| Business industry | Step 1 asks `Business industry` | Needed for sender/use case | Needed | Possibly useful | Normal business data | Align options to Twilio/Twilio-RCS categories where practical. |
| Website URL | Step 1 asks website; Step 3 asks customer-facing website | Needed | Needed and likely checked against business/brand | Likely needed | Normal business data | Strengthen review rule: live site should clearly match legal/trading brand and not be ambiguous. |
| Registered address | Step 1 asks Companies House registered office address | Useful | Business address needed | Emergency/number compliance may need address | Normal business data unless proof files are added | Keep; add note later if Twilio needs physical operating address separate from registered office. |
| Business regions of operation | Current Step 7 asks RCS destination countries, not company operating regions | Launch market info | Needed by Trust Hub as operations regions | Not the same as recipient countries | Normal business data | Add later or collect internally; do not confuse with RCS launch markets. |
| Primary contact | Step 1 asks name/email/phone | Operational | Operational | Operational | Personal contact data | Keep. |
| Authorised representative 1 | Step 1 asks name/email/job title; auto-syncs from primary contact | Needed for sign-off | Required primary rep; phone and job position may also be needed | May be needed | Personal contact data | Expand to first/last/email/phone/business title/job position before Secondary Profile submission. |
| Authorised representative 2 | Not currently captured | Usually not needed for RCS | Required for Secondary Compliance Profile per latest Twilio/Isa follow-up | May not be independently required for UK RC Bundle alone | Personal contact data | Add to canonical intake/state model. If not in first public form, collect as follow-up/manual before Secondary Profile submission. |
| Passport / driving licence / proof of address | Not captured | Not needed for RCS form | Exception-only if Twilio cannot digitally verify rep/business association | Possibly separate KYC evidence | High sensitivity | Must not use static app/Google Sheet; use Twilio-managed compliance step or secure/manual route only. |
| Sender display name | Step 2 asks it | Needed | May relate to brand context | Not primary | Normal business data | Keep. |
| Logo, banner, brand colour | Step 2 asks uploads/colour | Needed | Not primary | Not primary | Brand assets | Keep in RCS form. |
| Public contact and policy links | Step 3 asks email, phone, website, privacy, terms | Needed | Website may overlap | May support compliance | Normal business data | Keep; review for brand ownership and live links. |
| Sender description and use case | Steps 4/5 ask purpose, description, examples | Needed and high review risk | Not primary | Not primary | Normal business data | Keep; RightOnQ should polish before submission. |
| Consent/opt-in/opt-out | Step 6 asks consent route, opt-in, opt-out | Needed and high review risk | Not primary | Not primary | Normal business data | Keep; RightOnQ should polish before submission. |
| RCS destination countries | Step 7 asks launch countries | Needed for RCS/cost planning | Different from Trust Hub operations regions | May influence number strategy | Normal business data | Keep; do not reuse as Trust Hub operations regions without review. |

Immediate audit from this map:

- The existing form is still a good RCS Part A base.
- Trust Hub adds a compliance layer, not a reason to throw the app away.
- The likely UI changes later are limited and focused:
  - sharpen legal name/CRN/company type/industry wording;
  - possibly add or internally collect business regions of operation;
  - expand authorised representative fields for both representatives;
  - add or manually collect representative 2 before Secondary Profile submission;
  - keep ID/passport evidence out of the static app.

## Field Change Shortlist - Draft 1

This shortlist translates the field authority map into practical build decisions. It should be reviewed with Bugs before editing the customer-facing form.

### Safe To Change Now

These changes are low-risk because they improve clarity for both RCS and KYC without adding sensitive data or changing the application structure.

1. Rename/help-text `Companies House number` to make clear this is the Companies House company number / CRN.
2. Strengthen website helper text so the client understands the site must clearly match the legal/trading brand.
3. Tighten `Registered company type` options to reflect the UK limited-company audience and remove any option that makes RightOnQ look open to unsuitable entities.
4. Add internal review wording that public email/domain should preferably belong to the business, not free webmail.
5. Add a short note near Step 1 or completion that RightOnQ may need further KYC evidence before SMS fallback/UK numbers can go live, without asking for that evidence in this form.

### Resolved By Isa Bell / Twilio Reply

These points now have a clearer working answer.

1. Secondary Profile submission should plan for two authorised representatives; if the first public form remains lighter, collect rep 2 later/manual before submission.
2. Passport/government ID should be exception-only, not mandatory upfront.
3. Secondary Compliance Profile and UK long-code RC Bundle should be treated as separate operational submissions/status lanes.
4. UK long-code numbers controlled by RightOnQ should still be assigned to the client/end-business compliance bundle/profile.

### Still Needs Later Design

1. Whether both representatives should be collected directly in the public form now, or whether rep 2 is a RightOnQ follow-up/manual field before Secondary Profile submission.
2. Whether Twilio needs physical operating address separate from Companies House registered office address.
3. Whether Trust Hub `business_regions_of_operation` should be asked on the client form, collected internally, or inferred/reviewed by RightOnQ.
4. Whether Twilio Compliance Embeddable becomes the preferred exception path for any ID/document collection.

### Manual / Secure Only

These must not be added to the current static app or Google Sheet submission path.

1. Passport upload.
2. Driving licence upload.
3. Representative proof-of-address upload.
4. Date of birth, unless Twilio explicitly requires it and Bugs approves a secure collection/storage design.
5. Any ID document link that could be opened by anyone with a sheet/file URL.

### Do Not Change Yet

These areas are already doing useful RCS work and should stay stable while the KYC answer is pending.

1. Step 2 brand profile assets and image validation.
2. Step 4/5 sender description, use case, and example message drafting.
3. Step 6 opt-in/opt-out wording.
4. Step 7 RCS launch markets. This is not the same thing as Trust Hub business regions of operation.
5. Part B name/logo and video approval storage.

### Likely Next Form Edit Pass

If Bugs approves a small no-regrets edit pass before Isa replies, the safest scope is:

1. CRN wording.
2. Website/domain matching wording.
3. Company type option cleanup.
4. KYC evidence notice with no upload field.
5. Internal docs/schema labels only, not new sensitive fields.

Status: approved by Bugs and implemented by RCS-Twilio-4 on Thursday 14 May 2026.

Implemented in `rcs-registration/index.html`:

- Step 1 now includes a calm UK KYC note explaining that RightOnQ may need extra business/identity evidence before UK SMS fallback numbers can go live, but no passport, driving licence, or proof-of-address documents should be uploaded in this form.
- Box 3 was renamed from `Companies House number` to `Companies House company number (CRN)`.
- Box 3 helper now says only UK Companies House registered businesses are accepted.
- Box 4 helper now says sole traders and unregistered businesses are not accepted.
- Box 4 options were tightened to Companies House limited-company style options:
  - `Private limited company (Ltd)`;
  - `Public limited company (PLC)`;
  - `Limited liability partnership (LLP)`;
  - `Community interest company (CIC)`;
  - `Company limited by guarantee`.
- Business website and customer-facing website helpers now say the live site should clearly match/belong to the legal or trading brand.
- Authorised representative email and customer-facing email helpers now steer away from personal/free webmail where the business has its own domain.

Still not changed:

- no representative 2 fields;
- no date of birth field;
- no passport/driving-licence/proof-of-address upload;
- no Trust Hub operations-region field;
- no Apps Script schema change for KYC-only data.

## Customer-Facing Journey

Target smooth journey:

1. Client expresses interest and is qualified by RightOnQ/outreach.
2. Client opens a RightOnQ registration gateway page or receives a guided link.
3. Client sees the commercial terms:
   - `£100 + VAT` RCS registration handling fee;
   - refund guarantee if the application is not approved for reasons outside the client's control;
   - no monthly platform fee until approved and ready to use;
   - RightOnQ UK at `£25/month + VAT` after approval;
   - RightOnQ Global at `£49/month + VAT` after approval;
   - messaging costs charged separately.
4. Client accepts service/payment terms.
5. Client pays the `£100 + VAT` registration handling fee, likely via Revolut.
6. RightOnQ creates/sends a private onboarding/application link.
7. Client completes the intake once, with fields accurate enough for both RCS sender registration and Twilio Trust Hub/KYC.
8. RightOnQ checks the intake.
9. RightOnQ starts or prepares the Twilio Trust Hub Secondary Compliance Profile track where required.
10. Client sees Part B storyboard/status.
11. RightOnQ sends RBM Tester invitation and branded phone preview.
12. B2 unlocks for name/logo approval.
13. Client approves name/logo or sends issue feedback.
14. RightOnQ fixes issues or proceeds.
15. RightOnQ prepares review video.
16. B3 unlocks for video review.
17. Client approves video or requests changes.
18. RightOnQ submits registration.
19. B4 shows submitted/tracking state.
20. Client is notified of provider/carrier outcome.
21. Once Trust Hub/KYC, RCS approval, and commercial controls are ready, usage is monitored and charged/top-up controlled.

## RightOnQ Internal Journey

Target internal flow:

1. Lead qualified.
2. Commercial offer agreed.
3. Revolut checkout/order/payment setup created.
4. `£100 + VAT` registration handling fee received.
5. Payment method saved where supported.
6. Post-approval subscription/base monthly entitlement recorded but not charged until approved and ready to use.
7. Application record created with stable `application_id`.
8. Private application link issued.
9. Part A submitted.
10. Part A reviewed by RightOnQ.
11. Registration details corrected/normalised if needed.
12. Trust Hub/KYC readiness checked; Secondary Compliance Profile created/prepared if required.
13. Twilio runtime subaccount created/prepared.
14. Phone preview/test invitation sent.
15. Application status updated to unlock B2.
16. Name/logo approval received or issue raised.
17. If issue raised, stop video work until resolved.
18. Review video prepared.
19. Application status updated to unlock B3.
20. Video approval received or changes requested.
21. If approved, registration pack submitted.
22. Provider/carrier status tracked.
23. Trust Hub/KYC, RCS approval, billing, and live-service gates maintained.
24. Twilio usage monitored.
25. Revolut top-ups/payments reconciled.
26. Service paused if billing risk rules trigger.

## Outreach To Onboarding Handoff Contract

This is the formal plug between the outreach/CRM office and the RCS onboarding
product flow.

The outreach team must not hand a prospect to onboarding through an informal
chat note alone. The handoff needs a structured state that agents and later
automation can reliably detect.

### Formal Trigger

The CRM deal/status/tag trigger is:

`READY_FOR_ONBOARDING`

Meaning:

- the lead has been qualified by RightOnQ/outreach;
- the prospect has shown enough interest or agreement to start the onboarding
  process;
- RightOnQ is ready to create an onboarding application record;
- the next owner is the onboarding/product flow, not further cold outreach.

Important distinction:

- `READY_FOR_ONBOARDING` means the lead is ready to enter the controlled
  onboarding path.
- It does not by itself mean commercial acceptance, billing setup, or provider
  registration approval is complete.
- Those remain separate onboarding statuses and must be confirmed before live
  Twilio-backed service or chargeable usage begins.

### Source Of Truth Split

Before customer acceptance:

- OpenClaw CRM is the source of truth.
- It owns company, contact, outreach history, campaign context, notes, tasks,
  and deal state.

After an onboarding application exists:

- the RCS onboarding sheet/app is the source of truth for registration,
  payment, provider, Twilio, approval, and live-service status.
- CRM keeps summary status, links, notes, and owner prompts.
- CRM must not become a messy duplicate of the full Part A/Part B application.

### Minimum Handoff Flow

1. Outreach qualifies the lead in OpenClaw CRM.
2. Roy/Kate/Scott marks the CRM deal/status/tag as `READY_FOR_ONBOARDING`.
3. Onboarding creates a stable `application_id`.
4. Onboarding writes the `application_id` back to the CRM record/deal.
5. From that point, onboarding owns registration/payment/provider truth.
6. CRM receives summary updates and next-owner prompts only.

### Minimum Handoff Fields

The handoff should include:

- `crm_company_id`
- `crm_deal_id`
- `company_name`
- `primary_contact_name`
- `primary_contact_email`
- `campaign_code`
- `message_code`
- `qualified_use_case`
- `package_interest`
- `handoff_date`
- `handoff_notes` or `sales_context`
- `application_id` once created
- `onboarding_status` once created
- `next_owner`

### Handoff Notes / Sales Context

`handoff_notes` or `sales_context` should explain why the prospect is moving
into onboarding. It should help the onboarding team understand:

- what the prospect appeared to care about;
- which problem or use case resonated;
- what RightOnQ has already said or promised;
- what tone to use next;
- any risks, caveats, or unresolved questions.

This field is deliberately human. It prevents the onboarding team from treating
every new application as if it arrived cold.

### Implementation Rule

For the pilot, this can be manual, but it must still be structured:

- CRM must show `READY_FOR_ONBOARDING` before onboarding starts.
- The onboarding application must store the CRM IDs or a reliable CRM reference.
- The CRM record must receive the `application_id` after creation.
- The status bridge should be easy for agents to read before it is automated.

## Status Model

Initial statuses to consider:

- `lead_qualified`
- `commercial_offer_sent`
- `commercial_accepted`
- `billing_setup_started`
- `billing_active`
- `usage_credit_paid`
- `application_created`
- `part_a_link_sent`
- `part_a_started`
- `part_a_submitted`
- `part_a_internal_review`
- `part_a_changes_needed`
- `part_a_accepted`
- `phone_preview_sent`
- `name_logo_approved`
- `name_logo_changes_requested`
- `video_preparing`
- `video_ready_for_review`
- `video_approved`
- `video_changes_requested`
- `registration_submitted`
- `provider_review`
- `provider_changes_requested`
- `approved`
- `rejected`
- `live`
- `paused_billing`
- `paused_operational`

Keep the first implementation smaller if needed, but do not lose these concepts.

## Source Of Truth Direction

For the pilot, a structured Google Sheet is acceptable if the schema is disciplined.

Likely tabs:

- `Applications`
- `Billing`
- `Part A`
- `Part B approvals`
- `Internal reviews`
- `Trust Hub KYC`
- `Twilio setup`
- `Communications`
- `Status log`

Potential later move:

- Keep the sheet as an operator-friendly dashboard.
- Move canonical storage into a database when the workflow needs stronger locking, tokens, admin UI, or real-time status control.

## Source Of Truth Schema - Draft 1

This is the first proposed Google Sheet schema for the pilot. It is intentionally operator-friendly and status-led.

Principles:

- Every client/application has one stable `application_id`.
- Customer-facing submissions are preserved.
- RightOnQ internal decisions/statuses are tracked separately from raw customer answers.
- Payment state and registration state are related but not the same thing.
- Client communications are logged so the client does not disappear into a black hole.
- For v1, manual RightOnQ updates are acceptable if they are explicit and timestamped.

### Tab: Applications

Purpose: one row per client application. This is the control row.

Primary writer:

- system on application creation;
- RightOnQ manually for statuses and internal notes.

Suggested columns:

- `application_id`
- `client_id`
- `crm_company_id`
- `crm_deal_id`
- `crm_source_record_url`
- `private_application_token`
- `client_name`
- `legal_business_name`
- `trading_name`
- `primary_contact_name`
- `primary_contact_email`
- `primary_contact_phone`
- `campaign_code`
- `message_code`
- `qualified_use_case`
- `package_interest`
- `handoff_date`
- `sales_context`
- `package_name`
- `registration_status`
- `billing_status`
- `part_a_status`
- `part_b_status`
- `twilio_status`
- `trust_hub_status`
- `provider_status`
- `internal_owner`
- `created_at`
- `updated_at`
- `last_client_action_at`
- `last_internal_action_at`
- `next_action_owner`
- `next_action_note`
- `internal_notes`

Initial statuses:

- `commercial_accepted`
- `billing_active`
- `application_created`
- `trust_hub_not_started`
- `trust_hub_draft`
- `trust_hub_pending_review`
- `trust_hub_approved`
- `trust_hub_rejected`
- `part_a_submitted`
- `part_a_internal_review`
- `part_a_accepted`
- `phone_preview_sent`
- `name_logo_approved`
- `video_ready_for_review`
- `video_approved`
- `registration_submitted`
- `provider_review`
- `approved`
- `live`
- `paused_billing`

### Tab: Billing

Purpose: commercial/payment state and usage-credit control.

Primary writer:

- Revolut webhook/API sync where possible;
- RightOnQ manually for pilot reconciliation;
- future automation for top-up and pause rules.

Suggested columns:

- `application_id`
- `client_id`
- `package_name`
- `monthly_base_fee_gbp`
- `registration_fee_gbp`
- `registration_fee_vat_gbp`
- `registration_fee_refund_status`
- `registration_fee_refund_reason`
- `initial_payment_due_gbp`
- `initial_payment_status`
- `initial_payment_revolut_order_id`
- `revolut_customer_id`
- `revolut_payment_method_id`
- `revolut_subscription_id`
- `subscription_status`
- `usage_credit_balance_gbp`
- `top_up_threshold_gbp`
- `top_up_amount_gbp`
- `auto_top_up_status`
- `last_top_up_attempt_at`
- `last_top_up_status`
- `last_payment_status`
- `billing_pause_flag`
- `billing_pause_reason`
- `billing_notes`
- `updated_at`

Starting assumptions to test:

- `package_name`: `RightOnQ UK` or `RightOnQ Global`
- `monthly_base_fee_gbp`: `25` for RightOnQ UK, `49` for RightOnQ Global
- `registration_fee_gbp`: `100`
- `registration_fee_vat_gbp`: calculate at current VAT rate
- `initial_payment_due_gbp`: `100 + VAT`
- `top_up_threshold_gbp`: to be agreed
- `top_up_amount_gbp`: to be agreed

### Tab: Part A

Purpose: the submitted registration data from the customer-facing Part A form.

Primary writer:

- current `rcs-registration/index.html` submission via Apps Script;
- later, updates should include `application_id`.

Suggested column groups:

- record metadata:
  - `application_id`
  - `submission_id`
  - `submitted_at`
  - `source_version`
  - `client_ip_or_user_agent_hash` if ever needed and privacy-approved
- business details:
  - `legal_business_name`
  - `trading_name`
  - `companies_house_number`
  - `company_type`
  - `registration_country`
  - `registered_address_line_1`
  - `registered_address_line_2`
  - `registered_city`
  - `registered_county`
  - `registered_postcode`
  - `business_website`
  - `business_industry`
- contacts:
  - `primary_contact_name`
  - `primary_contact_email`
  - `primary_contact_phone`
  - `authorised_rep_1_first_name`
  - `authorised_rep_1_last_name`
  - `authorised_rep_1_email`
  - `authorised_rep_1_phone`
  - `authorised_rep_1_business_title`
  - `authorised_rep_1_job_position`
  - `authorised_rep_2_first_name`
  - `authorised_rep_2_last_name`
  - `authorised_rep_2_email`
  - `authorised_rep_2_phone`
  - `authorised_rep_2_business_title`
  - `authorised_rep_2_job_position`
- brand profile:
  - `sender_display_name`
  - `brand_colour`
  - `logo_filename`
  - `logo_validation_status`
  - `banner_filename`
  - `banner_validation_status`
- public profile/contact:
  - `customer_email`
  - `customer_phone`
  - `customer_website`
  - `privacy_policy_url`
  - `terms_url`
  - `rightonq_updates_email`
- message purpose:
  - `primary_use_case`
  - `sender_description`
  - `monthly_volume`
  - `message_trigger`
  - `use_case_description`
- message examples:
  - `example_message_1`
  - `example_message_2`
  - `help_sample_message`
  - `stop_sample_message`
- consent/markets:
  - `consent_routes`
  - `consent_route_source`
  - `opt_in_description`
  - `opt_out_description`
  - `reviewer_access`
  - `launch_markets`
  - `us_contact_count`
  - `existing_us_messaging_activity`
- signoff:
  - `accuracy_declaration`
  - `agency_submission_declaration`
  - `signatory_name`
  - `signatory_title`
  - `iphone_preview_number`
  - `android_preview_number`
  - `signoff_date`

### Tab: Part B Approvals

Purpose: customer approvals/issues after Part A.

Primary writer:

- future B2/B3 forms;
- RightOnQ manually for pilot if needed.

Suggested columns:

- `application_id`
- `part_b_event_id`
- `event_type`
- `event_status`
- `submitted_at`
- `submitted_by_name`
- `submitted_by_email`
- `phone_preview_sent_at`
- `tester_invitation_received`
- `branded_message_received`
- `name_logo_decision`
- `name_logo_issue_categories`
- `name_logo_issue_notes`
- `name_logo_approved_at`
- `video_url`
- `video_sent_at`
- `video_decision`
- `video_checklist_sender_name`
- `video_checklist_logo_banner`
- `video_checklist_message_examples`
- `video_checklist_permission_route`
- `video_checklist_opt_out_route`
- `video_change_notes`
- `video_approved_at`
- `rightonq_follow_up_required`

Recommended `event_type` values:

- `name_logo_approval`
- `name_logo_issue`
- `video_approval`
- `video_change_request`

### Tab: Trust Hub KYC

Purpose: Twilio Trust Hub Secondary Compliance Profile / client KYC tracking.

This is separate from the Twilio runtime subaccount. The subaccount is for runtime resources and billing/usage separation. Trust Hub is the compliance/KYC record and should be tracked as its own lane.

Primary writer:

- RightOnQ manually for pilot;
- later automation using Twilio Trust Hub API.

Suggested columns:

- `application_id`
- `client_id`
- `primary_customer_profile_sid`
- `secondary_customer_profile_sid`
- `trust_hub_policy_sid`
- `trust_hub_profile_friendly_name`
- `trust_hub_status`
- `trust_hub_status_updated_at`
- `trust_hub_status_callback_configured`
- `trust_hub_rejection_reason`
- `trust_hub_error_code`
- `trust_hub_error_detail`
- `business_identity`
- `business_type`
- `business_industry`
- `business_registration_identifier`
- `business_registration_number`
- `business_regions_of_operation`
- `business_website_match_status`
- `address_sid`
- `address_validation_status`
- `supporting_document_sid`
- `business_info_end_user_sid`
- `authorised_rep_1_end_user_sid`
- `authorised_rep_2_end_user_sid`
- `authorised_rep_1_validation_status`
- `authorised_rep_2_validation_status`
- `authorised_rep_exception_code`
- `authorised_rep_exception_action`
- `primary_profile_assignment_status`
- `business_info_assignment_status`
- `rep_1_assignment_status`
- `rep_2_assignment_status`
- `address_assignment_status`
- `evaluation_status`
- `evaluation_last_run_at`
- `evaluation_error_summary`
- `channel_endpoint_assignment_status`
- `phone_number_sid`
- `kyc_internal_notes`
- `updated_at`

Recommended `trust_hub_status` values:

- `not_started`
- `draft`
- `evaluation_failed`
- `ready_to_submit`
- `pending_review`
- `in_review`
- `twilio_approved`
- `twilio_rejected`
- `not_required_rcs_only`

Recommended exception codes to track:

- `18019`: proof of identity required for authorised representative.
- `18020`: proof of authorised representative's association with business required.
- `18057`: authorised representative validation failed.

Launch privacy rule:

- Do not store representative date of birth, ID images, or proof-of-address files in the current static form / Google Sheet workflow unless Bugs explicitly approves a secure storage design.
- If Twilio requires sensitive representative evidence, prefer Twilio-managed compliance collection where available, or handle it as a secure manual follow-up/later backend-admin flow.

### Tab: UK RC Bundles

Purpose: UK long-code Regulatory Compliance Bundle tracking for SMS fallback numbers.

This is separate from the Secondary Compliance Profile. The Secondary Compliance Profile models/verifies the end-client business; the UK RC Bundle is the number-compliance approval for UK local, national, mobile, or toll-free long-code usage.

Primary writer:

- RightOnQ manually for pilot;
- later automation using Twilio Regulatory Compliance APIs.

Suggested columns:

- `application_id`
- `client_id`
- `compliance_embeddable_supported`
- `compliance_embeddable_inquiry_id`
- `compliance_embeddable_registration_id`
- `compliance_embeddable_status`
- `compliance_embeddable_rejection_code`
- `compliance_embeddable_rejection_reason`
- `compliance_embeddable_last_event`
- `compliance_embeddable_last_event_at`
- `rc_bundle_sid`
- `rc_bundle_status`
- `rc_bundle_status_updated_at`
- `rc_bundle_rejection_reason`
- `rc_bundle_error_code`
- `rc_bundle_error_detail`
- `end_business_legal_name`
- `business_registration_number`
- `number_type`
- `phone_number_sid`
- `phone_number`
- `phone_number_assignment_status`
- `address_sid`
- `supporting_document_sid`
- `compliance_owner`
- `fallback_required`
- `internal_notes`
- `updated_at`

Recommended `rc_bundle_status` values:

- `not_started`
- `draft`
- `pending_review`
- `in_review`
- `twilio_approved`
- `twilio_rejected`
- `not_required_unless_uk_long_code`

Launch note:

- UK long-code fallback numbers must be assigned to the end-business bundle before use.
- This tab stores Twilio IDs, statuses, and rejection reasons; it must not store raw ID documents.
- Compliance Embeddable session tokens expire and must not be stored as durable identifiers. Store `inquiry_id` and `registration_id`; regenerate a fresh session token when resuming an inquiry.

### Tab: Internal Reviews

Purpose: RightOnQ operator checklist for reviewing Part A before phone preview, Trust Hub/KYC work, or RCS submission moves forward.

Primary writer:

- system when Part A is received;
- RightOnQ manually for checklist status and notes during pilot.

Suggested columns:

- `created_at`
- `application_id`
- `review_status`
- `assigned_owner`
- `legal_company_check`
- `website_domain_check`
- `public_links_check`
- `message_purpose_examples_check`
- `consent_opt_out_check`
- `kyc_trust_hub_check`
- `sms_fallback_rc_bundle_check`
- `phone_preview_readiness`
- `next_action`
- `notes`
- `source_status`
- `updated_at`

Initial checklist state:

- `review_status`: `pending_review`
- `assigned_owner`: `RightOnQ`
- checklist items: `pending`
- `kyc_trust_hub_check`: `pending_trust_hub_review`

Implementation note:

- This checklist is internal only.
- It must not request or store passport, driving licence, proof-of-address files, or date of birth.
- Its job is to make the manual RightOnQ review visible and repeatable before the application moves forward.

### Tab: Twilio Setup

Purpose: internal runtime setup and provider/Twilio tracking.

Primary writer:

- RightOnQ manually for pilot;
- later automation can populate subaccount and usage fields.

Suggested columns:

- `application_id`
- `client_id`
- `twilio_subaccount_sid`
- `twilio_subaccount_friendly_name`
- `twilio_messaging_service_sid`
- `rbm_agent_id`
- `rbm_sender_name`
- `rbm_logo_url`
- `rbm_banner_url`
- `provider_submission_reference`
- `provider_submission_status`
- `provider_submitted_at`
- `provider_last_checked_at`
- `provider_notes`
- `phone_preview_status`
- `phone_preview_sent_at`
- `review_video_url`
- `review_video_status`
- `registration_pack_status`
- `go_live_status`
- `go_live_date`
- `manual_pause_flag`
- `manual_pause_reason`

### Tab: Status Log

Purpose: append-only audit trail. This should not be edited casually.

Primary writer:

- system for form/payment events;
- RightOnQ manually for important internal status changes.

Suggested columns:

- `event_id`
- `application_id`
- `event_at`
- `event_actor`
- `event_source`
- `previous_status`
- `new_status`
- `event_type`
- `event_summary`
- `event_payload_json`
- `internal_note`

Useful `event_source` values:

- `customer_form`
- `rightonq_manual`
- `revolut_webhook`
- `twilio_usage_sync`
- `provider_update`
- `system`

### Tab: Communications

Purpose: customer-facing email/message cadence and send log.

Primary writer:

- RightOnQ manually for pilot;
- later automation triggered by status changes.

Why this matters:

- Clients should receive clear safe-receipt and next-step messages.
- RightOnQ should know which emails were sent, when, and from which template.
- Later automation can be added without changing the core workflow.

Suggested columns:

- `communication_id`
- `application_id`
- `client_id`
- `recipient_name`
- `recipient_email`
- `communication_type`
- `trigger_status`
- `trigger_event_id`
- `subject`
- `template_version`
- `sent_at`
- `sent_by`
- `send_method`
- `delivery_status`
- `requires_reply`
- `reply_received_at`
- `next_follow_up_at`
- `notes`

Recommended `communication_type` values:

- `payment_received_onboarding_started`
- `application_link_sent`
- `part_a_received`
- `part_a_accepted_phone_preview_next`
- `phone_preview_sent`
- `name_logo_approved`
- `name_logo_issue_received`
- `video_ready`
- `video_approved`
- `registration_submitted`
- `provider_update`
- `action_needed`
- `approved_live`
- `billing_issue`
- `top_up_failed`
- `service_paused`

Minimum v1 triggered/manual email cadence:

1. Payment received / onboarding started:
   - confirm RightOnQ RCS onboarding has started;
   - explain the next step;
   - provide or promise the private application link.
2. Application link sent:
   - give the private Part A link;
   - explain what the client needs to complete.
3. Part A received:
   - safe receipt;
   - RightOnQ will check and process the written details.
4. Part A accepted / phone preview next:
   - written details are ready;
   - RightOnQ will send the RBM Tester invitation and branded phone preview.
5. Phone preview sent:
   - ask client to check phone;
   - accept RBM Tester invitation;
   - return to B2 to approve or raise an issue.
6. Name/logo approved:
   - confirm approval;
   - RightOnQ will prepare the review video.
7. Name/logo issue received:
   - safe receipt of issue;
   - RightOnQ will pause video preparation and review/fix.
8. Video ready:
   - ask client to review and approve video in Part B.
9. Video approved:
   - confirm approval;
   - RightOnQ will submit the registration pack.
10. Registration submitted:
    - confirm submission;
    - explain typical provider/carrier review timing.
11. Provider update / action needed:
    - use only when there is an update, question, rejection, or required client action.
12. Approved/live:
    - confirm approval/live status;
    - explain what happens with ongoing RightOnQ service, billing, and usage monitoring.
13. Billing issue / top-up failed / service paused:
    - clear but calm notice that payment/top-up needs attention before sending can continue.

### First Schema Decision Needed

Before implementation, decide whether Part A should:

1. keep appending full submissions to `Part A` and update the single control row in `Applications`; or
2. update one row only per application.

Recommendation for v1:

- Keep `Part A` append-only for audit/recovery.
- Keep `Applications` as the current control row.
- Use `Status Log` for every important state transition.

## Core Identifiers

Minimum identifiers to track:

- `application_id`
- `client_id`
- `client_name`
- `created_at`
- `updated_at`
- `registration_status`
- `billing_status`
- `revolut_customer_id`
- `revolut_order_id`
- `revolut_payment_method_id`
- `revolut_subscription_id`
- `usage_credit_balance`
- `last_payment_status`
- `twilio_subaccount_sid`
- `twilio_messaging_service_sid`
- `provider_submission_reference`
- `provider_status`
- `private_application_token`
- `internal_owner`
- `last_communication_at`
- `next_follow_up_at`

## Existing RCS Form Fit

Current app:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

Current shape:

- Part A is the customer data capture application.
- Part B is currently a static visible preview/workflow:
  - B1 storyboard;
  - B2 approve name and logo;
  - B3 review and approve video;
  - B4 registration submitted.

Known gap:

- Part B is not yet status-controlled or wired to persistent B2/B3 submissions.

## Build Slices

### Slice 1 - Main Build Plan

Create and maintain this file.

Status: started by RCS-Twilio-4 on Thursday 14 May 2026.

### Slice 2 - Source Of Truth Schema

Define the exact Google Sheet tabs and headers.

Status: draft 1 added by RCS-Twilio-4 on Thursday 14 May 2026.

Output:

- agreed sheet schema;
- field names;
- which fields are customer-facing vs internal;
- which fields are generated by system;
- which fields are manually updated by RightOnQ.

### Slice 3 - Application ID And Status In Part A

Add stable application identity to the current Part A flow.

Status: v1 implemented and tested by RCS-Twilio-4 on Thursday 14 May 2026.

Temporary v1 decision:

- Generate `application_id` inside the browser form for now.
- Persist it in autosave/progress/download/submission payloads.
- Use it to connect Part A submissions to the future `Applications` control row.
- Before launch, move `application_id` generation to a RightOnQ-created private link or server-side application record.

Implementation note:

- Apps Script must store `application_id`, `registration_status`, and `part_a_status`.
- The live Google Sheet headers must be updated before deploying/using the changed Apps Script, because these fields are inserted near the start of the append row.
- Header row update completed by RCS-Twilio-4 on Thursday 14 May 2026 for `Part A submissions!A1:AI1`.
- Apps Script project was pushed and existing live deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed in place to version `4`.
- Test POSTs wrote rows with `Application ID`, `Registration status`, and `Part A status` correctly populated. Two obvious test rows exist in the live sheet using `ROQ-RCS-TEST-SLICE3-20260514`.

Reason:

- Browser-generated ID is enough to start wiring the workflow spine.
- Private application links are still a later slice.
- This must not be treated as final launch architecture.

Output:

- `application_id`;
- `private_application_token` or equivalent;
- initial `registration_status`;
- Part A submission updates one application record or appends an event tied to application ID.

### Slice 4 - Internal Status Control

Give RightOnQ a manual way to update status for pilot use.

Status: first thin version implemented and tested by RCS-Twilio-4 on Thursday 14 May 2026.

Possible v1:

- Google Sheet status columns manually edited. This is the current pilot direction.
- App reads status by token/application ID. First version now reads by `applicationId`.
- RightOnQ manually sends the next link/state while private-link generation is still pending.

Implemented in first thin version:

- Apps Script `GET ?applicationId=...` returns the latest matching row's:
  - `registrationStatus`;
  - `partAStatus`;
  - `reviewStatus`;
  - `partBVideoStatus`;
  - `notes`;
  - `lastUpdated`.
- Existing live Apps Script deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` redeployed in place to version `5`.
- Static app accepts `?applicationId=...` or `?application_id=...`, stores it locally, and refreshes status from the live Apps Script endpoint.
- Part B rail displays the current status and marks B2/B3/B4 as waiting or available.
- B2/B3/B4 remain visible for planning, but the copy clearly says when each stage becomes live.

Test evidence:

- Live status lookup for `ROQ-RCS-TEST-SLICE3-20260514` returned `registrationStatus: part_a_submitted`.
- Local browser preview at `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE3-20260514` showed `Part A received` and kept B2 as `Waiting for test message`.

Important launch caveat:

- This is still not the final private-link architecture.
- Before launch, RightOnQ should create the application row/link before the client starts Part A, then send a private link containing a non-guessable token or equivalent.

### Slice 4A - Applications Control Row

Give each application a one-row internal control record, separate from the append-only Part A submission log.

Status: first thin version implemented and tested by RCS-Twilio-4 on Thursday 14 May 2026.

Implemented:

- Apps Script now creates the `Applications` tab if needed.
- Apps Script writes one row per `Application ID`.
- Part A submissions still append to `Part A submissions` for audit/recovery.
- The `Applications` row stores CRM handoff fields when supplied:
  - `CRM company ID`;
  - `CRM deal ID`;
  - `CRM source record URL`;
  - `Campaign code`;
  - `Message code`;
  - `Qualified use case`;
  - `Package interest`;
  - `Handoff date`;
  - `Sales context`.
- Status lookup now checks `Applications` first and falls back to `Part A submissions`.
- Existing live Apps Script deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` redeployed in place to version `6`.

Test evidence:

- Test submission `ROQ-RCS-TEST-SLICE5-20260514` wrote to both `Part A submissions` and `Applications`.
- `Applications` row included test CRM fields, package interest, handoff date, and sales context.
- Live status lookup for `ROQ-RCS-TEST-SLICE5-20260514` returned status data from the `Applications` shape, including billing/Part B/Twilio/provider status fields.

Important launch caveat:

- This still uses the browser/generated Application ID when the client starts from the public static page.
- The next launch-safe move is to create the `Applications` row first, generate a private token/link, then send that private link to the client.

### Slice 4B - Private Application Token Path

Prepare the launch-safe route where RightOnQ creates the application before the client starts Part A.

Status: guarded version implemented and proof-tested by RCS-Twilio-4 on Thursday 14 May 2026.

Implemented:

- Static app accepts private link parameters:
  - `applicationId` or `application_id`;
  - `applicationToken`, `privateApplicationToken`, `private_application_token`, or `token`.
- Static app stores the token locally for status checks and submission, but does not include it in the downloaded client copy.
- Status lookup can read by Application ID and token.
- If a token is supplied and does not match the `Applications` row, status lookup returns `found: false`.
- Part A submission into a token-protected `Applications` row now requires the matching private token.
- Apps Script has a guarded internal `action: createApplicationDraft` path.
- That action requires the script property `ONBOARDING_CREATE_PIN`, generates a private token, creates/updates the `Applications` row, and returns a private application link.
- Token-protected application status now requires the matching token. Application ID alone returns `found: false` for token-protected rows.
- Existing live Apps Script deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed in place to version `11` after proof cleanup.

Test evidence:

- Normal status lookup for `ROQ-RCS-TEST-SLICE5-20260514` still returned the expected application status.
- Status lookup for that Application ID with a wrong token returned `found: false`.
- Attempted `createApplicationDraft` without a configured PIN did not create a row in `Applications`.
- Temporary proof route created `ROQ-RCS-TEST-PIN-20260514173653`, returned a private link shape, submitted Part A against the same token-protected application, and confirmed:
  - draft status moved from `application_created`;
  - Part A status became `part_a_submitted`;
  - wrong token returned `found: false`.
- Temporary proof route/helper was removed before final deployment.
- Final live checks confirmed:
  - token-protected app without a token returns `found: false`;
  - token-protected app with a wrong token returns `found: false`;
  - older non-token test app still returns status by Application ID.

Important launch caveat:

- The proof used a temporary PIN and removed/restored the script property afterwards.
- `ONBOARDING_CREATE_PIN` is not stored in the repo and must be configured in Apps Script properties before ongoing internal draft creation can be used.
- A proper operator/admin interface is still future work. This is the guarded plumbing layer only.

### Slice 5 - Part B Unlocks

Make Part B stages reflect real application status.

Output:

- B1 visible after Part A;
- B2 unlocked after `phone_preview_sent`;
- B3 unlocked after `video_ready_for_review`;
- B4 visible after `registration_submitted`.

### Slice 6 - B2/B3 Submission Storage

Persist client approval/issue responses.

Status: B2 name/logo storage and B3 video approval/change storage implemented and proof-tested by RCS-Twilio-4 on Thursday 14 May 2026.

Checkpoint:

- Remote branch already includes the B2 checkpoint commits:
  - `062cee9 Wire B2 name logo approval storage`;
  - `0b04957 Update RCS handover after B2 storage`.
- Local B3 implementation checkpoint exists:
  - `9dd3206 Wire B3 video approval storage`.
- This final build-plan/handover update sits on top of the B3 implementation checkpoint.
- Bugs approved pushing the B3 checkpoint and this build-plan/handover update.

Output:

- B2 name/logo approval record - done via `Part B approvals`;
- B2 issue record with categories/notes - done via `Part B approvals`;
- B2 status updates based on response - done via `Applications`;
- B3 video approval record - done via `Part B video approvals`;
- B3 change request record - done via `Part B video approvals`;
- B3 status updates based on response - done via `Applications`.

Implemented:

- Static app B2 `Approve name and logo` now posts `action = submitNameLogoApproval`.
- Payload includes Application ID, private application token when present, tester invite answer, name/logo decision, issue categories, notes, and submitted timestamp.
- Apps Script appends each response to a new `Part B approvals` event-log tab.
- Apps Script updates the matching `Applications` row:
  - approval sets `registrationStatus` and `partBStatus` to `name_logo_approved`;
  - not-arrived/help/issue/note sets both to `name_logo_changes_requested`;
  - `Next action owner` becomes `RightOnQ`.
- Existing live Apps Script deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed in place to version `12`.
- Static app B3 `Review and approve video` now posts `action = submitVideoApproval`.
- Payload includes Application ID, private application token when present, approval checklist, change decision, change notes, and submitted timestamp.
- Apps Script appends each B3 response to a new `Part B video approvals` event-log tab.
- Apps Script updates the matching `Applications` row:
  - approval sets `registrationStatus` and `partBStatus` to `video_approved`;
  - change request sets both to `video_changes_requested`;
  - `Next action owner` becomes `RightOnQ`.
- Existing live Apps Script deployment was redeployed in place to version `13`.

Test evidence:

- Live test POST against `ROQ-RCS-TEST-SLICE5-20260514` returned `ok: true` and `name_logo_approved`.
- Live Sheet now has the `Part B approvals` tab with labelled B2 test approval rows.
- `Applications` row for `ROQ-RCS-TEST-SLICE5-20260514` now shows `Registration status = name_logo_approved`, `Part B status = name_logo_approved`, `Next action owner = RightOnQ`, and `Next action note = Prepare the RCS application review video.`
- Browser check on `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE5-20260514` showed B2 opening correctly, approval choices enabling the `Send approval to RightOnQ` button, status reading `Name and logo approved`, and no console errors.
- Live B3 test POST against `ROQ-RCS-TEST-SLICE5-20260514` returned `ok: true` and `video_approved`.
- Live Sheet now has the `Part B video approvals` tab with a labelled B3 test approval row.
- `Applications` row for `ROQ-RCS-TEST-SLICE5-20260514` now shows `Registration status = video_approved`, `Part B status = video_approved`, `Next action owner = RightOnQ`, and `Next action note = Submit the RCS registration pack.`
- Browser check on the same URL showed B3 opening correctly, the five approval checklist items enabling `Send approval to RightOnQ`, status reading `Video approved`, and no console errors.

Important caveat:

- Three duplicate labelled test rows exist in `Part B approvals` because Apps Script's redirect behaviour wrote during the first curl attempts. Leave them as proof rows unless Bugs approves cleanup.

Next:

- Push the local B3 commits to `origin/rcs-registration-part-a-b-20260507`.
- Next build slice should move to Slice 6A communications cadence or the manual internal status update/operator view.

### Slice 6A - Internal Status Operator Path

Give RightOnQ a guarded backend route for moving applications through the manual gates without editing the `Applications` row directly.

Status: guarded backend route implemented and deployed by RCS-Twilio-4 on Thursday 14 May 2026. Real operational use still needs `ONBOARDING_OPERATOR_PIN` configured or a wrapper built.

Implemented:

- Apps Script now supports `action = updateApplicationStatus`.
- The action requires script property `ONBOARDING_OPERATOR_PIN`.
- It can update selected `Applications` control-row fields:
  - `Registration status`;
  - `Billing status`;
  - `Part A status`;
  - `Part B status`;
  - `Twilio status`;
  - `Provider status`;
  - `Internal owner`;
  - `Next action owner`;
  - `Next action note`;
  - `Internal notes`.
- It writes `Updated at` and `Last internal action at`.
- Successful updates append an audit row to `Status events`.
- Audit JSON now redacts private application tokens, application tokens, create PINs, and operator PINs before storage.
- The browser status label list now recognises the full current backend registration status order, including internal review/change/provider/live/paused statuses.
- Existing live Apps Script deployment was redeployed in place to version `14`.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- Inline `index.html` script syntax passed via extracted script parse.
- `git diff --check` passed for scoped files.
- Live unauthorised `updateApplicationStatus` attempt against `ROQ-RCS-TEST-SLICE5-20260514` returned `ok: false` with `ONBOARDING_OPERATOR_PIN is not configured`.
- The same test application remained at `Registration status = video_approved` and `Part B status = video_approved`, proving the guard did not mutate the control row without the operator PIN.

Important caveat:

- This is not yet an operator UI.
- Positive live status-change proof is still pending until Bugs chooses how to configure `ONBOARDING_OPERATOR_PIN` or asks for a small internal wrapper.
- Recommended next activation step: configure the real operator PIN in Apps Script properties, or build an internal wrapper so agents do not handle the PIN manually.

### Slice 6B - Communications Cadence

Define and implement customer communication templates and triggers.

Status: first manual-send queue implemented and proof-tested by RCS-Twilio-4 on Thursday 14 May 2026.

Output:

- first email templates - partially done;
- trigger statuses - partially done;
- `Communications` tab write path - done;
- manual-send fallback for v1 - done;
- later automation plan.

Implemented:

- Apps Script now has a `Communications` manual-send queue tab.
- Future Part A submissions queue `part_a_received`.
- Future B2 name/logo responses queue:
  - `name_logo_approved_received`;
  - `name_logo_feedback_received`.
- Future B3 video responses queue:
  - `video_approved_received`;
  - `video_changes_received`.
- Future guarded internal status updates can queue:
  - `part_a_accepted`;
  - `phone_preview_sent`;
  - `video_ready_for_review`;
  - `registration_submitted`.
- Templates are stored as draft body text in the Sheet and marked `queued_manual_send`.
- No customer email is sent automatically yet.
- Existing live Apps Script deployment was redeployed in place to version `15`.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- `git diff --check` passed for scoped files.
- Live labelled Part A test submission `ROQ-RCS-TEST-COMMS-202605141832` returned `ok: true`.
- Live `Applications` tab now contains the labelled communications test row.
- Live `Communications` tab contains a queued `part_a_received` draft addressed to `test-comms@example.com`.

Important caveat:

- The live Part A proof also ran the existing Adam notification path.
- This is a queue, not an auto-send system.
- Next step should be either template wording review/polish or an internal send/review workflow, not immediate automatic customer email sending.

### Slice 6C - Trust Hub / KYC Field Authority Planning

Status: planning update added by RCS-Twilio-4 on Thursday 14 May 2026 after live Twilio Console/API discovery from Bugs and the assisting agent.

Purpose:

- avoid building the RCS intake as if RCS sender registration is the only approval track;
- map RightOnQ intake fields to the stricter of RCS sender registration and Twilio Trust Hub/KYC requirements;
- keep Trust Hub compliance profile work separate from Twilio subaccount/runtime setup.

Current field-authority decisions:

- Legal business name should be exact Companies House / registered name.
- Registration number should be captured as the Companies House CRN for UK Ltd clients.
- Business type, industry, regions of operation, website, registered address, and both authorised representatives should be shaped to satisfy Trust Hub first, then reused for RCS where possible.
- Build for two authorised representatives when Secondary Compliance Profile submission is in scope, following the later Isa/Twilio follow-up and current public Secondary Compliance Profile guidance.
- Do not collect date of birth in the launch intake unless Twilio's live flow explicitly requires it.

Implementation stance:

- First live version should stay manual: RightOnQ reviews intake, then enters/creates the Secondary Compliance Profile in Twilio Console or a guarded internal workflow.
- API automation should come after the manual process is proven and after the required fields are verified from Twilio's live policy/evaluation resources.
- Do not submit fake/test profiles to Twilio review. Keep test profiles clearly labelled draft-only.

### Slice 6D - Internal Review Checklist

Status: first thin implementation added by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- give RightOnQ an operator checklist when Part A lands;
- keep the manual review visible before phone preview, Trust Hub/KYC, or RCS submission work moves forward;
- avoid building a full admin UI before the workflow has settled.

Implemented:

- Apps Script now defines an `Internal reviews` tab.
- Future Part A submissions append one checklist row to `Internal reviews`.
- The checklist includes:
  - legal/company check;
  - website/domain check;
  - public links check;
  - message purpose/examples check;
  - consent/opt-out check;
  - KYC/Trust Hub check;
  - SMS fallback/RC bundle check;
  - phone preview readiness;
  - next action;
  - notes.
- `Applications` now has a `Trust Hub status` control field.
- Guarded internal status updates can now update `trustHubStatus`.
- Existing live Apps Script deployment was redeployed in place to version `16`.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- `git diff --check` passed for scoped files.
- Live labelled Part A test submission `ROQ-RCS-TEST-REVIEW-202605142008` returned `ok: true`.
- Live `Internal reviews` tab contains a pending checklist row for `ROQ-RCS-TEST-REVIEW-202605142008`.
- Live `Applications` tab contains `Trust Hub status = not_started` for `ROQ-RCS-TEST-REVIEW-202605142008`.
- Live status lookup for `ROQ-RCS-TEST-REVIEW-202605142008` returns `trustHubStatus: not_started`.

Important caveat:

- This is not a full operator dashboard.
- It is a sheet-backed internal checklist and status spine only.
- It does not request, upload, store, or link sensitive ID evidence.
- Two earlier labelled curl attempts displayed a Google Drive error page because the redirect was followed incorrectly, but they still reached the Apps Script backend and wrote test rows `ROQ-RCS-TEST-REVIEW-202605142006` and `ROQ-RCS-TEST-REVIEW-202605142007`. Leave them as obvious proof rows unless Bugs asks for cleanup.

### Slice 6E - Guarded Internal Review Update Action

Status: implemented and deployed by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- make the `Internal reviews` checklist actionable without manually editing every cell;
- keep the same operator-PIN guard used by internal status changes;
- allow RightOnQ to mark Part A accepted from the review workflow when the checklist is ready.

Implemented behaviour:

- Apps Script supports `action = updateInternalReview`.
- The action requires `ONBOARDING_OPERATOR_PIN`.
- It updates the latest `Internal reviews` row for the supplied `applicationId`, or creates one if missing.
- Accepted/checklist fields include:
  - `reviewStatus`;
  - `assignedOwner`;
  - `legalCompanyCheck`;
  - `websiteDomainCheck`;
  - `publicLinksCheck`;
  - `messagePurposeExamplesCheck`;
  - `consentOptOutCheck`;
  - `kycTrustHubCheck`;
  - `smsFallbackRcBundleCheck`;
  - `phonePreviewReadiness`;
  - `nextAction`;
  - `notes`;
  - `sourceStatus`.
- If `partAAccepted = true` or `reviewStatus = accepted`, it reuses the existing internal status path to set:
  - `registrationStatus = part_a_accepted`;
  - `partAStatus = part_a_accepted`;
  - `nextActionOwner = RightOnQ`;
  - `nextActionNote = Prepare the phone name and logo preview` unless supplied.
- Because it reuses the status path, the existing status-event and communications queue behaviour should still apply.

Important caveat:

- Positive live proof still depends on `ONBOARDING_OPERATOR_PIN` being configured or an internal wrapper being built.
- Safe live proof completed against version `17`: an unauthorised `updateInternalReview` call for `ROQ-RCS-TEST-REVIEW-202605142008` returned `ONBOARDING_OPERATOR_PIN is not configured`.
- Spreadsheet readback after that rejected call showed the `Internal reviews` row stayed `pending_review` and the `Applications` row stayed `part_a_submitted`, with `Trust Hub status = not_started`.

### Slice 6F - Local Operator Review Wrapper

Status: implemented by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- give RightOnQ a repeatable local command for updating `Internal reviews`;
- avoid hand-building curl payloads for every internal review;
- keep the operator PIN out of the public static app, repo, and Sheet audit JSON;
- create a small contract that can later be reused by a proper internal admin UI.

Implemented behaviour:

- repo-owned Node wrapper at `rcs-registration/tools/operator-review.mjs`;
- reads `RCS_ONBOARDING_OPERATOR_PIN` from the local environment;
- sends `action = updateInternalReview` to the deployed Apps Script endpoint;
- supports `--dry-run` so operators can inspect the payload without sending it;
- supports checklist fields and `--part-a-accepted` to trigger the guarded Part A acceptance path.

Verification:

- `node --check rcs-registration/tools/operator-review.mjs` passed.
- `--dry-run` printed the expected `updateInternalReview` payload without an operator PIN.
- Running without `RCS_ONBOARDING_OPERATOR_PIN` failed locally before sending.
- Running with a dummy local PIN reached Apps Script and returned `ONBOARDING_OPERATOR_PIN is not configured`.
- Spreadsheet readback after the dummy live attempt showed no mutation: the review row stayed `pending_review`, the application stayed `part_a_submitted`, and `Trust Hub status` stayed `not_started`.

Important caveat:

- The wrapper does not configure the Apps Script-side `ONBOARDING_OPERATOR_PIN`.
- Positive live proof still requires that script property to be configured.

### Slice 6G - Guarded Operator Snapshot Readback

Status: implemented and deployed by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- let RightOnQ inspect one application's operational state before and after an operator action;
- avoid relying on manual Sheet scanning for every review;
- keep the client-facing status endpoint limited and token-safe;
- give the future internal admin UI a clean readback contract.

Implemented behaviour:

- Apps Script supports guarded `action = getOperatorSnapshot`;
- the action requires `ONBOARDING_OPERATOR_PIN`;
- response includes a redacted application summary, latest internal review, recent status events, and queued communications;
- `Private application token` and raw `Submission JSON` are not returned in the operator snapshot;
- local wrapper at `rcs-registration/tools/operator-status.mjs` sends the guarded readback request using `RCS_ONBOARDING_OPERATOR_PIN`.

Verification:

- `Code.gs` syntax check passed.
- `node --check rcs-registration/tools/operator-status.mjs` passed.
- `operator-status.mjs --dry-run` printed the expected `getOperatorSnapshot` payload without an operator PIN.
- `git diff --check` passed for the scoped files.
- Apps Script version `18` was created and deployed to the existing web app deployment.
- A dummy live operator-status request reached Apps Script and returned `ONBOARDING_OPERATOR_PIN is not configured`.
- Spreadsheet readback after the dummy live attempt showed no mutation.

Important caveat:

- Positive live proof still requires the Apps Script-side `ONBOARDING_OPERATOR_PIN` script property to be configured.

### Slice 6H - Local Private Application Link Wrapper

Status: implemented by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- give RightOnQ a repeatable local command for turning a qualified CRM/outreach handoff into a private application link;
- avoid hand-building `createApplicationDraft` curl payloads;
- keep the create PIN out of the public static app, repo, and Sheet audit JSON;
- preserve the source-of-truth split: CRM qualifies the lead, onboarding creates the application record/link.

Implemented behaviour:

- repo-owned Node wrapper at `rcs-registration/tools/operator-create-application.mjs`;
- reads `RCS_ONBOARDING_CREATE_PIN` from the local environment;
- sends `action = createApplicationDraft` to the deployed Apps Script endpoint;
- supports CRM, company, contact, campaign, package, and handoff context fields;
- supports `--dry-run` so operators can inspect the payload without sending it;
- successful live runs return the private application link for that specific client/application.

Verification:

- `node --check rcs-registration/tools/operator-create-application.mjs` passed.
- `--dry-run` printed the expected `createApplicationDraft` payload without a create PIN.
- Running without `RCS_ONBOARDING_CREATE_PIN` failed locally before sending.
- Running with a dummy local create PIN reached Apps Script and returned `ONBOARDING_CREATE_PIN is not configured`.
- Spreadsheet readback after the dummy live attempt showed no new `ROQ-RCS-TEST-CREATE-WRAPPER-202605142032` row in `Applications`.

Important caveat:

- The wrapper does not configure the Apps Script-side `ONBOARDING_CREATE_PIN`.
- Positive live proof still requires that script property to be configured.

### Slice 6I - Isa Bell Reply Integration

Status: implemented and deployed by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- incorporate Isa Bell's Twilio reply into the source-of-truth build plan;
- remove stale `pending Isa` assumptions from future build decisions;
- align future internal checklist rows with the now-known KYC stance.

Implemented behaviour:

- update Trust Hub/RC Bundle assumptions:
  - Secondary Compliance Profile per UK limited-company end client;
  - UK long-code RC Bundle remains a separate number-compliance lane;
  - later follow-up now means two authorised representatives for Secondary Profile readiness;
  - ID evidence is exception-only, not upfront;
  - ID/document evidence must not enter the static app or Sheet path;
- change future `Internal reviews` KYC default from `pending_isa_reply` to `pending_trust_hub_review`.

Verification:

- `Code.gs` syntax check passed.
- `git diff --check` passed for the scoped files.
- Apps Script version `19` was created and deployed to the existing web app deployment.
- No live test submission was created for this small default-value change; existing `pending_isa_reply` test rows remain historical proof rows.

Important caveat:

- Existing test rows with `pending_isa_reply` are historical proof rows and do not need mutation unless Bugs asks for cleanup.

### Slice 6J - Internal Trust Hub / RC Bundle Tracking Rows

Status: implemented and deployed by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- move Trust Hub and UK RC Bundle tracking from planning-only into the internal Sheet/backend layer;
- keep KYC/number-compliance work separate from the public Part A form;
- make operator snapshots show the current Trust Hub and UK RC Bundle state for each application;
- avoid collecting or storing raw ID evidence.

Implemented behaviour:

- Apps Script defines internal `Trust Hub KYC` headers.
- Apps Script defines internal `UK RC bundles` headers.
- Future Part A submissions append one internal row to each tracking tab.
- Guarded operator snapshots include the latest Trust Hub KYC row and latest UK RC Bundle row.
- Future rows store IDs, statuses, exception codes, rejection summaries, and notes only.

Verification:

- `Code.gs` syntax check passed.
- `git diff --check` passed for the scoped files.
- Local mocked-Sheet proof confirmed `Trust Hub KYC` row length matches headers.
- Local mocked-Sheet proof confirmed `UK RC bundles` row length matches headers.
- Apps Script version `20` was created and deployed to the existing web app deployment.
- No live Part A submission was created for this tracking-structure slice, to avoid another Sheet/email proof row.

Important caveat:

- Existing applications/test rows will not be backfilled automatically.
- This slice does not call Twilio APIs or submit compliance profiles/bundles.
- This slice does not add sensitive ID upload fields.

### Slice 6K - Operator Tool Usage Notes

Status: implemented by RCS-Twilio-4 on Thursday 14 May 2026.

Purpose:

- make the local operator workflow usable without reading tool source code;
- give future agents/operators a clear safe order of operations;
- keep PIN handling and private-link handling explicit.

Implemented behaviour:

- add `rcs-registration/tools/README.md`;
- document all three local operator tools:
  - `operator-create-application.mjs`;
  - `operator-status.mjs`;
  - `operator-review.mjs`;
- include dry-run examples before live examples;
- explain local environment PIN variables without storing any real PIN;
- list expected results and common failure messages.

Verification:

- `operator-create-application.mjs` dry-run example produced the expected `createApplicationDraft` payload.
- `operator-status.mjs` dry-run example produced the expected `getOperatorSnapshot` payload.
- `operator-review.mjs` dry-run example produced the expected `updateInternalReview` payload.
- `git diff --check` passed for the scoped documentation files.

Important caveat:

- This is documentation only.
- It does not configure Apps Script PINs.

### Slice 6L - Positive Operator PIN Proof

Status: completed by Bugs and RCS-Twilio-4 on Thursday 14 May 2026 using Bugs' normal Mac Terminal.

Purpose:

- prove the real Apps Script-side `ONBOARDING_CREATE_PIN` and `ONBOARDING_OPERATOR_PIN` properties work;
- prove the local operator toolchain can create, read, approve, and read back an application without exposing PINs in chat/repo files;
- verify the status-event and communication-queue side effects of Part A acceptance.

What happened:

- Bugs set both Script Properties in Apps Script Project Settings:
  - `ONBOARDING_CREATE_PIN`;
  - `ONBOARDING_OPERATOR_PIN`.
- An initial long pasted command was mangled by Terminal and produced `Unknown option: --`; this was a paste issue, not a PIN or backend issue.
- A read-only terminal refresh then proved `operator-status.mjs` could use `ONBOARDING_OPERATOR_PIN` successfully.
- Bugs then ran `operator-review.mjs` successfully against the created test application.

Test application:

- `ROQ-RCS-TEST-POSITIVE-20260514211204`

Verified result:

- `operator-create-application.mjs` created the private application record:
  - `registrationStatus = application_created`;
  - `partAStatus = draft`;
  - private application link was present in the returned result but was not pasted into the docs.
- `operator-status.mjs` read the guarded operator snapshot successfully.
- `operator-review.mjs` accepted Part A:
  - `reviewStatus = accepted`;
  - `partAAccepted = true`;
  - `registrationStatus = part_a_accepted`;
  - `partAStatus = part_a_accepted`.
- Final operator snapshot showed:
  - `Applications` row moved to `part_a_accepted`;
  - `Next action owner = RightOnQ`;
  - `Next action note = Prepare the phone name and logo preview.`;
  - latest `Internal reviews` row had all supplied checks and `Phone preview readiness = ready`;
  - one `Status events` row was present for `internal_review_completed`;
  - one `Communications` row was queued with code `part_a_accepted`;
  - `Submission JSON` in the operator snapshot was redacted.

Expected limitation:

- `Trust Hub KYC` and `UK RC bundles` were empty for this test because it created a private application link but did not submit Part A through the public form. Those rows are created on Part A submission.

Security note:

- PINs were not committed or written to repo files.
- The final proof used Bugs' local Terminal environment variables, then unset them.

### Slice 6M - Public Part A Submission Proof

Goal:

- prove the customer-facing/public Part A submission path after Apps Script version `20`;
- confirm that a real Part A submission through a private application link creates the internal Trust Hub KYC and UK RC Bundle tracking rows.

Added helper:

- `rcs-registration/tools/proof-public-part-a-submit.mjs`

Helper behaviour:

- creates a private test application using the existing guarded `createApplicationDraft` action;
- extracts the private application token from the returned link without printing it;
- submits a complete Part A test payload through the normal public submission branch;
- reads the guarded operator snapshot;
- prints a redacted summary only.

Proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Proof result:

- private application creation returned:
  - `registrationStatus = application_created`;
  - `partAStatus = draft`;
  - private application link present.
- public Part A submission returned:
  - `ok = true`;
  - `submissionId = RCS-20260514-PUBLIC-PARTA-PROOF`;
  - `registrationStatus = part_a_submitted`;
  - `receivedAt = 2026-05-14T21:19:06.317Z`.
- operator snapshot confirmed:
  - `Applications.registrationStatus = part_a_submitted`;
  - `Applications.partAStatus = part_a_submitted`;
  - `Applications.Trust Hub status = not_started`;
  - latest `Internal reviews` row exists with `pending_review`;
  - latest `Trust Hub KYC` row exists with `Trust Hub status = not_started`;
  - latest `UK RC bundles` row exists with `RC bundle status = not_started`;
  - `UK RC bundles.Fallback required = to_be_confirmed`;
  - `UK RC bundles.Compliance owner = end_business`;
  - queued communication code includes `part_a_received`.

Security:

- PINs were entered by Bugs in local Terminal and unset after the proof.
- The helper does not print the private token, private application link, create PIN, or operator PIN.

Outcome:

- The previous evidence gap is closed.
- The next build slice can safely focus on guarded operator update actions for Trust Hub KYC and UK RC Bundle statuses.

### Slice 6N - Guarded Trust Hub / RC Bundle Operator Updates

Goal:

- let RightOnQ update internal Trust Hub KYC and UK RC Bundle tracking without direct Sheet edits;
- keep the public form free of identity-document collection;
- preserve audit/status-event evidence for manual operator changes.

Apps Script version:

- version `21`;
- deployed to existing web app deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6`.

Added guarded actions:

- `updateTrustHubKyc`;
- `updateUkRcBundle`.

Both actions:

- require `ONBOARDING_OPERATOR_PIN`;
- reject incorrect PINs;
- update the matching internal tracking row by `Application ID`;
- append/update status evidence without storing raw identity evidence.

Added local tools:

- `rcs-registration/tools/operator-trusthub-kyc.mjs`;
- `rcs-registration/tools/operator-rc-bundle.mjs`.

Live proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Security proof:

- an incorrect operator PIN was entered first;
- Trust Hub update, RC Bundle update, and status snapshot all returned `Invalid onboarding operator PIN`;
- the correct PIN was then entered and the proof succeeded.

Correct-PIN proof result:

- Trust Hub KYC update returned:
  - `trustHubStatus = pending_review`;
  - `secondaryComplianceProfileSid = BU_TEST_SECONDARY_PROFILE`;
  - `evaluationStatus = not_run`;
  - `updatedAt = 2026-05-15T07:24:16.476Z`.
- UK RC Bundle update returned:
  - `rcBundleStatus = pending_review`;
  - `fallbackRequired = yes`;
  - `updatedAt = 2026-05-15T07:24:23.739Z`.
- operator snapshot confirmed:
  - `Applications.Trust Hub status = pending_review`;
  - latest `Trust Hub KYC` row has `Trust Hub status = pending_review`;
  - latest `Trust Hub KYC` row has `Secondary compliance profile SID = BU_TEST_SECONDARY_PROFILE`;
  - latest `Trust Hub KYC` row has `Business website match status = pending_review`;
  - latest `Trust Hub KYC` row has `Evaluation status = not_run`;
  - latest `UK RC bundles` row has `RC bundle status = pending_review`;
  - latest `UK RC bundles` row has `Fallback required = yes`;
  - latest `UK RC bundles` row has `Compliance owner = end_business`;
  - `Status events` includes `trust_hub_kyc_updated`;
  - `Status events` includes `uk_rc_bundle_updated`;
  - `Submission JSON` remains redacted in operator snapshots.

Outcome:

- manual Trust Hub and RC Bundle status tracking is now available through guarded local tools;
- no client-facing ID collection was added;
- no raw identity documents, DOB, passport, driving licence, or proof-of-address fields were added to the public form or Sheet workflow.

### Slice 6O - Evidence Exception Tracking Fields

Goal:

- prepare for Twilio-managed evidence exceptions without adding ID uploads to the public form;
- keep RightOnQ's internal record aware of the evidence status;
- store only status/reference data.

Added to `Trust Hub KYC`:

- `Evidence collection mode`;
- `Evidence status`;
- `Evidence provider`;
- `Evidence inquiry ID`;
- `Evidence registration ID`;
- `Evidence requested at`;
- `Evidence submitted at`;
- `Evidence approved at`;
- `Evidence rejected at`;
- `Evidence rejection reason`.

Default for new Part A submissions:

- `Evidence collection mode = not_required`;
- `Evidence status = not_required`.

Supported update path:

- `operator-trusthub-kyc.mjs` can update the evidence fields through guarded `updateTrustHubKyc`.

Apps Script version:

- version `22`;
- deployed to existing web app deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6`.

Live proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Proof result:

- `operator-trusthub-kyc.mjs` returned `ok = true`;
- snapshot confirmed:
  - `Authorised rep exception code = 18019`;
  - `Authorised rep exception action = twilio_managed_evidence_required`;
  - `Evidence collection mode = twilio_managed`;
  - `Evidence status = requested`;
  - `Evidence provider = twilio_compliance_embeddable`;
  - `Evidence inquiry ID = inq_TEST_EVIDENCE`;
  - `Evidence registration ID = tri_TEST_EVIDENCE`;
  - `Evidence requested at = 2026-05-15T08:00:00Z`;
  - `KYC internal notes = Evidence exception proof only. No identity evidence stored.`

Boundary:

- no passport, driving licence, DOB, proof-of-address, government ID, or raw identity document field was added;
- the current design stores only Twilio/compliance IDs, status values, timestamps, rejection reasons, and operator notes.

### Slice 7 - Customer Commercial/Payment Entry Page

Design/build the onboarding page before the RCS form.

Status:

- started as `Slice 7A - Commercial gateway mechanics draft`;
- customer-facing plan/fee acknowledgement mechanics now exist in `rcs-registration/index.html`;
- `Slice 7B - Billing tracking sheet and operator tool` is complete;
- live payment/checkout is still not implemented.

Output:

- package explanation;
- `£100 + VAT` RCS registration handling fee wording;
- refund guarantee wording;
- post-approval plan wording for RightOnQ UK and RightOnQ Global;
- terms acceptance;
- Revolut checkout handoff;
- success route to private application link.

Current implemented gateway mechanics:

- customer chooses `RightOnQ UK` or `RightOnQ Global`;
- customer acknowledges the `£100 + VAT` registration handling fee and refund terms;
- `Complete Part A` is gated until plan choice and acknowledgement are complete;
- Part A payload carries:
  - `packageName`;
  - `packageInterest`;
  - `monthlyBaseFeeGbp`;
  - `registrationFeeGbp`;
  - `registrationFeeVatTreatment`;
  - `registrationFeeAcknowledgement`;
  - `billingStatus = registration_fee_pending`.

Remaining Slice 7 work:

- decide the final public wording and layout after mechanics are settled;
- create the real payment/checkout start point;
- mark payment as received before private Part A access;
- generate or reveal the private application link only after payment/manual payment confirmation;
- connect payment IDs/statuses into the application record;
- decide whether the static page remains the gateway or whether a separate checkout/start page should precede it.

Implemented billing tracking:

- new `Billing` sheet;
- new guarded Apps Script `action = updateBilling`;
- new local tool `rcs-registration/tools/operator-billing.mjs`;
- `getOperatorSnapshot` returns latest Billing row;
- `createApplicationDraft` queues default billing state;
- Part A submission queues/updates billing state;
- billing updates write `billing_updated` events and update `Applications.Billing status`;
- Apps Script version `24` is deployed to the existing web app deployment.

Billing fields currently track:

- registration fee amount/VAT treatment/acknowledgement;
- payment provider;
- provider customer ID;
- checkout/order ID;
- payment ID;
- payment method ID;
- payment status;
- payment received timestamp;
- refund status/reason/amount/timestamp;
- monthly plan;
- monthly base fee;
- monthly billing start date;
- next billing cycle date;
- usage/top-up status;
- internal notes.

Billing safety boundary:

- store provider references, statuses, timestamps, and notes only;
- never store card numbers, CVV, raw card data, bank credentials, or sensitive payment evidence.

Parked page polish:

- top-of-page journey storyboard;
- 4-6 week process reassurance;
- no monthly platform fee until approval and ready-to-use;
- month-end plan changes only;
- no pro-rata credits currently;
- desktop/laptop/tablet-first completion experience.

### Slice 8 - Revolut Sandbox Proof

Test Revolut flow before committing to implementation.

Status:

- started on 2026-05-15 after external read-only sanity check confirmed this is the highest-value next slice;
- `rcs-registration/REVOLUT_SANDBOX_PROOF.md` created as the proof runbook;
- `rcs-registration/tools/revolut-sandbox-proof.mjs` created as the local sandbox helper;
- no live Revolut secret has been stored in the repo;
- no live Revolut API call has been made yet.

Questions:

- Can RightOnQ create a customer/order/payment in sandbox?
- Can the payment method be saved for future merchant-initiated charge?
- Can the first payment be `£100 + VAT`?
- Can later top-up charge be initiated?
- What webhook events arrive?
- How are failed payments represented?
- What IDs should be stored?

Initial doc-backed findings:

- Hosted Checkout Page via API can create a backend order and return an `id` plus `checkout_url`.
- Sandbox API calls should use `https://sandbox-merchant.revolut.com/` instead of production endpoints.
- Subscriptions API supports plans/variations, hosted onboarding/setup orders, automatic charging of saved payment methods, lifecycle tracking, and billing-cycle history.
- Creating a subscription can produce a `setup_order_id`; retrieving that order gives the `checkout_url` for the hosted setup payment page.
- Saved payment methods are created as part of payment/setup flows, not manually by RightOnQ.
- Merchant-initiated later charges require a saved payment method ID/type and a new order/payment call.
- Webhooks support order lifecycle events such as `ORDER_AUTHORISED` and `ORDER_COMPLETED`, but event delivery order is not guaranteed; RightOnQ webhook handling must be idempotent.

Current proof helper:

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs --dry-run
```

When Bugs has a sandbox Merchant API secret, run it locally only through an environment variable:

```bash
export REVOLUT_MERCHANT_API_SECRET="sk_sandbox_..."
node rcs-registration/tools/revolut-sandbox-proof.mjs --create-registration-order
unset REVOLUT_MERCHANT_API_SECRET
```

Do not paste Revolut secrets into chat or commit them.

External sanity check note:

- Claude Code read the build plan and Twilio-4 handover in read-only mode.
- It agreed the three-lane split is right: commercial/payment, Trust Hub + UK RC Bundle, RCS sender registration.
- It warned that endpoint exposure and anonymous submission hardening must happen before public launch.
- It recommended `Slice 8 - Revolut Sandbox Proof` before further wording or Trust Hub field expansion.
- It recommended pausing more Trust Hub/RC field expansion until one real Twilio submission teaches the actual requirements.

Revolut proof refinement:

- prove both possible monthly billing paths:
  - Revolut Subscriptions API;
  - RightOnQ-owned monthly scheduler using merchant-initiated charges against a saved payment method;
- do not assume a Stripe-style subscription model until sandbox proves the fit;
- use `applicationId` as the Revolut reference where supported, so webhooks can route back to the application;
- prove `Idempotency-Key` behaviour before running repeated checkout/order tests;
- add full/partial refund proof before relying on the registration-fee refund promise;
- capture at least one failed/abandoned payment path;
- capture webhook signature verification details;
- keep public endpoint hardening ahead of website integration.

Updated local helper:

```bash
node rcs-registration/tools/revolut-sandbox-proof.mjs \
  --dry-run \
  --application-id ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901 \
  --idempotency-key proof-ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901
```

Slice 8 continuation after public/operator hardening:

- Revolut official docs were refreshed on 2026-05-15 before coding the next proof step.
- Confirmed Hosted Checkout API is server-side only because the Merchant API secret must not be exposed to frontend code.
- Confirmed `merchant_order_data.reference` is the create-order reference, while webhook callbacks expose the same business reference as `merchant_order_ext_ref`.
- Confirmed refunds are full/partial, require completed orders, and should use `Idempotency-Key`.
- Confirmed saved-method MIT charging needs a payment method saved for merchant use.
- Confirmed webhook callbacks include `Revolut-Request-Timestamp` and `Revolut-Signature`; the webhook signing secret must not be stored in the repo.
- Confirmed webhook signature verification uses `v1.{timestamp}.{raw payload}` with HMAC SHA-256 and a 5-minute timestamp tolerance.
- `revolut-sandbox-proof.mjs` now supports dry/live scaffolding for:
  - registration order creation;
  - order retrieval;
  - order listing by reference;
  - payment-list retrieval;
  - refund proof;
  - saved-method payment proof.
- `revolut-webhook-verify.mjs` now supports:
  - local fake-data self-test;
  - real captured sandbox payload verification via `REVOLUT_WEBHOOK_SIGNING_SECRET`;
  - multiple comma-separated `v1=` signatures during signing-secret rotation;
  - replay-window checks using the Revolut timestamp header.
- Post-review polish steers real webhook checks to `--payload-file`, adds a raw-payload mismatch hint, and records that any live webhook endpoint must enforce timestamp tolerance with no skip flag.
- `revolut-webhook-map.mjs` now maps verified Revolut order/payment webhook payloads into proposed `operator-billing.mjs --dry-run` updates without calling Apps Script or writing to the Sheet.
- Dry-run checks passed for create-order, refund, and saved-method payment payloads.
- Webhook verifier self-test passed for valid, tampered-payload, and stale-timestamp cases.
- Webhook mapper self-test passed for completed-payment and declined-payment cases.
- First live Revolut Merchant sandbox Hosted Checkout proof passed on 2026-05-16:
  - `GBP 120.00` order created for application `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
  - Hosted Checkout accepted a sandbox card payment;
  - final order state was `completed`;
  - final payment state was `captured`;
  - payment ID was `6a082633-a973-ac00-837c-e68c28186597`.
- Repeating create-order with the same `Idempotency-Key` created a second order. RightOnQ must enforce duplicate checkout protection in its own Billing lane before creating another Revolut order.
- List by `merchant_order_data_reference` works for reconciliation, but list responses did not include checkout URLs; store checkout URL/token at create time.
- The first payment-success redirect hit a RightOnQ 404 page after payment; this has since been addressed with a static payment-return page for future checkout tests.
- No production Revolut API call has been made yet. A sandbox webhook has now been registered/captured and dry-run mapped as recorded below, and a full sandbox refund has been created successfully.

Payment-side review follow-up:

- Claude Code read-only review found no Critical payment issues after the sandbox proof.
- It confirmed webhook proof is safe to continue as a sandbox/local dry-run activity.
- It also confirmed public payment-gate wiring is not safe yet.
- Highest-risk issue found: Apps Script `updateBilling` was injecting default fee/refund/usage/plan values into every billing update, which could reset refund or usage state during later webhook/operator updates.
- RCS-Twilio-4 fixed `updateBilling` so defaults are only applied when the caller did not provide the field and the existing Billing row is blank.
- Syntax check passed with `node --check --input-type=commonjs < rcs-registration/google-apps-script/Code.gs`.
- Remaining payment blockers before public gate:
  - keep the active-checkout guard in the create-order path before exposing customer checkout;
  - finish refund/refunded status and event mapping after capturing refund webhook event names;
  - build a real raw-body webhook endpoint with signature/timestamp verification, dedupe, and payment enrichment;
  - run a fresh sandbox checkout using the new payment-return URL and capture the real post-payment browser landing.

Webhook proof follow-up:

- Temporary Revolut sandbox webhook was registered on 2026-05-16.
- Revolut delivered real sandbox `ORDER_AUTHORISED` and `ORDER_COMPLETED` events for order `6a084d13-d84d-a49b-bb44-916bb9237ba4`.
- The `ORDER_COMPLETED` payload contained:
  - `event`;
  - `order_id`;
  - `merchant_order_ext_ref`.
- Signature verification confirmed `signatureMatched: true`.
- Timestamp verification failed only because the archived sample was verified after the 5-minute replay window. The future live endpoint must enforce that window.
- `revolut-webhook-map.mjs` mapped the real `ORDER_COMPLETED` event into a dry-run Billing update:
  - `registration_fee_paid`;
  - `paymentProvider = revolut`;
  - `paymentStatus = paid`;
  - `checkoutOrderId = 6a084d13-d84d-a49b-bb44-916bb9237ba4`.

Full refund proof follow-up:

- Official Revolut refund docs were refreshed again on 2026-05-16 before the live sandbox refund proof.
- `revolut-sandbox-proof.mjs` now sends refund references in the current documented request shape: `merchant_order_data.reference`.
- Full sandbox refund succeeded for return-page proof order `6a0866ef-9b11-a041-bfa2-e973e15e564d`.
- Refund response summary exposed refund order ID `6a0872b4-89b8-a82d-884b-703f6470c124`, `type = REFUND`, `state = PROCESSING`, and embedded refund payment ID `6a0872b4-395a-a536-8ca5-0ab9c27056af` with state `COMPLETED`.
- Immediate original-order retrieval returned `refundedAmount = 12000`, confirming the full `GBP 120.00` sandbox refund was associated with the paid order.
- Original order payment-list still returned the original captured payment only, so refund status should not be inferred from original payment-list retrieval alone.
- Refund webhook capture found a real sandbox event for the refund order:
  - webhook.site request ID `d6d383cf-8ea0-4ca1-ab9d-b4859ed7cd6b`;
  - raw payload `{"event":"ORDER_COMPLETED","order_id":"6a0872b4-89b8-a82d-884b-703f6470c124"}`;
  - no `merchant_order_ext_ref`, refund payment ID, or refund-specific body fields;
  - signature verification matched using the local webhook signing secret.
- `revolut-webhook-map.mjs` now treats recognised events with no `merchant_order_ext_ref` as `enrichmentRequired` rather than throwing or producing a Billing update.
- `revolut-webhook-map.mjs` can now accept an enriched refund order plus an application ID and classify the event as `refund_order`, producing a refund-status dry-run that does not overwrite the original checkout/order ID.
- Build implication: store refund order ID, refund payment ID where present, refund amount/currency, refund reference, and original order ID; refund webhooks must retrieve/enrich the order and resolve the application from RightOnQ's ledger/original-order lookup before automating Billing refund updates.
- The webhook payload did not include `payment_id`, so payment ID must be enriched from order/payment retrieval if needed.
- No live Billing row update has been made from the webhook proof.
- Replace the previous "capture a real sandbox webhook" blocker with:
  - build a real raw-body webhook endpoint;
  - verify signature and timestamp atomically;
  - dedupe events before writing;
  - optionally enrich payment ID/state from Revolut before updating Billing.

Active-checkout protection started:

- Claude Code read-only design review recommended an append-only `Payment orders` ledger as the source of truth, with Billing remaining a derived/operator summary.
- RCS-Twilio-4 added a `Payment orders` sheet model with guarded operator actions:
  - `checkActiveCheckout`;
  - `recordPaymentOrder`.
- `checkActiveCheckout` scans the latest non-superseded order snapshots for an application:
  - `completed` -> `already_paid`, do not create another checkout;
  - `creating` / `pending` / `processing` / `authorised` / `authorized` -> `reuse`, reuse the stored checkout URL;
  - no completed/open order -> `safe_to_create`.
- `recordPaymentOrder` appends a ledger snapshot containing Revolut order ID, state, amount, currency, checkout URL, merchant reference, idempotency key, payment ID/state, purpose, superseded flag, and notes.
- `lookupPaymentOrder` reads the latest ledger snapshot by Revolut order ID across the `Payment orders` ledger. This is the first local building block for resolving refund webhook application context.
- `getOperatorSnapshot` now includes `activeCheckout` plus recent `paymentOrders`.
- Local tool added: `rcs-registration/tools/operator-payment-order.mjs`.
- Webhook endpoint groundwork started:
  - `revolut-webhook-verify.mjs` exports the tested signature/timestamp verification primitives while preserving the CLI;
  - `revolut-webhook-map.mjs` exports the tested event mapping primitives while preserving the CLI;
  - `revolut-webhook-handler.mjs` proves the endpoint-core shape offline without live calls or writes;
  - future live webhook endpoint should import these instead of copying crypto/mapping logic;
  - endpoint host must support exact raw body and `Revolut-Request-Timestamp` / `Revolut-Signature` headers.
- Payment-order lookup is now deployed to a new clean API-only operator deployment after the Apps Script code push:
  - deployment ID `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9`;
  - version `35`;
  - description `Operator API executable (Step 8L lookup after push)`.
- `.clasp.json` now points operator wrappers at the clean v35 API-only deployment.
- Live lookup proof passed through v35:
  - lookup order ID `6a084d13-d84d-a49b-bb44-916bb9237ba4`;
  - returned `found = true`;
  - returned `applicationId = ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
  - returned latest ledger snapshot with `orderState = completed`, `paymentState = captured`, amount `12000 GBP`, and `orderPurpose = registration_fee`.
- Deployment cleanup after the v35 proof:
  - archived previous clean operator v34 `AKfycbwPbeT3Mxpmr_Q88WdSp0hRnDk96Pm93GDTsA1eOsJxmiaVpSS2xAg78ox848YsqCQU`;
  - archived previous clean operator v33 `AKfycbwSdO73nyxrOKVPQVQgkoGg29RwvYmJXWDYAgFqs5cdxyI4pJXFW3cZZSS1-6y3zlex`;
  - final Active Apps Script deployments are v35 clean Operator API executable, public web app v31, and the RCS Part A intake receiver.
- Apps Script HEAD was pushed and a clean API-only operator deployment now serves this slice:
  - deployment ID `AKfycbwSdO73nyxrOKVPQVQgkoGg29RwvYmJXWDYAgFqs5cdxyI4pJXFW3cZZSS1-6y3zlex`;
  - version `33`;
  - description `Operator API executable (Step 8H clean API-only)`;
  - access `Anyone within rightonq.co.uk`.
- The previous v32 active-checkout-guard operator deployment `AKfycbyG5yW-r0sfaKt1bwUUGFAHHdQoKK8wBCfR1riVxvYamu9YhfOBpRJhnRL_5iBP0VSC` was archived after it picked up a Web app entry point during deployment refresh.
- `.clasp.json` now points operator wrappers at the clean v33 API-only deployment.
- Live operator proof passed through the clean v33 API-only deployment:
  - first `checkActiveCheckout` returned `safe_to_create` and `canCreateCheckout = true`;
  - `recordPaymentOrder` appended completed sandbox order `6a084d13-d84d-a49b-bb44-916bb9237ba4`;
  - second `checkActiveCheckout` returned `already_paid` and `canCreateCheckout = false`;
  - stored checkout URL is present for the completed sandbox order;
  - no card data or Revolut secret was stored.
- Static payment-return page added:
  - path `rcs-registration/payment-return.html`;
  - future sandbox proof orders now default to `https://rightonq-code.github.io/rcs-registration/payment-return.html?applicationId=...`;
  - page clearly says browser return is not the authoritative payment verification source.
- Fresh sandbox checkout proved the return page:
  - application/reference `ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
  - order `6a0866ef-9b11-a041-bfa2-e973e15e564d`;
  - browser landed on `https://www.rightonq.co.uk/rcs-registration/payment-return.html?applicationId=ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
  - API retrieval confirmed order `completed` and payment `captured`;
  - no live Billing row update was made from this proof.
- This is still operator-run pilot protection, not the automated public payment gate.

### Slice 8B - Public Endpoint Hardening Started

Purpose:

- close the obvious public submission spam path before any website integration;
- reduce Adam MailApp notification abuse risk while keeping pilot notifications useful.

Implemented:

- public Part A submissions now require:
  - an existing `Applications` record;
  - a matching private application token;
  - `Part A status` of `draft` or `part_a_changes_needed`;
- unknown application IDs can no longer create fresh application/submission rows through the anonymous public submit branch;
- `PART_A_PAYMENT_GATE_MODE` script property can switch payment gating from advisory to strict;
- strict payment gate allows Part A only when `Applications.Billing status` is one of:
  - `registration_fee_paid`;
  - `registration_fee_manually_confirmed`;
  - `registration_fee_waived`;
- default mode remains advisory until Revolut/payment confirmation is wired end-to-end;
- Adam MailApp notifications are rate-limited per notification type to reduce inbox/quota abuse;
- `proof-public-part-a-submit.mjs` now starts by proving a fake public Part A submission is rejected before creating a valid private-link proof.

Deployment/proof:

- Apps Script version `25` deployed to the existing web app deployment;
- a live no-PIN fake public Part A submission was rejected with the private-link verification error, confirming unknown application IDs do not create rows.
- full valid private-link proof passed on 2026-05-15:
  - fake public submit rejected first;
  - private application created as `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
  - valid Part A submitted as `RCS-20260515-PUBLIC-PARTA-PROOF`;
  - snapshot confirmed `Billing`, `Internal reviews`, `Trust Hub KYC`, `UK RC bundles`, and queued `part_a_received` communication rows.

Still required before public website integration:

- split anonymous customer actions from operator actions, or move operator actions to a Google-authenticated/private deployment;
- wire real Revolut payment confirmation before setting `PART_A_PAYMENT_GATE_MODE = strict`;
- decide whether Adam notifications should become Communications-queue-only.

### Slice 8C - Operator/Public Split Foundation Started

Purpose:

- prepare the local tooling for separate public/customer and private/operator Apps Script deployments without breaking the current combined pilot deployment.

Action classification:

- public/customer actions:
  - anonymous Part A submission branch;
  - `submitNameLogoApproval`;
  - `submitVideoApproval`;
- operator/internal actions:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`.

Implemented locally:

- operator tools now prefer `RCS_ONBOARDING_OPERATOR_WEB_APP_URL`;
- public/customer proof uses `RCS_ONBOARDING_PUBLIC_WEB_APP_URL` for public submissions;
- `RCS_ONBOARDING_WEB_APP_URL` remains a compatibility fallback for the current combined deployment;
- no live deployment behaviour changed by this tooling-only slice.

Next implementation decision:

- choose whether the private operator path is:
  - a second Apps Script deployment with Google Workspace access restrictions if Apps Script deployment settings support the needed split cleanly; or
  - a separate Apps Script project for operator actions only, sharing the same Sheet but deployed as RightOnQ-only.

### Slice 8D - Authenticated Operator API Spike

Decision:

- a private/domain-only web app is not ideal for the terminal operator tools because Node fetch does not carry a browser Google login session;
- the better operator path is Apps Script API execution via authenticated `clasp run` / scripts.run, while the public web app remains anonymous for customer actions.

Implemented scaffold:

- added server-side `rcsOperatorAction(payload)`;
- it allows only operator/internal actions:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`;
- it does not route public customer actions;
- added `executionApi.access = DOMAIN` to the manifest.

Proof result:

- `clasp run rcsOperatorAction ...` does not yet run;
- `MYSELF` and `DOMAIN` execution API attempts both failed from the CLI with permission/API executable errors;
- temporary failed API deployments were deleted;
- current public web app deployment remains version `25`;
- `clasp apis` reports `GCP project ID is not set, unable to continue.`

Conclusion:

- this is blocked on associating the Apps Script project with a standard Google Cloud project and enabling the Apps Script API / Execution API requirements;
- do not weaken the operator API to `ANYONE`;
- keep the v25 public web app as-is until the authenticated operator API proof passes.

Update on 2026-05-15:

- standard Google Cloud project `rightonq-gog` / `RightOnQ-GOG` is now linked to the Apps Script project;
- Apps Script API is enabled on that project;
- API executable deployment was created as API-only:
  - deployment ID `AKfycbzogKHOijtu6kjp2MVrL9WcVuF6mWrgQyKUzQGRvpTfozdUSA9y_B6X_eWpQeQ-mWtS`;
  - original version `28`;
  - access `Anyone within rightonq.co.uk`;
- RCS-Twilio-4 found and fixed a missing server-side PIN check inside `rcsOperatorAction(payload)`;
- the same API executable deployment was redeployed as version `29` with description `Operator API executable (Step 2B pin guard)`;
- public web app v25 remains the public customer endpoint and was re-verified after the API update;
- `clasp apis` now runs successfully.

Remaining proof gap:

- `clasp run rcsOperatorAction ...` still cannot execute from the terminal;
- dev-mode currently fails with a permission error before function execution;
- `--nondev` currently reports the function is not found as an API executable;
- next work should verify OAuth / caller authorisation and confirm in the Apps Script UI that the version 29 deployment remains API executable only.

Step 2C update:

- a clean API-only deployment now exists:
  - deployment ID `AKfycbwSdO73nyxrOKVPQVQgkoGg29RwvYmJXWDYAgFqs5cdxyI4pJXFW3cZZSS1-6y3zlex`;
  - version `33`;
  - description `Operator API executable (Step 8H clean API-only)`;
- local `.clasp.json` points at this clean v33 deployment;
- the previous v32 active-checkout-guard deployment `AKfycbyG5yW-r0sfaKt1bwUUGFAHHdQoKK8wBCfR1riVxvYamu9YhfOBpRJhnRL_5iBP0VSC` was contaminated with Web app + API executable types and has been archived after approval;
- the contaminated v29 deployment `AKfycbzogKHOijtu6kjp2MVrL9WcVuF6mWrgQyKUzQGRvpTfozdUSA9y_B6X_eWpQeQ-mWtS` has been archived after approval;
- do not run `clasp deploy -i` against the clean v33 deployment while the manifest still has web app deployment settings;
- `clasp run` still fails before executing `rcsOperatorAction`, so the OAuth / execution-permission proof remains open.

Step 2E update:

- existing Desktop OAuth client `RightOnQ-GOG-Client` is now used by named clasp login `rightonq-gog`;
- login was refreshed with the Sheets scope required by `SpreadsheetApp.openById`;
- no-PIN API execution reaches Apps Script and correctly fails on `Invalid onboarding operator PIN`;
- valid-PIN read-only `rcsOperatorAction` snapshot returned `ok: true` for `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
- Trust Hub KYC header drift was fixed by reconciling tracking sheets to canonical header order before operator readback;
- normal `clasp run` is proven; `clasp run --nondev` still cannot find the function as an API executable, so keep that caveat in the runbook.

Step 2F update:

- local operator wrappers now use an authenticated Apps Script Execution API client instead of posting to the web app;
- the shared helper is `rcs-registration/tools/operator-api-client.mjs`;
- public customer submissions use the public web app deployment, now updated to v31;
- `operator-status.mjs` live proof returned strict JSON with `ok: true`;
- this completes the practical public/operator transport split for the pilot.

Step 2G update:

- a read-only external review found that the anonymous public `doPost` endpoint still accepted operator-only actions if called directly with a PIN;
- `doPost` now blocks operator-only actions before opening the Sheet:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`;
- public Part A, B2 name/logo approval, and B3 video approval remain on the public web app;
- Apps Script HEAD was pushed and version `31` was created with description `Disable public operator actions`;
- the existing public web app deployment was updated through the Apps Script UI to version `31` with description `Harden public Part A submission + block public operator actions`;
- live public proof confirmed a public `getOperatorSnapshot` POST now returns `ok: false`, `rejected: true`, and `Operator action is not supported on the public endpoint...`;
- do not use `clasp deploy -i` for that public deployment update unless the manifest/deployment-type risk has been deliberately revisited;
- operator wrappers now call `scripts.run` with the clean API executable deployment ID and `devMode: false`, so they are pinned to the deployed operator API rather than Apps Script HEAD;
- dummy-PIN proof against the clean API deployment reached `rcsOperatorAction` and returned `Invalid onboarding operator PIN`;
- local clasp/OAuth credential files were tightened to file mode `600`, and `.gitignore` now blocks common clasp/client-secret filename patterns.

### Slice 9 - Twilio Trust Hub / Subaccount / Usage Tracking Fields

Add internal Twilio compliance, runtime setup, and usage tracking fields.

Output:

- secondary compliance profile SID;
- Trust Hub status;
- Trust Hub rejection/evaluation summary;
- Trust Hub error code/detail;
- authorised representative exception code/action;
- authorised representative 1 tracking fields;
- authorised representative 2 tracking fields;
- UK RC Bundle SID/status/rejection fields;
- subaccount SID;
- setup status;
- registration/provider reference;
- usage pull plan;
- manual pause flag;
- usage balance reconciliation fields.

### Slice 10 - Website Integration

Decide how the public website introduces this flow.

Output:

- public RCS service page;
- call-to-action into onboarding;
- clear expectations before payment/form;
- read-only context file for website agents to understand this workflow.

## Open Questions

- Exact sales-page wording for `RightOnQ UK` and `RightOnQ Global`.
- Exact VAT-inclusive checkout amount for the `£100 + VAT` registration handling fee.
- Exact prepaid credit/top-up threshold.
- Whether auto top-up is mandatory or optional.
- Whether clients can use Direct Debit later.
- Whether Revolut subscriptions are reliable enough in sandbox for the monthly base fee.
- How private application links are generated and revoked.
- Whether Google Sheets remains the source of truth beyond pilot.
- Who inside RightOnQ manually approves each status transition.
- Exact live Twilio Trust Hub Secondary Business policy requirements for UK clients.
- Whether both representatives should be collected in the customer form or rep 2 should be kept as a RightOnQ manual follow-up before Secondary Profile submission.
- Exact first/last/email/mobile/title/job-position field shape for both authorised representatives.
- Which secure/Twilio-managed route will handle exception-only identity evidence if Twilio cannot digitally verify a representative.

## Update Rules For Future Agents

When working on RCS onboarding:

1. Read this file.
2. Read the latest `RCS_TWILIO_*_HANDOVER_*.md`.
3. Update this file when product decisions, workflow, statuses, schema, payment assumptions, or build slices change.
4. Keep implementation notes brief here; put detailed local state and dirty-checkout warnings in the agent handover diary.
5. Do not silently pivot from Revolut-first to Stripe-first without recording the reason.
