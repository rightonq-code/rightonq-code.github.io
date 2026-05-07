# RCS-Twilio-1 Handover Diary

Started: Wednesday 6 May 2026  
Last updated: Thursday 7 May 2026, 09:46 BST  
Project: RightOnQ RCS Registration Studio  
Primary working file: `/Users/macpro/rightonq-code.github.io/rcs-registration/index.html`  
Current local browser URL: `file:///Users/macpro/rightonq-code.github.io/rcs-registration/index.html`  
Git branch: `rcs-registration-part-a-b-20260507`  
Handover/GitHub plan commit: `224e92d Update RCS handover with GitHub and hosting plan`  
Initial RCS form commit: `4893751 Add standalone RCS registration form`

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

The current helper is:

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
