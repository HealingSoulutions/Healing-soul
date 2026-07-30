import Link from 'next/link';

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-inner">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/services" className="footer-link">Services</Link>
          <Link href="/book" className="footer-link">Book a Visit</Link>
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Use</Link>
        </div>
        <div className="footer-legal">&copy; 2026 Healing Soulutions. All rights reserved.</div>
      </div>
    </footer>
  );
}
