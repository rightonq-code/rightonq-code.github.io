# RCS-Twilio-2 Handover

> **SUPERSEDED (2026-05-28).** Historical handover from the RCS-Twilio-2 session. The current living handover is `RCS_TWILIO_4_HANDOVER_2026-05-12.md`. Kept for the handover chain/history only.

Date: 2026-05-11
Owner so far: RCS-Twilio-2
Project: RightOnQ RCS sender review / storyboard / eventual real RBM test recording

Written on Monday 11 May 2026.

This handover covers work done over roughly the last three or four days, including earlier Claude Design/Claude Artwork exploration, RightOnQ branding/profile work, Google/RBM requirements checking, and the pivot from "make a nice movie" to "use the storyboard as the script for a real RBM test-device recording."

## Current Folder

`/Users/macpro/Downloads/design_handoff_rcs_storyboard`

Preview server:

`http://localhost:8899/storyboard.html`

If the preview server has stopped, restart it with:

```bash
cd /Users/macpro/Downloads/design_handoff_rcs_storyboard
python3 -m http.server 8899
```

Important files:

- `storyboard.html` — current 13-frame storyboard
- `README.md` — storyboard design/implementation notes
- `google-rcs-video-readiness-audit.md` — requirement/readiness audit and source notes
- `assets/` — RightOnQ RCS logo/banner assets
- `RCS_TWILIO_2_HANDOVER_2026-05-11.md` — this handover

Older comparison files still exist but are no longer the working artifact:

- `profile-comparison.html`
- `profile-comparison-v2.html`
- `profile-comparison-v3.html`
- `profile-comparison-v4.html`
- `profile-comparison-v5.html`
- `profile-comparison-v6.html`
- `profile-comparison-v7.html`

Do not use those as the source of truth. Use `storyboard.html`.

## Storyboard Location / Provenance

Current storyboard preview:

`http://localhost:8899/storyboard.html`

Local file:

`/Users/macpro/Downloads/design_handoff_rcs_storyboard/storyboard.html`

The user currently has the in-app browser open at:

`http://localhost:8899/storyboard.html`

The storyboard originated from a Claude Design / Claude Artwork artifact. The original Claude design was useful visually but was created before the requirements were fully understood. We only had limited Claude Artwork tokens during this work, so the local HTML/CSS version became the working source of truth.

Important token/context note:

- Claude Artwork/Claude Design tokens were limited during this session.
- User expects fresh Claude tokens again from Tuesday 12 May 2026.
- If Claude Design is used again, feed it the current `storyboard.html`, `README.md`, and the readiness audit, not the old comparison pages.
- Do not let Claude Design restart from the earlier rough assumptions.

Current storyboard truth:

- 13-frame storyboard.
- Main current preview: `http://localhost:8899/storyboard.html`.
- Main current file: `/Users/macpro/Downloads/design_handoff_rcs_storyboard/storyboard.html`.
- The storyboard is now requirements-led, not just visual polish.
- It is a script/shot list for a real RightOnQ RBM/RCS test-device recording.
- It is not the final Google submission video by itself.

What happened to the earlier profile pages:

- The profile-comparison files were intermediate experiments for getting the Google-style RCS business profile screen right.
- They helped settle:
  - no overbranded banner
  - centred logo tile
  - verification tick beside the name
  - RightOnQ® with registered mark
  - `+44 7766 888 333` sender/profile number
  - `The RCS software layer for effective business messaging.`
- They are no longer the source of truth.

The user explicitly wants future agents to understand the history, because it helps avoid repeating wrong paths.

## Current Status

The storyboard has been moved from a pretty mockup toward a requirements-led review-video script.

Current verdict:

- Storyboard/content framework is strong.
- It covers the expected review beats: opt-in, verified/profile view, branded RCS, carousel/rich card, suggested replies, secondary actions, HELP, STOP, opt-out confirmation, and post-STOP suppression.
- The visible copy has been softened so it does not fake a live production system.
- The remaining key risk is no longer the script. It is the final proof environment: the safest final submission should be recorded from a real RBM/RCS test agent and test device, not from this HTML storyboard.

## Exactly Where We Are Up To

We have finished the **storyboard/script stage**.

Current deliverable:

- `storyboard.html` is the current RightOnQ RCS sender review storyboard.
- It is a 13-frame walkthrough.
- It is good enough to use as the script/shot list for a real RBM test-agent recording.
- It is not intended to be the final Google submission video by itself.

The key conclusion from Google/RBM research:

- Google/RBM launch review wants to see the real RCS/RBM experience.
- The safest route is to create the RightOnQ RBM agent, add a test device, send the storyboarded messages for real, then screen-record that test-device flow.
- The Google sample code gives us the route from storyboard to real test flow.

Provider-route caution:

- `RCS-Twilio-3` is the next agent name, not a confirmed implementation route.
- Do not assume Twilio is the build route unless the user confirms.
- Current technical planning route uses Google RBM samples/direct RBM API to understand and map the real test-device flow.

Current risk:

- We do not yet have the actual RightOnQ RBM agent ID, service account key, or whitelisted RCS test device.
- Therefore we should not try to send real RBM messages yet.
- We should next create a build plan/spec that maps each storyboard frame to the RBM API sample code pattern.

## Next Piece Of Work: Twilio-3 Work Package

Twilio-3 should do this next, in order.

### Step 1: Inspect Google RBM samples

Read these first:

- Google sample agents overview: https://developers.google.com/business-communications/rcs-business-messaging/samples
- RBM Intro Node.js sample: https://github.com/rcs-business-messaging/rbm-api-examples/tree/master/nodejs/rbm-intro
- RBM API examples repo root: https://github.com/rcs-business-messaging/rbm-api-examples

Goal:

- Understand how Google expects a real test agent to be configured.
- Identify which sample files cover:
  - capability check
  - text send
  - rich card
  - carousel
  - suggested replies/actions
  - inbound postback/reply handling

### Step 2: Inspect richer examples if needed

Likely useful samples from Google’s list:

- Kitchen Sink:
  - overview: https://developers.google.com/business-communications/rcs-business-messaging/samples
  - repo root to locate it: https://github.com/rcs-business-messaging/rbm-api-examples
  - purpose: interactive exploration of RBM features on a device

- Self-Serve Customer Support:
  - overview: https://developers.google.com/business-communications/rcs-business-messaging/samples
  - repo root to locate it: https://github.com/rcs-business-messaging/rbm-api-examples
  - purpose: self-serve options and guided flows, likely close to RightOnQ secondary actions

- Acme Pizza:
  - overview: https://developers.google.com/business-communications/rcs-business-messaging/samples
  - repo root to locate it: https://github.com/rcs-business-messaging/rbm-api-examples
  - purpose: simple marketing message with Node.js SDK and Pub/Sub

Goal:

- Find the smallest sample combination needed for our storyboard.
- Avoid overengineering.

### Step 3: Create the next local plan/spec file

Create:

`/Users/macpro/Downloads/design_handoff_rcs_storyboard/rightonq-rbm-test-agent-plan.md`

This should map every storyboard frame to a real RBM implementation step.

Suggested table columns:

- Frame
- Storyboard purpose
- RBM message/API type
- Sample file/reference
- Required asset
- Suggested replies/actions
- Expected inbound keyword/postback
- Test-device recording note
- Open question/blocker

Example rows:

- Frame 01: opt-in source / not necessarily sent by RBM / evidence shown before first message
- Frame 03: text message / RBM text send sample / intro payload
- Frame 04: carousel / rich card carousel sample / RightOnQ visual assets
- Frame 05: suggested replies / suggested reply actions / `show_examples`, `book_review_call`, `ask_question`
- Frame 09-10: HELP / inbound keyword + response
- Frame 11-13: STOP / opt-out confirmation + suppression proof

### Step 4: Do not create runnable sender code yet unless prerequisites exist

Do not put secrets in files.

Do not attempt to send real RBM messages unless we have:

- RightOnQ RBM agent ID
- service account JSON/key
- whitelisted/test phone number
- decision on local folder/repo for the demo agent
- confirmation that we are allowed to create runnable code using the Google SDK sample

### Step 5: Prepare the eventual build path

When prerequisites exist, the probable build path is:

1. Copy/adapt Google Node.js sample structure.
2. Add RightOnQ config via environment variables or ignored local config.
3. Add storyboard payload definitions.
4. Run capability check against the test phone.
5. Send Frame 03 intro.
6. Send Frame 04/05 carousel + suggested replies.
7. Handle `show_examples`, `book_review_call`, and `ask_question` postbacks.
8. Handle `HELP`.
9. Handle `STOP`.
10. Demonstrate suppression/no further messages.
11. Screen-record the real phone/test-device flow.

Target outcome:

- A real RightOnQ RBM test recording that follows `storyboard.html`.
- This is the asset with the highest chance of satisfying Google/RBM launch review.

## Diary / Chronology

This thread started after the user imported a Claude/Anthropic design artifact for an RCS storyboard. The initial focus was visual: making the profile/business-details screen look closer to Google’s RCS profile examples.

Approximate recent timeline:

- Around 8-9 May 2026: RightOnQ RCS registration work was already underway in the broader project, including Twilio/Google Sheets/App Script intake work from Twilio-1.
- 10 May 2026: user brought in a Claude Design/Artwork storyboard prototype and started asking whether it could become an RCS review/demo video.
- 10 May 2026 evening: most of the work was visual and brand/profile oriented. We compared Google RCS profile examples, logo spacing guidance, banner/logo placement, and RightOnQ artwork.
- 11 May 2026: work shifted from visual polish to requirement proof. User pushed back, correctly, that the real job was not making it pretty but proving what Google/RBM/Twilio expect and building toward that.
- 11 May 2026 afternoon: created the formal readiness audit, researched Google sample agents and launch approval, updated storyboard to 13 frames, and wrote this handover.

Early work:

- Created/used the `design_handoff_rcs_storyboard` folder under Downloads.
- Started a local preview server on port `8899`.
- Built and iterated profile comparison pages.
- User supplied RightOnQ logo/banner assets from Desktop.
- We iterated the business profile layout heavily:
  - removed overbranding from the banner
  - used a four-panel blue banner inspired by Google’s profile layout
  - used the calendar/OnQ logo as the centered square logo tile
  - moved the verified check next to the name, not on the logo tile
  - changed name from `RightOnQ™` to `RightOnQ®`
  - set profile phone to `+44 7766 888 333`
  - settled profile description: `The RCS software layer for effective business messaging.`

Key struggle:

- Too much time went into visual polish before fully locking the Google/RCS requirement.
- The user was rightly frustrated that we were making it look good before proving what Google/Twilio/Google RBM actually require.
- Workflow was reset: stop design-first work, create a requirement/readiness audit, then only change the storyboard for concrete requirement gaps.

Requirement/audit phase:

- Created `google-rcs-video-readiness-audit.md`.
- Researched Google launch approval, rich cards, best practices, sample agents, and provider examples.
- Spawned/used agent review before the agent limit was reached.
- Found public demos/examples but not a perfect "exact submitted Google approval video" example.
- Conclusion: public vendor demos are helpful, but Google’s launch approval/test-device flow is the authority.

Important source-driven conclusion:

- The HTML storyboard is not the final proof video.
- The safest final submission should be a recording of a real RightOnQ RBM/RCS agent running against a whitelisted/test device.
- This is not circular: Google/provider flows allow a sender/agent to exist in testing before public launch.
- The storyboard is therefore the script/shot list for that real test-device recording.

Must-fix storyboard pass:

- Added Frame 08 for secondary actions because Google guidance/example patterns emphasize primary, secondary, and opt-out flows.
- Converted the storyboard from 12 frames to 13 frames.
- Removed or softened fake-live wording:
  - removed `Carrier-verified`
  - removed fake `Delivered`
  - removed fake `read receipt seen`
  - removed fake `ack from device`
  - removed fake `Latency 612 ms`
  - removed fake `Compliance check pass`
  - removed large bulk-recipient count
- Replaced those with review/prototype language:
  - `preview`
  - `review demo`
  - `prepared`
  - `shown in review flow`
- Changed inconsistent `Book a demo` to `Book review call`.
- Removed leftover `carrier-verified check` in carousel copy.
- Final checks confirmed:
  - 13 frame cards
  - 13 step captions
  - frame numbers `01` through `13`

Current practical position:

- Storyboard is strong as a script.
- Do not spend on AI video before building/testing the real RBM flow.
- Next useful output should be a frame-to-RBM-message build plan.

