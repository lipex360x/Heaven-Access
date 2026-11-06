# Heaven Access — Guided Parallel Workstreams

Working-session approach, 6 November 2026. Felipe guides the group during today's work. The [board](https://github.com/users/lipex360x/projects/19/views/2) and issue labels hold the current allocation and progress; this document explains collaboration and handoffs rather than maintaining another checklist. The backlog is consolidated into two lead issues per member.

## Responsibilities and support

| Member | Focus | Support and fallback |
| --- | --- | --- |
| Bella | Focused legal/privacy/ethical review and review of report wording/English | The group assembles the report base together from the existing evidence and design. Felipe and Cris can prepare essential source-backed legal content and coordinate the report if the reviewer is unavailable. Keep work in shared files and issues so preparation can continue. |
| Cris | One simple shared layout, the mobile visitor view, and a lightweight slide deck | Start with the existing wireframes and mock states. Use ordinary components and a simple slide template. Dani helps with forms/components; Felipe supplies API/QR state. Bella helps with English/legal wording when available. |
| Dani | Public registration/staff screens and a guided end-to-end test walkthrough | Felipe handles SQL/Compose, authentication internals, permissions and troubleshooting. Dani focuses on form fields, status messages, buttons and recording the sample journey; she supplies example destination data without owning infrastructure. |
| Felipe | Scope/architecture decisions, local setup, core access validation and integration | Guide the group and define a small shared data/state contract first. Own PostgreSQL/SQL seed, authentication, QR lifecycle, device validation, fictional clock and realtime integration. Keep the frontend contract simple so Dani and Cris can progress independently. |

Owner labels indicate the planned lead, not that work is already underway. Confirm changes and handoffs in the issue. Backup contributors continue existing artifacts before reassigning ownership; record the handoff when a lead changes.

## Today's collaboration

1. Begin together: settle the remaining visitor rules and choose the simplest architecture. This is still planning until Felipe explicitly authorizes implementation.
2. Start the shared report and simple slide outline from the current research and diagrams immediately; add actual results later. Legal/text review is a small contribution to shared material rather than a prerequisite for drafting everything else.
3. After authorization, Felipe builds the local foundation. Dani prepares operational forms and Cris prepares layouts/mobile states against an agreed example payload, avoiding dependency on an unfinished backend.
4. Integrate one successful journey first: request → approval → QR → camera scan → access. Then add the required expiry, replacement, manual-release and demo-clock paths.
5. Walk through the complete flow together, capture evidence and rehearse. Spend remaining time on defects affecting that journey before visual polish or extra features.

The system baseline remains small: four interfaces, local PostgreSQL, simulated delivery/device and live state updates. No extra administration, occupancy dashboard, hardware integration or complex slide/animation system is needed for this baseline.

## Shared artifacts and handoffs

- Bella contributes concise legal findings and wording with authoritative sources. Any remaining points are visible to the group in the legal issue.
- Cris contributes reusable visual choices, mobile screen states and an editable simple deck. About eight slides is a starting target, not a fixed assessment rule.
- Dani contributes the operational screens, sample inputs and a short record of actual test results/screenshots.
- Felipe contributes runnable setup, server/event contracts, technical explanation and a reliable demo/fallback recording with the group's help.
- Each member can locate the latest work through the issue/PR. Keep the report/deck editable and shared; do not hold essential content only in a private copy.

## Presentation preparation

Use short speaking parts and one concise demonstration within the 12-minute limit. A starting split is Cris 2 min 30 s for problem/visuals, Felipe 2 min 30 s for the technical demo, Dani 2 min 30 s for operation/results, and Bella 3 min for legal/ethical considerations and closing, leaving 1 min 30 s for transitions. Rehearse and adjust together in the presentation issue.

All members need to understand the whole solution for Q&A. Shared preparation and backup ownership keep artifacts moving when availability changes; speaking parts and attendance remain a team responsibility.

## Contribution provenance

Dani supplied the initial research-led comparison of alternatives and the QR-plus-elevator concept, as confirmed by Felipe. Preserve this credit in the planning narrative. External factual/legal claims still need traceable sources, and evaluation claims must reflect tests actually performed.
