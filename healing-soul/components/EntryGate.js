import { useState, useEffect, useCallback } from 'react';

// Home-page entry gate. Shows a branded "Tap to begin" frame on the first visit
// of a session. The single tap satisfies the browser's audio-unlock requirement,
// so it launches BOTH the cinematic intro and the ambient sound together.
// Skipped for reduced-motion visitors and after the first time each session.
export default function EntryGate() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let seen = false;
    try { seen = sessionStorage.getItem('hs_entry_seen') === '1'; } catch (e) {}
    if (seen) return;
    setShow(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const enter = useCallback(() => {
    try { sessionStorage.setItem('hs_entry_seen', '1'); } catch (e) {}
    // Load the cinematic intro now, so it plays together with the sound.
    // (The ambient audio unlocks from this same tap via the site-wide player.)
    try {
      // once:false — the gate already enforces once-per-session, so the overlay
      // must not self-suppress via its own sessionStorage flag (that was skipping the intro).
      window.HS_INTRO = { duration: 5, sound: false, once: false, keepSoundToggle: false };
      if (!window.__hsIntroLoaded && !document.getElementById('hs-intro-js')) {
        const s = document.createElement('script');
        s.id = 'hs-intro-js';
        s.src = '/intro-overlay.js';
        s.defer = true;
        document.body.appendChild(s);
      }
    } catch (e) {}
    setLeaving(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, 700);
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, enter]);

  if (!show) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Tap to enter Healing Soulutions with sound"
      onClick={enter}
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483600,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(120% 90% at 50% 42%, #0b4629 0%, #083c22 45%, #02180D 100%)',
        cursor: 'pointer', textAlign: 'center', padding: '2rem',
        opacity: leaving ? 0 : 1, transition: 'opacity 0.7s ease',
      }}
    >
      <style>{`
        @keyframes hsGateIn { 0% { opacity: 0; transform: translateY(10px) scale(0.985); } 100% { opacity: 1; transform: none; } }
        @keyframes hsGatePulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes hsGateRing { 0%,100% { box-shadow: 0 0 0 0 rgba(219,170,100,0.0); } 50% { box-shadow: 0 0 0 8px rgba(219,170,100,0.08); } }
      `}</style>
      <div style={{ animation: 'hsGateIn 1.2s ease both' }}>
        <img
          src="/wordmark.png"
          alt="Healing Soulutions"
          style={{ width: 'min(340px, 78vw)', height: 'auto', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 6px 22px rgba(0,0,0,0.4))' }}
        />
        <div
          aria-hidden="true"
          style={{
            width: 60, height: 60, borderRadius: '50%', margin: '2rem auto 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid rgba(219,170,100,0.8)', background: 'rgba(1,60,28,0.5)',
            animation: 'hsGateRing 2.4s ease-in-out infinite',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#DBAA64" aria-hidden="true" style={{ marginLeft: 3 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p style={{
          fontFamily: "'Varela Round', sans-serif", color: '#DBAA64',
          fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          margin: '1.1rem 0 0', animation: 'hsGatePulse 2.4s ease-in-out infinite',
        }}>
          Tap to begin
        </p>
        <p style={{
          fontFamily: "'Varela Round', sans-serif", color: 'rgba(255,255,255,0.45)',
          fontSize: '0.6rem', letterSpacing: '0.1em', margin: '0.5rem 0 0',
        }}>
          with sound
        </p>
      </div>
    </div>
  );
}
