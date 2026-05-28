# RCS-Twilio-1 Handover Diary

> **SUPERSEDED (2026-05-28).** Historical handover from the RCS-Twilio-1 session. The current living handover is `RCS_TWILIO_4_HANDOVER_2026-05-12.md`. Kept for the handover chain/history only.

Started: Wednesday 6 May 2026  
Last updated: Tuesday 12 May 2026, morning BST
Project: RightOnQ RCS Registration Studio  
Primary working file: `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`  
Current local browser URL: `file:///Users/macpro/rightonq-code.github.io/rcs-registration/index.html`  
Git branch: `rcs-registration-part-a-b-20260507`  
Latest pushed app commit before this handover: `f04c22f Refine RCS registration Part B flow`
Handover/GitHub plan commit: `224e92d Update RCS handover with GitHub and hosting plan`  
Initial RCS form commit: `4893751 Add standalone RCS registration form`

## Morning Sync - Tuesday 12 May 2026

This is the newest state for agents working around the RightOnQ website, RCS registration app, Twilio sender setup, and Part B storyboard work. It supersedes older notes below where they conflict.

### Current Branch / Files

Working branch:

- `rcs-registration-part-a-b-20260507`

Files refreshed in this morning sync:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`
- `/Users/macpro/rightonq-code.github.io/rcs-registration/google-apps-script/Code.gs`

### File And Preview Protocol - Do Not Skip

This project contains more than one `index.html`. Always verify the file path before editing.

### Golden Rule For Working With Adam

Do not rush ahead from half-formed ideas into edits.

Adam wants a collaborative working relationship, not a cold or passive agent. It is fine to inspect, think, suggest, and bring good ideas. But before changing product flow, wording, layout, files, commits, pushes, or anything that could affect the project state:

1. stop;
2. explain the exact proposed change;
3. discuss the reasoning in plain language;
4. wait for Adam's approval;
5. then edit only the approved scope.

This is especially important because the RCS work is commercially important and multiple agents may be active in nearby files. Unapproved changes, wrong preview URLs, wrong files, or accidental overwrites create anxiety and can cost hours or days of recovery work. The safest rhythm is: inspect first, propose clearly, wait for confirmation, then make the agreed change and verify it on the correct preview URL.

Correct RCS application file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

Main website file, not the RCS app:

- `/Users/macpro/rightonq-code.github.io/index.html`

Correct repo root for preview server:

- `/Users/macpro/rightonq-code.github.io`

Correct local preview command:

```bash
cd /Users/macpro/rightonq-code.github.io
python3 -m http.server 8902
```

Correct local preview URL:

- `http://localhost:8902/rcs-registration/index.html`

Avoid using a server started from inside `/Users/macpro/rightonq-code.github.io/rcs-registration` for visual review. It can make root-relative assets such as `/images/...` resolve incorrectly and can make the page look subtly wrong. If the browser shows a `file://` URL or a localhost URL that does not include `/rcs-registration/index.html`, stop and correct the preview before judging the design.

Before editing:

- confirm branch with `git branch --show-current`;
- confirm the target file path is `rcs-registration/index.html`;
- check `git status --short` and note unrelated dirty files;
- do not stage root `index.html`, legal pages, or future-amendment notes unless the user explicitly asks.

Before saving work as a commit:

- run the inline script syntax check for `rcs-registration/index.html`;
- run `git diff --check` on the exact files being committed;
- check `git diff --cached --name-only` before committing;
- commit only the files in the approved scope;
- do not push experimental layout work until the user has seen the correct `http://localhost:8902/rcs-registration/index.html` preview and approved it.

Known unrelated local work at the time of this sync:

- root `/Users/macpro/rightonq-code.github.io/index.html` is modified and should still be treated as unrelated to the RCS registration app unless the user explicitly asks to work on the main website.
- root `privacy.html` and `terms.html` are modified on this branch because the cleaned legal-page wording from `main` was synced into the RCS branch.
- untracked future-amendment notes exist at repo root and should not be staged by accident.

### Twilio Console State Learned On 11 May

The user inspected the live Twilio Console for the existing RightOnQ RCS sender draft. Do not repeat account SIDs, sender SIDs, agent IDs, billing details, private device numbers, or uploaded Twilio asset URLs in shared notes or public docs.

Confirmed live-console facts:

- RCS is available in the Twilio account.
- An existing `RightOnQ` RCS sender draft exists and is still `Not Submitted`.
- Tabs visible for the sender: `Public details`, `Test`, `Configuration`, `Compliance registration`.
- Public details can be edited and re-saved while the sender is still not submitted.
- Compliance registration was blocked until required public profile fields were completed.
- Test tab exists and offers adding an RCS-compatible test device.
- Configuration tab asks for webhook URLs, fallback URL, status callback URL, and assigned Messaging Service. These were inspected but not configured.
- No compliance submission, live launch submission, production messaging, or webhook send path has been approved yet.

Current RightOnQ Twilio Public Details values used/approved in the live console:

- Sender display name: `RightOnQ™`
- Use case: `Promotional`
- Description: `See how branded RCS messages can make two-way conversations clearer from the first hello.`
- Accent colour: `#1763ba`
- Contact type: `Email`
- Primary email: `adam@rightonq.co.uk`
- Email label: `Support`
- Privacy policy: `https://www.rightonq.co.uk/privacy/`
- Terms of service: `https://www.rightonq.co.uk/terms/`

Important description lesson:

