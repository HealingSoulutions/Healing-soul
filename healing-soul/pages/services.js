import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SceneBackground from '../components/SceneBackground';
import { serviceCategories } from '../lib/data';

function ServicesContent() {
  const router = useRouter();
  const [openCat, setOpenCat] = useState(null);
  const [openSvc, setOpenSvc] = useState(null);
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <SceneBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ padding: '8rem 3rem 0.75rem', textAlign: 'center', background: 'transparent', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: 'rgba(18,70,47,0.86)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ margin: '0.5rem 0 0' }}><img src={"/emblem.png"} alt="" aria-hidden="true" style={{ height: '8.57rem', width: 'auto', display: 'inline-block' }} /></div>
            <div style={{ width: 40, height: 1.5, background: 'var(--gold-soft)', margin: '0.5rem auto 0.7rem' }} />
            <h1 style={{ color: 'var(--gold-soft)', fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Outfit',sans-serif", margin: '1.1rem 0 0' }}>Our Services</h1>
          </div>
        </div>
        <div style={{ padding: '0.5rem 3rem 3rem', maxWidth: 800, margin: '0 auto' }}>
          {serviceCategories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: '0.75rem' }}>
              <div className="svc-card">
                <div className="svc-card-header" role="button" tabIndex={0} aria-expanded={openCat === cat.id} onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenCat(openCat === cat.id ? null : cat.id); } }}>
                  <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: '0.92rem', fontWeight: 400, color: 'var(--jade-whisper)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--gold-soft)', fontSize: '0.9rem' }}>{cat.icon}</span>{cat.title}
                  </h3>
                  <span style={{ color: 'var(--gold-soft)', transition: 'transform 0.4s', transform: openCat === cat.id ? 'rotate(180deg)' : 'none' }}>{'\u25BC'}</span>
                </div>
              </div>
              {openCat === cat.id && (
                <div style={{ background: 'rgba(18,70,47,0.86)', backdropFilter: 'blur(20px)', borderRadius: '0 0 12px 12px', padding: '0.5rem' }}>
                  {cat.consultOnly && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 0.85rem', margin: '0.25rem 0.4rem 0.5rem', background: 'rgba(127,212,160,0.08)', borderRadius: '8px', border: '1px solid rgba(127,212,160,0.12)' }}>
                      <span style={{ color: '#7FD4A0', fontSize: '0.6rem' }}>{'\u2139'}</span>
                      <span style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Outfit',sans-serif", lineHeight: 1.5, flex: 1 }}>This service requires an initial consultation with our Nurse Practitioner before treatment.</span>
                      <button onClick={() => router.push('/book')} style={{ background: 'var(--gold-soft)', color: '#013C1C', border: 'none', borderRadius: '6px', padding: '0.35rem 0.7rem', fontSize: '0.45rem', fontFamily: "'Outfit',sans-serif", fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Book Consult</button>
                    </div>
                  )}
                  {(cat.displayServices || cat.services).map((s) => (
                    <div key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem 0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} role="button" tabIndex={0} aria-expanded={openSvc === s.id} aria-label={s.title} onClick={() => setOpenSvc(openSvc === s.id ? null : s.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenSvc(openSvc === s.id ? null : s.id); } }}>
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '0.72rem', color: 'var(--gold-soft)' }}>{s.title}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-soft)', transition: 'transform 0.3s', transform: openSvc === s.id ? 'rotate(180deg)' : 'none' }}>{'\u25BE'}</span>
                      </div>
                      {openSvc === s.id && (
                        <div style={{ padding: '0.4rem 0.75rem 0.75rem', fontFamily: "'Outfit',sans-serif" }}>
                          <p style={{ marginBottom: '0.5rem', opacity: 0.75, fontSize: '0.65rem', lineHeight: 1.6, color: '#fff' }}>{s.desc}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {s.tags.map((t, i) => (
                              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span className="svc-tag">{t}</span>
                                {i < s.tags.length - 1 && <span style={{ color: '#fff', fontSize: '0.4rem', opacity: 0.3 }}>{'\u2022'}</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTACT / BOOKING PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */


export default function Services() {
  return (
    <>
      <Head>
        <title>Our Services — Healing Soulutions Concierge Nursing</title>
        <meta name="description" content="Explore Healing Soulutions services: IV and infusion therapy, in-home and post-op nursing, at-home diagnostics and lab draws, medication education, telehealth, and medically guided wellness — delivered in your home." />
      </Head>
      <ServicesContent />
    </>
  );
}
