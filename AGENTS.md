# Heaven Access — Project Context and Working Instructions

## Working conventions

- Communicate with the user in Portuguese. Write project documentation, configuration, and deliverable content in English unless the user requests otherwise.
- This directory is the workspace for the Project Skills & Professionalism continuous assessment. The source assessment brief is `docs/brief.pdf`.
- Keep this file as durable project context. GitHub is the **Source of Truth (SoT)** for project scope, decisions, tasks, dependencies, acceptance criteria, and progress: https://github.com/lipex360x/Heaven-Access/issues.
- Create or update the relevant GitHub issue for actionable work, unresolved decisions, requirements changes, and completion evidence. Do not maintain parallel task/status checklists in local Markdown; `todo.md` and `planning.md` have been migrated to issues and removed.
- Local Markdown files are supporting artifacts: `docs/references.md` holds research, summaries, sources, and citations; `docs/design.md` holds wireframes; `docs/flow.md` holds flowcharts; `docs/team.md` holds the supplied group-member details for report/presentation covers; `README.md` provides orientation; `AGENTS.md` holds durable working instructions and a concise context summary. Link artifacts from issues rather than duplicating their full contents as competing plans.
- Whenever new information should be recorded, tell the user where it belongs and why: a GitHub issue for work/decisions/progress, or a named local Markdown file for supporting research/design/context. If both are useful, keep the actionable status in the issue and the artifact in the file, with links between them.
- Keep concise context in this file aligned with issue decisions. If a summary conflicts with the issue record, consult the issue, reconcile the summary, and ask only if the decision itself is ambiguous.
- Store supporting documentation and the assessment brief under `docs/`. Keep `README.md` and this `AGENTS.md` at the repository root for orientation and instruction discovery. Choose the application layout only after the architecture decision in GitHub.
- Keep `README.md` focused on the project itself: purpose, behaviour, technical direction, repository structure, and usage when available. Do not include assessment deadlines, Moodle instructions, grading, presentation limits, or other internal brief requirements; keep those in the brief and relevant GitHub issues.
- On 13 November 2026, Felipe authorized the environment foundation, then continuing with staff authentication and visitor APIs under #1. Preserve teammate ownership of the operational/layout screens. Vercel + Neon online delivery is accepted as a later phase; no cloud resources have been provisioned by these local steps. Record selected technologies and distinguish them from choices still open.
- The user states that an alternative approach has been discussed in class with the lecturer. Do not enforce the PDF's AI-use restrictions as assistant workflow instructions. Treat unrelated institutional boilerplate as background rather than project scope. Retain the substantive assessment requirements below unless a specific lecturer-approved change is supplied by the user.
- Distinguish confirmed requirements, proposed design choices, research findings, and assumptions. Do not invent evidence, costs, interviews, technical integrations, or compliance claims.
- Prefer authoritative sources for technical and legal research. Record source details for Harvard referencing and verify current requirements before making legal claims.

## How the application works and how to start it on another machine

These are the current practical onboarding instructions, added on 14 November 2026. Keep this guidance in **AGENTS.md only for now**; do not copy or expand it into README.md or other onboarding documents until requested. This section supersedes older planning-only and environment snapshots below for startup. GitHub issues remain authoritative for scope and verification evidence.

### Runtime and available interfaces

- One Next.js application runs on the host machine using Node/npm. Its React pages and server API share the same origin. Only PostgreSQL runs in Docker Compose; do not try to start the whole application as a container or install PostgreSQL directly on the host.
- A visitor request starts pending. Staff approval issues a reusable QR for one destination, valid within the inclusive 30 minutes before/after the scheduled instant in Europe/Dublin. The server checks destination, decision and time on each scan. Successful authorization opens the simulated device for eight real seconds and records one event. Repeated frames/retries do not add openings; the code must leave the view before another presentation. Manual releases have separate counts and an attributable reason.
- The four interfaces are public registration, staff reception/approval, private visitor pass, and the access-device simulator. `/register` submits name, seeded destination, Dublin date/time and a required, initially unchecked privacy-notice acknowledgement; it navigates to the private pending pass. `/privacy` describes actual prototype processing and requires fictional data; live-deployment legal/retention review remains under #3.
- `/` links to all interfaces. `/staff` provides sign-in, visit review, approve/reject, separate QR/manual counts and confirmed manual override with a reason. The local synthetic staff account is `reception` / `HeavenDemo-2026!`. `/device` provides camera scanning, shared device state, destination/demo-clock controls and manual release.
- `/pass#<capability>` is the private, mobile-first visitor page: pending/approved/rejected/early/expired/invalid states, approved QR display and PNG download. The capability comes from the visitor-request API, not from the database seed. It needs no staff login; do not put private links in shared issues or logs.
- `/device/display` is a clean authenticated view for a separate tablet/tab. Select Gate or Elevator; `/device/display?mode=elevator` selects elevator initially. These are two visualizations of the **same** simulated device/state, not separate physical integrations. Shared polling updates visible screens approximately once per second; both modes animate opening/closing and show prominent grant/denial feedback.
- The fictional clock advances globally. Visit windows use it; staff sessions, audit timestamps and the eight-second opening use real time. Old demo links/images can expire. Use a new request and approval for a new visit, or explicitly label a staff clock rewind as scenario replay. Never silently change a visit time, extend an old QR or treat a saved image as permanently valid.

