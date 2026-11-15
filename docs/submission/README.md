# Heaven Access presentation source

[Issue #37](https://github.com/lipex360x/Heaven-Access/issues/37) owns the presentation PDF, acceptance tasks and review evidence. [Issue #13](https://github.com/lipex360x/Heaven-Access/issues/13) owns final briefing alignment, rehearsal, live Q&A and Moodle upload/confirmation. File generation does not establish submission.

## Presentation artifacts

- `output/Heaven-Access-Presentation.pdf`: current presentation for review/submission, subject to the final review gates in #37.
- `output/Heaven-Access-Presentation.docx`: editable generated document, automatically opened in Microsoft Word after export.
- `content.yaml`: English content, alphabetically ordered cover names with matching student numbers, styles, figures, citations and bibliography. Both cover dates are `15/11/2026`, as requested, without a time.
- `templates/CA Cover Sheet.docx`: the unchanged supplied CCT cover. `prepare_template.py` derives `templates/Presentation-Template.docx`, preserving the portrait cover and adding landscape presentation pages.
- `finalize_docx.py`: targeted post-build pass for explicit external hyperlinks, page-break/figure spacing and body-only numbering. docx_builder 0.11.0 emits plain body URLs and separate normal-sized page-break paragraphs; this pass makes links explicit and prevents unintended overflow/blank pages before Word export.
- `assets/`: editable SVG illustrations, their Python authors and browser-renderable HTML. `images/`: portable PNG renders and sanitised UI captures used by YAML.
- `inputs/`: prepared evidence, verified sources and implementation/evaluation facts. `../legal-ethical-note.md` contains the fuller academic analysis.
- `output/Heaven-Access-Presentation-Structure.docx`: historical structural preview, retained for provenance. It is **not** the presentation to upload.

Presentation pages are explicitly numbered 1 / 12 through 12 / 12; the CCT assessment sheet is excluded. The body has twelve presentation pages after the separate CCT assessment sheet: title, agenda, introductory problem/proposal, research/evidence, alternatives, complete actor flow, actual prototype views, shared access decision/demo, responsibilities, evaluation/future needs, and two reference pages. The brief sets a twelve-minute live limit including the demo, not a fixed slide count. The agenda/intro introduce the existing narrative rather than creating extra speaking time.

## Rebuild

Use the agreed docx_builder 0.11.0 installation and Python with python-docx. No application/database startup is needed for document assembly. From the repository root:

```sh
python3 docs/submission/prepare_template.py
docx_builder validate docs/submission --strict
docx_builder build docs/submission --no-finalize
python3 docs/submission/finalize_docx.py
docx_builder export pdf docs/submission --open
```

Run the finalisation pass after every build; rebuilding replaces the DOCX and its explicit links. PDF export requires macOS and Microsoft Word. On another machine, use its own paths and tools; #37 documents the pinned CLI/Python setup and export handoff. Preserve any Word-only edits before rebuilding. Edit the YAML/SVG sources rather than keeping competing versions.

The exporter passes a full PDF filename to Word in `~/Library/Caches/docx_builder/exports/` and moves the result afterwards. A fixed directory does not itself grant Word folder access: version 0.11.0 has no directory-authorisation/persistence step. File-specific macOS/Word prompts may still occur. This repository does not change the CLI or grant permissions on behalf of the user.

Inspect the actual exported PDF for page count and layout. The CLI's Spotlight-based count can lag; for example, `pdfinfo output.pdf` reports the file itself. Do not trust cached DOCX page metadata. Check final links as actual PDF annotations, not merely visible text.

## Visual and source provenance

`problem-story`, `solution-options`, `demo-architecture`, `responsibility-cards`, `evaluation-story`, `presentation-route` and `problem-proposal-introduction` are project-authored explanatory illustrations, not screenshots or drawings of an audited building. `actor-flow` is the complete implemented actor/responsibility flow on one page. The diagram named `demo-architecture` now explains actors, central validation and shared results; stack names remain supporting Q&A material.

The SVG/HTML/PNG assets are portable and sufficient to rebuild the document. Regenerating the illustration author scripts additionally uses Pillow and an installed Arial font; their current font path is macOS-specific. SVGs can instead be edited directly on another machine. The flow author uses Python's standard library. Render HTML through a separate headless Chrome/CDP profile at 1600x650, or 1600x720 for the actor flow; capture the whole fixed-size page without browser chrome. Preserve unrelated browser instances.

`reception-approved.png`, `visitor-pass-sanitized.png` and `gate-granted.png` are actual hosted UI captures from 15 November 2026, composed into `prototype-screens.png`. They use fictional Alex Demo details. The private pass QR is intentionally covered before publication; raw private pass images/URLs are not repository artifacts. The gate result was triggered using the existing server validation API, not a physical-camera test. The capture visit was subsequently revoked and the shared device observed locked with its clock revision unchanged. The original private captures remain transient outside the repository.

Only ten sources from the larger verified source pack are cited. The final presentation's four undated Data Protection Commission entries have alphabetical title suffixes: n.d.-a = DPIA (S08), n.d.-b = Data Security (S07), n.d.-c = Lawful processing (S05), n.d.-d = Transparency (S06). These differ from the six-entry input register's suffixes; follow each document's matching bibliography. S09, S10 and optional S13 are not copied into the presentation.

The source register records actual reading and access limits. The final ACM link was re-tested headlessly and encountered Cloudflare; its content had been read earlier that day in visible Chrome. An embedded valid hyperlink cannot guarantee that the publisher will allow automated access. The remaining selected sources and public prototype link were revisited during final-file review. Do not describe a blocked request as a successful fresh read.

## Cover provenance and final review

Supplied source: `/Users/lipex360/www/cct/second_semester/virtualisation/ca2/report/templates/CA Cover Sheet.docx`.

Original/copy SHA-256: `e2ff81a5ab78bdd074967d33f7b128750cb6de6f5bf224f5f90874c054d4fd15`.

The external original and copied declaration are unchanged. The actual submitter must review the populated cover/declaration; a generated date is not evidence of Moodle upload. Final DOCX/PDF artifacts must contain no unfinished labels or authoring placeholders. Review actual rendered pages, headers/footers, metadata, fields, revisions/comments, team details, diagrams, captions, citations and hyperlinks. Live compliance, physical-camera validation, timing rehearsal and upload must not be inferred from a document build.
