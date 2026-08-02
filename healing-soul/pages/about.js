import Head from 'next/head';
import Link from 'next/link';
import SceneBackground from '../components/SceneBackground';

const CARD = { background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(219,170,100,0.7)', boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '1.75rem 1.9rem', marginBottom: '1.25rem', textAlign: 'center' };
const H = { fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '0.6rem' };
const P = { fontFamily: "'Varela Round',sans-serif", fontSize: '0.82rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', marginBottom: '0.6rem' };
const EY = { fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontFamily: "'Varela Round',sans-serif" };

const FAQS = [
  ['What areas do you serve?', 'Healing Soulutions provides mobile and concierge nursing across the New York metropolitan area. Contact us to confirm availability at your location.'],
  ['Who provides my care?', 'Care is delivered by licensed Registered Nurses (RNs) and Nurse Practitioners (NPs). Registered Nurses provide care under the order or standing order of a Nurse Practitioner or physician, consistent with New York scope-of-practice law.'],
  ['Do you offer telehealth?', 'Yes. Virtual consultations with a Nurse Practitioner are available where clinically appropriate. Some concerns require an in-person visit, and telehealth is never a substitute for emergency care.'],
  ['How does payment work? Do you take insurance?', 'Healing Soulutions is an out-of-network provider; payment is due at the time of service. We accept major cards through a secure, PCI-compliant processor and can provide a Good Faith Estimate on request under the No Surprises Act.'],
  ['What should I expect when booking?', 'You choose your services, complete a secure intake and consent, and select a date and time. Our team follows up within 24 hours to confirm the details of your visit.'],
  ['What is your cancellation policy?', 'We ask for at least 24 hours notice to cancel or reschedule. Full details are in the Financial Agreement presented during booking.'],
];

export default function About() {
  return (
    <>
      <Head>
        <title>About & FAQ — Healing Soulutions Concierge Nursing</title>
        <meta name="description" content="Learn about Healing Soulutions concierge and mobile nursing — our care team of licensed RNs and Nurse Practitioners, how in-home visits work, and answers to common questions about services, telehealth, and payment." />
      </Head>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <SceneBackground />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 780, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
          <div style={{ background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(219,170,100,0.7)', boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '2rem 2.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '0.28em', color: 'var(--gold-soft)', textTransform: 'uppercase', margin: '0 0 0.8rem' }}>About</h1>
            <img src="/wordmark.png" alt="Healing Soulutions — Concierge Nursing" style={{ width: 'min(400px, 92%)', height: 'auto', display: 'inline-block' }} />
            <div style={{ width: 48, height: 1.5, background: 'var(--gold-soft)', margin: '0.9rem auto 1.1rem', opacity: 0.9 }} />
            <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--gold-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Our Mission</span>
            <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.92rem', lineHeight: 1.72, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: '0.9rem', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>Healing Soulutions was founded on a simple belief: that trusted, personalized care is something only the human touch can provide. In a world increasingly shaped by technology and AI, so much can be automated and replaced — but nothing can replace human trust, compassion, and empathy, or the hands-on skill of a nurse at your side.</p>
            <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.92rem', lineHeight: 1.72, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: '0.9rem', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>As nurses, we are meant to work alongside our patients — to listen, to guide, to advocate, and to build a clinician-patient relationship that genuinely enriches your life. We tailor every plan uniquely to you, and we want you involved, invested, and curious about your own health: an active partner in your care.</p>
            <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.92rem', lineHeight: 1.72, color: 'rgba(255,255,255,0.8)', textAlign: 'center', margin: 0, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', fontStyle: 'italic', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>With your wellness at the center, our purpose is simple: that you feel your best — present and happy in your own life, for yourself, your family, your friends, and your work. This is the heart of Healing Soulutions. This is the Healing Soulutions experience.</p>
            <div style={{ width: 48, height: 1.5, background: 'var(--gold-soft)', margin: '1.2rem auto 0', opacity: 0.9 }} />
          </div>

          <div style={CARD}>
            <span style={EY}>Our Team</span>
            <h2 style={{ ...H, marginTop: '0.5rem', marginBottom: '1.5rem' }}>Meet your clinicians</h2>

            <div style={{ marginBottom: '1.8rem' }}>
              <img src="/berit.jpg" alt="Berit Tran, Registered Nurse and founder of Healing Soulutions" style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-soft)', boxShadow: '0 0 0 5px rgba(219,170,100,0.15)' }} />
              <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '1.05rem', fontWeight: 700, margin: '0.8rem 0 0.15rem' }}>Berit Tran, BSN, RN</h3>
              <div style={{ ...EY, marginBottom: '0.7rem' }}>Clinician &amp; Wellness Nurse Consultant</div>
              <p style={{ ...P, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>Berit brings over fifteen years of acute-care, perioperative, and emergency nursing across New York&apos;s leading hospitals — from the emergency department to surgical recovery and COVID-19 ICU surge care. Her nursing has also taken her around the world — on medical missions in Haiti, Kenya, and Tanzania, and a charity climb of Mount Kilimanjaro. Through Healing Soulutions, she brings that hospital-grade expertise into the home, with the calm, discretion, and heart that exceptional care deserves.</p>
              <p style={{ ...P, fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', marginBottom: 0 }}>BSN &middot; Licensed RN (New York) &middot; ACLS &middot; PALS &middot; BLS &middot; English, Vietnamese, Norwegian &amp; Swedish</p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
              <img src="/kristina.jpg" alt="Kristina Castro, Nurse Practitioner at Healing Soulutions" style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-soft)', boxShadow: '0 0 0 5px rgba(219,170,100,0.15)' }} />
              <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '1.05rem', fontWeight: 700, margin: '0.8rem 0 0.15rem' }}>Kristina Castro, MSN, APRN, FNP-BC</h3>
              <div style={{ ...EY, marginBottom: '0.7rem' }}>Nurse Practitioner</div>
              <p style={{ ...P, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>Kristina is a board-certified Family Nurse Practitioner with more than a decade of emergency, urgent-care, and perioperative experience across New York&apos;s hospitals and urgent-care centers. As an advanced-practice clinician, she assesses, diagnoses, prescribes, and leads care plans — the clinical decision-maker guiding each patient&apos;s care. Beyond the clinic, her work has taken her to Kenya on a medical mission and to the summit of Mount Kilimanjaro on a charity climb.</p>
              <p style={{ ...P, fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', marginBottom: 0 }}>MSN / FNP &mdash; College of Mount Saint Vincent &middot; ANCC Board Certified (FNP-BC) &middot; Licensed NP (NY &amp; CT) &middot; RN (NY, NJ &amp; CT) &middot; TNCC &middot; ENPC &middot; ACLS &middot; PALS &middot; BLS</p>
            </div>

          </div>

          <div style={CARD}>
            <span style={EY}>How It Works</span>
            <h2 style={{ ...H, marginTop: '0.5rem' }}>Three simple steps</h2>
            <p style={P}><strong style={{ color: 'var(--gold-soft)' }}>1. Book.</strong> Choose your services and a preferred date and time, and complete secure intake and consent online.</p>
            <p style={P}><strong style={{ color: 'var(--gold-soft)' }}>2. Confirm.</strong> Our team reaches out within 24 hours to confirm the details and answer any questions.</p>
            <p style={P}><strong style={{ color: 'var(--gold-soft)' }}>3. We come to you.</strong> A licensed clinician arrives at your location to provide your care.</p>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/book" className="btn-submit" style={{ display: 'inline-block', width: 'auto', padding: '0.7rem 2rem', textDecoration: 'none' }}>Book a Visit</Link>
            </div>
          </div>

          <div style={CARD}>
            <span style={EY}>FAQ</span>
            {FAQS.map(([q, a], i) => (
              <div key={i} style={{ borderTop: i ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingTop: i ? '0.85rem' : 0, marginTop: i ? '0.85rem' : 0 }}>
                <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>{q}</h3>
                <p style={{ ...P, marginBottom: 0 }}>{a}</p>
              </div>
            ))}
          </div>

          <p style={{ ...P, fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Questions? Call <a href="tel:+15857472215" style={{ color: 'var(--gold-soft)' }}>(585) 747-2215</a> or email <a href="mailto:info@healingsoulutions.care" style={{ color: 'var(--gold-soft)' }}>info@healingsoulutions.care</a>.</p>
        </div>
      </div>
    </>
  );
}