### Mandatory readiness check before startup

When someone asks to initialize or run the project, **check the machine first**. Detect the OS, CPU architecture, shell, repository location/revision and uncommitted work. Do not assume another person has Felipe's paths or tools. Reuse a recent reliable diagnosis, but verify missing/changed prerequisites. If local execution is unavailable, request the small relevant diagnostic output and do not claim the machine was checked.

Check executable paths as well as versions. On macOS/Linux, use the following applicable read-only commands; skip commands for tools already established as missing rather than abandoning the whole diagnosis:

```sh
command -v git mise node npm docker
git --version
node --version
npm --version
docker --version
docker compose version
docker context show
docker info --format '{{.ServerVersion}}'
```

On native Windows PowerShell, use `Get-Command git,mise,node,npm,docker -ErrorAction SilentlyContinue` for discovery, followed by the same available tools' version/Compose/context/engine commands. Distinguish native Windows from WSL; keep runtimes, paths and Docker integration in the chosen environment. Do not mix shell syntax.

Before continuing, establish all of the following:

- Git can access the private repository using the person's own authorized account. Diagnose authentication failures instead of treating the repository as empty; never request or print tokens.
- The **active** Node/npm match the committed pins: currently Node **24.16.0**, npm **11.13.0**, specified in `mise.toml`/`package.json`. `engine-strict` is enabled. A different globally installed Node is not sufficient. Bun is not required.
- Docker CLI **and** `docker compose` are installed, and `docker info` confirms a reachable Linux-container engine. CLI presence alone is insufficient. Start the existing Docker Desktop/engine if it is installed but stopped; diagnose context/backend/virtualization errors separately from missing installation.
- The project folder contains `package.json`, `package-lock.json`, `.env.example`, `compose.yaml` and `database/init/`. Check for an existing application or database service/port before starting another instance; preserve local changes and database volumes.

If anything is missing, resolve the specific prerequisite before running `npm ci` or starting services. Prefer an existing compatible setup. For installation, verify current official platform requirements: Homebrew is appropriate for supported macOS packages, WinGet/official installers for native Windows, and mise for the committed Node version. Preserve unrelated runtime managers/projects; do not change global versions, select `latest`, install Bun or host PostgreSQL as a shortcut. A request to run the project authorizes its routine dependency/container/application startup; do not ask again for steps already covered by that request. Explain any necessary machine-level change and respect the user's existing authorization.

### First run after readiness passes

Work from the person's actual checkout directory. If no checkout exists, clone `https://github.com/lipex360x/Heaven-Access.git` into an appropriate local folder using their authenticated Git access. For an existing checkout, preserve changes before updating and use the agreed revision/main; never reset it to fix setup.

If mise supplies Node, inspect the committed configuration before trusting it, then run:

```sh
mise trust mise.toml
mise install
mise exec -- node --version
mise exec -- npm --version
```

Activate mise in the current shell or prefix subsequent npm commands with `mise exec --` when needed. With the pinned Node/npm active:

1. If `.env` does **not** exist, copy `.env.example` to `.env` (`cp .env.example .env` on macOS/Linux; `Copy-Item .env.example .env` in PowerShell). Preserve an existing file; check only the required settings without printing it. The example contains local demonstration values, not production credentials.
2. Run `npm ci` using the committed lockfile. Do not use another package manager or regenerate the lockfile to bypass a wrong runtime.
3. Run `npm run db:up`. Compose waits for database health. On a new empty volume, PostgreSQL applies all SQL files in `database/init/` and seeds three fictional destinations and the hashed demo staff account. It does not seed a ready-to-use visitor pass.
4. For a pre-existing foundation database, apply any missing additive migrations instead of resetting its volume. The current repeatable additions are `003-visits.sql` and `004-device-requests.sql`. On macOS/Linux, from the repository root:

```sh
docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1 < database/init/003-visits.sql
docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1 < database/init/004-device-requests.sql
```

