import Seo from '../components/Seo';
import Link from 'next/link';
import SceneBackground from '../components/SceneBackground';

const CARD = { background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(219,170,100,0.7)', boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '2rem 2.4rem', marginBottom: '1.25rem', textAlign: 'center' };
const EY = { fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontFamily: "'Varela Round',sans-serif" };
const H = { fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '1.15rem', fontWeight: 400, margin: '0.5rem 0 0.8rem' };
const P = { fontFamily: "'Varela Round',sans-serif", fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', marginBottom: '0.5rem' };
const LABEL = { ...EY, fontSize: '0.58rem', display: 'block', marginBottom: '0.25rem' };
const VALUE = { fontFamily: "'Varela Round',sans-serif", fontSize: '1.05rem', color: 'var(--gold-soft)', textDecoration: 'none' };

export default function Contact() {
  return (
    <>
      <Seo title="Contact — Healing Soulutions Concierge Nursing" description="Contact Healing Soulutions concierge and mobile nursing — call, email, or book a visit. Serving New York City and the surrounding metropolitan area by appointment." />
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <SceneBackground />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
          <div style={CARD}>
            <span style={EY}>Contact</span>
            <h1 style={H}>We&rsquo;re here to help</h1>
            <p style={{ ...P, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>Reach us directly to ask a question, confirm availability at your location, or arrange a visit. Our team follows up within 24 hours.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.6rem', margin: '1.6rem 0 0.5rem' }}>
              <div>
                <span style={LABEL}>Call</span>
                <a href="tel:+15857472215" style={VALUE}>(585) 747-2215</a>
              </div>
              <div>
                <span style={LABEL}>Email</span>
                <a href="mailto:info@healingsoulutions.care" style={VALUE}>info@healingsoulutions.care</a>
              </div>
            </div>
          </div>

          <div style={CARD}>
            <span style={EY}>Service Area</span>
            <h2 style={H}>Manhattan &amp; the New York metro area</h2>
            <p style={{ ...P, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', marginBottom: 0 }}>We primarily serve Manhattan, bringing concierge and mobile nursing to homes, offices, and hotels across the borough — from the Upper East and West Sides to Midtown, Chelsea, and Tribeca. Care in the surrounding New York metropolitan area is available on request; call or email and we&rsquo;ll confirm.</p>
          </div>

          <div style={CARD}>
            <span style={EY}>Ready to begin?</span>
            <h2 style={H}>Book a visit online</h2>
            <p style={{ ...P, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>Choose your services, complete a secure intake, and pick a time that works for you.</p>
            <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
              <Link href="/book" className="btn-submit" style={{ display: 'inline-block', width: 'auto', padding: '0.7rem 2rem', textDecoration: 'none' }}>Book a Visit</Link>
            </div>
          </div>

          <p style={{ ...P, fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>For a medical emergency, call 911. This website is informational and is not a substitute for emergency care.</p>
        </div>
      </div>
    </>
  );
}
