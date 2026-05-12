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

Correct preview URL:

- `http://localhost:8902/rcs-registration/index.html`

Correct app file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

## Handover Chain

RCS-Twilio-4 read the three predecessor handovers in order:

1. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
2. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
3. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md`

This file continues the chain:

4. `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_4_HANDOVER_2026-05-12.md`

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

After Bugs approved the current work as worth saving locally, RCS-Twilio-4 created a narrow local checkpoint commit:

- `9392559 Checkpoint RCS Part B storyboard and A8 wording`

It includes only:

- `rcs-registration/index.html`

No push was made.

The branch is now ahead of `origin/rcs-registration-part-a-b-20260507` by 3 local commits:

1. `b4a8acc Checkpoint Part B phone preview step`
2. `14db1c5 Checkpoint current RCS registration app state`
3. `9392559 Checkpoint RCS Part B storyboard and A8 wording`

## Current Dirty / Untracked Files

After the Level 2 checkpoint, the RCS app file is clean relative to HEAD.

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

The current localhost preview was repeatedly refreshed at:

- `http://localhost:8902/rcs-registration/index.html`

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

## Immediate Next Build Recommendation

Do the visible static Part B shape next:

1. Rename Part B Step 2 from `Approve phone preview` to `Approve name and logo`.
2. Update the storyboard Step 2 title to `Name and logo approval`.
3. Add real B2 content instead of letting the Step 2 nav button fall back to the storyboard.
4. Make B2 honest about lock/unlock state:
   - locked until RightOnQ has checked Part A and sent the test invite/message;
   - approval form available once `phone_preview_sent` exists in the future application status.
5. Keep it static for now, but shape it like the future live workflow.

Only after that should the app move into deeper plumbing for:

- private application links;
- per-client records;
- status-controlled unlocks;
- Google Apps Script / Sheet / Drive storage keyed by application ID and token.

## Things Not Done Yet

- No push of app/layout work.
- No PR created or touched.
- No backend/status implementation.
- No real B2 approval form implementation yet.
- No client-specific private link implementation.
- No update to Google Apps Script payload/schema for B2 yet.
- No commit of this Twilio-4 handover file yet unless a later step does so.

## Reminder For RCS-Twilio-5

Be warm, but do not run ahead. Bugs is actively steering wording and product shape. He likes quick, careful passes, but wants to approve the exact direction before edits.

The most important current product insight is that this is an application case flow, not a generic static form. Part B should be shown as a future staged process, but real access to B2/B3 must eventually depend on that client's application status.
