# Heaven Access

A visitor-access MVP being planned for the CCT College Dublin Project Skills & Professionalism assessment.

Visitors request a visit through a public form. Authorized staff approve it, a mobile-first page displays a time-limited QR pass, and a simulated elevator/gate validates access. A receptionist can grant manual access when appropriate. Changes must propagate between open screens in real time.

## Current status

Planning and research only. Application implementation has not started and requires explicit authorization after the remaining scope and architecture decisions are discussed.

- Confirmed: PostgreSQL, local Docker Compose, and SQL initialization of schema, staff accounts, and departments/destinations.
- No reference-data administration screens are planned.
- Architecture remains open: the initial Bun/Vite+/monorepo approach will be compared with simpler Next.js or React-based options.
- Main demonstration: separate browser tabs on localhost. Additional devices may connect through the same Wi-Fi using the host's LAN address.
- Real elevator/gate hardware and real email delivery are outside the current prototype requirement.

## Project documents

| Document | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Durable context and working instructions |
| [design.md](docs/design.md) | Preliminary screen flow and low-fidelity wireframes |
| [references.md](docs/references.md) | Incident evidence, report summary, and draft Harvard references |
| [brief.pdf](docs/brief.pdf) | Original assessment brief |

## Source of Truth

[GitHub issues](https://github.com/lipex360x/Heaven-Access/issues) are the **Source of Truth (SoT)** for scope, requirements decisions, tasks, dependencies, acceptance criteria, and progress. The previous `todo.md` and `planning.md` have been migrated into issues and removed to avoid parallel tracking.

Local Markdown files contain supporting research/design and working instructions. Link them from relevant issues; keep actionable status and decisions in GitHub. Creating an implementation issue does not authorize starting development.

## Assessment target

Submission: **15 November 2026 at 23:59 via Moodle**. Group presentation: **12 minutes maximum, including the prototype demo**, followed by individual Q&A. A supporting report and planning artifacts are also requested by the project team.

All visitor data used in development and demonstrations should be synthetic. Evidence must distinguish observed incidents, inferred risks, and the prototype's actual capabilities.
