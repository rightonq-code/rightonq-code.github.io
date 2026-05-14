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
- Current published version after CLI redeploy: `6`
- Version `4` added Application ID, registration status, and Part A status columns to the intake row.
- Version `5` adds Application ID status lookup via `GET ?applicationId=...`.
- Version `6` adds the `Applications` control-row tab and writes/reads one row per Application ID.

## Behaviour

The static form posts the Part A JSON payload to the Web app URL.

The script:

- appends one new row per submission,
- stores the application ID and initial registration/Part A statuses,
- creates or updates the matching row in the `Applications` control tab,
- returns the latest status for a supplied Application ID,
- sets review status to `New`,
- sets US fee status to `Not yet agreed` if United States is selected,
- stores the raw JSON payload in the `Part A JSON` column,
- sends an email notification to `adam@rightonq.co.uk`.

If the endpoint is not configured or the POST fails, the form downloads the client copy and asks the user to email it to Adam.

## Important

Do not put secrets in the static HTML page. The Apps Script URL is not a password; it is a receiver endpoint. Keep the Sheet private to RightOnQ.
