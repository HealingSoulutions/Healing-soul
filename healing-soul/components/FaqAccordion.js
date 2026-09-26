import { useState } from 'react';

// Shared tap-to-reveal FAQ item: question row + chevron, expands to show the answer.
// Used by the about, book, and contact FAQ lists.
export default function FaqAccordion({ q, a, size = 21 }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`fqa-head${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="fqa-q">{q}</span>
        <span className="fqa-chev" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && <p className="fqa-a">{a}</p>}
      <style jsx>{`
        .fqa-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          width: 100%;
          padding: 0;
          background: none;
          border: 0;
          cursor: pointer;
          text-align: left;
          font: inherit;
        }
        .fqa-q {
          flex: 1;
          color: #251f21;
          font: 500 ${size}px/1.25 var(--serif, 'Aime', Georgia, serif);
        }
        .fqa-chev {
          display: inline-flex;
          align-self: center;
          color: #3f6f64;
          transition: transform 0.2s ease;
        }
        .fqa-head.open .fqa-chev {
          transform: rotate(180deg);
        }
        .fqa-a {
          margin: 6px 0 0;
          color: rgba(37, 31, 33, 0.78);
          font: 400 13px/1.7 var(--round, 'KMR Melange Grotesk', system-ui, sans-serif);
        }
      `}</style>
    </>
  );
}
