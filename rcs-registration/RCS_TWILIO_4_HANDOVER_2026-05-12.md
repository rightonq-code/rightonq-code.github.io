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
