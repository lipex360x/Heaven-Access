# Heaven Access — Task List

Tasks reflect the assessment brief and the evolving proposal. Work is planning only. PostgreSQL, Docker Compose SQL initialization, approval before access, manual receptionist release, and realtime interfaces are confirmed; final application architecture is open. Target submission: **15 November 2026, 23:59, via Moodle**. The presentation, including the prototype demo, must fit within **12 minutes**.

## 1. Brief and project setup

- [x] Read `brief.pdf` and extract substantive assessment requirements.
- [x] Record project context, rubric, assumptions, and open decisions in `AGENTS.md`.
- [x] Record the initial Heaven Access concept and alternatives.
- [x] Inspect the installed tools with `vp --help` and `web-view -h`.
- [ ] Record team members, student numbers, responsibilities, and presentation date.
- [ ] Set an achievable schedule for research, prototype work, slides, rehearsal, and submission.
- [ ] Obtain the CCT assessment cover page and confirm the chosen upload format; PDF satisfies both format statements in the brief.

## 2. Problem definition and evidence

- [ ] Discuss the intended building context and the practical outcome the project should demonstrate.
- [ ] Define the current visitor journey, access controls, and specific unauthorized-access scenario.
- [ ] Identify stakeholders: visitors, hosts, reception/security, building management, and office tenants.
- [ ] Investigate root causes, affected groups, scale, and consequences using a documented analysis method.
- [ ] Gather valid academic, industry, and technical evidence; distinguish verified facts from scenario assumptions.
- [x] Research initial Irish and international physical-access incidents and document consequences and relevance in `references.md`.
- [x] Create an initial source register and report-ready research summary in `references.md`.
- [ ] Verify flagged publication metadata and source accessibility, and supplement incident reports with academic/technical evidence.
- [ ] Maintain the source register and finalize Harvard formatting for submission.
- [ ] Agree a concise problem statement and measurable success criteria.

## 3. Alternatives and solution justification

- [ ] Compare turnstiles, QR-only visitor management, elevator authorization, AI camera detection, and process-only controls against consistent criteria.
- [ ] Document the creativity and problem-solving methods actually used to develop the proposal.
- [ ] Test whether the QR-plus-elevator approach addresses the identified cause and identify residual risks, including accompanying passengers and alternative routes.
- [ ] Investigate elevator integration assumptions, building/vendor dependencies, indicative costs, and deployment practicality.
- [ ] Evaluate sustainability benefits and trade-offs against the existing process using evidence.
- [ ] Record why the selected approach is appropriate, its distinctive value, and its limitations.

## 4. Practical project modelling — discuss before implementation

- [ ] Agree the MVP scope and separate demonstrated behaviour from possible future features.
- [ ] Define actors, permissions, and tenant/floor boundaries where applicable.
- [ ] Define the visitor journey from invitation through arrival, authorization, and departure.
- [x] Confirm that visitor registration must await approval and that a receptionist may manually release access.
- [ ] Decide which roles approve requests and which roles may override or renew access.
- [ ] Define visit states, allowed transitions, expiry, cancellation/revocation, and any re-entry rules.
- [ ] Define what the QR contains, validation rules, and protection against sharing or replay.
- [ ] Define checkout and treatment of missing exits so the dashboard does not overstate occupancy accuracy.
- [ ] Agree the elevator simulation contract and explain what a real integration would require.
- [ ] Define essential screens, data fields, and the smallest coherent demo scenario.
- [x] Confirm PostgreSQL with Docker Compose and SQL schema/reference-data initialization; omit administrative CRUD screens.
- [x] Confirm localhost browser tabs as the primary demo and shared Wi-Fi for additional devices.
- [ ] Compare Bun/Vite+/monorepo with simpler Next.js or React-based options before selecting the architecture and realtime transport.
- [ ] Agree simulated pass delivery, visitor-page privacy, QR tooling, and application framework.
- [x] Draft the screen flow and low-fidelity wireframes in `design.md`.
- [ ] Review the draft flow/wireframes with the user and resolve pending states and controls.

