import { useState } from 'react';
import {
  SIGNATURE,
  SIGNATURE_PRICE,
  LONGEVITY,
  BOOSTERS,
  BOOSTER_PRICE,
  UPGRADES,
  INJECTIONS,
  INJECTION_PRICE,
  INJECTION_PACK,
  INJECTION_NOTE,
  PATHWAY,
  CONCIERGE,
  MENU_DISCLAIMER,
  usd,
} from '../lib/menu';


const POPULAR = [
  'The Myers’ Soulution',
  'The Dehydration Soulution',
  'The Immunity Soulution',
  'The Hangover Soulution',
];
const FEATURED = POPULAR.map((n) => SIGNATURE.find((d) => d.name === n)).filter(Boolean);
const MORE_DRIPS = SIGNATURE.filter((d) => !POPULAR.includes(d.name));

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const DRIP_ICONS = {
  'The Myers’ Soulution': (
    <svg {...ICON_PROPS}>
      <path d="M12 4.5 13.9 10 19.5 12 13.9 14 12 19.5 10.1 14 4.5 12 10.1 10Z" />
      <path d="M18.5 3.5v3M17 5h3M5.5 17.5v3M4 19h3" />
    </svg>
  ),
  'The Dehydration Soulution': (
    <svg {...ICON_PROPS}>
      <path d="M12 3.5c3.2 3.9 5.5 7 5.5 9.9a5.5 5.5 0 1 1-11 0c0-2.9 2.3-6 5.5-9.9Z" />
      <path d="M9.5 13.5a2.6 2.6 0 0 0 2 2.5" />
    </svg>
  ),
  'The Immunity Soulution': (
    <svg {...ICON_PROPS}>
      <path d="M12 3l7 2.7v5.5c0 4.4-3 7.6-7 9.8-4-2.2-7-5.4-7-9.8V5.7Z" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  ),
  'The Hangover Soulution': (
    <svg {...ICON_PROPS}>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 5.5V8M5.2 8.7l1.5 1.5M18.8 8.7l-1.5 1.5" />
      <path d="M3 18h18M7.5 21h9" />
    </svg>
  ),
};

function DripRow({ d }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`dr${open ? ' open' : ''}`}>
      <button type="button" className="dr-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="dr-name">
          {d.name}
          {d.badge && <span className={`dr-badge${d.special ? ' warn' : ''}`}>{d.badge}</span>}
        </span>
        {d.price && <span className="dr-price">{usd(d.price)}</span>}
        <span className="dr-chev" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="dr-body">
          <p className="dr-tagline">{d.tagline}</p>
          <p className="dr-contents">{d.contents}</p>
          {d.for && (
            <p className="dr-for">
              <b>Commonly booked for:</b> {d.for}
            </p>
          )}
          {d.extra && <p className="dr-extra">{d.extra}</p>}
          {d.pair && (
            <p className="dr-pair">
              <b>Pairs well with:</b> {d.pair[0]} &middot; {d.pair[1]}
            </p>
          )}
          {d.special && <p className="dr-special">{d.special}</p>}
        </div>
      )}
      <style jsx>{`
        .dr {
          border-bottom: 1px solid rgba(115, 168, 154, 0.35);
        }
        .dr-head {
          display: flex;
          align-items: baseline;
          gap: 10px;
          width: 100%;
          padding: 13px 2px;
          background: none;
          border: 0;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .dr-name {
          flex: 1;
          font: 500 15px/1.4 var(--serif);
          color: #251f21;
        }
        .dr-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 3px 9px;
          border: 1px solid var(--gold);
          border-radius: 999px;
          font: 500 9.5px/1.2 var(--round);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-dark);
          vertical-align: middle;
        }
        .dr-badge.warn {
          background: #251f21;
          color: #ffffff;
          border-color: #251f21;
        }
        .dr-price {
          font: 500 15px/1 var(--serif);
          color: var(--gold-dark);
          white-space: nowrap;
        }
        .dr-chev {
          display: inline-flex;
          color: var(--gold-dark);
          transition: transform 0.2s ease;
        }
        .dr.open .dr-chev {
          transform: rotate(180deg);
        }
        .dr-body {
          padding: 2px 2px 14px;
        }
        .dr-tagline {
          margin: 0 0 6px;
          font: 400 14.5px/1.45 var(--serif);
          color: #251f21;
        }
        .dr-contents {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.55;
          color: #585254;
        }
        .dr-for,
        .dr-pair {
          margin: 6px 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: #585254;
        }
        .dr-for b,
        .dr-pair b {
          color: #251f21;
          font-weight: 500;
        }
        .dr-pair {
          color: #4f7f73;
        }
        .dr-extra {
          margin: 6px 0 0;
          font-size: 12px;
          color: #4f7f73;
        }
        .dr-special {
          margin: 8px 0 0;
          padding-top: 8px;
          border-top: 1px dashed rgba(115, 168, 154, 0.5);
          font-size: 12px;
          line-height: 1.5;
          color: #251f21;
        }
      `}</style>
    </div>
  );
}

