# Heaven Access — Minimal Data and State Contract

Accepted technical contract, 13 November 2026. [Issue #1](https://github.com/lipex360x/Heaven-Access/issues/1) owns decisions and review. This is a supporting interface specification, not application code or a task tracker. Felipe accepted the product rules and technical defaults described below. No implementation is authorized by this document.

## Accepted baseline

One Next.js/TypeScript application contains the four React screens and server API. PostgreSQL runs through Docker Compose, with SQL-seeded staff accounts and destinations. One authenticated staff/reception role approves, rejects and manually releases access. Visitor fields are name, destination and scheduled date/time; no email or phone. A destination is one seeded company/room option, with a display floor where applicable; separate company/room administration is unnecessary.

The QR is reusable from 30 minutes before through 30 minutes after the scheduled instant, both boundaries inclusive, interpreted in Europe/Dublin. Expiry requires a new request and approval. There is no renewal, replacement, visit editing, occupancy tracking or cross-building blocking in this MVP. Screens refresh automatically through approximately one-second polling.

## Minimal records

| Record | Required information and purpose |
| --- | --- |
| Staff account | ID, username, password hash; a single staff role. Seeded, without account-management UI. |
| Staff session | Random session secret stored as a hash, staff ID, real creation/expiry times. Cookie carries the secret; never use the demo clock for sessions. |
| Destination | ID, company label, room label and optional floor label. Seeded reference data. |
| Visit | ID, visitor name, destination ID, scheduled instant, decision (`pending`, `approved`, `rejected`), decision actor/time, real creation time and notice version and real server acknowledgement time at successful submission. |
| Visitor credentials | Visit ID, separate random visitor-page and QR secrets. The visitor-page capability must never be accepted as an access QR; the QR must never expose the visitor page or visit list. See credential handling below. |
| Access event | ID, visit ID, device ID, method (`qr` or `manual`), real occurrence time, effective visit-validation time, selected destination, manual actor/reason where applicable, and request deduplication key. Store successful unlocks; rejected reads return a result but do not create counted access events. |
| Demo device/settings | One fixed simulated device, selected destination, `unlockedUntil` in real server time, clock offset and revision. No device-management or destination CRUD screens. |

These are logical records, not a requirement for seven separate SQL tables. Keep the physical schema small; credentials can be visit fields. Derive QR access counts from successful QR events instead of maintaining a second counter that could diverge.

Accepted credential handling: use independent unpredictable bearer secrets and never place personal data in the QR. Hash the visitor-page secret for lookup. Keep the reusable random QR payload in server-only visit storage so an authorized visitor-page request can render the same QR after refresh; protect database access and never return that field through general visit queries. This minimal local prototype does not claim that its database contents are encrypted. The visitor-page secret grants only that visit's view. Do not log secrets or include them in staff list responses. A shared private visitor link is simulated delivery, not verified identity; possession/sharing remains a documented limitation.

## Visit and device states

| State exposed to the screen | Meaning / available actions |
| --- | --- |
| `pending` | Awaiting staff decision. No usable QR. Staff may approve/reject while the requested window has not ended. |
| `rejected` | Staff rejected the request. No usable QR; a new request is possible. |
| `approved_early` | Approved, but effective time is before `validFrom`. Show QR and the time it becomes usable; access is denied until then. |
| `approved_valid` | Approved and `validFrom <= effectiveNow <= validUntil`. QR may authorize the selected destination. |
| `expired` | Effective time is after `validUntil`; overrides pending/approved display. No QR access or approval of this old visit; create a new request. |
| `invalid_link` | Visitor capability is missing/unknown. Do not expose visit details. |

Time-derived states do not require background jobs. Calculate them server-side on every relevant read/action. A staff clock rewind is a deliberate scenario replay and may change derived time states; it does not issue a replacement or extend the stored visit window. Visitors cannot change time. In normal forward time an expired QR remains expired, including after a separate new request is approved. State this simulation limitation in the demo; do not present clock replay as production renewal.

Device states are `locked` or `unlocked`, determined by real server time and `unlockedUntil`. Camera denied/unavailable and connection errors are UI feedback, not access authorization. After a connection failure, do not display an unverified new unlock. An already-authorized opening still ends at its known real deadline.

## Minimal screen/API boundary

Paths below define the accepted contract; changing their spelling does not require a new product decision. Use same-origin requests and server-side input validation/authorization. All visit/device responses are dynamic and must not be shared through public caches.

| Request | Caller | Input / output |
| --- | --- | --- |
| `GET /api/destinations` | Public | Seeded ID/label options only. |
| `POST /api/visits` | Public | Name, destination ID, scheduled local date/time and an explicit privacy-notice acknowledgement and displayed notice version; reject missing acknowledgement or an outdated notice version without creating a visit. Return a private visitor-page link; create a pending visit, never automatic approval. |
| `GET /api/visitor/visit` | Visitor capability | Own name, destination label, scheduled time, validity bounds, display state, effective time; QR payload only for an approved, unexpired visit. No other visits, staff information or access logs. |
| `POST /api/staff/login`; `POST /api/staff/logout` | Staff | Credentials to establish a cookie session; logout invalidates it. No session secrets in response JSON. |
| `GET /api/staff/visits` | Staff session | Visit summary/detail data, decision, effective display state, QR access count and separate manual-release count. Never return visitor/QR secrets. |
| `POST /api/staff/visits/:id/decision` | Staff session | `approve` or `reject`; pending requests only, checked atomically. Conflicting/repeated decisions do not issue additional credentials. |
| `GET /api/device` | Staff session | Fixed device ID, configured destination, lock deadline/state, clock mode/effective time and revision. |
| `POST /api/device/scan` | Staff session | Decoded QR secret, expected device revision and unique request ID. Server validates the configured destination and clock; client cannot nominate a different destination/time. Return authorization result and lock deadline. |
| `POST /api/device/manual-release` | Staff session | Selected visit ID, short reason, expected revision and request ID. Explicit manual override with attributable staff actor; keep separate from QR authorization/counts. |
| `PATCH /api/demo/settings` | Staff session | Selected seeded destination and/or effective demo time, or reset to real time. Only available to authenticated demonstration controls; return the new revision. |

Keep the simulator in an authenticated tab using the same seeded staff account. This avoids adding device enrollment, a second role or a device-key administration workflow. The visitor screens remain public/capability-scoped even if the browser also has a staff cookie: visitor endpoints must not escalate to staff data. Protect cookie-authenticated mutations against cross-origin requests; validate authorization at each action rather than relying on hidden UI controls.

The visitor-page secret should be passed in an authorization header for polling, without URL/query logging or third-party referrer exposure. A private link may use a URL fragment read by the visitor UI. The camera parses QR data as data; do not navigate to arbitrary scanned URLs or request external resources.

## Access counting, replay and clock defaults

Accepted technical defaults:

- A successful QR validation opens the simulator for **five real seconds** and creates one QR access event in the same database transaction. It records an authorization, not proof that a person physically passed through.
- While open, further camera frames return `already_unlocked` with the existing deadline. They do not extend the opening or add events. After relocking, require the code to leave the camera view before rearming the scanner; a later deliberate presentation can create a new access.
- A unique request ID makes retrying a timed-out scan/manual action return its earlier result without another event. Serialize device opening decisions in PostgreSQL so two tabs cannot count the same opening twice.
- Manual release is an explicit staff override, including when normal QR access is unavailable. Require a selected visit and reason, and show the decision state/time warning before confirmation. It never approves, renews or changes the visit and never increases its QR count. This does not control real emergency egress.
- The default clock is real time. Staff may set a **global demo clock offset**: the fictional time advances normally from the selected instant, and all screens use the same value. Reset removes the offset. Session expiry, real event timestamps and the five-second opening always use real server time.
- A destination/clock change relocks the simulator and increments its revision. An old scan is rejected as `stale_device_state`, then the client refreshes and waits for a new presentation. Scans and settings changes must be serialized so an in-flight decision cannot unlock the wrong scenario.
- A pending request whose window has ended cannot be approved. Do not silently change its time. Local times in a DST gap or overlap are rejected with a clear correction request rather than guessed; store accepted times as unambiguous instants.
- Poll once per second while visible, with only one in-flight read per screen. Refresh on focus/reconnect and after mutations. Show connection errors and recover from server state; do not create access records from a polling read or a visual state transition.

Use stable result codes: `granted`, `already_unlocked`, `invalid_qr`, `not_approved`, `too_early`, `expired`, `wrong_destination`, `stale_device_state`, `unauthenticated`, `invalid_input` and `conflict`. Unknown/invalid credentials must not disclose another visitor's information. Database/network failures never authorize new QR access.

## Accepted privacy interaction — 13 November 2026

Before submission, show this short purpose summary and a link labelled “Read privacy notice”:

> We use your name, destination and visit time to review your request and manage access. Successful access events are recorded.

Require an initially unchecked checkbox labelled “I have read the privacy notice.” Persist the visit only after an explicit acknowledgement and submission; verify the acknowledgement server-side. Record the displayed notice version and real server acknowledgement time with the visit. This records the interaction, not proof of comprehension or consent as the processing basis.

If the visitor does not continue, create no visit and direct them to reception. Do not promise anonymous entry or imply that manual assistance removes every data requirement. Do not persist unsubmitted visitor details through drafts, analytics or debug logs. The short summary is a first layer, not a complete live-service privacy notice or a compliance claim.

## Review boundaries and evidence

Felipe accepted the credential design, API shape, counting semantics, five-second opening, manual override details and demo clock behaviour on 13 November 2026. This is design acceptance recorded in #1, not evidence of completed implementation or tests.

The visitor interaction above was accepted by Felipe on 13 November 2026. Complete notice wording, lawful-basis analysis, retention/deletion and the detailed assisted-access procedure remain under #3. Do not preselect a legal basis, retention period or compliance claim. Use synthetic visitors for the prototype. Nothing is persisted from an unsubmitted public form; registration persists only after the required interaction is completed and submitted. Do not store camera footage.

Verification under #11 should demonstrate both inclusive time boundaries and outside them, pending/rejected denial, wrong destination, repeated deliberate access, duplicate/concurrent scans and request retries, five-second relock, manual-event separation, unauthorized settings changes, clock revision races, polling recovery and visitor data isolation. These are acceptance scenarios, not claims of tests already executed.

This specification does not introduce a separate visitor identity registry, AI, biometrics, hardware integration, email service, analytics dashboard or cross-company restriction sharing.
