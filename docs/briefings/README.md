# Synchronized speaker briefings

Four editable English Word documents support the proposed eleven-minute presentation, including the prototype demonstration, with one minute left inside the brief's twelve-minute maximum. [Issue #13](https://github.com/lipex360x/Heaven-Access/issues/13) owns speaking-allocation decisions, rehearsal progress and review; these files are supporting rehearsal artifacts.

| Document | Proposed slot | Focus |
| --- | --- | --- |
| [Dani](Heaven-Access-Dani-Briefing.docx) | 00:00–02:30 | Origin, evidence and problem analysis |
| [Cris](Heaven-Access-Cris-Briefing.docx) | 02:30–05:00 | Creative process, alternatives and four-screen flow |
| [Felipe](Heaven-Access-Felipe-Briefing.docx) | 05:00–08:30 | Technical overview and demonstration |
| [Bella](Heaven-Access-Bella-Briefing.docx) | 08:30–11:00 | Legal/ethical responsibilities, evaluation and conclusion |

Each briefing contains the same project baseline and speaking map, personalized rehearsal wording and cues, a common whole-project Q&A, synchronized demo/rehearsal guidance and clickable reading references. Four deliberately separated sections are designed for four pages per document.

Version 1 is a planning draft, not a report of a working prototype or completed testing. The final deck/build and issue #11 evidence must replace planning/result statements before live delivery. Dani must confirm any first-person account. The technical contract, including a five-second unlock, has been accepted as design. This is not evidence of implementation or tests. Speaking allocations still require team agreement/rehearsal.

Use `python3 docs/briefings/build_briefings.py` from the repository root to regenerate all four documents together with the existing `python-docx` library. Edit the source before regeneration; Word-only changes will otherwise be overwritten. Preserve any member's edited copy before regenerating and coordinate updates in #13. The generator is document tooling, not application implementation. Open finished DOCX files in Microsoft Word after each delivery.

The short ACM reading note connects professional responsibilities to principles 1.2 and 1.6. Incident, privacy and professional references are reading pointers; final Harvard citations/bibliography still belong to #12/#13. No claim of legal compliance, measured security improvement, representative prevalence, deployment cost or environmental saving is supplied.
