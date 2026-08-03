import { useState, useEffect, useRef, useCallback } from 'react';

const GOLD = '#DBAA64';

// Site-wide ambient sound + gold on/off control. Mounted once in _app so it
// stays alive across page navigation. Self-contained WebAudio engine (no external
// file, nothing copyrighted) — a warm drone with soft, sparse chimes.
export default function AmbientPlayer() {
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(true); // default on (audio still waits for the first gesture, per browser rules)
  const engineRef = useRef(null);
  const startedRef = useRef(false); // has audio actually begun (needs a user gesture)
  const onRef = useRef(true);

  const buildEngine = useCallback(() => {
    if (engineRef.current) return engineRef.current;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    let ac;
    try { ac = new AC(); } catch (e) { return null; }

    const master = ac.createGain();
    master.gain.value = 0.0001;
    const warm = ac.createBiquadFilter();
    warm.type = 'lowpass'; warm.frequency.value = 2600;
    master.connect(warm); warm.connect(ac.destination);

    // gentle reverb tail
    const delay = ac.createDelay(1.6); delay.delayTime.value = 0.5;
    const fb = ac.createGain(); fb.gain.value = 0.32;
    const damp = ac.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 1300;
    delay.connect(damp); damp.connect(fb); fb.connect(delay); delay.connect(master);

    // warm drone chord (D minor add9), each voice with a slow tremolo
    const pad = ac.createGain(); pad.gain.value = 0.6; pad.connect(master);
    [146.83, 174.61, 220, 261.63].forEach((f, i) => {
      const o = ac.createOscillator(); o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = f; o.detune.value = (i - 1.5) * 3;
      const g = ac.createGain(); g.gain.value = 0.09 - i * 0.012;
      const lfo = ac.createOscillator(); lfo.frequency.value = 0.04 + i * 0.017;
      const lg = ac.createGain(); lg.gain.value = 0.028;
      lfo.connect(lg); lg.connect(g.gain);
      o.connect(g); g.connect(pad);
      o.start(); lfo.start();
    });

    // soft, sparse chimes (pentatonic)
    const scale = [587.33, 698.46, 880, 1046.5, 1318.51];
    let chimeT = null, chiming = false;
    const chime = () => {
      const t = ac.currentTime;
      const f = scale[Math.floor(Math.random() * scale.length)];
      const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.07, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
      const send = ac.createGain(); send.gain.value = 0.5;
      o.connect(g); g.connect(master); g.connect(send); send.connect(delay);
      o.start(t); o.stop(t + 3.6);
    };
    const scheduleChimes = () => {
      const tick = () => { chime(); chimeT = setTimeout(tick, 4000 + Math.random() * 5000); };
      chimeT = setTimeout(tick, 1600);
    };

    engineRef.current = {
      ac, master,
      start() {
        const go = () => {
          const now = ac.currentTime;
          master.gain.cancelScheduledValues(now);
          master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
          master.gain.linearRampToValueAtTime(0.4, now + 3);
          if (!chiming) { chiming = true; scheduleChimes(); }
        };
        // Resume first (needs a gesture); ramp once the context is actually running.
        if (ac.state === 'suspended') { ac.resume().then(go).catch(go); } else { go(); }
      },
      stop() {
        const now = ac.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(0.0001, now + 1);
        if (chimeT) { clearTimeout(chimeT); chimeT = null; chiming = false; }
      },
    };
    return engineRef.current;
  }, []);

  const enable = useCallback(() => {
    const e = buildEngine();
    if (!e) return;
    e.start();
    startedRef.current = true;
    onRef.current = true;
    setOn(true);
    try { sessionStorage.setItem('hs_ambient', '1'); } catch (_) {}
  }, [buildEngine]);

  const disable = useCallback(() => {
    if (engineRef.current) engineRef.current.stop();
    onRef.current = false;
    setOn(false);
    try { sessionStorage.setItem('hs_ambient', '0'); } catch (_) {}
  }, []);

  // Restore preference (default on) and, if on, start audio on the first gesture
  // that isn't the button itself (the button handles its own clicks).
  useEffect(() => {
    setReady(true);
    let pref = true;
    try { const v = sessionStorage.getItem('hs_ambient'); if (v !== null) pref = v === '1'; } catch (e) {}
    onRef.current = pref;
    setOn(pref);
    if (!pref) return;

    const kick = (ev) => {
      if (ev.target && ev.target.closest && ev.target.closest('[data-hs-audio]')) return; // button handles itself
      if (!startedRef.current && onRef.current) enable();
      if (startedRef.current) remove();
    };
    const remove = () => ['pointerdown', 'keydown', 'touchstart'].forEach((e) => window.removeEventListener(e, kick));
    ['pointerdown', 'keydown', 'touchstart'].forEach((e) => window.addEventListener(e, kick, { passive: true }));
    return remove;
  }, [enable]);

  const onButton = useCallback(() => {
    // First press starts the audio; after that it's a normal on/off toggle.
    if (!startedRef.current) { enable(); return; }
    onRef.current ? disable() : enable();
  }, [enable, disable]);

  if (!ready) return null;

  return (
    <button
      data-hs-audio=""
      onClick={onButton}
      aria-label={on ? 'Turn ambient sound off' : 'Turn ambient sound on'}
      aria-pressed={on}
      title={on ? 'Ambient sound: on' : 'Ambient sound: off'}
      style={{
        position: 'fixed', right: '18px', bottom: '18px', zIndex: 99990,
        width: 46, height: 46, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        background: 'rgba(1,60,28,0.72)',
        border: `1.5px solid rgba(219,170,100,${on ? 0.9 : 0.5})`,
        boxShadow: `0 0 0 1px rgba(219,170,100,0.18), 0 6px 18px rgba(0,0,0,0.3)${on ? ', 0 0 16px rgba(219,170,100,0.4)' : ''}`,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        color: GOLD, transition: 'all 0.3s',
      }}
    >
      {on ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill={GOLD} stroke="none" />
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19.5 6a8 8 0 0 1 0 12" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill={GOLD} stroke="none" />
          <line x1="16" y1="9" x2="21" y2="14" />
          <line x1="21" y1="9" x2="16" y2="14" />
        </svg>
      )}
    </button>
  );
}
