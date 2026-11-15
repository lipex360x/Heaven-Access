# Heaven Access presentation source

[Issue #37](https://github.com/lipex360x/Heaven-Access/issues/37) owns the presentation PDF, acceptance tasks and actual progress. This directory contains the editable docx_builder source and supporting assets. The current generated file is a **structure draft**, not a submission-ready presentation.

## Files and generation

- `content.yaml`: assessment/team fields, alphabetically ordered full names with matching student numbers, shared styles and the eight presentation-page slots. Dates on the cover are `15/11/2026`, as requested. This is not proof of a Moodle upload.
- `templates/CA Cover Sheet.docx`: byte-identical copy of the cover supplied by Felipe from his Virtualisation project. Its declaration is preserved; the actual submitters review the final cover before submission.
- `prepare_template.py`: derives `templates/Presentation-Template.docx` using python-docx. It keeps the CCT page portrait, adds a 16:9 landscape body section and labels the appended pages as a structure draft. It does not generate presentation content.
- `inputs/`: independently authored evidence/technical contributions for the assembler, following the issue's work packages.
- `assets/`: editable figure sources; `images/`: rendered figures for YAML.
- `output/Heaven-Access-Presentation-Structure.docx`: generated structural preview, opened in Microsoft Word. Do not upload this draft as the final PDF.

From the repository root, using the existing global document tools:

```sh
python3 docs/submission/prepare_template.py
docx_builder validate docs/submission --strict
docx_builder build docs/submission --no-finalize --open
```

The CLI scaffold was initialized in a temporary directory and only its document-directory layout was reused here. No CLAUDE configuration or extra application scaffold was installed in this repository. The final layout is flat: `docs/submission/content.yaml`, rather than a nested report project.

There is no report table of contents: the body is structured as eight presentation pages after the separate required CCT sheet. Existing v4 speaking slots/order remain unchanged. Visible content slots are authoring prompts, not finished analysis or a local task tracker; acceptance status stays in #37. Final text, figures, source checks, link behavior and page design still need the issue's review.

Before regenerating an open document, preserve Word edits and close that generated copy; edit the YAML rather than keeping competing Word-only content. Rebuilding replaces the output file. Native Word automation may be used to inspect pagination; docx_builder itself uses Word automation when exporting PDF.

When final content and layout have been reviewed, replace the draft markers/filename and export with the CLI, for example:

```sh
docx_builder build docs/submission --output output/Heaven-Access-Presentation.docx --pdf --open
```

That command is for the reviewed final source, not an assertion that the current placeholders are ready. Check every rendered PDF page, CCT/team cover details, actual public prototype hyperlink/access instructions and Harvard references before handing the artifact to #13 for Moodle submission. The 0.11.0 body URL rendering must be inspected; plain URL text alone does not prove an explicit clickable hyperlink.

## Cover provenance

Supplied source: `/Users/lipex360/www/cct/second_semester/virtualisation/ca2/report/templates/CA Cover Sheet.docx`.

Original/copy SHA-256: `e2ff81a5ab78bdd074967d33f7b128750cb6de6f5bf224f5f90874c054d4fd15`.

The copied original is portable with the repository. The source in the other project is never overwritten. The derived presentation template is rebuildable from this copy; only its value-cell styling and appended presentation section differ. The supplied declaration is not rewritten or treated as an independently verified student attestation.
