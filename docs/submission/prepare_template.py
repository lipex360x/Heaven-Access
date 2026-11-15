"""Derive the presentation template without changing the supplied CCT cover."""
from pathlib import Path
from docx import Document
from docx.enum.section import WD_ORIENT, WD_SECTION_START
from docx.enum.style import WD_STYLE_TYPE
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "templates" / "CA Cover Sheet.docx"
OUTPUT = ROOT / "templates" / "Presentation-Template.docx"


def main():
    document = Document(SOURCE)
    style = document.styles.add_style("Cover Value", WD_STYLE_TYPE.PARAGRAPH)
    style.font.name = "Arial"
    style.font.size = Pt(10)
    style.paragraph_format.space_after = Pt(2)
    style.paragraph_format.line_spacing = 1
    for row in document.tables[0].rows:
        row.cells[1].paragraphs[0].style = style
    # Keep the provided cover portrait. Only appended presentation pages are 16:9.
    section = document.add_section(WD_SECTION_START.NEW_PAGE)
    section.orientation = WD_ORIENT.LANDSCAPE
    section.page_width = Inches(13.333)
    section.page_height = Inches(7.5)
    section.top_margin = section.bottom_margin = Inches(0.55)
    section.left_margin = section.right_margin = Inches(0.7)
    section.header_distance = section.footer_distance = Inches(0.25)
    section.header.is_linked_to_previous = False
    section.footer.is_linked_to_previous = False
    for paragraph, label in [
        (section.header.paragraphs[0], "HEAVEN ACCESS | STRUCTURE DRAFT"),
        (section.footer.paragraphs[0], "Draft structure - not the submission file"),
    ]:
        run = paragraph.add_run(label)
        run.font.name = "Arial"
        run.font.size = Pt(9)
    document.save(OUTPUT)
    print(OUTPUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
