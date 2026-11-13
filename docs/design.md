# Heaven Access — Preliminary Screen Flow and Wireframes

Planning artifact, revised 13 November 2026. These are low-fidelity artifacts for discussion, the supporting report, and a presentation slide. They are not implemented screens or a final specification. The accepted rules in issue #1 govern these screens; the privacy-notice acknowledgement is also accepted; the technical contract is accepted, while the full notice remains under review.

[GitHub issues](https://github.com/lipex360x/Heaven-Access/issues) are the Source of Truth for design decisions, review tasks and progress. This file stores the visual planning artifact, not an independent backlog.

## Screen flow

See [flow.md](flow.md) for the presentation overview, detailed visitor journey, validation branches, and receptionist assistance. Keep the flow in that document so the report and slides use the same diagram source.

See [data-state-contract.md](data-state-contract.md) for accepted screen inputs/outputs, visitor-link isolation, access counts and demo controls. The simulator uses the existing staff session; there is no separate device enrollment screen. Camera use decodes QR data without storing footage.

## Low-fidelity wireframes

### 1. Public visit request

```text
+--------------------------------------+
| HEAVEN ACCESS           Visit request |
|                                      |
| Your name       [..................] |
| Company         [Select          v] |
| Department/room [Select          v] |
| Visit date      [  DD / MM / YYYY  ] |
| Visit time      [      HH:MM       ] |
|                                      |
| Why we need your information         |
| [Read privacy notice]                |
| [ ] I have read the privacy notice.  |
|                                      |
|          [ Request visit ]           |
| Approval is required before access.  |
+--------------------------------------+
```

*No email or phone is collected. The user accepted an initially unchecked privacy-notice acknowledgement before submission. Show a short purpose summary and a link to the full notice. Without acknowledgement, do not create a visit; offer reception assistance. Lawful-basis analysis, the complete notice and retention remain under issue #3. The public form does not create an immediately usable pass. No administration of companies or departments is included.

### 2. Staff login and operational visit review

```text
+--------------------------+    +-----------------------------------------+
| STAFF SIGN IN            |    | HEAVEN ACCESS     Staff       [Sign out]|
| Username [.............] |    | Pending visits | Approved | Access log* |
| Password [*************] |    |-----------------------------------------|
|       [ Sign in ]        |    | Visitor   Destination  Time    Status   |
+--------------------------+    | Alex      Room 401     14:00   Pending  |
                                |                                         |
                                | Selected visit details                  |
                                | [Approve] [Reject]                     |
                                | QR accesses: 0                          |
                                |                                         |
                                | Receptionist assistance                 |
                                | Device [Select v]  Reason [..........]  |
                                | [Manual release]                        |
                                +-----------------------------------------+
```

One staff/reception role can approve, reject and manually release access. The existing detail view shows the required QR access count; manual releases remain distinguishable. No special renewal/replacement control is included. Access-log layout and manual-release reason details remain to be refined. Seeded staff accounts remove the need for a user-management area.

### 3. Access-device simulator

```text
+--------------------------------------------------+
| HEAVEN ACCESS          Elevator / gate simulator   |
|                                                  |
|                   LOCKED                         |
|                                                  |
|        +-------------------------------+         |
|        |                               |         |
|        |      CAMERA QR SCAN AREA      |         |
|        |                               |         |
|        +-------------------------------+         |
|               [ Enable camera ]                  |
|                                                  |
| Result: Waiting for a visitor pass                |
| Destination: --                                  |
|                                                  |
| DEMONSTRATION CONTROLS                            |
| Fictional current date/time [..................] |
| [Apply demo time]       [Reset demo time*]         |
| Simulation only - no physical hardware connected |
+--------------------------------------------------+
```

State variants: access granted, outside validity window, invalid/revoked QR, camera permission denied, and connection unavailable. Manual release originates from authorized staff action and updates this view. The fictional clock is a controlled demo feature, not a visitor permission.

### 4. Mobile-first visitor pass

```text
+---------------------------+
|       HEAVEN ACCESS       |
|       Your visit pass     |
|                           |
| Status: Approved          |
| Alex - Company A          |
| Destination: Room 401     |
| Visit: 14:00              |
| Valid: 13:30 - 14:30*     |
|                           |
|     +---------------+     |
|     |               |     |
|     | QR PLACEHOLDER|     |
|     |               |     |
|     +---------------+     |
|                           |
| Present at the scanner.   |
| [Request assistance*]     |
| [Privacy information]     |
+---------------------------+
```

*The accepted window is ±30 minutes, with inclusive boundaries, in Europe/Dublin. Before approval, display a waiting state without a usable QR. On expiry, show a new-request link: a new approval is required and the old pass stays expired. Repeated QR access within the window is allowed. Simulated delivery and the private link mechanism remain to be defined. Screens update automatically through approximately one-second polling.

## Use in the report and presentation

- Report: include the reviewed flow, explain actors and alternative paths, and cite this planning artifact by date/version.
- Planning slide: place reduced versions of the four wireframes side by side, connected as request → approval → pass → validation. Label it “Low-fidelity design — revised 13 November 2026”.
- Suggested slide caption: “We separated registration, staff authorization, visitor credentials, and access validation before implementation. Early wireframes exposed decisions about expiry, manual assistance, and live updates.”
- Preserve meaningful revisions and describe changes actually made. Do not invent completed user testing, interviews, or approvals.
- Export clean diagram/wireframe graphics when assembling the final report/slides; these Markdown drafts are the source material for now.
