# Heaven Access — Screen Flow and Low-Fidelity Wireframes

Supporting design artifact, revised 15 November 2026 to reflect the implemented visitor prototype. These simplified wireframes explain the structure; they are not screenshots or evidence of completed native-device testing. GitHub issues remain the Source of Truth for scope, decisions and validation. Earlier designs were revised after implementation of the QR download, dedicated reader/display and confirmed revocation.

## Screen flow

See [flow.md](flow.md) for the shared visitor journey and refusal/assistance branches, and [data-state-contract.md](data-state-contract.md) for authorization/count rules. Four functional interfaces remain: registration, reception, visitor pass and access device. The access interface has a control screen plus dedicated reader and display views of the **same** simulated device.

## 1. Public visit request — `/register`

```text
+-----------------------------------------+
| HEAVEN ACCESS             Visit request |
| Your name       [.....................] |
| Destination     [Company / room      v] |
| Visit date/time [.....................] |
| Time zone: Europe/Dublin                |
| [Read prototype privacy notice]         |
| [ ] I have read the privacy notice.     |
| [Request visit]                         |
+-----------------------------------------+
```

No email/phone is collected. The acknowledgement starts unchecked; without it no visit is created. Submission opens a private pending pass, without a QR. Destinations and staff accounts are seeded; no administrative CRUD is implemented. The notice is for fictional prototype use; the full live-deployment privacy assessment remains under #3.

## 2. Reception — `/staff`

Staff sign in with username/password. The recent-visit filter offers All, Pending, Approved, Rejected and Revoked; each visit has its own card.

```text
+----------------------------------------------+
| HEAVEN ACCESS                   Reception    |
| [New request] [QR reader] [Device display]    |
| Show visits [All recent visits             v]|
|----------------------------------------------|
| Alex · Approved, valid now                   |
| Example Company · Room 401 · scheduled time  |
| QR authorizations: 1 · Manual: 0             |
| [Approve] [Reject]    (pending requests only) |
| [Revoke access]       (approved passes only) |
|                                              |
| Revocation confirmation, when opened:        |
| Blocks future QR access, including images.  |
| [ ] I confirm revocation for Alex.           |
| [Confirm revocation] [Cancel]                |
|                                              |
| [Assisted manual release]                    |
| Reason [..................................] |
| [ ] I checked visitor/destination.           |
| [Confirm manual release]                     |
| [Sign out]                                   |
+----------------------------------------------+
```

Revocation preserves original approval/access history and records real actor/time. Polling changes the private pass to Access revoked and removes its QR/download; saved images cannot authorize new openings. An existing opening completes its original eight-second period. Revocation cannot be reversed by a clock rewind or another approval of the same visit. A new request is needed. Explicit, reasoned manual override remains separate and does not restore QR access.

## 3. Access interface — controls, dedicated reader and display

`/device` keeps the existing camera, shared gate status, destination/demo-clock controls and manual release. The minimal presentation can use two dedicated views:

### Camera phone — `/device/reader`

```text
+--------------------------------------+
| HEAVEN ACCESS              QR reader |
| READY TO SCAN / ACCESS GRANTED        |
|               / ACCESS DENIED        |
| Selected company / room              |
| Denial reason when applicable        |
|--------------------------------------|
| Local camera processing; no footage  |
| recording/upload. Remove QR before   |
| presenting it again.                 |
| +----------------------------------+ |
| |       LIVE CAMERA PREVIEW        | |
| +----------------------------------+ |
| [Start camera] [Stop camera]         |
| [Recover previous reading]*         |
| [Demonstration controls] [Sign out]  |
+--------------------------------------+
```

The recovery button appears only for an uncertain outcome and retains the exact request identity. The dedicated reader requires staff sign-in, requests the rear camera, and omits scenario/manual controls and visitor lists. Phone camera use needs the hosted trusted HTTPS origin and explicit browser permission. Frames are decoded locally; the server decides authorization.

### Tablet — `/device/display`

```text
+--------------------------------------+
| HEAVEN ACCESS          Access display|
| [Gate] [Elevator]                    |
|                                      |
|       ACCESS GRANTED / DENIED         |
|       or GATE / ELEVATOR LOCKED       |
|       [Animated barrier / doors]     |
|       Relock countdown / reason     |
|       Selected company / room        |
|       Effective Dublin time          |
|       Simulated hardware             |
+--------------------------------------+
```

Both modes visualize the same device. Successful authorization opens it for eight real seconds; repeated frames/retries do not extend that deadline or inflate counts. Expired, revoked, wrong-destination and invalid passes cannot authorize a new opening. Camera denial and connection failure are distinct from an authorization refusal.

## 4. Private visitor pass — `/pass#<capability>`

```text
+--------------------------------------+
| HEAVEN ACCESS          Your visit    |
| Approved · ready for access          |
| +----------------------------------+ |
| |           VISITOR QR             | |
| +----------------------------------+ |
| [Download QR image]                  |
| Alex · Company / room · floor        |
| Valid window (Europe/Dublin)         |
| Ask reception for assisted access.  |
+--------------------------------------+
```

QR/download appear before visit details. The inclusive ±30-minute window and destination are checked server-side. Pending/rejected/expired/revoked pages show their state without a usable QR; expiry/revocation requires a new request. Approval and revocation update automatically through approximately one-second visible-page polling. The private link is not a public staff-list field or an access credential itself.

## Scope and presentation use

The current flow is for temporary visitors. Bella raised the needs of employees and other regular occupants; managed recurring credentials are an unimplemented future option, described in [future-improvements.md](future-improvements.md). Staff application authentication must not be presented as employee physical-entry authorization. Bella covers that boundary in her existing closing/evaluation slot; Felipe identifies the demo as a temporary visit.

Use phone 1 for the visitor QR, phone 2 for the dedicated camera reader, and a tablet for the gate/elevator display. Show one refusal (confirmed revocation/saved-image refusal, or expiry if rehearsed), without adding every optional branch to the twelve-minute presentation.

For the report/slides, label these “Low-fidelity design — revised 15 November 2026”, distinguish them from actual screenshots, and describe only genuine revisions and test results. Export portable graphics when assembling the final deliverables. No hardware integration, employee enrollment, occupancy tracking or biometric implementation is supplied by these wireframes.
