import { Fragment, useState } from 'react';
import Link from 'next/link';
import Seo from './Seo';
import Medallion from './Medallion';
import DripMenu from './DripMenu';
import { SERVICES } from '../lib/services';

function CollapsibleCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card wide collapsible${open ? ' open' : ''}`}>
      <button
        type="button"
        className="collapsible-head"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h3>{item.name}</h3>
        {!open && <span className="reveal-hint">Tap to reveal +</span>}
      </button>
      {open && (
        <>
          <button
            type="button"
            className="collapsible-close"
            aria-label={`Close ${item.name}`}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <div className="collapsible-body">
            <p>{item.copy}</p>
            {item.brands && (
              <ul className="brands">
                {item.brands.map(([name, note]) => (
                  <li key={name}>
                    <b>{name}</b>
                    <i>{note}</i>
                  </li>
                ))}
              </ul>
            )}
            {item.after && <p>{item.after}</p>}
            <span className="tag">{item.tag}</span>
          </div>
        </>
      )}
      <style jsx>{`
        .card {
          background: #fff;
          border: 1px solid rgba(37, 31, 33, 0.1);
          border-radius: 16px;
        }
        .wide {
          grid-column: 1 / -1;
        }
        .collapsible {
          position: relative;
          padding: 0;
        }
        .collapsible-head {
          display: flex;
          width: 100%;
          align-items: baseline;
          justify-content: space-between;
          gap: 14px;
          padding: 22px 20px;
          background: none;
          border: 0;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .collapsible-head h3 {
          font-family: var(--serif);
          font-size: 21px;
          font-weight: 500;
          color: #251f21;
          margin: 0;
        }
        .collapsible.open .collapsible-head {
          padding: 22px 56px 6px 20px;
        }
        .reveal-hint {
          flex-shrink: 0;
          font: 500 10.5px/1 var(--round, sans-serif);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #73a89a;
        }
        .collapsible-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid rgba(37, 31, 33, 0.16);
          background: #fff;
          color: #585254;
          font-size: 17px;
          line-height: 1;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .collapsible-close:hover {
          background: #4f7f73;
          border-color: #4f7f73;
          color: #fff;
        }
        .collapsible-body {
          padding: 0 20px 22px;
        }
        .collapsible-body p {
          margin: 0;
          font-size: 13.5px;
          color: #585254;
          line-height: 1.55;
        }
        .brands {
          list-style: disc;
          margin: 10px 0;
          padding: 0 0 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 28px;
          row-gap: 12px;
          font-size: 13.5px;
          color: #251f21;
          line-height: 1.5;
        }
        .brands li::marker {
          color: var(--gold-dark);
        }
        .brands b {
          display: block;
          color: var(--emerald);
          font-weight: 600;
        }
        .brands i {
          display: block;
          margin-top: 1px;
          color: #585254;
          font-style: normal;
          font-size: 12.5px;
          line-height: 1.5;
        }
        @media (max-width: 420px) {
          .brands {
            grid-template-columns: 1fr;
          }
        }
        .tag {
          display: inline-block;
          margin-top: 12px;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-dark);
        }
      `}</style>
    </div>
  );
}

// Shared template for /services/<slug>. Pass one entry from lib/services SERVICES.
// Nav, Footer and the floating BookCta are rendered globally by pages/_app.js.
export default function ServiceCategoryPage({ service }) {
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Seo title={service.seo.title} description={service.seo.description} />
      <div className="cat">
        <div className="cat-hero">
          <Link href="/" className="cat-close" aria-label="Back to home">
            ×
          </Link>
          <Medallion icon={service.icon} size={128} />
          <div className="kicker">
            Service {service.number} · {service.label}
          </div>
          <h1 className="sr-only">{service.label} in Manhattan — Healing Soulutions</h1>
          <p>{service.heroLede}</p>
        </div>

        <section className="body">
          <h2>{service.menu ? 'The Drip Menu' : "What's included"}</h2>
          <p className="lede">{service.includedLede}</p>
          {service.menu && <DripMenu />}
          <div className="grid" hidden={!!service.menu}>
            {service.included.map((item) => (
              <Fragment key={item.name}>
                {item.collapsible ? (
                  <CollapsibleCard item={item} />
                ) : (
                  <article className={`card${item.brands ? ' wide' : ''}`}>
                    <h3>{item.name}</h3>
                    {item.price && <span className="price">{item.price}</span>}
                    <p>{item.copy}</p>
                    {item.booked && (
                      <p className="booked">
                        <b>Commonly booked for:</b> {item.booked}
                      </p>
                    )}
                    {item.brands && (
                      <ul className="brands">
                        {item.brands.map(([name, note]) => (
                          <li key={name}>
                            <b>{name}</b>
                            <i>{note}</i>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.after && <p>{item.after}</p>}
                    <span className="tag">{item.tag}</span>
                  </article>
                )}
                {item.divider && (
                  <div className="section-divider" aria-hidden="true">
                    <hr />
                    <span>{item.divider}</span>
                    <hr />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          <div className="steps">
            {service.steps.map(([name, copy], i) => (
              <div key={name}>
                <div className="n">{i + 1}</div>
                <h3>{name}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>

          {service.disclaimer && <p className="disclaimer">{service.disclaimer}</p>}

          <div className="cta">
            <div>
              <h3>Ready to begin?</h3>
              <p>Pick a time that fits your day. Serving Manhattan and the New York metro area.</p>
            </div>
            <Link href="/book" className="gold">
              Book a visit
            </Link>
          </div>

          <nav className="others" aria-label="Other services">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="ghost">
                {s.number} · {s.label} →
              </Link>
            ))}
          </nav>
        </section>
      </div>

      <style jsx>{`
        .cat {
          --emerald: #251f21;
          --emerald-deep: #251f21;
          --emerald-glow: #f4efec;
          --gold: #73a89a;
          --gold-light: #251f21;
          --gold-dark: #4f7f73;
          --ivory: #fbfaf9;
          --serif: 'Aime', Georgia, serif;
          --round: 'KMR Melange Grotesk', system-ui, sans-serif;
          background: var(--ivory);
          color: var(--emerald);
          font-family: var(--round);
        }
        .cat :global(.cat-close) {
          position: absolute;
          top: 118px;
          right: 22px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(115, 168, 154, 0.6);
          border-radius: 50%;
          color: var(--gold-light);
          background: rgba(255, 255, 255, 0.85);
          font: 400 28px/1 var(--serif);
          text-decoration: none;
          z-index: 5;
        }
        .cat :global(.cat-close:hover) {
          background: #251f21;
          color: #ffffff;
        }
        .cat-hero {
          position: relative;
          display: block;
          background: transparent;
          color: #251f21;
          padding: 128px 42px 56px;
          text-align: center;
        }
        .kicker {
          margin-top: 26px;
          color: var(--gold);
          letter-spacing: 0.19em;
          font: 500 11px/1.4 var(--round);
          text-transform: uppercase;
        }
        .cat-hero h1 {
          font-family: var(--serif);
          color: var(--gold-light);
          font-size: clamp(34px, 5vw, 52px);
          font-weight: 500;
          margin: 10px 0 12px;
        }
        .cat-hero p {
          max-width: 600px;
          margin: 14px auto 0;
          color: rgba(37, 31, 33, 0.8);
          font-family: var(--serif);
          font-style: normal;
          font-size: 19px;
        }
        .body {
          max-width: 1040px;
          margin: auto;
          padding: 48px 42px 64px;
        }
        .body h2 {
          font: 500 12.5px/1.2 var(--round);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--emerald);
          margin: 0 0 10px;
        }
        .lede {
          color: #585254;
          margin: 0 0 26px;
          max-width: 640px;
        }
        .grid[hidden] {
          display: none;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .card {
          background: #fff;
          border: 1px solid rgba(37, 31, 33, 0.1);
          border-radius: 16px;
          padding: 22px 20px;
        }
        .card h3 {
          font-family: var(--serif);
          font-size: 21px;
          font-weight: 500;
          margin: 0 0 6px;
        }
        .card p {
          margin: 0;
          font-size: 13.5px;
          color: #585254;
          line-height: 1.55;
        }
        .card.wide {
          grid-column: 1 / -1;
        }
        .brands {
          list-style: disc;
          margin: 10px 0;
          padding: 0 0 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 28px;
          row-gap: 12px;
          font-size: 13.5px;
          color: #251f21;
          line-height: 1.5;
        }
        .brands li::marker {
          color: var(--gold-dark);
        }
        .brands b {
          display: block;
          color: var(--emerald);
          font-weight: 600;
        }
        .brands i {
          display: block;
          margin-top: 1px;
          color: #585254;
          font-style: normal;
          font-size: 12.5px;
          line-height: 1.5;
        }
        @media (max-width: 420px) {
          .brands {
            grid-template-columns: 1fr;
          }
        }
        .section-divider {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 30px 0 4px;
        }
        .section-divider hr {
          flex: 1;
          border: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(115, 169, 154, 0), rgba(115, 169, 154, 0.65), rgba(115, 169, 154, 0));
        }
        .section-divider span {
          font: 350 13px/1 var(--serif);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #4f7f73;
          white-space: nowrap;
        }
        .booked {
          margin: 8px 0 0;
          font-size: 12.5px;
          line-height: 1.55;
          color: var(--muted, #585254);
        }
        .booked b {
          color: var(--emerald, #fbfaf9);
          font-weight: 500;
        }
        .price {
          display: block;
          margin: 2px 0 8px;
          font: 500 18px/1.2 var(--serif, 'Aime', Georgia, serif);
          color: var(--gold-dark);
        }
        .tag {
          display: inline-block;
          margin-top: 12px;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-dark);
        }
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 18px;
          margin-top: 44px;
          padding-top: 34px;
          border-top: 1px solid rgba(115, 168, 154, 0.4);
        }
        .n {
          font-family: var(--serif);
          font-size: 34px;
          color: var(--gold);
          line-height: 1;
        }
        .steps h3 {
          font-family: var(--serif);
          font-size: 20px;
          font-weight: 500;
          margin: 8px 0 4px;
        }
        .steps p {
          margin: 0;
          font-size: 13.5px;
          color: #585254;
          line-height: 1.55;
        }
        .disclaimer {
          margin: 28px 0 0;
          font-size: 12px;
          color: #585254;
          max-width: 640px;
        }
        .cta {
          margin-top: 44px;
          background: #f4efec;
          color: #251f21;
          border-radius: 18px;
          padding: 30px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .cta h3 {
          margin: 0;
          font-family: var(--serif);
          font-size: 26px;
          font-weight: 500;
          color: var(--gold-light);
        }
        .cta p {
          margin: 4px 0 0;
          font-size: 13.5px;
          color: rgba(37, 31, 33, 0.75);
        }
        .cat :global(.gold) {
          background: #251f21;
          color: #ffffff;
          border-radius: 999px;
          padding: 14px 26px;
          font: 400 12px/1 var(--round);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
        }
        .others {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .cat :global(.ghost) {
          color: var(--emerald);
          border: 1px solid rgba(37, 31, 33, 0.2);
          border-radius: 999px;
          padding: 12px 20px;
          font: 400 12px/1 var(--round);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .cat :global(.ghost:hover) {
          background: rgba(37, 31, 33, 0.05);
        }
        @media (max-width: 680px) {
          .cat-hero,
          .body {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </>
  );
}
