# RightOnQ Website Web-2 Handover

Date: 2026-05-04
Prepared by: Codex web-2
Repo: `/Users/macpro/rightonq-code.github.io`
Safe working branch: `build1-website-redesign`
Current local branch: `recovery-checkpoint-2026-05-04`

## Critical Context

This handover exists because most of the 2026-05-04 redesign work was done locally and was not in the GitHub history until late in the session. A bad shell edit briefly damaged the homepage, but the page was recovered from a saved browser HTML file, screenshots, and local backups.

Do not assume `main` contains the redesigned RCS homepage. It does not. The redesigned work is on the safe branch:

`build1-website-redesign`

The latest pushed commit on that branch at handover time is:

`87e5663 Update nav logo and public links`

The live `main` branch remains at:

`527ea4a Update Book a demo button to use cal.com booking link`

## Safety Rule Going Forward

For RightOnQ website work:

- Every useful visual/content improvement should be committed and pushed to `build1-website-redesign`.
- Every 30-60 minutes, commit and push.
- Before risky refactors, commit and push first.
- Do not push to `main` unless Adam explicitly asks.
- Do not overwrite files from generated/saved HTML without first creating a backup.
- Before any large edit, run `git status --short --branch`.
- After a chunk, show the diff summary and push the safe branch.

The user was understandably shaken by the earlier loss scare. Work slowly, explain what is changing, and prefer small reversible edits.

## Current Git State At Handover

Branch status before this handover document was created:

```text
## recovery-checkpoint-2026-05-04
```

Recent commits:

```text
87e5663 Update nav logo and public links
e2c144a Unify site footers
e4a3d8b Recover RightOnQ redesign homepage
bf3c9c1 Checkpoint RightOnQ recovery state
527ea4a Update Book a demo button to use cal.com booking link
```

Pushed remote:

`origin/build1-website-redesign`

## Files To Know

Main pages:

- `index.html`
- `what-is-rcs.html`
- `privacy.html`
- `terms.html`
- `blog/index.html`
- `_layouts/default.html`
- `_layouts/post.html`

Key assets:

- `images/rightonq-logo-right-calendar-hires-cropped.png`
- `images/rightonq-calendar-mark-transparent.png`
- `images/rightonq-logo-transparent.png`
- `images/aston-martin-db6-rcs-card.jpg`
- `images/aston-martin-db6-interior.jpg`
- `images/aston-martin-db6-engine.jpg`

Recovery backups:

- `recovery-backups/rightonq-saved-stale-homepage-2026-05-04.html`
- `recovery-backups/index-before-stale-restore-2026-05-04.html`
- `recovery-backups/index.current-bad-2026-05-04-1919.html`
- `recovery-backups/index.last-committed-before-redesign.html`
- `recovery-backups/index.partial-log-recovery-2026-05-04.html`

Do not delete the recovery backups yet.

## What Has Been Recovered / Implemented

### Homepage

The homepage has been recovered into a polished RCS-focused redesign.

Hero:

- Eyebrow: branded RCS messaging for UK businesses.
- Main idea: "For brands with an audience worth reaching."
- Copy explains branded RCS, SMS fallback, reply buttons, and delivery timed to each receiver's local day.
- Top nav now uses the "Right + calendar" logo asset:
  `images/rightonq-logo-right-calendar-hires-cropped.png`

Sender dashboard:

- Preserved and should not be changed casually.
- Current desired state includes:
  - 30 Sent
  - 29 Delivered, green
  - 70 On Q, red
  - 6 Replies, gold
  - 10:00 GMT clock
  - Audience 100
  - UK · Gulf · Hong Kong
  - Ref: AM.611
  - London delivered line with 6 replies
  - Dubai/Hong Kong On Q statuses
  - Bottom buttons: Replies / Follow-up / Export

Receiver phone:

- Label: `Receiver phone — RCS carousel`
- Carousel restored with three cards using:
  - exterior DB6 image
  - interior image
  - engine bay image
- Current carousel text:
  - Card 1: `1966 DB6 in Snow Shadow Grey. Immaculately restored and available for private viewings.`
  - Card 2: `Original interior detail, meticulously restored and presented with period-correct trim.`
  - Card 3: `Immaculately presented engine bay, carefully rebuilt with original-style detailing.`

Pricing:

- Pricing section recovered.
- Example campaign headline was cleaned away from giant price language:
  `Aston Martin DB6 campaign to a selected audience`
- Small style line:
  `Rich RCS style campaign with an image-led card, sender identity and one-tap response options.`
- Footer/fine-print pricing still says replies around 1.1p + VAT and SMS fallback at applicable fallback rate. This was intentionally cautious after Twilio research.

RCS education / "What is RCS" section:

- The section is present on the homepage.
- Main headline:
  `RCS messages bring brand identity, rich content and one-tap decisions.`
