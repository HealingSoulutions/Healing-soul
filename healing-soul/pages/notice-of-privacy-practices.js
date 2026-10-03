import LegalLayout, { Sec } from '../components/LegalLayout';
import ConsentDoc from '../components/ConsentDoc';
import { CONSENT_HIPAA } from '../lib/data';

// HIPAA Notice of Privacy Practices (45 CFR 164.520). Posted here because the practice
// maintains a website describing its services; a signed acknowledgment of receipt is
// obtained at the first visit.
export default function NoticeOfPrivacyPractices() {
  return (
    <LegalLayout
      title="Notice of Privacy Practices"
      effective="August 1, 2026"
      description="Healing Soulutions HIPAA Notice of Privacy Practices — how your health information may be used and disclosed, and your rights regarding that information."
    >
      <ConsentDoc text={CONSENT_HIPAA} />
      <Sec heading="Complaints">
        If you believe your privacy rights have been violated, you may file a complaint with us at the contact below, or
        with the U.S. Department of Health and Human Services, Office for Civil Rights, by mail (200 Independence Avenue
        SW, Washington, DC 20201), by phone (1-800-368-1019), or online at hhs.gov/ocr/privacy/hipaa/complaints. We will
        not retaliate against you for filing a complaint.
      </Sec>
      <Sec heading="Contact">
        Privacy Officer, Healing Soulutions &mdash; email info@healingsoulutions.care or call (585) 747-2215.
      </Sec>
    </LegalLayout>
  );
}
