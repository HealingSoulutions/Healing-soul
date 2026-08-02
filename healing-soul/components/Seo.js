import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE = 'https://healingsoulutions.care';

// Per-route social share images (1200x630) with a global fallback.
const OG_IMAGES = {
  '/': '/og-home.png',
  '/services': '/og-services.png',
  '/about': '/og-about.png',
  '/book': '/og-book.png',
};

// Shared SEO head: per-page title, description, canonical URL, per-page Open Graph /
// Twitter image, title, and description. Global OG site_name/type live in _document.js.
export default function Seo({ title, description }) {
  const { pathname } = useRouter();
  const url = SITE + (pathname === '/' ? '' : pathname);
  const image = SITE + (OG_IMAGES[pathname] || '/og-image.png');
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
