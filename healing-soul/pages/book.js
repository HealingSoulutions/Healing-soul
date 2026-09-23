import { useEffect } from 'react';
import Seo from '../components/Seo';

// The booking + intake + card-on-file flow is handled entirely inside
// a HIPAA-enabled JotForm (form id 262167960112050 on hipaa-submit.jotform.com).
// We embed it with JotForm's iframe method so all submitted data stays inside
// JotForm's HIPAA environment — nothing sensitive is processed on this page.
// Page styling matches the homepage: flat emerald, Cormorant headings, Varela Round detail.
const JF_FORM_ID = '262167960112050';
const JF_ORIGIN = 'https://hipaa-submit.jotform.com';
const JF_SRC = JF_ORIGIN + '/' + JF_FORM_ID;

function BookContent() {
  useEffect(() => {
    // Load JotForm's embed handler once — it listens for the form's postMessage
    // events and auto-resizes the iframe so there's no inner scrollbar.
    function attach() {
      try {
        if (window.jotformEmbedHandler) {
          window.jotformEmbedHandler("iframe[id='JotFormIFrame-" + JF_FORM_ID + "']", JF_ORIGIN);
        }
      } catch (e) {}
    }
    const existing = document.getElementById('jotform-embed-handler');
    if (existing) {
      attach();
      return;
    }
    const s = document.createElement('script');
    s.id = 'jotform-embed-handler';
    s.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    s.async = true;
    s.onload = attach;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    // JotForm posts "scrollIntoView::<id>" when the client moves between form pages and
    // "setHeight:<px>:<id>" when the iframe resizes. JotForm's own embed handler also reacts
    // to these, and the iframe height changes a beat later, so a single scroll lands wrong.
    // We scroll to the top of the form now and again after the resize settles, and treat
    // any large height change as a page change (conditional fields only move a few px).
    const NAV_OFFSET = 84;
    let prevHeight = 0;
    let timers = [];
    function toFormTop() {
      const el = document.getElementById('JotFormIFrame-' + JF_FORM_ID);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    }
    function settleToTop() {
      timers.forEach(clearTimeout);
      timers = [0, 120, 350, 700].map((ms) => setTimeout(toFormTop, ms));
    }
    function onMessage(e) {
      if (e.origin !== JF_ORIGIN) return;
      const str = typeof e.data === 'string' ? e.data : JSON.stringify(e.data || '');
      if (str.indexOf('scrollIntoView') !== -1) {
        settleToTop();
        return;
      }
      const m = /setHeight:(\d+)/.exec(str);
      if (m) {
        const px = parseInt(m[1], 10);
        if (prevHeight && Math.abs(px - prevHeight) > 250) settleToTop();
        prevHeight = px;
      }
    }
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <main id="main-content" className="book">
      <section className="wrap">
        <h1 className="eyebrow">Book a Visit</h1>
        <p className="intro">
          Choose your time, share a brief health history, review the financial agreement, and secure your visit with a
          card on file &mdash; all through our HIPAA-secure form. Treatment consent is reviewed and signed with your nurse
          at the appointment.
        </p>
        <div className="rule" />
      </section>

      <section className="form">
        <iframe
          id={'JotFormIFrame-' + JF_FORM_ID}
          title="Healing Soulutions — Booking & Intake"
          onLoad={() => {
            try {
              window.parent.scrollTo(0, 0);
            } catch (e) {}
          }}
          allowTransparency={true}
          allow="geolocation; microphone; camera; fullscreen; payment"
          src={JF_SRC}
          frameBorder="0"
          scrolling="auto"
          allowpaymentrequest="true"
          style={{ minWidth: '100%', maxWidth: '100%', width: '1px', height: '2400px', border: 'none', borderRadius: '16px' }}
        />
        <noscript>
          <p className="fine">
            To book a visit, please open our secure form: <a href={JF_SRC}>{JF_SRC}</a>
          </p>
        </noscript>
        <p className="fine">
          Questions before you book? Call or text <a href="tel:+15857472215">(585) 747-2215</a> or email{' '}
          <a href="mailto:info@healingsoulutions.care">info@healingsoulutions.care</a>.
        </p>
      </section>

      <style jsx>{`
        .book {
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
        .intro {
          max-width: 560px;
          margin: 0 auto;
          color: rgba(247, 241, 229, 0.82);
          font-size: 19px;
          line-height: 1.55;
          font-style: italic;
        }
        .rule {
          height: 1px;
          margin: 44px auto 0;
          background: rgba(212, 162, 76, 0.22);
        }
        .form {
          max-width: 820px;
          margin: 36px auto 0;
        }
        .fine {
          margin: 32px auto 0;
          max-width: 560px;
          text-align: center;
          color: rgba(247, 241, 229, 0.5);
          font: 400 11.5px/1.55 var(--round);
        }
        .fine a {
          color: var(--gold-light);
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
