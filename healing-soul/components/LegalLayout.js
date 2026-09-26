import Head from 'next/head';
import Seo from './Seo';
import SceneBackground from './SceneBackground';

export default function LegalLayout({ title, description, effective, children }) {
  return (
    <>
      <Seo title={`${title} — Healing Soulutions`} description={description} />
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <SceneBackground />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 780, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(115,168,154,0.7)', boxShadow: '0 0 0 1px rgba(115,168,154,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '2rem 2.1rem' }}>
            <h1 style={{ fontFamily: "'Aime', Georgia, serif", color: 'var(--gold-soft)', fontSize: '1.7rem', fontWeight: 500, marginBottom: '0.3rem' }}>{title}</h1>
            {effective && <p style={{ fontFamily: "'KMR Melange Grotesk', sans-serif", fontSize: '0.68rem', color: 'rgba(37,31,33,0.5)', marginBottom: '1.25rem' }}>Effective Date: {effective}</p>}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export function Sec({ heading, children }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      {heading && <h2 style={{ fontFamily: "'KMR Melange Grotesk', sans-serif", color: 'var(--gold-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{heading}</h2>}
      <p style={{ fontFamily: "'KMR Melange Grotesk', sans-serif", fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(37,31,33,0.8)' }}>{children}</p>
    </div>
  );
}
