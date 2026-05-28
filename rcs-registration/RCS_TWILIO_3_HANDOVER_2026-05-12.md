# RCS-Twilio-3 Handover To RCS-Twilio-4

> **SUPERSEDED (2026-05-28).** Historical handover from the RCS-Twilio-3 session. The current living handover is `RCS_TWILIO_4_HANDOVER_2026-05-12.md`. Kept for the handover chain/history only.

Date: Tuesday 12 May 2026
Project: RightOnQ RCS registration / Twilio RCS sender application / Part A and Part B workflow
Repo: `/Users/macpro/rightonq-code.github.io`
Branch: `rcs-registration-part-a-b-20260507`

## Read This First

This handover exists because the end of the RCS-Twilio-3 session became confusing. The next agent must slow down, verify the actual repo state, and avoid making any product or layout edit until Adam has explicitly approved the exact proposed change.

The immediate goal for RCS-Twilio-4 is not to continue rushing the design. The immediate goal is to stabilise the state, show Adam exactly what exists, and agree whether to keep, adjust, or roll back the current uncommitted work.

## Golden Rule For Working With Adam

Do not rush from discussion into edits.

Adam wants a collaborative working relationship, not a cold or passive agent. It is fine to inspect, think, suggest, and bring useful ideas. But before changing product flow, wording, layout, files, commits, pushes, or anything that could affect the project state:

1. stop;
2. explain the exact proposed change in normal chat;
3. discuss the reasoning in plain language;
4. wait for Adam's approval;
5. then edit only the approved scope.

This is not optional. Wrong-file edits, wrong previews, unapproved layout changes, or losing track of what has been saved causes Adam real anxiety and disrupts the work.

Use normal chat for wording proposals. Do not put ordinary wording suggestions in code blocks unless Adam needs to copy a command or file path.

## Local Checkpoint Rule - Do Not Leave Important Work At Level 3

Adam uses the following mental model for safety:

- Level 1: pushed to GitHub.
- Level 2: committed locally in Git, but not pushed.
- Level 3: only present as uncommitted working-tree changes.

For important RCS app work, do not leave valuable progress sitting at Level 3 for long. Adam has had previous experiences where uncommitted work broke or became hard to recover, so he expects regular local checkpoint commits during substantial work.

Practical rule:

- after a meaningful block of approved work;
- roughly every hour during active editing;
- before breaks, context switches, shutdowns, or handing over;
- before risky layout or flow changes;

move the approved current state from Level 3 to Level 2 with a narrow local commit.

This does not mean push automatically. It means make a local checkpoint commit that includes only the approved files for that work stream. Always show or verify the staged file list first, and never use broad staging.

Example safe checkpoint pattern for the RCS app:

```bash
git add -- rcs-registration/index.html
git diff --cached --name-status
git commit -m "Checkpoint current RCS registration app state"
```

Do not include unrelated dirty files in these checkpoints. In particular, do not accidentally stage root `index.html`, legal pages, future-amendment notes, or handover files unless Adam has specifically approved that scope.

## Correct Files And Preview

## Handover Files Now Together

The Twilio handover files are now together in the RCS registration folder so RCS-Twilio-4 can find the chain without hunting through Downloads first.

Read them in this order:

- Twilio-1 handover: `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
- Twilio-2 handover copy: `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
- Twilio-3 handover: `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md`

Original Twilio-2 source location:

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/RCS_TWILIO_2_HANDOVER_2026-05-11.md`

Important note: RCS-Twilio-3 copied Twilio-2's handover into the repo folder near the end of the session. That copy is currently untracked unless a later agent has committed it. The copy was verified as byte-identical to the Downloads source at the time it was copied.

Correct RCS app file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

Correct RCS handover/history file from earlier work:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`

This handover file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md`

Google Apps Script file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/google-apps-script/Code.gs`

Main website file, not the RCS app:

- `/Users/macpro/rightonq-code.github.io/index.html`

Correct preview command:

```bash
cd /Users/macpro/rightonq-code.github.io
python3 -m http.server 8902
```

Correct preview URL:

- `http://localhost:8902/rcs-registration/index.html`

Do not judge the design from:

- `file:///Users/macpro/rightonq-code.github.io/rcs-registration/index.html`
- a localhost server started from inside `/Users/macpro/rightonq-code.github.io/rcs-registration`
- any URL that does not include `/rcs-registration/index.html`

