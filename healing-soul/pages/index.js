import Head from "next/head";

const TITLE = "Healing Soulutions — Concierge & Mobile Nursing | New York Metro";
const DESCRIPTION =
  "Concierge nursing in your home. A skilled nursing team that knows you, comes to you, and follows through. Serving Manhattan and the New York metro area.";

const schema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Healing Soulutions",
  alternateName: "Healing Soulutions Concierge Nursing",
  description:
    "Concierge and mobile nursing care across the New York metropolitan area — IV therapy, in-home and post-operative nursing, at-home lab draws, telehealth, and medically guided wellness by licensed RNs and Nurse Practitioners.",
  url: "https://healingsoulutions.care",
  telephone: "+1-585-747-2215",
  email: "info@healingsoulutions.care",
  image: "https://healingsoulutions.care/og-image.png",
  logo: "https://healingsoulutions.care/emblem.png",
  medicalSpecialty: "Nursing",
  areaServed: { "@type": "Place", name: "New York Metropolitan Area" },
  priceRange: "$$",
  knowsAbout: [
    "IV therapy",
    "Mobile nursing",
    "Post-operative care",
    "Telehealth",
    "At-home lab draws",
  ],
};

const principles = [
  {
    title: "Care that knows you",
    body:
      "Individualized supplement protocols, tailored to your lifestyle, your needs, and your lab work — and adjusted as your results change.",
  },
  {
    title: "Care that comes to you",
    body:
      "Infusions, injections, labs, and nursing delivered in your home, on your schedule.",
  },
  {
    title: "Care that follows through",
    body:
      "One consistent team and one point of contact, visit after visit — so nothing about you gets lost between them.",
  },
  {
    title: "Care that includes you",
    body:
      "We listen, guide, and advocate — and every decision about your care is made with you, not for you.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://healingsoulutions.care" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content="https://healingsoulutions.care" />
        <meta property="og:image" content="https://healingsoulutions.care/og-home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content="https://healingsoulutions.care/og-home.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main id="main-content" className="home">
        <section className="hero">
          <img
            className="wordmark"
            src="/wordmark-v2.png"
            alt="Healing Soulutions — Concierge Nursing"
            width={900}
            height={378}
          />
          <div className="divider" aria-hidden="true" />

          <p className="mission lead">
            We are building healthcare where a skilled nursing team knows you,
            comes to you, and follows through.
          </p>
          <p className="mission">
            Medicine has become rushed, fragmented, and impersonal. Healing
            Soulutions exists to be the opposite: personal, consistent, and at
            your side.
          </p>

          <div className="principles">
            {principles.map((p) => (
              <div className="principle" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>

          <p className="goal">
            Our goal: that you feel your best and live fully present — for
            yourself, your family, your friends, and your work.
          </p>
          <p className="sig">— The Healing Soulutions experience</p>
          <p className="motto">Healing. Experience. Compassion.</p>

          <div className="book">
            <p className="trust">
              Licensed RNs &amp; NPs <span>·</span> HIPAA compliant{" "}
              <span>·</span> Fully insured
            </p>
            <a className="btn-jade" href="/book">
              <span className="star" aria-hidden="true">
                ☆
              </span>
              Book a Visit
            </a>
            <p className="area">SERVING MANHATTAN &amp; THE NEW YORK METRO AREA</p>
            <div className="contact">
              <a href="mailto:info@healingsoulutions.care">
                info@healingsoulutions.care
              </a>
              <a href="tel:+15857472215">(585) 747-2215</a>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background: #083c22
            radial-gradient(
              120% 90% at 50% 42%,
              #0b4629 0%,
              #083c22 45%,
              #02180d 100%
            );
          color: var(--jade-whisper, #d4e8df);
          font-family: "Varela Round", sans-serif;
          font-weight: 400;
          line-height: 1.72;
          padding: 64px 20px 72px;
        }
        .hero {
          max-width: 520px;
          margin: 0 auto;
          text-align: center;
          display: grid;
          justify-items: center;
        }
        .wordmark {
          display: block;
          width: min(437px, 99%);
          height: auto;
          margin: 0 auto 1rem;
        }
        .divider {
          width: 48px;
          height: 1.5px;
          background: var(--gold-soft, #dbaa64);
          opacity: 0.9;
          margin: 0.4rem auto 1.4rem;
        }
        .mission {
          margin: 0;
          max-width: 470px;
          font-size: 0.92rem;
          line-height: 1.72;
          color: #d9ac63;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
        .mission + .mission {
          margin-top: 0.9rem;
        }
        .mission.lead {
          font-size: 1.05rem;
          color: var(--jade-whisper, #d4e8df);
        }
        .principles {
          width: 100%;
          max-width: 470px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 24px;
          margin: 1.6rem 0 0;
          padding-top: 1.4rem;
          border-top: 1px solid rgba(219, 170, 102, 0.25);
          text-align: left;
        }
        .principle h3 {
          margin: 0 0 3px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #d9ac63;
        }
        .principle p {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--jade-whisper, #d4e8df);
        }
        .goal {
          margin: 1.6rem 0 0;
          max-width: 470px;
          font-size: 0.92rem;
          line-height: 1.72;
          color: #d9ac63;
          font-style: italic;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
        .sig {
          margin: 0.6rem 0 0;
          font-size: 0.88rem;
          letter-spacing: 0.02em;
          color: var(--jade-mist, #a8ccbc);
        }
        .motto {
          margin: 0.2rem 0 0;
          font-size: 0.72rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--gold-soft, #dbaa64);
        }
        .book {
          margin-top: 2.2rem;
          display: grid;
          justify-items: center;
          gap: 14px;
        }
        .trust {
          margin: 0 0 4px;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-soft, #dbaa64);
        }
        .trust span {
          color: var(--jade-mist, #a8ccbc);
          padding: 0 6px;
        }
        .btn-jade {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #02240f;
          color: var(--gold-soft, #dbaa64);
          border: 1px solid rgba(219, 170, 102, 0.35);
          border-radius: 6px;
          padding: 12px 28px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .btn-jade:hover {
          border-color: var(--gold-soft, #dbaa64);
          background: #032e14;
        }
        .star {
          color: #d9ac63;
          font-size: 0.9rem;
        }
        .area {
          margin: 0;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: var(--jade-mist, #a8ccbc);
        }
        .contact {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          justify-content: center;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
        }
        .contact a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
        }
        .contact a:hover {
          color: var(--gold-soft, #dbaa64);
        }
        @media (max-width: 460px) {
          .principles {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .btn-jade {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
