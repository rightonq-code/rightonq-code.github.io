# RightOnQ Website Web-4 Handover

Date opened: 2026-05-12
Prepared by: Codex RightOnQ.co.uk-Web-4
For: future Codex RightOnQ.co.uk-Web-5
Repo: `/Users/macpro/rightonq-code.github.io`
Handover branch/worktree: `web4-handover-20260512` at `/Users/macpro/rightonq-web4-handover`

## Executive Summary

Web-4 was opened as the next website continuity thread after Web-3. The live website redesign work from Web-3 is already on `main` and pushed to GitHub. The website is stable and now needs careful polishing, future copy updates, and a more balanced positioning layer.

The major Web-4 strategic update is this:

- The site should not only read as rich RCS outreach with images, buttons, and carousels.
- It also needs to speak to businesses that need verified customer messaging with a clear record behind it.
- The new positioning layer is: verified business messaging, proof of send, communication records, and send-and-file accountability.
- Do not remove the aspirational brand/outreach story. The goal is to add a stronger operational/accountability reason to buy.

Useful future positioning line:

```text
For brands building customer outreach, and teams that need a clearer record of important messages.
```

## Current Git / Branch Context

At the time this Web-4 handover was started:

- `origin/main` contains the live website and the Web-2/Web-3 handovers.
- Latest visible `origin/main` commit:

```text
2bd5505 Remove public messaging provider names
```

- A separate RCS application branch exists:

```text
rcs-registration-part-a-b-20260507
```

- Latest known RCS branch commit from the RCS-Twilio workstream:

```text
bfeceb8 Sync RCS Twilio handover and profile description field
```

This Web-4 handover file was deliberately created on its own branch:

```text
web4-handover-20260512
```

Purpose: keep website continuity notes separate from the RCS-Twilio app branch and from any local uncommitted website edits.

## Existing Handover Path

Future agents should read these in order:

```text
WEB2_HANDOVER_2026-05-04.md
WEB3_HANDOVER_2026-05-05.md
WEB4_HANDOVER_2026-05-12.md
```

Web-2 explains the recovery/redesign scare and safety rules. Web-3 explains how the redesigned site moved onto `main`, plus current homepage/RCS guide details. This file explains the Web-4 strategic update and coordination with the RCS-Twilio workstream.

## Golden Rule With Adam

Adam uses voice-to-text, so odd words are often dictation errors. Infer obvious meaning, but ask if a word changes the instruction.

The most important working rule:

```text
Confirm before creating, naming, committing, pushing, renaming, or setting up planning files.
```

This rule was reinforced after Web-4 initially created a badly named planning file too quickly. Do not repeat that mistake.

For copy and positioning:

- Suggest wording first.
- Wait for Adam to approve the direction.
- Then patch.

For website changes:

- Local preview first.
- Push only after Adam approves, unless he explicitly says to push, re-push, or check the live site.

## Adam's Current Preference / Working Style

Adam works visually and incrementally.

He likes:

- plain English
- direct wording
- commercially sensible copy
- slightly human warmth where appropriate
- one task at a time
- quick local previews
- durable handover files for successor agents

He dislikes:

- rushing file names or structure without agreement
- over-abstract marketing language
- patronising explainers
- compliance-heavy wording too early on the page
- changes that blur website work with RCS app work without warning

Phrase to remember:

```text
Local preview first, GitHub push after approval.
```

## Website / RCS-Twilio Boundary

There are two related but separate workstreams:

### Website workstream

Current agent identity:

```text
RightOnQ.co.uk-Web-4
```

Future successor should be:

```text
RightOnQ.co.uk-Web-5
```

This thread owns:

- public website copy
- positioning
- homepage polishing
- website SEO/link/layout work
- website handover notes

### RCS-Twilio workstream

Current known RCS app thread:

```text
RCS-Twilio-3
```

Future successor threads may be RCS-Twilio-4, RCS-Twilio-5, and so on.

The RCS application branch is:

```text
rcs-registration-part-a-b-20260507
```

The app is separate from the public website and lives under:

```text
rcs-registration/
```

Key RCS files:

```text
rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md
rcs-registration/index.html
rcs-registration/google-apps-script/Code.gs
```

Do not make RCS app changes from the web thread unless Adam explicitly asks.

## Latest RCS-Twilio Sync Mentioned To Web-4

Adam passed this message from the RCS-Twilio workstream:

- Repo: `rightonq-code/rightonq-code.github.io`
- Branch: `rcs-registration-part-a-b-20260507`
- Latest commit: `bfeceb8 Sync RCS Twilio handover and profile description field`
- Updated:
  - `rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
  - `rcs-registration/index.html`
  - `rcs-registration/google-apps-script/Code.gs`

The RCS handover now includes a "Morning Sync - Tuesday 12 May 2026" section and Twilio Console context for the RightOnQ RCS sender draft.

Approved Twilio public profile values mentioned:

```text
display name: RightOnQ(TM)
use case: Promotional
description: See how branded RCS messages can make two-way conversations clearer from the first hello.
```

Note: preserve correct public trademark styling in website files according to existing site conventions. Do not casually rewrite public provider names.

## Web-4 Strategic Positioning Shift

Adam spoke with the builders and learned that the first product build is more focused on practical RCS messaging and records than the current homepage emphasis might suggest.

The build direction includes:

- companies signing up for RCS
- their logo / sender identity
- a RightOnQ interface to decide the message
- who it goes to
- what the receipt/record says
- responses coming back
- a clearer record than scattered chat threads

The website currently leans toward:

- richer outreach
- images
- carousels
- product launches
- marketing-style examples

That is still valid, but the site should also make room for:

- verified operational messaging
- proof of send
- message records
- delivery/receipt records where available
- response records
- send-and-file communication
- team/customer accountability

Core concept:

```text
Verified customer messaging with a clear record behind it.
```

## Words And Phrases For Future Copy

Useful:

- message record
- delivery record
- communication record
- message history
- sent-message history
- message log
- accountable messaging
- proof of send
- recipient record
- operational messaging
- verified business messaging
- send-and-file messaging

Use carefully:

- audit trail

Reason: `audit trail` is accurate, but it can sound heavy/legal if used too early. It may belong lower down the page. Above the fold, use friendlier phrasing such as:

- clear record
- message history
- delivery record
- communication record

Candidate lines:

```text
Verified business messaging with a clear record behind it.
```

```text
Verified customer messages, sent and filed.
```

```text
Send, record, retrieve.
```

```text
Trusted business messages first. Richer customer experiences when you need them.
```

```text
RightOnQ helps UK businesses send verified customer messages with SMS fallback and a clear record of what was sent, when, and to whom.
```

```text
Send trusted business messages from a verified identity, keep a record behind every campaign, and add richer RCS features when the moment calls for more than plain text.
```

## The Balance To Preserve

Do not flatten the site into compliance software.

RightOnQ should still feel like a modern RCS customer messaging product. The richer brand features remain important, but they should sit inside a broader promise:

```text
Important messages can look better, come from a trusted identity, and leave a clearer record behind them.
```

The site should be able to wear both hats:

### Outreach hat

- launches
- viewings
- offers
- events
- availability
- campaigns
- richer RCS presentation
- images, buttons, reply paths, and carousels

### Operational/accountability hat

- notices
- reminders
- instructions
- appointment changes
- service updates
- customer confirmations
- team-to-customer communication
- proof of who received what and when

Avoid public wording that sounds like staff surveillance. The public value is business accountability, retrievable communication, and less reliance on memory, screenshots, WhatsApp searches, or buried chat threads.

## Future Amendment Notes Created Locally

During Web-4, two local future-amendment notes were created but intentionally not committed or pushed yet.

They exist locally in the main working repo:

```text
/Users/macpro/rightonq-code.github.io/RightOnQ Website Future Amendments.md
/Users/macpro/rightonq-code.github.io/RightOnQ RCS Application Future Amendments.md
```

Adam wants to keep these local for now, add more information later, and eventually push them to GitHub.

Important reminder for Web-4/Web-5:

```text
Remind Adam that these two local amendment files exist and still need future review/push when appropriate.
```

## Current Local Main Repo Caveat

At the time this handover was started, the primary working directory was on:

```text
rcs-registration-part-a-b-20260507
```

and had local uncommitted changes:

```text
index.html
privacy.html
terms.html
RightOnQ Website Future Amendments.md
RightOnQ RCS Application Future Amendments.md
```

Do not assume those local files are safe to stage. Check current status before any future work.

The Web-4 handover work was intentionally done in the separate worktree:

```text
/Users/macpro/rightonq-web4-handover
```

## Website Source Of Truth

For ordinary public website work, continue from `main` unless Adam explicitly says otherwise.

Do not continue ordinary website work on:

```text
build1-website-redesign
```

unless Adam explicitly asks. That branch is now historic.

Do not continue ordinary website work on:

```text
rcs-registration-part-a-b-20260507
```

unless the task is specifically about the RCS registration application.

## Recommended First Steps For Web-5

1. Read `WEB2_HANDOVER_2026-05-04.md`.
2. Read `WEB3_HANDOVER_2026-05-05.md`.
3. Read this file.
4. Run:

```bash
git status --short --branch
```

5. Confirm which branch/worktree you are in before editing.
6. If doing website work, use `main` unless Adam instructs otherwise.
7. If doing RCS app work, coordinate with the RCS-Twilio workstream and the `rcs-registration-part-a-b-20260507` branch.
8. Before creating any new planning file, confirm filename and destination with Adam.

## Build / Preview Reminder

From Web-3, the successful build command was:

```bash
JEKYLL_ENV=production /opt/homebrew/opt/ruby@3.3/bin/bundle exec jekyll build
```

Useful local server pattern:

```bash
cd /Users/macpro/rightonq-code.github.io/_site
/Users/macpro/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 8081
```

Use cache-buster query strings when sharing previews, for example:

```text
http://127.0.0.1:8081/?web4-check=1
```