- Twilio's visible helper says the description should include how users interact with the sender.
- The earlier storyboard line, `The RCS software layer for effective business messaging.`, is elegant brand/profile copy, but the final Twilio description is better because it describes the experience and remains under 100 characters.
- The Part A app now treats this as a `Public profile description` with a 100-character maximum, rather than a loose 500-character sender description.

Current local upload-ready asset files created for the Twilio public profile:

- Logo: `/Users/macpro/Downloads/design_handoff_rcs_storyboard/assets/rightonq-rcs-logo-upload-224-padded.png`
  - verified as 224 x 224 PNG, about 21 KB.
  - this is the correct padded upload file, not the older comparison/review sheet.
- Banner: `/Users/macpro/Downloads/design_handoff_rcs_storyboard/assets/rightonq-rcs-banner-upload-1440x448.jpg`
  - verified as 1440 x 448 JPG, about 5.1 KB.
  - this was copied to an obvious final upload filename so it is easy for the user to find from Finder/upload dialogs.

Practical file-delivery rule learned:

- When the user needs to upload an asset manually, create an obvious final file in the working folder, verify dimensions and size, then give that exact path. Avoid sending the user to ambiguous source/review filenames.

Logo preview rule learned from real Twilio test device:

- Do not judge the sender logo only from the upload/crop preview. Test it at real inbox size on both light and dark phone screens before submission.
- The RightOnQ dark logo tile is acceptable for the pilot, especially on light mode. It is not worth over-tuning now.
- For client applications, logo contrast may matter more than the artwork looking perfect at full size. A client's logo should be checked in the message list/inbox view before final submission.
- Twilio's test-device flow is commercially useful: RightOnQ can nominate an internal RCS-capable phone, view the client's sender profile in a real inbox, and adjust logo/background/size before submission. This is part of the value of a managed registration service, because many clients will not know how to judge these details from provider upload screens alone.

### Part A App Update From This Sync

`rcs-registration/index.html` has been updated so the existing `senderDescription` field now matches the live Twilio learning:

- label changed from `Sender description` to `Public profile description`;
- helper now explains it may appear in the messaging app profile and must be clear, factual, and under 100 characters;
- `maxlength` changed from `500` to `100`;
- character counter changed from `0 / 500` to `0 / 100`;
- review label changed to `Public profile description`;
- automated draft descriptions were shortened so they fit the 100-character profile field.

The longer reviewer/compliance explanation remains separate as `Message use case description`; do not collapse the public profile description and longer use-case explanation into one field.

### Apps Script Intake Update From This Sync

`rcs-registration/google-apps-script/Code.gs` now includes these lines in Adam's notification email for new Part A submissions:

- `Use case`
- `Public profile description`

The Google Sheet append order was not changed in this sync to avoid shifting existing spreadsheet columns. The full payload JSON already remains in the appended row, so the public profile description is still preserved in the raw submission data.

### Twilio Support Email Evidence

Twilio Support replied to Adam's ticket on 11 May 2026 and confirmed the useful Part B/video assumptions:

- RightOnQ can produce the RCS verification video on behalf of clients.
- The actual client does not need to appear in the video.
- The video must accurately demonstrate the end-user opt-in and opt-out flows.
- If a client brand is not registered yet, a staged or simulated flow is acceptable, provided the brand identity and user journey are clear.
- Twilio does not currently provide an official sandbox/test agent or official example verification video for this process.
- Twilio said they are happy to review a draft video/storyboard and provide suggestions.

Adam replied to the ticket to confirm that understanding and keep the guidance in the support record.

### Current Part B / Storyboard Workspace

Current Part B design/storyboard workspace:

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/storyboard.html`
- preview: `http://localhost:8899/storyboard.html`

If the preview server is not running:

```bash
cd /Users/macpro/Downloads/design_handoff_rcs_storyboard
python3 -m http.server 8899
```

Important related files in that workspace:

- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/RCS_TWILIO_2_HANDOVER_2026-05-11.md`
- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/google-rcs-video-readiness-audit.md`
- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/rightonq-rbm-test-agent-plan.md`
- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/rightonq-part-b-rbm-registration-playbook.md`
- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/rightonq-rbm-use-case-classification-note.md`
- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/rightonq-rbm-google-submission-narrative.md`
- `/Users/macpro/Downloads/design_handoff_rcs_storyboard/rightonq-twilio-public-details-fill-sheet.md`

Current direction:

- Twilio Console is the current application/control-plane route for the RightOnQ pilot.
- Google/RBM requirements still sit underneath the process and should guide evidence quality.
- Direct Google RBM API/test-agent work is useful as technical background, but the current operational route is Twilio first.
- Do not spend on AI video yet.
- Do not add runnable sender code yet.
- Do not put secrets in files.
- Do not send real messages until Twilio sender/test-device credentials and explicit approval exist.
- Do not assume Twilio public details completion means Compliance Registration or carrier approval has happened.

New Part B workflow idea from 12 May test-device learning:

- The first practical Part B step should likely be a real-device sender-profile check before video production.
- After Part A is received and RightOnQ has the client's logo/brand details, RightOnQ can upload/test the client's sender profile in Twilio, nominate an internal RCS-capable phone, and check the logo at real inbox size.
- Twilio's Public Details phone preview appears useful but may not be accurate for final inbox thumbnail scale. The real phone is the truth.
- RightOnQ should consider keeping a small set of test phones, including at least one Android device and more than one display mode/device type, to check thumbnail scale and contrast before formal submission.
- After RightOnQ has adjusted the client's logo/background/size, the client can be invited to become a tester and receive the test sender/profile on their own preferred phone.
- Because this test route is outbound/test-only, the client may not be able to reply in-message with approval. The Part B workflow should therefore include an explicit checkbox/sign-off such as "I have viewed the sender profile/logo on my phone and approve it for the review video/submission."
- This should sit at the beginning of Part B, after Part A intake/review and before the final review video is prepared.
- This is a strong managed-service value point: RightOnQ is not merely collecting a logo; it is checking how the sender identity actually appears on real devices and reducing the risk of a poor-looking or rejected submission.

