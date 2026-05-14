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
- first month subscription/payment;
- prepaid usage credit/deposit payment;
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

### Initial Commercial Model Under Discussion

Starting package:

- `Local Time Only`
- `£25/month`
- PAYG usage fees on top
- minimum starting usage credit/deposit, likely `£50`

Likely first payment:

- `£25` first month
- `£50` starting usage credit
- total `£75`

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
  - RightOnQ primary compliance profile remains the approved parent profile;
  - each end-client gets its own Secondary Compliance Profile / Secondary Customer Profile;
  - phone numbers and other channel resources are linked to that compliance profile by assignment resources.
- Treat this as a third onboarding track beside commercial/payment and RCS sender registration.

Current design assumption, pending RightOnQ's own API/Console proof:

- Build the intake data model to support two authorised representatives, not one.
- Public Twilio docs for secondary compliance profiles say to provide contact details for two authorised representatives.
- The engineer-to-engineer Console/API review also found `authorized_representative_1` and `authorized_representative_2` in the Secondary Business policy requirements.
- Each representative should have:
  - first name;
  - last name;
  - business/work email;
  - phone number;
  - business title;
  - job position.

Do not collect date of birth in the launch intake unless the live Twilio flow explicitly requires it. If Twilio later requires date of birth, ID, or proof of address for a representative, route that through a more secure manual/admin process rather than the current static form and Google Sheet path.

The field-authority principle is:

- when RCS and Trust Hub ask for overlapping data, RightOnQ should ask the stricter/more precise version once;
- the canonical RightOnQ answer then feeds both the RCS sender registration and Twilio Trust Hub/KYC workflow.

Useful official references checked:

- Twilio Secondary Compliance Profiles: `https://www.twilio.com/docs/trust-hub/profiles/secondary-compliance-profiles`
- Twilio Trust Hub overview: `https://www.twilio.com/docs/trust-hub`
- Twilio API: Create a Secondary Customer Profile: `https://www.twilio.com/docs/trust-hub/trusthub-rest-api/api-create-secondary-customer-profile`
- Twilio UK long-code KYC: `https://support.twilio.com/hc/en-us/articles/21038555454875-Know-Your-Customer-KYC-in-the-United-Kingdom`

### Isa Bell Email - Pending Clarification

Bugs emailed Isa Bell at Twilio on Thursday 14 May 2026 to confirm the build-critical KYC points.

The email asked, in practical terms:

- whether each UK limited-company client should have a Secondary Customer/Compliance Profile under RightOnQ's approved Primary Profile;
- whether the UK long-code Regulatory Compliance Bundle is separate from, or fed by, the Secondary Customer/Compliance Profile;
- what identity evidence is normally required for the authorised representative of a UK limited company;
- whether RightOnQ can complete or trigger any passport/driving-licence verification through Twilio/Persona without storing copies of personal ID;
- whether one or two authorised representatives are required;
- whether larger/well-established UK limited companies can rely more on Companies House/company records, or whether individual identity verification is always required;
- how UK long-code SMS fallback numbers should be assigned when the number sits inside a RightOnQ-controlled Twilio subaccount.

Until Isa replies:

- do not add passport/driving-licence/proof-of-address upload to the static app;
- do not force customer-facing rep-2 capture without a design decision;
- keep building the field-authority map and planning layer only.

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
| Authorised representative 1 | Step 1 asks name/email/job title; auto-syncs from primary contact | Needed for sign-off | Needed; phone and job position may also be needed | May be needed | Personal contact data | Expand later to first/last/email/phone/business title/job position if confirmed. |
| Authorised representative 2 | Not currently captured | Usually not needed for RCS | Likely needed by Trust Hub policy | Unclear | Personal contact data | Pending Isa/Twilio proof; decide whether form field or manual RightOnQ follow-up. |
| Passport / driving licence / proof of address | Not captured | Not needed for RCS form | May be required via Persona/Trust Hub | Possibly separate KYC evidence | High sensitivity | Must not use static app/Google Sheet; secure/manual route only. |
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
  - possibly expand authorised representative fields;
  - decide how to collect representative 2;
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

### Wait For Isa Bell / Twilio Confirmation

These should not be added to the live form until Isa confirms or Bugs approves a working assumption.

