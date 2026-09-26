import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const GOLD = '#73a89a';
const INK = '#251f21';
const PHONE = '+15857472215';

// Persistent express lane: a "Book a Visit" pill plus quick Call / Text, on every page
// except the booking page itself. Sits opposite the audio toggle, below the intro's z-index
// so it appears once the entry experience clears.
export default function BookCta() {
  const router = useRouter();
  const onBookPage = router.pathname.startsWith('/book');
  // Slide out of the way while the user scrolls down (reading), return on any scroll up,
  // near the top, or near the bottom where the footer clearance lives.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (onBookPage) return undefined;
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 120;
        if (nearBottom || y < 120 || y < lastY - 4) setHidden(false);
        else if (y > lastY + 4) setHidden(true);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onBookPage]);
  if (onBookPage) return null;

  const iconBtn = {
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,0.72)', border: `1.5px solid rgba(115,168,154,0.7)`,
    boxShadow: '0 0 0 1px rgba(115,168,154,0.18), 0 6px 18px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    color: GOLD, textDecoration: 'none',
  };

  return (
    <div style={{ position: 'fixed', right: '18px', bottom: '18px', zIndex: 99989, display: 'flex', alignItems: 'center', gap: '0.5rem', transform: hidden ? 'scale(0.88) translateY(160%)' : 'scale(0.88)', transformOrigin: 'bottom right', opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto', transition: 'transform 0.35s ease, opacity 0.35s ease' }}>
      <Link
        href="/book"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: INK, color: '#ffffff', textDecoration: 'none',
          fontFamily: "'KMR Melange Grotesk', sans-serif", fontWeight: 700, fontSize: '0.75rem',
          letterSpacing: '0.04em', padding: '0.62rem 1.15rem', borderRadius: 999,
          boxShadow: '0 6px 18px rgba(37,31,33,0.22)',
        }}
      >
        Book a Visit
      </Link>
      <a href={`tel:${PHONE}`} aria-label="Call us" title="Call" style={iconBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      <a href={`sms:${PHONE}`} aria-label="Text us" title="Text" style={iconBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
}
