# Heaven Access — Visitor API Handoff

The accepted product/state rules remain in [the contract](data-state-contract.md) and [issue #1](https://github.com/lipex360x/Heaven-Access/issues/1). This document describes the implemented API boundary for the operational forms (#5) and mobile pass (#8), without transferring their UI ownership. The device API and real QR scanning remain #9.

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
  "noticeVersion": "demo-2026-11-13"
}
```

Names are trimmed and limited to 100 characters; control characters are rejected. Date/time is local **Europe/Dublin**, without a zone or offset. Seconds and millisecond precision are optional; the normal `datetime-local` minute value works. Invalid dates and ambiguous/nonexistent DST times return `400`, rather than being shifted silently. The server creates a pending visit and records real acknowledgement time only after valid submission. No email/phone is required.

Success (`201`) returns `{ visitId, visitorPath, decision: "pending" }`. Navigate to the returned relative `visitorPath`, such as `/pass#<private-capability>`. The `/pass` UI is a separate deliverable; it is not implemented by these endpoints. Do not log or put this path in shared staff lists.

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
| `approved_early` | Render `qrPayload`, explain when access becomes valid. |
| `approved_valid` | Render `qrPayload` and the inclusive window. |
| `expired` | No QR; direct to a new request. |
| `invalid_link` error | No visit details; unavailable-link view. |

Only approved, unexpired responses contain `qrPayload`. It is an independent random secret, not the visitor-page capability or personal data. Repeated reads preserve the same QR. Treat it as data to encode, not a URL to open. QR rendering/decoding and physical passage are not verified by these endpoints.

## Staff interface

- `POST /api/staff/login`: `{ username, password }` → `{ staff: { id, username } }` and an HttpOnly, SameSite=Lax session cookie; Secure on HTTPS. The SQL-seeded local fixture is documented in README. An eight-hour session uses real server time, independent of the demo clock. A new login rotates the current session.
- `GET /api/staff/session`: current `{ staff }`, or `401`. Use it to initialize the sign-in screen without persisting a client-side auth flag.
- `POST /api/staff/logout`: invalidates the current database session and clears its cookie; returns `{ signedOut: true }`.
- `GET /api/staff/visits`: `{ visits: [...] }`, newest 200 records. Each record includes the common visitor fields above (without `qrPayload`), `decision`, `createdAt`, nullable `decidedAt`/`decisionBy`, `qrAccessCount` and `manualReleaseCount`. No visitor or QR secrets are returned. These are recorded authorizations, not a measured count of people physically inside.
- `POST /api/staff/visits/:id/decision`: `{ decision: "approve" }` or `{ decision: "reject" }` → `{ visitId, decision: "approved" | "rejected" }`. Only pending, unexpired requests can change. Concurrent or repeated decisions return one success and then `409`, without regenerating QR credentials.

The SQL device/settings row already supplies a shared effective clock for visit states. No browser is allowed to send its own effective time in a visit/decision request. Public demo-clock controls, scanning, manual-release actions and polling components are not implemented here. Staff UI should refresh after mutations; use the accepted approximately one-second visible-page polling pattern when implementing its components.

## Updating an existing local database

New empty Compose volumes run all files in `database/init` automatically. To preserve an existing foundation database, apply only the additive migration:

```sh
docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1 < database/init/003-visits.sql
```

Use the configured user/database names if different. The migration is transactional and can be reapplied without deleting records. `npm run db:reset -- --confirm` remains an intentional destructive reset for disposable local data, not an automatic migration step.

## Verification

```sh
npm test
# With the local database initialized and the app running:
npm run test:api
```

Integration tests refuse a remote database/server. They create a temporary synthetic staff account/visits, exercise actual HTTP and PostgreSQL behavior, temporarily set the shared clock, then remove their fixtures and restore the original offset. Run them without another demonstration in progress. They verify session/capability separation, notice validation, invalid input, approval races, rejection/expiry, QR/manual summary separation and logout/real-time session expiry. Seeded access events in tests are summary fixtures, not evidence of working device unlocks. Unit tests cover DST rejection and inclusive millisecond boundaries.

Online delivery uses the accepted Vercel + Neon route; provisioning and deployment checks are still separate. This local API implementation does not establish public-deployment readiness, a complete privacy notice, working screens or a tested camera scan.