## Important Storyboard Decisions

Use `RightOnQ®`, not `RightOnQ™`.

Current storyboard:

- 13 frames
- approximately 48 seconds
- Frame 08 was added to show secondary actions
- visible suggested replies:
  - `Show examples`
  - `Book review call`
  - `Ask a question`
- Frame 07 use case is RightOnQ’s own RCS application update, not a client/automotive example
- phone/contact shown for RightOnQ sender/profile: `+44 7766 888 333`
- prospect/test number: `+44 7700 900123`

Avoid overclaiming terms unless we later have real provider/test-device proof:

- `Carrier-verified`
- fake `Delivered`
- fake `read receipt seen`
- fake `ack from device`
- fake latency figures
- fake compliance-pass claims
- large bulk-recipient counts

Current copy uses `preview`, `review demo`, `prepared`, and similar terms instead.

## Current Readiness

The current storyboard is suitable as:

- a script
- a shot list
- a design reference
- a planning artifact for the real RBM test-agent recording

It should not be treated as the final Google/Twilio submission video by itself.

The safest likely final process is:

1. Create/register the RightOnQ RBM/RCS sender/agent.
2. Reach test/in-testing state.
3. Add/whitelist a UK RCS-capable test device.
4. Adapt the storyboard into real RBM messages.
5. Send the messages to the test device.
6. Screen-record the real test-device/provider flow.
7. Submit that recording with the launch request.

## Official / Useful Sources

Google RCS sample agents:

https://developers.google.com/business-communications/rcs-business-messaging/samples

Google launch / review:

https://developers.google.com/business-communications/rcs-business-messaging/guides/launch/launch-approval

Google test setup / test devices:

https://developers.google.com/business-communications/rcs-business-messaging/guides/build/test

Google rich cards and carousels:

https://developers.google.com/business-communications/rcs-business-messaging/guides/learn/rich-cards

Google best practices:

https://developers.google.com/business-communications/rcs-business-messaging/guides/learn/best-practices

Google how RBM works:

https://developers.google.com/business-communications/rcs-business-messaging/guides/get-started/how-it-works

RBM Intro sample:

https://github.com/rcs-business-messaging/rbm-api-examples/tree/master/nodejs/rbm-intro

RBM API examples repo:

https://github.com/rcs-business-messaging/rbm-api-examples

RBM Intro raw README:

https://raw.githubusercontent.com/rcs-business-messaging/rbm-api-examples/master/nodejs/rbm-intro/README.md

RBM Intro package:

https://github.com/rcs-business-messaging/rbm-api-examples/blob/master/nodejs/rbm-intro/package.json

Google RBM SDK package used by samples:

https://www.npmjs.com/package/@google/rcsbusinessmessaging

Twilio RCS references:

- Twilio RCS channel overview: https://www.twilio.com/en-us/messaging/channels/rcs
- Twilio RCS demo page: https://www.twilio.com/en-us/lp/rcs-watch-demo
- Twilio public beta video: https://www.youtube.com/watch?v=4eqjL1DWCbw
- Twilio RCS getting started blog: https://www.twilio.com/en-us/blog/get-started-rcs-twilio

Other provider references:

- Infobip RCS get started: https://www.infobip.com/docs/rcs/get-started
- Telnyx RCS API demo: https://telnyx.com/resources/telnyx-rcs-api-demo
- Bandwidth RCS opt-out methods: https://www.bandwidth.com/support/en/articles/14550615-rcs-for-business-mobile-user-opt-out-methods
- RCS Playground: https://rcs.bind.hr/
- Sinch RCS explainer: https://www.youtube.com/watch?v=POKGyOWu1mg

RBM Intro setup, confirmed from README:

- open RBM Developer Console
- create a new RBM agent
- upload `agent-assets/`
- create/download service account key
- put JSON into `resources/rbm-agent-service-account-credentials.json`
- edit `src/config.js`
- add test phone number
- add agent ID, without `@rbm.goog`
- run `npm install`
- run `node src/0-capabilityCheck.js`
- expected first proof: test phone reports online

This confirms the real build path: use Google sample code to send actual RCS messages to a whitelisted test device.

Other useful references already captured in `google-rcs-video-readiness-audit.md`:

- Google launch approval
- Google rich cards and carousels
- Google best practices
- Google set up a test device
- Telnyx RCS API demo
- Twilio RCS demo / public beta video
- Bandwidth opt-out methods
- RCS Playground
- Sinch explainer

## Suggested Next Building Step

Do not spend money on AI video yet.

Next engineering step should be:

1. Inspect Google `rbm-intro` sample source files.
2. Inspect `Kitchen Sink` or another richer sample for carousel/rich card/suggested action examples.
3. Create a local notes/spec file mapping storyboard frames to RBM API message payloads.
4. Only create runnable code once RightOnQ has:
   - RBM agent ID
   - service account key
   - whitelisted test device number
   - approved/available assets

Proposed next file:

`rightonq-rbm-test-agent-plan.md`

It should map:

- Frame
- RBM API message type
- required assets
- suggested replies/actions
- expected inbound keyword/postback
- recording note

## Full File Map

Working files:

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/storyboard.html`
  - Main current artifact.
  - 13-frame storyboard.
  - Preview at `http://localhost:8899/storyboard.html`.

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/README.md`
  - Documents the storyboard structure, components, assets, and frame list.

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/google-rcs-video-readiness-audit.md`
  - Requirements/readiness audit.
  - Includes source links, current verdict, production proof conclusion, and final acceptance notes.

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
  - This handover.

Assets:

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/assets/rightonq-rcs-logo-safe.png`
  - 224x224 logo candidate.

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/assets/rightonq-rcs-logo-display.png`
  - Display version used in storyboard phone/profile UI.

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/assets/rightonq-rcs-profile-banner.png`
  - 1440x448 banner candidate currently used.

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/assets/rightonq-rcs-profile-banner-submission.jpg`
  - Submission-safe jpg candidate.

- Other assets in `assets/` are references/fallbacks from earlier visual exploration.

Retired/secondary files:

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/profile-comparison*.html`
  - Earlier profile comparison/prototyping files.
  - Do not treat as current source of truth.

External sample source:

- Google RBM samples overview:
  - https://developers.google.com/business-communications/rcs-business-messaging/samples

- RBM Intro Node.js sample:
  - https://github.com/rcs-business-messaging/rbm-api-examples/tree/master/nodejs/rbm-intro

- RBM Intro README confirms:
  - create RBM agent
  - upload assets
  - create service account key
  - put JSON at `resources/rbm-agent-service-account-credentials.json`
  - edit `src/config.js`
  - add test phone and agent ID
  - `npm install`
  - `node src/0-capabilityCheck.js`

## User Workflow Notes

The user is frustrated by drifting into polish before requirement proof.

Keep workflow tight:

1. Identify the job.
2. Map to requirement.
3. Do only the next useful build step.
4. Show exact output/link.
5. Avoid design polish unless it directly supports Google/RCS acceptance.

When making visual updates, ask/confirm unless the user has explicitly approved a must-fix pass.

## Personal Collaboration Notes

Important: do not rush off from a half-formed idea.

The user does not like an agent hearing one comment and immediately making changes before a return conversation. This happened during the profile/banner/storyboard design work and caused frustration. The user prefers:

- discuss the idea first
- say what you think should change and why
- wait for the final "yes / go ahead / approve" before editing
- then do the edit carefully
- then provide the preview link immediately

For design/storyboard/content changes, use this pattern:

1. User raises concern or idea.
2. Agent reflects it back in concrete terms.
3. Agent proposes exact change(s).
4. User approves.
5. Agent edits.
6. Agent verifies.
7. Agent gives link to inspect.

Avoid:

- "running off" because the user is thinking aloud
- making broad visual changes from a small comment
- assuming a rough idea is approval
- continuing to polish when the real task is requirement proof
- leaving the user waiting without a clear preview/result

Preferred phrase before edits:

`I think the exact change is X. If you approve, I will update Y and then give you the preview link.`

Exception:

- If the user explicitly says `go ahead`, `approve`, `do this`, or asks for a must-fix pass, it is okay to act.
- Even then, keep the edit tightly scoped and report exactly what changed.

## Context / Headroom Note

This conversation is long. Twilio-2 can continue a little, but a Twilio-3 handover is now prudent. If continuing here, keep work small and write durable files.
