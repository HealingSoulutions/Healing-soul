import { useEffect, useState } from 'react';
import Link from 'next/link';
import Medallion from './Medallion';
import { SERVICES, BOOK_STEP } from '../lib/services';
import { GOOGLE_REVIEWS } from '../lib/reviews';

// Homepage section: three service-category medallions + Book on a zig-zag path, with
// subtle 01→02→03→04 connectors between them. Clicking a medallion opens a pop-up with the
// category's details. Drop into pages/index.js:  <ServiceJourney />

// Medallion centres as % of the stage, desktop and phone. The SVG paths below pass
// through the same points (viewBox units = % × 10 desktop, % × 3.9 / × 9.2 phone).
// One calm row on desktop; a straight vertical column on phones.
const DESKTOP = [
  { x: 16, y: 50 },
  { x: 37.5, y: 50 },
  { x: 62.5, y: 50 },
  { x: 84, y: 50 },
];
const PHONE = [
  { x: 50, y: 10 },
  { x: 50, y: 36.7 },
  { x: 50, y: 63.3 },
  { x: 50, y: 90 },
];
// Connector segments 01→02→03→04, stopped short of each medallion (per-point gap; the top
// medallion's label hangs into both of its lines, so it gets more room), chevron at the head.
// Computed in px (stage size), then mapped to viewBox units (x stretched, y 1:1).
function segments(points, pxW, pxH, vbW, vbH, gaps, endGap) {
  const sx = vbW / pxW;
  const sy = vbH / pxH;
  const px = points.map((p) => ({ x: (p.x / 100) * pxW, y: (p.y / 100) * pxH }));
  const out = [];
  for (let i = 0; i < px.length - 1; i++) {
    const a = px[i];
    const b = px[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const s1 = { x: a.x + ux * gaps[i], y: a.y + uy * gaps[i] };
    const g2 = endGap ?? gaps[i + 1];
    const s2 = { x: b.x - ux * g2, y: b.y - uy * g2 };
    const head = 7;
    const nx = -uy;
    const ny = ux;
    const h1 = { x: s2.x - ux * head + nx * head * 0.75, y: s2.y - uy * head + ny * head * 0.75 };
    const h2 = { x: s2.x - ux * head - nx * head * 0.75, y: s2.y - uy * head - ny * head * 0.75 };
    const m = (q) => `${(q.x * sx).toFixed(1)},${(q.y * sy).toFixed(1)}`;
    out.push({ line: `M${m(s1)} L${m(s2)}`, head: `M${m(h1)} L${m(s2)} L${m(h2)}` });
  }
  return out;
}
// Small caption under each label, matching the four steps of the intro line.
const CAPTIONS = ['Your baseline', 'Your protocol', 'Replenish & optimize', 'Clinician oversight'];
const DESKTOP_SEGS = segments(DESKTOP, 920, 240, 1000, 240, [66, 66, 66, 66]);
const PHONE_SEGS = segments(PHONE, 358, 740, 390, 740, [104, 104, 104, 104], 66);

export default function ServiceJourney() {
  const [open, setOpen] = useState(null); // index of the service whose pop-up is open
  const [turns, setTurns] = useState([0, 0, 0, 0]);
  const [touched, setTouched] = useState(false); // first interaction dismisses the tap cue
  const current = open == null ? null : SERVICES[open];

  useEffect(() => {
    if (open == null) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    // Move keyboard focus into the dialog, and return it to the medallion on close.
    document.querySelector('.hs-journey-section .close')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, [open]);

  // Touch screens have no hover: swivel each medallion once as it scrolls into view, and on tap
  // swivel first, then open the pop-up so the motion is seen.
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    setTouch(coarse);
    if (!coarse || !('IntersectionObserver' in window)) return undefined;
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number(e.target.dataset.i);
          if (e.isIntersecting && !seen.has(i)) {
            seen.add(i);
            setTimeout(() => setTurns((t) => t.map((v, k) => (k === i ? v + 1 : v))), 250);
            setTimeout(() => setTurns((t) => t.map((v, k) => (k === i ? v + 1 : v))), 1900);
          }
        });
      },
      { threshold: 0.7 }
    );
    document.querySelectorAll('.hs-journey-section .slot').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const openStep = (i) => {
    setTouched(true);
    if (touch) {
      setTurns((t) => t.map((v, k) => (k === i ? v + 1 : v)));
      setTimeout(() => setOpen(i), 700);
    } else {
      setOpen(i);
    }
  };

  // Hover in: swivel half a turn and land on the back. Hover out: swivel on and land on the front.
  const swivel = (i) => {
    setTouched(true);
    setTurns((t) => t.map((v, k) => (k === i ? v + 1 : v)));
  };
  const hoverProps = (i) =>
    touch
      ? {}
      : {
          onMouseEnter: () => swivel(i),
          onMouseLeave: () => swivel(i),
          onFocus: () => swivel(i),
          onBlur: () => swivel(i),
        };

  const place = (i) => ({
    '--dx': `${DESKTOP[i].x}%`,
    '--dy': `${DESKTOP[i].y}%`,
    '--px': `${PHONE[i].x}%`,
    '--py': `${PHONE[i].y}%`,
  });

  const inner = (s, i) => (
    <>
      <span className="number">{s.number}</span>
      <Medallion icon={s.icon} back={s.back} backTight={s.backTight} turn={turns[i]} size={84} />
      <span className="label">{s.label}</span>
      <span className="sub">{CAPTIONS[i]}</span>
    </>
  );

  return (
    <section className="hs-journey-section" aria-label="Healing Soulutions care journey">
      <h1 className="intro">
        Never leave your home, office, or hotel.
      </h1>
      <p className="intro-sub">
        IV therapy, lab tests, and supplement protocols, brought to you.
      </p>
      <div className="cta-row">
        <Link href="/book" className="cta-primary">Book a Visit</Link>
        <a href="#pathway" className="cta-secondary">Explore the pathway</a>
      </div>

      <div className="stage" id="pathway" role="list" aria-label="Service categories">
        {[
          ['flow-d', '0 0 1000 240', DESKTOP_SEGS],
          ['flow-p', '0 0 390 740', PHONE_SEGS],
        ].map(([cls, vb, segs]) => (
          <svg className={`flow ${cls}`} viewBox={vb} preserveAspectRatio="none" aria-hidden="true" key={cls}>
            {segs.map((seg, i) => (
              <g key={i}>
                <path className="base" d={seg.line} />
              </g>
            ))}
          </svg>
        ))}

        {SERVICES.map((s, i) => (
          <div
            className={`slot${i === 0 && !touched ? ' cue' : ''}`}
            role="listitem"
            style={place(i)}
            data-i={i}
            key={s.slug}
          >
            <button
              type="button"
              className="step"
              aria-haspopup="dialog"
              aria-expanded={open === i}
              onClick={() => openStep(i)}
              {...hoverProps(i)}
            >
              {inner(s, i)}
            </button>
          </div>
        ))}
        <div className="slot" role="listitem" style={place(3)} data-i={3}>
          <Link href={BOOK_STEP.href} className="step book" aria-label="Book a visit" {...hoverProps(3)}>
            {inner(BOOK_STEP, 3)}
          </Link>
        </div>
      </div>

      <div className="band">
      <div className="badges" aria-label="Credentials">
        <span className="badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span><strong>HIPAA</strong><em>Compliant practice</em></span>
        </span>
        <span className="badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="m9 14.5-1.5 7 4.5-2.5 4.5 2.5-1.5-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9.6 9 1.6 1.6 3.2-3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span><strong>Board Certified</strong><em>Providers &amp; nurses</em></span>
        </span>
        <span className="badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
          <span><strong>Licensed nurses &amp; providers</strong><em>Manhattan &amp; the NY metro area</em></span>
        </span>
        {GOOGLE_REVIEWS.url && GOOGLE_REVIEWS.rating && GOOGLE_REVIEWS.count ? (
          <a className="badge reviews" href={GOOGLE_REVIEWS.url} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            <span><strong>{Number(GOOGLE_REVIEWS.rating).toFixed(1)} on Google</strong><em>{GOOGLE_REVIEWS.count} client reviews</em></span>
          </a>
        ) : null}
      </div>
      </div>

      {current && (
        <div className="backdrop" onClick={() => setOpen(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hs-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="close" aria-label="Close" onClick={() => setOpen(null)}>
              ×
            </button>
            <div className="modal-head">
              <Medallion icon={current.icon} size={56} />
              <div>
                <span className="eyebrow">{current.number}</span>
                <h3 id="hs-modal-title">{current.label}</h3>
              </div>
            </div>
            {current.quick ? (
              <>
                <p className="quick-line">{current.quick.line}</p>
                <ul className="quick">
                  {current.quick.items.map(([name, price, note]) => (
                    <li key={name}>
                      <span className="q-name">
                        {name}
                        {note && <small>{note}</small>}
                      </span>
                      <span className="q-price">{price}</span>
                    </li>
                  ))}
                </ul>
                {current.quick.note && <p className="quick-note">{current.quick.note}</p>}
              </>
            ) : (
              <p className="lede">{current.heroLede}</p>
            )}
            <div className="modal-actions">
              <Link href="/book" className="gold-btn">
                Book a visit
              </Link>
              <Link href={`/services/${current.slug}`} className="ghost-btn">
                Full details →
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hs-journey-section {
          --emerald: #fbfaf9;
          --emerald-deep: #251f21;
          --emerald-glow: #f4efec;
          --gold: #73a89a;
          --gold-light: #251f21;
          --ivory: #251f21;
          --sage: #73a89a;
          --serif: 'Aime', Georgia, serif;
          --round: 'KMR Melange Grotesk', system-ui, sans-serif;
          max-width: 1040px;
          margin: 0 auto;
          background: var(--emerald);
          color: var(--ivory);
          padding: 24px 42px 38px;
          font-family: var(--serif);
        }
        .hs-journey-section .intro {
          max-width: 15em;
          margin: 0 auto 16px;
          color: #251f21;
          text-align: center;
          font-family: var(--serif);
          font-weight: 300;
          font-size: clamp(25px, 4vw, 40px);
          line-height: 1.16;
          letter-spacing: -0.01em;
        }
        .hs-journey-section .intro-sub {
          max-width: 560px;
          margin: 0 auto 20px;
          color: rgba(37, 31, 33, 0.72);
          text-align: center;
          font: 350 16.5px/1.6 var(--round);
        }
        .hs-journey-section .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin: 26px auto 8px;
        }
        .hs-journey-section .cta-primary,
        .hs-journey-section .cta-secondary {
          display: inline-block;
          border-radius: 999px;
          padding: 14px 28px;
          font: 500 13.5px/1 var(--round);
          letter-spacing: 0.04em;
          text-decoration: none;
        }
        .hs-journey-section .cta-primary {
          background: #251f21;
          color: #ffffff;
        }
        .hs-journey-section .cta-primary:hover {
          background: #1a1517;
        }
        .hs-journey-section .cta-secondary {
          color: #251f21;
          border: 1px solid #c0bebf;
        }
        .hs-journey-section .cta-secondary:hover {
          background: rgba(37, 31, 33, 0.05);
        }
        .hs-journey-section .pathway {
          max-width: 620px;
          margin: 0 auto 10px;
          color: var(--gold);
          text-align: center;
          font: 500 12px/1.6 var(--round);
          letter-spacing: 0.06em;
        }

        /* ---- the flowing stage ---- */
        .hs-journey-section .stage {
          position: relative;
          max-width: 920px;
          height: 240px;
          margin: 48px auto auto;
        }
        .hs-journey-section .flow {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          fill: none;
          stroke-linecap: round;
        }
        .hs-journey-section .flow-p {
          display: none;
        }
        .hs-journey-section .flow path {
          vector-effect: non-scaling-stroke;
        }
        .hs-journey-section .flow .base {
          stroke: var(--sage);
          stroke-width: 1px;
          opacity: 0.4;
        }
        .hs-journey-section .slot {
          position: absolute;
          left: var(--dx);
          top: var(--dy);
          width: 220px;
          transform: translate(-50%, calc(-52px - 23px));
        }
        .hs-journey-section .step,
        .hs-journey-section a.step {
          appearance: none;
          border: 0;
          background: transparent;
          padding: 0;
          text-align: center;
          cursor: pointer;
          display: block;
          width: 100%;
          text-decoration: none;
          color: inherit;
          font: inherit;
        }
        .hs-journey-section .step:focus-visible {
          outline: none;
        }
        .hs-journey-section .step:focus-visible .label {
          text-decoration: underline;
          text-decoration-color: var(--gold);
          text-underline-offset: 4px;
        }
        .hs-journey-section .number {
          display: block;
          margin-bottom: 12px;
          color: rgba(150, 147, 148, 0.9);
          font: 500 11px/1 var(--round);
          letter-spacing: 0.18em;
        }
        .hs-journey-section .label {
          display: block;
          margin-top: 15px;
          color: var(--gold-light);
          font-size: 22px;
          font-weight: 500;
          font-family: var(--serif);
          line-height: 1.15;
        }
        .hs-journey-section .sub {
          display: block;
          margin-top: 5px;
          color: rgba(37, 31, 33, 0.62);
          font: 400 11px/1.4 var(--round);
          letter-spacing: 0.06em;
        }

        /* ---- trust line + tap cue ---- */
        .hs-journey-section .band {
          margin: 96px auto 0;
          padding-top: 44px;
          border-top: 1px solid rgba(115, 168, 154, 0.22);
          max-width: 920px;
        }
        .hs-journey-section .trust {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin: 0;
          color: var(--gold-light);
          font: 500 10.5px/1.6 var(--round);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hs-journey-section .trust i {
          color: var(--sage);
          font-style: normal;
        }
        .hs-journey-section .badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 16px;
          margin: 0 auto;
        }
        .hs-journey-section .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px 9px 12px;
          border: 1px solid rgba(115, 168, 154, 0.45);
          border-radius: 999px;
          color: var(--gold-light);
          background: #ffffff;
        }
        .hs-journey-section .badge.reviews {
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s;
        }
        .hs-journey-section .badge.reviews:hover,
        .hs-journey-section .badge.reviews:focus-visible {
          border-color: var(--gold);
          background: rgba(115, 168, 154, 0.08);
          outline: none;
        }
        .hs-journey-section .badge svg {
          width: 26px;
          height: 26px;
          flex: none;
        }
        .hs-journey-section .badge strong {
          display: block;
          font: 500 12px/1.2 var(--round);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .hs-journey-section .badge em {
          display: block;
          margin-top: 2px;
          color: rgba(37, 31, 33, 0.66);
          font: 400 10.5px/1.3 var(--round);
          font-style: normal;
          letter-spacing: 0.03em;
        }
        .hs-journey-section .slot.cue .wrap {
          border-radius: 50%;
          animation: hs-cue 2.2s ease-out infinite;
        }
        @keyframes hs-cue {
          0% { box-shadow: 0 0 0 0 rgba(115, 168, 154, 0.3); }
          70% { box-shadow: 0 0 0 10px rgba(115, 168, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(115, 168, 154, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-journey-section .slot.cue .wrap {
            animation: none;
            box-shadow: 0 0 0 3px rgba(115, 168, 154, 0.3);
          }
        }
        .hs-journey-section .price {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 10px;
          border: 1px solid rgba(115, 168, 154, 0.5);
          border-radius: 999px;
          color: var(--gold-light);
          font: 500 11px/1 var(--round);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* ---- team row ---- */
        .hs-journey-section .team {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 18px 44px;
          margin: 34px auto 0;
          max-width: 920px;
        }
        .hs-journey-section .person {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
        }
        .hs-journey-section .person img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--gold);
          box-shadow: 0 0 0 4px rgba(115, 168, 154, 0.15);
          flex: none;
        }
        .hs-journey-section .person strong {
          display: block;
          color: var(--gold-light);
          font: 500 18px/1.15 var(--serif);
        }
        .hs-journey-section .person em {
          display: block;
          margin-top: 3px;
          color: rgba(37, 31, 33, 0.65);
          font: 400 11px/1.4 var(--round);
          font-style: normal;
          letter-spacing: 0.04em;
        }
        .hs-journey-section .person:hover strong {
          text-decoration: underline;
          text-decoration-color: var(--gold);
          text-underline-offset: 4px;
        }

        /* ---- pop-up ---- */
        .hs-journey-section .backdrop {
          position: fixed;
          inset: 0;
          z-index: 99990;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(46, 39, 41, 0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .hs-journey-section .modal {
          position: relative;
          width: min(460px, 100%);
          max-height: calc(100vh - 40px);
          overflow: auto;
          padding: 34px 36px 30px;
          border: 1px solid #eae9ea;
          border-radius: 20px;
          background: #ffffff;
          color: var(--ivory);
          box-shadow: 0 30px 70px rgba(46, 39, 41, 0.28);
          font-family: var(--round);
        }
        .hs-journey-section .close {
          position: sticky;
          top: 0;
          float: right;
          margin: -14px -16px 0 0;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(115, 168, 154, 0.7);
          border-radius: 50%;
          background: #ffffff;
          color: var(--gold-light);
          font: 400 28px/1 var(--serif);
          cursor: pointer;
          z-index: 2;
        }
        .hs-journey-section .close:hover {
          background: #251f21;
          color: #ffffff;
        }
        .hs-journey-section .modal-head {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 14px;
        }
        .hs-journey-section .modal-head .wrap {
          margin: 0;
          flex: none;
        }
        .hs-journey-section .eyebrow {
          display: block;
          color: var(--gold);
          font: 500 10px/1 var(--round);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hs-journey-section .modal h3 {
          margin: 8px 0 0;
          color: var(--gold-light);
          font-size: 24px;
          font-weight: 500;
          font-family: var(--serif);
          line-height: 1.1;
        }
        .hs-journey-section .lede {
          margin: 0 0 6px;
          color: rgba(37, 31, 33, 0.88);
          font: 400 18px/1.5 var(--serif);
        }
        .hs-journey-section .modal-sub {
          margin: 0 0 16px;
          color: rgba(37, 31, 33, 0.65);
          font-size: 13px;
        }
        .hs-journey-section .included {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        .hs-journey-section .included li {
          padding: 12px 14px;
          border: 1px solid rgba(115, 168, 154, 0.28);
          border-radius: 12px;
          background: rgba(37, 31, 33, 0.03);
        }
        .hs-journey-section .included strong {
          display: block;
          margin-bottom: 4px;
          color: var(--gold-light);
          font: 500 17px/1.2 var(--serif);
        }
        .hs-journey-section .included li:has(.bullets) {
          grid-column: 1 / -1;
        }
        .hs-journey-section .bullets {
          list-style: disc;
          margin: 8px 0 4px;
          padding: 0 0 0 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 22px;
          row-gap: 5px;
          color: rgba(37, 31, 33, 0.8);
          font-size: 12px;
          line-height: 1.45;
        }
        .hs-journey-section .bullets li {
          padding: 0;
          border: 0;
          background: none;
          border-radius: 0;
          display: list-item;
        }
        .hs-journey-section .bullets li::marker {
          color: var(--gold);
        }
        .hs-journey-section .booked {
          display: block;
          margin-top: 6px;
          font: 400 11.5px/1.5 var(--round);
          color: rgba(37, 31, 33, 0.7);
        }
        .hs-journey-section .booked b {
          color: var(--gold);
          font-weight: 500;
        }
        .hs-journey-section .ptag {
          display: inline-block;
          margin-left: 8px;
          vertical-align: middle;
          font: 500 10px/1 var(--round);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
        }
        @media (max-width: 420px) {
          .hs-journey-section .bullets {
            grid-template-columns: 1fr;
          }
        }
        .hs-journey-section .included li:has(.brands) {
          grid-column: 1 / -1;
        }
        .hs-journey-section .brands {
          list-style: disc;
          margin: 8px 0 8px 0;
          padding: 0 0 0 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 22px;
          row-gap: 10px;
          color: rgba(37, 31, 33, 0.86);
          font-size: 12.5px;
          line-height: 1.45;
        }
        .hs-journey-section .brands li {
          padding: 0;
          border: 0;
          background: none;
          border-radius: 0;
          display: list-item;
        }
        .hs-journey-section .brands li::marker {
          color: var(--gold);
        }
        .hs-journey-section .brands b {
          display: block;
          color: var(--gold-light);
          font-weight: 600;
        }
        .hs-journey-section .brands i {
          display: block;
          margin-top: 1px;
          color: rgba(37, 31, 33, 0.7);
          font-style: normal;
          font-size: 11.5px;
          line-height: 1.45;
        }
        @media (max-width: 420px) {
          .hs-journey-section .brands {
            grid-template-columns: 1fr;
          }
        }
        .hs-journey-section .included span,
        .hs-journey-section .steps span {
          display: block;
          color: rgba(37, 31, 33, 0.74);
          font-size: 12.5px;
          line-height: 1.5;
        }
        .hs-journey-section .steps {
          margin: 22px 0 0;
          padding: 18px 0 0 0;
          border-top: 1px solid rgba(115, 168, 154, 0.3);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          counter-reset: step;
          list-style: none;
        }
        .hs-journey-section .steps li {
          counter-increment: step;
        }
        .hs-journey-section .steps li::before {
          content: counter(step);
          display: block;
          color: var(--gold);
          font: 400 26px/1 var(--serif);
          margin-bottom: 4px;
        }
        .hs-journey-section .steps strong {
          display: block;
          margin-bottom: 3px;
          color: var(--ivory);
          font: 500 16px/1.2 var(--serif);
        }
        .hs-journey-section .disclaimer {
          margin: 18px 0 0;
          color: rgba(37, 31, 33, 0.5);
          font-size: 11.5px;
        }
        .hs-journey-section .quick-line {
          margin: 4px 0 14px;
          font: 400 14.5px/1.5 var(--round);
          color: rgba(37, 31, 33, 0.85);
        }
        .hs-journey-section .quick {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid rgba(115, 168, 154, 0.28);
        }
        .hs-journey-section .quick li {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(115, 168, 154, 0.28);
        }
        .hs-journey-section .q-name {
          font: 500 17px/1.25 var(--serif);
          color: var(--gold-light);
        }
        .hs-journey-section .q-name small {
          display: block;
          font: 400 12px/1.4 var(--round);
          color: rgba(37, 31, 33, 0.65);
          margin-top: 2px;
        }
        .hs-journey-section .q-price {
          font: 500 16px/1.2 var(--serif);
          color: var(--gold);
          white-space: nowrap;
        }
        .hs-journey-section .quick-note {
          margin: 12px 0 0;
          font: 400 12.5px/1.5 var(--round);
          color: rgba(37, 31, 33, 0.65);
        }
        .hs-journey-section .modal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }
        .hs-journey-section .gold-btn,
        .hs-journey-section .ghost-btn {
          display: inline-block;
          border-radius: 999px;
          padding: 13px 22px;
          font: 400 12px/1 var(--round);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .hs-journey-section .gold-btn {
          background: #251f21;
          color: #ffffff;
        }
        .hs-journey-section .ghost-btn {
          color: var(--gold-light);
          border: 1px solid rgba(115, 168, 154, 0.5);
        }
        .hs-journey-section .ghost-btn:hover {
          background: rgba(115, 168, 154, 0.12);
        }

        @media (max-width: 680px) {
          .hs-journey-section {
            padding: 12px 16px 28px;
          }
          .hs-journey-section .stage {
            height: 740px;
          }
          .hs-journey-section .flow-d {
            display: none;
          }
          .hs-journey-section .flow-p {
            display: block;
          }
          .hs-journey-section .slot {
            left: var(--px);
            top: var(--py);
            width: 220px;
          }
          .hs-journey-section .band {
            margin-top: 56px;
          }
          .hs-journey-section .label {
            font-size: 20px;
          }
          .hs-journey-section .modal {
            padding: 26px 20px 22px;
          }
        }
      `}</style>
    </section>
  );
}
