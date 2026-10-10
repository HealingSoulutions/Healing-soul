import Head from "next/head";
import Link from "next/link";
import ServiceJourney from "../components/ServiceJourney";

const TITLE = "Healing Soulutions — Concierge & Mobile Nursing | New York Metro";
const DESCRIPTION =
  "Concierge nursing in your home. A skilled nursing team that knows you, comes to you, and follows through. Serving Manhattan and the New York metro area.";

const schema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Healing Soulutions",
  alternateName: "Healing Soulutions Concierge Nursing",
  description:
    "Concierge and mobile nursing care across the New York metropolitan area — IV therapy, in-home and post-operative nursing, at-home lab draws, telehealth, and medically guided wellness by licensed RNs and Nurse Practitioners.",
  url: "https://healingsoulutions.care",
  telephone: "+1-585-747-2215",
  email: "info@healingsoulutions.care",
  image: "https://healingsoulutions.care/og-image.png",
  logo: "https://healingsoulutions.care/emblem.png",
  medicalSpecialty: "Nursing",
  areaServed: { "@type": "Place", name: "New York Metropolitan Area" },
  priceRange: "$$",
  knowsAbout: [
    "IV therapy",
    "Mobile nursing",
    "Post-operative care",
    "Telehealth",
    "At-home lab draws",
  ],
};


export default function Home() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://healingsoulutions.care" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content="https://healingsoulutions.care" />
        <meta property="og:image" content="https://healingsoulutions.care/og-home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content="https://healingsoulutions.care/og-home.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main id="main-content" className="home">
        <ServiceJourney />
        <section className="starter" aria-label="Your first visit">
          <span className="eyebrow">Start here</span>
          <h2>Your first visit: establish your baseline.</h2>
          <p>
            Most clients start here. A licensed nurse draws your labs at home, and a provider reviews
            the results with you to build your protocol.
          </p>
          <div className="cta-row">
            <Link href="/book" className="cta-primary">Book a Visit</Link>
            <Link href="/services/at-home-testing" className="cta-secondary">See At-Home Testing</Link>
          </div>
        </section>
        <section className="proof" aria-label="Your clinicians">
          <span className="eyebrow">Your clinicians</span>
          <h2>Licensed nurses and a board-certified NP.</h2>
          <div className="proof-grid">
            <div className="proof-card">
              <img src="/berit.jpg" alt="Berit Tran, Registered Nurse and founder of Healing Soulutions" width={96} height={96} loading="lazy" />
              <strong>Berit Tran, BSN, RN</strong>
              <span>15+ years in New York hospitals: ER, ICU, med-surg, post-surgical recovery</span>
              <em>Licensed RN · ACLS · PALS · BLS</em>
            </div>
            <div className="proof-card">
              <img src="/kristina.jpg" alt="Kristina Castro, Nurse Practitioner at Healing Soulutions" width={96} height={96} loading="lazy" />
              <strong>Kristina Castro, MSN, APRN, FNP-BC</strong>
              <span>10+ years in New York ICUs and emergency departments</span>
              <em>ANCC Board Certified · Licensed NP (NY &amp; CT)</em>
            </div>
          </div>
          <Link href="/about" className="proof-link">Meet the team</Link>
        </section>
        <div className="brandband">
          <img
            className="wordmark"
            src="/wordmark-metallic.png"
            alt="Healing Soulutions — Concierge Nursing"
            width={900}
            height={378}
          />
        </div>
      </main>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background: #fbfaf9;
          padding: 0;
          overflow-x: clip;
        }
        .starter {
          max-width: 760px;
          margin: 0 auto;
          padding: 64px 20px 8px;
          text-align: center;
        }
        .eyebrow {
          display: block;
          margin: 0 0 16px;
          color: #73a89a;
          font: 500 11px/1 'KMR Melange Grotesk', system-ui, sans-serif;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .starter h2 {
          margin: 0 auto 16px;
          max-width: 560px;
          color: #251f21;
          font: 500 30px/1.2 'Aime', Georgia, serif;
        }
        .starter p {
          margin: 0 auto;
          max-width: 560px;
          color: rgba(37, 31, 33, 0.78);
          font: 400 14px/1.75 'KMR Melange Grotesk', system-ui, sans-serif;
        }
        .cta-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 26px;
        }
        .starter :global(.cta-primary) {
          display: inline-block;
          padding: 12px 26px;
          border-radius: 999px;
          background: #251f21;
          color: #fbfaf9;
          text-decoration: none;
          font: 500 15px/1 'KMR Melange Grotesk', system-ui, sans-serif;
        }
        .starter :global(.cta-secondary) {
          display: inline-block;
          padding: 12px 26px;
          border: 1px solid rgba(115, 168, 154, 0.6);
          border-radius: 999px;
          color: #251f21;
          text-decoration: none;
          font: 500 15px/1 'KMR Melange Grotesk', system-ui, sans-serif;
        }
        .proof { max-width: 760px; margin: 0 auto; padding: 56px 20px 8px; text-align: center; }
        .proof h2 { margin: 0 auto 24px; max-width: 520px; color: #251f21; font: 500 26px/1.25 'Aime', Georgia, serif; }
        .proof-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .proof-grid { grid-template-columns: 1fr 1fr; } }
        .proof-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px 16px; border: 1px solid rgba(115,168,154,0.4); border-radius: 14px; background: #fff; }
        .proof-card img { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; }
        .proof-card strong { color: #251f21; font: 500 16px/1.3 'KMR Melange Grotesk', system-ui, sans-serif; }
        .proof-card span { color: rgba(37,31,33,0.78); font: 400 13px/1.55 'KMR Melange Grotesk', system-ui, sans-serif; }
        .proof-card em { color: #3f6f62; font: 500 12px/1.5 'KMR Melange Grotesk', system-ui, sans-serif; font-style: normal; }
        .proof :global(.proof-link) { display: inline-block; margin-top: 18px; padding: 12px 8px; color: #251f21; font: 500 14px/1 'KMR Melange Grotesk', system-ui, sans-serif; }
        .brandband {
          background: #013c1c;
          text-align: center;
          padding: 48px 20px 60px;
          margin-top: 56px;
        }
        .wordmark {
          display: inline-block;
          width: min(300px, 66%);
          height: auto;
        }
        .owner-note {
          margin: 28px auto 0 !important;
          padding: 12px 16px;
          border: 1px dashed rgba(115, 168, 154, 0.7);
          border-radius: 12px;
          color: rgba(37, 31, 33, 0.55) !important;
          font: 400 11.5px/1.6 'KMR Melange Grotesk', system-ui, sans-serif !important;
        }
      `}</style>
    </>
  );
}
