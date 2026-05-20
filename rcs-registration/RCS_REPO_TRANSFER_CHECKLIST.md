# RCS repo transfer checklist

Date: 2026-05-20

Status: transfer guardrail. This is not a repo move, not a remote change, not a Pages/domain change, and not permission to touch live provider settings.

## Purpose

This checklist captures the RCS onboarding items that SECURITY-2 / BUGS should account for if `rightonq-code/rightonq-code.github.io` is moved from the personal GitHub account to `continuity-ai-ltd`.

The RCS onboarding lane is safe to pause for transfer when this document is current, `rcs-registration/` is clean, and the website/Pages/domain move has its own approval plan.

## Current Local State Before Transfer

- Repo: `/Users/macpro/rightonq-code.github.io`
- RCS folder: `/Users/macpro/rightonq-code.github.io/rcs-registration`
- Branch: `rcs-registration-part-a-b-20260507`
- Remote before transfer: `https://github.com/rightonq-code/rightonq-code.github.io.git`
- Open PR before transfer: `rightonq-code/rightonq-code.github.io#1`, draft, head `rcs-registration-part-a-b-20260507`, base `main`
- RCS folder state at time of writing: clean before this checklist was added

Root website/legal files were dirty at the time of writing and are outside the RCS folder:

- `index.html`
- `privacy.html`
- `terms.html`
- `RightOnQ Website Future Amendments.md`

Do not mix those website files into an RCS transfer fix unless BUGS explicitly approves it.

## Hard Transfer Boundaries

1. Do not push, pull, rename, transfer, or change remotes from the RCS lane without BUGS approval.
2. Do not touch GitHub Pages source, custom-domain settings, DNS, or `CNAME` as part of RCS build work.
3. Do not edit Apps Script deployments or Cloud Run services until the repo transfer has completed and SECURITY-2 confirms the new GitHub owner/repo shape.
4. Do not change provider submission, go-live, usage pull, Twilio callback, Revolut webhook, or proof asset settings merely because the repo moved.
5. Treat `rightonq-code.github.io` references as migration targets, not automatic search-and-replace targets.

## URLs And External Hooks To Recheck

### GitHub Pages / public website

- `CNAME` currently points the repo to `www.rightonq.co.uk`.
- The intended RCS hosted path is `/rcs-registration/`.
- The old GitHub Pages host shape appears in docs/tools as `https://rightonq-code.github.io/rcs-registration/`.

After transfer, confirm whether the public RCS form should use:

- `https://www.rightonq.co.uk/rcs-registration/`;
- the new organisation GitHub Pages host; or
- another approved URL.

### Apps Script

`google-apps-script/Code.gs` currently contains:

- `PUBLIC_FORM_URL = "https://rightonq-code.github.io/rcs-registration/index.html"`

`google-apps-script/.clasp.json` currently points at:

- Apps Script ID `1RUuIglGVcVpNSveeXlzw6O0wJ_A5QTtGCHwRMrJoUSSiyZ0TD_DD9ad8`
- Google Cloud project `rightonq-gog`
- deployment ID `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9`

After transfer, check whether `PUBLIC_FORM_URL` should be changed. Do not redeploy Apps Script until the final public form URL is confirmed.

### Revolut sandbox return URL

`tools/revolut-sandbox-proof.mjs` currently uses:

- `https://rightonq-code.github.io/rcs-registration/payment-return.html`

After transfer, confirm the return URL before creating any new sandbox proof orders. Existing sandbox proof records should remain historical evidence and should not be rewritten.

### Cloud Run source links

The RCS docs record Cloud Run source deployment from:

- repo `rightonq-code/rightonq-code.github.io`
- branch `rcs-registration-part-a-b-20260507`
- build context `/rcs-registration`

Affected services to check after transfer:

- `roq-rcs-proof-assets`
- `roq-rcs-revolut-webhook`
- `roq-rcs-twilio-callback`

Do not redeploy solely to test the transfer. First confirm whether Cloud Build or Cloud Run repository connections still point at the old repo owner.

### Google Cloud / storage

Known project:

- `rightonq-gog`

Known public proof asset base URL:

- `https://roq-rcs-proof-assets-872475523113.europe-west2.run.app`

The proof asset service and private storage route should continue independently of GitHub ownership unless a redeploy or source connection refresh is required.

### Twilio / RBM / Google provider lane

Current transfer-safe posture:

- Twilio proof subaccount is tracked.
- Twilio proof Messaging Service is tracked.
- Sender pool is intentionally empty.
- RCS sender submission is not started.
- Provider submission status should remain `not_started` until the proof pack is approved.
- Go-live status should remain `not_started`.
- Usage pull status should remain `not_started`.
- Twilio callback receiver is proof/staging only and should not become the product event store.

Do not use the repo move as a reason to change any provider state.

## Pre-Transfer Checks

Run from `/Users/macpro/rightonq-code.github.io`:

```sh
git status --short --branch
git log --oneline @{u}..HEAD
git status --porcelain rcs-registration
git remote -v
gh pr list --repo rightonq-code/rightonq-code.github.io --state open
rg -n "rightonq-code\\.github\\.io|rightonq-code/rightonq-code\\.github\\.io|PUBLIC_FORM_URL|redirect_url" rcs-registration
```

Expected before transfer:

- no unpushed RCS commits unless deliberately created for this checklist;
- no dirty files inside `rcs-registration/` except any approved transfer checklist commit;
- PR #1 still visible or explicitly accounted for;
- root website dirty files consciously parked or resolved by the website owner.

## Post-Transfer Checks

After SECURITY-2 / BUGS completes the transfer, run the equivalent checks using the new owner/repo name:

```sh
git remote -v
git status --short --branch
gh pr list --repo continuity-ai-ltd/rightonq-code.github.io --state open
rg -n "rightonq-code\\.github\\.io|rightonq-code/rightonq-code\\.github\\.io|PUBLIC_FORM_URL|redirect_url" rcs-registration
```

Then verify, without changing provider state:

1. GitHub Pages still serves the intended website and RCS paths.
2. `www.rightonq.co.uk` still resolves to the intended Pages site.
3. The RCS form URL used by Apps Script is still correct or queued for a controlled Apps Script update.
4. The Revolut sandbox return URL is still correct or queued for a controlled tool update.
5. Cloud Run source repository links are either still valid or queued for a controlled reconnect.
6. The open draft PR state is preserved or intentionally recreated.

## Transfer Stop Conditions

Pause and ask SECURITY-2 / BUGS before proceeding if:

- GitHub Pages no longer serves `www.rightonq.co.uk`;
- the custom domain is removed from the repo;
- PR #1 disappears without an agreed replacement;
- Cloud Run source connection still points to the old owner and a redeploy is needed;
- Apps Script would need redeployment to keep the form URL correct;
- Revolut return URLs would change before payment/order proof work continues;
- any live provider setting would need to move from `not_started`;
- any dirty root website files would be bundled into RCS migration work.

## Safe Resume Point

Once transfer checks pass, the RCS onboarding lane can resume at:

1. proof pack / video hardening;
2. final public asset URL readback with approved client assets;
3. provider submission preflight checklist;
4. explicit provider submission approval gate.

Do not resume with callback persistence, phone-number movement, provider submission, or message sending unless separately approved.
