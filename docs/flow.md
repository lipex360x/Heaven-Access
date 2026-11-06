# Heaven Access — Visitor Access Flow

Planning draft, 6 November 2026. Use these diagrams to explain the proposed MVP to the group and as source material for the report and presentation. GitHub renders the Mermaid diagrams below.

[Issue #1](https://github.com/lipex360x/Heaven-Access/issues/1) is the Source of Truth for lifecycle decisions and review. This artifact illustrates the current proposal; unresolved roles, timing, pass reuse, and replacement rules must be agreed there before implementation. See [design.md](design.md) for screen wireframes.

## Overview for a presentation slide

```mermaid
flowchart LR
    A[Visitor requests a visit] --> B[Staff review and approve]
    B --> C[Visitor receives a mobile QR pass]
    C --> D[Camera scans QR at access simulator]
    D --> E[System checks permission and time]
    E --> F[Authorized access is granted]
```

This is the successful journey. A request alone does not grant access; failed validation keeps the device locked. Delivery and the physical access device are simulated.

## Detailed flow and assistance paths

```mermaid
flowchart TD
    A[Public registration: visitor selects destination and visit time]
    A --> B[Read privacy information and complete agreed privacy interaction]
    B --> C[Submit request]
    C --> D[Visitor page: awaiting approval, no usable QR]
    C --> E[Authenticated staff review the request]
    E --> F{Visit approved?}
    F -->|No| G[Request rejected: no access pass]
    F -->|Yes| H[Issue time-limited QR for approved destination]
    H --> I[Visitor mobile page displays current pass]
    I --> J[Present QR to access-device camera]
    T[Controlled fictional demo clock] -.-> K
    J --> K{Approval, credential, destination and time valid?}
    K -->|Yes| L[Temporarily unlock simulated device]
    K -->|No| M[Keep device locked and show reason]
    M --> N[Visitor requests staff assistance]
    N --> O{Authorized staff decision}
    O -->|Approve replacement under agreed timing rules| P[Invalidate old QR and issue replacement]
    P --> I
    O -->|Receptionist grants manual release| L
    O -->|Decline| Q[Access remains blocked]
    L --> R[Relock after agreed interval]
```

## How the screens work together

| Stage | Screen / actor | Shared change |
| --- | --- | --- |
| Request | Public registration / visitor | Pending visit appears in the staff interface |
| Review | Staff interface / authorized reviewer | Visitor page reflects the approval decision |
| Pass | Mobile visitor page / visitor | Approved QR and validity details are available |
| Validation | Device simulator / camera | Backend checks the pass using the controlled effective time |
| Access | Device simulator | Device temporarily unlocks or stays locked with a reason |
| Assistance | Staff interface / receptionist | Authorized replacement or manual release updates the relevant screens |

Realtime updates should work across the open browser tabs without a manual refresh. A replacement credential does not automatically extend an expired visit; staff must follow the timing/approval rules agreed in the lifecycle issue. Manual release is a separate authenticated action and must not depend on the visitor approving their own request.

The ±30-minute window is still a proposal. The diagram does not establish occupancy tracking, checkout, physical tailgating prevention, or real elevator integration.
