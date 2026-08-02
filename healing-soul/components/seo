import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE = 'https://healingsoulutions.care';

// Shared SEO head: per-page title, description, canonical URL, and Open Graph /
// Twitter title+description. Global OG tags (image, site_name, type) live in _document.js.
export default function Seo({ title, description }) {
  const { pathname } = useRouter();
  const url = SITE + (pathname === '/' ? '' : pathname);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
