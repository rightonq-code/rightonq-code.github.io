# RCS provider submission preflight checklist

Date: 2026-05-20

Status: operator guardrail. This is not a provider submission, not an Apps Script deployment, not a Twilio API action, and not permission to move `Provider submission status` out of `not_started`.

## Purpose

This checklist defines the minimum evidence RightOnQ must have before any RCS Sender / provider submission step is started.

It exists to stop three mistakes:

1. treating a proof subaccount or Messaging Service as submission readiness;
2. treating a generated draft video as an approved public review video;
3. moving `Provider submission status` before the final pack is deliberately approved.

## Hard Rule

Keep these fields at `not_started` until this checklist has passed and Adam/RightOnQ explicitly approves the provider-submission action:

```text
Provider submission status
Go-live status
Usage pull status
```

No one should move these because a tool example, proof asset, subaccount, Messaging Service, callback receiver, or draft video exists.

The generic Twilio setup tracking helper enforces this boundary: `tools/operator-twilio-setup.mjs` refuses to move any of these three fields beyond `not_started` unless the operator supplies `--confirm-provider-state-change` after the checklist has passed and the provider-submission action has been explicitly approved.

## Preflight 1: Business And Legal Review

Required:

- legal business name checked against the Companies House registered business;
- Companies House number / registration identifier checked;
- trading name / sender name checked for brand fit;
- business website live and matches the brand;
- privacy policy URL live and relevant;
- terms URL live and relevant;
- customer-facing support email/phone checked;
- public links and domain checks passed.

Must not proceed if:

- RightOnQ is accidentally used as the end-client legal business name;
- website/domain does not match the applying business;
- privacy/terms pages are missing or irrelevant.

## Preflight 2: Message Use Case Review

Required:

- use case is specific and matches the client business;
- message trigger is clear;
- example message 1 reviewed;
- example message 2 reviewed;
- HELP sample reviewed;
- STOP sample reviewed;
- opt-in description reviewed;
- opt-out description reviewed;
- message wording does not imply unsupported live product capability.

Must not proceed if:

- message examples are generic or misleading;
- opt-out route is weak or absent;
- use case looks like marketing copy rather than an actual messaging flow.

## Preflight 3: Approved Public Proof Assets

Required:

- final approved logo URL stored and publicly readable;
- final approved banner URL stored and publicly readable;
- opt-in proof URL or URLs stored and publicly readable;
- final approved review/proof video URL stored and publicly readable;
- placeholder URLs replaced;
- draft video files replaced by approved review video;
- exact asset dimensions/derivatives recorded where Twilio/Google differ.

Banner asset standard:

- Keep a reusable 1440 x 448 Google/RBM master asset internally.
- Export a 1140 x 448 derivative for the actual Twilio sender-profile submission.
- Host the approved Twilio submission derivative and store that exact asset URL in `RBM banner URL`.
- If both derivatives are retained in the client pack, label them clearly so the Twilio submission file is not confused with the master.

Provider clarification:

- Isa Bell / Twilio Digital Sales confirmed this operational split on 2026-05-20.
- The same reply confirmed that current public docs require the review video to be publicly hosted and show the use case plus opt-out capability, but do not publish a strict file type, max duration, or live/test-sender capture requirement.
- Isa Bell / Twilio Digital Sales clarified on 2026-05-21 that the opt-in policy image URL can be a public screenshot of the opt-in page, the opt-in webpage itself, or a document explaining the opt-in flow. Public docs do not publish required dimensions, file type, max size, or number-of-images limits for this specific opt-in-policy asset.
- Standardise opt-in descriptions, opt-out descriptions, opt-in policy image URL, and review video URL together; do not treat the video as the whole compliance proof.

Must not proceed if:

- URLs require login;
- proof files are placeholders;
- video is only a local/generated draft;
- approved video has not been reviewed by RightOnQ and the client.

## Preflight 4: Part B Client Approval

Use `RCS_PROOF_VIDEO_WORKFLOW.md` as the video-specific preparation, hosting, review, and approval workflow.

Required:

- sender name/logo phone preview approval recorded;
- video approval recorded;
- video change requests resolved;
- final approved video URL ready for provider pack;
- final RightOnQ submission approval still separate from client video approval.

Must not proceed if:

- video is approved but final pack review has not happened;
- client requested changes that remain unresolved;
- name/logo approval is missing.

## Preflight 5: Trust Hub / Compliance Readiness

Required:

- parent primary business compliance profile readiness confirmed where required;
- end-client Secondary Compliance Profile strategy confirmed;
- business identity/value confirmed;
- business type, industry, CRN, website, address checked;
- operating regions confirmed separately from RCS launch countries;
- branded RCS authorised representative checked against the one-representative public RCS field set: first name, last name, email, business title, and business website URL;
- any additional representative records collected only if the separate Secondary Compliance Profile / Trust Hub lane actually requires them;
- A-ID route decided if Twilio requests extra evidence;
- Twilio-managed evidence route preferred for any ID/address exception where supported;
- Compliance Embeddable account/program support confirmed before any embedded evidence flow is offered to a customer.

