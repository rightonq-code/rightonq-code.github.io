# RCS next slice checklist

> **SUPERSEDED (2026-05-28).** Replaced by the recovery re-anchor and post-merge sections of `RCS_TWILIO_4_HANDOVER_2026-05-12.md`. Kept for history — do not use as the current next-slice plan.

Status: planning checkpoint only. This is not a provider submission, not a
Twilio Console save, not an Apps Script deployment, not a Google Sheet write,
and not permission to move any lifecycle gate.

Date: 2026-05-23
Lane: `[RCS-Twilio-4]`
Repo: `rightonq-code/rightonq-code.github.io`

## Current Position

The RCS/Twilio registration lane is coherent and safe as merged.

What is proved:

- Part A intake and Apps Script / Sheet tracking scaffold;
- internal review and Part A acceptance gate;
- public Part B name/logo and review-video approval order;
- hosted proof-asset route through Cloud Run and private GCS;
- proof-pack readback and final-pack preflight on the test fixture;
- manual provider-submission action pack;
- lifecycle gates for provider submission, go-live, and usage pull;
- Twilio Console asset-size uncertainty captured on ticket `#26791676`.

What is not proved for real customers yet:

- real client assets and review video approved by a client;
- confirmed final banner submission size after Twilio replies on ticket
  `#26791676`;
- real RCS Sender provider submission;
- Trust Hub / Secondary Compliance Profile submission;
- A-ID evidence collection path;
- callback configuration for production traffic;
- sender-pool or phone-number movement;
- live message sending;
- product activation handover into `rightonq-system`.

## Hard Holds

Keep these fields at `not_started` until a separate explicit approval says
otherwise:

- `Provider submission status`;
- `Go-live status`;
- `Usage pull status`.

Do not bundle the next slice with:

- Trust Hub or A-ID submission;
- callback configuration;
- sender-pool movement;
- phone-number movement;
- message sending;
- go-live;
- usage pull;
- product activation.

## Ticket Dependency

Twilio ticket `#26791676` is open for the logo/banner asset-size clarification.

Current interim stance:

- keep the `1440 x 448` Google/RBM master banner path alive;
- keep the `1140 x 448` Twilio submission export path alive;
- visually preview the logo and banner in Twilio before client/provider use;
- chase Twilio if no reply by 2026-05-29.

Do not rewrite the final asset tooling solely from the current Console helper
text while the ticket remains unresolved.

## Next Build Slice

The next practical slice is the real hosted proof-pack and proof-video workflow.

Target outcome:

- one approved logo asset;
- one approved banner master and provider-specific export where needed;
- one approved opt-in proof artifact;
- one approved review/proof video;
- all approved files hosted through the proof-assets route;
- fresh operator snapshot saved to `/private/tmp/roq-rcs-current-operator-snapshot.json`;
- final-pack preflight passing against the hosted URLs;
- provider/go-live/usage gates still held.

## Safe Restart Checks

Before doing any work:

```sh
git -C /Users/macpro/rightonq-main-live status --short --branch
git -C /Users/macpro/rightonq-code.github.io status --short --branch
```

Expected:

- `/Users/macpro/rightonq-main-live` should be clean on `main` or on a named
  RCS branch;
- `/Users/macpro/rightonq-code.github.io` may still show the parked root
  website files and must not be cleaned blindly.

Then read:

```text
rcs-registration/RCS_PROVIDER_SUBMISSION_PREFLIGHT_CHECKLIST.md
rcs-registration/RCS_PROOF_VIDEO_WORKFLOW.md
rcs-registration/RCS_TWILIO_CONSOLE_ASSET_CLARIFICATION_2026-05-22.md
rcs-registration/RCS_PROVIDER_SUBMISSION_READBACK_2026-05-21.md
rcs-registration/RCS_PROVIDER_SUBMISSION_ACTION_PACK_2026-05-21.md
```

## Preflight Commands For The Slice

After a fresh operator snapshot exists:

```sh
node rcs-registration/tools/final-pack-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --strict
```

Component checks:

```sh
node rcs-registration/tools/proof-pack-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --strict

node rcs-registration/tools/proof-video-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --strict

node rcs-registration/tools/proof-asset-url-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json
```

These are checks only. A passing preflight does not submit to Twilio/RBM/Google.

## Exit Criteria

The slice is complete when:

- approved hosted proof assets are present and publicly reachable;
- final-pack preflight passes without blockers;
- ticket `#26791676` is either answered or the asset-size choice is explicitly
  accepted by RightOnQ with the uncertainty recorded;
- no forbidden gate moved as part of the slice.

Only after that should RightOnQ decide whether to perform the manual provider
workflow described in `RCS_PROVIDER_SUBMISSION_ACTION_PACK_2026-05-21.md`.