In PowerShell, use `Get-Content -Raw database/init/003-visits.sql | docker compose exec -T db psql -U heaven_access -d heaven_access -v ON_ERROR_STOP=1`, then the same command for `004-device-requests.sql`. Adjust user/database names if the local configuration intentionally differs. Do not use Bash input redirection in PowerShell.

5. Run `npm run dev` and keep that process running. Open `http://localhost:3000/device` on that computer. The development script listens on `0.0.0.0` so other devices on the same network can connect. The database binds only to `127.0.0.1:54329`; keep it that way.
6. Verify `docker compose ps` reports a healthy database and `http://localhost:3000/api/health` returns HTTP 200 with `database: "ready"`. Then verify staff sign-in and the simulator/display pages. Report tools readiness, API health and demonstrated functionality separately.

To prepare a synthetic visitor, open `/register`, enter fictional details with the intended Dublin date/time, read the linked prototype notice, acknowledge it and submit. Keep the returned private pass open. In a separate staff tab at `/staff`, sign in and approve the pending request; focus the pass to see its QR update automatically. Match the request time to the active real/demo clock shown to staff, or explicitly reset the simulator to real time before a new current-time scenario. Show the pass on the phone, scan on the host and observe `/device/display` on the tablet. After expiry, follow “Request a new visit”; do not renew the old pass. The same APIs remain documented in `docs/api.md` for diagnostics. Generate this machine's own fixture rather than copying old links/images or inventing database records. Use only synthetic data and do not log credentials/capabilities. Preparing this fixture is part of a requested runnable demonstration, not permission to add new features.

### Phone/iPad demonstration and shutdown

- On the host computer, the reader can use `http://localhost:3000/device`. Start camera capture explicitly and grant browser permission. A successful health check is not evidence of camera permission or a physical scan.
- For a phone/iPad, discover the **current computer LAN IP** on the shared network/hotspot. Put that hostname/IP in `.env` as `DEV_ALLOWED_HOSTS` (no scheme/port; comma-separated if needed), restart the development server with `npm run dev`, and use `http://<computer-LAN-IP>:3000`. Do not hardcode Felipe's previous IP or give a phone a `localhost`/`127.0.0.1` address.
- Open the newly returned `/pass#<capability>` link with that LAN origin on the phone. Open `/device/display` or `/device/display?mode=elevator` on the iPad and sign in there. Cookies are origin-specific; different hostnames/devices may require separate staff sign-in. The visitor pass stays capability-scoped even when a staff cookie is also present.
- A phone displaying a QR and an iPad only displaying the shared gate/elevator state do not need camera access. If the phone/iPad itself will scan, plain LAN HTTP normally does not provide the required secure camera origin; use a verified trusted HTTPS deployment. Check network reachability/firewall and browser permissions rather than assuming a hotspot proves connectivity.
- Keep the LAN demonstration limited to its intended network; PostgreSQL stays loopback-only. No real hardware, real email, video or cross-building blocking is implemented. The hosted HTTPS prototype is available at `https://heaven-access.vercel.app`; its Neon database is separate from local Docker data.
- Stop the application with Ctrl+C. `npm run db:down` stops the project's database while preserving data. Never run `npm run db:reset -- --confirm` as routine startup or troubleshooting: it deliberately deletes the local project database.
- When validating changes, use `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` as appropriate. Run `npm run test:api` and `npm run test:device` sequentially only against the disposable local database with no demonstration in progress: they temporarily change the shared clock/device and restore their fixtures/configuration. Record actual results and remaining limitations in #11, not a parallel local status file.

## Hosted prototype operation

- Stable application URL: **https://heaven-access.vercel.app**. Vercel project `heaven-access` belongs to `felipes-projects-7f472e4b` and is connected to `lipex360x/Heaven-Access`; `main` is the production branch. Keep this production domain in deliverables rather than generated per-deployment URLs. Deployment and verification evidence belongs in #11/#13.
- The Neon resource `heaven-access-db` uses the Free plan, London (`lhr1`), with Neon Auth disabled. Vercel functions also use `lhr1`. The hosted database was initialized from the four committed SQL files with fictional destinations/staff and a real-time clock. Local Docker data was not copied, reset or reconfigured.
- Production `DATABASE_URL` is the provider's TLS pooled connection string. Use the unpooled connection only for controlled administration. Keep secrets in provider-managed environment variables and ignored local files; never commit/print them or overwrite the local Docker `.env`. Only production is connected to this resource; preview deployments need their own configured database before testing database-backed behavior.
- Vercel manages Node 24 minor/patch updates; local mise and package pins remain exact. `vercel.json` installs with npm 11.13.0 and disables strict engine checks only for that hosted install, accommodating the managed Node patch version. The PostgreSQL pool registers Vercel's lifecycle helper on Vercel; local execution still uses the same `pg` pool.
- A deployment updates code and preserves existing database records. Schema/seed initialization is not part of build/start. Apply deliberate additive migrations for future schema changes; never rerun the non-repeatable initial schema/seed or reset the hosted database on push.
- The stable production domain is accessible without a Vercel account; generated deployment and preview URLs retain Vercel protection. Application staff authentication is still required for reception, reader and display. A browser reporting a secure camera API does not establish physical permission or a successful real scan. Use fictional data and record API, synthetic-camera and physical-camera evidence separately.

