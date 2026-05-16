# RCS-Twilio-4 Handover Diary

Date: Tuesday 12 May 2026
Owner so far: RCS-Twilio-4
Project: RightOnQ RCS registration / Twilio RCS sender application / staged Part A and Part B workflow
Repo: `/Users/macpro/rightonq-code.github.io`
Branch: `rcs-registration-part-a-b-20260507`

## Read This First

This file is the living handover for RCS-Twilio-4. Keep updating it as the session moves so RCS-Twilio-5 can inherit the work without guessing from browser state or terminal scrollback.

The working rhythm with Bugs/Adam is:

1. discuss the exact change first;
2. wait for approval;
3. edit the narrow approved scope;
4. verify in the correct localhost preview;
5. checkpoint locally when useful;
6. do not push app/layout work until Bugs explicitly approves.

Do not touch PR #1. Do not push the current app/layout work. Do not stage unrelated dirty files.

Correct preview URLs:

- `http://127.0.0.1:8902/rcs-registration/index.html`
- `http://localhost:8902/rcs-registration/index.html`

Use `127.0.0.1` if `localhost` is slow or refuses the connection.

Correct app file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

## Handover Chain

RCS-Twilio-4 read the three predecessor handovers in order:

1. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
2. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
3. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md`

This file continues the chain:

4. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`

Also read and update the main product build plan:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`

The handover diary is for agent continuity and local repo state. The main build plan is the durable product/workflow source of truth across Twilio-4, Twilio-5, Twilio-6, and later agents.

## Legal Entity / Brand Naming

Important correction from Bugs on Saturday 16 May 2026:

- The operating UK limited company is `Continuity AI Ltd`.
- `RightOnQ` is the trading name / product brand of `Continuity AI Ltd`.
- `RightOnQ` is going through trademark application.

Implementation rule:

- Use `Continuity AI Ltd` for legal entity / business-name fields.
- Use `RightOnQ` for product, brand, trading name, customer-facing platform, and campaign language.
- Do not use `RightOnQ` as the legal business name in Twilio, Revolut, Trust Hub, RC Bundle, privacy, terms, or billing/compliance records.

Twilio-2 and Twilio-3 handover copies are currently untracked in the dirty checkout, but Twilio-3 says they were safely preserved on a separate docs/handover branch and merged via PR #2. Leave them alone unless Bugs explicitly asks.

## Starting State For Twilio-4

Twilio-4 started from the handover instruction that the current localhost app was Level 2 locally committed, not pushed.

At orientation, the branch had two local app commits on top of origin:

- `b4a8acc Checkpoint Part B phone preview step`
- `14db1c5 Checkpoint current RCS registration app state`

Remote branch was:

- `bfeceb8 Sync RCS Twilio handover and profile description field`

RCS-Twilio-4 treated `14db1c5` as the app baseline and did not touch PR #1.

## Current Level 2 Checkpoint

After Bugs approved the current work as worth saving locally, RCS-Twilio-4 created narrow local checkpoint commits. The latest Level 2 checkpoint currently at `HEAD` is:

- `fced766 Checkpoint RCS registration Part B review flow`

That checkpoint includes:

- `rcs-registration/index.html`
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`
- `images/rbm-tester-management-icon.jpg`

No push was made.

The branch is now ahead of `origin/rcs-registration-part-a-b-20260507` by 5 local commits:

1. `b4a8acc Checkpoint Part B phone preview step`
2. `14db1c5 Checkpoint current RCS registration app state`
3. `9392559 Checkpoint RCS Part B storyboard and A8 wording`
4. `6811063 Add RCS Twilio 4 handover diary`
5. `fced766 Checkpoint RCS registration Part B review flow`

## Current Dirty / Untracked Files

After the Level 2 checkpoint, Bugs continued shaping Step 4/5, brand assets, helper wording, layout alignment, and phone/email drafting. There are now fresh uncommitted changes in:

- `rcs-registration/index.html`
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`

Known dirty/untracked files in the checkout still include other lanes and handover copies:

- `index.html` - root website lane, do not stage casually.
- `privacy.html` - legal/web cleanup lane, do not stage casually.
- `terms.html` - legal/web cleanup lane, do not stage casually.
- `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md` - handover/protocol update lane, do not stage unless approved.
- `RightOnQ RCS Application Future Amendments.md` - planning note, do not delete or stage casually.
- `RightOnQ Website Future Amendments.md` - planning note, do not delete or stage casually.
- `rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md` - untracked local copy, already preserved elsewhere per Twilio-3.
- `rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md` - untracked local copy, already preserved elsewhere per Twilio-3.
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md` - this file, newly added by Twilio-4 and not yet committed at creation time.

Do not use `git add .`, broad restore/reset/clean commands, rebase, or merge to tidy this checkout.

## Work Completed By RCS-Twilio-4 So Far

### B2 Approve Name And Logo Screen

After the Level 2 handover commit, Bugs approved building the static B2 shape.

Implemented in `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`:

- Part B left-nav Step 2 changed from `Approve phone preview` to `Approve name and logo`.
- Part B storyboard Step 2 title changed from `Phone logo approval` to `Name and logo approval`.
- Added a real B2 screen under `data-part-b-preview="profile"` instead of letting Step 2 fall back to the storyboard.
- B2 now shows the full approval form while visually marking the stage as `Available after RightOnQ sends your test message`.
- B2 explains that RCS registration review can take several weeks, often around 4-6 weeks, so name/logo issues should be fixed before the video is prepared and submitted.
- This was later strengthened to say it is essential to fix name/logo issues before the video is prepared because even small delays at this point can add time to the application.
- B2 asks whether the client accepted the `RBM Tester Management` invitation and received the branded test message.
- Bugs supplied a photo of the distinctive RBM Tester Management logo: mustard square with dark gear. The app now uses a clean in-app recreation of that mark beside the `RBM Tester Management` wording so clients recognise the invitation when it arrives.
- B2 asks whether the client is happy with how the sender name and logo appear on their phone.
- Positive path button becomes `Send approval to RightOnQ`.
- Issue/note path button becomes `Send issue to RightOnQ`.
- B2 controls were changed from radio buttons to tick-style checkbox options because Bugs noticed radio controls felt wrong compared with the rest of the form. The options are still mutually exclusive within each question, but clicking the same option again now clears it.
- `Not yet` and `I need help` are no longer dead ends:
  - `Not yet` enables `Tell RightOnQ it has not arrived`.
  - `I need help` enables `Ask RightOnQ for help`.
  - positive received + approval enables `Send approval to RightOnQ`.
  - received + issue/note enables `Send issue to RightOnQ`.
- Issue/note path reveals issue categories:
  - Logo colour
  - Logo size
  - Logo looks blurry or unclear
  - Sender name is wrong
  - Message did not arrive
  - RBM Tester Management invite problem
  - Other
- Issue/note path also includes a free-text notes box.

Prototype interaction was checked in localhost:

- selecting `Yes, I have received it` plus `Yes, approve name and logo` enables `Send approval to RightOnQ`;
- selecting `No, I need a change` enables `Send issue to RightOnQ` and reveals the issue panel.

This work is not yet committed as of this diary update.

### Box 29 Use Case Alignment

Bugs compared the app's old Box 29 dropdown with Twilio's live RCS dropdown and asked whether RightOnQ should follow Twilio/Google more closely so there is no ambiguous mapping later.

Evidence checked:

- Google RBM agent use cases: `https://developers.google.com/business-communications/rcs-business-messaging/guides/learn/agent-use-cases`
- Google create-agent guidance: `https://developers.google.com/business-communications/rcs-business-messaging/guides/build/agents`

Google and Twilio both use the same core use-case family:

- OTP / one-time password
- Transactional
- Promotional
- Multi-use

RightOnQ does not want to ask for OTP in this intake because that is not the intended market for this service flow.

Implemented Box 29 visible choices:

- `Promotional`
- `Transactional`
- `Both promotional and transactional`

Client-facing helper now explains:

- Promotional means marketing or sales messages.
- Transactional means customer updates, alerts, appointments, order updates, account or service information.

Drafting logic was also updated so public profile description, trigger text, use-case description, and example messages are generated from these three new categories. The visible client label `Both promotional and transactional` should map to Twilio/Google `Multi-use` later in the backend/export layer.

### Public Profile Description Moved To Brand Profile

Bugs supplied Twilio and Google profile screenshots showing that the short description appears directly under the sender/business name in the messaging profile. The field already existed in the app as `senderDescription`, but it was in Step 4 Use case declaration, which made it feel less important than it is.

Implemented:

- Moved `Public profile description` from Step 4 Use case declaration into Step 2 Brand profile.
- It now sits directly after `Sender display name`, before brand colour/logo/banner.
- It keeps `maxlength="100"` and the `0 / 100` character counter.
- Helper now says it may appear under the sender name in the messaging profile and should be clear, useful, and under 100 characters.
- Review summary was updated so `Public profile description` appears under Brand profile rather than Use case declaration.
- Box 19 was retitled `Sender display name`.
- Box 19 helper now says: `The name people will see when your RCS message arrives. Use the public brand name they already recognise, for example Hometown Brewery.`

Current field number after moving is Box 20, not Box 23, because it sits immediately after Display name in the existing numbering order.

### Part B Storyboard Wording

The Part B storyboard intro and six-step wording were replaced with Bugs' more complete flow.

Current intent:

- Part B begins after RightOnQ checks Part A.
- Before the review video is built, RightOnQ previews the sender name and logo on the client's phone.
- The client approves what they see before video production.
- The review video is then produced, reviewed by the client, and used in the registration pack.

Step titles currently include:

1. `Part A accepted`
2. `Phone logo approval`
3. `Video prepared`
4. `Video sent to you for review`
5. `You give the go-ahead`
6. `Submit registration`

Important later discussion: Bugs strongly prefers Step 2 to become about `name and logo`, not "phone preview". Do not leave the product language stuck on "Approve phone preview" for long.

### Storyboard Card Layout

The vertical storyboard cards had too much space between each heading and paragraph. Twilio-4 tightened this by:

- adding controlled row gap in `.story-step`;
- removing default heading/paragraph margins inside `.story-step`;
- keeping enough air for readability.

### Current Position Marker

The first storyboard card now has a green background and plain `You are here` text in the heading.

Bugs specifically asked for:

- not a subtle pill only;
- the whole first card in light green;
- keep `You are here`;
- remove the pill/tablet style.

### Step A8: Sign Off And Send Part A

A8 was tuned in several small approved passes:

- Added spacing below `Sign off and send Part A` because the first checkbox card was too tight against the title.
- Restored default `+44 ` values for both preview phone fields.
- Added placeholders for `+44 `.
- Added `ensurePreviewNumberDefaults()` so old browser autosave that restores blank values gets corrected back to `+44 ` on load.
- Updated Box 47 helper text to:
  - `Choose at least one phone number for the preview. If you are not sure whether a phone is iPhone or Android, choose either box - we can check the device type when the test invitation is sent.`
- Updated the blue note below Box 48 to:
  - `This completes Part A. RightOnQ will check and process the written registration details first, then begin Part B with the phone logo preview. You will then be able to receive and approve how your sender name and logo appear on your phone before the RCS application video is prepared.`

The current Box 47 label is still:

- `Phone number/s for RCS logo preview approval`

This may need later smoothing when Step 2 becomes `Approve name and logo`.

## Verification Already Run

After each file edit, Twilio-4 ran:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('rcs-registration/index.html','utf8'); const match=html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log('inline script syntax ok');"
git diff --check -- rcs-registration/index.html
```

Both checks passed after the latest app edits before commit `9392559`.

After the later uncommitted Step 4/5 split, Twilio-4 re-ran:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('rcs-registration/index.html','utf8'); const match=html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log('inline script syntax ok');"
git diff --check -- rcs-registration/index.html rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md
curl -I http://127.0.0.1:8902/rcs-registration/index.html
```

Those checks passed. The server returned HTTP 200 from `127.0.0.1:8902`.

Twilio-4 also ran a small structural check against `rcs-registration/index.html`. It confirmed:

- `data-step` sections run from `0` through `8`.
- Visible kickers run from `Step 1` through `Step 9`.
- Step titles are now:
  - `Business details`
  - `Brand profile`
  - `Public contact and policy links`
  - `Message purpose`
  - `Message examples`
  - `Confirm How People Will Agree`
  - `RCS launch markets`
  - `Registration pack: Part A`
  - `Sign off and send Part A`
- Sidebar steps are now:
  - `Business details`
  - `Brand profile`
  - `Public links`
  - `Message purpose`
  - `Message examples`
  - `How people agree`
  - `RCS launch markets`
  - `Review`
  - `Send Part A`

The in-app browser was opened to:

- `http://localhost:8902/rcs-registration/index.html`
- `http://127.0.0.1:8902/rcs-registration/index.html`

The fresh `127.0.0.1` tab loaded the app title `RightOnQ RCS Registration Studio` and showed the 9-step sidebar. Future sidebar steps stay gated by normal form validation, so Twilio-4 did not force browser state through unfinished required fields during this verification pass.

## Product Direction Agreed During Twilio-4

Bugs and Twilio-4 agreed that this is not a one-shot public form. It is an application workflow with controlled stops and starts.

Working model:

- Client receives a client-specific application link.
- Client completes Part A.
- RightOnQ checks and processes Part A.
- Part B remains locked until the relevant RightOnQ internal step has happened.
- RightOnQ sends the RBM Tester Management invitation / branded test message.
- RightOnQ marks the phone/name/logo preview as sent.
- The client's same link unlocks B2.
- Client approves name/logo or sends feedback.
- RightOnQ only prepares the video once name/logo approval is in.
- Client reviews and approves the video.
- RightOnQ submits the registration pack.

Useful future status names:

- `part_a_submitted`
- `part_a_checked`
- `phone_preview_sent`
- `name_logo_approved`
- `name_logo_changes_requested`
- `video_ready_for_review`
- `video_approved`
- `registration_submitted`

For the pilot, manual status unlock by RightOnQ is preferred over trying to auto-detect whether a phone received the test message.

## Wider Client Onboarding / Billing Direction

After the audited Part A / static Part B checkpoint was pushed, Bugs clarified the bigger product shape: the RCS registration form is only one part of a wider RightOnQ client onboarding journey.

The customer is not just "filling in an RCS form". They are becoming a RightOnQ client. Before the registration work proceeds too far, the client should understand and accept:

- RightOnQ is helping them register and operate RCS.
- Once approved/live, RightOnQ's software/service layer remains part of the process.
- They must choose/accept the service level, currently `RightOnQ UK` at `£25/month + VAT` or `RightOnQ Global` at `£49/month + VAT`.
- Pay-as-you-go messaging/Twilio usage fees are additional.
- RightOnQ should not carry open-ended Twilio credit risk for client usage.

### Billing / Credit-Risk Recommendation

Research direction from Twilio-4 plus payment-focused and Revolut-focused sub-agents:

- Bugs prefers to use `Revolut` as much as practical, even if there is a small trade-off versus Stripe, because keeping banking/payment movement under the same operational hood has advantages.
- Revolut Merchant appears technically capable enough to support the planned first commercial flow if RightOnQ owns the service ledger and risk controls.
- Treat `Stripe Billing` as the benchmark/fallback, not the automatic first choice.
- Use Revolut for:
  - initial checkout/payment;
  - saved payment method where available;
  - `£100 + VAT` registration handling fee collection;
  - possible post-approval monthly subscription after sandbox testing;
  - merchant-initiated top-up orders/charges;
  - webhooks/reporting for reconciliation.
- Do not rely on Revolut alone as a full SaaS billing brain.
- RightOnQ should own:
  - customer/application ledger;
  - prepaid credit balance;
  - auto top-up threshold;
  - service pause/suspension rules;
  - payment failure handling;
  - customer-facing billing status inside the onboarding system.
- Consider `GoCardless` later for larger UK B2B customers who prefer Direct Debit.
- Twilio subaccounts are still useful, but they do not remove RightOnQ's billing exposure because Twilio bills subaccount usage to the parent account balance.

Important Twilio billing point:

- Use one Twilio subaccount per customer/tenant for separation, reporting, blast-radius control, and future usage reconciliation.
- Do not rely on subaccounts to make the client financially responsible to Twilio.
- Pull/query Twilio usage records per subaccount into RightOnQ's own ledger.
- Bill/top up the customer through RightOnQ's billing system, with Revolut-first now preferred for the pilot if sandbox testing confirms the flow.

Recommended early risk rule:

- No client should get live Twilio-backed usage with unlimited postpaid exposure.
- Require the `£100 + VAT` RCS registration handling fee before RightOnQ starts registration work.
- Do not charge monthly platform fees during the 4-6 week registration wait.
- Start monthly platform fees only once the sender is approved and ready to use.
- Keep auto top-up / pause rules for later live Twilio usage.

Commercial decision from Bugs on 2026-05-15:

- no standalone "application only" product for now;
- every client pays a `£100 + VAT` RCS registration handling fee to start;
- this flow is B2B only: registered businesses / companies are accepted; sole traders and unregistered businesses are not accepted;
- the client must confirm they are applying on behalf of a registered business and entering the arrangement for business purposes;
- the handling fee covers application review, preparation, provider/compliance handling, administration, submission support, phone preview work, and registration follow-up;
- refund the handling fee in full if the RCS sender application is not approved for reasons outside the client's control;
- do not refund once RightOnQ has started the registration handling work, except where the application cannot proceed for reasons outside the customer's control;
- do not refund where the application cannot proceed or is rejected because the business provided inaccurate information, failed required checks, did not complete requested actions, withdrew, or has business/compliance history that prevents approval;
- RightOnQ UK after approval: `£25/month + VAT`, plus messaging costs;
- RightOnQ Global after approval: `£49/month + VAT`, plus messaging costs.

### Customer-Facing Onboarding Shape

Likely customer journey:

1. Lead agrees in principle to use RightOnQ RCS.
2. Customer sees the RCS registration gateway and platform package summary.
3. Customer accepts service/payment terms.
4. Customer pays the `£100 + VAT` registration handling fee, likely via Revolut checkout/hosted payment.
5. RightOnQ creates/sends a private RCS application link.
6. Customer receives the private RCS application link.
7. Customer completes Part A.
8. RightOnQ checks and processes Part A.
9. Part B unlocks in stages:
   - phone preview/name-logo approval;
   - review video approval;
   - final submission/status.
10. Once approved/live, RightOnQ monitors usage, billing, support, and Twilio/provider state.

### RightOnQ Internal Operating Shape

Likely internal journey:

1. Lead qualified.
2. Commercial offer agreed.
3. Revolut customer/payment record created, or checkout session/order prepared.
4. `£100 + VAT` registration handling fee paid.
5. Payment method saved where supported.
6. Subscription/base monthly entitlement recorded but not charged until approved and ready to use.
7. Application record created with stable `application_id`.
8. Part A submitted.
9. Internal review complete.
10. Twilio subaccount created or prepared.
11. Phone preview/test invite sent.
12. Client approves name/logo or requests fix.
13. Video prepared and sent for client review.
14. Client approves video or requests fix.
15. Registration submitted.
16. Provider/carrier review tracked.
17. Approved/live/paused state maintained.
18. Usage monitored and billed/reconciled.

### Source Of Truth Direction

For the pilot, a structured Google Sheet is still acceptable as the source of truth if the schema is disciplined.

Likely tabs:

- `Applications`
- `Billing`
- `Part A`
- `Part B approvals`
- `Twilio setup`
- `Status log`

Minimum cross-system identifiers:

- `application_id`
- `client_id`
- `revolut_customer_id`
- `revolut_subscription_id`
- `revolut_payment_method_id`
- `revolut_order_id`
- `twilio_subaccount_sid`
- `registration_status`
- `billing_status`
- `usage_credit_balance`
- `last_payment_status`
- `provider_submission_reference`

### Next Build Direction

Do not treat Part B as merely more static design. The next durable build should create the thin application/status layer:

1. Generate or assign a stable `application_id`.
2. Store/update one application record rather than only appending isolated rows.
3. Add status fields for Part A, Part B, billing, Twilio setup, and provider submission.
4. Save Part A under that application ID.
5. Make Part B read the application status and show locked/unlocked stages.
6. Save B2/B3 approval/issue responses into the same source of truth.
7. Add billing/commercial status fields before live Twilio usage is possible.

This turns the current RCS form into one screen inside a controlled client onboarding system.

RCS-Twilio-4 also created a separate main build document for this wider product plan:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`

Future agents should update that file when product decisions, schema, payment assumptions, statuses, or implementation slices change.

### Main Build Plan Slice 2 Started

After Bugs approved starting the new main build document, RCS-Twilio-4 began Slice 2: `Source Of Truth Schema`.

Added to `RCS_ONBOARDING_MAIN_BUILD_PLAN.md`:

- Draft 1 schema for `Applications`.
- Draft 1 schema for `Billing`.
- Draft 1 schema for `Part A`.
- Draft 1 schema for `Part B approvals`.
- Draft 1 schema for `Twilio setup`.
- Draft 1 schema for `Communications`.
- Draft 1 schema for `Status log`.
- Recommendation for v1:
  - keep `Part A` append-only for audit/recovery;
  - keep `Applications` as the current control row;
  - use `Status Log` for every important state transition.
- Added `Slice 6A - Communications Cadence` so customer emails/notifications are treated as part of the onboarding system, not an afterthought.

### Slice 3 Started - Application ID And Status In Part A

Bugs approved a temporary v1 approach:

- Generate `application_id` in the browser form for now.
- Persist it in autosave/progress/download/submission payloads.
- Include `registrationStatus` and `partAStatus` as `part_a_submitted` when Part A is submitted.
- Update Apps Script to store/return `applicationId`, `registrationStatus`, and `partAStatus`.
- Live sheet headers must be updated before deploying/using the changed Apps Script because these new fields are inserted near the start of the append row.
- RCS-Twilio-4 updated the live Google Sheet header row `Part A submissions!A1:AI1` to match the new append order:
  - `Received at`
  - `Application ID`
  - `Submission ID`
  - `Registration status`
  - `Part A status`
  - then the existing review/client/business columns.
- RCS-Twilio-4 reauthorised `clasp`, pushed `Code.gs`, created Apps Script version `4`, and redeployed the existing live web app URL in place:
  - deployment ID `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6`;
  - current version `4`;
  - live URL unchanged.
- Test POSTs confirmed the live Sheet receives the new fields correctly. There are two obvious test rows in the live sheet with `Application ID` = `ROQ-RCS-TEST-SLICE3-20260514`; leave them unless Bugs approves cleanup.

Important launch caveat:

- This browser-generated ID is a temporary implementation step only.
- Before live launch, `application_id` should come from a RightOnQ-created private link or server-side application record.

Files touched:

- `rcs-registration/index.html`
- `rcs-registration/google-apps-script/Code.gs`
- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`

