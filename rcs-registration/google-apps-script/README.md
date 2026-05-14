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
- Current published version after CLI redeploy: `20`
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

## Behaviour

The static form posts the Part A JSON payload to the Web app URL.

The script:

- appends one new row per submission,
- stores the application ID and initial registration/Part A statuses,
- creates or updates the matching row in the `Applications` control tab,
- returns the latest status for a supplied Application ID or private application token,
- rejects Part A submission into a token-protected application if the supplied token does not match,
- appends B2 name/logo approval or issue responses to `Part B approvals`,
- updates the matching `Applications` row to `name_logo_approved` or `name_logo_changes_requested`,
- appends B3 video approval or change responses to `Part B video approvals`,
- updates the matching `Applications` row to `video_approved` or `video_changes_requested`,
- supports guarded internal status updates through `action = updateApplicationStatus`,
- supports guarded internal checklist updates through `action = updateInternalReview`,
- supports guarded operator readback through `action = getOperatorSnapshot`,
- appends successful internal status changes to `Status events`,
- redacts private application tokens and operator/create PINs from stored audit JSON,
- appends customer communication drafts to `Communications` for manual send/review,
- appends a RightOnQ operator checklist row to `Internal reviews` when Part A is received,
- appends internal Trust Hub and UK RC Bundle tracking rows when Part A is received,
- stores `Trust Hub status` on the `Applications` control row,
- sets review status to `New`,
- sets US fee status to `Not yet agreed` if United States is selected,
- stores the raw JSON payload in the `Part A JSON` column,
- sends an email notification to `adam@rightonq.co.uk`.

If the endpoint is not configured or the POST fails, the form downloads the client copy and asks the user to email it to Adam.

## Important

Do not put secrets in the static HTML page. The Apps Script URL is not a password; it is a receiver endpoint. Keep the Sheet private to RightOnQ.

The internal `createApplicationDraft` action is guarded by the script property `ONBOARDING_CREATE_PIN`.

The internal `updateApplicationStatus` action is guarded by the script property `ONBOARDING_OPERATOR_PIN`.

Do not store either PIN in this repo, in static HTML, or in Sheet audit JSON. If `ONBOARDING_OPERATOR_PIN` is not configured, internal status updates correctly return `ONBOARDING_OPERATOR_PIN is not configured`.

Local application-link creation can be sent with `rcs-registration/tools/operator-create-application.mjs`, which reads `RCS_ONBOARDING_CREATE_PIN` from the local environment. Local operator updates can be sent with `rcs-registration/tools/operator-review.mjs`. Local operator readback can be run with `rcs-registration/tools/operator-status.mjs`. These tools never store PINs in the repo.

`Communications` is currently a manual-send queue. It records draft messages and trigger context, but it does not send customer emails automatically.
