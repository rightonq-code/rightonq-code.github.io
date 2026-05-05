# RightOnQ Website Web-3 Handover

Date: 2026-05-05
Prepared by: Codex web-3
For: Codex web-4
Repo: `/Users/macpro/rightonq-code.github.io`
Current source of truth: `main`

## Executive Summary

Web-3 took over from the Web-2 recovery/redesign handover and carried the RightOnQ website through a full working session with Adam.

The important change from Web-2's handover is this:

- The redesign is now merged into `main`.
- `main` has been pushed to GitHub and is the live GitHub Pages source.
- The old safe branch `build1-website-redesign` is no longer the place to continue ordinary website work unless Adam explicitly asks.
- The latest pushed commit at handover time is:

```text
6975a5f Refine homepage RCS carousel fit
```

The working tree was clean before this handover document was added.

## Current Git State

Current branch:

```text
main
```

Tracking:

```text
origin/main
```

Latest relevant commits from this Web-3 session:

```text
6975a5f Refine homepage RCS carousel fit
1260c84 Improve mobile carousel controls and spacing
d6aef4f Refine responsive heading scale and hero spacing
5af3bc3 Refine homepage mobile example panels
e3bb647 Improve mobile headers and hero example framing
6d6cda5 Align RCS guide navigation and final copy
4c5b1ad Build plain-English RCS guide carousel examples
5be1f0e Audit site links and SEO metadata
8072865 Refine homepage RCS pricing and use cases
863b128 Reduce homepage hero title size
```

Historic branch reference:

```text
origin/build1-website-redesign -> 6d6cda5
```

That branch is useful as a history marker, but do not continue new work there by default.

## Working Protocol With Adam

Adam works best one task at a time, visually, with quick local previews.

Use this protocol:

1. Read the relevant page/code first.
2. Suggest wording before patching when the change is copy/marketing/legal wording.
3. Patch only after Adam approves wording or clearly says "go ahead".
4. Rebuild locally.
5. Give a local preview URL with a cache-buster query string.
6. Wait for approval or corrections.
7. Push after an agreed chunk, not after every tiny edit.

Adam explicitly wanted to avoid the previous "whole day unpushed" scare, but also does not want hundreds of tiny commits. A good rhythm is:

- Push after a meaningful chunk.
- Push before stopping.
- Push after a risky/mobile layout pass once approved.
- Say what will be included before pushing if there is any ambiguity.

Phrase to remember:

```text
Local preview first, GitHub push after approval.
```

Exception: if Adam clearly says "push", "re-push", "push to GitHub", or "let's have a look on the live site", commit and push.

Adam may say "start listening" in messages. That is a voice-command artefact, not irritation. Ignore it.

## Local Build / Preview

Use Ruby 3.3 for Jekyll.

Successful build command:

```bash
JEKYLL_ENV=production /opt/homebrew/opt/ruby@3.3/bin/bundle exec jekyll build
```

Important caveat:

- Homebrew Ruby 4 caused gem compatibility/build issues.
- Do not use `/opt/homebrew/opt/ruby/bin/bundle exec jekyll build` unless the local Ruby situation has changed.

Useful local server pattern:

```bash
cd /Users/macpro/rightonq-code.github.io/_site
/Users/macpro/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 8081
```

The current local browser has often used:

```text
http://127.0.0.1:8081/
```

Adam sometimes opens:

```text
file:///Users/macpro/rightonq-code.github.io/index.html
```

Be careful: `file://` can behave differently from the served site, especially with clean slash URLs and absolute asset paths. For real QA, use the local server or the live site.

## Deployment / GitHub Pages

Current deployment approach:

- Commit to `main`.
- Push `main` to GitHub.
- GitHub Pages publishes from `main`.

Typical push flow:

```bash
git status --short --branch
git add <files>
git commit -m "<clear message>"
git push origin main
git status --short --branch
```

Adam previously asked for one command at a time when running commands himself in Terminal. If guiding him manually, give exactly one command, wait for his output, then give the next.

## Files To Know

Primary pages:

- `index.html`
- `what-is-rcs.html`
- `blog/index.html`
- `privacy.html`
- `terms.html`
- `_layouts/default.html`

Site metadata:

- `_config.yml`
- `sitemap.xml`

Handover documents:

- `WEB2_HANDOVER_2026-05-04.md`
- `WEB3_HANDOVER_2026-05-05.md`

Images/assets:

