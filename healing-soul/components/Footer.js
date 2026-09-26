import Link from 'next/link';

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-inner">
        <img src="/emblem-metallic.png" alt="" aria-hidden="true" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 0.9rem' }} />
        <div style={{ display: 'flex' , justifyContent: 'center', gap: '1.25rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/book" className="footer-link">Book a Visit</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/notice-of-privacy-practices" className="footer-link">Notice of Privacy Practices</Link>
          <Link href="/terms" className="footer-link">Terms of Use</Link>
          <Link href="/accessibility" className="footer-link">Accessibility</Link>
        </div>
        <div className="footer-legal">&copy; 2026 Healing Soulutions. All rights reserved.</div>
      </div>
    </footer>
  );
}