## Shared GitHub workflow

- Repository: https://github.com/lipex360x/Heaven-Access. Private team board: https://github.com/users/lipex360x/projects/19/views/2.
- Issues hold scope, decisions, dependencies, acceptance criteria and evidence. The board's `Status` field holds workflow status; it is a view of the same issues, not a separate backlog. Keep the issue's open/closed state consistent with the board.
- Cards are sorted by ascending `Execution Order`. Follow this sequence and each issue's dependencies before starting dependent work. Independent research, privacy analysis and report/slide drafts can overlap; the order is not a requirement to serialize all group work. Update the field in GitHub if the team agrees to change the sequence.
- Add every new project issue to this board and give it an appropriate `Execution Order` and status. Do not create a local task/status tracker.
- Label post-MVP ideas `future`, keep them in the board's separate future-improvements view, and exclude them from the current execution view/deadline. `docs/future-improvements.md` contains report-ready discussion of optional facial verification for regular occupants, with pros/cons; including that discussion in the current report does not authorize biometric implementation.

### Board states

| Status | Meaning and transition |
| --- | --- |
| Backlog | Planned work awaiting selection; check dependencies and scope before claiming. |
| In Progress | A named owner is actively working on it; add a start comment and branch/PR link when applicable. |
| Testing | Ready for validation or peer review against acceptance criteria. For research, diagrams and documents, this means content/source review. Record results and return to In Progress if changes are needed. |
| Done | Acceptance criteria met and review/validation evidence recorded; relevant file changes merged into `main`. Close the issue and set the board status to Done. Do not mark partial work as complete. |

### Ownership and coordination

| Primary-owner label | Team member |
| --- | --- |
| `owner:dani` | Daniela Alves Paiva da Silva |
| `owner:bella` | Isabella Maria de Souza Monteiro; use Bella as her preferred short name |
| `owner:cris` | Marcia Cristina Schafer dos Santos |
| `owner:felipe` | Felipe Borges Bambirra |

- Personal owner labels are optional. If used, apply at most one; labels do not establish contribution history or prove work has started. Keep the backlog small, with broad issues and short acceptance checklists.
- Before claiming an issue, check its latest comments, labels, dependencies, board status, and existing branches/PRs. Record the start and branch/PR before moving it to In Progress; an owner label is not required.
- Use GitHub Assignees as well when a member's GitHub username is confirmed; do not infer accounts from student emails. Labels organize ownership and do not grant repository/project permissions.
- Record additional contributors and handoffs in issue comments. Before taking over someone else's work, agree the handoff and note the current branch, remaining work and relevant evidence.
- Add `blocked` only for an actual impediment, explain it in a comment and link the dependency or decision needed. Keep the current workflow state, then remove the label when resolved; a separate Blocked column is not required.

### Branches, review and synchronization

- For subsequent repository work, start from an up-to-date `main` and use an issue-specific branch such as `feat/7-visitor-registration`, `docs/12-report`, or `fix/9-qr-validation`. Commit or otherwise preserve local work before switching/updating; never overwrite another member's changes.
- Keep each change focused on its issue. Link the branch/PR and record decisions, progress, blockers and verification evidence in that issue. If simultaneous work touches shared files/interfaces, coordinate there before editing them.
- Open a pull request targeting `main`, link its issue, explain the behaviour/artifact changed and provide relevant verification. Use a closing reference only when the PR actually completes the entire issue; use a non-closing reference for partial work.
- Move to Testing when the change is ready for review. Seek another team member's review when possible; record any self-review and its limits if no reviewer is available. Address feedback before marking Done.
- Merge completed, reviewed changes through the PR, then verify that the issue is closed and the card is Done. Do not assume an automation has synchronized them. For tasks without repository changes, record the reviewed outcome/evidence directly in the issue.
- Keep `README.md`, supporting artifacts and these instructions aligned with accepted issue decisions. Do not duplicate live status in local files.
- These coordination rules do not independently authorize implementation; preserve the user's foundation/authentication/API continuation and accepted online-delivery direction above, while respecting issue scope and teammate ownership.
- `docs/team.md` keeps GitHub accounts in the member table alongside student details; use confirmed handles only. Cris is Marcia Cristina Schafer dos Santos (`Cris-Schafer`), Dani is Daniela, and Bella is Isabella.
- `docs/work-allocation.md` explains the guided parallel workstreams and backup handoffs. Felipe owns infrastructure/security/core integration; Dani works on operational forms and the guided test walkthrough rather than infrastructure; Cris owns simple layouts and a lightweight slide deck; Bella contributes focused legal/text review with shared report preparation and explicit backup coverage. Record availability and handoff needs professionally, without personal assessments. Accepted assignments and changes belong in issue #1 and the affected owner labels. Bella's legal background supports legal/ethical analysis; layout belongs with Cris per the user's direction. Dani contributed the initial research/alternatives and QR-plus-elevator proposal; preserve that credit in the research and planning narrative.