The preview confusion happened partly because the same URL can show different states as the local file changes, and partly because browser autosave can restore old form values.

## Current Git State At Handover

Current branch:

- `rcs-registration-part-a-b-20260507`

Remote branch currently points at:

- `bfeceb8 Sync RCS Twilio handover and profile description field`

Local branch is ahead of origin by one commit:

- `b4a8acc Checkpoint Part B phone preview step`

That local checkpoint commit has not been pushed.

At the time this handover was written, the working tree also had uncommitted changes.

Dirty files seen:

- `index.html`
- `privacy.html`
- `terms.html`
- `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
- `rcs-registration/index.html`

Untracked files seen:

- `RightOnQ RCS Application Future Amendments.md`
- `RightOnQ Website Future Amendments.md`

Important:

- Root `index.html` belongs to the website lane unless Adam explicitly says otherwise.
- `privacy.html` and `terms.html` had earlier branch-sync/legal wording work and should not be staged casually.
- The future-amendments files are legitimate notes for another web-design lane.
- Do not stage or commit any of those non-RCS-app files without explicit approval.

## Known Saved Commit Points

Last pushed branch state:

- `bfeceb8 Sync RCS Twilio handover and profile description field`

Local checkpoint, not pushed:

- `b4a8acc Checkpoint Part B phone preview step`

There is also a current working tree state after `b4a8acc`. That working tree state is what the browser preview showed near the end of RCS-Twilio-3.

Do not assume the current preview equals either `bfeceb8` or `b4a8acc`. It includes additional uncommitted work.

## What RCS-Twilio-3 Did Earlier And Pushed

Commit `bfeceb8` was pushed.

It included handover/doc sync and the Twilio profile-description learning:

- Twilio Public details has a public sender/profile description field.
- It is max 100 characters.
- It should be treated as an important Part A field.
- The RCS form now has a profile-description field aligned to that requirement.

This was good work and should be preserved unless Adam asks otherwise.

## What RCS-Twilio-3 Saved Locally But Did Not Push

Commit `b4a8acc Checkpoint Part B phone preview step` touched only:

- `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
- `rcs-registration/index.html`

It was a local safety checkpoint before more work continued.

## Current Uncommitted RCS App Changes

The current `rcs-registration/index.html` has uncommitted changes after `b4a8acc`.

Key visible changes:

- Progress panels were changed so the tidy left-column layout stays until narrower mobile width.
- This was in response to Adam disliking the wide "landscape" progress-panel layout.
- Part B navigation now shows four stages:
  1. `Part B storyboard`
  2. `Approve phone preview`
  3. `Review and approve video`
  4. `Registration submitted`
- Part B heading now says: `Profile and video stage after Part A`
- Part B storyboard changed from the old five horizontal cards to a vertical one-column flow.

Treat the Part B vertical storyboard as provisional. Adam liked the vertical direction, but content and spacing were still under discussion.

## Part B Storyboard Content Status

Step 1 was discussed and approved.

Current Step 1:

- Title: `Part A accepted`
- Text: `The submitted details have been checked, so RightOnQ can prepare the phone logo preview and RCS application video.`

Step 2 is not final.

Current provisional Step 2:

- Title: `Phone logo approval`
- Text: `RightOnQ checks the sender name and logo on a real phone, then the client confirms approval in Part B because the test message is not a normal reply channel.`

Adam was not finished discussing this. Do not assume this wording is approved.

## A8 / Send Part A Current Work

On Step 8 / Send Part A, the following uncommitted changes exist:

- Removed the old intro sentence: `A named person should confirm the information is correct and authorised for registration.`
- Added Box 47: `Phone number/s for RCS logo preview approval`
- Box 47 has a red required asterisk.
- Box 47 contains:
  - `iPhone test number`
  - `Android test number`
- Date moved to Box 48.
- Validation added: at least one of the two phone fields must contain a real number.
- Bare `+44` is treated as empty.
- The two phone fields have file-level default values of `+44 `.

Important preview caveat:

Adam's browser can restore old saved progress, so the two phone fields may appear blank even though the file default is `+44 `. Do not "fix" this until you have checked whether browser autosave is restoring stale values.

The blue note was moved below Box 48 and above the SEND button.

Current blue-note wording:

`This completes Part A. RightOnQ will check the written registration details first, then begin Part B. Part B starts with the phone logo preview, so you can approve how your sender name and logo appear on a real phone before the RCS application video is prepared.`

