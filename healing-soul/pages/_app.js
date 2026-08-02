import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Component {...pageProps} />
      </main>
      <Footer />
      {/* Privacy-safe: cookieless, no PII, and disabled on the /book intake flow (no PHI pages tracked). */}
      <Analytics beforeSend={(event) => (event.url.includes('/book') ? null : event)} />
    </>
  );
}
