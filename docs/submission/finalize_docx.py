"""Add explicit external hyperlinks and clean metadata after docx_builder build.

Version 0.11.0 renders body URLs as text. This targeted pass preserves the
CLI-generated layout and makes the prototype/bibliography URLs clickable.
"""
import re
from copy import deepcopy
from pathlib import Path
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from docx.shared import Pt

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "output" / "Heaven-Access-Presentation.docx"


def main():
    document = Document(OUTPUT)
    # The supplied template already separates the portrait assessment cover
    # from the landscape body. Number the body from one, excluding the cover.
    document.sections[0].footer.paragraphs[0].clear()
    body_section = document.sections[1]
    number_type = body_section._sectPr.find(qn('w:pgNumType'))
    if number_type is None:
        number_type = OxmlElement('w:pgNumType')
        body_section._sectPr.insert_element_before(number_type, 'w:cols', 'w:docGrid')
    number_type.set(qn('w:start'), '1')
    # The CLI emits a separate normal-sized paragraph for every page break.
    # Move that break onto the next paragraph so it cannot create an empty page.
    paragraphs = document.paragraphs
    for index, paragraph in enumerate(paragraphs[:-1]):
        breaks = paragraph._p.xpath('.//w:br[@w:type="page"]')
        if breaks and not paragraph.text.strip():
            paragraphs[index + 1].paragraph_format.page_break_before = True
            paragraph._p.getparent().remove(paragraph._p)
        elif paragraph._p.xpath('.//w:drawing'):
            paragraph.paragraph_format.space_before = Pt(0)
            paragraph.paragraph_format.space_after = Pt(0)
            paragraph.paragraph_format.line_spacing = 1
    count = 0
    for paragraph in document.paragraphs:
        text = paragraph.text
        matches = list(re.finditer(r'https://[^\s]+', text))
        if not matches:
            continue
        props = deepcopy(paragraph.runs[0]._r.rPr) if paragraph.runs else None
        for child in list(paragraph._p):
            if child.tag != qn('w:pPr'):
                paragraph._p.remove(child)
        cursor = 0
        for match in matches:
            run = paragraph.add_run(text[cursor:match.start()])
            if props is not None:
                run._r.insert(0, deepcopy(props))
            url = match.group()
            link = OxmlElement('w:hyperlink')
            link.set(qn('r:id'), paragraph.part.relate_to(url, RT.HYPERLINK, is_external=True))
            run_xml = OxmlElement('w:r')
            if props is not None:
                run_xml.append(deepcopy(props))
            text_xml = OxmlElement('w:t')
            text_xml.text = url
            run_xml.append(text_xml)
            link.append(run_xml)
            paragraph._p.append(link)
            cursor = match.end()
            count += 1
        run = paragraph.add_run(text[cursor:])
        if props is not None:
            run._r.insert(0, deepcopy(props))
    document.core_properties.title = 'Heaven Access Presentation'
    document.core_properties.subject = 'Project Skills & Professionalism'
    document.core_properties.author = 'Heaven Access group'
    document.core_properties.keywords = 'Visitor authorisation, simulated access, academic prototype'
    document.core_properties.comments = ''
    document.save(OUTPUT)
    print(f'Finalized {count} explicit external hyperlinks: {OUTPUT.name}')


if __name__ == '__main__':
    main()