### Slice 4 Started - Internal Status Control

RCS-Twilio-4 then added the first thin status-control layer.

Implemented:

- Apps Script now supports `GET ?applicationId=...`.
- It searches the live `Part A submissions` sheet by `Application ID`, using the latest matching row.
- It returns:
  - `registrationStatus`;
  - `partAStatus`;
  - `reviewStatus`;
  - `partBVideoStatus`;
  - `notes`;
  - `lastUpdated`.
- Existing live web app deployment was redeployed in place to version `5`.
- Static app now accepts `?applicationId=...` or `?application_id=...`, stores it locally, and refreshes the status.
- Part B progress rail now shows the current status and stage labels:
  - B1 available now;
  - B2 waiting until `phone_preview_sent`;
  - B3 waiting until `video_ready_for_review`;
  - B4 waiting until `registration_submitted`.
- The B2/B3/B4 planning screens are still viewable, but their banners explain whether the stage is live or still waiting.

Test evidence:

- `GET` status lookup for `ROQ-RCS-TEST-SLICE3-20260514` returned `part_a_submitted`.
- Browser preview at `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE3-20260514` showed `Part A received`, kept B2 as `Waiting for test message`, and had no console errors.

## B2 / Step 2 Direction

Bugs does not like `Approve phone preview` as the final human label.

Current recommended label:

- `Approve name and logo`

Likely related labels:

- Left Part B nav: `Approve name and logo`
- B2 page heading: `Approve name and logo`
- Storyboard Step 2 title: `Name and logo approval`

The task in B2 should ask whether the client has:

1. accepted the invitation from `RBM Tester Management`;
2. received the branded test message on the agreed phone number/s;
3. checked the sender name and business logo;
4. approved it or reported an issue.

Suggested B2 question shape:

- `Have you accepted the RBM Tester Management invitation and received the branded test message?`
  - `Yes, I have received it`
  - `Not yet`
  - `I need help`

- `Are you happy with how your sender name and logo appear on your phone?`
  - `Yes, approve name and logo`
  - `No, I need a change`
  - `I have a note or question`

If there is a problem or note, collect specific issue categories:

- Logo colour
- Logo size
- Logo clarity or quality
- Sender name
- Message did not arrive
- Invitation/test setup issue
- Other

Also collect free-text notes:

- `Tell us what looks wrong or what you want us to check.`

If approved:

- send approval to RightOnQ and allow video preparation to proceed.

If issue/note:

- send feedback to RightOnQ and flag the application so video production stops until the issue is reviewed.

### Step 3 Contact Wording Tightened

Bugs challenged the wording `Contact details people will see` because not every field is literally shown inside an RCS message. The section was reframed to separate public profile/contact-policy details from RightOnQ-only registration notifications.

Implemented:

- Step 3 title changed to `Public contact and policy links`.
- Step 3 intro now explains that the details support the public RCS sender profile and registration checks, and that people may see them when viewing the sender profile or asking for help.
- Sidebar/review title was updated to match.
- `Registration notification email` was renamed `RightOnQ registration updates email`.
- Its helper now says it is only for RightOnQ registration updates and is not shown to customers.

### Step 4 Message Example Drafting Polished

Bugs asked whether the pre-emptive sample message examples were still being drafted from earlier answers. They were still present, but the newer `Promotional` / `Transactional` / `Both promotional and transactional` choices were overriding the older industry-specific examples too heavily.

Implemented:

- Step 4 guidance now says the first draft is based on sender name, business industry, and message purpose.
- Example message helpers now explain that drafts use sender name, industry, and message purpose.
- Reworked the example generator so message purpose chooses the lane:
  - `Promotional` gives two promotional-style examples.
  - `Transactional` gives two transactional-style examples.
  - `Both promotional and transactional` gives one transactional example and one promotional example.
- Business industry now supplies the flavour of those examples, so a hospitality/brewery-style sender gets booking/menu/event wording rather than generic car/handover wording.

### Fresh-Eyes Critique Fixes Applied

Bugs asked Twilio-4 to walk the current app from the start and critique it now that the product shape was clearer. Agreed fixes from that critique were applied in a narrow pass:

- Removed `Sole trader` from the company type dropdown.
- Renamed `Company type` to `Registered company type`.
- Company type helper now says sole traders are not accepted for this registration flow.
- Sharpened `Trading name` helper so it is distinct from the exact RCS `Sender display name`.
- Sharpened `Sender display name` helper to say this is the exact name people will see when the RCS message arrives.
- Box 29 helper now explains that `RightOnQ registration updates email` defaults from Box 13 and is not shown to customers.
- Step 4 heading changed from `Use case declaration` to `Message purpose and examples`.
- Added a `Regenerate draft wording` button for Step 4/5 drafted wording and examples.
- A8 phone preview label changed to `Phone number for name and logo preview`.
- Client-facing RBM wording was standardised to `RBM Tester invitation`.

Items deliberately not done in this pass:

- Country list compression. Bugs wants to check that later.
- Part B lock/status control. Needs separate discussion.
- Client-specific private links. Separate project.
- Public profile description placement. Needs a product choice: keep in Step 2 with a general draft, or move after message purpose.

### Sender Description Guidance From Twilio/Puylio Applied

Bugs supplied onboarding guidance saying the sender description should describe what messages users actually receive, not the company or industry. This exposed that Box 20 `Public profile description` was still drafting generic wording like `Marketing, offers...`, which was too close to provider examples of weak descriptions.

Implemented:

- `buildSenderDescription()` now uses message purpose plus business industry.
- Added `getIndustryDescriptionSet()` for industry-aware public profile descriptions.
- Drafts now describe actual recipient-visible message types, for example:
  - Hospitality promotional: `Menu updates, event news and guest offers from Hometown Brewery.`
  - Hospitality transactional: `Booking updates, arrival information and service reminders from Hometown Brewery.`
  - Hospitality multi-use: `Booking updates, arrival reminders, menu news and guest offers from Hometown Brewery.`
- Checked generated examples against the 100-character Box 20 limit using `Hometown Brewery`; the longest generated test string was 99 characters.

### Step 6 Market Picker Reshaped

Bugs wanted Box 42 / Step 6 to be easier to scan while preserving individual country selection. The UI was reworked without changing the submitted data model.

Implemented:

- Added top quick choices:
  - `United Kingdom`
  - `All listed European countries`
  - `Mexico`
- Moved `United States` into its own full-width warning choice with the existing fee note directly underneath.
- Moved individual European countries into a separate compact grid headed `Choose individual European countries instead`.
- `All listed European countries` is a helper checkbox only; it does not submit a fake region value. It ticks/unticks the individual European country checkboxes, so exports still contain actual country names.
- If one individual European country is unticked after selecting all, the helper checkbox becomes indeterminate.

### Public Profile Description Moved To Message Purpose

Bugs agreed to tackle the larger placement issue for `Public profile description`. The field was originally in Step 2 Brand profile, but its strongest draft depends on Step 4 `Main message purpose`, so asking for it before message purpose was awkward.

Implemented:

- Moved `Public profile description` from Step 2 Brand profile to Step 4 `Message purpose and examples`.
- It now sits directly after `Main message purpose` and before expected monthly send volume.
- The field ID remains `senderDescription`, so saved/exported data stays compatible.
- Review summary now lists it under `Message purpose and examples`, not Brand profile.
- Step 2 blue note no longer mentions short public description.
- Helper now follows the provider guidance: describe what messages people actually receive, not just the company or industry.
- The example now uses a concrete message-type description: `Booking updates, arrival reminders, menu news and guest offers from Hometown Brewery. (81/100)`

### Brand Asset Size Requirements Corrected

Bugs supplied a Twilio onboarding screenshot showing the logo requirement as 224 x 224 px, not the app's earlier 256 x 256 minimum. Twilio and Google docs both confirm the logo is 224 x 224 px with a 50 KB max. Google also confirms the banner image is 1440 x 448 px with a 200 KB max.

Implemented:

- Box 21 `Brand logo` helper changed to exactly `224 x 224 px` and `50 KB`.
- Logo upload validation now requires exactly 224 x 224 px, not minimum 256 x 256 px.
- Logo validation now rejects files over 50 KB.
- Box 22 `Banner image` helper changed to exactly `1440 x 448 px` and `200 KB`.
- Banner upload validation now requires exactly 1440 x 448 px and rejects files over 200 KB.

### Form Pair Alignment Pass

Bugs noticed that after recent wording updates the visible control boxes in paired fields, especially Box 21 `Brand logo` and Box 22 `Banner image`, were no longer aligned because helper text had different heights.

Implemented:

- `.field` now uses an internal grid with a stable helper row for two-column fields.
- This keeps the input/select/file controls aligned across each row even when one helper wraps to more lines.
- `.field.full` and `.field.custom-layout` opt out so full-width textareas, checkbox blocks, and preview strips keep their natural layout.

### Message Purpose Split Into Two Steps

Bugs noted that the message-purpose page had become congested and that this is a likely registration failure point if the wording/examples are weak. Twilio-4 split the old single `Message purpose and examples` step into two real steps.

Implemented:

- Step 4 is now `Message purpose`.
- Step 4 carries a direct warning that the wording is review-critical and that vague descriptions can slow down or fail the application.
- Step 5 is now `Message examples`.
- Later steps were renumbered:
  - Step 6 `Confirm How People Will Agree`
  - Step 7 `RCS launch markets`
  - Step 8 `Registration pack: Part A`
  - Step 9 `Sign off and send Part A`
- Sidebar `steps` array was updated to 9 steps.
- Review schema was split so review cards/edit buttons map back to the correct new step.
- Print-only CSS was updated so the review step now prints from `data-step="7"`.
- Regenerate draft wording buttons now work from both Step 4 and Step 5 via `.regenerate-drafts-button`.
- Progress restore now stores `progressStepCount`; older saved browser progress without that marker shifts old steps 4+ forward by one so previous autosave positions do not reopen on the wrong page after the split.

### Public Links And Top Bar Tidy

Bugs noticed Step 3 and the autosave strip had become clumsy after the recent layout changes.

Implemented:

- Step 3 intro now says the details support the public RCS sender profile and registration checks, then clearly says the website, support contact details, privacy policy and terms should belong to the brand being registered.
- Box 23 customer-facing email helper now says `Use an email address customers can contact for help or questions.`
- Box 28 helper was shortened to `Defaults from Box 13. Used only for RightOnQ registration updates; not customer-facing.`
- The autosave strip now uses a more compact `Progress saved` heading.
- The save/resume buttons are kept side by side on normal desktop widths by preventing the save action row from wrapping.

### Step 8 Review Intro Clarified

Bugs wanted the Step 8 `Registration pack: Part A` white-box paragraph to explain the phone logo preview before the video, not jump straight from written details to the review video.

Implemented:

- Step 8 now says RightOnQ will check and process the written registration details.
- It then explains that once Part A is accepted, RightOnQ sends a phone logo preview to the agreed number/s so the client can approve the sender name and logo on a real phone before the RCS application video is prepared.

### Left Progress Rail Scroll Fixed

Bugs pointed out a long-standing irritation: when the mouse was over the left Part A / Part B progress rail, the rail did not scroll cleanly on shorter screens. The user had to scroll the main form area first before the left column became usable.

Implemented:

- `.progress-stack` now has a viewport-based max height and its own vertical scrolling.
- Wheel/trackpad scrolling over the left rail now scrolls the rail itself first, then naturally continues the full page once the rail reaches its own bottom.
- Mobile layout resets the rail to normal page flow with no internal scroll.

### Part A Internal Audit Before Push

Bugs asked for a thorough internal check before pushing to GitHub and moving focus back to finishing Part B.

Audit/fix outcome:

- Ran a structural Part A audit over `rcs-registration/index.html`.
- Confirmed no duplicate IDs.
- Confirmed visible steps run from Step 1 to Step 9 and internal `data-step` sections run from `0` to `8`.
- Confirmed the sidebar includes the Step 4/5 split: `Message purpose` and `Message examples`.
- Confirmed explicit labels resolve to real controls.
- Confirmed character counters resolve.
- Confirmed review schema fields resolve, with intentional virtual summaries for `registeredAddress`, `regions`, `consentRoute`, and upload summaries.
- Confirmed review schema includes sender description, purpose wording, example messages, HELP sample, and STOP sample.
- Confirmed logo/banner inputs carry exact dimension and max KB validation data.
- Confirmed key copy checks:
  - logo 224 x 224 px / 50 KB;
  - banner 1440 x 448 px / 200 KB;
  - Step 4 review-critical warning;
  - Box 28 internal-only wording;
  - Step 8 phone logo preview wording;
  - US non-refundable fee warning;
  - RBM Tester invitation wording.
- Confirmed key auto-fill/draft connections:
  - primary contact name to authorised representative;
  - authorised representative name to signatory;
  - primary contact email to authorised rep email;
  - primary contact email to RightOnQ updates email;
  - primary contact email to customer email;
  - primary contact phone to customer phone;
  - business website to customer website;
  - primary email/phone changes refresh drafted HELP wording;
  - old saved progress migrates after the Step 4/5 split.
- Audit caught one stale wording issue: Box 23 still said `inbox`. It now says `Use an email address customers can contact for help or questions.`

Final verification before push:

- Inline script syntax check passed.
- `git diff --check -- rcs-registration/index.html rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md` passed.
- `curl -I http://127.0.0.1:8902/rcs-registration/index.html` returned HTTP 200.
- Fresh in-app browser preview loaded the app title, 9-step sidebar, compact top bar, and Part B progress rail.

## Immediate Next Build Recommendation

Review the latest uncommitted Step 4/5 split with Bugs in the browser:

1. Confirm Step 4 `Message purpose` feels clear enough for the high-risk sender-description wording.
2. Confirm Step 5 `Message examples` has enough room and does not feel like a squeezed continuation of Step 4.
3. Check whether the new Step 9 total feels acceptable now that Part A has one extra screen.
4. If Bugs approves, create another narrow local Level 2 checkpoint commit for:
   - `rcs-registration/index.html`
   - `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`

Only after that should the app move into deeper plumbing for:

- private application links;
- per-client records;
- status-controlled unlocks;
- Google Apps Script / Sheet / Drive storage keyed by application ID and token.

## Things Not Done Yet

- No push of app/layout work.
- No PR created or touched.
- No backend/status implementation.
- B2 has a static approval form shape, but it is not yet wired to storage, email/alerting, or application status.
- No client-specific private link implementation.
- No update to Google Apps Script payload/schema for B2 yet.
- The latest Step 4/5 split and this handover update are uncommitted after `fced766`.

## Reminder For RCS-Twilio-5

Be warm, but do not run ahead. Bugs is actively steering wording and product shape. He likes quick, careful passes, but wants to approve the exact direction before edits.

The most important current product insight is that this is an application case flow, not a generic static form. Part B should be shown as a future staged process, but real access to B2/B3 must eventually depend on that client's application status.

## Latest State - Thursday 14 May 2026

This section supersedes the older "Immediate Next Build Recommendation" and "Things Not Done Yet" blocks above where they conflict.

### Git / Repo State

- App/layout checkpoint `72a737c` was later pushed safely via a clean temp-worktree merge.
- Remote branch `origin/rcs-registration-part-a-b-20260507` is at merge commit `d84a3d7`.
- Main local checkout is still based at `72a737c` and reports `[behind 5]`.
- Do not broadly stage the worktree. There are unrelated modified root website files:
  - `index.html`
  - `privacy.html`
  - `terms.html`
- There are also unrelated untracked future-amendment notes in the repo root.
- RCS-Twilio-4 intends the next checkpoint to include only the scoped RCS files:
  - `rcs-registration/index.html`
  - `rcs-registration/google-apps-script/Code.gs`
  - `rcs-registration/google-apps-script/README.md`
  - `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`
  - `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`

### Main Build Plan Created

RCS-Twilio-4 created:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`

This is now the durable product/workflow source of truth across RCS onboarding agents. Every successor should read and update it alongside their own handover diary.

It covers:

- customer-facing onboarding;
- internal RightOnQ workflow;
- Revolut-first billing direction;
- source-of-truth tabs and schema;
- communications cadence;
- implementation slices;
- outreach-to-onboarding CRM handoff.

### Outreach / CRM Interlock

Codex-Claw-2 read the main build plan and added an `Outreach To Onboarding Handoff Contract`.

RCS-Twilio-4 reviewed and sharpened it:

- `READY_FOR_ONBOARDING` is the formal CRM deal/status/tag trigger.
- It means the lead is ready to enter the controlled onboarding path.
- It does not mean commercial acceptance, billing setup, or provider approval is complete.
- Those remain separate onboarding statuses before live Twilio-backed service or chargeable usage begins.
- The `Applications` schema now includes CRM handoff fields:
  - `crm_company_id`
  - `crm_deal_id`
  - `crm_source_record_url`
  - `campaign_code`
  - `message_code`
  - `qualified_use_case`
  - `package_interest`
  - `handoff_date`
  - `sales_context`

### Slice 3 Completed - Application ID And Initial Status

Implemented and tested:

- Browser form now has an `applicationId`.
- Autosave/progress/download/submission payloads include the ID.
- Part A submit sends:
  - `applicationId`
  - `registrationStatus = part_a_submitted`
  - `partAStatus = part_a_submitted`
- Apps Script stores these fields in the live Sheet.
- Live Google Sheet header row was updated to add the new leading columns.
- Existing live Apps Script deployment was updated in place to version `4`.
- Two obvious test rows exist in the live Sheet with `ROQ-RCS-TEST-SLICE3-20260514`; leave them unless Bugs approves cleanup.

### Slice 4 Completed - Thin Internal Status Control

Implemented and tested:

- Apps Script now supports `GET ?applicationId=...`.
- It returns latest status fields from the live Sheet for that application ID.
- Existing live Apps Script deployment was updated in place to version `5`.
- Static app accepts `?applicationId=...` or `?application_id=...`.
- Part B progress rail now displays the current registration status and marks stages as waiting/available.
- B1 is available now.
- B2 becomes available from `phone_preview_sent`.
- B3 becomes available from `video_ready_for_review`.
- B4 becomes available from `registration_submitted`.
- B2/B3/B4 are still viewable as planning screens, but banners explain whether the stage is live or waiting.

Verification:

- Inline app script syntax passed.
- Apps Script syntax passed.
- `git diff --check` passed for scoped RCS files.
- Live `GET` for `ROQ-RCS-TEST-SLICE3-20260514` returned `part_a_submitted`.
- Browser preview at `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE3-20260514` showed `Part A received`, kept B2 as `Waiting for test message`, and had no console errors.

### Slice 4A Completed - Applications Control Row

RCS-Twilio-4 added the first real one-row-per-application control path.

Implemented:

- Apps Script now creates an `Applications` tab if needed.
- Part A submissions still append to `Part A submissions`.
- The same POST also creates or updates one `Applications` control row keyed by `Application ID`.
- `Applications` stores supplied CRM/outreach handoff fields:
  - `CRM company ID`
  - `CRM deal ID`
  - `CRM source record URL`
  - `Campaign code`
  - `Message code`
  - `Qualified use case`
  - `Package interest`
  - `Handoff date`
  - `Sales context`
- Status lookup now checks `Applications` first and falls back to `Part A submissions`.
- Existing live Apps Script deployment was updated in place to version `6`.

Test evidence:

- Test submission `ROQ-RCS-TEST-SLICE5-20260514` wrote to both `Part A submissions` and `Applications`.
- `Applications` row included the test CRM fields and `part_a_submitted`.
- Live `GET ?applicationId=ROQ-RCS-TEST-SLICE5-20260514` returned the `Applications` control-row shape, including billing, Part B, Twilio, provider, and next-action fields.

### Slice 4B Completed - Private Application Token Path

RCS-Twilio-4 added the first guarded private-link/token plumbing.

Implemented:

- Static app accepts private link parameters:
  - `applicationId` / `application_id`;
  - `applicationToken` / `privateApplicationToken` / `private_application_token` / `token`.
- Static app stores the token locally for status lookup and submission.
- Static app does not include the token in the downloaded client copy.
- Apps Script status lookup can use Application ID and/or token.
- If a token is supplied and does not match the `Applications` row, status lookup returns `found: false`.
- Part A submission into a token-protected application now requires the matching token.
- Apps Script has a guarded internal `action: createApplicationDraft`.
- `createApplicationDraft` requires script property `ONBOARDING_CREATE_PIN`.
- If authorised, it creates/updates the `Applications` row, generates a private token, and returns a private application link.
- Token-protected application status now requires the matching token. Application ID alone returns `found: false` for token-protected rows.
- Existing live Apps Script deployment was updated in place to version `11` after proof cleanup.

Test evidence:

- Normal live status lookup for `ROQ-RCS-TEST-SLICE5-20260514` still returned `part_a_submitted`.
- Same lookup with `applicationToken=WRONGTOKEN` returned `found: false`.
- A no-PIN `createApplicationDraft` attempt did not add a row to `Applications`.
- Temporary proof route created `ROQ-RCS-TEST-PIN-20260514173653`, created a private-link application, submitted Part A using that token, and confirmed Part A became `part_a_submitted`.
- Temporary proof route/helper was removed before the final deployment.
- Final checks confirmed:
  - `ROQ-RCS-TEST-PIN-20260514173653` without a token returns `found: false`;
  - the same ID with `applicationToken=WRONGTOKEN` returns `found: false`;
  - non-token test app `ROQ-RCS-TEST-SLICE5-20260514` still returns status by Application ID.

Important caveat:

- The proof used a temporary PIN and removed/restored the script property afterwards.
- A real operational `ONBOARDING_CREATE_PIN` still needs to be chosen/configured before ongoing internal draft creation.
- Do not store the PIN in the repo or static HTML.
- This is not yet a finished operator/admin interface; it is the guarded backend plumbing for one.

### Slice 6 Partial Completed - B2 Name/Logo Approval Storage

RCS-Twilio-4 wired the B2 `Approve name and logo` form to the live Apps Script receiver.

Implemented:

- Static B2 form now posts `action = submitNameLogoApproval`.
- Payload includes:
  - `applicationId`;
  - `privateApplicationToken` when present;
  - tester invite answer;
  - name/logo decision;
  - issue categories;
  - issue notes;
  - submitted timestamp.
- Apps Script now has a `Part B approvals` event-log tab.
- Each B2 response appends one audit row.
- Apps Script updates the matching `Applications` control row:
  - approval sets `registrationStatus = name_logo_approved`;
  - approval sets `partBStatus = name_logo_approved`;
  - issue/not arrived/help/note sets both to `name_logo_changes_requested`;
  - `Next action owner = RightOnQ`;
  - next-action note tells RightOnQ whether to prepare the video or review the issue.
- Apps Script deployment was pushed and redeployed in place to version `12`.
- README and `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` were updated.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- Inline `index.html` script syntax passed via extracted script parse.
- `git diff --check` passed for the scoped files.
- Live POST against `ROQ-RCS-TEST-SLICE5-20260514` returned `ok: true`, `registrationStatus = name_logo_approved`, and `partBStatus = name_logo_approved`.
- Live Sheet `Part B approvals` contains labelled B2 approval test rows.
- Live Sheet `Applications` row for `ROQ-RCS-TEST-SLICE5-20260514` shows:
  - `Registration status = name_logo_approved`;
  - `Part B status = name_logo_approved`;
  - `Next action owner = RightOnQ`;
  - `Next action note = Prepare the RCS application review video.`
- Browser check at `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE5-20260514` showed:
  - status refreshed to `Name and logo approved`;
  - B2 opened from the rail;
  - selecting "Yes, I have received it" plus "Yes, approve name and logo" enabled `Send approval to RightOnQ`;
  - browser console error log was empty.

Important caveat:

- Three duplicate labelled B2 test rows exist because Apps Script's redirect behaviour still wrote during early curl attempts. Leave them unless Bugs approves live Sheet cleanup.
- B3 video approval/change storage is still pending and should be the next storage slice.

### Current State After B2 Storage Checkpoint

Updated by RCS-Twilio-4 on Thursday 14 May 2026.

Repository state:

- Branch: `rcs-registration-part-a-b-20260507`.
- Local B2 storage checkpoint commit exists:
  - `062cee9 Wire B2 name logo approval storage`.
- A local handover/build-plan update commit sits on top of it.
- Remote branch is still at:
  - `924d252 Prove RCS private token PIN flow`.
- Therefore the branch is ahead of origin by 2 commits.
- Neither local commit has been pushed yet.
- Scoped RCS files are clean after the commit.
- Unrelated root website files remain dirty and should not be swept into RCS commits:
  - `index.html`;
  - `privacy.html`;
  - `terms.html`;
  - untracked `RightOnQ RCS Application Future Amendments.md`;
  - untracked `RightOnQ Website Future Amendments.md`.

Live service state:

- Apps Script deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` is live at version `12`.
- Local app preview remains:
  - `http://localhost:8902/rcs-registration/index.html`.
