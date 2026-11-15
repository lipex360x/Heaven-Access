# Heaven Access — Evidence and References

Research accessed on **6 November 2026**. This is an initial evidence register for the supporting report, presentation, and Q&A. Summaries are paraphrases. These examples establish possible consequences and control weaknesses; they do not establish the frequency of unauthorized access in Irish office buildings or prove that Heaven Access would have prevented an incident.

[GitHub issues](https://github.com/lipex360x/Heaven-Access/issues) are the Source of Truth for research tasks, decisions and completion. This file stores evidence and bibliography material; verification work is tracked in the research issue.

## Internal contribution and concept provenance

Felipe confirmed that Dani (Daniela Alves Paiva da Silva) supplied the initial research-led project description: the comparison of turnstiles, QR visitor management, elevator authorization, AI cameras and process-only controls, and the suggested combination of a digital visitor pass with floor-specific elevator authorization. Credit Dani's contribution when explaining how the group developed the idea.

This is an internal team contribution, not a published source. The external sources/methods behind Dani's initial research have not yet been supplied here; factual, legal, cost and sustainability claims still require verification and appropriate references. Do not attribute later incident research in this document to Dani unless she actually performed it.

## Report-ready background summary

Physical access failures can affect personal safety, business assets, and information security. In Ireland, an unauthorized entry into Áras an Uachtaráin in September 2018 resulted in an investigation and a financial disciplinary sanction reported in 2021 (Kenny, 2021). A 2009 burglary at Bord Gáis offices involved an unencrypted laptop holding bank details for 75,000 customers, illustrating how equipment theft can expose personal information (RTÉ, 2009). More recently, reporting on Dublin office burglaries described stolen equipment, property damage, and businesses unable to open the next morning (Reid, 2026).

International evidence also demonstrates the limits of access credentials alone. At RBS premises in Edinburgh, intruders followed staff through card-controlled doors before an attempted bicycle theft was interrupted (The Newsroom, 2018). In February 2026, Caltech reported repeated unauthorized entries into residences involving people following residents or being admitted by them (California Institute of Technology, 2026). These examples support investigating visitor approval, time-limited authorization, and consistent access validation as part of layered security. They also show why a digital visitor pass must be accompanied by suitable physical controls and staff procedures.

**Project inference:** Heaven Access can demonstrate whether a particular visitor has approval for a destination and time window. It should be presented as improving visitor authorization and traceability, with residual risks explicitly stated. It is not demonstrated to prevent forced entry, tailgating, credential sharing, or all equipment theft.

## Irish cases

### IE-01 — Áras an Uachtaráin: unchecked entry and disciplinary consequences

- **Incident:** 14 September 2018; follow-up article: 25 June 2021.
- **Evidence:** A driver entered through an open gate, reached the building, and confronted the President. The report describes an assumption that the vehicle belonged to staff.
- **Consequence:** Investigation and a monetary sanction against the officer concerned.
- **Relevance:** Supports verifying authorization rather than relying on recognition or appearance.
- **Limit:** This was a presidential residence, not a multi-tenant office; no QR/elevator failure is established.
- **Reference:** Kenny, A. (2021) ‘Garda sanctioned over Áras an Uachtaráin intruder’, *The Irish Times*, 25 June. Available at: https://www.irishtimes.com/news/crime-and-law/garda-sanctioned-over-aras-an-uachtarain-intruder-1.4603834 (Accessed: 6 November 2026).
- **Accessible corroborating coverage:** [TheJournal.ie: Garda hit with monetary sanction after intruder confronted President](https://www.thejournal.ie/intruder-aras-garda-sanctioned-5477850-Jun2021/).

### IE-02 — Bord Gáis: stolen equipment and customer information exposure

- **Incident:** 5 June 2009; article updated 17 June 2009.
- **Evidence:** Four laptops were stolen from Dublin offices; one unencrypted device contained bank details for 75,000 customers.
- **Consequence:** Garda/DPC notification, investigation, customer warnings, and a reported move to encrypt all laptops.
- **Relevance:** Connects physical theft with information-security consequences.
- **Limit:** The source does not establish a visitor-registration or elevator weakness. This predates GDPR; do not call it a GDPR enforcement case or claim confirmed misuse of every affected account.
- **Reference:** RTÉ (2009) ‘Bord Gáis customer details on stolen laptops’, 17 June. Available at: https://www.rte.ie/news/2009/0617/118548-bordgais/ (Accessed: 6 November 2026).
- **Access note:** The indexed article text was available during research; direct retrieval returned HTTP 403. Recheck access before final submission.

### IE-03 — Dublin offices: equipment losses and business interruption

- **Incident period:** September–October 2023; publication date indicated by article URL: 16 January 2026. Confirm the displayed publication date before final bibliography export.
- **Evidence:** Court reporting describes forced entry into unoccupied premises. One office lost €21,929 of laptops and phones, none recovered.
- **Consequence:** Property damage, some businesses unable to open the following morning, and a prison sentence of two years and four months.
- **Relevance:** Documents financial and operational consequences for offices.
- **Limit:** Forced entry at night differs from an unapproved visitor bypassing reception. Do not imply that QR authorization alone addresses this attack.
- **Reference:** Reid, N. (2026) ‘Convicted rapist stole items valued at over €20,000 from Dublin offices’, *Dublin People*, 16 January [date to confirm]. Available at: https://dublinpeople.com/news/southside/articles/2026/01/16/convicted-rapist-stole-items-valued-at-over-e20000-from-dublin-offices/?amp=1 (Accessed: 6 November 2026).
- **Editorial note:** When discussing the case, use a neutral description of the office burglaries. Unrelated convictions in the original headline are not relevant to the project's argument.

### IE-04 — Revenue offices: physical security despite encrypted devices

- **Incident:** 27 January 2011; source: DPC Annual Report 2011.
- **Evidence:** Ten encrypted, desk-secured laptops were stolen after forced access through a fire exit and later recovered by Gardaí.
- **Finding:** The DPC described appropriate laptop safeguards but physical-security concerns needing attention.
- **Relevance:** An Irish primary source connecting physical and data security while showing the value of layered safeguards.
- **Limit:** Historical, pre-GDPR case; not evidence that QR passes prevent forced entry. Fire exits must preserve safe egress.
- **Reference:** Data Protection Commissioner (2012) *Annual Report 2011*, case study ‘Theft of Revenue Laptops’, p. 16. Available at: https://www.dataprotection.ie/sites/default/files/uploads/2018-12/AnnualReport2011.pdf (Accessed: 6 November 2026).
- **Verification note:** Case text was surfaced in indexed PDF content. Confirm the report's publication year and page label against the PDF before final submission.

## International cases

### INT-01 — RBS, Edinburgh: tailgating through card-controlled doors

- **Incident:** 18 April 2018; article: 3 May 2018.
- **Evidence:** Four people followed employees through card-controlled access into a basement area and attempted to steal bicycles.
- **Consequence:** Staff/security interrupted the attempt; police were informed and CCTV supplied. No successful bicycle theft was reported.
- **Relevance:** Closely matches a workplace access-control problem and demonstrates that credentials alone do not prevent accompanying entry.
- **Limit:** The article's claim about suits was disputed by the bank; omit it from the argument. Do not claim the access cards malfunctioned.
- **Reference:** The Newsroom (2018) ‘“Smartly dressed” youths foiled in brazen RBS bike theft’, *Edinburgh Evening News*, 3 May. Available at: https://fallback.jpi.prod.brightsites.co.uk/news/crime/smartly-dressed-youths-foiled-in-brazen-rbs-bike-theft-586087 (Accessed: 6 November 2026).
- **Access note:** The article is available through the publisher's fallback host; prefer a canonical publisher link if located before submission.

### INT-02 — Mar-a-Lago, United States: false visit purpose and unlawful entry

- **Incident:** 2019; sentencing announcement: 26 November 2019.
- **Evidence:** The US Department of Justice records fraudulent entry into restricted grounds and false statements about attending a named event. Agents detained the individual at reception.
- **Consequence:** Conviction and eight months' imprisonment, followed by two years of supervised release.
- **Relevance:** Supports independently verifying that an asserted visit is actually authorized.
- **Limit:** Specialized protective-security setting. Do not claim espionage, a successful cyberattack, or that a QR code would necessarily have prevented entry.
- **Reference:** U.S. Attorney’s Office, Southern District of Florida (2019) ‘Chinese National Sentenced to Prison for Entering the Restricted Grounds at Mar-a-Lago and Lying to U.S. Secret Service Agents’, 26 November. Available at: https://www.justice.gov/usao-sdfl/pr/chinese-national-sentenced-prison-entering-restricted-grounds-mar-lago-and-lying-us (Accessed: 6 November 2026).

### INT-03 — Caltech, United States: repeated unauthorized residential entry

- **Publication:** 27 February 2026; incidents described as occurring in preceding weeks.
- **Evidence:** An institutional bulletin reports multiple entries involving residents admitting unauthorized individuals or being followed inside, based on camera review.
- **Consequence:** Security warning and guidance. Theft, damage, and harm are identified as risks, not confirmed outcomes of these incidents.
- **Relevance:** Recent primary evidence that social behaviour can bypass credential-controlled access.
- **Limit:** Student residences rather than offices; no incident rate or measured loss is provided.
- **Reference:** California Institute of Technology (2026) ‘Caltech Security Bulletin – Unauthorized Entry/Tailgating into Student Residence Houses’, 27 February. Available at: https://www.caltech.edu/campus-life-events/campus-announcements/caltech-security-bulletin-unauthorized-entrytailgating-into-student-residence-houses (Accessed: 6 November 2026).
- **Access note:** Indexed bulletin text was available; direct retrieval returned HTTP 403. Recheck before final submission.

## Privacy sources for requirements design

### LAW-01 — Consent is not universally required

The Irish DPC explains that consent is not required for every processing purpose. Heaven Access must identify an appropriate lawful basis and provide transparency. The user's requested consent step needs to be designed with its actual purpose, refusal/withdrawal handling, and the distinction from privacy-notice acknowledgement clearly documented.

**Reference:** Data Protection Commission (n.d.) ‘Is my consent required for my data to be processed?’. Available at: https://www.dataprotection.ie/en/faqs/general/my-consent-required-my-data-be-processed (Accessed: 6 November 2026).

### LAW-02 — Identify the lawful basis before processing

The DPC identifies six Article 6 bases: consent, contract, legal obligation, vital interests, public task, and legitimate interests. This source supports assessing the basis; it does not determine which is correct for this project's eventual deployment.

**Reference:** Data Protection Commission (n.d.) ‘Guidance on Legal Bases for Processing Personal Data’. Available at: https://www.dataprotection.ie/en/dpc-guidance/guidance-legal-bases-processing-personal-data (Accessed: 6 November 2026).

## Recommended use in the report and slides

- Lead with IE-01 for an Irish example of unchecked access and INT-01 for workplace tailgating.
- Use IE-02 to connect physical security with protection of personal information.
- Use IE-03 as recent reporting of office losses, while explicitly identifying forced entry as outside the QR workflow's direct protection.
- Use INT-03 as recent corroboration of recurring access-control bypass, distinguishing risks from actual harm.
- Use IE-04 and INT-02 as optional supporting evidence for layered protection and verification of visit purpose.
- Keep the report-ready summary's citations and link each cited work to the bibliography. Verify the college's exact Harvard punctuation/formatting conventions before delivery.
- Supplement these cases with research on access-control design, measured visitor-management needs, and feasibility. Selected incidents are not a representative statistical sample.


## Access-lifecycle design sources

### DESIGN-01 — Recurring occupants are distinct from visitors

NIST SP 800-53 Rev. 5, PE-2 distinguishes permanent physical-access credentials from visitor access and describes authorization lists, review and removal when access is no longer required. This supports discussing Bella’s recurring-occupant question separately from the temporary visitor flow. It does not prescribe the proposed destinations/schedules, demonstrate implementation or establish an Irish legal obligation. The future design comparison is in [future-improvements.md](future-improvements.md).

**Reference:** Joint Task Force (2020) *Security and Privacy Controls for Information Systems and Organizations*. NIST Special Publication 800-53, Revision 5, PE-2, p. 180. Available at: https://doi.org/10.6028/NIST.SP.800-53r5 (Accessed: 15 November 2026).
