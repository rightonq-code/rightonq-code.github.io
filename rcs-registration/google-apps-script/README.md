# RightOnQ RCS Part A Intake - Google Apps Script

This folder contains the Google Apps Script receiver for the static RCS registration form.

## Intake Sheet

Sheet:

https://docs.google.com/spreadsheets/d/1_C85rMaDWS0-VnXbtYQzRBS1trgN8kFf4hAnHfT3R-0/edit

Tab:

`Part A submissions`

## Deploy Steps

1. Open the Google Sheet above.
2. Go to `Extensions` > `Apps Script`.
3. Paste the contents of `Code.gs` into the Apps Script editor.
4. Save the script.
5. Click `Deploy` > `New deployment`.
6. Select type `Web app`.
7. Set `Execute as` to yourself / the RightOnQ Google account.
8. Set `Who has access` to `Anyone`.
9. Deploy and authorise the requested permissions.
10. Copy the Web app URL.
11. Paste that URL into `rcs-registration/index.html`:

```js
const partASubmissionEndpoint = "PASTE_WEB_APP_URL_HERE";
```

## Current Deployment

Apps Script project:

https://script.google.com/d/1RUuIglGVcVpNSveeXlzw6O0wJ_A5QTtGCHwRMrJoUSSiyZ0TD_DD9ad8/edit

Live web app URL:

https://script.google.com/macros/s/AKfycbyI81Ir2xvHLar0R0iFBBWyXa1Nj93T4_8Ni5_eX3XEYDA-AKQbVYbPHnTROLm8e4a6/exec

Deployment:

- Execute as: `adam@rightonq.co.uk`
- Access: `Anyone`
- Current public web app version: `31`
- Version `4` added Application ID, registration status, and Part A status columns to the intake row.
- Version `5` adds Application ID status lookup via `GET ?applicationId=...`.
- Version `6` adds the `Applications` control-row tab and writes/reads one row per Application ID.
- Version `7` adds private application token support and a guarded internal application-draft creation action.
- Versions `8` and `9` were temporary proof deployments.
- Version `11` is the clean deployment after proof; token-protected application status now requires the matching token.
- Version `12` adds B2 name/logo approval storage in the `Part B approvals` tab and updates the matching `Applications` control row.
- Version `13` adds B3 video approval/change storage in the `Part B video approvals` tab and updates the matching `Applications` control row.
- Version `14` adds a guarded internal `updateApplicationStatus` action, a `Status events` audit log, and redacts sensitive tokens/PINs from stored audit JSON.
- Version `15` adds the `Communications` manual-send queue and first customer communication templates.
- Version `16` adds the `Internal reviews` operator checklist tab and a `Trust Hub status` control field.
- Version `17` adds a guarded `updateInternalReview` action for RightOnQ checklist updates and optional Part A acceptance.
- Version `18` adds a guarded `getOperatorSnapshot` action for RightOnQ application readback.
- Version `19` updates the default internal KYC checklist state from `pending_isa_reply` to `pending_trust_hub_review` after Twilio's Isa Bell reply.
- Version `20` adds internal `Trust Hub KYC` and `UK RC bundles` tracking rows for future Part A submissions and includes them in guarded operator snapshots.
- Version `21` adds guarded operator update actions for `Trust Hub KYC` and `UK RC bundles`.
- Version `22` adds status/ID tracking fields for exception-only authorised-representative evidence collection, without adding raw identity-document storage.
- Version `23` adds billing/commercial tracking scaffolding.
- Version `24` fixes default billing fee fields for future billing updates.
- Version `25` hardens public Part A submission by requiring an existing private application link/token, adds advisory/strict payment gate support, and rate-limits Adam MailApp notifications.
- Version `32` adds the `Payment orders` ledger plus guarded `checkActiveCheckout` and `recordPaymentOrder` operator actions for Revolut active-checkout protection. The public web app is still pinned to version `31`.
- Version `35` adds guarded `lookupPaymentOrder` for read-only Payment orders lookup by Revolut order ID. It is deployed as a clean API-only operator deployment; the public web app remains pinned to version `31`.

## Behaviour

The static form posts the Part A JSON payload to the Web app URL.

The script:

- appends one new row per submission,
- stores the application ID and initial registration/Part A statuses,
- creates or updates the matching row in the `Applications` control tab,
- returns the latest status for a supplied Application ID or private application token,
- rejects public Part A submission unless the application exists and the supplied private token matches,
- blocks repeat public Part A submissions unless the application is back in `part_a_changes_needed`,
- can enforce payment-confirmed Part A access when `PART_A_PAYMENT_GATE_MODE` is set to `strict`,
- appends B2 name/logo approval or issue responses to `Part B approvals`,
- updates the matching `Applications` row to `name_logo_approved` or `name_logo_changes_requested`,
- appends B3 video approval or change responses to `Part B video approvals`,
- updates the matching `Applications` row to `video_approved` or `video_changes_requested`,
- supports guarded internal status updates through `action = updateApplicationStatus`,
- supports guarded internal checklist updates through `action = updateInternalReview`,
- supports guarded operator readback through `action = getOperatorSnapshot`,
- supports guarded Trust Hub KYC updates through `action = updateTrustHubKyc`,
- supports guarded UK RC Bundle updates through `action = updateUkRcBundle`,
- appends successful internal status changes to `Status events`,
- redacts private application tokens and operator/create PINs from stored audit JSON,
- appends customer communication drafts to `Communications` for manual send/review,
- appends a RightOnQ operator checklist row to `Internal reviews` when Part A is received,
- appends internal Trust Hub and UK RC Bundle tracking rows when Part A is received,
- stores `Trust Hub status` on the `Applications` control row,
- sets review status to `New`,
- sets US fee status to `Not yet agreed` if United States is selected,
- stores the raw JSON payload in the `Part A JSON` column,
- sends a rate-limited email notification to `adam@rightonq.co.uk`.

If the endpoint is not configured or the POST fails, the form downloads the client copy and asks the user to email it to Adam.

## Important

Do not put secrets in the static HTML page. The Apps Script URL is not a password; it is a receiver endpoint. Keep the Sheet private to RightOnQ.

The internal `createApplicationDraft` action is guarded by the script property `ONBOARDING_CREATE_PIN`.

The internal `updateApplicationStatus` action is guarded by the script property `ONBOARDING_OPERATOR_PIN`.

`PART_A_PAYMENT_GATE_MODE` defaults to advisory/missing. Set it to `strict` only after Revolut/manual payment confirmation is wired into `Applications.Billing status`; strict mode accepts `registration_fee_paid`, `registration_fee_manually_confirmed`, or `registration_fee_waived`.

## Public / Operator Split

Current pilot state:

- public customer actions run through the anonymous public web app;
- operator actions run through `rcsOperatorAction` using authenticated Apps Script API execution;
- public version `31` rejects operator-only actions if they arrive through the anonymous `doPost` web app path.

Target state before public website integration:

- public deployment:
  - anonymous customer Part A submit;
  - `submitNameLogoApproval`;
  - `submitVideoApproval`;
- operator deployment:
  - `createApplicationDraft`;
  - `getOperatorSnapshot`;
  - `updateApplicationStatus`;
  - `updateBilling`;
  - `checkActiveCheckout`;
  - `recordPaymentOrder`;
  - `updateInternalReview`;
  - `updateTrustHubKyc`;
  - `updateUkRcBundle`;
  - Google-authenticated / RightOnQ-only access where practical.

Local tooling is ready for the split:

- use `RCS_ONBOARDING_PUBLIC_WEB_APP_URL` for the public deployment;
- use `RCS_ONBOARDING_OPERATOR_WEB_APP_URL` for the operator deployment;
- `RCS_ONBOARDING_WEB_APP_URL` remains the combined deployment fallback during the pilot.

Authenticated operator API scaffold:

- `rcsOperatorAction(payload)` is available in `Code.gs` as the intended Apps Script API entry point for operator-only actions.
- The manifest includes `executionApi.access = DOMAIN`.
- The Apps Script project is now linked to standard Google Cloud project `rightonq-gog`.
- The current clean operator API executable deployment is `AKfycbzj0I9m_vld5Aw-zPQFsTZXslrmxlrDA6Ut0RtFnd6_fxXpVDc4qhhRuKVAA5EuhWG9` (version `35`, `Operator API executable (Step 8L lookup after push)`).
- The previous clean operator API executable deployments have been archived after the v35 lookup proof passed:
  - `AKfycbwPbeT3Mxpmr_Q88WdSp0hRnDk96Pm93GDTsA1eOsJxmiaVpSS2xAg78ox848YsqCQU` (version `34`);
  - `AKfycbwSdO73nyxrOKVPQVQgkoGg29RwvYmJXWDYAgFqs5cdxyI4pJXFW3cZZSS1-6y3zlex` (version `33`, description `Operator API executable (Step 8H clean API-only)`).
- The earlier v32 deployment `AKfycbyG5yW-r0sfaKt1bwUUGFAHHdQoKK8wBCfR1riVxvYamu9YhfOBpRJhnRL_5iBP0VSC` was contaminated with Web app + API executable types during the active-checkout-guard deployment refresh and has been archived.
- The earlier v29 deployment `AKfycbzogKHOijtu6kjp2MVrL9WcVuF6mWrgQyKUzQGRvpTfozdUSA9y_B6X_eWpQeQ-mWtS` was contaminated with Web app + API executable + Library types and has been archived.
- `rcsOperatorAction(payload)` now enforces the same PIN guard as the web app operator path:
  - `createApplicationDraft` requires the create PIN;
  - the other operator actions require the operator PIN.
- Public web app version `31` is the live public customer endpoint.
- Version `31` blocks operator-only actions on the public `doPost` path before opening the Sheet.
- Do not run `clasp deploy -i` against the clean API executable while `appsscript.json` still contains public web app deployment settings.

Operator API proof:

- Named clasp login `rightonq-gog` uses the existing Desktop OAuth client `RightOnQ-GOG-Client`.
- Local credential JSON was found at `/Users/macpro/Downloads/rightonq-gog-client.json`.
- A local-only derived copy, `/Users/macpro/Downloads/rightonq-gog-client-clasp-localhost.json`, adds `http://localhost` because this clasp version requires a literal localhost redirect URI.
- The named login includes the Sheets scope needed by `SpreadsheetApp.openById`.
- Direct `scripts.run` execution against the clean API deployment with a dummy PIN reaches Apps Script and correctly returns `Invalid onboarding operator PIN`.
- Valid-PIN read-only snapshot for `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747` returned `ok: true`.
- Operator snapshot readback now reconciles tracked Sheet headers to canonical order before reading Billing, Internal reviews, Trust Hub KYC, and UK RC Bundle rows.
- Local operator wrappers now call `https://script.googleapis.com/v1/scripts/{deploymentId}:run` directly with the PIN in the HTTPS request body, not in a command-line `clasp run --params` argument.
- The direct `scripts.run` helper uses `devMode: false` and the clean API executable deployment ID from `.clasp.json`, so wrappers are pinned to the deployed operator API version rather than Apps Script HEAD.
- `operator-status.mjs` proved the wrapper path by returning strict JSON with `ok: true` for `ROQ-RCS-TEST-PUBLIC-PARTA-20260515151747`.
- Public customer submissions remain on the public v31 web app.

Current caveat:

- `clasp run rcsOperatorAction --nondev ...` may still return `Script function not found. Please make sure script is deployed as API executable.`
- Use the repo-owned operator wrappers, which call the Apps Script API endpoint directly with the clean deployment ID.

Do not store either PIN in this repo, in static HTML, or in Sheet audit JSON. If `ONBOARDING_OPERATOR_PIN` is not configured, internal status updates correctly return `ONBOARDING_OPERATOR_PIN is not configured`.

Local application-link creation can be sent with `rcs-registration/tools/operator-create-application.mjs`, which reads `RCS_ONBOARDING_CREATE_PIN` from the local environment. Local operator updates can be sent with `rcs-registration/tools/operator-review.mjs`, `rcs-registration/tools/operator-trusthub-kyc.mjs`, and `rcs-registration/tools/operator-rc-bundle.mjs`. Local operator readback can be run with `rcs-registration/tools/operator-status.mjs`. These tools never store PINs in the repo. See `rcs-registration/tools/README.md` for dry-run and live examples.

`Communications` is currently a manual-send queue. It records draft messages and trigger context, but it does not send customer emails automatically.
