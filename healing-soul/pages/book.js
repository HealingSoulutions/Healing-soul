import { useEffect, useRef } from 'react';
import Seo from '../components/Seo';
import SceneBackground from '../components/SceneBackground';

// ============================================================
//  Healing Soulutions — Book a Visit (JotForm embed)
//  Drop-in replacement for your old custom multi-step form.
//  PHI is collected inside JotForm's HIPAA iframe; this page is
//  just your branded frame around it.
//
//  SETUP: In JotForm ▸ Publish ▸ Embed ▸ iFrame, copy the form id
//  from the URL (https://form.jotform.com/<THIS_PART>) and paste it
//  into JOTFORM_ID below. That's the only change you need.
// ============================================================

const JOTFORM_ID = '262167960112050';

function JotformEmbed() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // mark as embedded so JotForm sends resize messages
    try {
      const url = new URL(iframe.src);
      url.searchParams.set('isIframeEmbed', '1');
      iframe.src = url.toString();
    } catch (e) {}

    const permitted = (origin) => {
      try {
        const h = new URL(origin).hostname;
        return h === 'jotform.com' || h.endsWith('.jotform.com') || h.endsWith('.jotform.pro');
      } catch (e) { return false; }
    };

    const onMessage = (e) => {
      if (typeof e.data !== 'string' || !permitted(e.origin)) return;
      const args = e.data.split(':');
      if (args[0] === 'setHeight') {
        iframe.style.height = args[1] + 'px';
        if (!isNaN(args[1]) && parseInt(iframe.style.minHeight) > parseInt(args[1])) {
          iframe.style.minHeight = args[1] + 'px';
        }
      } else if (args[0] === 'scrollIntoView') {
        iframe.scrollIntoView();
      } else if (args[0] === 'collapseErrorPage' && iframe.clientHeight > window.innerHeight) {
        iframe.style.height = window.innerHeight + 'px';
      } else if (args[0] === 'reloadPage') {
        window.location.reload();
      }
      if (iframe.contentWindow && iframe.contentWindow.postMessage) {
        const urls = { docurl: encodeURIComponent(document.URL), referrer: encodeURIComponent(document.referrer) };
        iframe.contentWindow.postMessage(JSON.stringify({ type: 'urls', value: urls }), '*');
      }
    };

    window.addEventListener('message', onMessage, false);
    return () => window.removeEventListener('message', onMessage, false);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      id={`JotFormIFrame-${JOTFORM_ID}`}
      title="Healing Soulutions Patient Intake"
      onLoad={() => window.parent.scrollTo(0, 0)}
      allow="geolocation; microphone; camera; payment"
      src={`https://form.jotform.com/${JOTFORM_ID}`}
      frameBorder="0"
      scrolling="no"
      style={{ width: '100%', minWidth: '100%', minHeight: 900, border: 'none', borderRadius: 8, background: 'transparent' }}
    />
  );
}

function BookContent() {
  // your card style, matched to the rest of the site
  const CS = {
    background: 'rgba(8,44,26,0.9)',
    backdropFilter: 'blur(24px)',
    border: '1.5px solid rgba(219,170,100,0.7)',
    boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <SceneBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Header panel */}
        <div style={{ padding: '8rem 3rem 0.25rem', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div style={CS}>
            <h1 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Book a Visit
            </h1>
            <div style={{ margin: '0.5rem 0' }}>
              <img src="/emblem.png" alt="" aria-hidden="true" style={{ height: '5rem', width: 'auto', display: 'inline-block' }} />
            </div>
            <div style={{ width: 25, height: 0.75, background: 'var(--gold-soft)', margin: '0 auto 0.75rem' }} />
            <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.82rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', maxWidth: 440, margin: '0 auto' }}>
              Complete your intake and consent forms securely below. Your information is protected and handled in a HIPAA-compliant environment. A care coordinator will confirm your appointment shortly after you submit.
            </p>
          </div>
        </div>

        {/* Form panel with the JotForm embed */}
        <div style={{ padding: '0.5rem 3rem 3rem', maxWidth: 800, margin: '0 auto' }}>
          <div style={CS}>
            <JotformEmbed />
          </div>

          {/* trust line */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem 1.5rem', marginTop: '1.1rem', color: '#A8CCBC', fontSize: '0.7rem', fontFamily: "'Varela Round',sans-serif" }}>
            {['HIPAA-compliant intake', 'Encrypted & secure', 'Payments secured by Stripe'].map((t) => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 4, height: 4, background: 'var(--gold-soft)', borderRadius: '50%' }} />{t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Book() {
  return (
    <>
      <Seo
        title="Book a Visit — Healing Soulutions Concierge Nursing"
        description="Schedule a concierge nursing visit with Healing Soulutions. Choose your services, complete secure intake and consent, and book your appointment across the New York metro area."
      />
      <BookContent />
    </>
  );
}
