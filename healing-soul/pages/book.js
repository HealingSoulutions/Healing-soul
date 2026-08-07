import { useEffect } from 'react';
import Seo from '../components/Seo';
import SceneBackground from '../components/SceneBackground';

// The booking + intake + consent + card-on-file flow is handled entirely inside
// a HIPAA-enabled JotForm (form id 262167960112050 on hipaa-submit.jotform.com).
// We embed it with JotForm's iframe method so all submitted data stays inside
// JotForm's HIPAA environment — nothing sensitive is processed on this page.
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
          window.jotformEmbedHandler(
            "iframe[id='JotFormIFrame-" + JF_FORM_ID + "']",
            JF_ORIGIN
          );
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

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      <SceneBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Branded header */}
        <div style={{ padding: '8rem 1.5rem 0.25rem', textAlign: 'center', maxWidth: 820, margin: '0 auto' }}>
          <div style={{
            background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(219,170,100,0.7)',
            boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)',
            borderRadius: '16px', padding: '1.5rem', width: '100%',
          }}>
            <h1 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Book a Visit</h1>
            <div style={{ margin: '0.5rem 0' }}>
              <img src="/emblem.png" alt="" aria-hidden="true" style={{ height: '8.57rem', width: 'auto', display: 'inline-block' }} />
            </div>
            <div style={{ width: 25, height: 0.75, background: 'var(--gold-soft)', margin: '0 auto 0.9rem' }} />
            <p style={{ fontFamily: "'Varela Round',sans-serif", color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
              Complete your intake, consent, and secure card-on-file below. Everything is submitted directly through our HIPAA-secure form.
            </p>
          </div>
        </div>

        {/* Embedded HIPAA JotForm */}
        <div style={{ padding: '1.25rem 1.5rem 3rem', maxWidth: 820, margin: '0 auto' }}>
          <iframe
            id={'JotFormIFrame-' + JF_FORM_ID}
            title="Healing Soulutions — Booking, Intake & Consent"
            onLoad={() => { try { window.parent.scrollTo(0, 0); } catch (e) {} }}
            allowTransparency={true}
            allow="geolocation; microphone; camera; fullscreen; payment"
            src={JF_SRC}
            frameBorder="0"
            scrolling="auto"
            allowpaymentrequest="true"
            style={{ minWidth: '100%', maxWidth: '100%', width: '1px', height: '2400px', border: 'none', borderRadius: '16px' }}
          />
          <noscript>
            <p style={{ fontFamily: "'Varela Round',sans-serif", color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', textAlign: 'center' }}>
              To book a visit, please open our secure form: <a href={JF_SRC} style={{ color: 'var(--gold-soft)' }}>{JF_SRC}</a>
            </p>
          </noscript>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */

export default function Book() {
  return (
    <>
      <Seo title="Book a Visit — Healing Soulutions Concierge Nursing" description="Schedule a concierge nursing visit with Healing Soulutions. Complete secure intake, consent, and card-on-file through our HIPAA-secure booking form, serving the New York metro area." />
      <BookContent />
    </>
  );
}
