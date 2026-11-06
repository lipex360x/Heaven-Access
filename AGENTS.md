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
| `owner:daniela` | Daniela Alves Paiva da Silva |
| `owner:bella` | Isabella Maria de Souza Monteiro; use Bella as her preferred short name |
| `owner:marcia` | Marcia Cristina Schafer dos Santos |
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
2. The visit remains pending until approved by an authenticated staff member. The exact approving role remains to be agreed.
3. A mobile-first visitor page simulates delivery of the QR pass; real email delivery is not yet required.
4. A simulated locked elevator/gate reads the visitor's QR through a camera and checks authorization and the permitted visit window.
5. A receptionist can also grant access manually when necessary; permissions, reasons, and audit rules remain to be defined.
6. Staff, visitor, and access-device screens update in real time, including when a replacement pass is issued after an expired/invalid pass. WebSocket is a candidate transport, not a final protocol choice.

**Minimum requested interfaces:** Authenticated staff approval/access interface; public visitor registration; camera-enabled elevator/gate simulator with a configurable fictional current time; mobile-first visitor pass page. A separate security dashboard and occupancy tracking remain initial ideas outside the agreed minimum. Real hardware integration is not required for the prototype; clearly label the simulation.

**Timing proposal:** A visit may be valid from 30 minutes before to 30 minutes after its scheduled time. The user offered this as a tentative margin. Confirm duration, inclusive boundaries, timezone, clock scope, and renewal rules before implementation. A test-clock change must not become a visitor-controlled way to bypass authorization.

**Confirmed database and initialization:** PostgreSQL running locally through Docker Compose. A SQL initialization script must create the schema and seed staff accounts and departments/destinations (and companies/rooms as the agreed model requires). Avoid building administrative CRUD screens for this reference data. Operational visitor approval and manual-release screens are still required. Plan password hashes for seeded application accounts and a repeatable demo reset; no SQL or Compose implementation is authorized yet.

**Architecture still under discussion:** The initial preference was Bun, Vite+ for frontend development/build, and a backend/frontend monorepo. The user subsequently accepted considering Next.js or a React-based approach if simpler, provided realtime communication works. Do not treat the initial monorepo or Vite+ selection as final. Compare the alternatives before deciding; distinguish React UI from the server responsibilities still needed for authorization, PostgreSQL, and realtime state. The user confirmed Vite+ means the installed `vp` tool. `vp --help` was successfully executed on 6 November 2026. No project has been scaffolded.

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
- **Requested consent interaction:** The user wants visitors to consent before their data is stored. Preserve that requirement for design discussion, but distinguish consent from acknowledgement of a privacy notice and assess whether consent is an appropriate lawful basis for essential access-control processing. DPC guidance confirms that consent is not mandatory for every processing activity. Do not describe a checkbox as proof of GDPR compliance. Decide what is persisted before submission, how consent is recorded, withdrawal/refusal handling, and retention.
- **Accessibility:** Provide a workable assisted route for visitors without smartphones and consider disabilities, language, and kiosk usability. A printed code or reception-assisted registration is a candidate, not yet a decision.
- **Ethics:** Avoid unnecessary employee surveillance; define who can see visit records and how misuse or disclosure is prevented.
- **AI and biometrics:** Neither is required by the initial concept. Do not add them for novelty. Verify EU AI Act relevance only if functionality makes it relevant; avoid asserting that the Act concerns only facial recognition.
- **Sustainability:** Reduced paper, disposable badges, and new hardware are hypotheses to compare with device use, hosting, maintenance, and realistic baseline practices.
- **Evaluation:** Define measurable prototype acceptance criteria and limitations; do not claim prevention of all unauthorized access, certified safety, or complete legal compliance.

## Authoritative planning locations

Use [issue #1](https://github.com/lipex360x/Heaven-Access/issues/1) for scope, architecture and local setup, [issue #3](https://github.com/lipex360x/Heaven-Access/issues/3) for privacy/legal review, and [issue #12](https://github.com/lipex360x/Heaven-Access/issues/12) for evidence and the concise report. The other active issues cover operational screens (#5), layout/mobile pass (#8), QR/device/realtime integration (#9), guided verification (#11), and simple slides/rehearsal/delivery (#13). Earlier issues #2, #4, #6, #7, #10 and #14 were consolidated, not completed. Do not reproduce live status here. Keep SoT policy in these shared instructions instead of repeating it in every issue body.
