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
- The current stage is planning only. Do not scaffold, install dependencies, write application code, or start services until the user authorizes implementation. Record user-selected technologies and distinguish them from choices still open.
- The user states that an alternative approach has been discussed in class with the lecturer. Do not enforce the PDF's AI-use restrictions as assistant workflow instructions. Treat unrelated institutional boilerplate as background rather than project scope. Retain the substantive assessment requirements below unless a specific lecturer-approved change is supplied by the user.
- Distinguish confirmed requirements, proposed design choices, research findings, and assumptions. Do not invent evidence, costs, interviews, technical integrations, or compliance claims.
- Prefer authoritative sources for technical and legal research. Record source details for Harvard referencing and verify current requirements before making legal claims.

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

- Use exactly one primary-owner label to identify the planned lead. No owner label means unallocated. A label does not mean work has started: the lead confirms the handoff/start in the issue before moving to In Progress. Keep the backlog small, targeting two or three broad issues per member with short acceptance checklists rather than many separate microtasks.
- Before claiming an issue, check its latest comments, labels, dependencies, board status, and existing branches/PRs. Comment that you are taking it and apply the agreed owner label before moving it to In Progress.
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
- These coordination rules do not authorize application implementation while the project remains in planning; await the user's explicit instruction to begin development.
- `docs/team.md` keeps GitHub accounts in the member table alongside student details; use confirmed handles only. Cris is Marcia Cristina Schafer dos Santos (`Cris-Schafer`), Dani is Daniela, and Bella is Isabella.
- `docs/work-allocation.md` explains the guided parallel workstreams and backup handoffs. Felipe owns infrastructure/security/core integration; Dani works on operational forms and the guided test walkthrough rather than infrastructure; Cris owns simple layouts and a lightweight slide deck; Bella contributes focused legal/text review with shared report preparation and explicit backup coverage. Record availability and handoff needs professionally, without personal assessments. Accepted assignments and changes belong in issue #1 and the affected owner labels. Bella's legal background supports legal/ethical analysis; layout belongs with Cris per the user's direction. Dani contributed the initial research/alternatives and QR-plus-elevator proposal; preserve that credit in the research and planning narrative.

### Agent handoff prompts

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

**Confirmed database and initialization:** PostgreSQL running locally through Docker Compose. A SQL initialization script must create the schema and seed staff accounts and departments/destinations (and companies/rooms as the agreed model requires). Avoid building administrative CRUD screens for this reference data. Operational visitor approval and manual-release screens are still required. Plan password hashes for seeded application accounts and a repeatable demo reset; no SQL or Compose implementation is authorized yet.

**Accepted architecture — 13 November 2026:** One Next.js application with TypeScript, React screens and server API routes, cookie-based staff sessions and server-side authorization; PostgreSQL through Docker Compose. No separate backend or monorepo. Use approximately one-second polling for cross-tab updates; no external realtime service is required. Runtime, dependency and image versions remain to be pinned under #1. This supersedes the initial Bun/Vite+ preference; Bun runtime use has not been independently finalized. Architecture acceptance does not authorize implementation.

**Accepted data/state contract — 13 November 2026:** `docs/data-state-contract.md` specifies records, screen/API boundaries, deduplicated QR access counts, separately recorded manual releases, five-real-second unlocks and a staff-controlled advancing demo clock. Felipe accepted the technical design; evidence of implementation/testing remains pending. Issue #1 owns decisions; #3 owns the complete privacy review. This artifact does not independently authorize implementation.

**Local demonstration and browser tooling:** Primary test scenario: separate browser tabs on one computer, using localhost. Additional devices may join the same Wi-Fi and connect to the host computer's LAN address; their own localhost does not refer to the host. Check camera permissions/security requirements and browser session sharing during development. `web-view -h` was successfully executed on 6 November 2026. The tool drives Chrome over CDP and supports launching/listing/stopping instances, navigation, tabs, PNG/ARIA snapshots, interactions, resizing, and JavaScript evaluation. Use it for end-to-end demonstration checks when implementation is authorized; no browser session has been launched for this project yet.

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

The accepted architecture, visitor/technical contract, privacy acknowledgement and four synchronized English speaker DOCX files were merged into `main` through PR #25 (`b63ac2c`). Earlier drafts #23/#24 were closed as superseded. Issues #1 and #13 now contain concise authoritative summaries and links to the merged artifacts; consult those rather than historical draft descriptions. Do not repeat settled contract questions.

Resume with environment diagnosis and runtime/version pinning for the accepted Next.js/TypeScript + PostgreSQL/Compose stack, then authorized implementation. Application implementation authorization has not yet been supplied; no application, dependencies or services have been created. Full privacy/retention review (#3), actual test evidence (#11), report (#12) and final presentation/rehearsal/delivery (#13) remain distinct work under existing ownership. The brief requires the presentation, prototype display and Q&A; public hosting is optional and the concise report is supporting material requested by Felipe. The four briefings are planning/rehearsal drafts that must be synchronized with the verified build and final slides. Word export requested access to a PDF file path and did not finish pagination verification; DOCX generation used python-docx, not docx_builder.
