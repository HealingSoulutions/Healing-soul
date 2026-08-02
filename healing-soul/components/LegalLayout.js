import Head from 'next/head';
import SceneBackground from './SceneBackground';

export default function LegalLayout({ title, description, effective, children }) {
  return (
    <>
      <Head>
        <title>{title} — Healing Soulutions</title>
        <meta name="description" content={description} />
      </Head>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <SceneBackground />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 780, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
          <div style={{ background: 'rgba(18,70,47,0.86)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '2rem 2.1rem' }}>
            <h1 style={{ fontFamily: "'Varela Round',serif", color: 'var(--gold-soft)', fontSize: '1.7rem', fontWeight: 600, marginBottom: '0.3rem' }}>{title}</h1>
            {effective && <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>Effective Date: {effective}</p>}
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
      {heading && <h2 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{heading}</h2>}
      <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>{children}</p>
    </div>
  );
}
