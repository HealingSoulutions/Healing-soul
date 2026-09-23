import Head from "next/head";
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
        <img
          className="wordmark"
          src="/wordmark-gold.png"
          alt="Healing Soulutions — Concierge Nursing"
          width={900}
          height={378}
        />
        <ServiceJourney />
      </main>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background: #013c1c;
          padding: 72px 20px 72px;
        }
        .wordmark {
          display: block;
          width: min(337px, 69%);
          height: auto;
          margin: 0 auto 8px;
        }
      `}</style>
    </>
  );
}
