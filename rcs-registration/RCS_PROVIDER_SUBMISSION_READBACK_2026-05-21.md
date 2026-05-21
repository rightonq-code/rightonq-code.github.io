# RCS Provider Submission Readback - 2026-05-21

Status: final-pack readiness readback only. This is not a provider submission,
not a Twilio/RBM/Google submission, not a Trust Hub submission, not callback
configuration, not sender-pool or phone-number movement, not message sending,
not go-live, and not usage pull.

## Application

- Application ID: `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`
- Snapshot source: `/tmp/roq-rcs-current-operator-snapshot.json`
- Snapshot generated at: `2026-05-21T13:37:34.430Z`

## Current Gate State

- Registration status: `video_approved`
- Part A status: `part_a_accepted`
- Internal review status: `accepted`
- Part B status: `video_approved`
- Review video status: `client_approved`
- Registration pack status: `final_pack_review_ready`
- Provider submission status: `not_started`
- Go-live status: `not_started`
- Usage pull status: `not_started`

## Proof Pack URLs

- RBM logo URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-logo.png`
- RBM banner URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-banner.jpg`
- Opt-in proof URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-opt-in.png`
- Review video URL: `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app/rcs-proof/ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747/rightonq-proof-review-video.webm`

## Verification Completed

Final-pack preflight was run against the current snapshot with public asset URL
fetching enabled and Twilio banner profile selected.

Result:

```text
ok: true
finalPackReady: true
blockers: 0
warnings: 0
asset URL check: passed
```

Asset readback:

- Logo: PNG, `224 x 224`, `21555` bytes
- Banner: JPEG, `1140 x 448`, `12269` bytes
- Opt-in proof: PNG, `1280 x 720`, `528293` bytes
- Review video: WebM, `3101185` bytes

Apps Script deployment readback:

- Operator API executable: `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9` at version `46`
- Public customer web app: `AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6` at version `45`

## What This Allows

The onboarding proof pack is mechanically ready for a separate RightOnQ provider
submission approval decision.

If approved, the next action should be explicit and scoped, for example:

```text
Final pack approved for provider submission.
Provider submission action approved by: <name>
Approved at: <timestamp>
Scope: RCS Sender submission only
Not bundled: Trust Hub submission, callback config, sender-pool movement,
phone-number movement, message send, go-live, usage pull
```

## What This Does Not Allow

Do not update or perform any of the following from this readback alone:

- `Provider submission status` beyond `not_started`
- `Go-live status`
- `Usage pull status`
- Trust Hub or A-ID evidence collection/submission
- callback configuration
- sender-pool movement
- phone-number movement
- message sending
- product activation handover

Those remain separate explicit gates.
