import Link from 'next/link';
import { useRouter } from 'next/router';

const GOLD = '#DBAA64';
const PHONE = '+15857472215';

// Persistent express lane: a "Book a Visit" pill plus quick Call / Text, on every page
// except the booking page itself. Sits opposite the audio toggle, below the intro's z-index
// so it appears once the entry experience clears.
export default function BookCta() {
  const router = useRouter();
  if (router.pathname.startsWith('/book')) return null;

  const iconBtn = {
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(1,60,28,0.72)', border: `1.5px solid rgba(219,170,100,0.7)`,
    boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 6px 18px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    color: GOLD, textDecoration: 'none',
  };

  return (
    <div style={{ position: 'fixed', left: '18px', bottom: '18px', zIndex: 99989, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Link
        href="/book"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: GOLD, color: '#013C1C', textDecoration: 'none',
          fontFamily: "'Varela Round', sans-serif", fontWeight: 700, fontSize: '0.75rem',
          letterSpacing: '0.04em', padding: '0.62rem 1.15rem', borderRadius: 999,
          boxShadow: '0 6px 18px rgba(0,0,0,0.3), 0 0 0 1px rgba(219,170,100,0.2)',
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