1. Whether the customer-facing form should require two authorised representatives.
2. Whether representative 1 should be split into first name / last name / phone / business title / job position now, or kept simpler for v1.
3. Whether Twilio needs physical operating address separate from Companies House registered office address.
4. Whether Trust Hub `business_regions_of_operation` should be asked on the client form, collected internally, or inferred/reviewed by RightOnQ.
5. Whether Secondary Compliance Profile and UK long-code RC Bundle are separate operational submissions or one feeds the other in RightOnQ's live account flow.

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
2. Client opens a RightOnQ onboarding page or receives a guided link.
3. Client sees the package and commercial terms:
   - service level;
   - monthly base fee;
   - PAYG usage;
   - starting usage credit/deposit;
   - auto top-up / pause rules.
4. Client accepts service/payment terms.
5. Client pays via Revolut, likely first month plus starting usage credit.
6. Client receives a private onboarding/application link.
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
4. Payment received and/or payment method saved.
5. Subscription/base monthly entitlement active or recorded.
6. Minimum usage credit/deposit received.
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
- `starting_usage_credit_gbp`
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

- `package_name`: `Local Time Only`
- `monthly_base_fee_gbp`: `25`
- `starting_usage_credit_gbp`: `50`
- `initial_payment_due_gbp`: `75`
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
- `twilio_approved`
- `twilio_rejected`
- `not_required_rcs_only`

Launch privacy rule:

- Do not store representative date of birth, ID images, or proof-of-address files in the current static form / Google Sheet workflow unless Bugs explicitly approves a secure storage design.
- If Twilio requires sensitive representative evidence, handle it as a secure manual follow-up or later backend/admin flow.

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
- `kyc_trust_hub_check`: `pending_isa_reply` until Twilio clarification is received

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
- Business type, industry, regions of operation, website, registered address, and authorised representatives should be shaped to satisfy Trust Hub first, then reused for RCS where possible.
- Build for two authorised representatives, pending RightOnQ's own proof against the live Twilio policy/evaluation flow.
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

### Slice 7 - Customer Commercial/Payment Entry Page

Design/build the onboarding page before the RCS form.

Output:

- package explanation;
- price/usage/deposit/top-up wording;
- terms acceptance;
- Revolut checkout handoff;
- success route to private application link.

### Slice 8 - Revolut Sandbox Proof

Test Revolut flow before committing to implementation.

Questions:

- Can RightOnQ create a customer/order/payment in sandbox?
- Can the payment method be saved for future merchant-initiated charge?
- Can the first payment be `£75`?
- Can later top-up charge be initiated?
- What webhook events arrive?
- How are failed payments represented?
- What IDs should be stored?

### Slice 9 - Twilio Trust Hub / Subaccount / Usage Tracking Fields

Add internal Twilio compliance, runtime setup, and usage tracking fields.

Output:

- secondary compliance profile SID;
- Trust Hub status;
- Trust Hub rejection/evaluation summary;
- two authorised representative tracking fields;
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

- Exact wording of the `Local Time Only` package.
- Whether registration assistance has a separate setup fee or is bundled.
- Exact first payment amount.
- Exact prepaid credit/top-up threshold.
- Whether auto top-up is mandatory or optional.
- Whether clients can use Direct Debit later.
- Whether Revolut subscriptions are reliable enough in sandbox for the monthly base fee.
- How private application links are generated and revoked.
- Whether Google Sheets remains the source of truth beyond pilot.
- Who inside RightOnQ manually approves each status transition.
- Exact live Twilio Trust Hub Secondary Business policy requirements for UK clients.
- Whether the live Twilio Console requires one or two authorised representatives for this specific account path.
- Whether RightOnQ should ask for two reps in the first customer-facing form or collect rep 2 through a manual RightOnQ follow-up.
- Whether any sensitive representative evidence is required by Twilio and, if so, what secure collection route replaces the current static-form/Sheet path.

## Update Rules For Future Agents

When working on RCS onboarding:

1. Read this file.
2. Read the latest `RCS_TWILIO_*_HANDOVER_*.md`.
3. Update this file when product decisions, workflow, statuses, schema, payment assumptions, or build slices change.
4. Keep implementation notes brief here; put detailed local state and dirty-checkout warnings in the agent handover diary.
5. Do not silently pivot from Revolut-first to Stripe-first without recording the reason.
