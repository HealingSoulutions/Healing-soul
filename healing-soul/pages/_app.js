import '../styles/globals.css';
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
    </>
  );
}
