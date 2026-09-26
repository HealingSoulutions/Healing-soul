import { Html, Head, Main, NextScript } from 'next/document';

const SITE = 'https://healingsoulutions.care';

const LD = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Healing Soulutions',
  alternateName: 'Healing Soulutions Concierge Nursing',
  description:
    'Concierge and mobile nursing care across the New York metropolitan area — IV therapy, in-home and post-operative nursing, at-home lab draws, telehealth, and medically guided wellness by licensed RNs and Nurse Practitioners.',
  url: SITE,
  telephone: '+1-585-747-2215',
  email: 'info@healingsoulutions.care',
  image: SITE + '/og-image.png',
  logo: SITE + '/emblem.png',
  medicalSpecialty: 'Nursing',
  areaServed: { '@type': 'Place', name: 'New York Metropolitan Area' },
  priceRange: '$$',
  knowsAbout: ['IV therapy', 'Mobile nursing', 'Post-operative care', 'Telehealth', 'At-home lab draws'],
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#fbfaf9" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Healing Soulutions" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter (per-page image/title/description come from the Seo component) */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Local business structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
