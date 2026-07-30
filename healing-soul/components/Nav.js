import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const [mo, setMo] = useState(false);
  const router = useRouter();
  const home = router.pathname === '/';
  const links = [['Home', '/'], ['Services', '/services'], ['About', '/about'], ['Contact', '/book'], ['Book a Visit', '/book']];
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav aria-label="Main navigation" style={{ justifyContent: home ? 'center' : 'space-between' }}>
        {!home && (
          <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} aria-label="Healing Soulutions - home">
            <img src="/emblem.png" alt="Healing Soulutions" style={{ height: '3.48rem', width: 'auto', display: 'block' }} />
          </Link>
        )}
        <ul className={'nav-links' + (mo ? ' active' : '')} id="nav-menu">
          {links.map(([label, href]) => (
            <li key={label}><Link href={href} className="nav-btn" onClick={() => setMo(false)}>{label}</Link></li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setMo(!mo)} aria-expanded={mo} aria-controls="nav-menu" aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>
    </>
  );
}
