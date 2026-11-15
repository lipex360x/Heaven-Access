# Heaven Access — Visitor Access Flow

Supporting flow artifact, revised 15 November 2026 to reflect the implemented visitor prototype. Use these diagrams to explain the proposed MVP to the group and as source material for the report and presentation. GitHub renders the Mermaid diagrams below.

[Issue #1](https://github.com/lipex360x/Heaven-Access/issues/1) is the Source of Truth for lifecycle decisions and review. This artifact reflects the accepted single staff role, inclusive ±30-minute Europe/Dublin window, reusable QR, confirmed revocation and new-request-after-expiry/revocation rules. See [design.md](design.md) for screen wireframes.

## Overview for a presentation slide

```mermaid
flowchart LR
    A[Visitor requests a visit] --> B[Staff review and approve]
    B --> C[Visitor receives a mobile QR pass]
    C --> D[Dedicated camera reader scans QR]
    D --> E[Server checks permission, revocation and time]
    E --> F[Authorized access is granted]
```

This is the successful journey. A request alone does not grant access; failed validation keeps the device locked. Delivery and the physical access device are simulated.

## Detailed flow and assistance paths

```mermaid
flowchart TD
    A[Public registration: name, company/room and visit date/time]
    A --> B[Read privacy notice and acknowledge before submission]
    B --> C[Submit request]
    C --> D[Visitor page: awaiting approval, no usable QR]
    C --> E[Authenticated staff review the request]
    E --> F{Visit approved?}
    F -->|No| G[Request rejected: no access pass]
    F -->|Yes| H[Issue time-limited QR for approved destination]
    H --> I[Visitor mobile page displays current pass]
    I --> J[Phone 1 presents QR to dedicated reader on phone 2]
    H -.-> V[Staff confirms revocation]
    V --> W[Hide visitor QR and deny future QR openings]
    W --> N
    T[Controlled fictional demo clock] -.-> K
    J --> K{Approved, not revoked, correct credential, destination and time?}
    K -->|Yes| L[Temporarily unlock simulated device]
    K -->|No| M[Keep device locked and show reason]
    M --> N[Visitor requests staff assistance]
    N --> O{Authorized staff decision}
    O -->|Expired or revoked visit needs new approval| P[Create a new visit request]
    P --> A
    O -->|Receptionist grants manual release| L
    O -->|Decline| Q[Access remains blocked]
    L --> R[Relock after eight real seconds]
    R --> J
```

## How the screens work together

| Stage | Screen / actor | Shared change |
| --- | --- | --- |
| Request | Public registration / visitor | Pending visit appears in the staff interface |
| Review | Staff interface / authorized reviewer | Visitor page reflects the approval decision |
| Pass | Mobile visitor page / visitor | Approved QR and validity details are available |
| Validation | `/device/reader` / camera phone | Server checks approval, revocation, credential, destination and effective time |
| Access | `/device/display` / tablet | Device temporarily unlocks or stays locked with a reason |
| Revocation | Reception / authenticated staff | Confirmation records actor/time, removes visitor QR and blocks future QR authorizations |
| Assistance | Staff interface / receptionist | Staff can manually release access; expiry/revocation requires a new request and approval |

Screens automatically refresh state through approximately one-second polling in the single Next.js application. This is near-real-time synchronization, not immediate server push; WebSocket/SSE infrastructure is not required for the initial prototype. QR validation and manual-release authorization remain server-side and do not depend on the polling interval.

The public form collects visitor name, seeded company/room destination and scheduled date/time; no email or phone is required. One authenticated staff/reception role can approve, reject, revoke an approved pass and manually release access. The accepted privacy interaction requires an initially unchecked notice acknowledgement before submission. Without acknowledgement, no visit is created; offer reception assistance. Complete notice content, lawful-basis analysis and retention remain under issue #3.

QR authorization is valid from 30 minutes before through 30 minutes after the scheduled time, both boundaries inclusive, in Europe/Dublin. Repeated access within the window is allowed. Expiry requires a new request and approval; the old credential remains expired. The demo clock must be controlled by authorized staff, separate from real session/audit time.

The user requires access counts. Accepted counting semantics for the shared contract: one count per successful QR-authorized unlock, suppressing repeated camera frames while unlocked; denied scans do not count. Manual-release events remain separately identifiable. Display counts in the existing staff interface, without adding a dashboard. The accepted issue #1 contract specifies eight-real-second unlocks and atomic event deduplication.

This flow does not establish occupancy tracking, checkout, physical tailgating prevention or real elevator integration. Cross-building blocking is a future extension, outside the single-building prototype.

See [data-state-contract.md](data-state-contract.md) for the accepted data/API boundary and technical defaults, including eight-second unlocks, count deduplication, separate manual events and the controlled advancing demo clock. Clock rewind is a staff-only scenario replay, not a renewal operation; derived time states can change during that replay without changing the stored approval window.

## Revocation and recurring-occupant boundary

Revocation preserves the original approval and access history, with a separate real actor/time record. It blocks new QR openings, including scans of downloaded images, and cannot be undone by clock replay. A previously granted opening completes its existing eight-second interval. A deliberate, attributable manual override remains possible without restoring the QR. A revoked visitor needs a new request and approval.

The dedicated reader is a presentation mode of the same device, not an additional controller: phone 1 shows the pass, phone 2 opens `/device/reader` and starts the camera, and the tablet opens `/device/display`. `/device` retains destination/clock/manual controls. Use the hosted HTTPS origin for phone camera access.

Bella identified the separate needs of employees and other regular occupants. The current request/approval/±30-minute pass is a temporary-visitor workflow; staff sign-in permits operating the application, not permanent physical entry. Managed recurring credentials with permitted destinations/schedules, review and revocation are an unimplemented future option, described in [future-improvements.md](future-improvements.md). Do not simulate this by extending a visitor QR indefinitely. Bella explains this boundary briefly in the closing/evaluation slot; Felipe introduces the demonstration as a temporary visit.
