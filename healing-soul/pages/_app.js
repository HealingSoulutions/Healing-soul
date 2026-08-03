import '../styles/globals.css';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import AmbientPlayer from '../components/AmbientPlayer';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Vercel Web Analytics via the hosted script — cookieless, no PII, and no npm dependency.
  // Kept off the /book intake flow so nothing runs on the page where health info is entered.
  const analyticsOn = !router.pathname.startsWith('/book');
  return (
    <>
      <Nav />
      <main id="main-content">
        <Component {...pageProps} />
      </main>
      <Footer />
      <AmbientPlayer />
      {analyticsOn && <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />}
    </>
  );
}
