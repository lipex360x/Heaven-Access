"""Build synchronized English speaker briefings; document tooling only."""
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT = Path(__file__).resolve().parent
VERSION = 'Presentation briefing v6 • 15 November 2026'
ISSUE = 'https://github.com/lipex360x/Heaven-Access/issues/13'
SPEAKERS = {
'Dani': ('Daniela Alves Paiva da Silva', '2026048', '00:00–02:30', 'Pages 1–4: title, agenda, problem/proposal and evidence'),
'Cris': ('Marcia Cristina Schafer dos Santos', '2026005', '02:30–05:00', 'Pages 5–6: alternatives and complete actor flow'),
'Felipe': ('Felipe Borges Bambirra', '2026033', '05:00–08:30', 'Pages 7–8: prototype and central access decision/demo'),
'Bella': ('Isabella Maria de Souza Monteiro', '2026072', '08:30–11:00', 'Pages 9–12: responsibilities, evaluation, references and close'),
}
SCRIPT = {
'Dani': [
'Good morning. We are Daniela, Marcia Cristina, Felipe and Isabella. Our project is Heaven Access: a visitor-authorization proposal for commercial buildings containing offices.',
'Our route is the challenge, the proposal, the live demonstration and the evaluation. In this office-building scenario, a visitor may reach a controlled floor without the visit being checked. We propose connecting reception approval to a destination/time check at the access point. The on-screen gate/elevator is a simulation.',
'The idea came from my work in security, where I have experienced this type of access-control problem at more than one workplace. We used that experience to frame the question, then examined published cases. We are not presenting my experience as a statistical survey, and we are not identifying employers.',
'Visitors need clear decisions and assistance. Reception and security need consistent permission checks and reliable records. Office occupants need appropriate visitor access, while building management must consider safety and operations. Our root-cause hypothesis is a gap between visit approval and checkpoint validation. These stakeholder needs are our design analysis, not interview findings or a site audit.',
'One relevant case involved people following employees through card-controlled doors at RBS premises in Edinburgh. Security interrupted the attempted theft. This demonstrates a real workplace access problem, and also shows that a credential does not stop someone following an authorized person. An Irish DPC report separately describes stolen office laptops after forced entry; that illustrates consequences beyond our direct protection.',
'We do not know how common these incidents are across office buildings. Our aim is narrower: demonstrate a clearer connection between an approved visit, its destination, its time window and an access decision.',
'Cris will now explain how our group developed the proposal and compared the alternatives.'
],
'Cris': [
'We developed the idea through group discussion and a small initial sketch. We compared physical barriers, QR visitor registration, elevator authorization, camera-based detection and reception procedures. We did not conduct a formal design workshop or claim a new access-control invention.',
'A turnstile adds a physical checkpoint, but introduces hardware and installation requirements. A QR registration system is easier to demonstrate, but a code on its own does not stop someone bypassing reception. Elevator authorization could connect an approved visit to a floor, but only if the equipment supports a suitable interface. Camera-based detection brings additional privacy and accuracy questions. Reception procedures remain important in every option.',
'Our choice combines staff approval with a time-limited QR and a simulated access checkpoint. Where an elevator interface is unavailable, a suitable turnstile is a deployment alternative to investigate. We have not confirmed compatibility, costs or installation approval.',
'The four screens show one journey. First, the visitor submits a name, destination and visit time after acknowledging the privacy notice. Second, authenticated reception staff approve or reject it, and can revoke an approval. Third, the visitor sees the mobile pass. Fourth, a camera-enabled simulator sends the QR for a server-side destination and time check.',
'The agreed window is thirty minutes before to thirty minutes after the visit, including both endpoints, using Dublin time. The QR may be reused within that window, and successful access authorizations are counted. After expiry, the visitor needs a new request and approval.',
'The prototype covers temporary visitors in one building. A second phone can use the dedicated QR reader while a tablet shows the gate or elevator, sharing one access decision. Felipe will now explain the technical setup and demonstrate the journey.'
],
'Felipe': [
'The screens ask one central server whether access is allowed. It checks the visit permission and records the result, so reception, the reader and the display share the same decision. Framework, database and hosting details are supporting Q&A material, not the main explanation.',
'I demonstrate a temporary visitor: I submit fictional details through the public form. The private pass starts pending, without a QR. I approve the request in reception, and the phone page displays the QR, with an option to download its image.',
'I present the first phone’s QR to the dedicated reader on a second phone. The server checks approval, revocation, destination and time. The tablet shows the same simulated gate or elevator opening for eight real seconds, then closing. A successful opening adds one QR authorization; repeated camera frames do not inflate the count.',
'For the refusal example, I revoke the approval in reception and confirm. The visitor page removes its QR; a previously downloaded image is also refused. Earlier access counts remain. Expired passes are refused too and need a new request.',
'If time permits, I show a deliberate repeat or a separately counted manual release, with a staff reason and confirmation. Gate and elevator are visualizations of one simulated device, not hardware integrations or proof of physical passage or identity. Bella will explain the responsibilities and limitations.'
],
'Bella': [
'Our design needs to be assessed beyond whether the QR can be scanned. We collect a visitor name, destination and visit time. The prototype uses fictional visitor details and provides a notice explaining its actual processing. Camera frames are decoded locally, without recording or uploading footage.',
'The agreed form interaction is an initially unchecked confirmation that the visitor has read the privacy notice. It is required before submitting and saving a request. That acknowledgement is not consent as a legal basis and is not proof of GDPR compliance. DPC guidance distinguishes transparency from the legal grounds for processing. A live deployment would need a justified basis, a complete notice, appropriate retention and deletion, security, and an assessment of whether a DPIA is required.',
'Reception can make an explicit assisted manual release with a reason and confirmation. It is counted separately and does not approve or renew a visit. This does not promise anonymous entry. Professional responsibility includes protecting privacy, avoiding harm and honestly describing limitations, as reflected in the ACM Code of Ethics.',
'Local and hosted tests verified forms, pass updates, expiry and revocation refusal, repeated-request protection and separate access counts. A maintained browser test used synthetic video for decoding, synchronized opening and saved-QR refusal. Felipe reports successful online tests; the new reader’s physical camera check remains separate. These results do not measure real incident reduction.',
'Possible savings in paper or disposable passes must be weighed against devices, hosting, installation and maintenance. We have no measured environmental saving or verified deployment cost.',
'A further design question for our proposal is access for employees and other regular occupants. Our prototype covers temporary visitors; recurring credentials with destination and schedule rules would be future work. They must remain revocable. Tailgating, shared codes and other routes remain risks. Our references are shown here; thank you.'
],
}
CUES = {
'Dani': [('00:00–00:10','Page 1: title; names are visible, avoid reading the full table.'),('00:10–00:20','Page 2: agenda in one sentence.'),('00:20–00:45','Page 3: setting, problem and proposed solution.'),('00:45–01:15','Page 4: professional experience and method.'),('01:15–02:10','Main case, stakeholders and root-cause hypothesis.'),('02:10–02:30','Scale/scope limit and handoff to Cris.')],
'Cris': [('02:30–03:15','Actual discussion/sketch and alternatives.'),('03:15–04:00','Why this combination; integration contingency.'),('04:00–04:45','Four screens and accepted visit rules.'),('04:45–05:00','Single-building scope and handoff to Felipe.')],
'Felipe': [('05:00–05:25','Pages 7–8: central validation in plain language; stack only if asked.'),('05:25–06:15','Request, pending state, approval and QR.'),('06:15–07:15','Actual camera scan, unlock and access count.'),('07:15–08:10','Confirmed revocation/refusal, or rehearsed expiry; optional manual branch.'),('08:10–08:30','Simulation boundary and handoff to Bella.')],
'Bella': [('08:30–09:30','Privacy interaction and live-deployment obligations.'),('09:30–10:00','Accessibility and professional responsibility.'),('10:00–10:35','Recorded test findings, viability/sustainability limits.'),('10:35–11:00','Visitor-only boundary, recurring-occupant needs and references.')],
}
QA = [
('Who are the key stakeholders?', 'Visitors need clear decisions and assistance; reception/security need consistent checks and records; occupants need appropriate visitor access; management needs safe, viable operation. These needs are design analysis, not survey findings.'),
('What does Heaven Access solve?', 'It connects a requested visit, staff approval, destination and time window to a server-side access decision. It does not establish that every unauthorized entry is prevented.'),
('How did you investigate the problem?', 'Dani supplied professional experience; the group discussed/sketched options and used published cases. There was no formal interview study, site audit or representative incident survey.'),
('What is original about the proposal?', 'The group applies established visitor-pass and access-control ideas to this office-building scenario. The value to evaluate is the integrated workflow, not an invented claim that QR access is new.'),
('Why Next.js and PostgreSQL?', 'One application contains UI and server routes; PostgreSQL holds shared persistent state. This reduces separate services. Automatic updates use approximately one-second polling.'),
('Can a visitor enter without approval or outside the window?', 'QR authorization must be refused. An authenticated manual release is a distinct staff override and must remain separately identifiable; it does not approve or renew the visit.'),
('What happens after expiry, revocation or repeated scans?', 'Reuse is allowed within the ±30-minute window. Revocation blocks future QR openings, including saved images; it records actor/time and preserves history. An opening already granted finishes normally. Expiry or revocation requires a new request. Count unlocks, not repeated frames or refusals.'),
('How do employees and regular occupants fit?', 'Bella raised this gap. The implemented flow is for temporary visitors. A future recurring credential would have permitted destinations/schedules, review and revocation, without daily visitor requests. It is not an indefinitely extended visitor QR, does not require biometrics and is not implemented. Staff login authorizes operating the app, not employee physical entry.'),
('Does the checkbox make processing lawful?', 'No. It acknowledges the privacy notice. The lawful basis and complete live-deployment privacy requirements need separate assessment; no compliance certification is claimed.'),
('Does an access count show who is inside?', 'No. An unlock records authorization, not verified physical passage. No reliable occupancy or evacuation register is implemented, and normal lift use in a fire is not promised.'),
('Can you block someone across all buildings?', 'That is a future extension. It needs reliable identification and clear participating-unit governance. Using the same technology does not by itself authorize sharing a person-level restriction.'),
('What is actually implemented and proven?', 'Forms, private QR/download, revocation, dedicated reader and shared display work locally and online. The retained browser test asserts approval, synthetic-video opening, revocation and saved-image refusal. It is not a physical-camera test. Felipe reports successful online checks; use issue #11 for exact evidence. The numbered presentation is available under docs/submission/output/Heaven-Access-Presentation.pdf; use its simulation and evidence limits.'),
]
SOURCES = [
('The Newsroom (2018), Edinburgh Evening News, 3 May. Workplace tailgating and interrupted attempted theft; not a prevalence study.', 'https://fallback.jpi.prod.brightsites.co.uk/news/crime/smartly-dressed-youths-foiled-in-brazen-rbs-bike-theft-586087'),
('Data Protection Commissioner (2012), Annual Report 2011, pp. 16–17, “Theft of Revenue Laptops”. Historical forced entry; not a visitor/elevator failure.', 'https://www.dataprotection.ie/sites/default/files/uploads/2018-12/AnnualReport2011.pdf'),
('Data Protection Commission (n.d.), Transparency. Use for the full-notice obligations.', 'https://www.dataprotection.ie/en/organisations/know-your-obligations/transparency'),
('Data Protection Commission (n.d.), Is my consent required for my data to be processed? Consent is not universally required.', 'https://www.dataprotection.ie/en/faqs/general/my-consent-required-my-data-be-processed'),
('Association for Computing Machinery (2018), Code of Ethics and Professional Conduct, principles 1.2, 1.3 and 1.6: harm, honesty and privacy. Canonical page read on 15 November; automated/headless requests may be blocked.', 'https://www.acm.org/code-of-ethics'),
]

