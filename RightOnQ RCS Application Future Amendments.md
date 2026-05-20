# RightOnQ RCS Application Future Amendments

Date opened: 2026-05-12
Purpose: working notes for future changes, amendments, and product ideas for the RightOnQ RCS application, including the Part A and Part B flows.

This file is separate from the website wording notes. It is for app behaviour, workflow, form logic, registration flow, internal records, customer-facing controls, and future product improvements.

## Current Scope

The current application work is centred on the RCS registration and onboarding flow:

- Part A intake
- Part B follow-up
- business/customer details
- registration information
- validation and test bypass handling
- Google Sheets intake hooks
- future operational workflow around RCS setup

## Future Amendment Areas

Use this file to collect future app ideas before implementation.

Potential areas:

- clearer Part A / Part B progression
- better save-and-return behaviour
- improved validation messages
- internal admin review views
- cleaner registration status tracking
- customer-facing progress updates
- file upload handling
- logo/brand asset handling
- message template creation
- recipient list upload
- campaign/send record views
- proof-of-send and delivery record views
- reply capture and export
- searchable customer communication history
- team notes or internal comments

## Messaging Record / Accountability Ideas

The app may need to support a stronger operational messaging story, not only rich outreach.

Useful future product ideas:

- clear record of what was sent
- who it was sent to
- when it was sent
- sender/team member responsible
- delivery/receipt status where available
- replies received
- exportable campaign record
- searchable history by customer, campaign, date, or sender
- cleaner alternative to digging through WhatsApp or scattered chat threads

## Product Balance

The application should support both:

- richer RCS outreach with branded messages, images, reply buttons, and future carousel-style features
- practical business messaging where the main value is verified identity, controlled sending, and a clear communication record

The first product build may lean more heavily toward practical sending, registration, recipient control, and message records. Richer RCS features can still remain part of the roadmap and public direction.

## Registration Gateway / Page Polish

Parked for later polish after the payment and onboarding mechanics are clearer:

- Add a short "registration journey" storyboard near the top of the page so the client understands the full path before filling Part A.
- Make the process feel calm and low pressure: RCS approval usually takes around 4-6 weeks, and the monthly RightOnQ plan should not start until the sender is approved and ready to use.
- Keep the registration fee wording visible: the £100 + VAT fee starts the RCS registration work, with a full refund if approval fails for reasons outside the client's control.
- Make it clear the selected RightOnQ plan is a starting plan, not a trap: clients can upgrade or downgrade between RightOnQ UK and RightOnQ Global at the end of a monthly billing cycle.
- Avoid promising pro-rata credits until billing systems can support them. Current preferred wording should say plan changes happen at month end and pro-rata credits are not currently offered.
- Consider moving the final "Complete Part A" action below the plan choices and fee acknowledgement so the visual order matches the logical order on desktop, tablet, and mobile.
- Keep desktop/laptop/tablet as the primary completion experience. Mobile should remain readable and sane, but the full Part A form is not expected to be mainly completed on a phone.