- `images/rightonq-logo-right-calendar-hires-cropped.png`
- `images/rightonq-logo-transparent.png`
- `images/rightonq-calendar-mark-transparent.png`
- `images/aston-martin-db6-rcs-card.jpg`
- `images/aston-martin-db6-interior.jpg`
- `images/aston-martin-db6-engine.jpg`
- `images/hometown-brewery-open-harvest.png`
- `images/hometown-brewery-open-harvest-event.png`
- `images/hometown-brewery-james-mitchell.png`

Recovery files from Web-2 are still present. Do not delete them unless Adam asks:

- `index.recovered-from-codex-log.html`
- `recovery-backups/*`

## Main Session Achievements

### 1. Homepage Copy And Pricing Strategy

The homepage was refined around Adam's updated commercial plan:

- UK/basic time-zone offer at GBP 25/month.
- Premium international time-zone scheduling at GBP 50/month.
- International scheduling is positioned as premium rather than just included everywhere.
- Automotive and property use cases now make clearer why international scheduling matters.

Avoid over-explaining the price difference. Adam likes the logic implied inside the examples rather than heavy-handed pricing warnings.

### 2. Hero Title And Page Heading Scale

Adam felt the original hero title was oversized.

Final direction:

- Homepage hero heading is calmer.
- Section headings across homepage are scaled to roughly match the "For brands..." title treatment.
- Blog, Terms, Privacy and RCS guide page headings were reduced to avoid huge mobile titles.

Current relevant files:

- `index.html`
- `blog/index.html`
- `terms.html`
- `privacy.html`
- `what-is-rcs.html`

### 3. Homepage International Sender Dashboard

The hero dashboard is now explicitly an international sender dashboard.

Current intended meaning:

- It represents the premium international time-zone scheduling plan.
- It should remain clearly different from a future UK-only/basic dashboard.
- The dashboard uses Apex Motors and shows London/Dubai/Hong Kong scheduling.

Adam considered UK flag vs globe ideas, but current implementation uses wording/plan labelling rather than extra icon clutter.

### 4. Homepage Receiver Phone / RCS Carousel

The homepage receiver phone now has visible carousel controls matching the RCS guide style:

- Previous arrow.
- Dots.
- Next arrow.

Latest fix:

- The third reply button, `Not my cup of tea`, was being clipped.
- Commit `6975a5f` refined phone/card fit so all three reply buttons show cleanly without over-extending the phone frame.

Relevant file:

- `index.html`

Relevant IDs/classes:

- `#rcs-carousel-image`
- `#rcs-carousel-eyebrow`
- `#rcs-carousel-copy`
- `#home-rcs-carousel-prev`
- `#home-rcs-carousel-next`
- `.rcs-phone`
- `.rcs-card`
- `.rcs-carousel-controls`

Do not remove the slightly playful phrase `Not my cup of tea`; Adam liked that tone.

### 5. RCS Basic / Rich Example Clarification

Adam was careful about the distinction between:

- SMS fallback.
- Basic/text-led RCS.
- Rich/image-led RCS.

Homepage examples now try to avoid implying that SMS has branding. Apex Motors examples should preserve:

- Apex Motors sender name.
- Verified sender visual/tick where appropriate.
- SMS fallback language only where it is clearly fallback.

The text-led/basic RCS example was adjusted so `APEX MOTORS` and the green tick sit cleanly on the same line.

### 6. "Getting RCS Ready" Q1/Q2/Q3

The Q2 wording was rewritten with Adam's preferred tone:

- Avoid `simple` because it can imply underprepared.
- Prefer helpful/action-led language.
- Avoid `staff`; Adam prefers brighter terms for the client's people.
- Mention that RightOnQ provides a prepared CSV template.

Layout margins were widened so the Q1/Q2/Q3 copy breathes better and does not feel too tight.

Relevant file:

- `index.html`

### 7. Audience Use Case Cards

The four audience cards were refined:

- Automotive specialists.
- Food and drink brands.
- Specialist suppliers.
- Property and real estate teams.

Copy/tone changes:

- Property: add one-tap option to request a viewing/phone call.
- Specialist suppliers: avoid appointment-led positioning; focus on fresh products, launches, interest lists and brand presence.
- Food and drink: think wholesalers, cash and carries, hotel chains, product launches and events; `one tap to show interest`.
- Automotive/property: include international buyer/region language so premium time-zone scheduling makes sense without shouting about price.
- Food and drink: `national product launches`.

Adam liked the visual logo improvements but decided not to keep fiddling with them.

### 8. Business Toolkit Section

Eyebrow changed away from:

```text
RightOnQ Business Toolkit
```

Adam preferred:

```text
What the service includes
```

Heading changed to:

```text
What RCS with RightOnQ brings together.
```

Also changed:

```text
SMS fallback for essential reach
```

to:

```text
Automatic SMS fallback
```

### 9. RCS Registration Section

Adam wanted this more blunt and less abstract.

Key idea:

```text
No RCS registration, no verified sender profile.
```

Positioning:

- RCS registration is the trust step.
- It exists to keep out low-trust/spammy messaging.
- Buyers are buying into the pain because registration creates the trust advantage.

Use careful public wording. Adam may speak bluntly privately, but public copy should be direct without sounding unprofessional.

### 10. Link And SEO Audit

A link/SEO pass was completed during this session.

Core outcomes:

- Internal clean URLs are used:
  - `/`
  - `/blog/`
  - `/privacy/`
  - `/terms/`
  - `/what-is-rcs/`
- `sitemap.xml` was updated.
- Page metadata/descriptions were improved.
- The old/rightonq.net competitor-style issue was noted by Adam and was not treated as a fault.
- Contact/action links were checked.

Important: keep Google-friendly clean slash URLs. Do not revert to `.html` links for live pages just because `file://` preview is awkward.

### 11. What Is RCS Page

`what-is-rcs.html` became a proper plain-English article/page.

Major content direction:

- Explain that RCS stands for `Rich Communication Services`.
- SMS stands for `Short Message Service`.
- Explain RCS as the modern upgrade to SMS.
- Use `same screen` rather than `same messaging app`.
- Avoid patronising phrases like `Think of it...`.
- Be factual and plain.
- Explain why SMS still matters: cost-effective, simple, reaches virtually every device.
- Explain why RCS exists: richer presentation, verified identity, images, buttons and better response paths.
- Mention real caveats without making them sound like the main story.

Final-style opening direction:

RCS is the modern upgrade to SMS, received on the same message screen, with business name, logo, images, buttons and verified sender identity.

### 12. RCS Guide Example Carousels

The RCS guide now has two side-by-side examples on desktop and stacked examples on mobile.

Left:

```text
Luxury Motor outreach example
```

Right:

```text
Brewery trade outreach example
```

Section eyebrow:

```text
RCS carousel examples
```

Adam requested the example titles in yellow/gold to match the example styling.

### 13. Hometown Brewery Example

Adam supplied three images, now stored in repo:

- `images/hometown-brewery-open-harvest.png`
- `images/hometown-brewery-open-harvest-event.png`
- `images/hometown-brewery-james-mitchell.png`

The Hometown Brewery carousel represents a brewery/trade/B2B example:

- Open Harvest bottle/sample case.
- Launch event in June 2026.
- New sales representative James Mitchell.

Button wording:

- First brewery card: sample/visit style response, not generic interest.
- Launch event card:
  - `RSVP`
  - `Undecided`
  - `Far too busy`
- James Mitchell card:
  - `Arrange a meet-up`
  - `Wish James all the best`

Adam rejected `Send a reminder` as creating another headache.

### 14. RCS Guide Footer/Header

The RCS guide header/footer were aligned with the rest of the site:

- Logo.
- Blog link.
- Get in touch.
- Footer legal links.
- Bottom `Return to homepage` button sits above a clean line, not on the line.

Footer `TM` styling was corrected to smaller muted grey. Keep it subtle across pages.

### 15. Mobile Layout Pass

A mobile pass was completed after Adam checked the live site on an iPhone 15.

Issues addressed:

- Header/nav stacking/spacing across pages.
- Homepage top gap above eyebrow.
- Over-large headings on mobile.
- Homepage dashboard/receiver examples boxed individually on mobile.
- Dashboard and receiver phone side-by-side on wider screens, stacked on narrow screens.
- Carousel arrows made visible and more finger-friendly.
- Blog/legal/RCS headings scaled down.
- Secondary page top spacing adjusted after one pass became too tight.

Adam is highly sensitive to mobile "boxed" sections looking clean. He liked:

- Example campaign boxes.
- What is RCS box.
- Branded RCS verified message box.
- Audience square cards.

He disliked loose content that feels like it is floating without structure on mobile.

## Adam's Taste / Copy Preferences

Adam's preferred style:

- Plain English.
- Direct.
- Human.
- Commercially sensible.
- Not abstract.
- Not patronising.
- Not over-explained.
- No obvious marketing fluff.

Words/phrases to be careful with:

- Avoid `simple` when it could imply the service is underprepared.
- Avoid `staff`; use brighter terms like `team`, `people`, `colleagues`, `client list`, or context-specific wording.
- Avoid `short call`; Adam disliked it.
- Avoid `local day`; use `time zone`.
- Avoid `quality` if the meaning is actually rich/high-resolution presentation. SMS can have quality writing, so be precise.
- Avoid too many "context" claims unless saying `presentation`, `rich cards`, `images`, `buttons`, or `verified sender identity`.
- Avoid patronising explainers such as `Think of it...`.

Adam likes:

- `premium` for the international plan.
- Direct labels.
- One-tap reply language.
- Slightly warm/humorous options when appropriate, e.g. `Not my cup of tea`, `Far too busy`.
- Blunt internal logic translated into professional public copy.

## Technical / Layout Preferences

For mobile:

- Avoid huge hero/title type.
- Keep first content clear of the fixed header.
- Avoid giant gaps.
- Keep cards/buttons fully visible.
- Prefer clean boxed panels for complex examples.
- Ensure desktop examples can sit side-by-side, but stack on mobile.

For carousel controls:

- Dots alone are too subtle.
- Use visible previous/next arrow buttons like the RCS guide examples.
- Buttons need obvious touch targets.

For headings:

- The homepage hero title scale became the reference point.
- Other major page titles should not exceed that visual weight.

## Pages Current State

### Homepage: `index.html`

Current important elements:

- Hero: `For brands with an audience worth reaching.`
- Eyebrow: `Branded RCS messaging for UK businesses`
- International sender dashboard.
- Receiver phone Apex Motors carousel with arrows/dots.
- Pricing section.
- Relationship channel section.
- RCS-ready Q1/Q2/Q3 section.
- Audience cards.
- Service includes section.
- Registration/trust section.
- Contact form.
- FAQ.

Do not casually undo the mobile hero spacing or carousel sizing. These were iterated from screenshots.

### RCS Guide: `what-is-rcs.html`

Current role:

- Plain-English educational page for someone who does not know what RCS means.
- Includes carousels and source links.
- Header/footer aligned to site.

Potential future work:

- Another final read for tone.
- Maybe add diagrams later if Adam asks, but current page is image-led rather than diagram-heavy.

### Blog: `blog/index.html`

Current issue handled:

- Blog title size reduced.
- Mobile spacing improved through `_layouts/default.html`.

### Legal Pages: `terms.html`, `privacy.html`

Current issue handled:

- Big page titles reduced.
- Mobile spacing improved.
- Footer `TM` styling corrected.

Legal caveat:

Do not make major legal wording changes without showing Adam first. If high-stakes legal accuracy matters, use primary sources/current checks.

## External / Reference Links

RCS guide source links include:

- Twilio RCS messages.
- Google RCS/business messaging/card references.
- Apple RCS on iPhone support.
- GSMA/OpenMarket/RCS business messaging research-style source.

During the session, Adam asked whether these were live/relevant. They were checked as part of the link pass and considered suitable at that point.

If Web-4 changes source links, use current primary/official sources and check for 404s.

## Common Commands

Check worktree:

```bash
git status --short --branch
```

Show recent commits:

```bash
git log --oneline --decorate -12
```

Build:

```bash
JEKYLL_ENV=production /opt/homebrew/opt/ruby@3.3/bin/bundle exec jekyll build
```

Serve built site:

```bash
cd /Users/macpro/rightonq-code.github.io/_site
/Users/macpro/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 8081
```

Commit/push:

```bash
git add <files>
git commit -m "<message>"
git push origin main
```

## Recommended First Steps For Web-4

1. Read this file and `WEB2_HANDOVER_2026-05-04.md`.
2. Run:

```bash
git status --short --branch
```

3. Confirm you are on `main`.
4. Confirm latest commit is at least:

```text
6975a5f Refine homepage RCS carousel fit
```

5. If doing visual work, rebuild and serve locally.
6. Use cache-buster query strings when giving Adam preview links, e.g.

```text
http://127.0.0.1:8081/?web4-check=1
```

7. Work one task at a time.
8. Show wording before patching copy.
9. Push after agreed chunks.

## Final Note To Web-4

Adam is collaborative, quick to spot what feels wrong, and very good at judging the site from a real phone. Treat his screenshots as high-value QA. The best workflow is not to argue with the screenshot, but to use it to find the CSS/content cause.

The site is now in a good, live, pushed state. Preserve the progress, keep changes small, and keep Adam in the approval loop.
