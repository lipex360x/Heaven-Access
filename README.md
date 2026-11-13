# Heaven Access

A visitor-access MVP for managing visit requests and time-limited access to authorized destinations.

Visitors request a visit through a public form. Authorized staff approve it, a mobile-first page displays a time-limited QR pass, and a simulated elevator/gate validates access. A receptionist can grant manual access when appropriate. Open screens update automatically through approximately one-second polling; validation and unlocking are decided by the server.

## Current status

Planning and research only. Application implementation has not started and requires explicit authorization. The architecture and core visitor rules have been agreed in issue #1.

- Confirmed: PostgreSQL, local Docker Compose, and SQL initialization of schema, staff accounts, and departments/destinations.
- No reference-data administration screens are planned.
- Selected architecture: one Next.js application with TypeScript, React screens and server API routes; no separate backend or monorepo. Staff sessions use cookies and server-side authorization. Runtime/package versions remain to be pinned.
- Main demonstration: separate browser tabs on localhost. Additional devices may connect through the same Wi-Fi using the host's LAN address.
- Real elevator/gate hardware and real email delivery are outside the current prototype requirement.

## Repository structure

```text
.
├── AGENTS.md
├── README.md
└── docs/
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

Supporting documents live in `docs/`; orientation and agent instructions remain at the root. The application structure will be added when implementation is authorized. No application setup or run commands are available yet.

## Project documents

| Document | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Durable context and working instructions |
| [environment-setup.md](docs/environment-setup.md) | Initial agent prompt for macOS/Windows readiness and shared tool versions |
| [design.md](docs/design.md) | Low-fidelity screen wireframes |
| [flow.md](docs/flow.md) | Visitor journey overview and detailed flowchart |
| [data-state-contract.md](docs/data-state-contract.md) | Accepted records, screen/API boundaries, access counts and demonstration controls |
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