### Use Case / Category Decision

Current first-launch category:

- `Promotional`

Reason:

- The first RightOnQ sender is for people/businesses exploring RCS, seeing examples, and receiving follow-up.
- It should not be labelled `Multi-use` for the first submission unless the evidence genuinely supports both promotional and transactional use.
- Future client registration/application updates may be transactional, but that is a later service pattern and should not be mixed into this first RightOnQ pilot sender unless deliberately approved.

### Legal Pages / Brand Notes

Privacy and Terms pages exist and have been synced into the RCS branch with public provider names removed. They are suitable for continued RCS/RBM preparation, subject to final human/legal review before formal submission.

Use these public URLs for the RightOnQ pilot unless a later legal review changes them:

- `https://www.rightonq.co.uk/privacy/`
- `https://www.rightonq.co.uk/terms/`

Brand/trademark note:

- RightOnQ is currently treated with `™` in the Twilio draft sender name.
- Do not change to `®` in live submission material unless the trademark registration position has been confirmed by the human/account owner before submission.

### Notes For RightOnQ.co.uk-Web-4

The RCS registration app is still a standalone mini-application and should not be merged into the main website homepage by accident.

Useful website-design context:

- RightOnQ's public website, legal pages, and any RCS registration entry point should tell the same basic story: RightOnQ helps businesses understand and use RCS for clearer two-way conversations.
- Avoid publicly naming implementation providers unless there is a deliberate reason.
- Do not imply RCS is already live for public traffic; the Twilio sender is still a draft/not-submitted sender.
- If the main site later links to the RCS form, link out to the standalone registration path/app rather than embedding the whole workflow into the homepage.
- If adding public opt-in copy for the RightOnQ pilot, align it with the storyboard idea: the person asks to receive RightOnQ RCS examples and follow-up messages and can reply STOP to cancel / HELP for help.

## End Of Day 2 Diary - Thursday 7 May 2026, 20:25 BST

This section is the current state of play and supersedes older notes below where they conflict. Earlier notes are retained for history because they explain why the form took its current shape.

### Recovery Status

The RCS registration work is safely pushed to GitHub.

Repository:

- `rightonq-code/rightonq-code.github.io`

Branch:

- `rcs-registration-part-a-b-20260507`

Latest confirmed app commit before this handover:

- `f04c22f Refine RCS registration Part B flow`

Files confirmed on GitHub by a second agent:

- `rcs-registration/index.html`
- `images/rightonq-landscape-glow-logo.png`

The Chrome/GitHub verification agent confirmed:

- the branch exists,
- commit `f04c22f` is the latest visible commit,
- `rcs-registration/index.html` is visible at 4,669 lines / 176 KB,
- `images/rightonq-landscape-glow-logo.png` is visible at approximately 2 MB.

If this computer, Codex Desktop, or the current context window fails, another agent can recover the current RCS registration work from that branch.

Important caveat:

- The root site file `/Users/macpro/rightonq-code.github.io/index.html` is still locally modified and unrelated.
- It was deliberately not staged, committed, or pushed as part of the RCS work.
- Continue to avoid staging it unless the user explicitly asks to work on the main website.

### Current Local / Git Status At Handover

Working directory:

- `/Users/macpro/rightonq-code.github.io`

Current branch:

- `rcs-registration-part-a-b-20260507`

Expected status after the last push:

- branch is up to date with `origin/rcs-registration-part-a-b-20260507`;
- only unrelated root `index.html` remains modified locally.

Commands used repeatedly for verification:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('rcs-registration/index.html','utf8'); const match=html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log('script syntax ok');"
git diff --check -- rcs-registration/index.html
```

Both checks passed before the latest push.

### High-Level Product State

The project is now a standalone RightOnQ RCS registration application, not part of the main marketing homepage.

Current file:

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

Browser URL:

- `file:///Users/macpro/rightonq-code.github.io/rcs-registration/index.html`

Intended beta hosting shape:

- GitHub Pages / standalone branch/path first.
- Later, the main RightOnQ website can link out to the registration app.
- The app should remain independent rather than being merged into the homepage.

The app now presents the journey as two phases:

- **Part A**: client completes registration details and sends the Part A pack to RightOnQ.
- **Part B**: RightOnQ prepares the review video, client reviews/approves it, then registration is submitted and monitored.

### Part A Current Shape

Part A has 8 visible steps:

1. Business details
2. Brand profile
3. Contact details people will see
4. Use case declaration
5. How people agree
6. RCS launch markets
7. Review
8. Send Part A

Key current behaviours:

- Continuous field numbering runs across the form.
- `ROQ` / `R-O-Q` in legal business name still acts as a testing bypass.
- Browser autosave is re-enabled.
- Save progress file / resume from file remains available.
- UK is ticked by default in Step 6.
- United States is not ticked by default, but may appear ticked in the user browser because autosave restores test selections.

### Review / Sign-Off Improvements

Step 7 Review now has one `Edit section` button per review card.

Behaviour:

