// Renders a plain-text consent document (blank-line separated paragraphs).
// A paragraph that starts with "LABEL:" gets the label in bold.
export default function ConsentDoc({ text, boxed = false }) {
  const paras = text.trim().split(/\n\s*\n/);
  const body = paras.map((p, i) => {
    const m = p.match(/^([A-Z][A-Z0-9 &\/,'()\-]{2,}[A-Z)]):\s+([\s\S]*)$/);
    return (
      <p key={i} style={{ fontFamily: "'KMR Melange Grotesk', sans-serif", fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(37,31,33,0.8)', margin: '0 0 0.8rem' }}>
        {m ? <><strong>{m[1]}:</strong> {m[2]}</> : p}
      </p>
    );
  });
  if (!boxed) return <div>{body}</div>;
  return (
    <div tabIndex={0} role="region" style={{ maxHeight: 360, overflowY: 'auto', border: '1px solid #c9a227', borderRadius: 8, padding: '14px 16px', background: '#fff', marginBottom: '1.4rem' }}>
      {body}
    </div>
  );
}
