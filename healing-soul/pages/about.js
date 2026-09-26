import Seo from '../components/Seo';
import FaqAccordion from '../components/FaqAccordion';
import Link from 'next/link';

// About page in the homepage's language: flat emerald, Cormorant headings, Varela Round
// detail text, gold hairlines. No cards, no scene background, no header block — opens on the team.

const FAQS = [
  ['What areas do you serve?', 'We primarily serve Manhattan, with concierge and mobile nursing across the greater New York metro area on request. Contact us to confirm availability at your location.'],
  ['Who provides my care?', 'Licensed Registered Nurses (RNs) and Nurse Practitioners (NPs). RNs provide care under the order or standing order of an NP or physician, consistent with New York scope-of-practice law.'],
  ['Do you offer telehealth?', 'Yes, where clinically appropriate, for clients in states where our clinicians are licensed (currently New York and Connecticut). Some concerns require an in-person visit, and telehealth is never a substitute for emergency care.'],
  ['How does payment work? Do you take insurance?', 'We are an out-of-network provider; payment is due at the time of service by major card through a secure, PCI-compliant processor. As required by the No Surprises Act, you receive a Good Faith Estimate before your visit. For lab work, share your insurance card when you book — Labcorp bills your insurance directly for lab processing.'],
  ['What should I expect when booking?', 'Choose your services, share a brief health history, review the financial agreement, secure your visit with a card on file, and pick a date and time. We confirm within 24 hours. Treatment consent and our privacy acknowledgment are signed with your nurse at the appointment, before care begins.'],
  ['What is your cancellation policy?', 'We ask for at least 24 hours notice to cancel or reschedule. Full details are in the Financial Agreement presented during booking.'],
];

const TEAM = [
  {
    img: '/berit.jpg',
    alt: 'Berit Tran, Registered Nurse and founder of Healing Soulutions',
    name: 'Berit Tran, BSN, RN',
    role: 'Clinician & Wellness Nurse Consultant',
    bio: 'Berit is a registered nurse with over fifteen years in New York hospitals — emergency, ICU, med-surg, and post-surgical and anesthesia recovery. Her focus is supplementation for hormone health, autoimmune support, metabolic health, brain health, and sleep, with experience in fertility optimization and IVF support. She has cared for patients across New York and abroad, and now brings that depth into the home with discretion, privacy, and attentiveness.',
    creds: 'BSN · Licensed RN · ACLS · PALS · BLS',
  },
  {
    img: '/kristina.jpg',
    alt: 'Kristina Castro, Nurse Practitioner at Healing Soulutions',
    name: 'Kristina Castro, MSN, APRN, FNP-BC',
    role: 'Nurse Practitioner',
    bio: 'Kristina is a board-certified Family Nurse Practitioner with more than a decade at the bedside in New York ICUs and emergency departments. She pairs that acute-care foundation with functional and longevity medicine, across the full lifespan — children, adults, and older adults. She has cared for patients in New York and abroad, and she assesses, diagnoses, prescribes, and oversees every plan personally, delivered privately at home.',
    creds: 'MSN / FNP — College of Mount Saint Vincent · ANCC Board Certified (FNP-BC) · Licensed NP (NY & CT) · RN (NY, NJ & CT) · TNCC · ENPC · ACLS · PALS · BLS',
  },
];

const STEPS = [
  ['Book', 'Choose your services, date, and time, share a brief health history, review the financial agreement, and secure your visit online.'],
  ['Confirm', 'We confirm the details and answer questions within 24 hours.'],
  ['We come to you', 'A licensed clinician arrives at your location, reviews and signs consent with you, and provides your care.'],
];