def text(doc, value, style=None):
    p=doc.add_paragraph(value, style)
    p.paragraph_format.space_after=Pt(5)
    return p

def link(doc, label, url):
    p=doc.add_paragraph()
    rel=p.part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', is_external=True)
    h=OxmlElement('w:hyperlink'); h.set(qn('r:id'), rel)
    r=OxmlElement('w:r'); props=OxmlElement('w:rPr')
    color=OxmlElement('w:color'); color.set(qn('w:val'),'176B87'); props.append(color)
    r.append(props); t=OxmlElement('w:t'); t.text=label; r.append(t); h.append(r); p._p.append(h)
    p.paragraph_format.space_after=Pt(4)

def table(doc, headers, rows):
    t=doc.add_table(rows=1, cols=len(headers)); t.style='Light Shading Accent 1'
    t.autofit=False
    for col,width in zip(t.columns,(1.05,.7,5.05)): col.width=Inches(width)
    for c,v in zip(t.rows[0].cells,headers): c.text=v
    for row in rows:
        for c,v in zip(t.add_row().cells,row): c.text=v
    for row in t.rows:
        trpr=row._tr.get_or_add_trPr(); trpr.append(OxmlElement('w:cantSplit'))
        for cell in row.cells:
            for p in cell.paragraphs:
                p.paragraph_format.space_after=Pt(3)
                for r in p.runs:r.font.size=Pt(9)
    return t