- Button takes the user straight back to the relevant step.
- Existing answers remain intact.
- This avoids noisy per-field edit controls while still giving an HMRC-style correction route.

### Step 6: RCS Launch Markets

The old `UK launch scope` wording was replaced.

Current title:

- `RCS launch markets`

Current main instruction:

- `RightOnQ is currently preparing RCS sender registrations for UK-registered companies. Choose the countries where your business expects to send RCS messages.`

Current field label:

- `Destination countries for your RCS messages`

The form now uses individual destination country checkboxes based on Twilio's RCS onboarding country list, rather than vague regions.

Countries/options currently shown:

- United Kingdom - checked by default
- Austria
- Belgium
- Czech Republic
- Denmark
- Finland / Aland Islands
- France
- Germany
- Ireland
- Italy
- Mexico
- Netherlands
- Norway
- Poland
- Portugal
- Romania
- Slovakia
- Sweden
- United States

Each non-US option states:

- `No known RCS sender onboarding fee.`

United States is marked with a red asterisk and warning:

- Known extra onboarding fees apply.

Current US cost note:

- `United States registration currently carries third-party/carrier onboarding fees of up to $700 initially and $200 annually per RCS Sender, based on current provider guidance. Selecting United States does not take payment today. RightOnQ will confirm the current fees before any US carrier submission is made, and US registration will only proceed once those fees have been agreed and paid. Some US fees may still apply even if approval is not granted.`

Source logic:

- Twilio asks for selected recipient/destination countries during onboarding.
- US has extra RCS sender onboarding fees based on Twilio Help / US RCS guidance.
- Non-US RCS sender onboarding fees are not currently published/known in the same way.

Important wording principle:

- Do not use `North America` casually because it hides the US fee problem.
- Do not include `Not sure yet`; it creates a review headache and does not map cleanly to final provider submission.

Conditional US fields:

- Boxes 43/44 only appear if `United States` is ticked.
- When shown, they are required.
- They are hidden from the Review page if United States is not selected.

Box 43:

- `Approximate monthly website visitors`
- Helper: `Needed for United States registration. US carriers ask for website traffic linked to this use case. This is overall website traffic, not US visitors only.`

Box 44:

- `Existing US messaging activity`
- Helper: `Needed for United States registration. US carriers ask whether the business already uses Short Code, Toll-Free, 10DLC, SMS, or similar messaging. Choose the closest match.`

### Part A Completion Message

After pressing `SEND to RightOnQ`, the completion panel says Part A has been sent and the copy saved.

It now invites the user to look at Part B without layout-specific wording:

- `Select 1 Part B storyboard to see the next stage.`

The `1` is shown as a small circular badge. The surrounding text inherits the same typography as the rest of the paragraph.

### Part B Progress / Navigation

Part B panel is visible from the start so clients understand the whole journey.

Current Part B progress heading:

- `Video stage after Part A`

Part B has 3 steps:

1. Part B storyboard
2. Review and approve video
3. Registration submitted

The earlier lower preview card in the left rail was removed because it distracted the user and duplicated the right-hand workspace.

The `Return to Part A` button was removed from Part B pages.

### Part B1: Storyboard

Current purpose:

- Explain Part B before the client reaches it.
- Show the full journey from Part A accepted through video preparation, review, edits if needed, and submission.

Current B1 intro includes:

- RightOnQ prepares the review video on the client's behalf.
- The video forms part of the RCS sender approval process.
- RightOnQ structures it around what reviewers expect to see.
- This reduces avoidable questions, corrections and delays during review.

Official wording preference:

- Use `RCS sender approval`, not `licence`, unless official docs require the other term.

### Part B2: Review And Approve Video

B2 now behaves like a client-facing review page.

Layout:

- Left: review video area / what happens next.
- Right: numbered video review checklist.

Checklist intro:

- Watch the video first.
- If happy, tick items 1 to 5.
- If anything needs changing, tick `Changes needed` and add notes.

Checklist items:

1. Sender name
2. Logo and banner
3. Message examples
4. Permission route
5. Opt-out route

`Changes needed` is unnumbered.

Button behaviour:

- If items 1-5 are all ticked and `Changes needed` is not ticked, button appears as `Send approval to RightOnQ`.
- If `Changes needed` is ticked, button appears as `Send changes for amendment`.

Recent visual fix:

- The numbered checklist circles were misaligned because a generic `.part-b-check span` CSS rule was fighting the badge layout.
- Fixed by giving the text its own `.part-b-check-text` class and keeping the number badge separate.

### Part B3: Registration Submitted

B3 was heavily redesigned today.

Current top title:

- `Registration submitted`

Current intro:

- `Your RCS registration pack has been submitted for provider and carrier review. This is the final approval stage before your business can start sending approved RCS messages.`

The old generic `Part B preview` kicker was removed.

Left-hand status card:

- Green status pill: `Submitted for review`
- Heading: `Now the review work begins`
- Paragraph 1:
  - `The registration pack now goes through provider and carrier checks, including the review video, brand details, message examples, permission route and opt-out route.`
- Paragraph 2:
  - `Once approved, RCS helps your business appear as a recognised branded contact in customers' messaging apps, with richer message layouts, clearer reply options and more trust than a plain text message.`

Timeline items:

1. What happens now
2. Typical review time
3. Why this matters
4. RightOnQ keeps watch

Typical review time currently says:

- `Review times vary by market and carrier. As a guide, allow around 4-6 weeks, although some applications may move faster or need follow-up questions.`

Right-hand side:

- A dark `Brewery launch example.` panel.
- It now emulates the carousel style from the main RightOnQ page.
- It uses Hometown Brewery as the example.
- It has a live 3-card carousel with arrows and dots.

Carousel cards:

1. Open Harvest
   - Copy: `A traditional bottled ale for pubs, farm shops and independent retailers looking for a fresh seasonal line.`
   - Buttons: `Send sample case`, `Arrange a visit`, `Not for us`
2. June 2026 launch event
   - Copy: `Invite selected buyers to the Open Harvest launch, with tasting notes, event details and a direct response.`
   - Buttons: `RSVP`, `Undecided`, `Far too busy`
3. Meet James Mitchell
   - Copy: `Introduce a new sales representative to trade partners with a clear, friendly way to respond.`
   - Buttons: `Arrange a meet-up`, `Wish James all the best`

Carousel assets used:

- `images/hometown-brewery-open-harvest.png`
- `images/hometown-brewery-open-harvest-event.png`
- `images/hometown-brewery-james-mitchell.png`

Contact card:

- Uses new logo asset `images/rightonq-landscape-glow-logo.png`.
- Current heading/copy:
  - `Questions during review?`
  - `email adam@rightonq.co.uk`

Important: the user may still want further visual tuning of B3 tomorrow, especially the balance of left and right column heights and the contact card polish.

### New Asset Added Today

Added and pushed:

- `/Users/macpro/rightonq-code.github.io/images/rightonq-landscape-glow-logo.png`

Source file copied from:

- `/Users/macpro/Downloads/a_vector_style_digital_logo_features_the_word_rig.png`

Used in:

- Part B3 contact card.

### Wording / Style Preferences Reinforced Today

User strongly prefers:

- Plain human language.
- Avoid provider/legal jargon unless necessary.
- Avoid `sender` when speaking from the client's point of view; use `your business`, `your RCS messages`, or similar.
- Avoid patronising helper text.
- Avoid vague words like `scope`, `evidence`, `portal`, `sender` where a normal business owner would hesitate.
- Be transparent about fees and responsibility.
- Ask before significant changes.

Specific wording decisions:

- `Contact details people will see` is good and should be preserved.
- `Public contact details for this sender` was rejected as too confusing.
- `RCS launch markets` replaced `UK launch scope`.
- `Destination countries for your RCS messages` replaced `Destination countries for this RCS sender`.
- `Questions during review? email adam@rightonq.co.uk` is currently preferred over longer contact copy.

### Official / Research Notes From Today

Docs checked or relied on during today:

- Twilio RCS onboarding.
- Twilio RCS regional availability.
- Twilio US RCS guidelines.
- Twilio RCS Messaging Best Practices and FAQ.
- Google RCS Business Messaging launch approval.

Key findings:

- Provider registration requires destination/recipient countries before launch.
- US RCS registration has extra carrier/third-party onboarding fees.
- Current known Twilio-specific US fee picture:
  - Aegis Sender Review Fee: $200 at submission and annually after approval, per RCS Sender.
  - T-Mobile Sender Activation Fee: $500 one-time once submitted for review.
  - Some fees can apply regardless of approval outcome.
- Non-US RCS sender onboarding fees are currently not known/published in the same way.
- Final wording should avoid pretending all destinations are automatic.

### Things To Review Tomorrow

Recommended next work with user:

1. Visually inspect Part B3 again after the latest spacing/logo/carousel changes.
2. Decide whether the RightOnQ logo card should be further reduced or replaced with a cleaner final asset.
3. Confirm Hometown Brewery carousel copy/buttons exactly match the main RightOnQ page or desired final mockup.
4. Test Part B2 checklist after the circle alignment fix.
5. Test Step 6 US checkbox behaviour:
   - US unchecked: boxes 43/44 hidden and review page omits them.
   - US checked: boxes 43/44 appear and become required.
6. Test autosave restore and explain to user that restored test choices can make US appear ticked.
7. Consider whether to add a visible or hidden “clear saved test progress” button for development only.
8. Do a full end-to-end Part A test with `ROQ` bypass and then one honest completed test.
9. Consider whether `SEND to RightOnQ` should eventually trigger a real email/backend workflow.
10. Do not merge into main site yet; keep standalone.

### Current Implementation Is Still Static

There is still no backend.

When the user presses the final send button:

- The form prepares/downloads a local JSON registration file.
- The completion panel says Part A has been sent.
- No real email or server submission happens yet.

This has been accepted for the current beta build, but must be solved before real client use.

## Summary

Today we built and heavily iterated a standalone static HTML/CSS/JS form for preparing UK-only RCS sender registration information for RightOnQ-assisted submission. The page started as a broad RCS sender registration template and has been progressively tightened into a guided client-facing intake with automated drafting, validation, autosave, review/export, and demo video generation.

The major product direction settled today:

- This is a RightOnQ client tool, not an open-market self-serve paid registration product.
- Client-facing wording should avoid naming the provider at this stage.
- The form must collect answers that map to the actual RCS registration/application requirements, no more and no less.
- Where we help clients with prefilled wording, it must be accurate, editable, and not invent facts.
- Consent/opt-in is a sensitive area; we must guide but not guess.

## Files Created Or Changed

### Added / Current RCS Folder

- `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`
  - Main static app.
  - Contains all HTML, CSS, and JavaScript inline.
  - No backend required.

- `/Users/macpro/rightonq-code.github.io/rcs-registration/RCS_TWILIO_1_HANDOVER_2026-05-06.md`
  - This handover document.

