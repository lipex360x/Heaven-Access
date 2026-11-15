# Synchronized speaker briefings

Four editable English Word documents support the proposed eleven-minute presentation, including the prototype demonstration, with one minute left inside the brief's twelve-minute maximum. [Issue #13](https://github.com/lipex360x/Heaven-Access/issues/13) owns speaking-allocation decisions, rehearsal progress and review; these files are supporting rehearsal artifacts.

| Document | Proposed slot | Focus |
| --- | --- | --- |
| [Dani](Heaven-Access-Dani-Briefing.docx) | 00:00–02:30 | Origin, evidence and problem analysis |
| [Cris](Heaven-Access-Cris-Briefing.docx) | 02:30–05:00 | Creative process, alternatives and four-screen flow |
| [Felipe](Heaven-Access-Felipe-Briefing.docx) | 05:00–08:30 | Technical overview and demonstration |
| [Bella](Heaven-Access-Bella-Briefing.docx) | 08:30–11:00 | Legal/ethical responsibilities, evaluation and conclusion |

Each briefing contains the same project baseline and speaking map, personalized rehearsal wording and cues, a common whole-project Q&A, synchronized demo/rehearsal guidance and clickable reading references. Four deliberately separated sections are designed for four pages per document.

Version 4 (15 November 2026) reflects the local and hosted form-based workflow, private pass/QR download, shared tablet gate/elevator display, confirmed revocation, the dedicated second-phone QR reader and recorded automated/browser evidence, including the maintained self-checking browser test. Bella explains the temporary-visitor boundary and her recurring-occupant access question as future work; staff application login is not an employee entry credential. Speaker order, topics and proposed timing are unchanged. **No video or recording fallback is planned**: use an online application link/live demonstration with a prepared local build as backup. The stable Vercel + Neon URL is https://heaven-access.vercel.app. Openings last eight real seconds; the approved visitor page prioritizes the QR and download. The final deck and physical verification of the new dedicated reader remain separate; Felipe reports successful online tests. Recheck issue #11 and synchronize all four documents with the final build/deck before delivery. Dani must confirm her first-person account; rehearse handoffs/timing together.

Use `python3 docs/briefings/build_briefings.py` from the repository root to regenerate all four documents together with the existing `python-docx` library. Edit the source before regeneration; Word-only changes will otherwise be overwritten. Preserve any member's edited copy before regenerating and coordinate updates in #13. The generator is document tooling, not application implementation. Open finished DOCX files in Microsoft Word after each delivery.

The short ACM reading note connects professional responsibilities to principles 1.2 and 1.6. Incident, privacy and professional references are reading pointers; final Harvard citations/bibliography still belong to #12/#13. No claim of legal compliance, measured security improvement, representative prevalence, deployment cost or environmental saving is supplied.

The main demo shows one refusal: confirmed revocation with saved-image refusal, or expiry if chosen at rehearsal. Do not lengthen the demonstration to show every branch. Felipe identifies the scenario as a temporary visit; Bella briefly explains recurring employee credentials during her existing closing/evaluation slot. All four Q&A sections include the distinction. No employee enrollment, recurring credentials or biometric implementation is supplied.
