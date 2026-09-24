import Seo from '../components/Seo';
import Link from 'next/link';

// About page in the homepage's language: flat emerald, Cormorant headings, Varela Round
// detail text, gold hairlines. No cards, no scene background, no header block — opens on the team.

const FAQS = [
  ['What areas do you serve?', 'Healing Soulutions primarily serves Manhattan, with concierge and mobile nursing also available across the greater New York metropolitan area on request. Contact us to confirm availability at your location.'],
  ['Who provides my care?', 'Care is delivered by licensed Registered Nurses (RNs) and Nurse Practitioners (NPs). Registered Nurses provide care under the order or standing order of a Nurse Practitioner or physician, consistent with New York scope-of-practice law.'],
  ['Do you offer telehealth?', 'Yes. Virtual consultations with a Nurse Practitioner are available where clinically appropriate, for clients located in states where our clinicians are licensed (currently New York and Connecticut). Some concerns require an in-person visit, and telehealth is never a substitute for emergency care.'],
  ['How does payment work? Do you take insurance?', 'Healing Soulutions is an out-of-network provider; payment is due at the time of service. We accept major cards through a secure, PCI-compliant processor and, as required by the No Surprises Act, we provide a Good Faith Estimate of expected charges before your scheduled visit. For lab work, share your insurance card when you book; Labcorp bills your insurance directly for the lab processing.'],
  ['What should I expect when booking?', 'You choose your services, share a brief health history, review the financial agreement, secure your visit with a card on file, and select a date and time. Our team follows up within 24 hours to confirm the details. Treatment consent and our privacy acknowledgment are reviewed and signed with your nurse at the appointment, before care begins.'],
  ['What is your cancellation policy?', 'We ask for at least 24 hours notice to cancel or reschedule. Full details are in the Financial Agreement presented during booking.'],
];

const TEAM = [
  {
    img: '/kristina.jpg',
    alt: 'Kristina Castro, Nurse Practitioner at Healing Soulutions',
    name: 'Kristina Castro, MSN, APRN, FNP-BC',
    role: 'Nurse Practitioner',
    bio: 'Kristina is a board-certified Family Nurse Practitioner with more than a decade at the bedside in New York ICUs and emergency departments — the settings where clinical judgment matters most. Today she pairs that acute-care foundation with functional medicine and peptide therapy, with a scope that spans the full lifespan — children, adults, and older adults alike. With experience caring for patients both in New York and abroad, she assesses, diagnoses, prescribes, and oversees every plan personally, delivered privately at home.',
    creds: 'MSN / FNP — College of Mount Saint Vincent · ANCC Board Certified (FNP-BC) · Licensed NP (NY & CT) · RN (NY, NJ & CT) · TNCC · ENPC · ACLS · PALS · BLS',
  },
  {
    img: '/berit.jpg',
    alt: 'Berit Tran, Registered Nurse and founder of Healing Soulutions',
    name: 'Berit Tran, BSN, RN',
    role: 'Clinician & Wellness Nurse Consultant',
    bio: 'Berit is a registered nurse with over fifteen years in New York hospitals across the emergency department, ICU, med-surg, and post-surgical and anesthesia recovery care — the full arc of acute nursing. Her experience also includes fertility optimization and IVF support, with a special interest and focus in supplementation for hormone health, autoimmune support, metabolic health, brain health and sleep architecture optimization. She has cared for patients across New York State and abroad, and now serves the New York metropolitan area. Through Healing Soulutions, she brings that depth into the home with discretion, privacy, and attentiveness.',
    creds: 'BSN · Licensed RN · ACLS · PALS · BLS',
  },
];

const STEPS = [
  ['Book', 'Choose your services and a preferred date and time, share a brief health history, review the financial agreement, and secure your visit online.'],
  ['Confirm', 'Our team reaches out within 24 hours to confirm the details and answer any questions.'],
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
          <dl className="faq">
            {FAQS.map(([q, a]) => (
              <div className="qa" key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>

          <div className="rule" />

          <blockquote className="quote">
            <p>
              <span className="mark">&ldquo;</span>
              Their medical expertise, preparation, and human compassion were exceptional &mdash; Healing Soulutions
              made a significant difference in my recovery, and the whole team is top-notch.
              <span className="mark">&rdquo;</span>
            </p>
            <cite>&mdash; Healing Soulutions client</cite>
          </blockquote>

          <p className="fine">
            Questions? Call <a href="tel:+15857472215">(585) 747-2215</a> or email{' '}
            <a href="mailto:info@healingsoulutions.care">info@healingsoulutions.care</a>.
          </p>
        </section>
      </main>

      <style jsx>{`
        .about {
          --emerald: #013c1c;
          --gold: #d4a24c;
          --gold-light: #ebcb8a;
          --ivory: #f7f1e5;
          --serif: 'Cormorant Garamond', Georgia, serif;
          --round: 'Varela Round', system-ui, sans-serif;
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
          background: rgba(212, 162, 76, 0.22);
        }
        .label {
          display: block;
          color: var(--gold);
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
          color: var(--gold-light, #ebcb8a);
          font: 500 28px/1.2 var(--serif, 'Cormorant Garamond', Georgia, serif);
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
          gap: 44px;
        }
        .member {
          max-width: 580px;
          margin: 0 auto;
        }
        .portrait {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(212, 162, 76, 0.7);
          box-shadow: 0 0 0 6px rgba(212, 162, 76, 0.1);
        }
        .member h2 {
          margin: 18px 0 8px;
          color: var(--gold-light);
          font: 500 26px/1.15 var(--serif);
        }
        .bio {
          margin: 14px 0 10px;
          color: rgba(247, 241, 229, 0.8);
          font: 400 13px/1.7 var(--round);
        }
        .creds {
          margin: 0;
          color: rgba(247, 241, 229, 0.55);
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
          border: 1px solid rgba(212, 162, 76, 0.45);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
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
          color: rgba(247, 241, 229, 0.78);
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
          background: rgba(212, 162, 76, 0.12);
          outline: none;
        }
        .faq {
          margin: 0;
          text-align: left;
        }
        .qa {
          padding: 18px 0;
          border-top: 1px solid rgba(212, 162, 76, 0.16);
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
          color: rgba(247, 241, 229, 0.78);
          font: 400 13px/1.7 var(--round);
        }
        .quote {
          margin: 0 auto;
          max-width: 560px;
        }
        .quote p {
          margin: 0;
          color: rgba(247, 241, 229, 0.85);
          font: italic 400 20px/1.5 var(--serif);
        }
        .mark {
          color: var(--gold);
          font-size: 1.5em;
          line-height: 0;
          vertical-align: -0.35em;
        }
        .quote cite {
          display: block;
          margin-top: 14px;
          color: var(--gold);
          font: 500 10.5px/1 var(--round);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-style: normal;
        }
        .fine {
          margin: 56px auto 0;
          max-width: 560px;
          color: rgba(247, 241, 229, 0.5);
          font: 400 11.5px/1.55 var(--round);
        }
        .fine a {
          color: var(--gold-light);
        }
        @media (max-width: 680px) {
          .about {
            padding: 104px 16px 72px;
          }
        }
      `}</style>
    </>
  );
}