- `/Users/macpro/rightonq-code.github.io/rcs-registration/README.md`
  - Folder-specific README explaining that this is a standalone beta form.

- `/Users/macpro/rightonq-code.github.io/rcs-registration/backups/rcs-registration/2026-05-07-0934/`
  - Timestamped backup made on Thursday 7 May 2026 at approximately 09:34 BST.
  - Includes a copy of the form as it existed before moving into the standalone folder.
  - Includes a copy of the 6 May handover note.

### Existing Dirty File Not Touched By This Work

- `/Users/macpro/rightonq-code.github.io/index.html`
  - Was already modified outside the RCS commit scope.
  - It was deliberately not staged, committed, or pushed as part of the RCS branch.

## Current Form Shape

The app is an 8-step form:

1. Business details
2. Brand profile
3. Sender contact details
4. Use case declaration
5. How people agree
6. UK launch scope
7. Declaration and sign-off
8. Registration pack

Field numbers now run continuously from the beginning of the form to the end. This was changed from per-step numbering because the user wanted references like “box 38/39” to be stable across the whole form.

## UK-Only Decision

The form is currently UK-only.

Implemented:

- Registration issuing country fixed to `United Kingdom`.
- UK launch scope only.
- Removed Gulf/UAE, Hong Kong, and Other region choices.
- Export always records `regions: ["UK"]`.
- Added required UK launch confirmation.
- Company type options were changed to UK-appropriate structures.

## Provider Naming

We removed visible provider references from the client-facing page. The current language uses:

- RCS registration
- provider registration
- registration pack
- RightOnQ-assisted RCS sender submission

Rationale: the client does not need to see the provider relationship at this stage.

Important: Some source/documentation references in conversation included Twilio/Google, but the visible page was scanned and visible `Twilio` references were removed.

## Official Guidance Checked

Sources used during the day:

- Twilio RCS onboarding guide: `https://www.twilio.com/docs/rcs/onboarding`
- Google RCS launch approval: `https://developers.google.com/business-communications/rcs-business-messaging/guides/launch/launch-approval`
- Google AgentLaunch questionnaire reference: `https://developers.google.com/business-communications/rcs-business-messaging/reference/business-communications/rest/v1/AgentLaunch`
- GatewayAPI RCS registration/agent management blog for industry context:
  `https://gatewayapi.com/blog/everything-you-need-to-know-about-rcs-registration-and-agent-management/`
- RightOnQ live site:
  `https://www.rightonq.co.uk/`

Important official requirements identified:

- Public sender profile fields include display name, description, logo, banner, accent colour, contact details, privacy policy URL, and terms URL.
- Registration review asks for authorised representative details.
- It asks for opt-in and opt-out policy descriptions.
- It asks for opt-in evidence via publicly accessible screenshot/page/document URL.
- It asks for trigger description.
- It asks for use case/interactions description.
- It asks for exact opt-out response.
- It asks for video URL or reviewer access showing the use case and STOP opt-out flow.
- Google launch approval emphasises accurate assets, privacy/terms links, preview video, and STOP capability.

## Key Wording Decisions

### Trading Name

Later correction from 2026-05-18: do not copy this example into legal-business-name fields. Use the exact registered legal name in legal-name fields, and use the public brand only where a separate trading-name / brand field exists.

The current helper at the time was:

`Use this if the public brand differs, e.g. Continuity AI Ltd trading as RightOnQ.`

Rationale:

- The exact phrase “trading name” is not a special official RCS field.
- The real need is to link legal business, public brand, website, and sender/display name.
- RightOnQ itself is the perfect example: legal entity `Continuity AI Ltd`, public brand/site `RightOnQ`.

### Display Name

Restored to:

`The name customers should see in their inbox. It should clearly match your brand.`

A bracketed note was briefly added, but the user preferred the original clarity and noted RightOnQ can review before submission.

### Sender Description

We removed made-up “short brand description” and “long brand description” fields.

Current field:

- `Sender description`

It auto-drafts based on display/trading/legal name and industry. It uses RightOnQ-like operational messaging language rather than generic low-value examples.

Rationale:

- Official docs describe a sender description/brief summary. They do not ask for short and long descriptions as separate public profile fields.
- User strongly objected to invented questions and generic examples like booking confirmations where not appropriate for RightOnQ’s product.

### Brand Colour

Current helper explains that this is one accent colour for the sender frame, with bracketed smaller/italic note that logos/banners/message images can still use the full brand palette.

Rationale:

- Official profile uses one accent colour field.

## Automated Defaults

Implemented several “copy until edited” defaults:

- Authorised representative name defaults from primary contact name.
- Authorised representative email defaults from primary contact email.
- Customer-facing email defaults from primary contact email.
- Customer-facing phone defaults from primary contact phone.
- Registration notification email defaults from primary contact email.
- Display name defaults from trading name.

Behaviour:

- Once the user edits the target field manually, the app stops overwriting it.

Phone defaults:

- Primary contact phone starts as `+44 `.
- Customer-facing phone starts as `+44 `.
- Reset logic also restores `+44 `, though reset/start again is no longer exposed in the visible UI.

## Registered Address

Changed from a large textarea to structured UK-style address fields:

- Address line 1
- Address line 2
- Town/city
- County
- Postcode

The export still builds a combined `registeredAddress` value for RightOnQ/admin use.

The address fields have a warm gold number accent so boxes 7-11 visually read as one address group.

## Use Case / Message Drafting

Fields in the use case section are now drafted where safe:

- Message trigger
- Use case description
- Example message 1
- Example message 2
- HELP sample message
- STOP sample message
- Opt-out description
- Video evidence notes
- Reviewer access notes

These drafts are built from:

- Sender/brand name
- Business industry
- Customer-facing email/phone
- Use case where relevant

Important: if a client edits a drafted field, the app stops overwriting it.

## Industry Matrix For Example Messages

Expanded industry-specific drafting for Example message 1 and Example message 2.

The user initially referred to boxes 38/39, but after checking the actual continuous numbering, example messages were boxes 34/35. The consent fields then shifted after the new consent dropdown.

Current examples vary by industry, including:

- Agriculture
- Automotive
- Communication
- Construction
- Education
- Entertainment
- Financial
- Government
- Healthcare
- Hospitality
- Insurance
- Legal
- Manufacturing
- Nonprofit
- Professional
- Real estate
- Retail
- Technology
- Transportation
- Other

## Consent / Opt-In Section

This was the most sensitive part of the day.

Important decision:

- We should not invent consent facts.
- We can guide clients to explain the actual opt-in route.
- The wording must map to the official opt-in description/evidence requirement.

Current box 38:

`How will people agree to share their mobile number for RCS messages?`

Helper:

`Choose every place where people will agree to receive RCS messages. Pick the options that best match how the business already collects permission.`

Current control:

- Checkbox group, not a dropdown.
- Users can choose more than one route because businesses may collect permission through more than one place.

Checkbox options:

- Website form
- Customer account
- Customer record
- Event or in-person signup
- Staff list
- Other consent record

Current behaviour:

- User chooses one or more opt-in routes.
- The app drafts:
  - Opt-in mechanism description
  - Opt-out mechanism description
- Drafts explicitly mention mobile numbers and RCS messages.

Rationale:

- Official wording asks for “how users opt in” and evidence, not literally “where phone numbers came from.”
- But the user correctly observed that plain-English clients need to know this is about permission to use mobile numbers for RCS messages.
- The current wording is the compromise: accurate to official requirement, clear about mobile numbers, and not frightening to a normal business owner.

Open caution:

- Before further changing this section, verify against official docs and ask the user before patching.

## Registration Pack / Export

Final step is now “Registration pack”.

Contains:

- Review summary
- RightOnQ admin file download
- Save PDF copy
- Generate video

The old `Export JSON` label was removed because it confused the user. It is now:

- `RightOnQ admin file`

Under the hood it is still JSON, because that is useful for importing/copying into provider registration, but the client does not need to know.

## Demo Video Generator

The final step includes a canvas-based video generator.

It uses:

- Logo upload
- Banner upload
- Brand colour
- Display/sender name
- Sender description
- Sample messages
- STOP sample message
- Opt-in / opt-out wording

It generates a browser-recorded WebM file via `MediaRecorder`.

Purpose:

- Produce a client-specific representative RCS review video showing:
  - Opt-in
  - Sender identity
  - Sample messages
  - HELP/CTA chips
  - STOP opt-out flow
  - Final review-ready summary

Limitations:

- It does not upload to YouTube or hosting automatically.
- RightOnQ must host the generated video somewhere public/unlisted and paste the URL into the registration application.
- Auto-upload would require backend/OAuth and was intentionally deferred.

## Save / Resume Progress

Added practical no-backend progress support:

- Browser autosave via `localStorage`
- `Save progress file`
- `Resume from file`

The top save panel was initially too prominent and confusing. It was changed to a quieter strip at the top of the form:

- “Progress is saved in this browser”
- Autosave status
- Save progress file
- Resume from file

The visible “Start again” button was removed at the user’s request.

Current development note:

- Progress save/restore has been temporarily disabled in the live form during build/test because browser-saved stale values were interfering with user review.
- The code still contains save/resume support and can be re-enabled later.

Important limitation when re-enabled:

- Autosave works only in the same browser/device.
- Progress files can move between devices.
- File uploads themselves are not restored from progress files due browser security; uploaded logo/banner must be reselected if needed.

Future improvement:

- Proper emailed resume links require a backend/database/email service.

## Hidden Test Bypass

Test bypass exists:

- Enter `ROQ` or `R-O-Q` in Legal business name.
- Validation allows moving forward without completing required fields.

Purpose:

- Let user/developer jump through steps quickly during testing.

Suggested future improvement:

- Add a hidden jump shortcut like `ROQ-CONSENT` if user wants direct jump to opt-in page. Not implemented today.

## UI / Layout Work

Changes made:

- Multi-step form with progress panel.
- Continuous field numbering across form.
- Number badges beside labels.
- Active field number highlights on focus.
- Address field badges coloured differently to group address section.
- Helper text min-height added on desktop so paired inputs align.
- Bottom bar simplified:
  - Previous step
  - Next step
  - RightOnQ admin file
  - Generate video
  - Save PDF copy
- Previous step hidden on first step.
- Navigation no longer scrolls to the top hero; it scrolls to the form/workflow area.

## Validation

Implemented:

- Required-field validation before progressing.
- File upload validation:
  - Logo: square PNG/JPG, min 256 x 256 px.
  - Banner: landscape PNG/JPG, min 1440 x 448 px.
- Character counts for bounded fields.
- UK-only launch confirmation.

Historical note added 2026-05-20: this validation summary records the early 2026-05-06 handover state. It is superseded for current Twilio sender-profile submission assets: the current operating standard is a 1440 x 448 reusable Google/RBM master and a 1140 x 448 Twilio submission export.