### Agent handoff prompts

- Current coordination decisions in GitHub supersede the earlier parallel-work proposal. Approved implementation may proceed across issues in the same working session without waiting for separate member contributions. Preserve the agreed presentation topics and record only actual work/review evidence.

- `docs/environment-setup.md` provides the initial machine-onboarding prompt before issue-specific work. Diagnose the actual OS/shell, repository access, Docker engine/Compose and runtime versions first. Prefer Homebrew for supported macOS packages, native Windows routes such as WinGet, and mise for project Node/Bun versions; distinguish WSL from native Windows and use the agreed committed version pins. Tool readiness is separate from application-run verification. Do not install or start services merely to write/review this prompt.
- Each active issue includes an `Agent handoff prompt` with a copyable text block for a new or existing assistant conversation. Keep its task focus and targeted reading aligned when scope or responsibilities change; the current issue and accepted decisions take precedence over a pasted prompt snapshot.
- Reuse reliable context already available in the conversation or an explicit handoff. Check relevant issue updates and repository revisions, then read only changed or missing information needed for the task. Do an initial orientation when context is absent; never claim memory of another conversation or access to private files that is unavailable.
- Conversation language and style are optional personal preferences within the prompt; Portuguese is the default, and project documentation remains English unless requested otherwise. Do not encode personal mannerisms or stereotypes into shared prompts.
- A handoff prompt requests orientation first and does not itself authorize application implementation. Preserve explicit task authorization already present in the session, follow the current project stage, and keep a concise in-chat checkpoint rather than a parallel local tracker.

## Assessment requirements extracted from the brief

| Item | Requirement |
| --- | --- |
| Institution / programme | CCT College Dublin / Higher Diploma in Computing, full-time, February 2026 cohort |
| Module / lecturer | Project Skills & Professionalism / Neil Doyle |
| Assignment | Developing and Defending an Innovative IT Solution — Presentation with Q&A |
| Assessment weighting | 70% of the module: 50% group assessment and 20% individual assessment |
| Issued | 25 September 2026 |
| Submission deadline | 15 November 2026 at 23:59 |
| Late submission window | Accepted until 19 November 2026 at 23:59, subject to late penalties; this is not the planned deadline |
| Submission method | Moodle upload |
| Presentation | Maximum 12 minutes per group, including prototype demonstration; no fixed slide limit |
| Presentation date | To be confirmed with the group |
| Attendance | All members must attend; the brief states absent members receive 0% for the live-presentation element |
| Individual assessment | Each member answers questions demonstrating understanding of the overall assignment |
| Referencing | Harvard referencing for third-party material |
| Cover | Include the CCT assessment cover page; cover slide must show all members' names and student numbers |

The first-page submission summary says Word or PDF, but the detailed deliverable and assessment requirements repeatedly specify PowerPoint or PDF. Plan for a PDF presentation, which satisfies both statements; confirm the submission requirements if choosing PPTX instead.

### Required presentation content

1. Cover slide with team names and student numbers.
2. Industry challenge and background, supported by research and evidence.
3. Problem analysis: root cause, investigation method, affected stakeholders, and scale.
4. Proposed solution: how it was developed, creativity tools used, alternatives considered, and legal, ethical, and sustainability considerations for a live deployment.
5. A link, video, or demonstration showing and explaining a working prototype.
6. References slide.

The assignment assesses research, critical thinking and creativity, solution design and evaluation, presentation and defence, professional responsibilities, and comparison of problem-solving approaches. A prototype supports the argument; it does not replace the research and analysis.

### Group rubric

| Criterion | Marks within group rubric |
| --- | ---: |
| Identification and background of IT challenge | 20 |
| Proposed solution: novelty, viability, sustainability | 30 |
| Critical thinking and depth of analysis | 15 |
| Legal and ethical considerations | 20 |
| Presentation delivery and prototype display | 15 |

