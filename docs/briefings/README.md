# Synchronized speaker briefings

Four editable English Word documents support the proposed eleven-minute presentation, including the prototype demonstration, with one minute left inside the brief's twelve-minute maximum. [Issue #13](https://github.com/lipex360x/Heaven-Access/issues/13) owns speaking-allocation decisions, rehearsal progress and review; these files are supporting rehearsal artifacts.

| Document | Proposed slot | Focus |
| --- | --- | --- |
| [Dani](Heaven-Access-Dani-Briefing.docx) | 00:00–02:30 | Origin, evidence and problem analysis |
| [Cris](Heaven-Access-Cris-Briefing.docx) | 02:30–05:00 | Creative process, alternatives and four-screen flow |
| [Felipe](Heaven-Access-Felipe-Briefing.docx) | 05:00–08:30 | Technical overview and demonstration |
| [Bella](Heaven-Access-Bella-Briefing.docx) | 08:30–11:00 | Legal/ethical responsibilities, evaluation and conclusion |

The required presentation PDF and its editable docx_builder source are assembled/reviewed under [issue #37](https://github.com/lipex360x/Heaven-Access/issues/37). Issue #13 retains speaking coordination, final briefing alignment, rehearsal/Q&A and actual Moodle submission confirmation. The speaker DOCX files do not replace the assessed presentation.

Each briefing contains the same project baseline and speaking map, personalized rehearsal wording and cues, a common whole-project Q&A, synchronized demo/rehearsal guidance and clickable reading references. Four deliberately separated sections are designed for four pages per document.

Version 5 (15 November 2026) is aligned with the numbered presentation at `docs/submission/output/Heaven-Access-Presentation.pdf`. The separate CCT assessment sheet is unnumbered; displayed presentation pages run 1/12 to 12/12. Dani covers 1–4 (title, short agenda, problem/proposal introduction and evidence); Cris 5–6 (alternatives and the one-page complete actor flow); Felipe 7–8 (actual UI and central validation/live demo); Bella 9–12 (responsibilities, evaluation/regular occupants and references). The bibliography is shown for the close/Q&A rather than read aloud. All four documents were repaginated in Microsoft Word and remain four pages each.

The existing speaking order and 00:00–11:00 target remain unchanged, with one minute of buffer. Dani’s cues now allocate ten seconds to the agenda and twenty-five seconds to the introductory problem/proposal. Felipe explains actors, central permission checks and shared results; framework/database/hosting details stay in the common reference/Q&A material. No timed rehearsal is claimed.

The baseline includes approval, private QR/download, eight-second shared gate/elevator opening, confirmed revocation and saved-image refusal. The dedicated reader can run on a second phone, with the private pass on the first phone and the display on a tablet. Bella explains her recurring-occupant question as future scope; staff application login is not an employee entry credential. **No video or recording fallback is planned**: use https://heaven-access.vercel.app and a live demonstration, with a prepared local build as backup. Automated synthetic-camera evidence remains separate from physical-device validation. Dani must confirm her first-person account; rehearse the handoffs and timing together.

Use `python3 docs/briefings/build_briefings.py` from the repository root to regenerate all four documents together with the existing `python-docx` library. Edit the source before regeneration; Word-only changes will otherwise be overwritten. Preserve any member's edited copy before regenerating and coordinate updates in #13. The generator is document tooling, not application implementation. Open finished DOCX files in Microsoft Word after each delivery.

The ACM reading note connects professional responsibilities to principles 1.2, 1.3 and 1.6. Incident, privacy and professional references are reading pointers; the selected Harvard bibliography is in the presentation under #37. The DPC report publication year was checked as 2012, and the ACM link uses its browser-verified canonical page. No claim of legal compliance, measured security improvement, representative prevalence, deployment cost or environmental saving is supplied.

The main demo shows one refusal: confirmed revocation with saved-image refusal, or expiry if chosen at rehearsal. Do not lengthen the demonstration to show every branch. Felipe identifies the scenario as a temporary visit; Bella briefly explains recurring employee credentials during her existing closing/evaluation slot. All four Q&A sections include the distinction. No employee enrollment, recurring credentials or biometric implementation is supplied.