- Test application `ROQ-RCS-TEST-SLICE5-20260514` is now at `name_logo_approved` in the live `Applications` tab due to the B2 proof.

Next recommended step:

1. Push the two local RCS commits to `origin/rcs-registration-part-a-b-20260507` when Bugs approves.
2. Then wire B3 video approval/change responses into storage.
3. After B3 storage, choose/configure the real operational `ONBOARDING_CREATE_PIN` or build a small internal operator wrapper so agents do not handle the PIN manually.
4. Then build the manual internal status update process/operator sheet view.

Recommended order: push the B2/storage documentation checkpoints first, then B3 storage is the cleanest continuation. The operational PIN/wrapper should still be settled before any real client private links are issued.

### Slice 6 Completed - B3 Video Approval/Change Storage

RCS-Twilio-4 wired the B3 `Review and approve video` screen to the live Apps Script receiver.

Implemented:

- Static B3 review form now posts `action = submitVideoApproval`.
- Payload includes:
  - `applicationId`;
  - `privateApplicationToken` when present;
  - approval checklist items;
  - approval/change decision;
  - change notes;
  - submitted timestamp.
- Apps Script now has a `Part B video approvals` event-log tab.
- Each B3 response appends one audit row.
- Apps Script updates the matching `Applications` control row:
  - approval sets `registrationStatus = video_approved`;
  - approval sets `partBStatus = video_approved`;
  - change request sets both to `video_changes_requested`;
  - `Next action owner = RightOnQ`;
  - next-action note tells RightOnQ whether to submit the pack or amend the video.
- Apps Script deployment was pushed and redeployed in place to version `13`.
- README and `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` were updated.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- Inline `index.html` script syntax passed via extracted script parse.
- `git diff --check` passed for scoped B3 files.
- Live POST against `ROQ-RCS-TEST-SLICE5-20260514` returned `ok: true`, `registrationStatus = video_approved`, and `partBStatus = video_approved`.
- Live Sheet `Part B video approvals` contains a labelled B3 approval test row.
- Live Sheet `Applications` row for `ROQ-RCS-TEST-SLICE5-20260514` shows:
  - `Registration status = video_approved`;
  - `Part B status = video_approved`;
  - `Next action owner = RightOnQ`;
  - `Next action note = Submit the RCS registration pack.`
- Browser check at `http://localhost:8902/rcs-registration/index.html?applicationId=ROQ-RCS-TEST-SLICE5-20260514` showed:
  - status refreshed to `Video approved`;
  - B3 opened from the rail;
  - selecting the five approval checklist items enabled `Send approval to RightOnQ`;
  - browser console error log was empty.

Current state after B3 storage:

- Branch: `rcs-registration-part-a-b-20260507`.
- Remote branch already includes the B2 commits:
  - `062cee9 Wire B2 name logo approval storage`;
  - `0b04957 Update RCS handover after B2 storage`.
- Local B3 implementation checkpoint exists:
  - `9dd3206 Wire B3 video approval storage`.
- This final handover/build-plan update sits on top of the B3 implementation checkpoint.
- Bugs approved pushing the B3 checkpoint and this handover/build-plan update.
- Scoped RCS files changed by B3:
  - `rcs-registration/index.html`;
  - `rcs-registration/google-apps-script/Code.gs`;
  - `rcs-registration/google-apps-script/README.md`;
  - `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
  - `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.
- Unrelated root website files remain dirty and should not be swept into RCS commits:
  - `index.html`;
  - `privacy.html`;
  - `terms.html`;
  - untracked `RightOnQ RCS Application Future Amendments.md`;
  - untracked `RightOnQ Website Future Amendments.md`.

Next recommended step:

1. Push the local B3 commits to `origin/rcs-registration-part-a-b-20260507`.
2. Then move to Slice 6A communications cadence or the manual internal status update/operator view.
3. Before real client private links are issued, configure the real operational `ONBOARDING_CREATE_PIN` or build the small internal operator wrapper.

### Slice 6A Partial Completed - Guarded Internal Status Operator Path

RCS-Twilio-4 added the guarded backend route for RightOnQ-controlled status changes.

Implemented:

- Apps Script now supports `action = updateApplicationStatus`.
- The action requires script property `ONBOARDING_OPERATOR_PIN`.
- Successful updates can change selected `Applications` control-row fields:
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
- Successful updates write `Updated at` and `Last internal action at`.
- Successful updates append an audit row to a new `Status events` tab.
- Audit JSON now redacts:
  - `operatorPin`;
  - `createPin`;
  - `privateApplicationToken`;
  - `applicationToken`;
  - `private_application_token`;
  - `token`.
- Existing Part A/B2/B3 audit JSON writes now go through the same sanitiser for future submissions.
- Static app status label/order list now recognises the full backend registration status order, so internal statuses like `part_a_changes_needed`, `provider_review`, and `paused_billing` display clearly.
- Apps Script deployment was pushed and redeployed in place to version `14`.
- README and `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` were updated.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- Inline `index.html` script syntax passed via extracted script parse.
- `git diff --check` passed for scoped files.
- Live unauthorised `updateApplicationStatus` attempt against `ROQ-RCS-TEST-SLICE5-20260514` returned:
  - `ok: false`;
  - `error = ONBOARDING_OPERATOR_PIN is not configured`.
- Live `Applications` readback confirmed the guard did not mutate the test application:
  - `Registration status = video_approved`;
  - `Part B status = video_approved`;
  - `Next action note = Submit the RCS registration pack.`

Current state after operator-path work:

- Branch: `rcs-registration-part-a-b-20260507`.
- Remote branch is currently at:
  - `759201a Update RCS handover before B3 push`.
- Operator-path work is local and not yet checkpointed/pushed at the time of this entry.
- Scoped files changed:
  - `rcs-registration/index.html`;
  - `rcs-registration/google-apps-script/Code.gs`;
  - `rcs-registration/google-apps-script/README.md`;
  - `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
  - `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.
- Unrelated root website files remain dirty and should not be swept into RCS commits:
  - `index.html`;
  - `privacy.html`;
  - `terms.html`;
  - untracked `RightOnQ RCS Application Future Amendments.md`;
  - untracked `RightOnQ Website Future Amendments.md`.

Important caveat:

- This is not yet an operator UI.
- Positive live status-change proof is pending until Bugs chooses how to configure `ONBOARDING_OPERATOR_PIN` or asks for a small internal wrapper.
- Do not store the operator PIN in this repo, in static HTML, or in Sheet audit JSON.

Next recommended step:

1. Create a scoped local checkpoint commit for the operator-path files.
2. Push that commit when Bugs approves.
3. Decide whether to configure the real `ONBOARDING_OPERATOR_PIN` directly or build a small internal wrapper.
4. Then move to communications cadence.

### Slice 6B Partial Completed - Communications Manual-Send Queue

RCS-Twilio-4 added the first communications cadence layer.

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
- Each queued communication stores:
  - created time;
  - application ID;
  - communication code;
  - audience;
  - recipient email/name;
  - subject;
  - status `queued_manual_send`;
  - trigger status;
  - send method `manual`;
  - body;
  - related event.
- No customer email is sent automatically from the queue.
- Apps Script deployment was pushed and redeployed in place to version `15`.
- README and `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` were updated.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- `git diff --check` passed for scoped files.
- Live labelled Part A test submission `ROQ-RCS-TEST-COMMS-202605141832` returned:
  - `ok: true`;
  - `registrationStatus = part_a_submitted`.
- Live `Applications` readback confirmed `ROQ-RCS-TEST-COMMS-202605141832` was created.
- Live `Communications` readback confirmed a `part_a_received` draft row:
  - recipient `test-comms@example.com`;
  - subject `RightOnQ has received your RCS Part A details`;
  - status `queued_manual_send`.

Important caveat:

- The live Part A proof also triggered the existing Adam notification email path.
- The queue is intentionally manual-send/review for now.
- Do not switch to automatic customer email sending without Bugs approving the final wording and send rules.

Current state after communications queue work:

- Branch: `rcs-registration-part-a-b-20260507`.
- Remote branch is currently at:
  - `d33da1c Add guarded RCS status operator path`.
- Communications queue work is local and not yet checkpointed/pushed at the time of this entry.
- Scoped files changed:
  - `rcs-registration/google-apps-script/Code.gs`;
  - `rcs-registration/google-apps-script/README.md`;
  - `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
  - `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.
- Unrelated root website files remain dirty and should not be swept into RCS commits:
  - `index.html`;
  - `privacy.html`;
  - `terms.html`;
  - untracked `RightOnQ RCS Application Future Amendments.md`;
  - untracked `RightOnQ Website Future Amendments.md`.

Next recommended step:

1. Create a scoped local checkpoint commit for the communications queue files.
2. Push that commit when Bugs approves.
3. Review/polish the first customer communication templates before any real customer sending.
4. Decide whether the next build is the internal send/review workflow or operator PIN/wrapper activation.

### New Product Discovery - Twilio Trust Hub Secondary Compliance Profiles

After the communications queue commit was pushed, Bugs obtained a live Twilio Console/agent walkthrough of the end-client KYC path.

This changes the product map in an important way:

- RCS sender registration is not the only approval track.
- For RightOnQ-managed clients, Twilio Trust Hub Secondary Compliance Profiles / Secondary Customer Profiles are a separate KYC lane.
- Twilio runtime subaccounts and Trust Hub compliance profiles are related but separate:
  - subaccounts are runtime/account containers;
  - Trust Hub holds compliance/KYC records;
  - channel resources such as phone numbers are linked by assignment resources.
- The onboarding model should therefore have at least three parallel lanes:
  - commercial/payment acceptance;
  - Twilio Trust Hub / client KYC;
  - RCS sender registration.

Current design assumption at that point, later superseded by Isa Bell reply:

- Build the intake model to support two authorised representatives.
- Bugs' assisting agent reported that the Secondary Business policy requirements include `authorized_representative_1` and `authorized_representative_2`.
- Public Twilio docs for secondary compliance profiles also say contact details for two authorised representatives are required.
- Each representative should capture first name, last name, business/work email, phone number, business title, and job position.

Temporary superseding note from the first Isa Bell reply, later superseded again by the Compliance Embeddable / Secondary Profile follow-up:

- the first reply suggested one required primary authorised representative with optional second rep;
- the later follow-up says Secondary Compliance Profile guidance currently asks for two authorised representatives;
- current build direction is therefore: canonical/state model supports two reps when Secondary Profile submission is in scope, while Bugs can still choose whether rep 2 appears in the first public form or is collected as RightOnQ follow-up.

Important privacy/security guardrail:

- Do not add date of birth, ID images, or proof-of-address uploads to the current static form / Google Sheet path unless Bugs approves a secure storage design.
- Bugs believes his own approval did not require date of birth, so DOB is not a launch-intake field unless the live Twilio path proves otherwise.

Documentation update made:

- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md` now contains:
  - a named Trust Hub / Secondary Compliance Profile direction section;
  - Trust Hub status values;
  - a `Trust Hub KYC` source-of-truth tab plan;
  - a Slice 6C field-authority planning checkpoint;
  - updated customer/internal journey language.

Current recommended next step:

1. Wait for the assisting agent's final exact Step 2/3 field capture if still pending.
2. Decide whether rep 2 is collected in the first customer-facing intake or by RightOnQ follow-up.
3. Build a small field-authority map before changing `rcs-registration/index.html`.
4. Keep first Trust Hub execution manual for launch; API automation can follow after the manual path is proven.

### Field Authority Map Started

Bugs then received/quoted further Twilio guidance and confirmed he emailed Isa Bell at Twilio with focused KYC/build questions.

RCS-Twilio-4 updated `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` with:

- an `Isa Bell Email - Pending Clarification` section;
- a draft `Field Authority Map`;
- a current audit of the existing Part A form against RCS, Trust Hub/KYC, and UK RC Bundle needs.

Important conclusions from the map:

- The current app remains a good RCS Part A base.
- Trust Hub/KYC adds a compliance lane rather than invalidating the form.
- The main later form decisions are:
  - whether to add representative 2 to the customer-facing form or collect manually;
  - how to align company type/industry/regions to Twilio's stricter terms;
  - whether a physical operating address differs from the Companies House registered office address;
  - how RightOnQ handles passport/driving-licence/proof-of-address evidence without storing it in the static app/Sheet path.

This was the right holding position at the time. It is now superseded by the Isa Bell reply below: one required primary rep, optional second rep, ID evidence exception-only, and no ID uploads in the static form/Sheet path.

Later update: Isa's Compliance Embeddable / Secondary Profile follow-up supersedes the rep-count part again for the default RightOnQ flow. If Secondary Compliance Profile creation is part of onboarding, design for two authorised representatives. ID evidence remains exception-only and must stay out of the static app/Sheet path.

### Isa Bell Reply Received - KYC Assumptions Updated

Bugs received a comprehensive reply from Isa Bell at Twilio on Thursday 14 May 2026.

Build-impacting points from Isa's reply:

- RightOnQ's ISV model is correct:
  - `Continuity AI Ltd`, trading as `RightOnQ`, keeps the approved Primary Compliance Profile on the parent account;
  - each end-client UK limited company gets its own Secondary Compliance Profile when the registered brand/entity differs from `Continuity AI Ltd` or the `RightOnQ` brand;
  - Twilio docs now use `Compliance Profile` where older docs may say `Customer Profile`.
- UK long-code RC Bundle is separate from the Secondary Compliance Profile:
  - data overlaps;
  - one does not replace the other;
  - UK long-code fallback numbers should be assigned to the bundle/profile representing the end business.
- Authorised representative evidence:
  - baseline UK business bundle fields are business details, address, registration data, and primary authorised rep contact details;
  - passport/government ID is exception-only if Twilio cannot digitally verify the rep or their association with the business;
  - do not make passport/driving licence mandatory upfront.
- Rep count:
  - first-reply guidance was one primary authorised representative required, with optional second rep;
  - later Compliance Embeddable / Secondary Profile follow-up supersedes this for the default RightOnQ Secondary Profile lane: collect/model two reps before Secondary Profile submission.
- ID/document handling:
  - keep the static form and Google Sheet free of ID upload fields;
  - if identity evidence is needed, use a Twilio-managed compliance step or another secure approved process.

RCS-Twilio-4 updated `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` accordingly:

- `Isa Bell Email - Pending Clarification` became `Isa Bell Email - Answer Received`;
- Trust Hub design assumption temporarily changed from `two reps likely required` to `one required primary rep plus optional second`; later follow-up now restores `two reps for Secondary Profile readiness`;
- Field Authority Map now treats passport/government ID as exception-only;
- Open questions now focus on field shape and secure exception route rather than whether two reps are mandatory.
- Future `Internal reviews` rows now use `pending_trust_hub_review` instead of `pending_isa_reply` for the KYC check.

Recommended next step:

1. Do not add sensitive ID/document upload fields.
2. Do not force a second representative in the public form yet unless Bugs chooses that UX, but the state model must support rep 2 before Secondary Profile submission.
3. Later, decide whether both reps should be collected directly in the customer form or whether rep 2 is collected by RightOnQ as a follow-up/manual field for the Trust Hub lane.

### Isa Bell Follow-Up - Compliance Embeddable Scope

Bugs pasted a later Isa Bell/Twilio follow-up clarifying the Compliance Embeddable and representative-count assumptions.

Build-impacting points:

- Compliance Embeddable is documented for Regulatory Compliance Bundles for Long Codes, so the UK long-code RC Bundle lane can be designed around a Twilio-managed embedded collection/resubmission path once RightOnQ has access enabled.
- Public docs do not clearly confirm generic Secondary Compliance Profile support in Compliance Embeddable. They explicitly mention Secondary Customer Profiles for Voice Trust, which is narrower.
- Therefore:
  - UK RC Bundle evidence/resubmission can be planned as embeddable/self-service where enabled;
  - Secondary Compliance Profile creation/resubmission should remain RightOnQ/API/Console-managed unless Twilio confirms that exact embeddable support for RightOnQ's account/use case.
- Compliance Embeddable can be white-label/no visible Twilio branding and does not require the end client to have a Twilio login.
- Limits:
  - form content/order/copy is not customizable;
  - English only;
  - styling uses `ThemeSetId`;
  - access requires prior registration/enablement.
- Twilio can prefill embeddable data from RightOnQ's canonical onboarding record via the initialize API.
- Persist `inquiry_id` and `registration_id`; do not rely on or persist the 24-hour `inquiry_session_token` as a durable identifier.
- Compliance Embeddable FAQ says product data is stored in the US; privacy review/copy should account for that.

Rep-count correction:

- Secondary Compliance Profile guidance currently says to provide contact details for two authorised representatives.
- Because the default RightOnQ model includes a Secondary Compliance Profile per end-client, the canonical intake/state model should collect/support two reps from the start.
- A lighter first public form can still defer rep 2 to a follow-up/manual step, but the workflow should not consider the client ready for Secondary Profile submission until both reps are available.

RCS-Twilio-4 updated `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` with:

- new Compliance Embeddable boundary notes;
- corrected two-rep Secondary Profile assumption;
- UK RC Bundle embeddable inquiry/status fields in the planned state model;
- explicit instruction not to store embeddable session tokens as durable identifiers.

Latest follow-up on Saturday 16 May 2026 confirmed the yes/no build matrix:

- UK long-code RC Bundle via Compliance Embeddable:
  - supported at product-scope level;
  - not self-serve/default on every account;
  - requires prior Compliance Embeddable API access/registration before RightOnQ builds live UX around it.
- Published ISV pattern assumes an approved primary business compliance profile with business identity set to ISV/Reseller.
- Secondary Compliance Profile lane:
  - generic embeddable support is not publicly documented;
  - keep this lane RightOnQ/API/Console-managed for now;
  - continue tracking it separately from the UK RC Bundle lane.
- The current working design remains correct:
  - two authorised reps for Secondary Profile readiness;
  - UK RC Bundle and Secondary Compliance Profile tracked separately;
  - sensitive evidence not stored by RightOnQ where Twilio-managed embeddable is available;
  - persist `inquiry_id` / `registration_id`, not session token.

### Isa/Twilio AI Reply Verification Pass

Bugs flagged that Isa Bell's replies are AI-assisted and asked for a focused verification pass against official Twilio docs.

RCS-Twilio-4 spawned three narrow verification agents and also spot-checked the same official docs directly.

Verification result: the reply is reliable for current build direction, with two caveats.

Confirmed:

- Compliance Embeddable FAQ lists `Regulatory Compliance Bundles for Long Codes`.
- Compliance Embeddable API access requires prior registration/enablement.
- The embeddable onboarding guide's ISV pattern expects a primary business profile with business identity set to `ISV/Reseller`.
- Public docs do not clearly confirm generic Secondary Compliance Profile embeddable support; the explicit FAQ item is narrower: `Secondary Customer Profiles for Voice Trust`.
- Secondary profile API/policy docs include both `authorized_representative_1` and `authorized_representative_2`.
- Embeddable docs support prefill, white-label/self-service embed, callbacks, `inquiry_id`, `registration_id`, and ephemeral 24-hour session token.
- Compliance Embeddable FAQ says data is stored in the US.

Nuance:

- The docs support the conclusion that the end client does not need Twilio Console login for an embeddable-supported lane, but the docs frame it as self-service embedding rather than stating the login point verbatim.
- Rep count is product/policy-specific. Generic secondary profile API/policy docs support two reps, while Voice Integrity docs can treat rep 2 as optional. Keep the canonical state model two-rep capable and still fetch/observe live policy requirements dynamically where possible.

Implementation stance after verification:

- UK RC Bundle: embeddable-supported in product scope, but gated by Twilio access/registration.
- Secondary Compliance Profile: keep RightOnQ/API/Console-managed for now.
- Sensitive evidence: Twilio-managed path where supported; no raw ID storage in the static app/Sheet.
- Store durable IDs/statuses/rejection reasons/callback history, not session tokens or raw documents.

### Spawned Agent Research Added - Twilio KYC Docs

Bugs then spawned agents to review the Twilio pages referenced by Isa's reply and pasted the consolidated build impact.

RCS-Twilio-4 added that consolidation to `RCS_ONBOARDING_MAIN_BUILD_PLAN.md`.

Key build additions:

- confirmed the architecture remains:
  - `Continuity AI Ltd`, trading as `RightOnQ`, parent Primary Compliance Profile;
  - one Secondary Compliance Profile per end-client company;
  - separate UK RC Bundle for UK long-code SMS fallback;
  - assign UK numbers to the approved end-business bundle/profile.
- intake should plan for:
  - two authorised representatives when Secondary Compliance Profile submission is in scope;
  - legal company name, company registration number, website, address, business classification, subassignment flag, and optional comments.
- status tracking should include:
  - `draft`;
  - `pending_review`;
  - `in_review`;
  - `twilio_approved`;
  - `twilio_rejected`;
  - rejection/error reasons.
- exception codes to track:
  - `18019` - proof of identity required for authorised representative;
  - `18020` - proof of authorised representative's association with business required;
  - `18057` - authorised representative validation failed.

Important storage stance:

- passport/driving licence/government ID must not become normal upfront intake fields;
- use Twilio-managed compliance collection wherever available;
- store Twilio IDs, statuses, and rejection reasons rather than raw ID documents;
- do not promise universally that RightOnQ never touches evidence until Twilio confirms the UK-specific embeddable/compliance path.

Remaining uncertainties:

- whether UK RCS production onboarding consumes the same Trust Hub Secondary Compliance Profile cleanly, or adds separate RCS/carrier checks;
- whether RightOnQ's Twilio account has the required ISV/subaccount/embeddable capabilities enabled;
- exact UK long-code purchase enforcement should be tested in the live account before final UX copy.

### Field Change Shortlist Added

After Bugs said to keep rolling, RCS-Twilio-4 added a `Field Change Shortlist - Draft 1` section to the main build plan.

The shortlist separates:

- safe no-regrets wording changes;
- items waiting for Isa Bell/Twilio confirmation;
- manual/secure-only data that must not enter the static app or Google Sheet;
- areas of the current form that should stay stable for now.

Recommended next step:

1. Ask Bugs whether to apply the small no-regrets form edit pass now:
   - CRN wording;
   - website/domain matching wording;
   - company type option cleanup;
   - KYC evidence notice with no upload field.
2. If approved, edit only `rcs-registration/index.html` and related docs/schema labels as needed.
3. Do not add ID upload fields. Rep 2 is now required for Secondary Profile readiness, but Bugs still needs to choose whether it appears in the public form or is collected as a RightOnQ follow-up/manual field.

### Small No-Regrets Customer-Facing Wording Pass

Bugs approved the small no-regrets customer-facing wording pass.

RCS-Twilio-4 updated `rcs-registration/index.html` only for wording/options:

- Added a Step 1 UK KYC note:
  - RightOnQ may need extra business or identity evidence before a UK SMS fallback number can go live;
  - the client should not upload passport, driving licence, or proof-of-address documents in this form;
  - RightOnQ will arrange a separate secure step if sensitive evidence is required.
- Renamed `Companies House number` to `Companies House company number (CRN)`.
- Tightened the CRN helper to UK Companies House registered businesses.
- Tightened company-type helper to say sole traders and unregistered businesses are not accepted.
- Removed loose company-type options and kept:
  - `Private limited company (Ltd)`;
  - `Public limited company (PLC)`;
  - `Limited liability partnership (LLP)`;
  - `Community interest company (CIC)`;
  - `Company limited by guarantee`.
- Strengthened website helpers to say the live site should clearly match or belong to the legal/trading brand.
- Strengthened authorised rep/customer email helpers to prefer business-domain email and avoid personal/free webmail where possible.

No sensitive fields were added. Rep 2, DOB, ID uploads, and Trust Hub operations-region fields remain pending Isa Bell/Twilio clarification or a later explicit Bugs decision.

### Slice 6D Completed - Internal Review Checklist

Bugs asked to keep rolling after the KYC-safe wording pass.

RCS-Twilio-4 completed the next safe operator-readiness slice: an internal checklist for RightOnQ review after Part A lands.

Implemented:

- Apps Script now defines a new `Internal reviews` tab.
- Future Part A submissions append a pending checklist row to `Internal reviews`.
- Checklist columns cover:
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
- `Applications` now includes a `Trust Hub status` control field.
- `getApplicationStatus` returns `trustHubStatus`.
- Guarded `updateApplicationStatus` can accept `trustHubStatus` and writes it to `Applications`.
- `Status events` now includes `Trust Hub status`.
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` documents the `Internal reviews` tab and Slice 6D.
- `google-apps-script/README.md` now marks Apps Script version `16` as the current deployment version.
- Apps Script was pushed with `clasp`, versioned as `16`, and redeployed in place to the existing live web app deployment.

Test evidence:

- Apps Script syntax passed via `new Function(...)`.
- `git diff --check` passed for scoped files.
- Live labelled Part A test submission `ROQ-RCS-TEST-REVIEW-202605142008` returned `ok: true`.
- Live `Internal reviews` tab contains a pending checklist row for `ROQ-RCS-TEST-REVIEW-202605142008`.
- Live `Applications` tab contains `Trust Hub status = not_started` for `ROQ-RCS-TEST-REVIEW-202605142008`.
- Live status lookup for `ROQ-RCS-TEST-REVIEW-202605142008` returns `trustHubStatus: not_started`.

Important caveat:

- This slice does not add a full admin UI and does not collect/store ID documents.
- Two earlier labelled curl attempts displayed a Google Drive error page because the redirect was followed incorrectly, but they still reached the Apps Script backend and wrote test rows:
  - `ROQ-RCS-TEST-REVIEW-202605142006`;
  - `ROQ-RCS-TEST-REVIEW-202605142007`.
- Leave those obvious test rows unless Bugs asks for cleanup.
- This work is local and uncommitted at the time of this note. Next step should be a scoped commit/push if Bugs approves.

### Slice 6E Deployed - Guarded Internal Review Update Action

Bugs approved continuing with the operator workflow.

RCS-Twilio-4 implemented and deployed a guarded internal review update action.

Implemented:

- Apps Script now recognises `action = updateInternalReview`.
- The action requires the existing `ONBOARDING_OPERATOR_PIN` guard.
- It updates the latest matching `Internal reviews` row for an `applicationId`, or creates one if missing.
- It accepts checklist/status fields:
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
- If `partAAccepted = true` or `reviewStatus = accepted`, it reuses the existing `updateApplicationStatus` path to set:
  - `registrationStatus = part_a_accepted`;
  - `partAStatus = part_a_accepted`;
  - `nextActionOwner = RightOnQ`;
  - `nextActionNote = Prepare the phone name and logo preview` unless supplied.
- `google-apps-script/README.md` now marks current version `17`.
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` has Slice 6E notes.

Verification:

- `Code.gs` syntax check passed with `new Function(...)`.
- `git diff --check` passed for the scoped RCS files.
- Apps Script was pushed with `clasp push`.
- Apps Script version `17` was created with `clasp version "Add internal review update action"`.
- Existing deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed at version `17`.
- Unauthorised live proof against `ROQ-RCS-TEST-REVIEW-202605142008` returned `ONBOARDING_OPERATOR_PIN is not configured`.
- Spreadsheet readback after that rejected call showed the `Internal reviews` row stayed `pending_review` and the `Applications` row stayed `part_a_submitted`, with `Trust Hub status = not_started`.

Important caveat:

- This work is local and uncommitted at the time of this note. Next step should be a scoped commit/push if Bugs approves.
- Positive status-changing proof still depends on configuring `ONBOARDING_OPERATOR_PIN` or building an internal wrapper.

### Slice 6F Completed - Local Operator Review Wrapper

Bugs approved rolling forward with the operator workflow.

RCS-Twilio-4 implemented a local operator wrapper:

- new repo-owned tool: `rcs-registration/tools/operator-review.mjs`;
- purpose: update `Internal reviews` through the guarded `updateInternalReview` endpoint without hand-built curl payloads;
- reads `RCS_ONBOARDING_OPERATOR_PIN` from the local environment;
- never stores or prints the operator PIN;
- supports `--dry-run` for payload inspection;
- supports checklist fields and `--part-a-accepted` to trigger the existing Part A acceptance/status-event/communications path.

Verification:

- `node --check rcs-registration/tools/operator-review.mjs` passed.
- Dry-run command printed the expected `updateInternalReview` payload without requiring a PIN.
- Live command without `RCS_ONBOARDING_OPERATOR_PIN` failed locally before sending.
- Live command with dummy local PIN reached Apps Script and returned `ONBOARDING_OPERATOR_PIN is not configured`.
- Spreadsheet readback after the dummy live attempt showed no mutation:
  - `Internal reviews` stayed `pending_review`;
  - `Applications` stayed `part_a_submitted`;
  - `Trust Hub status` stayed `not_started`.

Important caveat:

- This work is local and uncommitted at the time of this note.
- Positive live proof still needs the Apps Script-side `ONBOARDING_OPERATOR_PIN` script property configured.

### Slice 6G Deployed - Guarded Operator Snapshot Readback

Bugs approved continuing forward after Slice 6F.

RCS-Twilio-4 implemented and deployed guarded operator readback:

- Apps Script now recognises `action = getOperatorSnapshot`;
- the action uses the existing `ONBOARDING_OPERATOR_PIN` guard;
- response is designed for RightOnQ operators, not customers;
- response includes:
  - redacted application summary;
  - latest `Internal reviews` row;
  - up to five recent `Status events`;
  - up to five queued `Communications`;
- the response excludes `Private application token`;
- raw `Submission JSON` is redacted as `[redacted in operator snapshot]`;
- new local wrapper: `rcs-registration/tools/operator-status.mjs`.

Verification:

- `Code.gs` syntax check passed.
- `node --check rcs-registration/tools/operator-status.mjs` passed.
- Dry-run printed the expected `getOperatorSnapshot` payload without a PIN.
- `git diff --check` passed for the scoped files.
- Apps Script was pushed with `clasp push`.
- Apps Script version `18` was created with `clasp version "Add operator snapshot readback"`.
- Existing deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed at version `18`.
- Dummy live operator-status request reached Apps Script and returned `ONBOARDING_OPERATOR_PIN is not configured`.
- Spreadsheet readback after the dummy live attempt showed no mutation:
  - `Internal reviews` stayed `pending_review`;
  - `Applications` stayed `part_a_submitted`;
  - `Trust Hub status` stayed `not_started`.

Important caveat:

- This work is local and uncommitted at the time of this note.
- It still needs a scoped commit/push.
- Positive live readback still needs the Apps Script-side `ONBOARDING_OPERATOR_PIN` script property configured.

### Slice 6H Completed - Local Private Application Link Wrapper

Bugs approved continuing forward after Slice 6G.

RCS-Twilio-4 implemented a local application creation wrapper:

- new repo-owned tool: `rcs-registration/tools/operator-create-application.mjs`;
- purpose: create a private application record/link from a qualified CRM/outreach handoff through the existing guarded `createApplicationDraft` endpoint;
- reads `RCS_ONBOARDING_CREATE_PIN` from the local environment;
- never stores or prints the create PIN;
- supports `--dry-run` for payload inspection;
- supports CRM IDs, source record URL, company/contact fields, campaign/message codes, package interest, sales context, owner, and next-action notes.

Verification:

- `node --check rcs-registration/tools/operator-create-application.mjs` passed.
- Dry-run printed the expected `createApplicationDraft` payload without a create PIN.
- Live command without `RCS_ONBOARDING_CREATE_PIN` failed locally before sending.
- Live command with a dummy local create PIN reached Apps Script and returned `ONBOARDING_CREATE_PIN is not configured`.
- Spreadsheet readback after the dummy live attempt showed no new `ROQ-RCS-TEST-CREATE-WRAPPER-202605142032` row in `Applications`.

Important caveat:

- This work is local and uncommitted at the time of this note.
- Positive live proof still needs the Apps Script-side `ONBOARDING_CREATE_PIN` script property configured.

### Slice 6I Deployed - Isa Bell Reply Integration

Bugs pasted Isa Bell's Twilio reply, which clarified the KYC/Trust Hub assumptions.

RCS-Twilio-4 integrated the reply into docs and the small Apps Script default:

- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` now treats Isa's reply as received, not pending.
- Trust Hub design assumption is now:
  - Secondary Compliance Profile per UK limited-company end client;
  - UK long-code RC Bundle remains a separate number-compliance lane;
  - later follow-up now means two authorised representatives for Secondary Profile readiness;
  - ID evidence is exception-only, not upfront.
- Future `Internal reviews` rows now default `KYC/Trust Hub check` to `pending_trust_hub_review`, not `pending_isa_reply`.
- Existing `pending_isa_reply` test rows are historical proof rows and were not mutated.

Verification:

- `Code.gs` syntax check passed.
- `git diff --check` passed for the scoped files.
- Apps Script was pushed with `clasp push`.
- Apps Script version `19` was created with `clasp version "Update KYC checklist after Twilio reply"`.
- Existing deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed at version `19`.

Important caveat:

- No live test Part A submission was created for this default-value change, to avoid adding another Sheet/email proof row unnecessarily.

### Slice 6J Deployed - Internal Trust Hub / RC Bundle Tracking Rows

Bugs approved moving forward with internal Trust Hub / RC Bundle tracking fields and statuses, without adding ID collection to the public form.

RCS-Twilio-4 implemented and deployed a thin backend/Sheet implementation:

