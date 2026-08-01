import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GoldPhoneIcon, GoldEmailIcon } from '../components/icons';

function HomeContent() {
  const router = useRouter();
  return (
    <>
      <section className="hero">
        <div className="hero-gif" aria-hidden="true" />
        <div className="hero-gif-tint" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-text-panel">
            <img src={"/wordmark.png"} alt="Healing Soulutions — Concierge Nursing" style={{ display: 'block', width: 'min(437px, 99%)', height: 'auto', margin: '0 auto 1rem' }} />
            <div style={{ width: 48, height: 1.5, background: 'var(--gold-soft)', margin: '0.4rem auto 1rem', opacity: 0.9 }} />
            <p className="hero-mission" style={{ borderLeft: 'none', paddingLeft: 0, textAlign: 'center', marginTop: 0, fontFamily: "'Varela Round', sans-serif", fontSize: '1.02rem', lineHeight: 1.72, maxWidth: 460, color: '#D9AC63', fontWeight: 400, textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>
              Expert nursing care, wherever you&rsquo;re most comfortable — your home, your office, anywhere you call yours.{' '}
              <em style={{ fontStyle: 'italic' }}>Our focus is on your wellness, health and vitality, so you can be fully present: for yourself, your purpose, and the people who matter most.</em>
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ textAlign: 'left', fontStyle: 'italic', color: 'var(--jade-mist)', fontSize: '0.88rem', letterSpacing: '0.02em', margin: '0 0 0.2rem' }}>
                <span style={{ color: '#DBAA64', fontStyle: 'normal', fontWeight: 700 }}>&mdash;</span> The Healing Soulutions experience
              </p>
              <h1 style={{ textAlign: 'left', fontSize: '0.88rem', margin: 0 }}>
                <em style={{ fontWeight: 700, fontStyle: 'italic', color: '#D9AC63' }}>Healing. Experience. Compassion.</em>
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="services-home">
        <div className="sec-header">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.3rem', maxWidth: 500, margin: '0 auto' }}>
            <button className="btn-jade" onClick={() => router.push('/book')}><span style={{ color: '#DBAA64', fontSize: '0.7rem', opacity: 0.65 }}>{'\u2606'}</span> Book a Visit</button>
            <a href="tel:+15857472215" className="btn-jade"><GoldPhoneIcon size={11} /> Call Us</a>
            <a href="mailto:info@healingsoulutions.care" className="btn-jade"><GoldEmailIcon size={11} /> Email Us</a>
            <button className="btn-jade" onClick={() => router.push('/services')}><span style={{ color: '#DBAA64', fontSize: '0.7rem', opacity: 0.65 }}>{'\u2192'}</span> Learn More</button>
          </div>
        </div>
      </section>
      <div className="trust-ribbon">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem 0' }}>
          {['Licensed RNs & NPs', 'HIPAA Compliant', 'Fully Insured', 'Same-Day Availability'].map((t, i) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {i > 0 && <span style={{ width: 3, height: 3, background: 'var(--gold-soft)', borderRadius: '50%', margin: '0 0.5rem' }} />}
              <span style={{ fontSize: '0.65rem', color: 'var(--jade-mist)', fontWeight: 500, letterSpacing: '0.04em' }}>{t}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SERVICES PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */


export default function Home() {
  return (
    <>
      <Head>
        <title>Healing Soulutions — Concierge & Mobile Nursing | New York Metro</title>
        <meta name="description" content="Healing Soulutions brings concierge and mobile nursing care to you across the New York metropolitan area — IV therapy, in-home and post-op nursing, at-home lab draws, and wellness services delivered by licensed RNs and Nurse Practitioners." />
      </Head>
      <HomeContent />
    </>
  );
}
