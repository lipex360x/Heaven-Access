# Heaven Access

A visitor-access MVP for managing visit requests and time-limited access to authorized destinations.

Visitors request a visit through a public form. Authorized staff approve it, a mobile-first page displays a time-limited QR pass, and a simulated elevator/gate validates access. A receptionist can grant manual access when appropriate. Open screens update automatically through approximately one-second polling; validation and unlocking are decided by the server.

## Current status

The local foundation, visitor/staff API and authenticated camera/device simulator are implemented. Public registration, staff approval and mobile-pass screens remain to be connected. Architecture and core visitor rules are defined in the accepted contract; the [API handoff](docs/api.md) describes the implemented endpoints. Current validation evidence and remaining integrated-camera checks belong in issues #9/#11.

- Confirmed: PostgreSQL, local Docker Compose, and SQL initialization of schema, staff accounts, and departments/destinations.
- No reference-data administration screens are planned.
- Selected architecture: one Next.js application with TypeScript, React screens and server API routes; no separate backend or monorepo. Planned staff sessions use cookies and server-side authorization.
- Main demonstration: separate browser tabs on localhost. Additional devices may connect through the same Wi-Fi using the host's LAN address.
- Real elevator/gate hardware and real email delivery are outside the current prototype requirement.

## Repository structure

```text
.
├── AGENTS.md
├── README.md
├── mise.toml
├── package.json
├── package-lock.json
├── compose.yaml
├── database/init/
├── scripts/
├── src/app/
├── src/domain/
├── src/server/
├── tests/
└── docs/
    ├── api.md
    ├── brief.pdf
    ├── briefings/
    ├── data-state-contract.md
    ├── design.md
    ├── environment-setup.md
    ├── flow.md
    ├── future-improvements.md
    ├── references.md
    ├── team.md
    └── work-allocation.md
```

Supporting documents live in `docs/`; orientation and agent instructions remain at the root. The application and server routes share `src/app`; server-only database code lives in `src/server`.

## Local setup

Requirements: mise-managed Node **24.16.0**, npm **11.13.0**, and a working Docker engine with Compose. Bun is not required. Next.js/React and all dependencies are locked in `package-lock.json`; PostgreSQL uses `17.12-bookworm` pinned to an image digest. Biome provides lint/format checks and TypeScript checks types. Use synthetic data only.

```sh
mise trust mise.toml
mise install
node --version
npm --version
cp .env.example .env
npm ci
npm run db:up
npm run dev
```

Inspect `mise.toml` before trusting it; it selects only the project Node version. Do not overwrite an existing `.env`. If mise is not active in your shell, use `mise exec -- npm ci` and `mise exec -- npm run dev`. The committed Node distribution includes the selected npm version. Keep `.env` private and keep its `DATABASE_URL` consistent with the database settings if you change them.

