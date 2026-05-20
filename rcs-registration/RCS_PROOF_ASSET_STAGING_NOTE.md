# RCS Proof Asset Staging Note

Last updated: 2026-05-20

This note records the current local proof-asset staging position for the public
Part A proof application:

```text
ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747
```

It is an onboarding/proof-pack note only. It does not approve provider
submission, does not upload assets, and does not change Google Sheets, Twilio,
Google Cloud, Revolut, callbacks, sender pools, phone numbers, or message
sending.

## Current Candidate Folder

Local-only candidate staging folder:

```text
/private/tmp/roq-rcs-proof-assets-candidate-ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747
```

The folder was prepared from the existing storyboard assets so the manifest
planner can separate usable proof-pack material from missing approval evidence.

Current local candidate files:

```text
rightonq-proof-logo.png            224x224, under 50 KB
rightonq-proof-banner-master.jpg   1440x448, under 200 KB
rightonq-proof-banner.jpg          1140x448, under 200 KB
```

The 1140x448 Twilio sender-profile banner export was derived from the 1440x448
master by a local center crop. It still needs human visual approval before any
upload or use in a provider submission pack.

## Current Blockers

The manifest planner currently reports two blockers:

```text
missing_local_asset: rightonq-proof-opt-in.*
missing_local_asset: rightonq-proof-review-video.*
```

These are the correct remaining blockers. The proof pack should not be uploaded
or marked ready until both are present and approved:

- `rightonq-proof-opt-in.png` / `.jpg` / `.jpeg` - public opt-in proof image.
- `rightonq-proof-review-video.webm` / `.mp4` / `.mov` - public review/use-case
  video showing sender identity, opt-in context, message journey, HELP/support,
  and STOP/opt-out.

## Verification Command

Run this local-only check before any upload slice:

```bash
node rcs-registration/tools/proof-asset-manifest-plan.mjs \
  --application-id ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747 \
  --asset-dir /private/tmp/roq-rcs-proof-assets-candidate-ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747
```

Expected current result:

```text
readyForUpload: false
blockers: 2
```

The expected blockers are the missing opt-in proof image and missing review
video. If any logo/banner dimension or file-size blocker appears, stop and fix
the local assets before considering upload.

## Do Not Bundle

Do not bundle this staging step with:

- proof asset upload;
- Apps Script / Sheet tracking updates;
- RCS sender submission;
- Trust Hub or A-ID evidence collection;
- callback configuration;
- sender pool or phone-number movement;
- message sending;
- `Provider submission status`, `Go-live status`, or `Usage pull status`
  changes.

Those remain separate approval gates.
