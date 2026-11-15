# Problem, investigation and alternatives: presentation input

This content uses the selected source register S01–S02 and the project decisions recorded in #1/#12. It does not introduce an interview study, site audit, incident rate or new cost evidence.

## Problem and evidence

Heaven Access considers temporary visitors in commercial office buildings. Dani's reported security-work experience at more than one workplace supplied the initial question: how can reception's visit approval be reliably connected to authorisation at an access point? This is reported professional experience, not a representative survey.

The RBS office incident demonstrates a specific failure mode: people followed authorised staff into a controlled area before an attempted bicycle theft was interrupted (The Newsroom, 2018). It also exposes a limit: an individual credential does not itself prevent someone accompanying its holder. The Irish Revenue laptop case separately illustrates physical-security consequences after forced entry; the equipment was encrypted and later recovered, so it is not evidence that our visitor software would have prevented that incident (Data Protection Commissioner, 2012, pp. 16–17).

Our root-cause hypothesis is a gap between visit approval and access-point validation. The stakeholders are visitors, reception/security staff, office occupants and building management. The method is reported professional experience, desk research and comparison/sketching of options. We did not measure prevalence or inspect a particular building to confirm the hypothesis.

## Solution reasoning

The group discussion and small sketch considered reception procedures, QR-only registration, physical barriers, elevator authorisation and camera-based detection. The current proposal combines staff approval, a destination/time-limited credential and a simulated checkpoint. QR-only registration leaves bypass routes; a physical turnstile introduces installation and safety dependencies; an elevator link depends on vendor interfaces; camera-based detection adds privacy/accuracy questions. These are design comparisons, not verified price estimates or product tests.

The working prototype therefore validates authorisation rather than claiming total physical prevention. If elevator integration is unavailable, a suitable turnstile is an alternative to investigate, not hardware already integrated. The main benefit demonstrated is coherent permission checking and recorded authorisation counts. Tailgating, shared codes and alternative entry routes remain risks.