This was the latest implemented state, but Adam had not completed final review before the session stopped.

## Checks Run Before This Handover

The RCS app file passed these checks after the latest app edits:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('rcs-registration/index.html','utf8'); const match=html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log('inline script syntax ok');"
```

Result:

- `inline script syntax ok`

Also run:

```bash
git diff --check -- rcs-registration/index.html
```

Result:

- passed with no output

This handover file was added after those checks. If committing, run diff checks again on the exact files being committed.

## Important Unimplemented Test-Number Narrative

Adam gave the following narrative for the test-number section. It has not yet been implemented.

Proposed heading:

`Why we need your test numbers`

Draft narrative from Adam:

`We've already tested your sender internally and it's looking good - this step is just for your final sign-off on a real device.`

`Before your RCS sender is registered, Google's anti-spam rules mean we can't send a branded test cold. Here's how it works:`

`We agree a time with you.`

`A message arrives from RBM Tester Management inviting you to become a tester for your own sender. Tap to accept.`

`We then send a test carrying your logo and brand name - so you can see how it looks in your message list and at the top of the thread when opened.`

`iPhone and Android render RCS profiles slightly differently (mainly logo shape and brand-name placement), so ideally send us one iPhone number and one Android number. One is enough to proceed; two gives you the full picture before approval.`

Adam's wording preferences around this:

- Use `should arrive`, not `may`.
- Use `arrive`, not `come`.
- Avoid unnecessary `may`.
- Use `your name and logo` or `your logo and brand name`.
- Be plain and human.
- Do not put wording proposals in boxed/code formatting.

Before implementing this, ask Adam whether it should replace the current short helper under Box 47, sit as a note below Box 47, or become a separate explanatory panel.

## Product Learning From Twilio Test Device Flow

The Twilio test-device flow is important commercially.

RightOnQ can add a test phone number for the sender. The phone receives a message from RBM Tester Management inviting the person to become a tester for the sender. Once the person accepts, RightOnQ can send a branded test message so the sender name and logo can be seen on a real phone.

This means RightOnQ can:

- test the sender logo/name internally;
- adjust the logo/profile if it looks poor on real devices;
- invite the client to check the profile on their own phone;
- get explicit approval before the video and formal submission;
- make this a valuable managed-service step.

Adam believes Twilio's preview mock phone may not accurately represent real-device logo scaling. Real phones are the truth.

This should influence Part B. The phone profile/logo approval step belongs at the beginning of Part B, before the review video.

## Twilio Public Details State Learned During Session

RightOnQ sender exists in Twilio as a draft/not-submitted RCS sender.

Important public details filled during the session:

- Sender display name: `RightOnQ™`
- Use case selected: `Promotional`
- Accent colour: `#1763ba`
- Contact email: `adam@rightonq.co.uk`
- Email label: `Support`
- Privacy URL: `https://www.rightonq.co.uk/privacy/`
- Terms URL: `https://www.rightonq.co.uk/terms/`
- Description settled in Twilio: `See how branded RCS messages can make two-way conversations clearer from the first hello.`

Adam saved these public details in Twilio.

The description wording came after several rounds and should be respected unless Adam chooses to revisit it.

## Logo And Real-Device Testing Learning

Adam tested the RightOnQ logo/profile on real iPhones in dark and light mode.

Findings:

- The logo was acceptable in light mode.
- In dark mode the logo appeared smaller/less visually strong than RBM Tester Management's icon.
- This is not necessarily a problem for RightOnQ, because future clients care most about their own logos.
- It proved the value of real-device checking.
- Adam wants the client approval process to include real-phone logo/profile inspection.

Important: the Twilio preview panel can be misleading. Do not treat it as final truth for size.

## What To Do Next

RCS-Twilio-4 should start read-only.

Recommended opening posture:

1. Confirm the repo and branch.
2. Confirm the current preview URL.
3. Tell Adam that the current app state includes one unpushed checkpoint plus uncommitted changes.
4. Offer to show a concise comparison of:
   - last pushed state `bfeceb8`,
   - local checkpoint `b4a8acc`,
   - current working tree.
5. Ask Adam whether to keep the current A8 Box 47/48 structure before doing any more wording/layout work.

Do not edit first.

Do not commit first.

Do not push first.

Do not stage files first.

## Useful Read-Only Commands For The Next Agent

