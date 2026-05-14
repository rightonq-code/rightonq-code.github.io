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
6. Client receives a private RCS application link.
7. Client completes Part A.
8. RightOnQ checks Part A.
9. Client sees Part B storyboard/status.
10. RightOnQ sends RBM Tester invitation and branded phone preview.
11. B2 unlocks for name/logo approval.
12. Client approves name/logo or sends issue feedback.
13. RightOnQ fixes issues or proceeds.
14. RightOnQ prepares review video.
15. B3 unlocks for video review.
16. Client approves video or requests changes.
17. RightOnQ submits registration.
18. B4 shows submitted/tracking state.
19. Client is notified of provider/carrier outcome.
20. Once approved/live, usage is monitored and charged/top-up controlled.

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
12. Twilio subaccount created/prepared.
13. Phone preview/test invitation sent.
14. Application status updated to unlock B2.
15. Name/logo approval received or issue raised.
16. If issue raised, stop video work until resolved.
17. Review video prepared.
18. Application status updated to unlock B3.
19. Video approval received or changes requested.
20. If approved, registration pack submitted.
21. Provider/carrier status tracked.
22. Approved/live/rejected/paused state maintained.
23. Twilio usage monitored.
24. Revolut top-ups/payments reconciled.
25. Service paused if billing risk rules trigger.

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
  - `authorised_rep_name`
  - `authorised_rep_email`
  - `authorised_rep_title`
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

### Tab: Twilio Setup

Purpose: internal setup and provider/Twilio tracking.

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

Status: B2 name/logo storage implemented and proof-tested by RCS-Twilio-4 on Thursday 14 May 2026. B3 video approval storage is still pending.

Checkpoint:

- Local commit `062cee9 Wire B2 name logo approval storage` contains the B2 static app wiring, Apps Script receiver changes, README update, first build-plan update, and first Twilio-4 handover update.
- A local handover/build-plan update commit sits on top of it to clarify where the work stopped.
- At the time of writing, both local commits still need pushing to `origin/rcs-registration-part-a-b-20260507` after Bugs approves.

Output:

- B2 name/logo approval record - done via `Part B approvals`;
- B2 issue record with categories/notes - done via `Part B approvals`;
- B2 status updates based on response - done via `Applications`;
- B3 video approval record - pending;
- B3 change request record - pending;
- B3 status updates based on response - pending.

Implemented:

- Static app B2 `Approve name and logo` now posts `action = submitNameLogoApproval`.
- Payload includes Application ID, private application token when present, tester invite answer, name/logo decision, issue categories, notes, and submitted timestamp.
- Apps Script appends each response to a new `Part B approvals` event-log tab.
- Apps Script updates the matching `Applications` row:
  - approval sets `registrationStatus` and `partBStatus` to `name_logo_approved`;
  - not-arrived/help/issue/note sets both to `name_logo_changes_requested`;
  - `Next action owner` becomes `RightOnQ`.
- Existing live Apps Script deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed in place to version `12`.

Test evidence:

- Live test POST against `ROQ-RCS-TEST-SLICE5-20260514` returned `ok: true` and `name_logo_approved`.
- Live Sheet now has the `Part B approvals` tab with labelled B2 test approval rows.
- `Applications` row for `ROQ-RCS-TEST-SLICE5-20260514` now shows `Registration status = name_logo_approved`, `Part B status = name_logo_approved`, `Next action owner = RightOnQ`, and `Next action note = Prepare the RCS application review video.`
- Browser check on `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE5-20260514` showed B2 opening correctly, approval choices enabling the `Send approval to RightOnQ` button, status reading `Name and logo approved`, and no console errors.

Important caveat:

- Three duplicate labelled test rows exist in `Part B approvals` because Apps Script's redirect behaviour wrote during the first curl attempts. Leave them as proof rows unless Bugs approves cleanup.

Next:

- Push the B2 checkpoint and handover/build-plan update commits when approved.
- Continue Slice 6 by wiring B3 video approval/change responses into storage.
- Keep B3 as the same pattern unless there is a strong reason to change it: append-only approval/change event log plus current-state update on `Applications`.

### Slice 6A - Communications Cadence

Define and implement customer communication templates and triggers.

Output:

- first email templates;
- trigger statuses;
- `Communications` tab write path;
- manual-send fallback for v1;
- later automation plan.

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

### Slice 9 - Twilio Subaccount / Usage Tracking Fields

Add internal Twilio setup fields.

Output:

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

## Update Rules For Future Agents

When working on RCS onboarding:

1. Read this file.
2. Read the latest `RCS_TWILIO_*_HANDOVER_*.md`.
3. Update this file when product decisions, workflow, statuses, schema, payment assumptions, or build slices change.
4. Keep implementation notes brief here; put detailed local state and dirty-checkout warnings in the agent handover diary.
5. Do not silently pivot from Revolut-first to Stripe-first without recording the reason.