// Web-native version of the printed Drip Menu. Rendered on /services/iv-injections.
export default function DripMenu() {
  return (
    <div className="dm">
      {/* ---- Pathway bundle ---- */}
      <h2 className="dm-h2">The Pathway to Wellness</h2>
      <div className="dm-pathway">
        <div className="dm-pathway-head">
          <span className="dm-pathway-price">{usd(PATHWAY.price)}</span>
          <span className="dm-pathway-compare">{usd(PATHWAY.compare)} booked separately</span>
        </div>
        <p className="dm-pathway-lede">{PATHWAY.lede}</p>
        <ul className="dm-pathway-list">
          {PATHWAY.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="dm-pathway-note">{PATHWAY.note}</p>
      </div>

      {/* ---- Signature ---- */}
      <h2 className="dm-h2">Signature Soulutions</h2>
      <div className="dm-banner">
        <span className="dm-banner-label">Signature Soulutions</span>
        <span className="dm-banner-price">{usd(SIGNATURE_PRICE)}</span>
        <span className="dm-banner-note">Dehydration (fluids only) {usd(279)} &middot; Antioxidant {usd(479)} &middot; High-Dose Vitamin C {usd(849)} &middot; travel included</span>
      </div>
      <p className="dm-fine">
        Each drip begins with your choice of 500 mL to 1,000 mL Lactated Ringer&rsquo;s (LR) or Normal Saline (NS);
        additional fluids +$150 per liter.
      </p>
<p className="dm-eyebrow dm-pop-label">Most booked</p>
      <div className="dm-grid">
        {FEATURED.map((d) => (
          <article className={`dm-card${d.special ? ' special' : ''}`} key={d.name}>
            <span className="dm-drip-icon" aria-hidden="true">{DRIP_ICONS[d.name]}</span>
            <h3>
              {d.name}
              {d.badge && <span className={`dm-badge${d.special ? ' warn' : ''}`}>{d.badge}</span>}
            </h3>
            {d.price && <span className="dm-card-price">{usd(d.price)}</span>}
            <p className="dm-tagline">{d.tagline}</p>
            <p className="dm-contents">{d.contents}</p>
            {d.for && (
              <p className="dm-for">
                <b>Commonly booked for:</b> {d.for}
              </p>
            )}
            {d.extra && <p className="dm-extra">{d.extra}</p>}
            {d.pair && (
              <p className="dm-pair">
                <b>Pairs well with:</b> {d.pair[0]} &middot; {d.pair[1]}
              </p>
            )}
            {d.special && <p className="dm-special">{d.special}</p>}
          </article>
        ))}
      </div>
      <p className="dm-eyebrow dm-more-label">More Soulutions &middot; tap to reveal</p>
      <div className="dm-rows">
        {MORE_DRIPS.map((d) => (
          <DripRow key={d.name} d={d} />
        ))}
      </div>
      <p className="dm-fine">Formulas may be adjusted by your clinician based on your evaluation.</p>

      {/* ---- Longevity ---- */}
      <h2 className="dm-h2">Longevity Soulutions</h2>
      <p className="dm-lede">{LONGEVITY.lede}</p>
      <div className="dm-long">
        {LONGEVITY.items.map((l) => (
          <article className={`dm-long-card${l.badge ? ' premium' : ''}`} key={l.name}>
            {l.badge && <span className="dm-badge gold">{l.badge}</span>}
            <h3>{l.name}</h3>
            <span className="dm-dose">{l.dose}</span>
            <span className="dm-price">{usd(l.price)}</span>
            <p>{l.copy}</p>
          </article>
        ))}
      </div>
      <p className="dm-fine">{LONGEVITY.includes}</p>
      <div className="dm-ladder" role="group" aria-label="NAD+ and Niagen dose pricing">
        <span className="dm-ladder-label">Choose your dose — NAD+ / Niagen</span>
        {LONGEVITY.ladder.map(([dose, a, b]) => (
          <span className="dm-ladder-cell" key={dose}>
            <b>{dose}</b>
            <i>
              {usd(a)} / {usd(b)}
            </i>
          </span>
        ))}
      </div>

      {/* ---- Boosters ---- */}
      <h2 className="dm-h2">Boost Your Drip</h2>
      <p className="dm-lede">
        Add any nutrient to any Soulution — <b>{usd(BOOSTER_PRICE)} each</b>. Glutathione {usd(BOOSTER_PRICE)} per 600 mg, up to 3,000 mg.
      </p>
      <div className="dm-boost">
        {BOOSTERS.map(([group, list]) => (
          <div key={group}>
            <span className="dm-eyebrow">{group}</span>
            <p>{list}</p>
          </div>
        ))}
      </div>
      <p className="dm-upgrades">
        <b>Premium upgrades:</b>{' '}
        {UPGRADES.map(([n, p], i) => (
          <span key={n}>
            {i > 0 && ' • '}
            {n} <em>{p}</em>
          </span>
        ))}
      </p>

      {/* ---- Injections ---- */}
      <h2 className="dm-h2">Intramuscular Injections</h2>
      <p className="dm-lede">
        Each intramuscular injection — <b>{usd(INJECTION_PRICE)}</b> unless noted.
      </p>
      <ul className="dm-inj">
        {INJECTIONS.map(([n, p]) => (
          <li key={n}>
            <span>{n}</span>
            <b>{usd(p)}</b>
          </li>
        ))}
        <li>
          <span>{INJECTION_PACK[0]}</span>
          <b>{usd(INJECTION_PACK[1])}</b>
        </li>
      </ul>
      <p className="dm-fine">{INJECTION_NOTE}</p>

      {/* ---- Concierge ---- */}
      <div className="dm-concierge">
        <span className="dm-eyebrow light">The Concierge Experience</span>
        <ul>
          {CONCIERGE.map(([k, v]) => (
            <li key={k}>
              <b>{k}</b> {v}
            </li>
          ))}
        </ul>
      </div>
      <p className="dm-disclaimer">{MENU_DISCLAIMER}</p>

      <style jsx>{`
        .dm {
          --gold: #73a89a;
          --gold-dark: #4f7f73;
          --emerald: #251f21;
          --ink: #251f21;
          --muted: #585254;
          --serif: 'Aime', Georgia, serif;
          --round: 'KMR Melange Grotesk', system-ui, sans-serif;
          font-family: var(--round);
          color: var(--ink);
        }
        .dm-h2 {
          margin: 44px 0 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(115, 168, 154, 0.45);
          font: 500 12.5px/1.2 var(--round);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--emerald);
        }
        .dm-h2:first-child {
          margin-top: 8px;
        }
        .dm-banner {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: center;
          gap: 8px 16px;
          padding: 14px 20px;
          margin: 14px 0 8px;
          border: 1px solid rgba(115, 168, 154, 0.5);
          border-radius: 12px;
          background: #fff;
        }
        .dm-banner-label {
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--emerald);
        }
        .dm-banner-price {
          font: 500 28px/1 var(--serif);
          color: var(--gold-dark);
        }
        .dm-banner-note {
          font: 400 14px/1 var(--serif);
          color: var(--muted);
        }
        .dm-pathway {
          margin: 14px 0 8px;
          padding: 20px 22px 16px;
          border: 1.5px solid var(--gold);
          border-radius: 14px;
          background: #ffffff;
        }
        .dm-pathway-head {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px 16px;
        }
        .dm-pathway-price {
          font: 500 34px/1 var(--serif);
          color: var(--gold-dark);
        }
        .dm-pathway-compare {
          font: 400 14px/1 var(--serif);
          color: var(--muted);
          text-decoration: line-through;
        }
        .dm-pathway-lede {
          margin: 8px 0 10px;
          font: 400 15px/1.5 var(--serif);
          color: var(--ink);
        }
        .dm-pathway-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 4px 24px;
          font-size: 13px;
          line-height: 1.55;
          color: var(--ink);
        }
        .dm-pathway-list li::before {
          content: '•';
          color: var(--gold);
          margin-right: 8px;
        }
        .dm-pathway-note {
          margin: 10px 0 0;
          font-size: 11.5px;
          color: var(--muted);
        }
        .dm-fine {
          margin: 0 0 16px;
          text-align: center;
          font: 400 14px/1.5 var(--serif);
          color: var(--muted);
        }
        .dm-lede {
          margin: 0 0 16px;
          font: 400 16px/1.5 var(--serif);
          color: var(--muted);
        }
        .dm-lede b {
          font-style: normal;
          color: var(--gold-dark);
          font-family: var(--round);
          font-size: 14px;
        }
        .dm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }
        .dm-card {
          background: #fff;
          border: 1px solid rgba(37, 31, 33, 0.1);
          border-radius: 14px;
          padding: 18px 18px 16px;
        }
        .dm-card.special {
          border-color: rgba(115, 168, 154, 0.6);
          background: #ffffff;
        }
        .dm-card h3 {
          margin: 0 0 4px;
          font: 500 20px/1.2 var(--serif);
          color: var(--emerald);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .dm-badge {
          display: inline-block;
          padding: 3px 9px;
          border: 1px solid var(--gold);
          border-radius: 999px;
          font: 500 9.5px/1.2 var(--round);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-dark);
        }
        .dm-badge.warn {
          background: #251f21;
          color: #ffffff;
          border-color: #251f21;
        }
        .dm-badge.gold {
          background: #251f21;
          color: #ffffff;
          border-color: #251f21;
          align-self: flex-start;
          margin-bottom: 8px;
        }
        .dm-card-price {
          display: inline-block;
          margin: 2px 0 6px;
          font: 500 20px/1 var(--serif);
          color: var(--gold-dark);
        }
        .dm-tagline {
          margin: 0 0 6px;
          font: 400 14.5px/1.45 var(--serif);
          color: var(--ink);
        }
        .dm-contents {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.55;
          color: var(--muted);
        }
        .dm-for {
          margin: 6px 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: var(--muted);
        }
        .dm-for b {
          color: var(--emerald);
          font-weight: 500;
        }
        .dm-extra {
          margin: 6px 0 0;
          font-size: 12px;
          color: var(--gold-dark);
        }
        .dm-pair {
          margin: 6px 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: var(--gold-dark);
        }
        .dm-pair b {
          color: var(--emerald);
          font-weight: 500;
        }
        .dm-special {
          margin: 8px 0 0;
          padding-top: 8px;
          border-top: 1px dashed rgba(115, 168, 154, 0.5);
          font-size: 12px;
          line-height: 1.5;
          color: var(--emerald);
        }
        .dm-long {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }
        .dm-long-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid rgba(37, 31, 33, 0.1);
          border-radius: 14px;
          padding: 20px 20px 18px;
        }
        .dm-long-card.premium {
          border: 1.5px solid var(--gold);
        }
        .dm-long-card h3 {
          margin: 0 0 2px;
          font: 500 24px/1.15 var(--serif);
          color: var(--emerald);
        }
        .dm-dose {
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .dm-price {
          display: block;
          margin: 10px 0 8px;
          font: 500 34px/1 var(--serif);
          color: var(--gold-dark);
        }
        .dm-long-card p {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
          color: var(--muted);
        }
        .dm-ladder {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px 22px;
          margin: 0 0 8px;
          padding: 12px 16px;
          border-top: 1px solid rgba(115, 168, 154, 0.3);
          border-bottom: 1px solid rgba(115, 168, 154, 0.3);
        }
        .dm-ladder-label {
          font-size: 12px;
          color: var(--emerald);
          font-weight: 600;
        }
        .dm-ladder-cell b {
          font-size: 12.5px;
          color: var(--ink);
          margin-right: 6px;
        }
        .dm-ladder-cell i {
          font-style: normal;
          font-size: 12.5px;
          color: var(--gold-dark);
        }
        .dm-boost {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px 28px;
        }
        .dm-eyebrow {
          display: block;
          margin-bottom: 4px;
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold-dark);
        }

        .dm-pop-label {
          margin: 20px 0 8px;
        }
        .dm-more-label {
          margin: 26px 0 8px;
        }
        .dm-drip-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin-bottom: 10px;
          border-radius: 50%;
          background: rgba(115, 168, 154, 0.14);
          color: #4f7f73;
        }
        .dm-rows {
          border-top: 1px solid rgba(115, 168, 154, 0.35);
        }
        .dm-card h3 {
          margin-top: 0;
        }
        .dm-eyebrow.light {
          color: #251f21;
          margin-bottom: 10px;
        }
        .dm-boost p {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
          color: var(--ink);
        }
        .dm-upgrades {
          margin: 16px 0 0;
          padding: 10px 14px;
          border-top: 1px solid rgba(115, 168, 154, 0.3);
          text-align: center;
          font-size: 12.5px;
          color: var(--ink);
        }
        .dm-upgrades b {
          color: var(--emerald);
        }
        .dm-upgrades em {
          font-style: normal;
          color: var(--gold-dark);
        }
        .dm-inj {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 0 32px;
        }
        .dm-inj li {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(37, 31, 33, 0.15);
          font-size: 13.5px;
        }
        .dm-inj b {
          color: var(--gold-dark);
          white-space: nowrap;
        }
        .dm-concierge {
          margin-top: 36px;
          padding: 22px 24px;
          border-radius: 14px;
          background: #f4efec;
          color: #251f21;
        }
        .dm-concierge ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 8px 24px;
          font-size: 13px;
          line-height: 1.5;
        }
        .dm-concierge b {
          color: #251f21;
          font-weight: 600;
        }
        .dm-disclaimer {
          margin: 18px 0 0;
          font-size: 11px;
          line-height: 1.55;
          color: #585254;
        }
        @media (max-width: 480px) {
          .dm-banner-price {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