Use these to orient without changing files:

```bash
cd /Users/macpro/rightonq-code.github.io
git status --short --branch
git log --oneline -6 --decorate
git diff --stat
git diff -- rcs-registration/index.html
git diff -- rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md
```

Use this to verify the current app file:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('rcs-registration/index.html','utf8'); const match=html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log('inline script syntax ok');"
git diff --check -- rcs-registration/index.html
```

If Adam asks to restore something, show the exact proposed reverse diff first. Do not run restore/reset commands casually.

## Final Safety Branch And Push Update

After this handover was first written, Adam asked for the handover files to be safely preserved on GitHub without pushing any app/layout work.

The safe route used was a separate Git worktree, not the dirty checkout.

Safety worktree:

- `/Users/macpro/rightonq-code-handover-20260512`

Safety branch:

- `rcs-twilio-handover-20260512`

Base used for that worktree:

- `origin/rcs-registration-part-a-b-20260507`
- commit `bfeceb8 Sync RCS Twilio handover and profile description field`

The dirty checkout at `/Users/macpro/rightonq-code.github.io` was not used for committing or pushing.

The following files were staged, committed and pushed on the safety branch:

- `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
- `rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
- `rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md`

Commit pushed:

- `22e2651 docs: add RCS Twilio handover chain`

GitHub branch:

- `https://github.com/rightonq-code/rightonq-code.github.io/tree/rcs-twilio-handover-20260512`

Pull request creation URL:

- `https://github.com/rightonq-code/rightonq-code.github.io/pull/new/rcs-twilio-handover-20260512`

The pushed diff contained only:

- modified `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
- added `rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
- added `rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md`

No app/layout work was pushed on that safety branch. In particular, the safety branch did not include:

- `rcs-registration/index.html`
- root `index.html`
- `privacy.html`
- `terms.html`
- `RightOnQ RCS Application Future Amendments.md`
- `RightOnQ Website Future Amendments.md`

## Dirty Checkout Status After Handover Push

The main working checkout still has mixed local work. This is expected and should not be "cleaned" with broad Git commands.

Dirty checkout:

- `/Users/macpro/rightonq-code.github.io`

Known local branch state:

- branch `rcs-registration-part-a-b-20260507`
- ahead of `origin/rcs-registration-part-a-b-20260507` by one local commit: `b4a8acc Checkpoint Part B phone preview step`

Known dirty / untracked groups:

- `rcs-registration/index.html` - RCS app work, including current Part B/A8 phone-preview changes. This is the sensitive product file.
- `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md` - earlier handover/protocol updates.
- `rcs-registration/RCS_TWILIO_2_HANDOVER_2026-05-11.md` - Twilio-2 handover copy added locally.
- `rcs-registration/RCS_TWILIO_3_HANDOVER_2026-05-12.md` - this Twilio-3 handover file added locally.
- `privacy.html` and `terms.html` - provider-name/legal wording cleanup. Treat as web/legal lane, not app layout.
- root `index.html` - main website/homepage work. Treat as website lane, not RCS app lane.
- `RightOnQ RCS Application Future Amendments.md` and `RightOnQ Website Future Amendments.md` - planning notes from another lane.

Do not use `git add .`, `git reset`, `git clean`, broad checkout/restore commands, rebase, or merge to "fix" this. If cleanup is required, classify each file with Adam first and handle one approved group at a time.

## Recommended Cleanup Sequence For RCS-Twilio-4

Start by telling Adam the handover chain is safe on GitHub at branch `rcs-twilio-handover-20260512`.

Then inspect the dirty checkout read-only:

```bash
cd /Users/macpro/rightonq-code.github.io
git status --short --branch
git log --oneline origin/rcs-registration-part-a-b-20260507..HEAD
git diff --stat
git diff --name-status
```

Classify the files before touching anything:

1. RCS app decision: `rcs-registration/index.html`
2. RCS handover files: already preserved on safety branch
3. legal/web cleanup: `privacy.html`, `terms.html`
4. website lane: root `index.html`
5. future-amendment notes: the two untracked Markdown files

The first real product decision should still be whether Adam wants to keep, adjust, or roll back the current A8 Box 47/48 phone-preview work in `rcs-registration/index.html`.

## Final Warning

The previous agent caused confusion by talking as if a chat handover had been saved when it had not. This file is the saved handover. Continue from this file and the actual Git state, not from assumptions.
