# Browser integration checks

`tests/browser-flow.test.mjs` is a maintained end-to-end integration test. Node's test runner coordinates the `web-view` CLI, Chrome, the real HTTP API and PostgreSQL. It asserts observed outcomes and exits unsuccessfully if an expectation or cleanup fails. It does not use Playwright or add browser automation dependencies to the application.

The request is prepared through the public API. Approval and revocation use the actual reception UI; the visitor page updates without reloading. A synthetic video stream passes through the application's real QR decoder, server authorization and shared display. Assertions cover authentication, absent scenario/manual controls in the dedicated reader, pending-without-QR, approval/QR appearance, one opening from continuous frames, automatic relock, mobile overflow/control visibility, initially unchecked revocation confirmation, QR removal, saved-image refusal, preserved approval, revocation actor/time and unchanged access count after refusal.

This is not a physical camera/permission test or a test of typing into the registration form. Native phone/tablet checks remain separate. The main unit and API suites also remain separate.

## Local execution

Follow the machine/readiness instructions in AGENTS.md. With the pinned runtime, initialized local database (including migration 005), `web-view` installed and application running, start a **dedicated** visible Chrome profile:

```sh
web-view start --port 9336 --user-data-dir /tmp/heaven-access-browser-tests
TEST_CDP_PORT=9336 npm run test:browser
```

On PowerShell, set `$env:TEST_CDP_PORT = '9336'` before `npm run test:browser`. If the CLI is not on PATH, set `WEB_VIEW_BIN` to its actual executable path. `TEST_BASE_URL` defaults to `http://127.0.0.1:3000`; it must be an origin without a trailing slash or path. The npm command loads the existing local `.env` without printing credentials. The port must identify a fresh test browser profile without an existing application staff session. Do not use a personal browser or a browser participating in a demonstration.

Run this suite sequentially, without another demonstration or integration suite using the same device. It uses the current destination/effective clock and does not change clock or scenario settings. It deliberately opens the simulated device for eight real seconds, then observes relock. Existing visitor data and unrelated browser tabs are preserved. Unique temporary staff/visitor records and their sessions, access events and scan-request records are removed in `finally`; only tabs tagged for that execution are closed. Chrome itself remains open and can be stopped with `web-view stop --port 9336` when finished.

The unique temporary account is created in the configured database and signed in through the UI before creating a visit. This verifies that the application and database target match. It avoids the published seed account and never prints passwords, pass capabilities or QR payloads. If a process is forcibly killed, `finally` cannot run; inspect the exact `browser-test-…` / `Browser QA …` fixture before removing anything. Never reset the database as cleanup.

## Explicit hosted execution

The default test rejects remote targets. An authorized hosted check requires all of the following: the exact stable HTTPS prototype origin, `TEST_ALLOW_HOSTED_BROWSER=1`, a dedicated fresh test browser and a privately loaded matching Neon database connection. Prefer the unpooled administrative URL; the test reads `DATABASE_URL_UNPOOLED` before `DATABASE_URL`.

For example, after obtaining the existing provider-managed variables into an ignored, permission-restricted file:

```sh
TEST_CDP_PORT=9336 TEST_BASE_URL=https://heaven-access.vercel.app TEST_ALLOW_HOSTED_BROWSER=1 \
  node --env-file=.vercel/production.env.local --test tests/browser-flow.test.mjs
```

Do not overwrite the local Docker `.env`, commit the provider variables or connect a preview deployment to production merely for this test. Delete the temporary pulled environment file after the authorized run. The suite changes only its own fictional records and the ordinary simulated opening; it does not reset the hosted database or demo clock. Record the actual results and physical-camera limitations in issue #11.
