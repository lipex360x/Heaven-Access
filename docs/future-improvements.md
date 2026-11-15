# Heaven Access — Future Improvements

Report-ready discussion, revised 15 November 2026. This is supporting report content; [future issue #21](https://github.com/lipex360x/Heaven-Access/issues/21) tracks the investigation, and [report issue #12](https://github.com/lipex360x/Heaven-Access/issues/12) tracks its inclusion in the current report. Implementation remains outside the MVP and current deadline.

## Recurring access for employees and other regular occupants

Bella raised the distinction between occasional visitors and people who need regular access. The current prototype implements temporary visitor requests, approval, a ±30-minute QR window and revocation. Its staff login permits reception/device operations; it is not an employee entry credential. Recurring-occupant access is a future design option, not an implemented feature or a requirement to add biometrics.

| Current temporary visitor | Proposed recurring occupant — not implemented |
| --- | --- |
| Submit a visit and obtain staff approval | Authorized staff enroll the occupant and assign recurring permissions |
| One destination and a specific visit window | Defined destinations, permitted days/hours and optional end/review dates |
| Expiry or revocation requires a new visit request | Review, suspend/revoke and replace credentials through a managed lifecycle |
| QR possession is checked, not identity or physical passage | Evaluate a card or managed mobile credential and its identity/sharing risks |

A recurring authorization need not require a new visitor request each day, but it must remain limited and revocable when the person's authorization changes or a credential is lost. A far-future visitor expiry is not a substitute for a recurring-access model. Enrollment, permission changes, offboarding, lost-credential recovery and proportional audit/retention would need separate design and validation. These are proposed design choices, not verified integrations or compliance claims.

NIST SP 800-53 Rev. 5, PE-2 distinguishes employees with permanent physical-access credentials from visitors and describes maintaining authorization lists, reviewing them and removing access when no longer needed (Joint Task Force, 2020, p. 180). It is a useful design reference, not an Irish legal mandate or evidence that Heaven Access meets that control. [Source: NIST PE-2](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf#page=207).

Presentation treatment: Felipe describes the demo as a temporary visit; Bella briefly explains the recurring-occupant gap she identified and the proposed future lifecycle in her existing closing/evaluation slot. The shared Q&A prepares all four members without adding a new slide or extending the demo. The existing optional biometric discussion below is independent: recurring access can use ordinary non-biometric credentials.

## Optional facial verification for regular occupants

A possible future extension is optional facial verification for registered employees or other regular occupants. It could complement the visitor QR workflow by providing a convenient access method for frequent users. This is a proposal for evaluation, not a feature implemented or validated by the current prototype.

| Potential advantages | Disadvantages and conditions to investigate |
| --- | --- |
| Less need to retrieve a card, phone or QR code on each visit | Enrollment, suitable cameras, integration, maintenance and support introduce additional cost and complexity. Any time saving must be measured. |
| Reduced dependence on lost or shared physical credentials | Faces can still be misrecognized or spoofed; evaluate false acceptance/rejection and presentation-attack resistance rather than assuming stronger security. |
| A consistent access option for returning occupants | Lighting, camera placement and demographic performance differences can affect recognition. Evaluate the actual deployment rather than relying on a generic accuracy claim. |
| Potentially smoother access for users who choose it | Biometric handling introduces privacy, surveillance and breach risks. Provide a usable non-biometric route and assess necessity, lawful basis, data protection and applicable AI rules before any pilot. |

NIST documents recognition errors and demographic performance differences, including image-quality effects; this supports testing the specific system rather than claiming universal reliability. The Irish DPC highlights the sensitivity of biometric authentication and the difficulty of resetting biometric characteristics, recommending optional use alongside reliable authentication methods. These sources support caution; they do not demonstrate that a particular product is compliant or effective.

The recommended next step is a proportionate feasibility assessment comparing facial verification with ordinary cards and other non-biometric credentials. Define whether the user actively claims an identity for one-to-one verification or whether the system identifies people from a gallery, and assess each design separately. Any future trial should preserve safe exit, avoid unnecessary monitoring, and keep the existing assisted-access route. Facial verification alone would not establish that tailgating has been prevented.

## References

- Joint Task Force (2020) *Security and Privacy Controls for Information Systems and Organizations*. NIST Special Publication 800-53, Revision 5, control PE-2, p. 180. Available at: https://doi.org/10.6028/NIST.SP.800-53r5 (Accessed: 15 November 2026).

- Data Protection Commission (2019) ‘Options for app security’, 15 August. Available at: https://www.dataprotection.ie/en/dpc-guidance/blogs/options-app-security (Accessed: 6 November 2026).
- National Institute of Standards and Technology (n.d.) ‘Face Recognition Technology Evaluation: Demographic Effects in Face Recognition’. Available at: https://pages.nist.gov/frvt/html/frvt_demographics.html (Accessed: 6 November 2026).
