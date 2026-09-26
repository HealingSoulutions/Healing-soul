import Seo from '../components/Seo';
import FaqAccordion from '../components/FaqAccordion';

// The booking + intake + card-on-file flow is handled entirely inside
// a HIPAA-enabled JotForm (restyled clone, form id 262678284868175 on hipaa-submit.jotform.com).
// We embed it with JotForm's iframe method so all submitted data stays inside
// JotForm's HIPAA environment — nothing sensitive is processed on this page.
// Page styling matches the homepage: flat emerald, Cormorant headings, Varela Round detail.

const BOOK_FAQS = [
  ['What areas do you serve?', 'Healing Soulutions primarily serves Manhattan, with concierge and mobile nursing also available across the greater New York metropolitan area on request. Contact us to confirm availability at your location.'],
  ['Do you take insurance? Can I use an HSA or FSA?', 'Healing Soulutions is an out-of-network, private-pay provider; payment is due at the time of service, and we do not bill insurance. We can provide an itemized receipt for your own submission to an insurer, HSA, or FSA — we make no representation that any amount will be reimbursed. For lab work, share your insurance card when you book; Labcorp bills your insurance directly for the lab processing. As required by the No Surprises Act, you receive a Good Faith Estimate of expected charges before your scheduled visit.'],
  ['Do you offer telehealth?', 'Yes. Virtual consultations with a provider are available where clinically appropriate, for clients located in states where our clinicians are licensed (currently New York and Connecticut). Some concerns require an in-person visit, and telehealth is never a substitute for emergency care.'],
  ['What happens after I book?', 'Our team follows up within 24 hours to confirm the details and answer any questions. Treatment consent and our privacy acknowledgment are reviewed and signed with your nurse at the appointment, before care begins.'],
];

const JF_FORM_ID = '262678284868175';
const JF_ORIGIN = 'https://hipaa-submit.jotform.com';
const JF_SRC = JF_ORIGIN + '/' + JF_FORM_ID;

function BookContent() {
  // The form is embedded at viewport height and scrolls inside its own frame. JotForm's
  // page navigation scrolls its own document to the top on "Next", which works natively in
  // a scrolling frame; the auto-resizing embed (parent-page scrolling) left clients stranded
  // below a shorter page 2 because this HIPAA form does not emit scrollIntoView messages.
  return (
    <main id="main-content" className="book">
      <section className="wrap">
        <h1 className="eyebrow">Book a Visit</h1>
        <p className="intro">
          Choose your time, share a brief health history, review the financial agreement, and secure your visit with a
          card on file &mdash; all in our HIPAA-secure form. Treatment consent is signed with your nurse at the
          appointment.
        </p>
        <div className="rule" />
      </section>

      <section className="form">
        <iframe
          id={'JotFormIFrame-' + JF_FORM_ID}
          title="Healing Soulutions — Booking & Intake"
          allowTransparency={true}
          allow="geolocation; microphone; camera; fullscreen; payment"
          src={JF_SRC}
          frameBorder="0"
          scrolling="yes"
          allowpaymentrequest="true"
          className="jf"
        />
        <noscript>
          <p className="fine">
            To book a visit, please open our secure form: <a href={JF_SRC}>{JF_SRC}</a>
          </p>
        </noscript>
      </section>

      <section id="faq" className="wrap faq-wrap" aria-label="Booking questions">
        <div className="rule" />
        <span className="eyebrow">Before you book</span>
        <div className="faq">
          {BOOK_FAQS.map(([q, a]) => (
            <div className="qa" key={q}>
              <FaqAccordion q={q} a={a} />
            </div>
          ))}
        </div>
        <p className="fine">
          Still have a question? Call or text <a href="tel:+15857472215">(585) 747-2215</a> or email{' '}
          <a href="mailto:info@healingsoulutions.care">info@healingsoulutions.care</a>.
        </p>
      </section>

      <style jsx>{`
        .book {
          overflow-x: clip;
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
        .intro {
          max-width: 560px;
          margin: 0 auto;
          color: rgba(37, 31, 33, 0.82);
          font-size: 19px;
          line-height: 1.55;
          font-style: normal;
        }
        .rule {
          height: 1px;
          margin: 44px auto 0;
          background: rgba(115, 168, 154, 0.22);
        }
        .form {
          max-width: 820px;
          margin: 36px auto 0;
        }
        .form :global(.jf) {
          display: block;
          width: 100%;
          height: calc(100vh - 120px);
          min-height: 760px;
          border: 1px solid rgba(115, 168, 154, 0.35);
          border-radius: 16px;
          background: #fff;
          overflow: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 680px) {
          .form :global(.jf) {
            height: calc(100vh - 110px);
            min-height: 560px;
          }
        }
        .fine {
          margin: 32px auto 0;
          max-width: 560px;
          text-align: center;
          color: rgba(37, 31, 33, 0.5);
          font: 400 11.5px/1.55 var(--round);
        }
        .fine a {
          color: var(--gold-light);
        }
        .faq-wrap {
          margin-top: 56px;
        }
        .faq {
          margin: 24px 0 0;
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
        @media (max-width: 680px) {
          .book {
            padding: 104px 16px 72px;
          }
        }
      `}</style>
    </main>
  );
}

export default function Book() {
  return (
    <>
      <Seo
        title="Book a Visit — Healing Soulutions Concierge Nursing"
        description="Schedule a concierge nursing visit with Healing Soulutions. Choose your time, share a brief health history, review the financial agreement, and secure your visit through our HIPAA-secure booking form. Consent is signed with your nurse at the appointment. Serving the New York metro area."
      />
      <BookContent />
    </>
  );
}