- Apps Script now defines a `Trust Hub KYC` internal tracking tab.
- Apps Script now defines a `UK RC bundles` internal tracking tab.
- Future Part A submissions append one row to each tracking tab.
- Guarded operator snapshots now include:
  - latest `Trust Hub KYC` row;
  - latest `UK RC bundles` row.
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md` now includes a dedicated `UK RC Bundles` tab section.
- `google-apps-script/README.md` now marks current version `20`.

Verification:

- `Code.gs` syntax check passed.
- `git diff --check` passed for the scoped files.
- Local mocked-Sheet proof confirmed `Trust Hub KYC` row length matches headers.
- Local mocked-Sheet proof confirmed `UK RC bundles` row length matches headers.
- Apps Script was pushed with `clasp push`.
- Apps Script version `20` was created with `clasp version "Add Trust Hub and RC Bundle tracking rows"`.
- Existing deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed at version `20`.

Important caveat:

- This work is local and uncommitted at the time of this note. Next step should be a scoped commit/push if Bugs approves.
- No live Part A submission was created for this tracking-structure slice, to avoid another Sheet/email proof row.
- It does not call Twilio APIs.
- It does not add passport, driving licence, government ID, proof-of-address, or DOB fields.
- Existing applications/test rows are not backfilled automatically.

### Slice 6K Completed - Operator Tool Usage Notes

Bugs approved polishing the operator workflow docs before configuring real PINs.

RCS-Twilio-4 completed a documentation-only slice:

- new file: `rcs-registration/tools/README.md`;
- documents:
  - `operator-create-application.mjs`;
  - `operator-status.mjs`;
  - `operator-review.mjs`;
- includes dry-run examples and live examples;
- explains local environment variables:
  - `RCS_ONBOARDING_CREATE_PIN`;
  - `RCS_ONBOARDING_OPERATOR_PIN`;
- reiterates that PINs must not be stored in the repo, chat, docs, commits, or command arguments;
- reiterates that ID documents / DOB must not be stored in the static app or Sheet path.

Verification:

- `operator-create-application.mjs` dry-run example produced the expected `createApplicationDraft` payload.
- `operator-status.mjs` dry-run example produced the expected `getOperatorSnapshot` payload.
- `operator-review.mjs` dry-run example produced the expected `updateInternalReview` payload.
- `git diff --check` passed for the scoped documentation files.

Important caveat:

- This work is local and uncommitted at the time of this note.
- It is docs-only and does not configure Apps Script PINs.

### Slice 6L Completed - Positive Operator PIN Proof

Bugs configured both Apps Script Script Properties:

- `ONBOARDING_CREATE_PIN`;
- `ONBOARDING_OPERATOR_PIN`.

There was a brief false alarm:

- an initial long pasted Terminal command was truncated/mangled and produced `Unknown option: --`;
- this was a paste issue, not a PIN or backend failure;
- a later read-only terminal refresh proved the operator PIN worked correctly.

Positive proof application:

- `ROQ-RCS-TEST-POSITIVE-20260514211204`

Proof results:

- `operator-create-application.mjs` created the private application record:
  - `registrationStatus = application_created`;
  - `partAStatus = draft`;
  - private application link was present in the returned result but was not pasted into docs.
- `operator-status.mjs` read the guarded internal snapshot successfully using `ONBOARDING_OPERATOR_PIN`.
- `operator-review.mjs` accepted Part A:
  - `reviewStatus = accepted`;
  - `partAAccepted = true`;
  - `registrationStatus = part_a_accepted`;
  - `partAStatus = part_a_accepted`.
- Final operator snapshot confirmed:
  - `Applications` row updated to `part_a_accepted`;
  - `Last internal action at` populated;
  - `Next action owner = RightOnQ`;
  - `Next action note = Prepare the phone name and logo preview.`;
  - latest `Internal reviews` row shows `accepted` and the supplied checklist values;
  - one `Status events` row exists for `internal_review_completed`;
  - one `Communications` row is queued with code `part_a_accepted`;
  - `Submission JSON` is redacted in the operator snapshot.

Expected limitation:

- `Trust Hub KYC` and `UK RC bundles` were empty in this proof because the test created a private application link but did not submit Part A through the public form.
- Those rows are created when Part A is submitted.

Security note:

- PINs were not stored in chat, committed files, or repo docs.
- The final proof used Bugs' normal Mac Terminal and local environment variables.

### Slice 6M Completed - Public Part A Submission Proof

RCS-Twilio-4 closed the evidence gap left after Apps Script version `20`.

New local helper:

- `rcs-registration/tools/proof-public-part-a-submit.mjs`

Purpose:

- create a private test application using the guarded `createApplicationDraft` path;
- extract the private application token from the returned private link without printing it;
- submit a full Part A test payload through the normal public Apps Script submission path;
- read back the guarded operator snapshot;
- print only a redacted/summarised proof result.

Proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Live proof result:

- private application creation succeeded:
  - `registrationStatus = application_created`;
  - `partAStatus = draft`;
  - private application link was present but not printed by the helper.
- public Part A submission succeeded:
  - `submissionId = RCS-20260514-PUBLIC-PARTA-PROOF`;
  - `registrationStatus = part_a_submitted`;
  - received at `2026-05-14T21:19:06.317Z`.
- guarded operator snapshot confirmed:
  - `Applications.registrationStatus = part_a_submitted`;
  - `Applications.partAStatus = part_a_submitted`;
  - `Applications.Trust Hub status = not_started`;
  - latest `Internal reviews` row exists with `Review status = pending_review`;
  - `KYC/Trust Hub check = pending_trust_hub_review`;
  - `SMS fallback/RC bundle check = pending`;
  - latest `Trust Hub KYC` row exists with `Trust Hub status = not_started`;
  - latest `UK RC bundles` row exists with `RC bundle status = not_started`;
  - `UK RC bundles.Fallback required = to_be_confirmed`;
  - `UK RC bundles.Compliance owner = end_business`;
  - queued communication code includes `part_a_received`.

Security note:

- Bugs entered both PINs silently in local Terminal.
- PINs, private token, and private link were not printed by the helper and were not stored in repo files.

Outcome:

- The v20 public Part A path is now proven to create the new internal Trust Hub KYC and UK RC Bundle tracking rows.
- Next sensible build slice is guarded operator update actions for `Trust Hub KYC` and `UK RC bundles`.

### Slice 6N Completed - Guarded Trust Hub / RC Bundle Operator Updates

RCS-Twilio-4 added the next internal operator slice after the public Part A proof.

Apps Script changes:

- new guarded `action = updateTrustHubKyc`;
- new guarded `action = updateUkRcBundle`;
- both require `ONBOARDING_OPERATOR_PIN`;
- `updateTrustHubKyc` updates the latest `Trust Hub KYC` row and syncs `Applications.Trust Hub status`;
- `updateUkRcBundle` updates the latest `UK RC bundles` row;
- both append `Status events` rows via the existing internal status path;
- Apps Script was pushed with `clasp`;
- Apps Script version `21` was created;
- the existing deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was redeployed to version `21`.

New local tools:

- `rcs-registration/tools/operator-trusthub-kyc.mjs`;
- `rcs-registration/tools/operator-rc-bundle.mjs`.

Tool behaviour:

- both read `RCS_ONBOARDING_OPERATOR_PIN` from the local environment;
- both support `--dry-run`;
- neither stores or prints the PIN;
- neither supports raw identity-document storage.

Live proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Security proof:

- Bugs first entered an incorrect operator PIN;
- all three attempted calls returned `Invalid onboarding operator PIN`;
- no update was accepted until the correct PIN was entered.

Correct-PIN proof results:

- `operator-trusthub-kyc.mjs` returned:
  - `ok = true`;
  - `trustHubStatus = pending_review`;
  - `secondaryComplianceProfileSid = BU_TEST_SECONDARY_PROFILE`;
  - `evaluationStatus = not_run`;
  - `updatedAt = 2026-05-15T07:24:16.476Z`.
- `operator-rc-bundle.mjs` returned:
  - `ok = true`;
  - `rcBundleStatus = pending_review`;
  - `fallbackRequired = yes`;
  - `updatedAt = 2026-05-15T07:24:23.739Z`.
- final guarded snapshot confirmed:
  - `Applications.Trust Hub status = pending_review`;
  - `Applications.lastInternalActionAt = 2026-05-15T07:24:24.573Z`;
  - latest `Trust Hub KYC` row has `Trust Hub status = pending_review`;
  - latest `Trust Hub KYC` row has `Secondary compliance profile SID = BU_TEST_SECONDARY_PROFILE`;
  - latest `Trust Hub KYC` row has `Business website match status = pending_review`;
  - latest `Trust Hub KYC` row has `Evaluation status = not_run`;
  - latest `Trust Hub KYC` row note says no identity evidence was stored;
  - latest `UK RC bundles` row has `RC bundle status = pending_review`;
  - latest `UK RC bundles` row has `Fallback required = yes`;
  - latest `UK RC bundles` row has `Compliance owner = end_business`;
  - `Status events` includes `trust_hub_kyc_updated`;
  - `Status events` includes `uk_rc_bundle_updated`;
  - `Submission JSON` remains redacted in operator snapshots.

Outcome:

- RightOnQ can now manually track Twilio Trust Hub KYC and UK RC Bundle progress from local operator tools without editing the Sheet directly.
- Next sensible build slice is either:
  - build a small operator/status runbook for real client use; or
  - move to the commercial/payment onboarding slice.

### Slice 6O Completed - Evidence Exception Tracking Fields

Bugs sent Isa Bell the question set about a RightOnQ-branded / Twilio-managed evidence path.

RCS-Twilio-4 added internal status/ID fields so the system can track an evidence exception without collecting raw ID data.

Apps Script changes:

- `Trust Hub KYC` headers now include:
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
- default queued `Trust Hub KYC` rows now set:
  - `Evidence collection mode = not_required`;
  - `Evidence status = not_required`.
- `operator-trusthub-kyc.mjs` can update those evidence fields.
- Apps Script version `22` was created and deployed to the existing web app deployment.

Important design boundary:

- these are status/reference fields only;
- no passport, driving licence, DOB, proof-of-address, proof-of-identity file, or raw evidence document field was added;
- no customer-facing ID upload was added.

Live proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Proof command updated the Trust Hub KYC row with:

- `Authorised rep exception code = 18019`;
- `Authorised rep exception action = twilio_managed_evidence_required`;
- `Evidence collection mode = twilio_managed`;
- `Evidence status = requested`;
- `Evidence provider = twilio_compliance_embeddable`;
- `Evidence inquiry ID = inq_TEST_EVIDENCE`;
- `Evidence registration ID = tri_TEST_EVIDENCE`;
- `Evidence requested at = 2026-05-15T08:00:00Z`;
- `KYC internal notes = Evidence exception proof only. No identity evidence stored.`

Proof result:

- `operator-trusthub-kyc.mjs` returned `ok = true`;
- guarded snapshot showed all evidence fields above on the `Trust Hub KYC` row;
- `Trust Hub status` remained `pending_review`;
- `Secondary compliance profile SID` remained `BU_TEST_SECONDARY_PROFILE`;
- no raw identity evidence was stored.

Outcome:

- RightOnQ can now track the lifecycle of a Twilio-managed evidence exception while keeping the current static app / Sheet path free of sensitive identity documents.

### Slice 7A Completed - Commercial Gateway Mechanics Draft

Bugs approved moving into the commercial/payment entry direction after the `RightOnQ UK` / `RightOnQ Global` pricing model was settled.

RCS-Twilio-4 added the first customer-facing commercial gateway mechanics to `rcs-registration/index.html`.

Current gateway behaviour:

- page now introduces the RCS sender registration as a managed RightOnQ journey;
- customer must choose either:
  - `RightOnQ UK` at `£25/month + VAT after approval`; or
  - `RightOnQ Global` at `£49/month + VAT after approval`;
- customer must acknowledge the `£100 + VAT` registration handling fee and refund terms before continuing into Part A;
- `Complete Part A` now validates the plan choice and acknowledgement before scrolling into the form;
- the selected plan, monthly base fee, registration fee, VAT treatment, acknowledgement, and billing status are included in the Part A payload;
- review/export data now includes:
  - selected RightOnQ plan;
  - monthly base fee;
  - registration fee acknowledgement.

Proof/tooling adjustment:

- `rcs-registration/tools/proof-public-part-a-submit.mjs` now uses `RightOnQ UK` instead of stale `Local Time Only`;
- proof payload now includes:
  - `packageName = RightOnQ UK`;
  - `packageInterest = RightOnQ UK`;
  - `monthlyBaseFeeGbp = 25`;
  - `registrationFeeGbp = 100`;
  - `registrationFeeVatTreatment = + VAT`;
  - `registrationFeeAcknowledgement = Confirmed`;
  - `billingStatus = registration_fee_pending`.

Parked future polish:

- `RightOnQ RCS Application Future Amendments.md` now records the opening storyboard idea, 4-6 week calm-process wording, month-end plan-change wording, no pro-rata-credit boundary, and desktop/laptop/tablet-first completion priority.

Important limitation:

- this is not live Revolut checkout yet;
- it is the pre-payment/customer gateway mechanics and data capture layer only;
- the final intended flow remains payment first, then private application link, then Part A.

Verification run:

- `git diff --check -- rcs-registration/index.html rcs-registration/tools/proof-public-part-a-submit.mjs`;
- `node --check rcs-registration/tools/proof-public-part-a-submit.mjs`;
- inline script syntax check against `rcs-registration/index.html`;
- local preview server reachable at `http://localhost:8902/rcs-registration/index.html`.

### Slice 7B Completed - Billing Tracking Sheet And Operator Tool

RCS-Twilio-4 added the internal billing/payment tracking lane needed before live Revolut integration.

Apps Script changes:

- new `Billing` sheet;
- new guarded `action = updateBilling`;
- `getOperatorSnapshot` now returns the latest `Billing` row;
- `createApplicationDraft` queues a default Billing row;
- Part A submission also queues/updates a Billing row;
- billing updates write a `billing_updated` status event and update `Applications.Billing status`;
- Apps Script version `23` deployed the first billing action;
- Apps Script version `24` added safe defaults so billing updates carry `Registration fee GBP = 100`, `Registration fee VAT treatment = + VAT`, `Refund status = not_required`, and `Usage/top-up status = not_started` unless specifically overridden.

New tool:

- `rcs-registration/tools/operator-billing.mjs`

The tool is PIN-gated through `RCS_ONBOARDING_OPERATOR_PIN` and is designed to store only:

- payment provider IDs;
- checkout/order IDs;
- payment IDs;
- payment method IDs;
- payment statuses;
- timestamps;
- refund statuses/reasons;
- monthly plan/billing-start metadata;
- operator notes.

Safety boundary:

- do not store card numbers, CVV, raw card data, bank credentials, or sensitive payment data in the app, Sheet, docs, commands, or chat.

Live proof application:

- `ROQ-RCS-TEST-PUBLIC-PARTA-20260514211901`

Proof command:

- ran `operator-billing.mjs` with fake Revolut-style IDs:
  - `billingStatus = registration_fee_paid`;
  - `paymentProvider = revolut`;
  - `checkoutOrderId = order_TEST_REG_FEE`;
  - `paymentId = pay_TEST_REG_FEE`;
  - `paymentStatus = paid`;
  - `paymentReceivedAt = 2026-05-15T13:45:00Z`;
  - `monthlyPlan = RightOnQ UK`;
  - `monthlyBaseFeeGbp = 25`;
  - `refundStatus = not_required`;
  - `internalNotes = Live billing proof only. No card data stored.`

Proof result:

- operator response returned `ok = true`;
- `Applications.Billing status = registration_fee_paid`;
- snapshot included a populated `billing` object;
- `Status events` included `billing_updated`;
- no card data was stored.

Known context:

- the proof application was created before the new commercial gateway fields existed, so its `Applications.Package interest` still shows stale `Local Time Only`;
- new proof payloads now use `RightOnQ UK`;
- version `24` fixes default billing fee fields for future billing updates.

### External Read-Only Sanity Check - Claude Code

Bugs asked Claude Code to read, in read-only mode:

- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.

Claude made no edits.

Useful positive findings:

- three-lane split is correct:
  - commercial/payment;
  - Trust Hub KYC + UK RC Bundle;
  - RCS sender registration;
- CRM-to-onboarding handoff contract is clean;
- no raw ID storage is enforced in code/field shape, not just policy;
- PIN-gated operator actions, CLI wrappers, `safeCell`, and `mostAdvancedStatus` are good pilot-stage safeguards;
- manual communications queue is the correct risk posture during pilot;
- rep-count history has been corrected again by the later Isa/Twilio follow-up: two reps are needed for Secondary Profile readiness, with the public-form UX still to be decided.

Concerns to keep visible:

- current Apps Script web app mixes anonymous public submissions and PIN-gated operator actions in one deployment;
- before public launch, operator actions should move to a private deployment or equivalent hardened path;
- anonymous Part A submission should be token/payment gated before public website traffic is sent to it;
- current status model may need simplification later, because lifecycle/billing/compliance are separate axes;
- Sheets are acceptable for pilot but should have a migration tripwire before concurrency/operator volume grows;
- no real customer or real Twilio submission has gone through end-to-end yet.

Priority recommendation accepted by RCS-Twilio-4:

1. run `Slice 8 - Revolut Sandbox Proof`;
2. harden anonymous/public versus operator endpoint exposure before public launch;
3. verify RightOnQ's Twilio ISV/subaccount/embeddable capabilities;
4. run one real RightOnQ/client application end-to-end;
5. only then expand more Trust Hub/RC fields.

### Slice 8A Started - Revolut Sandbox Proof Prep

RCS-Twilio-4 checked current Revolut Merchant documentation and created the first local proof assets.

Files added locally:

- `rcs-registration/REVOLUT_SANDBOX_PROOF.md`;
- `rcs-registration/tools/revolut-sandbox-proof.mjs`.

Official Revolut doc points captured in the proof plan:

- sandbox API calls use `https://sandbox-merchant.revolut.com/` instead of production;
- Hosted Checkout Page via API creates a backend order and returns an order `id` plus `checkout_url`;
- order/payment status should be verified server-side through webhooks or polling;
- Subscriptions API supports plans, variations, hosted onboarding/setup orders, automatic charging of saved payment methods, lifecycle tracking, and billing-cycle history;
- hosted subscription setup can save the customer payment method for future billing cycles;
- saved payment methods are generated as part of payment/setup, not manually created by RightOnQ;
- merchant-initiated later charges require a saved payment method ID/type;
- webhooks support order events including `ORDER_AUTHORISED` and `ORDER_COMPLETED`, but event delivery order is not guaranteed.

Proof helper behaviour:

- `node rcs-registration/tools/revolut-sandbox-proof.mjs --dry-run` prints the intended sandbox order request without needing a secret;
- intended first live sandbox call is a `GBP 120.00` order for the `GBP 100 + VAT` registration handling fee;
- live sandbox calls require `REVOLUT_MERCHANT_API_SECRET` in the local environment;
- no Revolut API secret should be pasted into chat or committed to the repo.

Verification run:

- `node --check rcs-registration/tools/revolut-sandbox-proof.mjs`;
- `node rcs-registration/tools/revolut-sandbox-proof.mjs --dry-run`;
- `git diff --check -- rcs-registration/REVOLUT_SANDBOX_PROOF.md rcs-registration/tools/revolut-sandbox-proof.mjs`.

Current blocker for actual Revolut API proof:

- Bugs/RightOnQ needs a Revolut Business Sandbox Merchant account and sandbox Merchant API Secret key.
- Keep it local only, preferably via environment variable or future secret-loader helper.

Follow-up refinement from external read-only sanity check:

- do not assume "subscription" means Stripe-style managed billing;
- prove both Revolut Subscriptions API and RightOnQ-owned monthly MIT charges against a saved payment method;
- use the onboarding `applicationId` as the Revolut order reference where supported;
- prove `Idempotency-Key` handling so retries do not create duplicate orders;
- prove refund behaviour for full and partial refunds before relying on the `£100 + VAT` refund policy;
- capture at least one negative path such as declined card, 3DS failure, or abandoned checkout;
- capture webhook signature/timestamp header shape and verification behaviour;
- keep endpoint hardening as a pre-public-launch blocker:
  - no public website link before payment/token gating;
  - operator actions should move away from the anonymous deployment;
  - Adam MailApp notifications need throttling or Communications-queue-only handling;
  - `changedBy` remains spoofable until operator auth is hardened.

Helper update:

- `revolut-sandbox-proof.mjs` now supports `--application-id` and `--idempotency-key`;
- dry-run output prints the intended `merchant_order_data.reference` and idempotency header shape without printing secrets.

### Slice 8B Started - Public Endpoint Hardening

RCS-Twilio-4 started the first no-regrets endpoint hardening slice after the external sanity check.

Code changes:

- `Code.gs` now routes public Part A submissions through `validatePartAPublicSubmissionAccess`;
- public Part A submission requires an existing application record and a matching private application token;
- unknown application IDs no longer fall through into row creation;
- public Part A submission is allowed only while `Part A status` is `draft` or `part_a_changes_needed`;
- `PART_A_PAYMENT_GATE_MODE` script property controls payment enforcement:
  - default/missing value = `advisory`;
  - `strict` requires `Applications.Billing status` to be `registration_fee_paid`, `registration_fee_manually_confirmed`, or `registration_fee_waived`;
- default is intentionally advisory until Revolut payment confirmation is wired end-to-end;
- Adam `MailApp.sendEmail` notifications are now rate-limited per notification type:
  - 5 emails per 10-minute window per type;
  - affected notification types: Part A, name/logo, video;
  - client Communications queue rows are still written independently.

Proof helper update:

- `proof-public-part-a-submit.mjs` now first sends a fake public Part A submission with a fake application/token and expects rejection;
- only after that blocked-public proof does it create a legitimate private application, submit Part A, and read the operator snapshot.

Deployment:

- Apps Script pushed with `clasp push`;
- version `25` created with description `Harden public Part A submission`;
- existing deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` updated to version `25`.

Live no-PIN proof:

- sent a fake public Part A submission directly to the deployed web app;
- response was:
  - `ok = false`;
  - `error = This application link could not be verified. Please ask RightOnQ for a fresh link.`;
- this confirms unknown application IDs can no longer create rows through the public branch.

Full v25 private-link proof:

- Bugs ran `node rcs-registration/tools/proof-public-part-a-submit.mjs` with local create/operator PINs;
- test application:
  - `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
- blocked-public step:
  - `ok = false`;
  - `rejected = true`;
  - error matched the private-link verification message;
- private application creation:
  - `ok = true`;
  - `registrationStatus = application_created`;
  - `partAStatus = draft`;
  - private application link present;
- valid Part A submission:
  - `ok = true`;
  - `submissionId = RCS-20260515-PUBLIC-PARTA-PROOF`;
  - `registrationStatus = part_a_submitted`;
  - `receivedAt = 2026-05-15T15:17:55.506Z`;
- snapshot confirmed:
  - `application.registrationStatus = part_a_submitted`;
  - `application.partAStatus = part_a_submitted`;
  - `billing.present = true`;
  - `billing.billingStatus = registration_fee_pending`;
  - `billing.paymentProvider = not_selected`;
  - `billing.paymentStatus = not_started`;
  - `billing.monthlyPlan = RightOnQ UK`;
  - `billing.monthlyBaseFeeGbp = 25`;
  - `internalReview.reviewStatus = pending_review`;
  - `internalReview.kycTrustHubCheck = pending_trust_hub_review`;
  - `internalReview.smsFallbackRcBundleCheck = pending`;
  - `trustHubKyc.present = true`;
  - `trustHubKyc.status = not_started`;
  - `ukRcBundle.present = true`;
  - `ukRcBundle.status = not_started`;
  - `ukRcBundle.fallbackRequired = to_be_confirmed`;
  - queued communication includes `part_a_received`.

Still not solved in this slice:

- operator actions still share the anonymous Apps Script deployment and are PIN guarded;
- `changedBy` is still operator-supplied/spoofable until per-operator auth exists;
- public website must not link to the gateway until token/payment gating and operator split are launch-ready.

### Slice 8C Started - Operator/Public Split Foundation

RCS-Twilio-4 started the split carefully as a tooling/docs foundation, without changing live deployment behaviour.

Current action classification:

- public/customer:
  - default anonymous Part A submit branch;
  - `submitNameLogoApproval`;
  - `submitVideoApproval`;
- operator/internal:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`.

Tooling change:

- all `operator-*.mjs` tools now resolve the endpoint in this order:
  - `RCS_ONBOARDING_OPERATOR_WEB_APP_URL`;
  - `RCS_ONBOARDING_WEB_APP_URL`;
  - built-in current deployment URL;
- `proof-public-part-a-submit.mjs` now resolves:
  - public submits through `RCS_ONBOARDING_PUBLIC_WEB_APP_URL` first;
  - operator create/snapshot calls through `RCS_ONBOARDING_OPERATOR_WEB_APP_URL` first;
  - `RCS_ONBOARDING_WEB_APP_URL` remains the combined-deployment fallback.

Why this matters:

- once a private operator deployment exists, local tools can point operator traffic at it without code changes;
- current pilot commands continue to work against the existing combined deployment;
- no new secrets or endpoints were committed.

Open implementation choice:

- verify whether Apps Script can support one project with two web app deployments using different access settings cleanly from the UI/manifest; if not, create a separate operator Apps Script project sharing the same Sheet and deploy it as RightOnQ-only.

### Slice 8D Attempted - Authenticated Operator API

RCS-Twilio-4 investigated the next operator/public split step.

Finding:

- a domain/private web app is not a clean fit for the terminal tools because Node `fetch` does not carry a browser Google login session;
- better candidate is Apps Script API execution (`clasp run` / scripts.run) for operator actions.

Implemented scaffold in `Code.gs`:

- new top-level function `rcsOperatorAction(payload)`;
- allowed actions only:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`;
- public customer actions are not routed through this function.

Manifest:

- added `executionApi.access = DOMAIN`.

Proof attempts:

- pushed Apps Script head with the scaffold;
- first tried `executionApi.access = MYSELF`;
- created version `26` / deployment `Authenticated operator API`;
- `clasp run rcsOperatorAction --params '[{"action":"getOperatorSnapshot","applicationId":"ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747"}]'` failed with a permission error;
- changed to `executionApi.access = DOMAIN`;
- created version `27` / deployment `Operator API domain access`;
- the same read-only proof still failed with permission/API executable errors;
- `clasp run --nondev ...` also failed;
- `clasp apis` returned `GCP project ID is not set, unable to continue.`

Cleanup:

- deleted failed deployment `AKfycbxYROXkOQmoT4eP0Z9CrWdvfuLtotZrh9OMCVjl31xC5TbvIsgOtP2p-rDwbz6TpYQh`;
- deleted failed deployment `AKfycbyiJftrD96DGcOKHoPxk1Yh-UtsI-eoFhYX1_chm2HTSz9NJGBHccQw36N54ob_gYnr`;
- confirmed deployments list is back to:
  - HEAD;
  - public v25 `Harden public Part A submission`;
  - original v1 intake receiver.

Current conclusion:

- at this point in the timeline, public v25 deployment was still the safe live endpoint;
- authenticated operator API is the preferred design, but blocked until the Apps Script project is associated with a standard Google Cloud project and the required Apps Script API / Execution API setup is complete;
- do not loosen `executionApi.access` to `ANYONE`.

