# Heaven Access — Future Improvements

Report-ready discussion, 6 November 2026. This is supporting report content; [future issue #21](https://github.com/lipex360x/Heaven-Access/issues/21) tracks the investigation, and [report issue #12](https://github.com/lipex360x/Heaven-Access/issues/12) tracks its inclusion in the current report. Implementation remains outside the MVP and current deadline.

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

- Data Protection Commission (2019) ‘Options for app security’, 15 August. Available at: https://www.dataprotection.ie/en/dpc-guidance/blogs/options-app-security (Accessed: 6 November 2026).
- National Institute of Standards and Technology (n.d.) ‘Face Recognition Technology Evaluation: Demographic Effects in Face Recognition’. Available at: https://pages.nist.gov/frvt/html/frvt_demographics.html (Accessed: 6 November 2026).
