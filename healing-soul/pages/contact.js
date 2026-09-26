import Seo from '../components/Seo';
import Link from 'next/link';

const CONTACT_FAQS = [
  ['Who provides my care?', 'Licensed Registered Nurses (RNs) and Nurse Practitioners (NPs). RNs provide care under the order or standing order of an NP or physician, consistent with New York scope-of-practice law.'],
  ['How does payment work? Do you take insurance?', 'We are an out-of-network provider; payment is due at the time of service by major card through a secure, PCI-compliant processor. As required by the No Surprises Act, you receive a Good Faith Estimate before your visit. For lab work, share your insurance card when you book \u2014 Labcorp bills your insurance directly for lab processing.'],
  ['Do you offer telehealth?', 'Yes, where clinically appropriate, for clients in states where our clinicians are licensed (currently New York and Connecticut). Some concerns require an in-person visit, and telehealth is never a substitute for emergency care.'],
  ['What is your cancellation policy?', 'We ask for at least 24 hours notice to cancel or reschedule. Full details are in the Financial Agreement presented during booking.'],
];

// Contact page in the homepage's language: flat emerald, Cormorant headings, Varela Round
// detail text, gold hairlines. No cards, no scene background.
export default function Contact() {
  return (
    <>
      <Seo
        title="Contact — Healing Soulutions Concierge Nursing"
        description="Contact Healing Soulutions concierge and mobile nursing — call, text, email, or book a visit. Serving Manhattan and the New York metro area."
      />
      <main id="main-content" className="contact">
        <section className="wrap">
          <span className="eyebrow">Contact</span>
          <h1 className="sr-only">Reach Our Mobile Concierge Nursing Team</h1>
          <p className="intro">
            Questions, availability, or a visit: reach us directly. We follow up within 24 hours.
          </p>

          <div className="ways">
            <a className="way" href="tel:+15857472215">
              <span className="label">Call or text</span>
              <span className="value">(585) 747-2215</span>
            </a>
            <a className="way" href="mailto:info@healingsoulutions.care">
              <span className="label">Email</span>
              <span className="value email">info@healingsoulutions.care</span>
            </a>
            <Link className="way" href="/book">
              <span className="label">Book online</span>
              <span className="value">Choose a time &rarr;</span>
            </Link>
          </div>

          <div className="rule" />

          <div className="facts">
            <div>
              <span className="label">Service area</span>
              <p>
                Manhattan, with concierge and mobile nursing across the greater New York metro area on request. We
                come to homes, offices, and hotels.
              </p>
            </div>
            <div>
              <span className="label">Hours</span>
              <p>By appointment, seven days a week. Same-day requests within four hours carry a rush fee.</p>
            </div>
          </div>

          <div className="rule" />

          <div className="faqs">
            <span className="label">Common questions</span>
            {CONTACT_FAQS.map(([q, a]) => (
              <div key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
            <p className="more">
              More questions answered on the <Link href="/about">About page</Link>.
            </p>
          </div>

          <p className="fine">
            For a medical emergency, call 911. This site is informational and not a substitute for emergency or primary care.
          </p>
        </section>
      </main>

      <style jsx>{`
        .contact {
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
        .eyebrow {
          display: block;
          margin: 0 0 18px;
          color: #3f6f64;
          font: 500 11px/1 var(--round);
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .title {
          margin: 0 auto 18px;
          max-width: 560px;
          color: var(--gold-light);
          font: 500 28px/1.2 var(--serif);
          letter-spacing: 0.01em;
        }
        .intro {
          max-width: 560px;
          margin: 0 auto 44px;
          color: rgba(37, 31, 33, 0.82);
          font-size: 19px;
          line-height: 1.55;
          font-style: normal;
        }
        .ways {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }
        .contact :global(.way) {
          display: block;
          padding: 22px 18px;
          border: 1px solid rgba(115, 168, 154, 0.45);
          border-radius: 16px;
          background: rgba(37, 31, 33, 0.025);
          text-decoration: none;
          color: inherit;
          transition: border-color 0.25s, background 0.25s;
        }
        .contact :global(.way:hover),
        .contact :global(.way:focus-visible) {
          border-color: var(--gold);
          background: rgba(115, 168, 154, 0.08);
          outline: none;
        }
        .label {
          display: block;
          margin-bottom: 8px;
          color: #3f6f64;
          font: 500 10.5px/1 var(--round);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .value {
          display: block;
          color: var(--gold-light);
          font: 500 22px/1.2 var(--serif);
          overflow-wrap: anywhere;
        }
        .value.email {
          font-size: 13.5px;
          margin: 0 -6px;
          font-family: var(--round);
          font-weight: 400;
          letter-spacing: 0.01em;
          padding-top: 3px;
        }
        .rule {
          height: 1px;
          margin: 52px auto 44px;
          background: rgba(115, 168, 154, 0.22);
        }
        .facts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 28px 32px;
          text-align: left;
        }
        .facts p {
          margin: 0;
          color: rgba(37, 31, 33, 0.78);
          font: 400 13px/1.65 var(--round);
        }
        .faqs {
          display: grid;
          gap: 22px;
          text-align: left;
        }
        .faqs h3 {
          margin: 0 0 4px;
          color: var(--gold-light);
          font: 500 18px/1.3 var(--serif);
        }
        .faqs p {
          margin: 0;
          color: rgba(37, 31, 33, 0.78);
          font: 400 13px/1.65 var(--round);
        }
        .faqs .more {
          font-size: 12.5px;
        }
        .faqs .more :global(a) {
          color: #3f6f64;
        }
        .fine {
          margin: 56px auto 0;
          max-width: 560px;
          color: rgba(37, 31, 33, 0.5);
          font: 400 11.5px/1.55 var(--round);
        }
        @media (max-width: 680px) {
          .contact {
            padding: 104px 16px 72px;
          }
          .facts,
          .faqs {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