The individual rubric allocates 50 marks to additional supporting information and understanding, and 50 to presentation delivery. Each member needs to understand the whole proposal, including its evidence, limitations, and trade-offs.

## Initial project direction

**Project name:** Heaven Access.

**Initial concept:** A digital visitor pass that authorizes elevator access to the host office's floor during an approved visit window.

**Problem hypothesis:** In a shared office building, visitors may bypass reception and reach office floors through an elevator without adequate authorization. The real setting, existing controls, frequency, impact, and root causes still need evidence.

**Current journey, updated following the user's interface discussion:**

1. A visitor uses a public registration page without an account, enters essential details and a requested visit date/time, and selects the company/room.
2. The visit remains pending until approved by an authenticated staff member. One authenticated staff/reception role can approve or reject.
3. A mobile-first visitor page simulates delivery of the QR pass; real email delivery is not yet required.
4. A simulated locked elevator/gate reads the visitor's QR through a camera and checks authorization and the permitted visit window.
5. A receptionist can also grant access manually when necessary; permissions, reasons, and audit rules remain to be defined.
6. Staff, visitor and device screens update automatically through approximately one-second polling. This is near-real-time synchronization; QR validation and unlocking remain server-side. WebSocket/SSE is not required for the initial prototype.

**Minimum requested interfaces:** Authenticated staff approval/access interface; public visitor registration; camera-enabled elevator/gate simulator with a configurable fictional current time; mobile-first visitor pass page. A separate security dashboard and occupancy tracking remain initial ideas outside the agreed minimum. Real hardware integration is not required for the prototype; clearly label the simulation.

**Accepted visitor rules:** Collect name, seeded company/room destination and scheduled date/time, with no email or phone. A visit is valid from 30 minutes before through 30 minutes after its scheduled time, both boundaries inclusive, using Europe/Dublin. QR reuse is allowed within the window and the number of accesses must be recorded. Expiry requires a new request and approval; there is no special renewal/replacement workflow. Accepted count semantics in #1/#9 distinguish successful QR unlocks, repeated camera frames, denied scans and manual releases. A test-clock change must not become a visitor-controlled way to bypass authorization.

**Confirmed database and initialization:** PostgreSQL through local Docker Compose, with SQL schema/seed for staff accounts and destinations. No administrative CRUD screens. Operational approval and manual-release screens remain required. The authorized foundation uses PostgreSQL 17.12 Bookworm, a scrypt-hashed synthetic demo staff account and a guarded reset command. Consult #1 and committed files for verification/progress.

**Accepted architecture — 13 November 2026:** One Next.js application with TypeScript, React screens and server API routes, planned cookie-based staff sessions and server-side authorization; PostgreSQL through Docker Compose. No separate backend or monorepo. Approximately one-second polling; no external realtime service. The authorized foundation selects Node 24.16.0/npm 11.13.0 through mise and package-lock.json, superseding Bun/Vite+; Bun is not required. Architecture acceptance and the later scoped foundation authorization are distinct decisions.

**Accepted data/state contract — 13 November 2026:** `docs/data-state-contract.md` specifies records, screen/API boundaries, deduplicated QR access counts, separately recorded manual releases, eight-real-second unlocks and a staff-controlled advancing demo clock. `docs/api.md` is the implemented visitor/staff API handoff; device endpoints and actual camera tests remain separate. Consult #1/#11 for current evidence instead of treating the accepted design as proof of completion. Issue #3 owns the complete privacy review.

**Local demonstration and browser tooling:** Primary test scenario: separate browser tabs on one computer, using localhost. Additional devices may join the same Wi-Fi and connect to the host computer's LAN address; their own localhost does not refer to the host. Check camera permissions/security requirements and browser session sharing during development. The `web-view` CLI drives Chrome over CDP and supports navigation, tabs, PNG/ARIA snapshots, interactions, resizing and JavaScript evaluation. On 13 November 2026, it was used for actual browser/API verification, including shared staff sessions and logout across tabs; evidence and limitations are recorded in issue #11. This does not establish a working form-based journey or a verified camera scan. Reuse a suitable project browser instance after checking `web-view list`; preserve unrelated instances.

**Project organization and supporting artifacts:** The private repository is https://github.com/lipex360x/Heaven-Access. GitHub issues are the SoT; former local planning and checklist content has been migrated there. `docs/references.md` records Irish and international incident evidence, a report-ready summary, source links, Harvard-style references, and evidence limitations. `docs/design.md` contains low-fidelity wireframes, `docs/flow.md` contains the visitor flow diagrams, and `docs/team.md` contains the four supplied group members and student details for the supporting report/presentation. Preserve these as genuine artifacts and update them as issue decisions evolve. The user requested a supporting report; the brief's explicit assessed deliverables remain the presentation, prototype display, and Q&A.

