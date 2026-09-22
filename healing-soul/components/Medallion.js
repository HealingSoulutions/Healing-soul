import { ICONS } from './MedallionIcons';

// Gold medallion with optional flip face. `active` flips it to the back.
// `turn` counts half-turns: even = front showing, odd = back showing. Each change swivels
// on in the same direction.
export default function Medallion({ icon, back, backTight, active = false, turn = 0, size = 104 }) {
  const Icon = ICONS[icon];
  return (
    <span className="wrap" style={{ width: size, height: size }}>
      <span
        className={`medallion${active ? ' is-active' : ''}`}
        style={turn ? { transform: `rotateY(${turn * 180}deg)` } : undefined}
      >
        <span className="face front">
          <Icon style={icon === 'swan' ? { width: size * 0.36, height: size * 0.56 } : { width: size * 0.46, height: size * 0.46 }} />
        </span>
        {back && (
          <span className="face back">
            <span className={backTight ? 'tight' : ''}>
              {back[0]}
              <br />
              {back[1]}
            </span>
          </span>
        )}
      </span>
      <style jsx>{`
        .wrap {
          display: block;
          margin: auto;
          perspective: 800px;
        }
        .medallion {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.85s cubic-bezier(0.2, 0.75, 0.25, 1);
        }
        .medallion.is-active {
          transform: rotateY(180deg);
        }
        .face {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          backface-visibility: hidden;
          border: 1px solid #e3be7a;
          color: #5a3f12;
          background-color: #d4a24c;
          background-image: radial-gradient(circle at 48% 44%, rgba(255, 236, 196, 0.14) 0%, rgba(255, 236, 196, 0) 58%),
            linear-gradient(118deg, #a87b2e 0%, #c9983f 18%, #e6c078 39%, #d4a24c 57%, #b3842f 78%, #d0a24f 100%);
          box-shadow: inset 0 1px 1px rgba(255, 236, 196, 0.3), inset 0 -2px 3px rgba(96, 64, 16, 0.2),
            inset 0 0 0 5px rgba(110, 78, 24, 0.09), 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .face:before {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: linear-gradient(
            102deg,
            transparent 18%,
            rgba(255, 240, 205, 0.08) 44%,
            rgba(255, 240, 205, 0.14) 50%,
            rgba(255, 240, 205, 0.04) 59%,
            transparent 78%
          );
        }
        .face:after {
          content: '';
          position: absolute;
          inset: 11px;
          border-radius: 50%;
          border: 1px solid rgba(96, 64, 16, 0.3);
          box-shadow: 0 1px 0 rgba(255, 232, 190, 0.18);
        }
        .front :global(svg) {
          position: relative;
        }
        .back {
          transform: rotateY(180deg);
        }
        .back span {
          position: relative;
          font: 400 13px/1.25 'Varela Round', system-ui, sans-serif;
          letter-spacing: 0.16em;
          color: #4a3410;
        }
        .back span.tight {
          font-size: 10.5px;
          letter-spacing: 0.09em;
        }
        @media (prefers-reduced-motion: reduce) {
          .medallion {
            transition: none;
          }
        }
      `}</style>
    </span>
  );
}