### Slice 8D Continued - Operator API Executable Created

Step 2A was completed in the Apps Script UI by the browser-side helper agent:

- standard Google Cloud project linked:
  - project name: `RightOnQ-GOG`;
  - project ID: `rightonq-gog`;
  - project number: `872475523113`;
- Apps Script API was enabled on that standard project;
- API executable deployment was created without selecting Web app:
  - deployment ID `AKfycbzogKHOijtu6kjp2MVrL9WcVuF6mWrgQyKUzQGRvpTfozdUSA9y_B6X_eWpQeQ-mWtS`;
  - version `28`;
  - description `Operator API executable (Step 2A)`;
  - access `Anyone within rightonq.co.uk`.

RCS-Twilio-4 then verified locally:

- `clasp deployments` showed the same API executable alongside the existing public v25 deployment;
- `.clasp.json` was updated with `projectId: rightonq-gog` and the API executable deployment ID;
- `clasp apis` now runs successfully instead of returning `GCP project ID is not set`;
- public web app v25 still responds to GET with the service JSON;
- fake anonymous public Part A POST is still rejected with `This application link could not be verified. Please ask RightOnQ for a fresh link.`

Important local fix:

- while checking Step 2B, RCS-Twilio-4 found that `rcsOperatorAction(payload)` routed operator actions without re-checking the PIN guard;
- patched `rcsOperatorAction` so:
  - `createApplicationDraft` requires the create PIN;
  - every other operator action requires the operator PIN;
- pushed the patch to Apps Script HEAD with `clasp push --force`;
- redeployed the same API executable deployment ID as version `29` with description `Operator API executable (Step 2B pin guard)`;
- confirmed deployments remain:
  - HEAD;
  - public v25 `Harden public Part A submission`;
  - original v1 intake receiver;
  - API executable v29 `Operator API executable (Step 2B pin guard)`.

Remaining Step 2B blocker:

- `clasp run rcsOperatorAction --params '[{"action":"getOperatorSnapshot","applicationId":"ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747"}]'` currently stops before function execution with `Unable to run script function. Please make sure you have permission to run the script function.`;
- `clasp run rcsOperatorAction --nondev ...` currently returns `Script function not found. Please make sure script is deployed as API executable.`;
- therefore the live API execution proof is still not complete;
- likely next check is OAuth / execution-authorisation against the linked standard GCP project, plus UI verification that the API executable remained API-only after the CLI redeploy to version 29.

Do not proceed to website integration until this operator API execution proof is either fixed or deliberately deferred with a documented fallback.

### Slice 8D Continued - Clean API-Only Deployment Created

The browser-side helper agent created a fresh API-only deployment after the v29 deployment was accidentally contaminated by `clasp deploy -i`.

Clean deployment:

- deployment ID `AKfycbyG5yW-r0sfaKt1bwUUGFAHHdQoKK8wBCfR1riVxvYamu9YhfOBpRJhnRL_5iBP0VSC`;
- version `30`;
- description `Operator API executable (Step 2C clean API-only)`;
- type `API executable only`;
- access `Anyone within rightonq.co.uk`;
- success/configuration screen showed no Web app section.

Local follow-up:

- `.clasp.json` now points at the clean v30 deployment ID;
- `clasp deployments` shows five deployments:
  - HEAD;
  - clean API-only v30;
  - public v25 `Harden public Part A submission`;
  - original v1 intake receiver;
  - contaminated v29 `Operator API executable (Step 2B pin guard)`;
- `clasp run rcsOperatorAction --nondev ...` still reports `Script function not found. Please make sure script is deployed as API executable.`;
- `clasp run rcsOperatorAction ...` still reports `Unable to run script function. Please make sure you have permission to run the script function.`

Critical warning:

- do not run `clasp deploy -i` against the clean v30 deployment while `appsscript.json` still contains the `webapp` block;
- if a future code update needs an API-only deployment, create/update it carefully through the Apps Script UI with only API executable selected, or first remove public web app deployment settings from the manifest and confirm the public web app path is not affected.
- Later update: public web app moved to v31 in Slice 8F.

Recommended next step:

- contaminated deployment `AKfycbzogKHOijtu6kjp2MVrL9WcVuF6mWrgQyKUzQGRvpTfozdUSA9y_B6X_eWpQeQ-mWtS` was archived by the browser-side helper after Bugs approval;
- `clasp deployments` now shows only:
  - HEAD;
  - clean API-only v30;
  - public v25 `Harden public Part A submission`;
  - original v1 intake receiver;
- continue original Step 2B items 2-4: inspect/create Desktop OAuth client for `rightonq-gog`, download JSON locally without pasting contents, and retry the read-only `rcsOperatorAction` proof.

### Slice 8D Completed - Clean Operator API Proof

OAuth / credentials:

- existing Desktop OAuth client `RightOnQ-GOG-Client` was found in `rightonq-gog`;
- original local JSON was found at `/Users/macpro/Downloads/rightonq-gog-client.json`;
- only metadata was inspected; client secret contents were not printed;
- clasp required a `localhost` redirect URI, while the existing JSON used `127.0.0.1`;
- created local-only derived file `/Users/macpro/Downloads/rightonq-gog-client-clasp-localhost.json` with `http://localhost` added to `redirect_uris`;
- logged in with named clasp user `rightonq-gog` using the existing Desktop OAuth client;
- refreshed login with the extra `https://www.googleapis.com/auth/spreadsheets` scope after the first API execution reached Apps Script but lacked Spreadsheet access.

Proof:

- `clasp -u rightonq-gog show-authorized-user` reports `adam@rightonq.co.uk` with the user-provided OAuth client;
- no-PIN `clasp -u rightonq-gog run rcsOperatorAction ...` reaches Apps Script and correctly fails with `Invalid onboarding operator PIN`;
- valid-PIN `rcsOperatorAction` read-only snapshot for `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747` returned `ok: true`;
- snapshot included application, billing, internal review, Trust Hub KYC, UK RC Bundle, and queued communications blocks.

Header drift fix:

- the first valid snapshot showed Trust Hub KYC fields shifted under wrong headings;
- cause was existing Sheet headers created before the newer evidence columns existed;
- patched `getOrCreateSheet` / operator snapshot readback so tracked sheets are reconciled to canonical header order instead of only appending missing headers;
- pushed the patch to Apps Script HEAD;
- second valid snapshot confirmed Trust Hub KYC values now sit under the right headings.

Remaining caveat:

- normal `clasp run` works and proves the operator API route against Apps Script HEAD;
- `clasp run --nondev` still reports `Script function not found. Please make sure script is deployed as API executable.`;
- do not use `clasp deploy -i` against the clean v30 deployment while the manifest still contains public web app deployment settings.

### Slice 8E Completed - Operator Wrappers Use Authenticated API

RCS-Twilio-4 moved the local operator wrappers away from the public/combined web-app POST path.

Implemented:

- added `rcs-registration/tools/operator-api-client.mjs`;
- it reads the named local clasp credential `rightonq-gog` from `~/.clasprc.json`;
- it refreshes a Google access token locally;
- it reads the clean API executable deployment ID from `rcs-registration/google-apps-script/.clasp.json`;
- it calls `https://script.googleapis.com/v1/scripts/{deploymentId}:run` with function `rcsOperatorAction` and `devMode: false`;
- the operator PIN/create PIN now travels in the HTTPS request body, not in a `clasp run --params` command-line argument.

Updated wrappers:

- `operator-create-application.mjs`;
- `operator-status.mjs`;
- `operator-review.mjs`;
- `operator-trusthub-kyc.mjs`;
- `operator-rc-bundle.mjs`;
- `operator-billing.mjs`;
- `proof-public-part-a-submit.mjs` for its operator create/snapshot legs only.

Public path preserved:

- `proof-public-part-a-submit.mjs` uses the public v31 web app for blocked/valid customer Part A submissions;
- public customer B2/B3 paths are unchanged.

Proof:

- all tool files passed `node --check`;
- dry-run outputs still redact PINs/tokens;
- `operator-status.mjs` live proof returned strict JSON with `ok: true` for `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
- Trust Hub KYC, UK RC Bundle, Billing, Internal Review, Application, and queued communication blocks were present.

### Slice 8F Completed - Public Operator Action Block

RCS-Twilio-4 acted on the Ford Co / Claude read-only review that found operator actions were still reachable through the anonymous public `doPost` web app.

Implemented:

- `doPost` now rejects these operator-only actions before opening the Sheet:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`;
- public customer actions remain on the web app:
  - default Part A submission;
  - `submitNameLogoApproval`;
  - `submitVideoApproval`;
- `operator-api-client.mjs` now throws if the Apps Script Execution API response lacks `response.result`;
- `operator-api-client.mjs` now uses `.clasp.json.deploymentId` with `devMode: false`, so wrapper calls are pinned to the clean API executable deployment instead of Apps Script HEAD;
- `proof-public-part-a-submit.mjs` now gives a clear error if the operator API does not return `privateApplicationLink`;
- `.gitignore` now blocks common local clasp / Google OAuth client secret filename patterns;
- local credential file permissions were tightened to owner-only `600` for:
  - `/Users/macpro/.clasprc.json`;
  - `/Users/macpro/Downloads/rightonq-gog-client.json`;
  - `/Users/macpro/Downloads/rightonq-gog-client-clasp-localhost.json`.

Deployment:

- Apps Script HEAD was pushed with `clasp push --force`;
- Apps Script version `31` was created with description `Disable public operator actions`;
- the existing public web app deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` was updated through the Apps Script UI to version `31`;
- public deployment description is now `Harden public Part A submission + block public operator actions`;
- public web app URL is unchanged;
- public deployment has no API executable section;
- later update: the v30 clean operator API deployment was superseded during Slice 8H by the v33 clean API-only deployment recorded below.

Verification:

- all `rcs-registration/tools/*.mjs` files passed `node --check`;
- `Code.gs` passed a local syntax parse;
- live public web app POST proof for an operator action returned:
  - `ok: false`;
  - `rejected: true`;
  - `Operator action is not supported on the public endpoint...`;
- dummy-PIN proof against the clean API executable deployment reached `rcsOperatorAction` and returned `Invalid onboarding operator PIN`.

Superseded caveat:

- this caveat applied before Slice 8H;
- the current clean operator API deployment now points at version `33`, preserving no-Web-app exposure.

### Slice 8G Started - Revolut Sandbox Proof Harness

RCS-Twilio-4 moved back into the Revolut sandbox slice after public/operator endpoint hardening was completed and pushed.

Official Revolut docs refreshed on 2026-05-15 before changing the local helper:

- Hosted Checkout API creates orders server-side and returns `id` plus `checkout_url`; the Merchant API secret must not be exposed to frontend code.
- `merchant_order_data.reference` is used on order creation; webhook callbacks expose that same business reference as `merchant_order_ext_ref`.
- Refunds can be full or partial, but only on completed orders; use `Idempotency-Key` for refund requests.
- Merchant-initiated saved-method charges require payment methods saved for merchant use, not customer-only saved methods.
- Webhook callbacks use `Revolut-Request-Timestamp` and `Revolut-Signature`; webhook signing secrets must stay out of repo/chat.

Updated:

- `rcs-registration/tools/revolut-sandbox-proof.mjs` now supports:
  - registration order creation;
  - order retrieval;
  - order listing by reference;
  - payment-list retrieval;
  - refund proof payloads;
  - saved-method / merchant-initiated payment proof payloads.
- `rcs-registration/REVOLUT_SANDBOX_PROOF.md` now has the first live sandbox sequence and dry-run commands.
- `rcs-registration/tools/README.md` now documents the new Revolut helper commands.

Verification:

- `node --check rcs-registration/tools/revolut-sandbox-proof.mjs` passed.
- Dry-run create-order payload passed for application reference `ROQ-RCS-TEST-REVOLUT-20260515`.
- Dry-run refund payload passed with `refund-ROQ-RCS-TEST-REVOLUT-20260515`.
- Dry-run merchant-initiated saved-method payment payload passed with `mit-ROQ-RCS-TEST-REVOLUT-20260515`.

No live Revolut call has been made yet. Next action is to get/use a sandbox Merchant API secret locally through an environment variable, then run one create-order sandbox proof with a fixed idempotency key.

### Slice 8G Continued - Revolut Webhook Signature Proof

RCS-Twilio-4 added the local webhook verification part of the Revolut sandbox proof before any real Revolut secret was available.

Official Revolut doc points confirmed on 2026-05-15:

- webhook callbacks include `Revolut-Request-Timestamp` and `Revolut-Signature`;
- the payload to sign is `v1.{timestamp}.{raw payload}`;
- HMAC SHA-256 is computed with the webhook signing secret;
- the expected signature header value is `v1=<hex digest>`;
- multiple comma-separated signatures can appear while webhook signing secrets rotate;
- Revolut recommends a 5-minute timestamp tolerance.

Updated:

- added `rcs-registration/tools/revolut-webhook-verify.mjs`;
- updated `rcs-registration/REVOLUT_SANDBOX_PROOF.md`;
- updated `rcs-registration/tools/README.md`;
- updated `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`.

Tool behaviour:

- `--self-test` uses fake sample data only and needs no secret;
- real captured sandbox samples use `REVOLUT_WEBHOOK_SIGNING_SECRET` from the local environment;
- the tool does not print webhook signing secrets or computed HMACs;
- verification extracts `event`, `order_id`, and `merchant_order_ext_ref` for operator routing checks;
- raw payload bytes/string must be preserved exactly because JSON reformatting changes the signature.
- follow-up polish after read-only review:
  - `--payload` is now labelled debug-only;
  - docs steer real samples to `--payload-file`;
  - mismatch output hints at trailing newline / formatting / JSON re-serialisation problems;
  - docs state that `--skip-timestamp-tolerance` is CLI-only and must not be copied into the future live webhook endpoint.

Verification:

- `node --check rcs-registration/tools/revolut-webhook-verify.mjs` passed;
- `node rcs-registration/tools/revolut-webhook-verify.mjs --self-test` passed:
  - valid fake callback verified;
  - tampered payload failed signature matching;
  - stale timestamp failed the 5-minute replay window while still proving HMAC matching.

Still not done:

- no live Revolut API call has been made;
- no sandbox webhook has been registered;
- no real `REVOLUT_WEBHOOK_SIGNING_SECRET` has been used;
- next secret-dependent step is still one sandbox registration-fee order with a fixed `Idempotency-Key`, followed by capturing one webhook payload/headers and verifying it locally.

### Slice 8G Continued - Revolut Webhook Billing Mapper

RCS-Twilio-4 added a second offline helper so a verified Revolut webhook can be mapped into the Billing lane without writing to the Sheet.

Added:

- `rcs-registration/tools/revolut-webhook-map.mjs`.

Purpose:

- read a verified Revolut webhook payload from `--payload-file`;
- use `merchant_order_ext_ref` as the RightOnQ `applicationId`;
- use `order_id` as the Revolut checkout/order ID;
- map core events into proposed Billing values:
  - `ORDER_COMPLETED` -> `billingStatus = registration_fee_paid`, `paymentStatus = paid`;
  - `ORDER_AUTHORISED` -> keep `registration_fee_pending`, `paymentStatus = authorised`;
  - `ORDER_CANCELLED` -> `registration_fee_cancelled`;
  - `ORDER_FAILED` / `ORDER_PAYMENT_FAILED` -> `registration_fee_failed`;
  - `ORDER_PAYMENT_DECLINED` -> `registration_fee_failed`, `paymentStatus = declined`;
  - challenge/authenticated payment events stay pending;
- print a `dedupeKey`, `operatorBillingArgs`, and an `operator-billing.mjs --dry-run` command.

Safety boundary:

- the mapper performs no network calls;
- it does not call Apps Script;
- it does not need or read RCS PINs;
- it should be run only after `revolut-webhook-verify.mjs` has accepted the signature/timestamp.

Verification:

- `node --check rcs-registration/tools/revolut-webhook-map.mjs` passed;
- `node rcs-registration/tools/revolut-webhook-map.mjs --self-test` passed for:
  - `ORDER_COMPLETED` -> paid mapping;
  - `ORDER_PAYMENT_DECLINED` -> failed/declined mapping.

### End-of-Day Checkpoint - 2026-05-15

Pushed state:

- latest pushed commit on `rcs-registration-part-a-b-20260507`: `5abec7e Map Revolut webhooks to billing dry runs`;
- branch is in sync with origin for all RCS work;
- unrelated website/legal working-tree files remain dirty and intentionally untouched:
  - `index.html`;
  - `privacy.html`;
  - `terms.html`;
  - `RightOnQ Website Future Amendments.md`.

Next job:

- get the Revolut Business Sandbox Merchant API Secret from Revolut Business Sandbox;
- do not paste the secret into chat, docs, commits, screenshots, or command examples;
- use a local terminal prompt/environment flow only;
- run the first live sandbox registration-fee order proof with:
  - `amount = 12000` minor units (`GBP 120.00`, representing `GBP 100 + VAT`);
  - a fixed `Idempotency-Key`;
  - the RightOnQ `applicationId` as the Revolut reference;
- repeat the same idempotency-key call to prove duplicate protection;
- then retrieve/list the order, complete sandbox checkout, capture webhook headers/payload, verify signature, map to Billing, and only then consider a live operator Billing update.

Current boundary:

- no live Revolut API call has been made;
- no Revolut secret has been used;
- no sandbox webhook has been registered;
- all current Revolut work is local/offline tooling and documentation.

### Slice 8G Continued - First Revolut Sandbox Payment Passed

RCS-Twilio-4 ran the first live Revolut Merchant sandbox Hosted Checkout proof on Saturday 16 May 2026.

Inputs:

- application/reference: `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
- amount: `12000` minor units (`GBP 120.00`, representing `GBP 100 + VAT`);
- API base URL: `https://sandbox-merchant.revolut.com/api`;
- API version: `2026-04-20`;
- secret handling: Bugs pasted the sandbox Merchant API secret only into a local silent terminal prompt, then the environment variable was unset.

Successful order/payment proof:

- create order succeeded;
- paid sandbox order ID: `6a08245f-ad3a-a1b5-848c-d0395ea20303`;
- paid order token: `dd1e2496-ac67-454c-b70f-df58d0ce1cf9`;
- customer ID: `f62fc775-9ae9-4dbf-a343-9e61d26e7443`;
- payment ID: `6a082633-a973-ac00-837c-e68c28186597`;
- final order state: `completed`;
- final payment state: `captured`;
- payment method type: `card`;
- amount/currency: `12000 GBP`.

Important findings:

- Repeating create-order with the same `Idempotency-Key` created a second pending order, not the same order. Revolut's current create-order docs do not document create-order idempotency. RightOnQ must enforce one active checkout order per application in the Billing lane before creating a new Revolut order.
- Listing by `merchant_order_data_reference` returned both orders for the application ID, so the reference is usable for reconciliation/search.
- List-order responses did not include checkout URLs; direct order retrieval did while pending. Store checkout URL/token at create time.
- The Hosted Checkout success redirect landed on a RightOnQ 404 page after payment. API state confirmed success, so this was a payment-return UX/page issue; Slice 8I adds `payment-return.html` for future checkout tests.
- `--retrieve-payments` initially printed zero because the payment-list endpoint returns an array directly rather than `{ payments: [...] }`. RCS-Twilio-4 patched `revolut-sandbox-proof.mjs` to handle both response shapes, then confirmed it returned the captured payment.

Verification:

- `node --check rcs-registration/tools/revolut-sandbox-proof.mjs` passed after the parser fix.
- `--retrieve-payments --order-id 6a08245f-ad3a-a1b5-848c-d0395ea20303` returned one captured payment.

Current boundary:

- first live sandbox Hosted Checkout payment proof passed;
- no production Revolut call has been made;
- no real customer card data has been handled;
- no sandbox webhook has been registered/captured yet;
- no live Billing row update has been made from this sandbox payment yet.

Next job:

- capture/register a sandbox webhook event for the completed order;
- verify the raw payload and headers with `revolut-webhook-verify.mjs`;
- map the verified event with `revolut-webhook-map.mjs`;
- then consider an `operator-billing.mjs --dry-run` followed by a live operator Billing update for the test application.

### Slice 8G Review Follow-Up - Billing Default Clobber Fixed

Bugs asked Claude Code for a read-only payment-side comb-through after the first Revolut sandbox payment proof.

Useful findings:

- no Critical issues;
- safe to proceed to webhook proof as a sandbox/local dry-run activity;
- not safe to wire the public payment gate yet;
- highest-risk code issue was `updateBilling` injecting default billing fields into every billing update.

The clobber risk:

- every `updateBilling` call previously included default values for:
  - `Registration fee GBP`;
  - `Registration fee VAT treatment`;
  - `Refund status`;
  - `Usage/top-up status`;
  - `Monthly plan`;
- because `upsertTrackingRecord` writes any mapped key present in the payload, a later unrelated billing update could reset a refunded row back to `not_required`, reset usage/top-up state, or overwrite plan/fee values.

Fix applied locally:

- `rcs-registration/google-apps-script/Code.gs` now builds `billingPayload` from explicit payload values first;
- defaults are applied only when the caller did not provide the field and the existing Billing row value is blank;
- explicit operator/webhook values still win;
- existing nonblank Billing row values are preserved.

Verification:

- `node --check --input-type=commonjs < rcs-registration/google-apps-script/Code.gs` passed.

Still not solved by this fix:

- duplicate checkout/order protection is only documented, not enforced yet;
- Billing still needs active checkout/order modelling before the public payment gate;
- refund event mapping/status design still needs completion;
- webhook event names/field paths remain assumptions until a real sandbox webhook is captured.

Next smallest safe path:

1. Capture/verify/map a sandbox webhook as dry-run proof.
2. Add active-checkout protection and checkout URL/token storage before any public payment gate.
3. Only then consider live Billing updates from payment events.

### Slice 8G Continued - Revolut Webhook Capture Verified And Mapped

RCS-Twilio-4 registered a temporary Revolut sandbox webhook pointing at webhook.site, triggered a fresh sandbox payment, captured the Revolut webhook payload/headers, verified the signature, and mapped the event to a dry-run Billing update.

Webhook registration:

- temporary capture URL: `https://webhook.site/84da51c0-7f70-4475-830a-11a8d002a81f`;
- Revolut sandbox webhook ID: `e6f32548-ffef-4f77-92fa-a0d2ae0b7dea`;
- registered events:
  - `ORDER_AUTHORISED`;
  - `ORDER_COMPLETED`;
  - `ORDER_CANCELLED`;
  - `ORDER_FAILED`;
  - `ORDER_PAYMENT_DECLINED`;
  - `ORDER_PAYMENT_FAILED`;
- signing secret stayed local in `/tmp/revolut-webhook-create-response.json` and was not pasted into chat or committed.

Webhook-triggering payment:

- new sandbox order ID: `6a084d13-d84d-a49b-bb44-916bb9237ba4`;
- order token: `6e705351-f49a-4dd0-b0a4-9a979dbbfe7e`;
- customer ID: `ecd04bc4-379a-411a-927e-9ed2b9f8b88d`;
- reference: `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
- payment completed through sandbox Hosted Checkout.

Webhook capture:

- webhook.site received two events for the order:
  - `ORDER_AUTHORISED`;
  - `ORDER_COMPLETED`;
- both included `Revolut-Request-Timestamp` and `Revolut-Signature`;
- the `ORDER_COMPLETED` raw payload was saved to `/tmp/revolut-webhook-5e006.json`;
- payload byte count was `145`, matching the browser-agent capture.

Signature verification:

- normal verification:
  - `signatureMatched: true`;
  - `timestampAccepted: false`;
  - reason: `timestamp_outside_tolerance`;
  - age at verification was about `707` seconds, beyond the 5-minute replay window;
- archived-sample verification with `--skip-timestamp-tolerance` returned `ok: true`;
- future live webhook endpoint must enforce timestamp tolerance. The skip flag is only for local archived samples.

Mapping:

- `revolut-webhook-map.mjs` mapped the real `ORDER_COMPLETED` payload to:
  - `billingStatus = registration_fee_paid`;
  - `paymentProvider = revolut`;
  - `checkoutOrderId = 6a084d13-d84d-a49b-bb44-916bb9237ba4`;
  - `paymentStatus = paid`;
  - `paymentReceivedAt = 2026-05-16T10:57:13.752Z`;
  - `refundStatus = not_required`;
- dedupe key:
  - `revolut:ORDER_COMPLETED:6a084d13-d84d-a49b-bb44-916bb9237ba4:ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
- `operator-billing.mjs --dry-run` printed the expected proposed update and performed no Sheet write.

Important nuance:

- the Revolut webhook payload did not include `payment_id`;
- if the Billing row needs payment ID, the real endpoint or operator flow must enrich the event by retrieving the order/payment list before writing Billing;
- no live Billing row update has been made from this webhook proof.

Next safe implementation work:

- design active-checkout/order storage so RightOnQ reuses an existing pending checkout instead of creating duplicate Revolut orders;
- design webhook endpoint pipeline: raw body -> signature/timestamp verify -> dedupe -> optional order/payment enrichment -> Billing update;
- only after that consider public payment gating.

### Slice 8H Started - Active Checkout Guard Foundation

Bugs ran a focused Claude Code read-only design review for active Revolut checkout protection.

Design decision:

- use a new `Payment orders` ledger as the active-checkout source of truth;
- keep `Billing` as a derived/operator summary, not the guard source;
- do not trust the single Billing `Checkout/order ID` cell for duplicate-checkout protection because Revolut can create multiple orders per application.

Implemented locally:

- added Apps Script sheet/tab model:
  - `Payment orders`;
- added payment-order headers:
  - `Created at`;
  - `Application ID`;
  - `Revolut order ID`;
  - `Order state`;
  - `Amount minor`;
  - `Currency`;
  - `Checkout URL`;
  - `Merchant order reference`;
  - `Idempotency key`;
  - `Payment ID`;
  - `Payment state`;
  - `Order purpose`;
  - `Superseded`;
  - `Internal notes`;
  - `Last updated`;
- added guarded operator actions:
  - `checkActiveCheckout`;
  - `recordPaymentOrder`;
- `getOperatorSnapshot` now includes:
  - `activeCheckout`;
  - recent `paymentOrders`;
- added local tool:
  - `rcs-registration/tools/operator-payment-order.mjs`.

Guard behaviour:

- if a non-superseded `completed` order exists, return `decision = already_paid`;
- if a non-superseded open order exists, return `decision = reuse` plus checkout URL/order details;
- open states currently include:
  - `creating`;
  - `pending`;
  - `processing`;
  - `authorised`;
  - `authorized`;
- otherwise return `decision = safe_to_create`.

Verification so far:

- `node --check --input-type=commonjs < rcs-registration/google-apps-script/Code.gs` passed;
- `node --check rcs-registration/tools/operator-payment-order.mjs` passed;
- dry-run `--check-active` payload printed correctly;
- dry-run `--record` payload printed correctly.

Live proof completed:

- first `operator-payment-order.mjs --check-active` against `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747` returned:
  - `decision = safe_to_create`;
  - `canCreateCheckout = true`;
  - reason `No completed or open non-superseded Revolut checkout was found for this application.`;
- `operator-payment-order.mjs --record` then appended completed sandbox order `6a084d13-d84d-a49b-bb44-916bb9237ba4` into `Payment orders`;
- recorded values included:
  - order state `completed`;
  - amount minor `12000`;
  - currency `GBP`;
  - checkout URL `https://sandbox-checkout.revolut.com/payment-link/6e705351-f49a-4dd0-b0a4-9a979dbbfe7e`;
  - merchant order reference `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
  - idempotency key `roq-rcs-webhook-proof-20260516-001`;
  - payment state `captured`;
  - order purpose `registration_fee`;
- the record response immediately returned `activeCheckout.decision = already_paid`;
- a fresh second `--check-active` call also returned:
  - `decision = already_paid`;
  - `canCreateCheckout = false`;
  - reason `A non-superseded Revolut order is already completed for this application.`;
- no card data, Revolut API secret, webhook signing secret, or operator PIN was recorded in the repo.

Still to do before public payment gate:

- later add the automated raw-body webhook endpoint with signature/timestamp verification, dedupe, enrichment, and Billing update.
- finish refund/refunded status and event mapping;
- keep this active-checkout flow operator-run until the automated public payment gate has an atomic reserve/record path.

### Slice 8H Continued - Clean API Deployment Restored

The active checkout guard code was pushed to Apps Script and versioned, but a CLI deployment refresh contaminated the previous operator API deployment with a Web app entry point. The browser-side helper agent then created a replacement API-only deployment through the Apps Script UI and archived the contaminated one.

Current clean operator API deployment:

- deployment ID `AKfycbwSdO73nyxrOKVPQVQgkoGg29RwvYmJXWDYAgFqs5cdxyI4pJXFW3cZZSS1-6y3zlex`;
- version `33`;
- description `Operator API executable (Step 8H clean API-only)`;
- type `API executable only`;
- access `Anyone within rightonq.co.uk`;
- configuration pane showed the `script.googleapis.com/v1/scripts/...` API executable URL and no Web app section.

Archived during cleanup:

- contaminated deployment `AKfycbyG5yW-r0sfaKt1bwUUGFAHHdQoKK8wBCfR1riVxvYamu9YhfOBpRJhnRL_5iBP0VSC`;
- it was at version `32` with description `Operator API executable (Step 8H active checkout guard)`;
- it exposed both Web app and API executable entry points after the deployment refresh.

Confirmed untouched:

- public web app deployment `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` remains version `31`;
- original intake receiver deployment `AKfycbyyPTV0Dl4y0_gSrFWW2e1QK5uX_pTS-3atps3Qo6Ca7NSYjHzEckDZZE1SDTiHj...` remains version `1`;
- code, script properties, OAuth settings, and PINs were not edited during the browser cleanup.

Local repo follow-up:

- `.clasp.json` now points at the clean v33 API-only deployment;
- `google-apps-script/README.md` records the current deployment and archived v32 caveat;
- do not run `clasp deploy -i` against the clean v33 deployment while the manifest still contains public web app deployment settings.

Completed live proof:

- `operator-payment-order.mjs --check-active` reached the clean v33 deployment and returned `safe_to_create`;
- `operator-payment-order.mjs --record` stored completed sandbox order `6a084d13-d84d-a49b-bb44-916bb9237ba4`;
- the immediate and follow-up active-checkout readbacks returned `already_paid` with `canCreateCheckout = false`;
- this proves the operator-run duplicate-checkout guard can stop a second checkout for an application once a completed order is in `Payment orders`.

### Slice 8I Started - Payment Return Page

RCS-Twilio-4 added a static customer-facing hosted-checkout return page so future Revolut checkout returns do not land on a generic 404.

Files changed:

- `rcs-registration/payment-return.html`;
- `rcs-registration/tools/revolut-sandbox-proof.mjs`;
- `rcs-registration/README.md`;
- `rcs-registration/REVOLUT_SANDBOX_PROOF.md`;
- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`.

Behaviour:

- future sandbox proof orders default to `https://rightonq-code.github.io/rcs-registration/payment-return.html?applicationId=...`;
- page reads `payment`, `status`, `applicationId`, `merchant_order_ext_ref`, `reference`, `order_id`, and `id` style query parameters;
- page preserves the application ID when linking back to `index.html`;
- copy is deliberately conservative: it confirms browser return from Revolut, but says payment is verified by RightOnQ using Revolut order/webhook records before registration work moves forward;
- no secrets, PINs, card data, or webhook signing values are used by the page.

Fresh sandbox return proof:

- application/reference `ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
- order ID `6a0866ef-9b11-a041-bfa2-e973e15e564d`;
- checkout token `7bd10568-e1f1-4d32-a733-0ccd9b0033f9`;
- customer ID `d565e618-f459-495c-8f7b-e1e51b8a28dd`;
- browser landed after payment on `https://www.rightonq.co.uk/rcs-registration/payment-return.html?applicationId=ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
- retrieval after payment returned order state `completed`;
- payment-list retrieval returned payment `6a08673c-80db-a36d-97a3-ec673b09e3cd` with state `captured`;
- no live Billing row update was made from this return-page proof.

Still to do before public payment gate:

- wire a real order-create path that stores the created order in `Payment orders` before exposing checkout to customers;
- build the automated webhook endpoint with raw-body signature/timestamp verification, dedupe, optional payment enrichment, and Billing update;
- finish refund/refunded status and event mapping;
- run failed/declined and refund sandbox paths.

### Slice 8J Started - B2B Registration Handling Fee Wording

Bugs clarified the commercial/refund posture:

- RightOnQ will only deal with registered businesses / companies in this onboarding flow;
- sole traders and unregistered businesses are not accepted;
- this is B2B, not a consumer checkout;
- the `£100 + VAT` charge should be described as an RCS registration handling fee, because it pays for application review, preparation, provider/compliance handling and administration;
- RightOnQ may start that handling work after payment;
- once RightOnQ has started the handling work, change-of-mind refund is not available;
- refund remains available where the application cannot proceed for reasons outside the customer's control.

Files updated:

- `rcs-registration/index.html`;
- `rcs-registration/tools/revolut-sandbox-proof.mjs`;
- `rcs-registration/REVOLUT_SANDBOX_PROOF.md`;
- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.

Visible form changes:

- gateway now says `RCS registration handling fee before work starts`;
- refund guarantee now refers to the handling fee;
- acknowledgement checkbox now confirms the customer is applying on behalf of a registered business for business purposes, asks RightOnQ to start handling work after payment, and confirms no refund once work has started except where the application cannot proceed for reasons outside the customer's control.

Tooling change:

- `revolut-sandbox-proof.mjs` now labels the Revolut proof order and line item as `RightOnQ RCS registration handling fee`.

### Slice 8K Started - Revolut Full Refund Proof

RCS-Twilio-4 continued the Revolut sandbox payment proof by running a full refund against the fresh return-page proof order.

Official docs refreshed:

- Revolut refund creates a new refund order against a completed original order;
- current refund request shape uses `merchant_order_data.reference` for the merchant's internal refund reference;
- the original order can expose the aggregate refunded amount as `refunded_amount`.

Files updated:

- `rcs-registration/tools/revolut-sandbox-proof.mjs`;
- `rcs-registration/REVOLUT_SANDBOX_PROOF.md`;
- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.

Tooling change:

- `buildRefundPayload()` now sends refund references as `merchant_order_data.reference` instead of the older/alternate `merchant_order_ext_ref` shape;
- `summariseOrder()` now includes `type`, `refundedAmount`, and `relatedOrderId` so refund/order retrieval output exposes the fields needed by the proof.

Full refund proof:

- original application/reference: `ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
- original paid order ID: `6a0866ef-9b11-a041-bfa2-e973e15e564d`;
- original payment ID: `6a08673c-80db-a36d-97a3-ec673b09e3cd`;
- refund amount: `12000 GBP`;
- refund reference: `ROQ-RCS-TEST-RETURN-PAGE-20260516-001-REFUND-001`;
- refund idempotency key: `refund-ROQ-RCS-TEST-RETURN-PAGE-20260516-001`;
- refund order ID returned: `6a0872b4-89b8-a82d-884b-703f6470c124`;
- initial refund response summary showed `type = REFUND` and `state = PROCESSING`; later direct retrieval of the refund order showed lowercase `type = refund` and `state = completed`;
- embedded refund payment ID returned: `6a0872b4-395a-a536-8ca5-0ab9c27056af`, state `COMPLETED`;
- immediate retrieval of the original order returned `refundedAmount = 12000`;
- original order remained `state = completed`, and original payment-list retrieval still returned the captured card payment.

Build impact:

- full registration-handling-fee refund is viable in Revolut sandbox;
- store refund order ID, refund payment ID where present, refund amount/currency, refund reference, original order ID, and refund status;
- do not infer refund state from the original order payment-list alone;
- real refund webhook event captured: Revolut sent `ORDER_COMPLETED` for the refund order ID, without `merchant_order_ext_ref` or refund-specific body fields.

Refund webhook proof:

- webhook.site request ID: `d6d383cf-8ea0-4ca1-ab9d-b4859ed7cd6b`;
- received: `2026-05-16 14:35:54 UTC`;
- raw payload: `{"event":"ORDER_COMPLETED","order_id":"6a0872b4-89b8-a82d-884b-703f6470c124"}`;
- `Revolut-Request-Timestamp`: `1778938554035`;
- `Revolut-Signature`: `v1=a361810e16d0e225acb184404dd1fc301ce85c2a5538e730d23b9a9618de946a`;
- local signature verification returned `signatureMatched = true` using the local webhook signing secret;
- archived-sample verification used `--skip-timestamp-tolerance`; live endpoint must enforce timestamp tolerance.

Mapper change:

- `revolut-webhook-map.mjs` now treats recognised events with missing `merchant_order_ext_ref` as `mapped = false`, `enrichmentRequired = true`;
- the self-test now includes a refund-style `ORDER_COMPLETED` payload with no application reference;
- this prevents a refund-order `ORDER_COMPLETED` webhook from being misclassified as `registration_fee_paid`.
- the mapper can now accept `--enriched-order-file` plus `--application-id` and classify the event as `refund_order`;
- enriched refund mapping produces a refund-status dry-run (`paymentStatus = refunded`, `refundStatus = refunded`, `refundProcessedAt = webhook timestamp`) without overwriting the original checkout/order ID.

Still to do before public payment gate:

- wire a real order-create path that stores the created order in `Payment orders` before exposing checkout to customers;
- build the automated webhook endpoint with raw-body signature/timestamp verification, dedupe, optional payment enrichment, and Billing update;
- implement automatic application lookup for refund webhooks from RightOnQ's ledger/original-order data before any live webhook Billing write;
- run failed/declined sandbox path.

### Slice 8L Started - Payment Order Lookup

RCS-Twilio-4 added the first read-only lookup needed by refund webhook enrichment.

Files updated:

- `rcs-registration/google-apps-script/Code.gs`;
- `rcs-registration/tools/operator-payment-order.mjs`;
- `rcs-registration/tools/README.md`;
- `rcs-registration/RCS_ONBOARDING_MAIN_BUILD_PLAN.md`;
- `rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`.

Behaviour:

- new operator action: `lookupPaymentOrder`;
- new CLI mode: `operator-payment-order.mjs --lookup --revolut-order-id <id>`;
- lookup scans the `Payment orders` ledger by Revolut order ID and returns the latest matching snapshot plus `applicationId`;
- lookup is strictly read-only: it uses `getSheetByName`, returns `found: false` if the `Payment orders` sheet is absent, and does not create/repair sheets or write Billing, Applications, Payment orders, or Status events;
- this gives the future webhook endpoint a local source of truth for resolving refund-order webhooks that arrive without `merchant_order_ext_ref`.

Local verification:

- `node --check rcs-registration/tools/operator-payment-order.mjs` passed;
- `node --check --input-type=commonjs < rcs-registration/google-apps-script/Code.gs` passed;
- dry-run `--lookup --revolut-order-id 6a084d13-d84d-a49b-bb44-916bb9237ba4` printed `action = lookupPaymentOrder`;
- dry-run `--check-active --application-id ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747` still printed `action = checkActiveCheckout`.

Deployment status:

- Apps Script code was pushed with `clasp push --force` after an OAuth refresh, then deployed through the Apps Script UI as a clean API-only operator deployment:
  - deployment ID `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9`;
  - version `35`;
  - description `Operator API executable (Step 8L lookup after push)`;
  - access `Anyone within rightonq.co.uk`;
  - no Web app section was present on the new deployment.
- `.clasp.json` now points operator wrappers at the clean v35 API-only deployment.
- Previous clean v34 operator deployment `AKfycbwPbeT3Mxpmr_Q88WdSp0hRnDk96Pm93GDTsA1eOsJxmiaVpSS2xAg78ox848YsqCQU` and v33 operator deployment `AKfycbwSdO73nyxrOKVPQVQgkoGg29RwvYmJXWDYAgFqs5cdxyI4pJXFW3cZZSS1-6y3zlex` were archived after the v35 lookup proof passed.
- Public web app `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` and the RCS Part A intake receiver were untouched.

Live lookup proof:

- first proof attempt against v34 failed with `Unsupported operator action: lookupPaymentOrder` because Apps Script code had not been pushed before v34 was created;
- after `clasp push --force`, v35 was created, but the deployment ID was initially copied with `I` instead of `l` in `_vld5`, producing `Requested entity was not found`;
- `.clasp.json` and docs now use the deployment ID confirmed by `clasp deployments`: `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9`;
- OAuth was refreshed with `spreadsheets` and `script.send_mail` scopes;
- dummy-PIN proof reached `rcsOperatorAction` and failed correctly at `Invalid onboarding operator PIN`;
- valid-PIN lookup proof for order `6a084d13-d84d-a49b-bb44-916bb9237ba4` returned:
  - `found = true`;
  - `applicationId = ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`;
  - `orderState = completed`;
  - `paymentState = captured`;
  - `amountMinor = 12000`;
  - `currency = GBP`;
  - `orderPurpose = registration_fee`.

Deployment cleanup:

- v34 archive succeeded after a ref-based Archive click and explicit `Deployment successfully archived.` success message;
- server-fresh Manage deployments reload confirmed v34 moved from Active to Archived;
- v33 archive then succeeded with the same explicit success message;
- server-fresh Manage deployments reload confirmed v33 moved from Active to Archived;
- final Active deployments are:
  - v35 clean Operator API executable `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9`;
  - public web app `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6`;
  - RCS Part A intake receiver.

## Slice 8M - Revolut Webhook Endpoint Primitives

Codex started the next endpoint-design slice after the v35 deployment cleanup.

Code change:

- `rcs-registration/tools/revolut-webhook-verify.mjs` now exports its tested verification primitives while keeping the CLI entrypoint unchanged;
- `rcs-registration/tools/revolut-webhook-map.mjs` now exports its tested mapping primitives while keeping the CLI entrypoint unchanged;
- `rcs-registration/tools/revolut-webhook-handler.mjs` adds an offline endpoint-core handler that verifies raw body + Revolut headers first, maps second, and returns a small public response plus internal diagnostics without making network calls or Sheet writes.

Verification:

- `node rcs-registration/tools/revolut-webhook-verify.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-map.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-handler.mjs --self-test` passed;
- dynamic import smoke test confirmed `verifyWebhook`, `computeSignature`, `mapWebhookPayload`, `buildOperatorBillingArgs`, and `handleRevolutWebhook` are functions and that importing the modules does not run the CLI.

Build implication:

- future live webhook endpoint should import these primitives rather than copy crypto or mapping code;
- a real endpoint should return only the handler's small public body to Revolut, not the internal diagnostics/dry-run mapping;
- endpoint host must expose the exact raw body and the `Revolut-Request-Timestamp` / `Revolut-Signature` headers;
- GitHub Pages is static and cannot receive POST webhooks;
- do not trust the existing Apps Script web app as the direct Revolut webhook entrypoint unless it separately proves access to the exact raw body and custom Revolut headers.

Post-review notes:

- Claude Code read-only sanity check found no Critical/High issues and said commit `75d0e82` is safe to leave pushed;
- low polish applied after the review: `mapping_failed` no longer exposes the parser error message in the public response body; the message is retained only in the internal diagnostics object;
- live `ORDER_COMPLETED` Billing writes must first enrich/type the order so refund-order `ORDER_COMPLETED` events are not misclassified as paid registration-fee events;
- do not re-run the full handler after a slow enrichment step; verify the signature/timestamp once at receipt, then use the mapping primitives for later internal enrichment handling;
- the earlier `updateBilling` default-clobber issue is already fixed in current `Code.gs` (`billingPayload = { ...payload }` plus `applyDefaultPayloadValue(...)`).

## Slice 8N - Webhook Host And Dedupe Design

Codex added `rcs-registration/REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md`.

Decision:

- preferred webhook host is a small Google Cloud Run function/service;
- GitHub Pages is rejected because it cannot receive webhook `POST` requests;
- existing Apps Script public web app remains untrusted as the direct Revolut receiver unless raw body and custom-header access are separately proven;
- Firestore Native mode is the recommended dedupe/event store;
- Google Sheets remains the operator-visible Billing/Payment-order state, not the dedupe source of truth.

Design boundary:

- no Cloud Run service was created;
- no Firestore database was enabled;
- no Revolut webhook URL was changed;
- no live Billing write was enabled;
- first implementation should be record-only/dry-run with automatic Billing writes disabled.

Key contract:

- endpoint path should verify raw body + Revolut headers before JSON parsing/mapping;
- dedupe key should be stored atomically before any apply step;
- `ORDER_COMPLETED` requires enrichment/type proof before any Billing write;
- refund events without `merchant_order_ext_ref` resolve application context through order enrichment plus RightOnQ Payment orders/original-order lookup;
- the endpoint should return only a small public body to Revolut and keep diagnostics internal.

Post-review correction:

- Claude Code found one High design issue: the Firestore document ID originally included `applicationId-or-resolved-context`, which would change after enrichment and could let a retry miss the applied record.
- Fixed design: Firestore document ID is now `sha256(receiptKey)` where `receiptKey = revolut:{event}:{orderId}` from payload-stable fields only.
- The richer logical/audit key is stored as a field, not used as the document identity.
- State machine now distinguishes `received`, `processing`, `enrichment_required`, `mapped`, `applied`, and `failed`; `duplicate` is a response outcome, not a stored state.
- Enrichment rules now say to always enrich `ORDER_COMPLETED` before live Billing writes, and refund-order application lookup must use the enriched original/related order ID before calling `lookupPaymentOrder`.

## Slice 8O - Revolut Declined-Attempt Proof

Codex recorded a declined-attempt sandbox proof.

Order:

- application/reference `ROQ-RCS-TEST-DECLINED-20260516-001`;
- order ID `6a08af68-51f9-ae4b-be9e-c388fc6f400e`;
- amount `12000 GBP`.

Observed payment attempts:

- first attempt declined with payment ID `6a08afb8-937c-ae29-8437-9e0045df3bac`;
- order retrieval embedded decline reason `insufficient_funds`;
- payment-list retrieval included the declined attempt but did not include the decline reason;
- same hosted-checkout order later succeeded with captured payment ID `6a08affd-b4b7-ae3e-9d39-4c3eb1c05f79`;
- final order state became `completed`.

Webhook events captured:

- `ORDER_PAYMENT_DECLINED` at timestamp `1778954177544`, request ID `6b31a6a4-4a94-4bb2-ba99-7e14dc70afb2`;
- `ORDER_AUTHORISED` at timestamp `1778954247076`, request ID `d128f21f-e2a4-433b-be4e-b70eacba560c`;
- `ORDER_COMPLETED` at timestamp `1778954247253`, request ID `b7427a92-8b26-48f7-86cb-cff5583fffeb`;
- bodies included event, order ID, and `merchant_order_ext_ref`; none included a payment ID.

Mapping proof:

- `ORDER_PAYMENT_DECLINED` dry-run mapped to `billingStatus = registration_fee_failed`, `paymentStatus = declined`;
- later `ORDER_COMPLETED` dry-run mapped to `billingStatus = registration_fee_paid`, `paymentStatus = paid`.

Implication:

- declined attempts are observable via webhook and API retrieval;
- a declined attempt is not necessarily terminal for the order because the same hosted-checkout order can later complete;
- webhook/Billing logic must process event sequence and final enrichment carefully, not collapse everything to final order state too early;
- no live Billing write was made.

## Slice 8P - Failed-Payment Mapping Prep

Codex added local fake-data coverage before the terminal failed-payment sandbox proof.

Code/docs changed:

- `revolut-webhook-map.mjs --self-test` now includes `ORDER_PAYMENT_FAILED`;
- expected mapping is `billingStatus = registration_fee_failed`, `paymentStatus = failed`;
- `revolut-webhook-handler.mjs --self-test` now signs and handles a fake `ORDER_PAYMENT_FAILED` payload through the same verify-then-map dry-run path;
- `tools/README.md` now mentions failed-payment mapping in the handler self-test description.

Verification:

- `node rcs-registration/tools/revolut-webhook-map.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-handler.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-verify.mjs --self-test` passed.

Next live sandbox proof:

- Revolut sandbox test-card docs checked on 2026-05-16 (`https://developer.revolut.com/docs/guides/accept-payments/get-started/test-implementation/test-cards`) list `4242424242424242` as the 3DS verification failure card;
- for GBP orders, the docs say the order amount must be at least `2500` minor units; the RightOnQ registration-fee proof order amount is `12000`, so it qualifies;
- expected decline reason is `customer_challenge_failed`;
- expected payment state is `failed`;
- likely webhook to capture is `ORDER_PAYMENT_FAILED`, but the proof must record the actual webhook.site event/body/headers and API retrieval result rather than assuming it.

No live Revolut call, Apps Script call, Sheet write, or Billing update was made in this slice.

## Slice 8Q - Terminal Failed-Payment Proof

Codex recorded the live terminal failed-payment sandbox proof.

Order:

- application/reference `ROQ-RCS-TEST-FAILED-20260516-002`;
- order ID `6a08b551-d18e-a506-9cfa-6a27983dd1de`;
- token `8a814a4f-773c-4bf9-b35c-e4931982c7c2`;
- amount `12000 GBP`.

Browser checkout:

- Revolut sandbox 3DS verification failure card `4242424242424242` was used;
- checkout UI displayed `3DS Verification failed. Please try to pay again or use another card`.

API retrieval:

- order state stayed `pending`;
- payment ID `6a08b5b0-1eef-af17-9eed-f34734a1db3b`;
- embedded payment state `failed`;
- embedded decline reason `customer_challenge_failed`;
- payment-list endpoint returned one failed payment but did not include the decline reason.

Webhook capture:

- webhook.site request ID `58fcd33e-85fa-4cd3-9a6d-fc6601783e89`;
- received `2026-05-16 18:21:42 UTC`;
- `Revolut-Request-Timestamp = 1778955702535`;
- `Revolut-Signature = v1=5837d22e50f9e17aa9e49bb066dc09900981be2c3d3b09afa7089e96d1f80b76`;
- raw body `{"event":"ORDER_PAYMENT_FAILED","order_id":"6a08b551-d18e-a506-9cfa-6a27983dd1de","merchant_order_ext_ref":"ROQ-RCS-TEST-FAILED-20260516-002"}`;
- body contained no payment ID, decline reason, or card data.

Mapping proof:

- captured body mapped locally with `revolut-webhook-map.mjs`;
- `ORDER_PAYMENT_FAILED` -> `billingStatus = registration_fee_failed`, `paymentStatus = failed`;
- dry-run only; no live Billing update was made.

Implication:

- this is the terminal failure counterpart to the earlier retryable declined-attempt proof;
- endpoint enrichment still matters because the webhook body omits payment ID and decline reason;
- order-level state can remain `pending` even when the payment attempt is terminally `failed`.

## Slice 8R - Local Cloud Run Webhook Skeleton

Codex added the first source-only Cloud Run / Functions Framework webhook skeleton.

Files:

- `rcs-registration/cloud-run/revolut-webhook/index.mjs`;
- `rcs-registration/cloud-run/revolut-webhook/package.json`;
- `rcs-registration/cloud-run/revolut-webhook/README.md`.

Behaviour:

- requires `POST`;
- requires exact `req.rawBody`;
- reads `REVOLUT_WEBHOOK_SIGNING_SECRET` from the runtime environment, to be Secret Manager-backed later;
- imports and calls the tested `handleRevolutWebhook` primitive;
- returns only the public response body to Revolut;
- logs only redacted record-mode fields;
- performs no Firestore write, no Revolut enrichment call, no Apps Script call, and no Billing update.

Verification:

- `npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test` passed;
- `node rcs-registration/tools/revolut-webhook-handler.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-map.mjs --self-test` passed.

Status:

- no endpoint has been deployed;
- no Revolut webhook URL has been changed;
- next implementation work is record-only Firestore dedupe and enrichment, not public payment gating.

## Slice 8S - Source-Only Webhook Dedupe

Codex added source-only dedupe primitives for the future record-only webhook endpoint.

Files:

- `rcs-registration/cloud-run/revolut-webhook/dedupe.mjs`;
- updated `index.mjs` to accept an optional dedupe store and log dedupe decisions;
- updated `package.json` with `dedupe-self-test` and `@google-cloud/firestore` as a future deployment dependency.

Behaviour:

- receipt key is payload-stable: `revolut:{event}:{orderId}`;
- Firestore document ID is `sha256(receiptKey)`;
- richer application context is kept in `logicalDedupeKey`, not in the document ID;
- duplicate terminal records return `duplicate_terminal`;
- verified-but-unmapped events are recorded as `ignored`, not `failed`;
- invalid/unverified events are not recordable;
- source includes an in-memory store for local self-tests and a Firestore adapter for future deployment wiring.

Verification:

- `npm --prefix rcs-registration/cloud-run/revolut-webhook run dedupe-self-test` passed;
- `npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test` passed;
- `node rcs-registration/tools/revolut-webhook-handler.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-map.mjs --self-test` passed.

Status:

- no endpoint has been deployed;
- no Firestore database has been enabled or written to by this work;
- no Revolut webhook URL has been changed;
- no Apps Script call or Billing update was made.

## Slice 8T - Google Cloud Boundary Plan

Codex recorded a docs-only Google Cloud boundary plan for the Revolut webhook endpoint.

Decision direction:

- low payment volume means correctness/auditability/duplicate safety matter more than throughput;
- use managed Google Cloud pieces rather than a custom server;
- candidate Google Cloud project is `rightonq-gog`, but it must be confirmed in the console before any action;
- runtime remains Cloud Run functions / Functions Framework Node.js source deployment;
- dedupe/event store remains Firestore Native mode;
- secrets belong in Secret Manager;
- first deployed endpoint must be record-only.

Proposed secret names:

- `roq-rcs-revolut-webhook-signing-secret-sandbox`;
- `roq-rcs-revolut-merchant-api-secret-sandbox`;
- future live secrets must use separate `...-live` names.

Explicitly forbidden until approved:

- enabling Firestore;
- creating Secret Manager secrets;
- creating service accounts or IAM grants;
- deploying Cloud Run;
- changing Revolut webhook URL;
- enabling automatic Apps Script Billing writes;
- enabling strict public payment gating from webhook state.

No cloud command, console action, deployment, Firestore write, secret creation, Revolut URL change, Apps Script call, or Billing update was made in this slice.

## Slice 8U - Cloud Webhook Rejection Logging

Codex tightened the source-only Cloud Run / Functions Framework webhook skeleton's observability.

Files:

- `rcs-registration/cloud-run/revolut-webhook/index.mjs`;
- `rcs-registration/cloud-run/revolut-webhook/README.md`;
- this handover and the build plan.

Change:

- `handleHttpRequest` now logs redacted record-only entries for early rejections before handler/dedupe processing:
  - non-`POST` requests -> `method_not_allowed`;
  - missing `req.rawBody` -> `raw_body_unavailable`.
- The missing-signing-secret path remains handled by the shared webhook handler and is logged as `not_recordable` when a dedupe store is present.

Safety:

- rejection logs include method/status/reason and dedupe state only;
- they do not include raw body, Revolut signature, signing secret, Merchant API secret, PIN, OAuth credential, card data, or HMAC;
- public HTTP responses are unchanged.

Verification:

- `node --check rcs-registration/cloud-run/revolut-webhook/index.mjs` passed;
- `npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test` passed;
- `npm --prefix rcs-registration/cloud-run/revolut-webhook run dedupe-self-test` passed;
- `node rcs-registration/tools/revolut-webhook-handler.mjs --self-test` passed.

Status:

- no endpoint has been deployed;
- no Firestore database has been enabled or written to by this work;
- no Revolut webhook URL has been changed;
- no Apps Script call or Billing update was made.

## Slice 8V - Source-Only Revolut Order Enrichment Helper

Codex added the first source-only enrichment helper for the future record-only webhook endpoint.

Files:

- `rcs-registration/cloud-run/revolut-webhook/enrich.mjs`;
- `rcs-registration/cloud-run/revolut-webhook/package.json`;
- `rcs-registration/cloud-run/revolut-webhook/README.md`;
- `rcs-registration/REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md`;
- this handover and the build plan.

Behaviour:

- retrieves `/orders/{order_id}` through an injected `fetch` implementation;
- builds Merchant API headers from a supplied secret, but the helper never prints or returns the secret;
- summarises order/payment fields without returning order tokens, full payment-method IDs, raw bodies, signatures, HMACs, PINs, OAuth credentials, card data, or secrets;
- classifies enriched orders as `payment_order` or `refund_order`;
- returns `ledgerLookupOrderId`:
  - payment orders use their own Revolut order ID;
  - refund orders use `related_order_id` / original order ID so the endpoint can later call `lookupPaymentOrder(originalOrderId)`;
- warns with `refund_order_missing_related_order_id` if a refund order lacks a related/original order ID.

Verification:

- `node --check rcs-registration/cloud-run/revolut-webhook/enrich.mjs` passed;
- `npm --prefix rcs-registration/cloud-run/revolut-webhook run enrichment-self-test` passed with fake orders and fake fetch only;
- `npm --prefix rcs-registration/cloud-run/revolut-webhook run self-test` passed;
- `npm --prefix rcs-registration/cloud-run/revolut-webhook run dedupe-self-test` passed.

Status:

- enrichment helper is not wired into the live handler yet;
- no endpoint has been deployed;
- no Firestore database has been enabled or written to by this work;
- no live Revolut call was made;
- no Revolut webhook URL has been changed;
- no Apps Script call or Billing update was made.

## Slice 8W - Refund Order Retrieval Shape Proof

Adam ran a read-only Revolut sandbox retrieval for the existing refund order.

Command purpose:

- retrieve order ID `6a0872b4-89b8-a82d-884b-703f6470c124`;
- confirm the real refund order shape before wiring enrichment into the handler.

Observed summary:

- `type = refund`;
- `state = completed`;
- `amount = 12000`;
- `currency = GBP`;
- `relatedOrderId = 6a0866ef-9b11-a041-bfa2-e973e15e564d`;
- refund payment ID `6a0872b4-395a-a536-8ca5-0ab9c27056af`;
- payment state `completed`;
- payment method type `card`;
- no checkout URL present.

Implication:

- Claude Code's Medium caveat on refund-order shape is now materially resolved for sandbox: the refund type is lowercase `refund`, and the original checkout order link is present as `relatedOrderId` in the local proof-tool summary;
- `enrich.mjs` already normalises type case and supports both raw snake_case `related_order_id` and summary camelCase `relatedOrderId`;
- the enrichment self-test now mirrors the observed lowercase refund shape and camelCase summary path.

Status:

- read-only Revolut sandbox retrieval only;
- no endpoint has been deployed;
- no Firestore database has been enabled or written to by this work;
- no Revolut webhook URL has been changed;
- no Apps Script call or Billing update was made.

## Slice 8X - Record-Only Handler Enrichment Wiring

Codex wired the enrichment helper into the source-only Cloud Run / Functions Framework handler path.

Files:

- `rcs-registration/cloud-run/revolut-webhook/index.mjs`;
- `rcs-registration/cloud-run/revolut-webhook/dedupe.mjs`;
- `rcs-registration/cloud-run/revolut-webhook/README.md`;
- `rcs-registration/REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md`;
- this handover and the build plan.

Behaviour:

- handler still verifies signature/timestamp before any mapping or enrichment;
- handler records/checks dedupe before enrichment;
- fresh non-duplicate `ORDER_COMPLETED` events attempt record-only enrichment when a Merchant API secret and fetch implementation are configured;
- duplicate `ORDER_COMPLETED` events skip enrichment, preventing repeated Merchant API calls on Revolut retries;
- non-completed events skip enrichment as not required;
- `ORDER_COMPLETED` dedupe records now use state `enrichment_required` even when the initial payload contains a merchant reference and maps to a paid dry-run;
- `enrichment_required` is terminal only for this record-only endpoint; the later automatic apply flow must introduce a separate progress state before any Billing side effect;
- pre-enrichment completion mapping values are logged and stored as `provisionalBillingStatus` / `provisionalPaymentStatus` / `provisionalRefundStatus`, not as final Billing fields;
- public HTTP response bodies are unchanged;
- no Billing write path was added.

Record-only log additions:

- `enrichmentAttempted`;
- `enrichmentOk`;
- `enrichmentSkippedReason`;
- `enrichmentClassification`;
- `enrichmentLedgerLookupOrderId`;
- `enrichmentRequiresPaymentOrderLookup`;
- `enrichmentWarnings`;
- `enrichedOrderType`;
- `enrichedOrderState`;
- `enrichedRelatedOrderId`;
- `enrichmentError`.

Verification:

- `node --check rcs-registration/cloud-run/revolut-webhook/index.mjs` passed;
- `node --check rcs-registration/cloud-run/revolut-webhook/dedupe.mjs` passed;
- `node --check rcs-registration/cloud-run/revolut-webhook/enrich.mjs` passed;
- `node rcs-registration/cloud-run/revolut-webhook/index.mjs --self-test` passed:
  - fake-fetch enrichment call count was `2`;
  - duplicate failed-payment enrichment skip reason was `not_required`;
  - duplicate completed-payment enrichment skip reason was `duplicate`;
- `node rcs-registration/cloud-run/revolut-webhook/dedupe.mjs --self-test` passed and confirmed `ORDER_COMPLETED` record state `enrichment_required`;
- `node rcs-registration/cloud-run/revolut-webhook/enrich.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-handler.mjs --self-test` passed;
- `node rcs-registration/tools/revolut-webhook-map.mjs --self-test` passed.

Status:

- source-only wiring; no endpoint has been deployed;
- self-tests use fake payloads/orders/secrets and injected fake fetch;
- no live Revolut call was made by this slice;
- no Firestore database has been enabled or written to by this work;
- no Revolut webhook URL has been changed;
- no Apps Script call or Billing update was made.

## Slice 8Y - Runtime Firestore Dedupe Wiring

Codex wired the exported Cloud Run / Functions Framework handler to use the Firestore dedupe adapter at runtime, while preserving fully offline local self-tests.

Files:

- `rcs-registration/cloud-run/revolut-webhook/index.mjs`;
- `rcs-registration/cloud-run/revolut-webhook/README.md`;
- `rcs-registration/REVOLUT_WEBHOOK_ENDPOINT_DESIGN.md`;
- this handover and the build plan.

Behaviour:

- `revolutWebhook(req, res)` now passes a cached `FirestoreDedupeStore.fromDefault()` factory into `handleHttpRequest`;
- `handleHttpRequest` still accepts an injected in-memory store for tests and local source-only proof;
- the Firestore store is resolved only for recordable verified webhooks, after method/raw-body checks and signature/timestamp verification;
- if a recordable webhook cannot obtain a dedupe store, or if the dedupe record/transaction fails, the handler fails closed with `dedupe_store_unavailable` before enrichment;
- local self-tests prove the dedupe-store factory path using an in-memory store, not Firestore;
- no deploy path, Secret Manager binding, Apps Script call, or Billing write was added.

Status:

- source-only wiring; no endpoint has been deployed;
- no Firestore database has been enabled or written to by this work;
- no live Revolut call was made by this slice;
- no Revolut webhook URL has been changed;
- no Apps Script call or Billing update was made.

## Slice 8Z - Google Cloud Boundary Decision Update

Codex recorded Adam's initial Google Cloud boundary decisions in the webhook design docs. This is a written planning update only; no Google Cloud console action, `gcloud` command, deployment, Firestore enablement, Secret Manager action, Revolut URL change, Apps Script call, or Billing update was made.

Decisions recorded:

- correct-account read-only console check confirmed project `RightOnQ-GOG` / `rightonq-gog` / project number `872475523113`;
- project sits under organisation `rightonq.co.uk`;
- earlier wrong-account browser check is superseded;
- avoid `Personal-GOG` / `personal-gog-490412` for this webhook unless Adam explicitly reverses this later;
- proposed region: `europe-west2` / London;
- rationale: RightOnQ is UK-based, expected account/client base is mostly UK, and official docs list `europe-west2` / London for Cloud Run, Secret Manager, and Cloud Firestore;
- billing is now linked to `My Billing Account` / `01D966-E98801-B3C276` under `rightonq.co.uk`, but it is currently a Free trial account and full pay-as-you-go activation was not clicked;
- project remains otherwise bare: no Firestore database, no Cloud Run service, Cloud Run Admin API not enabled, Secret Manager API not enabled, and no webhook-suitable service account;
- Firestore Native remains the dedupe/event store choice, but it is not currently enabled/created for this lane.

Next boundary work:

- decide whether/when to activate the linked free-trial billing account to full pay-as-you-go;
- confirm billing/permissions;
- enable/create Firestore Native, Cloud Run Admin API, Secret Manager API, service account/IAM, and secrets only as separate explicit steps;
- confirm Secret Manager names and service account/IAM plan;
- do not enable or create anything until Adam explicitly approves the console action.
