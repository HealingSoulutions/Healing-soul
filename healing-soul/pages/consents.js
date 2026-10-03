import LegalLayout from '../components/LegalLayout';
import ConsentDoc from '../components/ConsentDoc';
import { CONSENT_TREATMENT, CONSENT_HIPAA, CONSENT_MEDICAL, CONSENT_FINANCIAL } from '../lib/data';

// Full text of the consent documents patients review and sign with their nurse.
// Same wording as the nurse documentation form.
const docs = [
  ['Informed Consent for Treatment', CONSENT_TREATMENT],
  ['HIPAA Notice of Privacy Practices', CONSENT_HIPAA],
  ['Medical History & Release Authorization', CONSENT_MEDICAL],
  ['Financial Agreement & Consent', CONSENT_FINANCIAL],
];

export default function Consents() {
  return (
    <LegalLayout
      title="Patient Consent Documents"
      description="Full text of the Healing Soulutions consent documents: informed consent for treatment, HIPAA notice, medical history authorization, and financial agreement."
    >
      <p style={{ fontFamily: "'KMR Melange Grotesk', sans-serif", fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(37,31,33,0.8)', marginBottom: '1.2rem' }}>
        These are the documents you review with your nurse before care begins. Reading them here does not replace signing them at your visit.
      </p>
      {docs.map(([title, text]) => (
        <div key={title}>
          <h2 style={{ fontFamily: "'KMR Melange Grotesk', sans-serif", color: 'var(--gold-soft)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0.4rem 0' }}>{title}</h2>
          <ConsentDoc text={text} boxed />
        </div>
      ))}
    </LegalLayout>
  );
}
