# RCS Twilio Callback Cloud Run Service

Status: source added for a dedicated record-only Twilio Messaging callback receiver.

Purpose:

- accept Twilio Programmable Messaging status callbacks separately from the Revolut webhook;
- validate `X-Twilio-Signature`;
- tolerate evolving form-encoded callback fields;
- project a conservative internal event shape without writing to Sheets or provider state.

Runtime boundary:

- Service name: `roq-rcs-twilio-callback`.
- Region: `europe-west2`.
- Method: `POST` only.
- Expected content type: `application/x-www-form-urlencoded`.
- Signature input: public callback URL plus sorted POST params, signed with `TWILIO_AUTH_TOKEN`.
- Mode: record-only.

Current projection:

- `provider_message_id = MessageSid`.
- `provider_event_id = EventSid` when present, otherwise `null`.
- `status = MessageStatus`.
- `channel_event = EventType` when present.
- `channel = rcs` when `From` starts with `rcs:`, otherwise fallback hints only.
- `error_code = ErrorCode`.
- `human_error = ChannelStatusMessage`.
- read receipt signal is detected from `MessageStatus=read` or `EventType=READ`, but no read-state projection is written in this slice.

Hard boundary:

- no Twilio Messaging Service callback URL configuration yet;
- no message send;
- no Sheet/App Script write;
- no Firestore event persistence yet;
- no RCS Sender or compliance submission;
- no sender-pool or phone-number movement.