- Some content may still be worth another copy pass, especially reducing "someone"/"recipient" style wording where it feels impersonal.

RCS onboarding / registration:

- Includes the four-to-six week approval framing.
- Includes managed onboarding from around GBP 500.
- Includes the official Google RCS registration route link.

Contact:

- CTA uses `Book a call`, not "Book a Short Call".
- Contact form placeholder was removed or toned down to avoid telling users what to say.
- Copy emphasises UK-based businesses but does not imply recipients must only be UK-based.

Footer:

- Footers were unified across homepage, Privacy, Terms, and blog shared layout.
- New footer mark uses:
  `images/rightonq-calendar-mark-transparent.png`
- Footer wording:
  `© 2026 Continuity AI Ltd. Registered in England & Wales.`
  `Companies House No. 17119848`
  `RightOnQ™ is a trading name of Continuity AI Ltd.`
- Home address removed from footer. Registered office remains inside Privacy/Terms content.
- Privacy page footer does not link to Privacy.
- Terms page footer does not link to Terms.
- Footer TM inherits muted footer colour, not bright blue.

Links / SEO:

- Public links standardised to clean slash URLs:
  - `/blog/`
  - `/privacy/`
  - `/terms/`
  - `/what-is-rcs/`
- Added explicit Jekyll permalinks:
  - `privacy.html` -> `/privacy/`
  - `terms.html` -> `/terms/`
  - `what-is-rcs.html` -> `/what-is-rcs/`
- Local Python link checker reported no missing internal targets after this change.

## Known Caveats

### File Preview vs Served Site

The user often previews with `file://`. Clean slash links like `/terms/` are correct for GitHub Pages and Google, but can behave oddly in direct file preview. For final link QA, use a local server or Jekyll build output rather than raw file preview.

### Build Command

Earlier build attempts with the wrong Ruby failed because `jekyll` was missing under Ruby 4. The handover from web-1 indicated the correct local command should be based on Ruby 3.3:

`/opt/homebrew/opt/ruby@3.3/bin/bundle exec jekyll build`

Before deployment, run the correct build command if available.

### Header Logo

The current homepage top logo is a trial using:

`images/rightonq-logo-right-calendar-hires-cropped.png`

Adam liked it "for now". It has only been applied to the homepage nav so far. Privacy/Terms/blog still use their previous top-left nav logo unless changed later. If applying globally, update:

- `privacy.html`
- `terms.html`
- `_layouts/default.html`
- possibly `what-is-rcs.html`

Do this in a separate small commit.

### What Is RCS Page

`what-is-rcs.html` exists and now has permalink `/what-is-rcs/`. It has not had the same detailed recovery pass as the homepage in this latest session. Review before launch.

### Blog

The blog is intentionally retained. Adam plans a third blog about the move away from WhatsApp and towards RCS after a real business experience/conversation.

Existing blog notes:

- April 1 title was adjusted from "Building..." to "Designing..." wording.
- User likes the blog staying because it shows the real direction change.

### Twilio / RCS Research

A "Twilio agent" previously researched public Twilio RCS documentation. Findings that informed the page:

- Twilio supports RCS rich cards and carousels.
- Twilio carousel template is referred to as `twilio/carousel`.
- RCS carousel examples can include multiple cards with media/buttons.
- Rich cards/buttons are real RCS patterns.
- RCS sender profiles can include business name, logo, description, and verified sender identity.
- Twilio supports RCS fallback to SMS/MMS when RCS is unavailable.
- RCS registration/approval is required.
- Working assumption on site: approval commonly takes around four to six weeks.

Recheck live documentation before firm public claims about:

- fallback billing
- inbound reply pricing
- RCS annual/registration fees
- exact button limits by channel/device
- UK A2P availability and carrier behaviour

Current cautious fallback pricing language should not reveal RightOnQ's markup.

## Immediate Next Steps For Web-3

1. Run `git status --short --branch`.
2. Confirm current branch and remote:
   - local branch may be `recovery-checkpoint-2026-05-04`
   - work should push to `build1-website-redesign`
3. Inspect homepage visually, especially:
   - top logo size and nav height
   - footer on all pages
   - receiver carousel
   - sender dashboard
4. Decide whether to apply the new top logo globally.
5. Run proper local/Jekyll build and check served links.
6. Perform mobile QA.
7. Review `what-is-rcs.html` for consistency with homepage.
8. Do a final content/legal/pricing pass before any merge to `main`.

## Commands That Were Useful

Check status:

```bash
git status --short --branch
```

Push safe branch:

```bash
git push origin HEAD:build1-website-redesign
```

Recent successful push commits:

```text
e4a3d8b Recover RightOnQ redesign homepage
e2c144a Unify site footers
87e5663 Update nav logo and public links
```

## Final Note

This session recovered a near-lost local redesign. Do not restart from `main` unless Adam explicitly asks. Use `build1-website-redesign` as the current source of truth for web-2 redesign work.