export default function About() {
  return (
    <>
      <Seo
        title="About & FAQ — Healing Soulutions Concierge Nursing"
        description="Learn about Healing Soulutions concierge and mobile nursing — our care team of licensed RNs and Nurse Practitioners, how in-home visits work, and answers to common questions about services, telehealth, and payment."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
          }),
        }}
      />
      <main id="main-content" className="about">
        <section className="wrap">
          <span className="label eyebrow">Our Team</span>
          <h1 className="sr-only">Meet Your Concierge Nursing Team in Manhattan</h1>
          <div className="team">
            {TEAM.map((t) => (
              <article className="member" key={t.name}>
                <img className="portrait" src={t.img} alt={t.alt} width={140} height={140} />
                <h2>{t.name}</h2>
                <span className="label">{t.role}</span>
                <p className="bio">{t.bio}</p>
                <p className="creds">{t.creds}</p>
              </article>
            ))}
          </div>

          <div className="rule" />

          <span className="label section">How It Works</span>
          <ol className="steps">
            {STEPS.map(([h, body], i) => (
              <li key={h}>
                <span className="num">{i + 1}</span>
                <h3>{h}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <Link className="cta" href="/book">
            Book a Visit &rarr;
          </Link>

          <div className="rule" />

          <span className="label section">FAQ</span>
          <div className="faq">
            {FAQS.map(([q, a]) => (
              <div className="qa" key={q}>
                <FaqAccordion q={q} a={a} />
              </div>
            ))}
          </div>

          <div className="rule" />

          <p className="fine">
            Questions? Call <a href="tel:+15857472215">(585) 747-2215</a> or email{' '}
            <a href="mailto:info@healingsoulutions.care">info@healingsoulutions.care</a>.
          </p>
        </section>
      </main>

      <style jsx>{`
        .about {
          --emerald: #fbfaf9;
          --gold: #73a89a;
          --gold-light: #251f21;
          --ivory: #251f21;
          --serif: 'Aime', Georgia, serif;
          --round: 'KMR Melange Grotesk', system-ui, sans-serif;
          min-height: 100vh;
          background: var(--emerald);
          color: var(--ivory);
          padding: 128px 20px 96px;
          font-family: var(--serif);
        }
        .wrap {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }
        .rule {
          height: 1px;
          margin: 52px auto 44px;
          background: rgba(115, 168, 154, 0.22);
        }
        .label {
          display: block;
          color: #3f6f64;
          font: 500 10.5px/1 var(--round);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .label.eyebrow {
          font-size: 11px;
          letter-spacing: 0.22em;
          margin-bottom: 32px;
        }
        .title {
          margin: 0 auto 36px;
          max-width: 560px;
          color: var(--gold-light, #251f21);
          font: 500 28px/1.2 var(--serif, 'Aime', Georgia, serif);
          letter-spacing: 0.01em;
        }
        .label.section {
          margin-top: 0;
          font-size: 11px;
          letter-spacing: 0.22em;
          margin-bottom: 32px;
        }
        .team {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px 36px;
          align-items: start;
        }
        .member {
          max-width: none;
          margin: 0;
        }
        .portrait {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(115, 168, 154, 0.7);
          box-shadow: 0 0 0 6px rgba(115, 168, 154, 0.1);
        }
        .member h2 {
          margin: 18px 0 8px;
          color: var(--gold-light);
          font: 500 26px/1.15 var(--serif);
        }
        .bio {
          margin: 14px 0 10px;
          color: rgba(37, 31, 33, 0.8);
          font: 400 13px/1.7 var(--round);
        }
        .creds {
          margin: 0;
          color: rgba(37, 31, 33, 0.55);
          font: 400 11px/1.6 var(--round);
        }
        .steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          text-align: center;
        }
        .steps li {
          padding: 24px 18px 22px;
          border: 1px solid rgba(115, 168, 154, 0.45);
          border-radius: 16px;
          background: rgba(37, 31, 33, 0.025);
        }
        .num {
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          margin-bottom: 12px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          color: var(--gold);
          font: 500 12px/30px var(--round);
        }
        .steps h3 {
          margin: 0 0 8px;
          color: var(--gold-light);
          font: 500 22px/1.2 var(--serif);
        }
        .steps p {
          margin: 0;
          color: rgba(37, 31, 33, 0.78);
          font: 400 12.5px/1.65 var(--round);
        }
        .about :global(.cta) {
          display: inline-block;
          margin-top: 28px;
          padding: 12px 28px;
          border: 1px solid var(--gold);
          border-radius: 999px;
          color: var(--gold-light);
          text-decoration: none;
          font: 500 19px/1 var(--serif);
          transition: background 0.25s, color 0.25s;
        }
        .about :global(.cta:hover),
        .about :global(.cta:focus-visible) {
          background: rgba(115, 168, 154, 0.12);
          outline: none;
        }
        .faq {
          margin: 0;
          text-align: left;
        }
        .qa {
          padding: 18px 0;
          border-top: 1px solid rgba(115, 168, 154, 0.16);
        }
        .qa:first-child {
          border-top: none;
          padding-top: 0;
        }
        .qa:last-child {
          padding-bottom: 0;
        }
        dt {
          margin: 0 0 6px;
          color: var(--gold-light);
          font: 500 21px/1.25 var(--serif);
        }
        dd {
          margin: 0;
          color: rgba(37, 31, 33, 0.78);
          font: 400 13px/1.7 var(--round);
        }
        .quote {
          margin: 0 auto;
          max-width: 560px;
        }
        .quote p {
          margin: 0;
          color: rgba(37, 31, 33, 0.85);
          font: 400 20px/1.5 var(--serif);
        }
        .mark {
          color: #3f6f64;
          font-size: 1.5em;
          line-height: 0;
          vertical-align: -0.35em;
        }
        .quote cite {
          display: block;
          margin-top: 14px;
          color: #3f6f64;
          font: 500 10.5px/1 var(--round);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-style: normal;
        }
        .fine {
          margin: 56px auto 0;
          max-width: 560px;
          color: rgba(37, 31, 33, 0.5);
          font: 400 11.5px/1.55 var(--round);
        }
        .fine a {
          color: var(--gold-light);
        }
        @media (max-width: 680px) {
          .team {
            grid-template-columns: 1fr;
          }
          .member {
            max-width: 580px;
            margin: 0 auto;
          }
          .about {
            padding: 104px 16px 72px;
          }
        }
      `}</style>
    </>
  );
}
