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
- They must choose/accept the service level, initially discussed as `Local Time Only` at `£25/month`.
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
  - first month plus prepaid usage credit collection;
  - possible `£25/month` subscription after sandbox testing;
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
- Require an active billing setup before serious registration/provider submission.
- Require first month and/or minimum prepaid usage credit before live Twilio usage.
- Example starting model:
  - `£25/month` base subscription for Local Time Only;
  - minimum usage credit/deposit, possibly `£50`;
  - auto top-up before paid balance drops too low;
  - pause/suspend if payment or top-up fails;
  - manual RightOnQ override only.

### Customer-Facing Onboarding Shape

Likely customer journey:

1. Lead agrees in principle to use RightOnQ RCS.
2. Customer chooses/confirms a package, initially `Local Time Only`.
3. Customer accepts service/payment terms.
4. Customer sets up billing via Revolut checkout/hosted payment.
5. Customer pays first month and/or minimum usage credit/deposit, likely `£25 + £50 = £75` at onboarding.
6. Customer receives a private RCS application link.
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
4. Payment method saved.
5. Subscription/base monthly entitlement active, or monthly charge schedule recorded.
6. Minimum credit/deposit paid.
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
