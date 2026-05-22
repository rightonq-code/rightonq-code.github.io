# RCS Twilio Console asset clarification

Status: dated operator note. This is not a provider submission, not a Twilio
API action, not a Console save, and not permission to move any lifecycle gate.

Date observed: 2026-05-22
Twilio ticket: `#26791676`

## What Was Observed

The logged-in Twilio Console RCS Sender flow was inspected in the existing
Chrome session for the test account. The visible RCS Senders page confirmed
that RCS Sender creation is a manual provider workflow and that testing can be
done with the operator's own mobile devices before carrier approval.

The RCS Sender public details screen showed the expected manual profile fields:

- sender display name;
- description;
- use case;
- logo URL;
- banner URL;
- accent colour;
- phone and email contact details;
- privacy policy URL;
- terms of service URL.

The Console helper text observed during this inspection indicated a `1440 x
448` banner/hero image requirement. The Twilio Help Center AI answer in the
same logged-in support surface also stated `1440 x 448` and suggested `1140 x
448` may be outdated.

That conflicts with the earlier Isa Bell / Twilio Digital Sales guidance already
recorded in this repo: keep a reusable `1440 x 448` Google/RBM master asset, but
export a `1140 x 448` derivative for the actual Twilio sender-profile
submission.

## Current RightOnQ Operating Stance

Until Twilio replies on ticket `#26791676`, keep both asset paths alive:

- retain a `1440 x 448` master banner for Google/RBM reuse and visual QA;
- retain a `1140 x 448` Twilio submission export path because the current
  proof-pack tools and readback passed with the Twilio profile;
- visually preview the logo and banner in Twilio before client/provider use;
- treat logo safe-area and crop behaviour as a visual QA requirement, not just
  a pixel-size requirement.

Do not rewrite the final submission tooling solely because the Console helper
text currently says `1440 x 448`. Wait for Twilio's ticket reply or a deliberate
RightOnQ decision after visual retesting.

## Ticket Comment Posted

RightOnQ posted a clarification request to Twilio ticket `#26791676` asking them
to confirm:

- RCS Sender logo dimensions, max file size, and recommended internal
  padding/safe area;
- RCS Sender banner/hero dimensions for actual Twilio Console submission;
- whether `1140 x 448` is outdated, still accepted, or relevant only to a
  specific preview/submission surface;
- whether agencies should maintain both a `1440 x 448` master and a
  Twilio-specific export.

## Boundaries

This note does not change:

- `Provider submission status`;
- `Go-live status`;
- `Usage pull status`;
- Trust Hub / A-ID work;
- callback configuration;
- sender-pool or phone-number movement;
- message sending;
- the GitHub Pages/domain lane.

Provider submission remains a separate explicit approval gate.
