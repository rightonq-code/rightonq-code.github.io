# RCS onboarding activation handover contract

Date: 2026-05-20

Status: design guardrail. This is not a live schema, not an operator export tool, not a provider submission, and not permission to activate RCS traffic.

## Purpose

This document defines the narrow packet that the RCS onboarding lane may hand to the main RightOnQ product after provider approval and internal activation checks.

It exists to prevent a fuzzy handoff between:

- `rightonq-code.github.io/rcs-registration`, which owns onboarding, proof pack, provider readiness, and approval evidence; and
- `rightonq-system`, which owns live sends, provider callbacks, message events, delivery projection, recipient state, cards, and product truth.

The handover is an activation input. It is not runtime truth.

## Boundary Rules

1. Onboarding does not become the live messaging backend.
2. `rightonq-system` owns production sends, callbacks, `message_events`, `message_event_processing`, `outbound_messages`, delivery projection, recipient state, cards, and human/product truth.
3. Product must not infer RCS readiness from the existence of a Twilio subaccount, Messaging Service, hosted assets, or proof callback receiver.
4. Onboarding hands over approved provider/resource facts and explicit gate statuses only.
5. Raw identity documents, A-ID evidence internals, callback proof logs, payment ledgers, usage reconciliation rows, provider secrets, and draft proof assets do not cross this boundary.
6. Any future machine-readable schema or export tool must preserve these rules.

## Required Handover Preconditions

The activation packet must not be treated as complete until all relevant gates are explicitly satisfied or marked out of scope.

Required before product activation consideration:

- client/application identity confirmed;
- Part A accepted after internal review;
- Part B sender name/logo approval recorded;
- review/proof video approved by the client;
- final approved public proof asset URLs stored and read back;
- provider submission approved or otherwise explicitly accepted for the stated channel mode;
- Trust Hub / Secondary Compliance Profile / RC Bundle requirements resolved for the selected channel mode;
- callback ownership decision made, with production callback target recorded as product-owned or deliberately deferred;
- billing activation status decided;
- manual pause flag checked;
- no raw A-ID evidence stored in unsafe paths.

The product may still require its own activation approval after receiving the packet.

## Minimal Activation Payload

The following shape is the proposed minimum handover payload. Field names are design names and may change when this becomes a real schema.

```json
{
  "activation_id": "",
  "application_id": "",
  "client_id": "",
  "product_account_id": "",
  "legal_business_name": "",
  "trading_name": "",
  "sender_display_name": "",
  "primary_contact": {
    "name": "",
    "email": "",
    "phone": ""
  },
  "provider_name": "twilio",
  "twilio_subaccount_sid": "",
  "twilio_messaging_service_sid": "",
  "rcs_sender_id": "",
  "rbm_agent_id": "",
  "secondary_compliance_profile_sid": "",
  "rc_bundle_sid": "",
  "fallback_sender_id": "",
  "fallback_phone_sid": "",
  "approved_logo_url": "",
  "approved_banner_url": "",
  "approved_opt_in_proof_urls": [],
  "approved_review_video_url": "",
  "approved_use_case": "",
  "approved_sample_messages": [],
  "opt_in_description": "",
  "opt_out_description": "",
  "opt_out_response": "",
  "country_carrier_scope": [],
  "provider_submission_status": "approved",
  "go_live_status": "approved_for_activation",
  "channel_mode": "sms_only|rcs_ready|rcs_primary_sms_fallback",
  "callback_status": "product_callback_configured|not_configured|deferred",
  "billing_activation_status": "active|blocked|manual_hold",
  "usage_credit_status": "funded|not_funded|unknown",
  "manual_pause_flag": "no",
  "activated_at": ""
}
```

## Payload Notes

- `activation_id` should be unique for each handover attempt.
- `product_account_id` is product-owned; onboarding should not invent it without a product mapping.
- `provider_submission_status` must not be copied from a non-final tracking status. It should only be `approved` when the provider/carrier approval gate is actually satisfied.
- `go_live_status` is separate from provider approval. It is the onboarding/product readiness signal.
- `channel_mode` must be explicit. A client may be SMS-only, RCS-ready but not primary, or RCS-primary with SMS fallback.
- `callback_status` must name whether production callbacks are configured to the product endpoint, not the onboarding proof callback receiver.
- `manual_pause_flag` must be checked at handover time.
- URLs must point to approved final public assets, not placeholders or draft files.

## Explicit Non-Handover Data

The following data must remain out of the activation payload:

- raw passport, driving licence, government ID, proof-of-address, or representative evidence files;
- A-ID evidence provider internals, inquiry IDs, registration IDs, document SIDs, status history, rejection reasons, or session tokens;
- draft proof videos;
- placeholder proof assets;
- proof callback payloads, read-receipt samples, or callback receiver logs;
- raw Revolut order/payment ledger rows;
- card data, bank data, payment provider secrets, webhook secrets, Twilio auth tokens, API keys, or signed/private URLs;
- usage reconciliation rows;
- raw message payloads or customer message content.

If product later needs one of these items, that need must be handled by a separate approved product/compliance design, not silently added to this packet.

## Product Must Not Infer

The product must not infer live RCS readiness from:

- Twilio subaccount created;
- Messaging Service created;
- sender assets hosted;
- proof video generated;
- proof callback receiver deployed;
- `provider_submission_status` being non-empty;
- Trust Hub tracking rows existing;
- registration fee paid;
- onboarding docs saying RCS is the strategic channel.

RCS sending remains blocked until product-owned gates allow it.

## Product-Owned After Handover

After activation handover, the main product owns:

- account/channel activation record;
- live provider credential selection;
- live send eligibility;
- recipient `preferred_channel` changes;
- production callback endpoint and signature validation;
- `message_events`;
- `message_event_processing`;
- `outbound_messages`;
- delivery and response projection;
- cards/reminders/operator workflow;
- product-side pause and billing enforcement.

Onboarding may keep audit evidence and status history, but it does not become product runtime state.

## Open Questions Before Machine Schema

1. What product table or model should store account-level RCS activation state?
2. Should `product_account_id` be created before provider approval, or only at activation?
3. Does the first machine schema live in `rightonq-system`, `rcs-registration`, or both?
4. What exact `channel_mode` enum does the product want?
5. What product-owned gate changes a recipient from `preferred_channel = sms` to `preferred_channel = rcs`?
6. Should `billing_activation_status` come from onboarding billing, product billing, or a separate finance source of truth?
7. What is the production callback URL strategy for Twilio RCS once RCS is approved?
8. Should A-ID evidence references ever be visible to product operators, or only to onboarding/compliance operators?

## Future Evolution

Recommended order:

1. Keep this document as the design contract.
2. Ask the product team to confirm the product-side activation model.
3. Add a machine-readable JSON schema only after the product-side owner/table is agreed.
4. Add a dry-run export/checker in onboarding.
5. Add a product import/activation flow.
6. Only then consider live RCS recipient/channel activation.

## Review Sources

This contract is based on the read-only product-side and onboarding-side Codex reviews run on 2026-05-20, plus the existing onboarding scaffold:

- `RCS_ONBOARDING_ARCHITECTURE_BLUEPRINT.md`
- `RCS_ONBOARDING_CODEX_REVIEW_DRAFT_2026-05-20.md`
- `RCS_REGISTRATION_PACK_READINESS_MAP.md`
- `RCS_ONBOARDING_PRODUCT_BRIDGE_FOR_PROFESSOR.md`
- `RCS_ONBOARDING_MAIN_BUILD_PLAN.md`
- `rightonq-system` event and provider model