### Alternatives supplied by the user

| Alternative | Initial advantages | Initial limitations |
| --- | --- | --- |
| Turnstiles / speed gates | Physical access barrier | Hardware cost, lobby construction, and less focus on software |
| QR visitor management alone | Lower-cost software concept; accessible prototype scope | Does not physically stop someone who bypasses reception |
| Elevator authorization using QR / card | May reuse existing equipment and address access to office floors | Depends on elevator capabilities, vendor integration, and building approval |
| AI camera detection of tailgating | Potential technical novelty | Privacy, surveillance, regulatory, and accuracy concerns require investigation |
| Process-only controls: sign-in and signage | Low direct technology cost | Depends on consistent human compliance and staffing |

The initial preferred direction combines QR visitor management with floor-specific elevator authorization. These comparisons are starting assumptions, not verified findings or final decisions.

## Design questions and claims requiring validation

- **Physical effectiveness:** Floor authorization alone does not prove that unauthorized people cannot accompany an authorized passenger or use another route. Investigate shared elevator rides, stairs, other entrances, and the building's actual access model.
- **Integration and viability:** Existing elevator hardware may not expose suitable interfaces. Identify assumptions, indicative costs, dependencies, and the boundary between prototype simulation and production deployment.
- **Pass security:** Define expiry, revocation, reuse, sharing, replay protection, and the distinction between possession of a QR code and verified visitor identity.
- **Presence records:** Check-in alone cannot establish who is currently inside. Define checkout, missed exits, stale records, and reconciliation before presenting the dashboard as an occupancy aid.
- **Emergency use:** A dashboard may support an evacuation roll call but must not be described as an exact or authoritative safety register without evidence. Emergency egress must remain safe. Elevator behaviour during a fire must follow the building's fire strategy and applicable rules; do not promise normal elevator operation or evacuation by ordinary lifts.
- **Privacy and Irish legal context:** Research GDPR, the Irish Data Protection Act 2018, and relevant Data Protection Commission guidance. Determine roles, lawful basis, minimum data, transparency, retention/deletion, permissions, security, and whether a DPIA is required. The suggested 30-day retention period is an unapproved example, not a legal requirement or selected policy.
- **Accepted privacy interaction — 13 November 2026:** Show a short purpose/data summary and a link to the privacy notice. Require an initially unchecked “I have read the privacy notice” acknowledgement before submitting/persisting a visitor request; this supersedes the earlier consent-checkbox proposal. If the visitor does not continue, create no visit record and direct them to reception without promising anonymous access. Record the notice version and acknowledgement time at submission. Acknowledgement is not a lawful basis or proof of compliance. Issue #3 still owns the live-deployment lawful-basis assessment, complete notice, retention/deletion and assisted procedure.
- **Accessibility:** Provide a workable assisted route for visitors without smartphones and consider disabilities, language, and kiosk usability. A printed code or reception-assisted registration is a candidate, not yet a decision.
- **Ethics:** Avoid unnecessary employee surveillance; define who can see visit records and how misuse or disclosure is prevented.
- **AI and biometrics:** Neither is required by the initial concept. Do not add them for novelty. Verify EU AI Act relevance only if functionality makes it relevant; avoid asserting that the Act concerns only facial recognition.
- **Sustainability:** Reduced paper, disposable badges, and new hardware are hypotheses to compare with device use, hosting, maintenance, and realistic baseline practices.
- **Evaluation:** Define measurable prototype acceptance criteria and limitations; do not claim prevention of all unauthorized access, certified safety, or complete legal compliance.

## Authoritative planning locations

