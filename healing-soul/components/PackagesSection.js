// MOCK for Berit's review - packages & membership pricing (not yet approved for production).
// Placement: IV & Injections page, between the drip menu/concierge card and the booking CTA.
export default function PackagesSection() {
  const cards = [
    {
      name: 'The Trio',
      price: '$897',
      per: 'one-time',
      copy: 'Three Signature Soulutions, booked whenever you like — $299 a visit.',
      meta: 'Save $150 · use within 6 months',
    },
    {
      name: 'Monthly Soulution',
      price: '$289',
      per: 'per month',
      copy: 'One Signature Soulution every month, plus one add-on on us.',
      meta: 'Save $60+ monthly · priority booking · rush fee waived',
      featured: true,
    },
    {
      name: 'Twice Monthly',
      price: '$549',
      per: 'per month',
      copy: 'Two Signature Soulutions every month, same perks.',
      meta: 'Save $149+ monthly',
    },
  ];
  return (
    <section className="pk" aria-label="Packages and memberships">
      <span className="kicker">Packages &amp; Membership</span>
      <h2>Wellness, on a rhythm.</h2>
      <p className="lede">Multi-visit pricing for regulars — every visit still concierge, travel included.</p>
      <div className="grid">
        {cards.map((c) => (
          <article key={c.name} className={`card${c.featured ? ' featured' : ''}`}>
            {c.featured && <span className="badge">Most popular</span>}
            <h3>{c.name}</h3>
            <div className="price">
              {c.price} <span>{c.per}</span>
            </div>
            <p>{c.copy}</p>
            <span className="meta">{c.meta}</span>
          </article>
        ))}
      </div>
      <p className="fine">
        Longevity and NAD+ drips upgradeable for the difference. Memberships pause or cancel anytime
        after the first month. Every visit follows the same good-faith evaluation.
      </p>
      <p className="how">
        To start a package or membership, text us at (585) 747-2215 or ask at your next visit.
      </p>
      <style jsx>{`
        .pk {
          --gold: #73a89a;
          --gold-dark: #4f7f73;
          --serif: 'Aime', Georgia, serif;
          --round: 'KMR Melange Grotesk', system-ui, sans-serif;
          margin: 56px auto 0;
          max-width: 920px;
          text-align: center;
        }
        .kicker {
          display: block;
          font: 600 11px/1 var(--round);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold-dark);
          margin-bottom: 10px;
        }
        h2 {
          font: 400 30px/1.2 var(--serif);
          color: #251f21;
          margin: 0 0 10px;
        }
        .lede {
          font: 400 14px/1.6 var(--round);
          color: rgba(37, 31, 33, 0.75);
          margin: 0 auto 28px;
          max-width: 520px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          text-align: left;
        }
        @media (min-width: 900px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .card {
          position: relative;
          background: #ffffff;
          border: 1.5px solid rgba(115, 168, 154, 0.45);
          border-radius: 14px;
          padding: 22px 20px 18px;
        }
        .card.featured {
          border-color: var(--gold);
          box-shadow: 0 10px 30px rgba(79, 127, 115, 0.16);
        }
        .badge {
          position: absolute;
          top: -10px;
          left: 20px;
          background: #013c1c;
          color: #fff;
          font: 600 9.5px/1 var(--round);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 999px;
        }
        .card h3 {
          font: 400 20px/1.2 var(--serif);
          color: #251f21;
          margin: 0 0 6px;
        }
        .price {
          font: 400 30px/1 var(--serif);
          color: var(--gold-dark);
          margin-bottom: 10px;
        }
        .price span {
          font: 400 12px/1 var(--round);
          color: rgba(37, 31, 33, 0.55);
          letter-spacing: 0.04em;
        }
        .card p {
          font: 400 13.5px/1.55 var(--round);
          color: rgba(37, 31, 33, 0.85);
          margin: 0 0 12px;
        }
        .meta {
          display: block;
          font: 600 10px/1.5 var(--round);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold-dark);
        }
        .fine {
          font: 400 11px/1.6 var(--round);
          color: rgba(37, 31, 33, 0.5);
          margin: 18px auto 0;
          max-width: 640px;
        }
        .how {
          font: 500 12.5px/1.6 var(--round);
          color: rgba(37, 31, 33, 0.8);
          margin: 10px auto 0;
        }
      `}</style>
    </section>
  );
}
