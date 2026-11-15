# Heaven Access — Visitor API Handoff

The accepted product/state rules remain in [the contract](data-state-contract.md) and [issue #1](https://github.com/lipex360x/Heaven-Access/issues/1). This document describes the implemented visitor/staff and device API boundaries for the operational forms (#5), mobile pass (#8) and simulator (#9). Consult #11 for actual verification evidence; an implemented endpoint is not proof of a real camera scan.

## Requests and errors

Use same-origin `fetch`. Send JSON mutations with `Content-Type: application/json`; the browser supplies `Origin`. Cross-origin or missing-origin mutations are rejected with `403`. Cookie authentication is checked server-side on every staff request. There are no public CORS permissions. Bodies are limited to 8 KiB and unexpected fields are rejected.

All implemented JSON responses use `Cache-Control: no-store` and `Referrer-Policy: no-referrer`. Failure shape:

```json
{ "code": "invalid_input", "message": "Check the name, destination, date/time and privacy acknowledgement." }
```

| Status | Code | UI handling |
| --- | --- | --- |
| 400 / 413 / 415 | `invalid_input` | Correct fields, body size or JSON content type; keep edits only in form memory. |
| 401 | `unauthenticated` | Show sign-in; do not render staff records. |
| 403 | `forbidden` | Submit from this application's own page. |
| 404 | `invalid_link` | Show an unavailable visitor link, without visit details. |
| 404 | `invalid_input` | Staff-selected visit does not exist. |
| 409 | `conflict` / `expired` | Refresh server state; a new request is required after expiry. |
| 503 | `unavailable` | Show connection/service failure and retry a read; do not assume an action succeeded. |

## Visitor request

`GET /api/destinations` returns `{ destinations: [{ id, companyLabel, roomLabel, floorLabel }] }`. IDs are numbers; `floorLabel` may be null. Never accept a destination label in place of the seeded ID.

Import the demonstration notice constants from `src/domain/privacy.ts`. Show the accepted summary, notice link and initially unchecked acknowledgement before submission. The complete notice remains under #3; a required acknowledgement is not a lawful basis or compliance declaration. Change its version when the displayed notice changes. Do not store drafts or log form contents.

`POST /api/visits`:

```json
{
  "visitorName": "Example Visitor",
  "destinationId": 1,
  "scheduledLocal": "2026-11-13T12:00",
  "privacyAcknowledged": true,
  "noticeVersion": "demo-2026-11-14"
}
```

Names are trimmed and limited to 100 characters; control characters are rejected. Date/time is local **Europe/Dublin**, without a zone or offset. Seconds and millisecond precision are optional; the normal `datetime-local` minute value works. Invalid dates and ambiguous/nonexistent DST times return `400`, rather than being shifted silently. The server creates a pending visit and records real acknowledgement time only after valid submission. No email/phone is required.

Success (`201`) returns `{ visitId, visitorPath, decision: "pending" }`. Navigate to the returned relative `visitorPath`, such as `/pass#<private-capability>`. The implemented `/pass` page reads the fragment, polls only the capability-scoped endpoint and displays the current state. Approved, unexpired responses render the QR locally and offer a PNG download; saved images do not bypass server expiry. Do not log or put this path in shared staff lists.

## Private visitor page

Read the capability from the URL fragment in the browser. Poll `GET /api/visitor/visit` using `Authorization: Bearer <capability>`. Keep the secret out of query strings, analytics, referrers and logs. The visitor endpoint never uses a staff cookie to grant additional access.

Success returns `{ visit }`, where `visit` contains:

```json
{
  "id": "00000000-0000-4000-8000-000000000001",
  "visitorName": "Example Visitor",
  "destination": { "id": 1, "companyLabel": "Example Studio", "roomLabel": "Reception", "floorLabel": "2" },
  "scheduledAt": "2026-11-13T12:00:00.000Z",
  "validFrom": "2026-11-13T11:30:00.000Z",
  "validUntil": "2026-11-13T12:30:00.000Z",
  "state": "pending",
  "effectiveNow": "2026-11-13T12:00:00.000Z"
}
```

This is an illustrative fixture, not an assessment result. Format instants for display using `Europe/Dublin`; do not use the phone's timezone as the authority.

| State | Pass-page behavior |
| --- | --- |
| `pending` | Await approval; no `qrPayload` field. |
| `rejected` | Show rejection; no QR. |
| `revoked` | Show revocation; no QR, including after clock replay. |
| `approved_early` | Render `qrPayload`, explain when access becomes valid. |
| `approved_valid` | Render `qrPayload` and the inclusive window. |
| `expired` | No QR; direct to a new request. |
| `invalid_link` error | No visit details; unavailable-link view. |

Only approved, unexpired responses contain `qrPayload`. It is an independent random secret, not the visitor-page capability or personal data. Repeated reads preserve the same QR. Treat it as data to encode, not a URL to open. QR rendering/decoding and physical passage are not verified by these endpoints.

## Staff interface

- `POST /api/staff/login`: `{ username, password }` → `{ staff: { id, username } }` and an HttpOnly, SameSite=Lax session cookie; Secure on HTTPS. The SQL-seeded local fixture is documented in README. An eight-hour session uses real server time, independent of the demo clock. A new login rotates the current session.
- `GET /api/staff/session`: current `{ staff }`, or `401`. Use it to initialize the sign-in screen without persisting a client-side auth flag.
- `POST /api/staff/logout`: invalidates the current database session and clears its cookie; returns `{ signedOut: true }`.
- `GET /api/staff/visits`: `{ visits: [...] }`, newest 200 records. Each record includes the common visitor fields above (without `qrPayload`), `decision`, `createdAt`, nullable `decidedAt`/`decisionBy` and `revokedAt`/`revokedBy`, `qrAccessCount` and `manualReleaseCount`. No visitor or QR secrets are returned. These are recorded authorizations, not a measured count of people physically inside.
- `POST /api/staff/visits/:id/decision`: `{ decision: "approve" }` or `{ decision: "reject" }` → `{ visitId, decision: "approved" | "rejected" }`. Only pending, unexpired requests can change. Concurrent or repeated decisions return one success and then `409`, without regenerating QR credentials.

`POST /api/staff/visits/:id/revoke` accepts `{}` and returns `{ visitId, decision: "revoked" }`. Only previously approved visits can be revoked; others return `409`. Reception requires confirmation. The stored approval/QR/access history is preserved, with separate real `revoked_at`/`revoked_by` audit fields. The effective API decision becomes `revoked`; the visitor page removes the QR and saved images receive a `revoked` scan result. Repeated revocation preserves the first actor/time. Revocation serializes with scans, prevents future QR unlocks and leaves an already granted opening at its original deadline. A deliberate manual override remains separate and never restores QR access. A new request is required for approval again.

The shared device/settings row supplies the effective clock for visit states. No browser is allowed to send its own effective time in a visit/decision request. Staff UI should refresh after mutations. `src/client/use-polling.ts` supplies visible-page polling, one in-flight sequential loader and focus/reconnect refresh; the device screen uses it and the other screens can reuse it.

## Authenticated device simulator

`/device/reader` is the dedicated authenticated camera page for a second phone: rear-camera preference, prominent grant/denial feedback and retry of uncertain readings. It polls only the shared device and sends decoded QR data; it has no scenario/manual controls or visitor list. Use trusted HTTPS on a phone, grant permission explicitly, and keep that page visible. The other phone displays the visitor pass and the tablet uses `/device/display`.

`/device` provides staff sign-in, camera scanning, gate status, scenario controls and explicit assisted manual release. `/device/display` is a clean, authenticated view of the same device for a separate tablet/tab, with Gate/Elevator visualization modes (`?mode=elevator` selects the latter initially). Hinge/door animations last 650 ms and respect reduced-motion preferences; they visualize the existing server deadline and do not add separate devices, travel simulation or hardware control. These endpoints all require the staff cookie; mutations also require same-origin requests and JSON. Polling reads never open the gate or add events.

- `GET /api/device` → `{ device, feedback }`: device has `id`, `destination`, `revision`, `state` (`locked`/`unlocked`), `unlockedUntil`, `serverNow`, `effectiveNow`, and `clockMode` (`real`/`demo`). `feedback` is null or `{ code, occurredAt }` for the most recent actual authorization outcome in the current scenario, visible for eight real seconds. It includes no visitor information or credential. Duplicate/stale reads do not replace it; changing scenario clears it. Both screens display prominent authorization/denial and return to locked after the real deadline. All timestamps are UTC instants; display the clock in Europe/Dublin.
- `POST /api/device/scan`: `{ qrPayload, expectedRevision, requestId }` → `{ code, device }`. `requestId` is a fresh UUID v4 for each deliberate presentation. Send decoded data, never navigate to it. The server uses its own configured destination/time. Access codes: `granted`, `already_unlocked`, `invalid_qr`, `not_approved`, `revoked`, `too_early`, `expired`, `wrong_destination`, `stale_device_state`. Denied authorizations use HTTP 200 with a result code; malformed inputs/authentication still use the HTTP errors above.
- `POST /api/device/manual-release`: `{ visitId, reason, expectedRevision, requestId }` → `{ code, device }`. A selected visit and trimmed 1–200-character reason are required. An explicit override may release an expired/pending/rejected/revoked visit; it never changes that visit's decision, time or QR count. The UI shows the visit state/destination and requires confirmation. The event records the authenticated actor and actual device destination.
- `PATCH /api/demo/settings`: `{ expectedRevision, destinationId?, effectiveLocal?, resetClock? }` → `{ device }`. Include at least one setting. `effectiveLocal` uses the same strict Europe/Dublin parser as registration; `resetClock: true` is mutually exclusive with it. Clock/destination changes relock, increment revision and serialize with access/approval operations. Stale settings return HTTP 409; stale scans return the result code without opening. Clock rewinds explicitly replay time-derived states, without changing stored visit windows.

Each opening and successful access event commit atomically under the shared PostgreSQL device lock. The deadline is eight real seconds; repeated frames while open do not extend it or add an event. QR/manual counts remain separate. The camera latch requires three clear decoded frames while locked before rearming after a presentation; a continuously visible QR cannot reopen the gate after its deadline. Scenario changes also require a fresh presentation. Camera frames remain local in memory, without uploads or recording.

Retry a timed-out scan/manual action with **exactly the same request ID and body**. `device_requests` stores hashed input identity and the original result, including denied/duplicate outcomes; those records are not counted access events. Reusing an ID for different input/actor returns 409. A replayed success is historical: it does not extend/reopen the gate. Refresh `GET /api/device` for the current state. The simulator retains an uncertain action for explicit retry and derives countdowns from server time plus a monotonic browser deadline, independent of the fictional clock.

## Updating an existing local database

New empty Compose volumes run all files in `database/init` automatically. To preserve an existing foundation database, apply only the additive migration:

```sh
docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1 < database/init/003-visits.sql
docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1 < database/init/004-device-requests.sql
docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1 < database/init/005-revocation.sql
```

Use the configured user/database names if different. The migration is transactional and can be reapplied without deleting records. `npm run db:reset -- --confirm` remains an intentional destructive reset for disposable local data, not an automatic migration step.

## Verification

```sh
npm test
# With the local database initialized and the app running:
npm run test:api
npm run test:device
```

Integration tests refuse a remote database/server. They create a temporary synthetic staff account/visits, exercise actual HTTP and PostgreSQL behavior, temporarily set the shared clock, then remove their fixtures and restore the original offset. Run them without another demonstration in progress. They verify session/capability separation, notice validation, invalid input, approval races, rejection/expiry, QR/manual summary separation and logout/real-time session expiry. Seeded access events in tests are summary fixtures, not evidence of working device unlocks. Unit tests cover DST rejection and inclusive millisecond boundaries.

Run the two integration suites sequentially. Device checks exercise real HTTP/PostgreSQL authorization, concurrent/retried opens, real eight-second relocking, denied scans, revision races, manual-event separation and demo/session clock separation. They restore the original device configuration and remove their own fixtures. Unit checks also cover continuous-frame suppression and scanner rearming. Browser verification with a synthetic video stream is distinct from a physical camera scan; record both accurately in #11.

## Registration and reception screens

`/register` uses the seeded destinations and requires the initially unchecked acknowledgement. `/privacy` explains actual prototype processing; notice revision `demo-2026-11-14` replaces the earlier summary-only revision. This is a demonstration notice, not an approved live-service policy. Submission navigates to the returned private pass; no form drafts are saved. A failed/unknown submission outcome warns that a request may already exist and disables resubmission until reception can assist, rather than silently retrying and duplicating a visit.

`/staff` reuses the sign-in component and polls its session, latest 200 visits and current device sequentially. Cards show decision/time-derived state, destination/time, QR count and separate manual count. Pending, unexpired requests offer approve/reject. Assisted override requires a reason and confirmation showing the visit state and actual device destination; uncertain manual outcomes retain their exact request ID for retry. Expired/rejected/revoked visitor pages link back to a new request. A connection error pauses staff actions until server state recovers.

Client request IDs use `crypto.randomUUID` on secure origins and cryptographic `getRandomValues` UUID-v4 generation for LAN HTTP, where `randomUUID` may be unavailable. This does not make an insecure camera origin usable; camera access still requires localhost or trusted HTTPS.

Online delivery uses the accepted Vercel + Neon route; provisioning and deployment checks are still separate. The prototype notice does not establish live-deployment legal basis/retention or compliance. Consult #11 for the distinction between synthetic-stream tests, user-reported physical QR reads and successful live-opening evidence.