Current caveat:

- There is no full browser automation QA yet.
- JavaScript syntax checks pass via Node `new Function(script)`.

## Current Verification

Repeated checks today:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('rcs-registration/index.html','utf8'); const script=html.match(/<script>([\s\S]*)<\/script>/)[1]; new Function(script); console.log('inline script syntax ok');"
```

Latest status:

- Inline JavaScript syntax OK.

## Git / GitHub Status

### End Of Wednesday 6 May 2026

- `index.html` modified before this work.
- `rcs-sender-registration.html` untracked/new.
- This handover file untracked/new.
- No commit made on 6 May.

### Thursday 7 May 2026 Update

- Created local branch: `rcs-registration-part-a-b-20260507`.
- Moved the RCS work into a standalone folder: `/rcs-registration/`.
- Committed only the `rcs-registration/` folder.
- Pushed the branch to GitHub.
- Commit: `4893751 Add standalone RCS registration form`.
- PR creation URL:
  `https://github.com/rightonq-code/rightonq-code.github.io/pull/new/rcs-registration-part-a-b-20260507`

Important:

- The unrelated root `index.html` remained modified but unstaged.
- It was not included in the RCS commit.
- This preserves a clean separation between the main RightOnQ website and the RCS registration form.

## Standalone Hosting Plan

The agreed direction is that the RCS form should remain independent from the main RightOnQ site.

Near-term beta plan:

- Publish the form through GitHub Pages using a GitHub-hosted address if possible.
- Intended beta path: `/rcs-registration/`.
- Example likely URL shape: `https://rightonq-code.github.io/rcs-registration/`, subject to GitHub Pages branch/source configuration.
- This lets the user test the form from a mobile phone and experiment with real hosted behaviour before connecting it to the main site.

Longer-term plan:

- The main RightOnQ site can later add a simple button or external link to the RCS form.
- The form itself should stay as a separate mini-application rather than being merged into the homepage.
- A future production address could be a RightOnQ path or subdomain, for example `/rcs-registration/` or a registration-focused subdomain.

## Part A / Part B Product Direction

The registration workflow should be treated as two phases:

### Part A: Sender Registration Details

The current form is primarily Part A.

It collects:

- Business details
- Brand profile
- Sender contact details
- Use case declaration
- How people agree to receive messages
- Opt-out handling
- UK launch confirmation
- Declaration/sign-off

RightOnQ should review Part A first, check for weak or missing items, and get the client to sign off the written registration information.

### Part B: Review Video

The review video should be prepared after Part A is checked and approved.

Reason:

- If Part A changes, the video may become wrong.
- If links, policy pages, message examples, or opt-in wording need correction, producing the video too early wastes time and money.
- Once Part A is correct, RightOnQ can create a tailored video using the approved business name, display name, logo, banner, brand colour, example messages, opt-in route, and STOP handling.

The user wants the videos to feel unique per client. Potential future direction:

- Use client branding and specific message examples.
- Vary voice/presenter/style where appropriate.
- Avoid every client video looking identical.
- Verify official Google/provider expectations before finalising the video workflow.

Current form implication:

- The form may need to remove or soften client-facing video URL fields because most clients will not have the review video ready at Part A.
- Suggested future wording: RightOnQ will help prepare the review video after the registration details have been checked and approved.

Part B video hosting follow-up:

- Add a task to confirm the final hosting route for review videos before building the Part B workflow.
- Current working assumption, based on Twilio/Google documentation checked so far: the review video can be hosted by RightOnQ on the client's behalf, provided the URL is accessible to reviewers and the client has authorised/approved the registration materials.
- Likely hosting options: unlisted RightOnQ YouTube video, unlisted Vimeo/private-link video, or a RightOnQ-hosted review page/file URL.
- Avoid making client compliance/review videos publicly browsable if possible.
- Before final implementation, re-check official Twilio/Google wording around video URL access, brand authorisation, and agent management on behalf of a client.

## Important Working Rule Going Forward

The user explicitly requested:

- Stop and ask before each upgrade/change from now on.
- Do not run off with form changes while the wording or direction is still being discussed.
- For anything involving official provider requirements, verify the exact official guidance first, then propose the change before patching.

Recommended next agent behaviour:

1. Read this handover.
2. Inspect current `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`.
3. Ask before changing.
4. Treat consent/opt-in wording as high-risk and source-sensitive.
5. Keep client language human, not patronising, not technical.
6. Keep questions mapped to actual registration/application fields.

## Recommended Next Steps Tomorrow

1. Review the whole form in-browser from the beginning with user.
2. Test autosave and resume-from-file.
3. Test hidden `ROQ` bypass.
4. Test the industry-specific drafts for a few industries:
   - Technology / RightOnQ
   - Agriculture
   - Automotive
   - Construction
5. Review opt-in section carefully:
   - Check whether box 38 wording still feels right.
   - Confirm dropdown options are not too many and not fake official categories.
   - Confirm generated box 39/40 wording maps cleanly to official opt-in description.
6. Test file uploads and generated video in browser.
7. Consider whether “RightOnQ admin file” should be hidden or left visible in final client version.
8. Consider adding a link from the main site to this page only when ready.
9. Consider backend/email resume link later, but not yet.

## Tone / Product Observation

The strongest product pattern discovered today:

The form should not ask clients to invent compliance language. It should:

- ask for factual inputs,
- draft the sensitive wording,
- let them edit,
- and let RightOnQ review before submission.

This is the shape that makes the tool feel valuable rather than bureaucratic.