Open [localhost:3000](http://localhost:3000). The initial page is a placeholder; the authenticated [device simulator](http://localhost:3000/device) is available. [The readiness endpoint](http://localhost:3000/api/health) returns `200` only when the initialized destination table is reachable, otherwise `503`. It exposes no credentials or visitor data. Destination, visit request, private-pass and authenticated staff API routes are available; see [request/response shapes and UI states](docs/api.md). Registration/approval/pass forms are still pending.

PostgreSQL binds only to `127.0.0.1:54329`, avoiding the usual host PostgreSQL port. Initialization SQL runs on the first empty project volume and seeds three fictional destinations plus the local-demo account `reception` / `HeavenDemo-2026!` with a scrypt hash. These published credentials are demonstration fixtures; sign in at `/device`. The local database account owns the database; this is not a production deployment configuration. For an existing foundation volume, use the additive migrations in [the API handoff](docs/api.md#updating-an-existing-local-database) instead of resetting its data.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Stop the application with Ctrl+C. `npm run db:down` stops PostgreSQL while preserving its data. To deliberately delete **all local project database data** and rerun the schema/seed, stop the app and run:

```sh
npm run db:reset -- --confirm
```

The reset command refuses to proceed without `--confirm`. It removes only this Compose project's volume. Schema/seed changes do not run automatically against an existing volume; reset is intended only for disposable local demonstration data.

`npm test` checks Dublin time parsing, visit-window boundaries and scanner rearming. `npm run test:api` and `npm run test:device` exercise the local API/database with synthetic fixtures; run them sequentially, only when another demonstration is not using the shared clock/device. Both refuse remote database/server targets and clean their own fixtures. See [verification details](docs/api.md#verification).

## Camera and additional devices

The development server binds to loopback by default. A camera on the same computer can use localhost at `/device`. Start the camera explicitly and allow browser access. QR decoding stays in the browser; frames are not recorded or uploaded. Keep a used QR out of view briefly before presenting it again. A phone displaying the visitor QR can be scanned by the computer camera; the phone does not itself need camera permission for that role.

For another device to connect, both devices must be reachable through the hotspot/Wi-Fi and the server must explicitly listen on a reachable interface, for example `npm run dev -- --hostname 0.0.0.0`. Set `DEV_ALLOWED_HOSTS` in `.env` to the computer's current LAN IP (hostname only, no scheme/port) so Next.js permits development assets from that host. Its address is the **computer's LAN address**, not the phone's localhost. This exposes the demo application to that network, while PostgreSQL remains loopback-only. Do not expose this setup to the public internet.

If the phone itself will scan QR codes, camera access normally requires a trusted HTTPS origin; plain HTTP on a LAN IP is insufficient. Hotspot internet access alone proves neither device-to-device reachability nor browser camera availability. The HTTPS method, camera permission and actual QR scan must be verified separately. See [browser camera requirements](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#privacy_and_security). No tunnel or public deployment is configured by this foundation.

## Project documents

| Document | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Durable context and working instructions |
| [environment-setup.md](docs/environment-setup.md) | Initial agent prompt for macOS/Windows readiness and shared tool versions |
| [design.md](docs/design.md) | Low-fidelity screen wireframes |
| [flow.md](docs/flow.md) | Visitor journey overview and detailed flowchart |
| [data-state-contract.md](docs/data-state-contract.md) | Accepted records, screen/API boundaries, access counts and demonstration controls |
| [api.md](docs/api.md) | Implemented visitor/staff endpoints, UI-state handoff, additive database migration and API tests |
| [future-improvements.md](docs/future-improvements.md) | Future options and their benefits, risks, and limitations |
| [references.md](docs/references.md) | Incident evidence, report summary, and draft Harvard references |
| [brief.pdf](docs/brief.pdf) | Original assessment brief |
| [Speaker briefings](docs/briefings/README.md) | Four synchronized rehearsal documents and their shared generator |

## Source of Truth

[GitHub issues](https://github.com/lipex360x/Heaven-Access/issues) are the **Source of Truth (SoT)** for scope, requirements decisions, tasks, dependencies, acceptance criteria, and progress. The previous `todo.md` and `planning.md` have been migrated into issues and removed to avoid parallel tracking.

Use the [team execution board](https://github.com/users/lipex360x/projects/19/views/2) to follow `Backlog → In Progress → Testing → Done`. Cards are sorted by `Execution Order`; primary ownership uses `owner:dani`, `owner:bella`, `owner:cris`, or `owner:felipe`. Shared collaboration and review conventions are documented in [AGENTS.md](AGENTS.md#shared-github-workflow).

Local Markdown files contain supporting research/design and working instructions. Link them from relevant issues; keep actionable status and decisions in GitHub. Creating an implementation issue does not authorize starting development.

Each active issue includes a copyable **Agent handoff prompt** for ChatGPT/Claude. Use it to establish task-specific context or refresh an existing conversation incrementally; language and conversation style are optional preferences.

For a new machine, start with the [environment onboarding prompt](docs/environment-setup.md#copyable-initial-prompt), then use the prompt in your issue. It checks tools and repository access before suggesting installations; application startup remains dependent on the committed run instructions once implementation exists.

Start with [MVP decisions and local setup (#1)](https://github.com/lipex360x/Heaven-Access/issues/1). The board groups the remaining work into focused team workstreams covering interfaces, access validation, privacy, verification, and supporting materials.
