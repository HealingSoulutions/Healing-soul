import { useRouter } from 'next/router';
import Link from 'next/link';
import Seo from '../components/Seo';
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
            <p className="hero-mission" style={{ borderLeft: 'none', paddingLeft: 0, textAlign: 'center', marginTop: 0, fontFamily: "'Varela Round', sans-serif", fontSize: '0.92rem', lineHeight: 1.72, maxWidth: 470, color: '#D9AC63', fontWeight: 400, textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>
              Healing Soulutions was founded on a simple belief: trusted, personalized care is something only the human touch can provide. Technology and AI can automate much of medicine &mdash; but never human trust, compassion, and empathy, nor the skill of a nurse at your side. As nurses, we work alongside you: listening, guiding, and advocating, to build a relationship that genuinely enriches your life. Every plan is shaped uniquely around you, because we want you involved, invested, and curious &mdash; an active partner in your own care.
            </p>
            <p className="hero-mission" style={{ borderLeft: 'none', paddingLeft: 0, textAlign: 'center', marginTop: '0.9rem', fontFamily: "'Varela Round', sans-serif", fontSize: '0.92rem', lineHeight: 1.72, maxWidth: 470, color: '#D9AC63', fontWeight: 400, fontStyle: 'italic', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>
              With your wellness at the center, our purpose is simple: that you feel your best. Present and happy in your life &mdash; for yourself, your family, your friends, and your work.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--jade-mist)', fontSize: '0.88rem', letterSpacing: '0.02em', margin: '0 0 0.2rem' }}>
                <span style={{ color: '#DBAA64', fontStyle: 'normal', fontWeight: 700 }}>&mdash;</span> The Healing Soulutions experience
              </p>
              <h1 style={{ textAlign: 'center', fontSize: '0.72rem', margin: 0, fontFamily: "'Varela Round', sans-serif" }}>
                <em style={{ fontWeight: 400, fontStyle: 'italic', color: '#D9AC63' }}>Healing. Experience. Compassion.</em>
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="services-home">
        <div className="sec-header">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.3rem', maxWidth: 500, margin: '0 auto' }}>
            <button className="btn-jade" onClick={() => router.push('/book')}><span style={{ color: '#DBAA64', fontSize: '0.88rem' }}>{'\u2606'}</span> Book a Visit</button>
            <a href="tel:+15857472215" className="btn-jade"><GoldPhoneIcon size={14} /> Call Us</a>
            <a href="mailto:info@healingsoulutions.care" className="btn-jade"><GoldEmailIcon size={14} /> Email Us</a>
            <button className="btn-jade" onClick={() => router.push('/services')}><span style={{ color: '#DBAA64', fontSize: '0.88rem' }}>{'\u2192'}</span> Learn More</button>
          </div>
        </div>
      </section>
      <section aria-labelledby="wwd-heading" style={{ background: '#013C1C', padding: '2.5rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.22em', color: 'var(--gold-soft)', textTransform: 'uppercase' }}>What We Do</span>
          <h2 id="wwd-heading" style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--jade-whisper)', margin: '0.5rem 0 1.6rem' }}>Hospital-grade care, delivered to you</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.9rem' }}>
            {[
              ['✦', 'IV & Infusion Therapy', 'Hydration, vitamin, and NAD+ drips delivered in your home or office.'],
              ['❖', 'In-Home & Post-Op Nursing', 'Skilled bedside care, wound care, and recovery support after surgery.'],
              ['⚕', 'Diagnostics & Lab Draws', 'At-home blood draws and lab testing, with results reviewed by a clinician.'],
              ['✧', 'Wellness & Care Plans', 'Medically guided wellness, medication education, and personalized care plans.'],
            ].map(([icon, title, blurb]) => (
              <Link key={title} href="/services" style={{ textDecoration: 'none', display: 'block', textAlign: 'left', background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(219,170,100,0.7)', boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '1.2rem 1.25rem' }}>
                <div aria-hidden="true" style={{ fontSize: '1.3rem', color: 'var(--gold-soft)', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-soft)', marginBottom: '0.35rem' }}>{title}</div>
                <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.76rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{blurb}</p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '1.6rem' }}>
            <Link href="/services" className="btn-jade" style={{ display: 'inline-flex', width: 'auto', padding: '0.55rem 1.4rem', fontSize: '0.7rem' }}><span style={{ color: '#DBAA64' }}>{'→'}</span> See all services</Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="area-heading" style={{ background: '#02240f', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.22em', color: 'var(--gold-soft)', textTransform: 'uppercase' }}>Service Area</span>
          <h2 id="area-heading" style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--jade-whisper)', margin: '0.5rem 0 0.9rem' }}>Serving Manhattan &amp; the New York metro area</h2>
          <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', maxWidth: 620, margin: '0 auto 1.1rem' }}>Concierge and mobile nursing across Manhattan — from the Upper East and West Sides to Midtown, Chelsea, Tribeca, and beyond. Care in the surrounding New York metropolitan area is available on request.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {['Upper East Side', 'Upper West Side', 'Midtown', 'Chelsea', 'Tribeca', 'SoHo', 'Greenwich Village'].map((a) => (
              <span key={a} style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.68rem', color: 'var(--gold-soft)', background: 'rgba(219,170,100,0.10)', border: '1px solid rgba(219,170,100,0.22)', borderRadius: '999px', padding: '0.3rem 0.85rem' }}>{a}</span>
            ))}
          </div>
          <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.72rem', color: 'var(--jade-soft)', marginTop: '1rem' }}>Outside Manhattan? <Link href="/contact" style={{ color: 'var(--gold-soft)' }}>Contact us</Link> and we&rsquo;ll confirm.</p>
        </div>
      </section>
      <div className="trust-ribbon">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem 0' }}>
          {['Licensed RNs & NPs', 'HIPAA Compliant', 'Fully Insured', 'Same-Day When Available'].map((t, i) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {i > 0 && <span style={{ width: 3, height: 3, background: 'var(--gold-soft)', borderRadius: '50%', margin: '0 0.5rem' }} />}
              <span style={{ fontSize: '0.65rem', color: 'var(--jade-mist)', fontWeight: 500, letterSpacing: '0.04em' }}>{t}</span>
            </span>
          ))}
        </div>
      </div>
      <section aria-label="Client testimonial" style={{ background: '#02240f', padding: '1.6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Varela Round', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--jade-soft)', fontSize: '0.88rem', lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
          <span style={{ color: 'var(--gold-soft)', fontSize: '1.5em', lineHeight: 0, verticalAlign: '-0.35em' }}>&ldquo;</span>
          Their medical expertise, preparation, and human compassion were exceptional &mdash; Healing Soulutions made a significant difference in my recovery, and the whole team is top-notch.
          <span style={{ color: 'var(--gold-soft)', fontSize: '1.5em', lineHeight: 0, verticalAlign: '-0.55em' }}>&rdquo;</span>
        </p>
        <p style={{ fontFamily: "'Varela Round', sans-serif", color: 'var(--gold-soft)', fontSize: '0.8rem', letterSpacing: '0.08em', marginTop: '0.9rem', textTransform: 'uppercase' }}>&mdash; Healing Soulutions client</p>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Seo title="Healing Soulutions — Concierge & Mobile Nursing | New York Metro" description="Healing Soulutions brings concierge and mobile nursing care to you across the New York metropolitan area — IV therapy, in-home and post-op nursing, at-home lab draws, and wellness services delivered by licensed RNs and Nurse Practitioners." />
      <HomeContent />
    </>
  );
}