def build(who):
    name, student, slot, slides=SPEAKERS[who]
    d=Document(); sec=d.sections[0]
    sec.page_height=Inches(11.69); sec.page_width=Inches(8.27)
    sec.top_margin=sec.bottom_margin=Inches(.65)
    sec.left_margin=sec.right_margin=Inches(.72)
    normal=d.styles['Normal']; normal.font.name='Calibri'; normal.font.size=Pt(10.5)
    normal.paragraph_format.line_spacing=1.04
    for hn,size in [('Title',23),('Heading 1',17),('Heading 2',12)]:
        d.styles[hn].font.name='Calibri'; d.styles[hn].font.size=Pt(size); d.styles[hn].font.color.rgb=RGBColor.from_string('163B50')
    sec.header.paragraphs[0].text=f'HEAVEN ACCESS  |  {who.upper()}  |  {VERSION}'
    sec.header.paragraphs[0].style='Caption'
    foot=sec.footer.paragraphs[0]; foot.text='Internal rehearsal briefing • Proposed speaking allocation • Page '
    field=OxmlElement('w:fldSimple'); field.set(qn('w:instr'),'PAGE'); foot._p.append(field)
    d.core_properties.title=f'Heaven Access — {who} speaker briefing'
    d.core_properties.subject='Synchronized presentation and Q&A preparation'
    d.core_properties.author='Heaven Access project team'
    text(d, f'{who}\nSpeaker briefing', 'Title')
    text(d, f'{name}  |  Student {student}\nYour proposed slot: {slot}  |  {slides}')
    text(d, 'Shared narrative', 'Heading 1')
    text(d, 'An office visit request becomes an access authorization only after staff approval, for a particular destination and time. A camera-read QR lets a simulated checkpoint ask the server whether access is allowed.')
    text(d, 'Briefing aligned with the numbered presentation, hosted prototype and issue #11 evidence. Forms, private QR/download, confirmed revocation, dedicated reader and synchronized gate/elevator display are implemented. The hosted URL is https://heaven-access.vercel.app; the new reader’s native-camera check remains separate from automated evidence. Felipe reports successful online tests. Delivery uses the online link and live demonstration, with the local build as backup. No video will be produced. Speaking topics and timing are unchanged; rehearse together before delivery.')
    text(d, 'One clock for all four speakers', 'Heading 2')
    table(d,['Time','Speaker','Purpose'],[(v[2],k,v[3]) for k,v in SPEAKERS.items()]+[('11:00–12:00','Buffer','Transitions or short recovery; do not add content.')])
    text(d, 'The brief permits 12 minutes including the demo. Target 11 minutes. Q&A follows; its duration is unspecified. All members must attend and understand the whole assignment.')
    text(d, 'Facts everyone must say consistently', 'Heading 2')
    text(d, 'Temporary visitors; one building; four functional interfaces; one staff role. Name + seeded company/room + date/time; no email/phone. Required privacy-notice acknowledgement. Reusable QR within inclusive ±30 minutes in Europe/Dublin; expiry or revocation requires a new request/approval. Revocation blocks saved QR images and preserves history. An opening lasts eight real seconds; QR/manual counts are separate. Next.js/TypeScript + PostgreSQL; local Compose and approximately one-second visible-page polling. Phone 1: private pass/download. Phone 2: /device/reader camera. Tablet: shared gate/elevator visualization. Employee recurring access is unimplemented; Bella explains that boundary. Hardware and pass delivery are simulated; online delivery uses Vercel + Neon at https://heaven-access.vercel.app.')
    link(d,'Current presentation decisions and coordination — issue #13',ISSUE)
    d.add_page_break()
    text(d,'Your speaking notes','Heading 1')
    text(d,'Rehearsal wording — adapt naturally. Dani must confirm her first-person account. Felipe must check the physical camera and full live setup before using the action script. Bella distinguishes automated/synthetic-stream evidence from physical validation. Recheck issue #11 before delivery.','Caption')
    for s in SCRIPT[who]: text(d,s)
    text(d,'Timing cues','Heading 2')
    for time,cue in CUES[who]: text(d,f'{time}  {cue}')
    d.add_page_break()
    text(d,'Whole-project Q&A','Heading 1')
    text(d,'Each member prepares these answers, including topics outside their speaking slot. Give a direct answer, then one reason or limitation. If evidence is missing, say what would need investigation.')
    for q,a in QA:
        p=text(d,q); p.runs[0].bold=True
        p.paragraph_format.space_after=Pt(3)
        answer=text(d,a); answer.paragraph_format.space_after=Pt(3)
    d.add_page_break()
    text(d,'Synchronization and evidence','Heading 1')
    text(d,'Working slide and handoff map','Heading 2')
    text(d,'The portrait CCT assessment sheet is unnumbered. Presentation page 1: title/name-number table; 2: agenda; 3: introductory problem/proposal; 4: evidence/analysis → Dani. Pages 5: discussion/alternatives; 6: complete actor flow → Cris. Pages 7: actual prototype views; 8: central validation and live demo → Felipe. Pages 9: responsibilities; 10: evaluation/sustainability/regular occupants; 11–12: references → Bella closes. Use the displayed 1/12–12/12 numbers, not the PDF viewer’s offset page index. References support the close/Q&A; do not read the bibliography aloud.')
    text(d,'Demo sequence shared by everyone','Heading 2')
    text(d,'Use fictional details and a seeded destination. Public form → pending pass → reception approval → QR/download on phone 1 → /device/reader on phone 2 → tablet unlock/relock → confirmed revocation and saved-image refusal (or expiry, if rehearsed). Gate and elevator show the same authorization; choose one mode for the live sequence. Show one refusal, not every branch; repeat/manual release is optional. Check the real/demo clock, destination, camera permission and links before starting. Cut optional branches before cutting reasoning or legal/ethical coverage.')
    text(d,'Delivery and recovery — no video','Heading 2')
    text(d,'Use https://heaven-access.vercel.app in the presentation PDF and for the live demo on Vercel + Neon. Keep a prepared local build/database as backup. If the camera fails, state that limitation and, if useful, show an explicit manual override without calling it a QR success. If the network fails, use the local build. Do not substitute a recording or pretend a failed step succeeded.')
    text(d,'Before the final rehearsal','Heading 2')
    text(d,'Use the numbered PDF in docs/submission/output/Heaven-Access-Presentation.pdf and the verified public URL. These four v6 briefings share its page map; recheck issue #11 evidence before rehearsal. Read the adjacent speakers’ handoffs and rehearse with a timer. Bella briefly presents recurring-occupant needs as a group design question; do not add employee enrollment, biometrics or cross-building functions to the MVP. Live date, attendance and delivery confirmation remain in issue #13.')
    text(d,'Evidence and references','Heading 2')
    text(d,'Third-party material needs Harvard citations on the relevant slide and a bibliography. These compact source notes are reading pointers, not a substitute for the final bibliography. Sources checked 15 November 2026; the DPC annual report was published in 2012. The presentation’s selected Harvard entries and undated suffixes are authoritative for its citations.')
    for label,url in SOURCES: link(d,label,url)
    text(d,'Internal sources: docs/brief.pdf (12-minute presentation and individual Q&A); docs/team.md (names/numbers); docs/references.md (case details/limits); issues #1, #3, #11, #12 and #13 (decisions, privacy, actual tests and preparation). No formal interview study or cost/environmental measurement is available.','Caption')
    path=OUT/f'Heaven-Access-{who}-Briefing.docx'; d.save(path)
    return path

if __name__=='__main__':
    for who in SPEAKERS: print(build(who).name)