Must not proceed if:

- raw passport, driving licence, government ID, proof-of-address, or identity documents are in the static form, Google Sheet, GitHub, chat, or normal notes;
- A-ID evidence is required but no secure Twilio-managed or approved secure-admin route exists;
- RCS sender onboarding is being treated as Compliance Embeddable-supported without explicit Twilio account/use-case confirmation;
- Compliance Embeddable is being treated as a universal Secondary Compliance Profile exception route without explicit Twilio account/use-case confirmation;
- Trust Hub / Secondary Compliance requirement is unresolved for the planned submission.

## Preflight 6: Messaging Service And Fallback Readiness

Required:

- customer Twilio subaccount linked;
- Twilio Messaging Service linked;
- sender pool intentionally unchanged until approved action;
- RCS Sender ID / RBM agent ID present only if actually created/approved;
- fallback / UK RC Bundle plan confirmed if SMS fallback is in scope;
- phone-number or sender-pool movement kept behind a separate explicit gate.

Must not proceed if:

- the proof Messaging Service sender pool is empty but treated as live-ready;
- phone-number movement is bundled into provider submission;
- fallback route is assumed without RC Bundle/fallback readiness.

## Preflight 7: Callback Ownership

Required:

- product/onboarding callback ownership decision recorded;
- onboarding Twilio callback receiver remains proof/staging unless product explicitly chooses otherwise;
- production callback target strategy confirmed before live traffic;
- product callback/event model remains the source of live delivery truth.

Must not proceed if:

- proof callback receiver is treated as production event store;
- callback configuration is bundled with provider submission;
- live product event truth would be split between onboarding and `rightonq-system`.

## Preflight 8: Billing, Pause, And Usage Controls

Required:

- registration fee/payment evidence checked;
- monthly billing activation status decided;
- manual pause flag checked;
- usage/top-up status remains not started unless live usage is explicitly approved;
- billing/top-up/pause controls ready before any chargeable traffic.

Must not proceed if:

- billing is still blocked or uncertain;
- manual pause is active;
- usage pull or live traffic is bundled into submission.

## Final Operator Decision

Before the final decision, run the combined final-pack checker if an operator snapshot has been saved:

```sh
node rcs-registration/tools/final-pack-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --strict
```

If the combined checker cannot fetch public URLs in the current environment, run
the local-only gate first:

```sh
node rcs-registration/tools/final-pack-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --skip-asset-url-check
```

The component checks remain available for diagnosis:

```sh
node rcs-registration/tools/proof-pack-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --strict
```

Run the proof-video checker against the same saved snapshot:

```sh
node rcs-registration/tools/proof-video-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json \
  --strict
```

Then run the public proof asset URL checker against the same saved snapshot:

```sh
node rcs-registration/tools/proof-asset-url-preflight.mjs \
  --snapshot-file /private/tmp/roq-rcs-current-operator-snapshot.json
```

Only after all applicable sections pass may RightOnQ prepare the provider-submission action.

The checker treats `name_logo_approved` as incomplete. Provider submission requires recorded review-video approval (`video_approved` or later), because name/logo approval only unlocks video preparation.

The checker also treats these final-pack gaps as blockers, not soft warnings:
placeholder proof URLs, unclear review-video status, unreviewed registration-pack
status, missing or unaccepted Part A, missing or pending internal review, and
missing core business fields in the operator snapshot.

The Apps Script source also guards this order: public name/logo approval is only open after Part A acceptance, and public video approval is only open after name/logo approval. Check deployment status before assuming those source guards are live.

The next action should be explicit, for example:

```text
Final pack approved for provider submission.
Provider submission action approved by: <name>
Approved at: <timestamp>
Scope: RCS Sender submission only
Not bundled: Trust Hub submission, callback config, sender-pool movement, phone-number movement, message send, go-live, usage pull
```

## What May Be Updated After Approval

After explicit submission approval, an operator may update submission tracking fields according to the actual action taken:

```text
Provider submission status
Provider submission reference
Provider submitted at
Provider last checked at
Provider notes
Registration pack status
```

Do not update `Go-live status`, `Usage pull status`, sender-pool state, phone-number state, callback configuration, or product activation unless those separate gates are explicitly approved.

## Relationship To Other Docs

Read with:

- `RCS_REGISTRATION_PACK_READINESS_MAP.md`
- `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md`
- `RCS_ONBOARDING_ACTIVATION_HANDOVER_CONTRACT.md`
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