Use [issue #1](https://github.com/lipex360x/Heaven-Access/issues/1) for scope, architecture and local setup, [issue #3](https://github.com/lipex360x/Heaven-Access/issues/3) for privacy/legal review, and [issue #12](https://github.com/lipex360x/Heaven-Access/issues/12) for evidence and the concise report. The other active issues cover operational screens (#5), layout/mobile pass (#8), QR/device/realtime integration (#9), guided verification (#11), and simple slides/rehearsal/delivery (#13). Earlier issues #2, #4, #6, #7, #10 and #14 were consolidated, not completed. Do not reproduce live status here. Keep SoT policy in these shared instructions instead of repeating it in every issue body.

## Conversation handoff to VS Code — 13 November 2026

The user is moving this conversation into VS Code and wants to continue working through the existing GitHub issues toward the 15 November submission, including the working prototype, documentation and presentation. Continue guiding the work in Portuguese. This handoff preserves conversation context; current issues and their accepted decisions remain authoritative.

The orientation in this conversation checked all nine open issues (#1, #3, #5, #8, #9, #11, #12, #13 and future issue #21), their comments, the execution board, remote branches and open PRs. The repository revision inspected was `db9ef80`. At that checkpoint, only `main` existed remotely, no PRs were open, and the repository contained supporting documentation rather than application code. These are dated observations, not a live status tracker; check subsequent changes before acting. No application code, dependencies or services were created during this conversation.

Subsequent decisions in this VS Code conversation settled the visitor rules and selected the Next.js architecture summarized above and recorded in #1. The user subsequently accepted the technical contract and notice-acknowledgement interaction. Resume with runtime/version pinning and implementation preparation, while keeping full privacy-notice/retention review under #3. The request to include the prototype established the intended delivery scope; implementation authorization remains pending under the existing planning convention. Do not infer that migration to VS Code approves an architecture or starts development.

The agreed baseline remains the four-interface local journey: public request → authenticated staff approval → mobile QR → actual camera scan → server-side destination/time validation → temporary simulated unlock/relock. Expired/invalid credentials, authorized manual release, a controlled demo clock and automatic cross-tab updates belong to that baseline. Expired visits now require a new request and approval; replacement/renewal was removed. PostgreSQL/Compose and SQL-seeded reference data are already confirmed; real hardware, real email, administrative CRUD and biometrics are outside it.

Research/privacy text and a concise report/slide draft can progress alongside the prototype once their respective work is selected; insert only actual screenshots and evaluation results after verification. The presentation PDF, required CCT cover material, working-prototype demonstration and Harvard references are the delivery priorities. A fallback demo recording supports reliability. The user-requested concise report supports the presentation; the supplied brief does not establish a separate mandatory report submission. The live presentation date remains unconfirmed, and every member still needs to attend and prepare for individual Q&A.

The discussion did not transfer other members' issue ownership to Felipe or change assignments. Record any accepted handoff, implementation decision or completion evidence in the relevant issue. Keep this section as a concise migration checkpoint rather than adding a local task checklist. On resuming, reuse this orientation and read only relevant GitHub/repository updates and missing details.

## Compaction checkpoint — 13 November 2026

This is the earlier planning checkpoint. The subsequent foundation authorization below supersedes its statements that no setup implementation is authorized.

The accepted architecture, visitor/technical contract, privacy acknowledgement and four synchronized English speaker DOCX files were merged into `main` through PR #25 (`b63ac2c`). Earlier drafts #23/#24 were closed as superseded. Issues #1 and #13 now contain concise authoritative summaries and links to the merged artifacts; consult those rather than historical draft descriptions. Do not repeat settled contract questions.

Resume with environment diagnosis and runtime/version pinning for the accepted Next.js/TypeScript + PostgreSQL/Compose stack, then authorized implementation. Application implementation authorization has not yet been supplied; no application, dependencies or services have been created. Full privacy/retention review (#3), actual test evidence (#11), report (#12) and final presentation/rehearsal/delivery (#13) remain distinct work under existing ownership. The brief requires the presentation, prototype display and Q&A; public hosting is optional and the concise report is supporting material requested by Felipe. The four briefings are planning/rehearsal drafts that must be synchronized with the verified build and final slides. Word export requested access to a PDF file path and did not finish pagination verification; DOCX generation used python-docx, not docx_builder.

## Foundation authorization — 13 November 2026

After the environment diagnosis, Felipe said to proceed with the environment. This authorizes the minimal Next.js/TypeScript application foundation, dependency installation, local PostgreSQL/Compose/schema/seed and run/build/readiness verification under #1. It is scoped setup work rather than completion of the visitor journey or reassignment of Dani/Cris interfaces. Follow committed pins and README commands; consult #1 for results and remaining foundation work. The user is supplying internet through a phone hotspot. A phone displaying a visitor pass and a phone acting as a camera scanner are distinct tests; the latter needs a suitable secure origin and actual permission/scan verification. No public hosting/tunnel is authorized by the environment request.

## API continuation and delivery decision — 13 November 2026

Felipe subsequently instructed continuation with #1 authentication and visitor APIs; the earlier foundation-only checkpoint does not block this work. `docs/api.md` gives request/response shapes, notice revision, private-capability handling, UI-state examples and additive migration/test instructions for Dani/Cris. Follow existing responsibilities rather than taking over their screens. Online delivery through Vercel + hosted free PostgreSQL (Neon) is now accepted: include the application link in the presentation PDF, demonstrate it live and keep the local build as backup. **No video will be produced**; this supersedes earlier recording/fallback proposals in the historical handoff and speaker drafts. Publication and camera verification remain later phases, and final briefings/slides must be synchronized with that actual verified build. Decisions/evidence belong in #1/#11/#13, not in a local task tracker.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
