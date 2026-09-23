import Seo from '../components/Seo';
import Link from 'next/link';

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
          <h1 className="title">Reach Our Mobile Concierge Nursing Team</h1>
          <p className="intro">
            Reach us directly to ask a question, confirm availability at your location, or arrange a visit. Our team
            follows up within 24 hours.
          </p>

          <div className="ways" role="list">
            <a className="way" href="tel:+15857472215" role="listitem">
              <span className="label">Call or text</span>
              <span className="value">(585) 747-2215</span>
            </a>
            <a className="way" href="mailto:info@healingsoulutions.care" role="listitem">
              <span className="label">Email</span>
              <span className="value email">info@healingsoulutions.care</span>
            </a>
            <Link className="way" href="/book" role="listitem">
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

          <p className="fine">
            For a medical emergency, call 911. This website is informational and is not a substitute for emergency or
            primary medical care.
          </p>
        </section>
      </main>

      <style jsx>{`
        .contact {
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
        .eyebrow {
          display: block;
          margin: 0 0 18px;
          color: var(--gold);
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
          color: rgba(247, 241, 229, 0.82);
          font-size: 19px;
          line-height: 1.55;
          font-style: italic;
        }
        .ways {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }
        .contact :global(.way) {
          display: block;
          padding: 22px 18px;
          border: 1px solid rgba(212, 162, 76, 0.45);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
          text-decoration: none;
          color: inherit;
          transition: border-color 0.25s, background 0.25s;
        }
        .contact :global(.way:hover),
        .contact :global(.way:focus-visible) {
          border-color: var(--gold);
          background: rgba(212, 162, 76, 0.08);
          outline: none;
        }
        .label {
          display: block;
          margin-bottom: 8px;
          color: var(--gold);
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
          background: rgba(212, 162, 76, 0.22);
        }
        .facts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 28px 32px;
          text-align: left;
        }
        .facts p {
          margin: 0;
          color: rgba(247, 241, 229, 0.78);
          font: 400 13px/1.65 var(--round);
        }
        .fine {
          margin: 56px auto 0;
          max-width: 560px;
          color: rgba(247, 241, 229, 0.5);
          font: 400 11.5px/1.55 var(--round);
        }
        @media (max-width: 680px) {
          .contact {
            padding: 104px 16px 72px;
          }
          .facts {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
