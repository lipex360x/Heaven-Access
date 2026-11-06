# Heaven Access — Proposed Parallel Work Allocation

Proposal for team discussion, 6 November 2026. This document explains the suggested workstreams and handoffs. It is not a live assignment/status tracker. [Issue #1](https://github.com/lipex360x/Heaven-Access/issues/1), individual issues, their owner labels, and the [board](https://github.com/users/lipex360x/projects/19/views/2) are the Source of Truth for accepted allocation and progress. No ownership labels are applied merely because this proposal exists.

## Workstreams

| Member | Proposed lead | Concrete contribution | Collaboration / review |
| --- | --- | --- | --- |
| Bella | Legal/ethical analysis and report coordination | Research privacy obligations and lawful basis; develop notice wording, retention rationale, accessibility/ethical recommendations and DPIA assessment; assemble the report using inputs from everyone | Apply her legal background while verifying Irish/EU sources and avoiding unsupported compliance claims. Review English wording and help the whole team rehearse. Felipe checks technical claims; Cris supplies evidence and visuals. |
| Cris | Layout, research evidence and presentation visuals | Refine wireframes and user-facing layout; develop the visitor-page UI with agreed mock states; curate incident evidence/citations; assemble visual slides | Dani supports component/form implementation and reviews UI changes. Felipe supplies pass/state contracts and backend integration. Bella reviews privacy content and English. |
| Dani | Database bootstrap, operational interfaces and validation | SQL schema/seed setup after model agreement; public registration and staff-interface work; coordinate end-to-end test scenarios and evidence | Build on her initial research and solution comparison. Felipe implements/reviews authentication and authorization internals; Cris provides layout; Bella reviews privacy requirements. |
| Felipe | Architecture, security-critical backend and integration | Define shared contracts; establish the application structure after authorization; implement approval enforcement, QR lifecycle, access simulator validation, controlled demo time and realtime integration | Keep server authorization and credential logic coherent. Review database and interface integration with Dani, support Cris with state/data contracts, and supply accurate technical material for the report. Coordinate final delivery. |

These are leads rather than isolated silos. Every member needs to understand the full solution and defend it during Q&A. Avoid making Felipe responsible for all implementation: Dani owns concrete deliverables and Cris can advance visual work against mock data before the backend is ready.

## Parallel execution and handoffs

### During planning

- Felipe facilitates scope and architecture decisions with the group, especially roles, pass reuse, time windows, renewal and manual override.
- Bella researches legal/privacy requirements and drafts the corresponding report content.
- Cris refines layout, flow presentation and the evidence register in `references.md`.
- Dani reviews the domain model, operational user journeys and acceptance scenarios, drawing on her initial research.
- Each lead records unresolved decisions in the relevant GitHub issue. Document work can progress now; application implementation still needs explicit authorization.

### After architecture agreement and implementation authorization

Agree shared contracts first: destination identifiers, visit states, public/staff/visitor/device access boundaries, credential responses, error reasons and realtime events. Record them in the architecture issue and a supporting technical artifact if needed.

Then work concurrently:

1. Felipe establishes the minimum runnable structure and server contracts, then builds core authorization/pass/device/realtime behaviour.
2. Dani builds the SQL/bootstrap and operational registration/staff interfaces against those contracts, using mock states where needed.
3. Cris develops the visual system and visitor-pass layout using pending, approved, expired and invalid mock states, then connects it with Felipe/Dani's support. Mock QR images are visual placeholders, not working access credentials.
4. Bella assembles legal/ethical analysis and the report, incorporating the actual implemented controls as they become available.

For shared issues, name one primary owner and list collaborators with explicit boundaries. In particular: Dani leads the staff interface while Felipe owns authentication/authorization internals; Cris leads the mobile pass UI while Felipe owns token issuance/validation. Related PRs use non-closing issue references until the whole acceptance checklist is met.

### Integration and validation

- Dani coordinates the full multi-tab walkthrough and records actual results.
- Felipe checks server permissions, QR renewal/revocation, time-boundary behaviour, competing scans and reconnect consistency.
- Cris reviews mobile layout, clarity of status messages and usability; help exercise the real camera path.
- Bella reviews the implemented privacy journey, data exposure and consistency between the report and demonstrated behaviour.
- All members rehearse the entire flow and review the limitations. Report and slide drafts start early, then receive the verified results; they do not wait for the last integration day.

## Presentation proposal

| Order | Speaker | Focus | Initial time budget |
| --- | --- | --- | --- |
| 1 | Cris | Problem, evidence, alternatives and visual planning | 2 min 30 s |
| 2 | Felipe | Short architecture explanation and live successful/expired-pass demonstration | 2 min 30 s |
| 3 | Dani | Operational flow, manual assistance, validation results and limitations | 2 min 30 s |
| 4 | Bella | Legal/ethical analysis, sustainability trade-offs and conclusion | 3 min |

This totals 10 min 30 s, leaving 1 min 30 s for transitions and contingency within the 12-minute limit. Refine the content and timing in the presentation issue. Bella can help polish phrasing and prepare shared Q&A practice; each member still answers questions about the whole proposal. Use a concise rehearsed technical demo to reduce Felipe's speaking burden while preserving a substantive contribution.

## Contribution provenance

Dani supplied the original research-led comparison of access-control alternatives and the suggested QR-plus-elevator concept, as confirmed by Felipe. Credit this contribution in the group's planning narrative. External factual/legal claims still require traceable sources; do not present the initial internal proposal as independent published evidence.
