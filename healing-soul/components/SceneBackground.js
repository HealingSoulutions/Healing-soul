export default function SceneBackground() {
  return (
    <div className="hero-scene" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {/* Pagoda silhouettes */}
      <div className="hue-pagoda hue-pagoda-1">
        <svg width="100" height="150" viewBox="0 0 140 200" fill="none">
          <path d="M70 0L65 12H75L70 0Z" fill="rgba(16,66,44,0.82)" />
          <rect x="68" y="12" width="4" height="6" fill="rgba(16,66,44,0.82)" />
          <path d="M50 18L42 30H98L90 18H50Z" fill="rgba(16,66,44,0.82)" />
          <rect x="46" y="33" width="48" height="5" fill="rgba(16,66,44,0.82)" />
          <path d="M44 38L36 50H104L96 38H44Z" fill="rgba(16,66,44,0.82)" />
          <rect x="40" y="53" width="60" height="5" fill="rgba(16,66,44,0.82)" />
          <path d="M38 58L28 72H112L102 58H38Z" fill="rgba(16,66,44,0.82)" />
          <rect x="34" y="75" width="72" height="5" fill="rgba(16,66,44,0.82)" />
          <path d="M32 80L22 94H118L108 80H32Z" fill="rgba(16,66,44,0.82)" />
          <rect x="28" y="97" width="84" height="5" fill="rgba(16,66,44,0.82)" />
          <path d="M26 102L14 118H126L114 102H26Z" fill="rgba(16,66,44,0.82)" />
          <rect x="30" y="121" width="80" height="79" fill="rgba(16,66,44,0.82)" />
          <path d="M58 155H82V200H58V155Z" fill="rgba(1,60,28,0.7)" />
        </svg>
      </div>
      <div className="hue-pagoda hue-pagoda-2">
        <svg width="70" height="110" viewBox="0 0 140 200" fill="none">
          <path d="M70 0L65 12H75L70 0Z" fill="rgba(16,66,44,0.82)" />
          <rect x="68" y="12" width="4" height="6" fill="rgba(16,66,44,0.82)" />
          <path d="M50 18L42 30H98L90 18H50Z" fill="rgba(16,66,44,0.82)" />
          <rect x="46" y="33" width="48" height="5" fill="rgba(16,66,44,0.82)" />
          <path d="M44 38L36 50H104L96 38H44Z" fill="rgba(16,66,44,0.82)" />
          <rect x="40" y="53" width="60" height="5" fill="rgba(16,66,44,0.82)" />
          <rect x="30" y="58" width="80" height="142" fill="rgba(16,66,44,0.82)" />
          <path d="M55 100H85V200H55V100Z" fill="rgba(1,60,28,0.7)" />
        </svg>
      </div>
      {/* Bridge */}
      <div className="hue-bridge">
        <svg width="300" height="80" viewBox="0 0 300 80" fill="none">
          <path d="M0 60 Q30 20 60 40 Q90 10 120 35 Q150 5 180 35 Q210 10 240 40 Q270 20 300 60" stroke="rgba(16,66,44,0.82)" strokeWidth="3" fill="none" />
          <path d="M0 60 Q30 20 60 40 Q90 10 120 35 Q150 5 180 35 Q210 10 240 40 Q270 20 300 60 V80 H0Z" fill="rgba(1,60,28,0.3)" />
          {[30, 60, 90, 120, 150, 180, 210, 240, 270].map((x) => (
            <line key={x} x1={x} y1="25" x2={x} y2="80" stroke="rgba(1,60,28,0.5)" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
      {/* Water effects */}
      <div className="water-reflection" />
      <div className="water-shimmer" />
      <div className="water-mist" />
      {/* LOTUS FLOWERS REMOVED */}
      {/* Mist */}
      <div className="mist-layer">
        <div className="mist-cloud mc-1" />
        <div className="mist-cloud mc-2" />
        <div className="mist-cloud mc-3" />
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAV
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