## 5. Legal, ethical, accessibility, and safety analysis

- [ ] Research current GDPR, Irish Data Protection Act 2018, and relevant DPC guidance using authoritative sources.
- [ ] Identify controller/processor responsibilities, lawful basis, necessary data, and visitor privacy information.
- [ ] Decide and justify retention/deletion rules; treat 30 days as an example until validated.
- [ ] Assess whether a DPIA is required and document the reasoning and proportionate privacy risks.
- [ ] Define access permissions, data security, and safeguards against employee surveillance or record misuse.
- [ ] Design an assisted visitor route without a smartphone and consider other accessibility needs.
- [ ] Document emergency egress requirements and the boundary with the building's fire/elevator strategy.
- [ ] Establish the dashboard's limitations as an evacuation support tool and an appropriate fallback process.
- [ ] Confirm whether any selected feature makes AI-specific regulation relevant; do not assume biometrics or AI are necessary.
- [ ] Turn the analysis into concrete production recommendations and clearly separate them from implemented prototype controls.

## 6. Prototype implementation and evaluation — after scope agreement

- [ ] Set up the agreed project structure and development environment.
- [ ] Implement PostgreSQL Docker Compose setup and SQL schema/seed loading, including a documented safe demo-reset workflow.
- [ ] Seed staff accounts with password hashes and the agreed companies/departments/rooms; do not build administrative setup pages.
- [ ] Implement the agreed invitation and pass-issuance journey.
- [ ] Implement reception validation and the agreed host notification/approval behaviour.
- [ ] Implement floor-specific authorization through a clearly labelled elevator simulation.
- [ ] Implement the agreed dashboard and visit departure/status behaviour.
- [ ] Implement the agreed accessibility fallback and essential security/privacy controls.
- [ ] Use synthetic visitor data for demonstrations.
- [ ] Verify the complete successful journey against the agreed acceptance criteria.
- [ ] Use `web-view` to verify multi-tab updates, staff approval, pass replacement, simulated time, manual release, and mobile layouts.
- [ ] Verify camera scanning with a real QR presented to a camera; check LAN connectivity/camera access if using additional Wi-Fi devices.
- [ ] Verify relevant negative cases: invalid/expired/revoked passes, unauthorized floor access, QR reuse, and permission failures.
- [ ] Evaluate missing checkouts, duplicate scans, and integration failures where relevant to the agreed scope.
- [ ] Record evaluation results, limitations, and realistic future improvements.
- [ ] Prepare a reliable demo link or recording and a fallback for presentation-day connectivity or hardware problems.

## 7. Presentation and individual defence

- [ ] Draft the user-requested supporting report using the research summary, problem analysis, solution rationale, and design artifacts.
- [ ] Include the reviewed screen flow in the report.
- [ ] Include a low-fidelity wireframe/planning slide before the MVP demonstration and describe the actual planning decisions.
- [ ] Build a timed slide outline covering the problem, evidence, analysis, solution, alternatives, legal/ethical issues, sustainability, prototype, and references.
- [ ] Include all team names and student numbers on the cover slide and the required CCT cover page.
- [ ] Support key claims with Harvard citations and include a references slide.
- [ ] Show the working prototype and explain the real-integration boundary.
- [ ] Map presentation content to all five group rubric criteria.
- [ ] Allocate speaking roles and rehearse transitions with all group members.
- [ ] Rehearse the full presentation and demonstration within 12 minutes.
- [ ] Prepare Q&A covering the whole assignment: evidence, root causes, alternatives, costs, feasibility, security, privacy, accessibility, sustainability, limitations, and evaluation.
- [ ] Ensure each member can explain and defend the overall proposal.

## 8. Delivery

- [ ] Check factual claims, citations, readability, links, and consistency with the implemented prototype.
- [ ] Export the final presentation to PDF and verify the exported file.
- [ ] Verify cover details, references, demo access, and the presentation backup.
- [ ] Submit the final file through Moodle by 15 November 2026 at 23:59.
- [ ] Retain the submitted version and submission confirmation.
- [ ] Attend the live presentation and complete the individual Q&A.
