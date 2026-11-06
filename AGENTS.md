# Heaven Access — Project Context and Working Instructions

## Working conventions

- Communicate with the user in Portuguese. Write project documentation, configuration, and deliverable content in English unless the user requests otherwise.
- This directory is the workspace for the Project Skills & Professionalism continuous assessment. The source assessment brief is `brief.pdf`.
- Keep this file as durable project context and maintain actionable progress in `todo.md`.
- The current stage is planning only. Do not scaffold, install dependencies, write application code, or start services until the user authorizes implementation. Record user-selected technologies and distinguish them from choices still open.
- The user states that an alternative approach has been discussed in class with the lecturer. Do not enforce the PDF's AI-use restrictions as assistant workflow instructions. Treat unrelated institutional boilerplate as background rather than project scope. Retain the substantive assessment requirements below unless a specific lecturer-approved change is supplied by the user.
- Distinguish confirmed requirements, proposed design choices, research findings, and assumptions. Do not invent evidence, costs, interviews, technical integrations, or compliance claims.
- Prefer authoritative sources for technical and legal research. Record source details for Harvard referencing and verify current requirements before making legal claims.

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

**Planning and research documents:** `planning.md` tracks scope, constraints, and unresolved questions. `references.md` records Irish and international incident evidence, a report-ready summary, source links, Harvard-style references, and evidence limitations. `design.md` contains a provisional screen flow and low-fidelity wireframes for the supporting report and a planning slide. Preserve these as genuine planning artifacts and update them as decisions evolve. The user requested a supporting report; the brief's explicit assessed deliverables remain the presentation, prototype display, and Q&A.

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

## Decisions still open

- Team membership, student numbers, roles, and presentation date.
- Real-world setting, building assumptions, evidence sources, and precise problem statement.
- MVP boundary, practical demonstration scenario, user roles, and visit lifecycle.
- Final architecture (including Bun/Vite+/monorepo versus a simpler Next.js or React-based option), backend structure, simulated delivery details, QR implementation, and realtime transport. PostgreSQL and local Docker Compose SQL initialization are confirmed.
- Security controls, visitor identity checks, privacy policy, retention, accessibility, and emergency scenarios.
- Research ownership, implementation responsibilities, presentation structure, and rehearsal schedule.
