# Heaven Access — Working Product Plan

Status: discovery and planning only. No application implementation is authorized yet.

## Confirmed direction

- PostgreSQL running locally through Docker Compose.
- A SQL initialization script creates tables and seeds staff accounts and departments/destinations, plus companies/rooms where needed. No reference-data administration screens are required.
- The initial Bun/Vite+/monorepo preference is now open for comparison with Next.js or a simpler React-based approach. Realtime behaviour remains required regardless of architecture; no final selection has been made.
- Vite+ is the installed `vp` CLI. Its help was inspected successfully on 6 November 2026. No installation, migration, or scaffolding was performed.
- A visitor can register without creating an account and choose the company/room and intended visit time.
- Staff use login/password access to review and approve visitors. A registration must await approval.
- The access simulator supports both camera-based QR scanning and manual release by a receptionist when appropriate.
- A mobile-first page simulates delivery/display of a visitor QR pass.
- Screens must reflect changes in real time, including issuance of a new pass when an earlier pass is expired or invalid.
- The access simulator allows a fictional current time to be selected for the demonstration.
- The visitor must receive privacy information and the requested consent interaction before data submission/storage; the lawful basis and precise consent model still require assessment.
- The main demonstration uses separate browser tabs on one computer through localhost. Additional devices may connect to the host over the same Wi-Fi using its LAN address.
- `web-view -h` was inspected successfully on 6 November 2026. It controls Chrome through CDP, including tabs, interactions, snapshots, resizing, and JS evaluation. Use it for development verification after implementation is authorized.

## Database setup boundary

- Plan a SQL-created PostgreSQL schema and seeded application users/departments rather than an administrative setup workflow.
- Define companies, departments, rooms, and floors only to the extent needed by the agreed demo scenario.
- Seed staff account password hashes, not plaintext application passwords in database rows; keep actual secrets outside documentation.
- Agree how first initialization differs from reusing a persistent database and how to reset demo records reproducibly. No reset may silently delete existing work.
- Schema, relationships, SQL files, and Compose configuration remain future implementation work.

## Local demonstration setup

- One host computer runs the application and PostgreSQL; multiple tabs represent staff, public registration, visitor pass, and the access device.
- Tabs share browser cookies/session storage according to browser behaviour; confirm this does not accidentally grant staff privileges to public/visitor views. Use isolated browser contexts if separate authenticated identities need testing.
- On an additional phone/tablet, localhost refers to that device. Connect to the application's host LAN address instead and verify network exposure, firewall, and camera requirements before the physical-device demo.
- QR testing should include an actual camera scan of a code shown on another screen or printed sheet. Automated state checks alone do not verify the camera path.
- Keep the browser tool ready for navigation, interactions, multi-tab state checks, mobile viewports, and screenshot evidence. Inspect subcommand help when needed; no browser was started during planning.

## Interface responsibilities

| Interface | Confirmed purpose | Details still open |
| --- | --- | --- |
| Staff | Login/password; approve a requested visit; enable a receptionist to release access manually | Staff roles, company boundaries, rejection/revocation/renewal controls, audit visibility |
| Public registration | Essential visitor details; destination company/room; requested date/time; privacy/consent interaction | Exact fields, destination directory exposure, abuse prevention, duplicate requests, confirmation and status access |
| Elevator/gate simulator | Default locked state; camera QR scanning; validation result; fictional current-time control; manual release mode | Elevator versus gate presentation, device identity, authorized floor display, unlock duration, relocking, camera permissions, offline behaviour |
| Mobile-first visitor pass | Simulated delivery; visit status and approved QR; replacement pass reflected live | Private link delivery, pending/expired/revoked UI, access to the page without an account, local phone connectivity |

The original concept also included occupancy monitoring and an evacuation aid. Their inclusion in the MVP is undecided; neither should be inferred from an access-granted event alone.

## Proposed lifecycle for discussion

The following is a proposal, not an approved state machine:

1. Visitor reads the privacy information and submits a visit request.
2. Staff see a pending request; the visitor sees a waiting state with no usable access credential.
3. An authorized staff member approves or rejects the request.
4. Approval makes a QR pass available on the visitor page. The pass references a permitted destination and validity window.
5. A scan asks the backend to validate the credential, approval state, destination/device, effective current time, and usage rules.
6. A successful validation temporarily unlocks the simulated device. A failed validation leaves it locked and explains the relevant reason.
7. If needed, authorized staff issue a replacement credential. Recommended for discussion: invalidate the previous credential atomically and update the visitor page live.
8. A receptionist may manually release the simulated device. Recommended for discussion: require authenticated authorization, a reason, and an audit event; define separately whether this renews a QR or is a one-off release.

Visit approval, credential validity, access attempts, and physical presence are different concepts. A rejected scan should not automatically approve a visit, and a new QR should not implicitly change an expired visit's permitted time.

## Time and realtime behaviour to agree

- Candidate visit window: scheduled time minus 30 minutes through scheduled time plus 30 minutes. For 14:00, this would be 13:30–14:30. The user has not finalized the margin or edge conditions.
- Decide whether appointments have a start and end time or a single scheduled time.
- Use one authoritative validation decision for all screens. The simulator's fictional clock should drive that decision through a controlled demonstration mechanism rather than independently changing browser displays.
- Separate simulation time from real audit/session time; decide whether the visitor page displays both clearly.
- Decide whether the demo clock affects one visit, one simulated device, or the entire demo, and how it resets.
- WebSocket is a candidate for near-immediate updates. The requirement is consistent shared state, not literal synchronous execution of every browser.
- Plan an initial state fetch and state reconciliation after disconnects so a missed event does not leave an old QR or approval state displayed indefinitely.
- Only publish events to the relevant staff, visitor page, and device. Public registration must not expose other visitors' data.
- Define ordering for competing scans, approval changes, revocation, and renewal.

## Privacy and security design questions

- Identify the minimum fields needed. Name, contact method, destination, and visit time are candidates, not an agreed schema; avoid collecting identity documents by default.
- Determine the lawful basis for essential processing. The DPC states that consent is one of six possible bases and is not necessary for all processing; see `references.md`.
- If consent is relied upon, define its purpose, affirmative action, notice version, evidence, refusal, and withdrawal process. Privacy-notice acknowledgement must not be mislabelled as consent.
- Define what “before storage” means, including request drafts, analytics, request logs, and failed submissions.
- Consider an opaque pass token without readable personal details, revocation/rotation, and protections against copying or repeated use.
- An account-free visitor page still needs private access: define a hard-to-guess link or equivalent and its expiry. Do not treat a sequential visit identifier as authorization.
- Camera use is for reading QR codes. There is no request for recording footage, facial recognition, or AI. Recommended scope: process frames for decoding without retaining images.
- Agree staff permissions, password/session handling, and manual-release audit controls.
- Consider smartphone-free assistance, camera permission denial, inaccessible cameras, and a safe failure state.
- Plan actual-phone testing: camera availability and browser security requirements must be checked before selecting local-network exposure/HTTPS arrangements.

## Next discussion

1. Who approves a visitor: a company/room representative, the receptionist, or both with different powers?
2. What essential visitor fields are needed, and how does the visitor privately receive/open their pass page in the simulated delivery flow?
3. Is the QR single-use, valid for repeated entry during the window, or valid until checkout?
4. Does renewing an expired pass require a new approved visit time? What may a receptionist override?
5. Does the demo represent a multi-company building, and is the primary barrier an elevator, a gate, or a switchable visual simulation?
6. Which architecture and UI framework best fit the local demonstration, and what should Bun run/manage if retained? PostgreSQL is already selected.

## Report and presentation evidence

- Use `references.md` for the research summary, incident evidence, source limitations, and draft Harvard references.
- Use `design.md` for the preliminary screen flow and low-fidelity wireframes.
- Refine the flow in the supporting report and include a wireframe/planning slide before the MVP demonstration.
- Date and preserve actual design iterations; do not claim interviews, usability tests, or planning activities that did not occur.

Resolve the user journey and authorization rules before choosing libraries or writing implementation tasks in detail.
