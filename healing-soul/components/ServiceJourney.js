import { useEffect, useState } from 'react';
import Link from 'next/link';
import Medallion from './Medallion';
import { SERVICES, BOOK_STEP } from '../lib/services';

// Homepage section: three service-category medallions + Book on a zig-zag path, with
// subtle 01→02→03→04 connectors between them. Clicking a medallion opens a pop-up with the
// category's details. Drop into pages/index.js:  <ServiceJourney />

// Medallion centres as % of the stage, desktop and phone. The SVG paths below pass
// through the same points (viewBox units = % × 10 desktop, % × 3.9 / × 9.2 phone).
// One calm row on desktop; a straight vertical column on phones.
const DESKTOP = [
  { x: 12, y: 50 },
  { x: 37.5, y: 50 },
  { x: 62.5, y: 50 },
  { x: 88, y: 50 },
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
const DESKTOP_SEGS = segments(DESKTOP, 920, 240, 1000, 240, [76, 76, 76, 76]);
const PHONE_SEGS = segments(PHONE, 358, 880, 390, 880, [100, 100, 100, 100], 80);

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
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Hover in: swivel half a turn and land on the back. Hover out: swivel on and land on the front.
  const swivel = (i) => {
    setTouched(true);
    setTurns((t) => t.map((v, k) => (k === i ? v + 1 : v)));
  };
  const hoverProps = (i) => ({
    onMouseEnter: () => swivel(i),
    onMouseLeave: () => swivel(i),
    onFocus: () => swivel(i),
    onBlur: () => swivel(i),
  });

  const place = (i) => ({
    '--dx': `${DESKTOP[i].x}%`,
    '--dy': `${DESKTOP[i].y}%`,
    '--px': `${PHONE[i].x}%`,
    '--py': `${PHONE[i].y}%`,
  });

  const inner = (s, i) => (
    <>
      <span className="number">{s.number}</span>
      <Medallion icon={s.icon} back={s.back} backTight={s.backTight} turn={turns[i]} />
      <span className="label">{s.label}</span>
      <span className="sub">{CAPTIONS[i]}</span>
    </>
  );

  return (
    <section className="hs-journey-section" aria-label="Healing Soulutions care journey">
      <p className="intro">
        Establish your baseline. Build your protocol. Replenish and optimize. Ongoing clinical oversight &amp;
        monitoring &mdash; by an experienced wellness nursing team, tailored to your own body&rsquo;s unique
        needs and goals, without ever leaving your home or office.
      </p>

      <div className="stage" role="list" aria-label="Service categories">
        {[
          ['flow-d', '0 0 1000 240', DESKTOP_SEGS],
          ['flow-p', '0 0 390 880', PHONE_SEGS],
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
            key={s.slug}
          >
            <button
              type="button"
              className="step"
              aria-haspopup="dialog"
              aria-expanded={open === i}
              onClick={() => {
                setTouched(true);
                setOpen(i);
              }}
              {...hoverProps(i)}
            >
              {inner(s, i)}
            </button>
          </div>
        ))}
        <div className="slot" role="listitem" style={place(3)}>
          <Link href={BOOK_STEP.href} className="step book" aria-label="Book a visit" {...hoverProps(3)}>
            {inner(BOOK_STEP, 3)}
          </Link>
        </div>
      </div>

      <div className="band">
      <p className="trust">
        <span>Licensed RNs &amp; NP</span>
        <i aria-hidden="true">·</i>
        <span>HIPAA compliant</span>
        <i aria-hidden="true">·</i>
        <span>Manhattan &amp; the New York metro area</span>
      </p>
      <div className="team">
        <Link href="/about" className="person">
          <img src="/kristina.jpg" alt="Kristina Castro, MSN, APRN, FNP-BC" />
          <span>
            <strong>Kristina Castro, MSN, APRN, FNP-BC</strong>
            <em>Nurse Practitioner · Leads every care plan</em>
          </span>
        </Link>
        <Link href="/about" className="person">
          <img src="/berit.jpg" alt="Berit Tran, BSN, RN" />
          <span>
            <strong>Berit Tran, BSN, RN</strong>
            <em>Registered Nurse</em>
          </span>
        </Link>
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
              <Medallion icon={current.icon} size={72} />
              <div>
                <span className="eyebrow">
                  {current.number} · {current.eyebrow}
                </span>
                <h3 id="hs-modal-title">{current.title}</h3>
                {current.priceFrom && <span className="price">From ${current.priceFrom}</span>}
              </div>
            </div>
            <p className="lede">{current.heroLede}</p>
            <p className="modal-sub">{current.includedLede}</p>
            <ul className="included">
              {current.included.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.copy}</span>
                  {item.brands && (
                    <ul className="brands">
                      {item.brands.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {item.after && <span>{item.after}</span>}
                </li>
              ))}
            </ul>
            <ol className="steps">
              {current.steps.map(([name, copy]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{copy}</span>
                </li>
              ))}
            </ol>
            {current.disclaimer && <p className="disclaimer">{current.disclaimer}</p>}
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
          --emerald: #013c1c;
          --emerald-deep: #012512;
          --emerald-glow: #02532a;
          --gold: #d4a24c;
          --gold-light: #ebcb8a;
          --ivory: #f7f1e5;
          --sage: #8ab5a3;
          --serif: 'Cormorant Garamond', Georgia, serif;
          --round: 'Varela Round', system-ui, sans-serif;
          max-width: 1040px;
          margin: 0 auto;
          background: var(--emerald);
          color: var(--ivory);
          padding: 24px 42px 38px;
          font-family: var(--serif);
        }
        .hs-journey-section .intro {
          max-width: 620px;
          margin: 0 auto 64px;
          color: rgba(247, 241, 229, 0.82);
          text-align: center;
          font-size: 19px;
          line-height: 1.55;
          font-style: italic;
        }

        /* ---- the flowing stage ---- */
        .hs-journey-section .stage {
          position: relative;
          max-width: 920px;
          height: 240px;
          margin: auto;
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
          color: rgba(235, 203, 138, 0.7);
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
          color: rgba(247, 241, 229, 0.62);
          font: 400 11px/1.4 var(--round);
          letter-spacing: 0.06em;
        }

        /* ---- trust line + tap cue ---- */
        .hs-journey-section .band {
          margin: 96px auto 0;
          padding-top: 44px;
          border-top: 1px solid rgba(212, 162, 76, 0.22);
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
        .hs-journey-section .slot.cue .wrap {
          border-radius: 50%;
          animation: hs-cue 2.2s ease-out infinite;
        }
        @keyframes hs-cue {
          0% { box-shadow: 0 0 0 0 rgba(212, 162, 76, 0.55); }
          70% { box-shadow: 0 0 0 18px rgba(212, 162, 76, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 162, 76, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-journey-section .slot.cue .wrap {
            animation: none;
            box-shadow: 0 0 0 4px rgba(212, 162, 76, 0.45);
          }
        }
        .hs-journey-section .price {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 10px;
          border: 1px solid rgba(212, 162, 76, 0.5);
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
          box-shadow: 0 0 0 4px rgba(212, 162, 76, 0.15);
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
          color: rgba(247, 241, 229, 0.65);
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
          background: rgba(1, 20, 10, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .hs-journey-section .modal {
          position: relative;
          width: min(720px, 100%);
          max-height: calc(100vh - 40px);
          overflow: auto;
          padding: 34px 36px 30px;
          border: 1px solid rgba(212, 162, 76, 0.5);
          border-radius: 20px;
          background: var(--emerald);
          color: var(--ivory);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
          font-family: var(--round);
        }
        .hs-journey-section .close {
          position: sticky;
          top: 0;
          float: right;
          margin: -14px -16px 0 0;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(212, 162, 76, 0.7);
          border-radius: 50%;
          background: var(--emerald);
          color: var(--gold-light);
          font: 400 28px/1 var(--serif);
          cursor: pointer;
          z-index: 2;
        }
        .hs-journey-section .close:hover {
          background: var(--gold);
          color: var(--emerald-deep);
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
          font-size: 30px;
          font-weight: 500;
          font-family: var(--serif);
          line-height: 1.1;
        }
        .hs-journey-section .lede {
          margin: 0 0 6px;
          color: rgba(247, 241, 229, 0.88);
          font: italic 400 18px/1.5 var(--serif);
        }
        .hs-journey-section .modal-sub {
          margin: 0 0 16px;
          color: rgba(247, 241, 229, 0.65);
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
          border: 1px solid rgba(212, 162, 76, 0.28);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
        }
        .hs-journey-section .included strong {
          display: block;
          margin-bottom: 4px;
          color: var(--gold-light);
          font: 600 17px/1.2 var(--serif);
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
          column-gap: 18px;
          row-gap: 4px;
          color: rgba(247, 241, 229, 0.86);
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
        @media (max-width: 420px) {
          .hs-journey-section .brands {
            grid-template-columns: 1fr;
          }
        }
        .hs-journey-section .included span,
        .hs-journey-section .steps span {
          display: block;
          color: rgba(247, 241, 229, 0.74);
          font-size: 12.5px;
          line-height: 1.5;
        }
        .hs-journey-section .steps {
          margin: 22px 0 0;
          padding: 18px 0 0 0;
          border-top: 1px solid rgba(212, 162, 76, 0.3);
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
          font: 600 16px/1.2 var(--serif);
        }
        .hs-journey-section .disclaimer {
          margin: 18px 0 0;
          color: rgba(247, 241, 229, 0.5);
          font-size: 11.5px;
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
          background: var(--gold);
          color: var(--emerald-deep);
        }
        .hs-journey-section .ghost-btn {
          color: var(--gold-light);
          border: 1px solid rgba(212, 162, 76, 0.5);
        }
        .hs-journey-section .ghost-btn:hover {
          background: rgba(212, 162, 76, 0.12);
        }

        @media (max-width: 680px) {
          .hs-journey-section {
            padding: 12px 16px 28px;
          }
          .hs-journey-section .stage {
            height: 880px;
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
