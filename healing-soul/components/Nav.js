import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [mo, setMo] = useState(false);
  const links = [['Home', '/'], ['Services', '/services'], ['About', '/about'], ['Contact', 'mailto:info@healingsoulutions.care'], ['Book a Visit', '/book']];
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav aria-label="Main navigation" style={{ justifyContent: 'center' }}>
        <ul className={'nav-links' + (mo ? ' active' : '')} id="nav-menu">
          {links.map(([label, href]) => {
            const external = /^(mailto:|tel:|https?:)/.test(href);
            return (
              <li key={label}>
                {external
                  ? <a href={href} className="nav-btn" onClick={() => setMo(false)}>{label}</a>
                  : <Link href={href} className="nav-btn" onClick={() => setMo(false)}>{label}</Link>}
              </li>
            );
          })}
        </ul>
        <button className="hamburger" onClick={() => setMo(!mo)} aria-expanded={mo} aria-controls="nav-menu" aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>
    </>
  );
}
