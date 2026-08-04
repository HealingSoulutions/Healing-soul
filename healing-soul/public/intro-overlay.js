/* Healing Soulutions — drop-in intro overlay.
   Usage on your existing homepage, just before </body>:
     <script>window.HS_INTRO = { duration: 12, sound: true, once: true, audioSrc: '/ambient.mp3' };</script>
     <script src="/intro-overlay.js" defer></script>
   It paints over whatever page it is on, plays, then fades away to reveal it. */
(function () {
  if (window.__hsIntroLoaded) return;
  window.__hsIntroLoaded = true;
  var CFG = window.HS_INTRO || {};
  var ONCE = CFG.once !== false;
  if (ONCE) { try { if (sessionStorage.getItem('hs-intro-seen')) return; sessionStorage.setItem('hs-intro-seen', '1'); } catch (e) {} }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && CFG.respectReducedMotion !== false) return;

  if (!document.querySelector('link[data-hs-font]')) {
    var fl = document.createElement('link');
    fl.rel = 'stylesheet'; fl.setAttribute('data-hs-font', '');
    fl.href = 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap';
    document.head.appendChild(fl);
  }

  var WM = CFG.wordmark || 'https://healingsoulutions.care/wordmark.png';
  var host = document.createElement('div');
  host.setAttribute('data-hs-intro-host', '');
  host.innerHTML = [
    '<div data-hs="overlay" style="position:fixed;inset:0;z-index:2147483000;background:#02180D">',
    '<canvas data-hs="grass" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>',
    '<div data-hs="introtext" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;pointer-events:none">',
    '<img src="' + WM + '" alt="Healing Soulutions" style="width:min(360px,54vw);height:auto;display:block" />',
    '<div data-hs="breath" style="font-family:Jost,Helvetica,sans-serif;font-size:11px;letter-spacing:.42em;text-transform:uppercase;color:#F3E9CE;transition:opacity 350ms ease">Healing</div>',
    '</div>',
    '<button data-hs="skip" style="position:absolute;right:26px;bottom:26px;z-index:2;padding:9px 18px;border:1px solid rgba(245,242,234,.3);border-radius:999px;background:transparent;color:rgba(245,242,234,.7);font-family:Jost,Helvetica,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer">Skip</button>',
    '</div>',
    '<button data-hs="sound" aria-label="Toggle ambient sound" style="position:fixed;left:26px;bottom:26px;z-index:2147483001;display:flex;align-items:center;gap:10px;padding:9px 18px;border:1px solid rgba(245,242,234,.28);border-radius:999px;background:rgba(2,24,13,.32);backdrop-filter:blur(6px);color:rgba(245,242,234,.72);font-family:Jost,Helvetica,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:opacity 600ms ease,color 300ms ease,border-color 300ms ease,background 600ms ease">',
    '<span data-hs="sounddot" style="width:6px;height:6px;border-radius:50%;background:#C9A96A;display:block"></span>',
    '<span data-hs="soundlabel">Sound on</span>',
    '</button>'
  ].join('');

  function mount() {
    document.body.appendChild(host);

    class DCLogic {
      constructor(props) { this.props = props || {}; this.state = {}; }
      setState(u) { Object.assign(this.state, typeof u === 'function' ? u(this.state) : u); }
      forceUpdate() {}
    }

    class Component extends DCLogic {
      el(key) {
        this.cache = this.cache || {};
        if (this.cache[key] && this.cache[key].isConnected) return this.cache[key];
        const sel = '[data-hs="' + key + '"]';
        const walk = (root) => {
          const hit = root.querySelector ? root.querySelector(sel) : null;
          if (hit) return hit;
          const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
          for (const e of all) if (e.shadowRoot) { const r = walk(e.shadowRoot); if (r) return r; }
          return null;
        };
        const n = walk(document);
        if (n) this.cache[key] = n;
        return n;
      }

      componentDidMount() {
        this.dur = (this.props.introDuration ?? 12) * 1000;
        this.rain = this.props.rainIntensity ?? 1;
        this.t0 = performance.now();
        this.done = false;
        this.blades = null;
        this.ripples = [];
        this.lotus = null;
        this.pondRipples = [];
        this.prevScroll = document.body.style.overflow;
        if (this.props.showIntro === false) { this.finish(true); } else { document.body.style.overflow = 'hidden'; window.scrollTo(0, 0); }
        this.onResize = () => { this.blades = null; this.strips = null; this.lotus = null; this.strip = null; };
        window.addEventListener('resize', this.onResize);
        this.onSkip = () => this.finish(false);
        this.soundOn = this.props.sound !== false;
        this.onSound = () => { this.soundOn ? this.audioStop() : this.audioStart(); };
        this.onGesture = () => {
          if (!this.soundOn) return;
          if (this.ac && this.ac.state === 'suspended') this.ac.resume();
          if (this.tag && this.tag.paused) this.tag.play().catch(() => {});
        };
        ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(e => window.addEventListener(e, this.onGesture, { passive: true }));
        setTimeout(() => {
          const s = this.el('skip'); if (s) s.addEventListener('click', this.onSkip);
          const b = this.el('sound'); if (b) b.addEventListener('click', this.onSound);
          if (this.soundOn) this.audioStart();
        }, 0);
        this.failsafe = setTimeout(() => this.finish(false), this.dur + 800);
        this.loop = this.loop.bind(this);
        this.raf = requestAnimationFrame(this.loop);
      }

      componentWillUnmount() {
        cancelAnimationFrame(this.raf);
        clearTimeout(this.failsafe);
        window.removeEventListener('resize', this.onResize);
        ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(e => window.removeEventListener(e, this.onGesture));
        const s = this.el('skip'); if (s) s.removeEventListener('click', this.onSkip);
        const b = this.el('sound'); if (b) b.removeEventListener('click', this.onSound);
        this.audioStop(true);
        document.body.style.overflow = this.prevScroll || '';
      }

      audioLabel() {
        const l = this.el('soundlabel'); if (l) l.textContent = this.soundOn ? 'Sound on' : 'Sound off';
        const d = this.el('sounddot');
        if (d) { d.style.background = this.soundOn ? '#C9A96A' : 'transparent'; d.style.boxShadow = this.soundOn ? '0 0 10px rgba(201,169,106,.9)' : 'none'; d.style.border = this.soundOn ? 'none' : '1px solid rgba(245,242,234,.4)'; }
      }

      audioStart() {
        this.soundOn = true;
        this.audioLabel();
        const url = this.props.audioSrc;
        if (url) {
          if (!this.tag) {
            this.tag = new Audio(url);
            this.tag.loop = true; this.tag.volume = 0;
          }
          const target = this.props.soundVolume ?? 0.55;
          this.tag.play().catch(() => {});
          clearInterval(this.fadeI);
          this.fadeI = setInterval(() => {
            if (!this.tag) return clearInterval(this.fadeI);
            this.tag.volume = Math.min(target, this.tag.volume + target / 60);
            if (this.tag.volume >= target - 0.001) clearInterval(this.fadeI);
          }, 100);
          return;
        }
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!this.ac) {
          try { this.ac = new AC(); } catch (e) { return; }
          this.buildAudio();
        }
        if (this.ac.state === 'suspended') this.ac.resume();
        const now = this.ac.currentTime;
        const vol = (this.props.soundVolume ?? 0.55);
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
        this.master.gain.linearRampToValueAtTime(vol, now + 6);
      }

      audioStop(hard) {
        this.soundOn = false;
        this.audioLabel();
        if (this.tag) {
          clearInterval(this.fadeI);
          const tag = this.tag;
          this.fadeI = setInterval(() => {
            tag.volume = Math.max(0, tag.volume - (hard ? 0.2 : 0.03));
            if (tag.volume <= 0.001) { clearInterval(this.fadeI); tag.pause(); }
          }, 80);
          if (hard) this.tag = null;
          return;
        }
        if (!this.ac) return;
        const now = this.ac.currentTime;
        if (this.master) {
          this.master.gain.cancelScheduledValues(now);
          this.master.gain.setValueAtTime(this.master.gain.value, now);
          this.master.gain.linearRampToValueAtTime(0.0001, now + (hard ? 0.15 : 1.6));
        }
        if (hard) { clearTimeout(this.chime); clearTimeout(this.bloomT); clearInterval(this.seq); const ac = this.ac; setTimeout(() => { try { ac.close(); } catch (e) {} }, 250); this.ac = null; }
      }

      buildAudio() {
        const ac = this.ac;
        const master = ac.createGain();
        master.gain.value = 0.0001;
        const soft = ac.createBiquadFilter();
        soft.type = 'lowpass'; soft.frequency.value = 5200;
        master.connect(soft); soft.connect(ac.destination);
        this.master = master;

        // slow reverb-ish tail
        const delay = ac.createDelay(1.2); delay.delayTime.value = 0.42;
        const fb = ac.createGain(); fb.gain.value = 0.52;
        const damp = ac.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 1600;
        delay.connect(damp); damp.connect(fb); fb.connect(delay); delay.connect(master);
        this.verb = delay;

        // rain + water: filtered noise, breathing bands
        const len = ac.sampleRate * 4;
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const d = buf.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + w * 0.0990460;
          b1 = 0.96300 * b1 + w * 0.2965164;
          b2 = 0.57000 * b2 + w * 1.0526913;
          d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16;
        }
        const mk = (type, freq, q, gain, lfoRate, lfoAmt) => {
          const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
          const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
          const g = ac.createGain(); g.gain.value = gain;
          const lfo = ac.createOscillator(); lfo.frequency.value = lfoRate;
          const lg = ac.createGain(); lg.gain.value = lfoAmt;
          lfo.connect(lg); lg.connect(g.gain);
          src.connect(f); f.connect(g); g.connect(master);
          src.start(); lfo.start();
        };
        mk('lowpass', 700, 0.0001, 0.022, 0.019, 0.008); // soft water only

        // glassy mallet voice, D-minor pentatonic (Sade-smooth, mermaid-bright)
        const scale = [587.33, 698.46, 783.99, 880, 1046.5, 1174.66, 1396.91];
        this.mallet = (f, t, vel) => {
          const out = ac.createGain(); out.gain.value = 1;
          const tone = ac.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 3400; tone.Q.value = 0.4;
          out.connect(tone); tone.connect(master);
          const send = ac.createGain(); send.gain.value = 0.5; tone.connect(send); send.connect(delay);
          // bell-glass partials, long singing decay
          [[1, 1, 5.2], [2.0, 0.3, 3.2], [3.01, 0.1, 1.6]].forEach(([mult, amp, dec]) => {
            const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f * mult;
            o.detune.value = (Math.random() - 0.5) * 5;
            const g = ac.createGain();
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(amp * vel, t + 0.05);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
            o.connect(g); g.connect(out);
            o.start(t); o.stop(t + dec + 0.05);
          });
          // breath of air on the attack
          const n = ac.createBufferSource(); n.buffer = buf; n.loop = true;
          const nf = ac.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = f * 1.6; nf.Q.value = 2.2;
          const ng = ac.createGain();
          ng.gain.setValueAtTime(0.0001, t);
          ng.gain.linearRampToValueAtTime(0.12 * vel, t + 0.05);
          ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
          n.connect(nf); nf.connect(ng); ng.connect(out);
          n.start(t); n.stop(t + 0.6);
        };
        const S = (i) => scale[Math.max(0, Math.min(scale.length - 1, i))];

        // wordless mermaid voice — formant "ooh", portamento between notes
        this.voice = (f, t, dur, from) => {
          const o = ac.createOscillator(); o.type = 'sawtooth';
          if (from) { o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.18); }
          else o.frequency.setValueAtTime(f, t);
          const vib = ac.createOscillator(); vib.frequency.value = 4.6;
          const vg = ac.createGain(); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * 0.011, t + dur * 0.5);
          vib.connect(vg); vg.connect(o.frequency);
          const g = ac.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.055, t + dur * 0.35);
          g.gain.linearRampToValueAtTime(0.0001, t + dur);
          let node = o;
          [[420, 9, 1], [820, 11, 0.5], [2600, 13, 0.14]].forEach(([ff, q, amp]) => {
            const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = ff; bp.Q.value = q;
            const fg = ac.createGain(); fg.gain.value = amp;
            o.connect(bp); bp.connect(fg); fg.connect(g);
          });
          const soft = ac.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 2400;
          g.connect(soft); soft.connect(master);
          const send = ac.createGain(); send.gain.value = 0.6; soft.connect(send); send.connect(delay);
          o.start(t); vib.start(t); o.stop(t + dur + 0.2); vib.stop(t + dur + 0.2);
        };

        // ── original smooth-soul instrumental: D minor, 62 bpm, 4-bar loop ──
        const bass = (f, t, dur, glideFrom) => {
          const o = ac.createOscillator(); o.type = 'sine';
          if (glideFrom) { o.frequency.setValueAtTime(glideFrom, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.13); }
          else o.frequency.setValueAtTime(f, t);
          const o2 = ac.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f; o2.detune.value = 6;
          const g2 = ac.createGain(); g2.gain.value = 0.16;
          const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 1.1;
          const g = ac.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.085, t + 0.5);
          g.gain.setTargetAtTime(0.0001, t + dur * 0.62, dur * 0.22);
          o.connect(g); o2.connect(g2); g2.connect(g); g.connect(lp); lp.connect(master);
          o.start(t); o2.start(t); o.stop(t + dur + 0.4); o2.stop(t + dur + 0.4);
        };
        const rhodes = (freqs, t, dur, vel) => {
          freqs.forEach((f, i) => {
            const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = (i % 2 ? 4 : -4);
            const bell = ac.createOscillator(); bell.type = 'sine'; bell.frequency.value = f * 4.02;
            const bg = ac.createGain(); bg.gain.setValueAtTime(0.05 * vel, t); bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
            const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500;
            const g = ac.createGain();
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime((0.042 - i * 0.005) * vel, t + 0.65);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            o.connect(g); bell.connect(bg); bg.connect(g); g.connect(lp); lp.connect(master);
            const send = ac.createGain(); send.gain.value = 0.35; g.connect(send); send.connect(delay);
            o.start(t); bell.start(t); o.stop(t + dur + 0.1); bell.stop(t + 0.6);
          });
        };
        const brush = (t, vel) => {
          const n = ac.createBufferSource(); n.buffer = buf; n.loop = true;
          const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5200;
          const g = ac.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.018 * vel, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
          n.connect(f); f.connect(g); g.connect(master);
          n.start(t); n.stop(t + 0.35);
        };

        const spb = 60 / 56, bar = spb * 4;
        const prog = [
          { root: 73.42, prev: 55, ch: [174.61, 220, 261.63, 329.63] },   // Dm9
          { root: 58.27, prev: 73.42, ch: [146.83, 174.61, 220, 261.63] },// Bbmaj7
          { root: 49.00, prev: 58.27, ch: [116.54, 146.83, 174.61, 220] },// Gm9
          { root: 55.00, prev: 49.00, ch: [130.81, 196, 220, 293.66] }    // A7sus
        ];
        const mel = [
          [[0.5, 4], [1.6, 3], [2.6, 2]],
          [[0.9, 1], [2.2, 2], [3.1, 0]],
          [],
          [[1.0, 3], [2.0, 4], [3.0, 5], [3.7, 4]],
          [[0.5, 5], [1.5, 4], [2.7, 2]],
          [[1.2, 1], [2.4, 0]],
          [],
          [[0.8, 2], [1.8, 3], [2.8, 1], [3.6, 0]]
        ];
        let barIdx = 0, nextBar = ac.currentTime + 0.6;
        // still-water arrangement: no drums, no walking bass — a held root, harp arpeggios, sparse mallet
        const scheduleBar = (i, t) => {
          const c = prog[i % 4];
          bass(c.root, t, bar * 0.95, c.prev);
          rhodes(c.ch, t + spb * 0.15, bar * 0.9, 0.85);
          // harp: chord tones rolled slowly upward, one bar per sweep
          c.ch.forEach((f, k) => this.mallet(f * 2, t + (0.35 + k * 0.62) * spb, 0.028 - k * 0.003));
          const phrase = mel[i % mel.length];
          phrase.forEach(([beat, step], k) => {
            if (k % 2) return;
            this.mallet(S(step), t + beat * spb, 0.05);
          });
          if (i % 4 === 0 && phrase.length) {
            const [beat, step] = phrase[0];
            this.voice(S(step) / 2, t + beat * spb, bar * 0.7, null);
          }
        };
        this.seq = setInterval(() => {
          if (!this.ac) return;
          while (nextBar < ac.currentTime + 1.8) { scheduleBar(barIdx++, nextBar); nextBar += bar; }
        }, 220);
      }

      finish(instant) {
        if (this.done) return;
        this.done = true;
        clearTimeout(this.failsafe);
        document.body.style.overflow = this.prevScroll || '';
        const o = this.el('overlay');
        if (o) {
          if (instant) { o.style.display = 'none'; }
          else {
            o.style.transition = 'opacity 2000ms cubic-bezier(.4,0,.2,1)';
            o.style.opacity = '0';
            setTimeout(() => { if (o) o.style.display = 'none'; }, 2100);
          }
        }
      }

      fit(canvas, cssH) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const w = canvas.clientWidth || 1, h = cssH || canvas.clientHeight || 1;
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
          canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        }
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, w, h };
      }

      blade(ctx, x, baseY, h, w, lean, color, tipColor, hl) {
        const tipX = x + lean, tipY = baseY - h;
        const g = ctx.createLinearGradient(x, baseY, tipX, tipY);
        g.addColorStop(0, color);
        g.addColorStop(0.45, tipColor || color);
        g.addColorStop(1, tipColor || color);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x - w, baseY);
        ctx.bezierCurveTo(x - w * 0.9 + lean * 0.12, baseY - h * 0.42, x - w * 0.42 + lean * 0.62, baseY - h * 0.8, tipX, tipY);
        ctx.bezierCurveTo(x + w * 0.5 + lean * 0.6, baseY - h * 0.78, x + w * 0.95 + lean * 0.1, baseY - h * 0.4, x + w, baseY);
        ctx.closePath();
        ctx.fill();
        if (hl) {
          ctx.strokeStyle = hl;
          ctx.lineWidth = Math.max(0.6, w * 0.22);
          ctx.beginPath();
          ctx.moveTo(x + w * 0.1, baseY - h * 0.06);
          ctx.quadraticCurveTo(x + lean * 0.45 + w * 0.2, baseY - h * 0.58, tipX, tipY);
          ctx.stroke();
        }
      }

      spine(x, baseY, h, lean, u) {
        const s = 1 - u;
        const cx = x + lean * 0.45, cy = baseY - h * 0.58;
        const tx = x + lean, ty = baseY - h;
        const m = 1 - s;
        return {
          x: m * m * x + 2 * m * s * cx + s * s * tx,
          y: m * m * baseY + 2 * m * s * cy + s * s * ty
        };
      }

      drop(ctx, x, y, r, stretch) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, Math.min(2.2, stretch));
        const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, 0, 0, 0, r * 1.15);
        g.addColorStop(0, 'rgba(240,252,246,.85)');
        g.addColorStop(.55, 'rgba(188,222,206,.42)');
        g.addColorStop(1, 'rgba(120,168,148,.18)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.5);
        ctx.bezierCurveTo(r, -r * 0.4, r, r, 0, r);
        ctx.bezierCurveTo(-r, r, -r, -r * 0.4, 0, -r * 1.5);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.25, r * 0.24, 0, 6.283); ctx.fill();
        ctx.restore();
      }

      drawRain(ctx, t, w, h, count, speed) {
        ctx.lineCap = 'round';
        for (let i = 0; i < count; i++) {
          const seed = i * 97.13;
          const near = (i % 5) / 4;
          const vx = 0.055 + near * 0.03;
          const len = 16 + near * 46;
          const life = (h + 200) / (0.42 + near * 0.5) / speed;
          const prog = ((t + seed * 130) % life) / life;
          const y = prog * (h + 200) - 120;
          const x = ((seed * 7.7) % (w + 260)) - 130 + prog * h * vx;
          ctx.strokeStyle = 'rgba(226,240,232,' + (0.05 + near * 0.16) + ')';
          ctx.lineWidth = 0.7 + near * 1.1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - len * vx * 3.2, y - len);
          ctx.stroke();
        }
      }

      bakeGrass(w, h, layers) {
        const ss = Math.min(1.35, 2200000 / Math.max(1, w * h * 1.5 * 2.2));
        const S = Math.max(0.75, ss);
        const ox = -w * 0.25, oy = -h;              // world-space top-left of the strip
        const sw = w * 1.5, sh = h * 2.2;
        const out = [];
        for (let L = 0; L < layers.length; L++) {
          const cv = document.createElement('canvas');
          cv.width = Math.round(sw * S); cv.height = Math.round(sh * S);
          const c2 = cv.getContext('2d');
          c2.setTransform(S, 0, 0, S, -ox * S, -oy * S);
          for (const b of this.blades) {
            if (b.layer !== L) continue;
            const lean = b.lean + Math.sin(b.phase) * (7 + L * 5);
            this.blade(c2, b.x, h + 10, b.h, b.w, lean, b.pal[0], b.pal[1], b.pal[2]);
          }
          out.push({ canvas: cv, ox, oy, w: sw, h: sh });
        }
        return out;
      }

      makeBlades(w, h, count, layers) {
        const out = [];
        for (let L = 0; L < layers.length; L++) {
          const cfg = layers[L];
          const n = Math.round(count * cfg.share);
          for (let i = 0; i < n; i++) {
            out.push({
              layer: L,
              x: Math.random() * (w * 1.4) - w * 0.2,
              h: h * cfg.h * (0.65 + Math.random() * 0.55),
              w: cfg.w * (0.7 + Math.random() * 0.7),
              lean: (Math.random() - 0.5) * cfg.lean,
              phase: Math.random() * Math.PI * 2,
              speed: 0.5 + Math.random() * 0.7,
              pal: cfg.colors[Math.floor(Math.random() * cfg.colors.length)]
            });
          }
        }
        return out.sort((a, b) => a.layer - b.layer);
      }

      drawIntro(t, p) {
        const c = this.el('grass'); if (!c) return;
        const { ctx, w, h } = this.fit(c);
        const layers = [
          { share: .40, h: .78, w: 5, lean: 64, blur: 2.4, colors: [
            ['#123f26', '#2b6b40', 'rgba(120,180,130,.10)'],
            ['#0e3a22', '#357349', 'rgba(140,196,150,.10)'],
            ['#15462b', '#2f6f42', null] ] },
          { share: .34, h: 1.06, w: 8, lean: 88, blur: 0.6, colors: [
            ['#0a2f1a', '#2c7a45', 'rgba(168,214,166,.16)'],
            ['#0c3520', '#39894f', 'rgba(186,226,178,.14)'],
            ['#093018', '#266b3c', null] ] },
          { share: .26, h: 1.5, w: 15, lean: 118, blur: 3.6, colors: [
            ['#04180d', '#0d3a20', 'rgba(120,170,128,.10)'],
            ['#031409', '#123f24', null],
            ['#05210f', '#0a3319', 'rgba(110,160,120,.08)'] ] }
        ];
        if (!this.blades) this.blades = this.makeBlades(w, h, 380, layers);
        if (!this.strips) this.strips = this.bakeGrass(w, h, layers);
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#7fae86'); g.addColorStop(.28, '#3c7a4c'); g.addColorStop(.62, '#0d3a21'); g.addColorStop(1, '#02150b');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        const sun = ctx.createRadialGradient(w * 0.72, h * 0.06, 0, w * 0.72, h * 0.06, h * 0.85);
        sun.addColorStop(0, 'rgba(226,238,196,.42)'); sun.addColorStop(1, 'rgba(226,238,196,0)');
        ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);

        const smooth = p * p * (3 - 2 * p);
        const ease = 0.22 * p + 0.78 * smooth;
        const cx = w / 2, cy = h * 0.62;
        const fade = Math.max(0, 1 - Math.max(0, (p - 0.62) / 0.36));
        const ks = [2.4, 4.4, 8.2];
        for (let L = 0; L < this.strips.length; L++) {
          const s = this.strips[L];
          const zoom = 1 + ease * ks[L];
          const dof = Math.min(6, layers[L].blur + ease * (L === 2 ? 5 : L === 1 ? 2 : 1));
          const ang = (Math.sin(t * 0.00042 + L * 1.7) * 0.012 + Math.sin(t * 0.00097 + L) * 0.004) * (1 + L * 0.5);
          ctx.save();
          ctx.globalAlpha = fade;
          ctx.filter = dof > 0.5 ? 'blur(' + dof.toFixed(1) + 'px)' : 'none';
          ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
          ctx.translate(cx, h + 10); ctx.rotate(ang); ctx.translate(-cx, -(h + 10));
          ctx.drawImage(s.canvas, s.ox, s.oy, s.w, s.h);
          ctx.restore();
        }
        ctx.filter = 'none';

        ctx.globalAlpha = fade * 0.9;
        this.drawRain(ctx, t, w, h, 90, 1 + ease * 1.6);
        ctx.globalAlpha = fade * 0.55;
        const haze = ctx.createLinearGradient(0, 0, 0, h);
        haze.addColorStop(0, 'rgba(214,232,206,.30)'); haze.addColorStop(.4, 'rgba(214,232,206,.05)'); haze.addColorStop(1, 'rgba(2,21,11,.35)');
        ctx.fillStyle = haze; ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        const tx = this.el('introtext');
        if (tx) {
          const seg = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
          const o = Math.min(seg(0.04, 0.20), 1 - seg(0.72, 0.92));
          tx.style.opacity = String(Math.max(0, o));
          tx.style.transform = 'scale(' + (1 + ease * 0.26) + ')';
          const br = this.el('breath');
          if (br) {
            const words = ['Healing', 'Experience', 'Compassion'];
            // Show all three within the fully-visible window (before the text fades ~p0.72),
            // so Compassion lands with time to spare.
            const want = words[Math.max(0, Math.min(2, Math.floor((p - 0.05) / 0.21)))];
            if (br.textContent !== want && !this.swapping) { this.swapping = true; br.style.opacity = '0'; setTimeout(() => { br.textContent = want; br.style.opacity = '1'; this.swapping = false; }, 300); }
          }
        }
      }

      drawWater(t) {
        const c = this.el('water'); if (!c) return;
        const { ctx, w, h } = this.fit(c);
        const hz = h * 0.46;
        const sky = ctx.createLinearGradient(0, 0, 0, hz);
        sky.addColorStop(0, '#0c2028'); sky.addColorStop(.35, '#26463d'); sky.addColorStop(.68, '#7d7b53'); sky.addColorStop(.88, '#c99a5e'); sky.addColorStop(1, '#e0ae74');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz + 1);

        const rise = Math.min(1, t / 180000);
        const sunX = w * 0.6;
        const sunY = hz * (0.66 - rise * 0.16);
        const sunR = Math.max(22, h * 0.045);

        const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 11);
        glow.addColorStop(0, 'rgba(255,214,150,.55)');
        glow.addColorStop(.16, 'rgba(238,168,110,.26)');
        glow.addColorStop(.5, 'rgba(206,150,104,.09)');
        glow.addColorStop(1, 'rgba(206,150,104,0)');
        ctx.fillStyle = glow; ctx.fillRect(0, 0, w, hz + 1);

        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, w, hz); ctx.clip();
        const disc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
        disc.addColorStop(0, 'rgba(255,246,224,.98)');
        disc.addColorStop(.55, 'rgba(255,206,142,.85)');
        disc.addColorStop(1, 'rgba(232,150,96,.22)');
        ctx.fillStyle = disc;
        ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, 6.283); ctx.fill();

        if (!this.clouds || this.cloudW !== w) {
          this.cloudW = w;
          this.clouds = [];
          for (let L = 0; L < 4; L++) {
            const n = 4 + L * 3;
            for (let i = 0; i < n; i++) {
              this.clouds.push({
                L,
                x: Math.random() * (w + 400) - 200,
                y: hz * (0.1 + L * 0.19) + (Math.random() - 0.5) * hz * 0.16,
                rw: hz * (0.45 + Math.random() * 0.8) * (1 + L * 0.18),
                rh: hz * (0.06 + Math.random() * 0.085),
                sp: (0.0016 + L * 0.0012) * (0.7 + Math.random() * 0.6),
                ph: Math.random() * 6.28
              });
            }
          }
          this.clouds.sort((a, b) => a.L - b.L);
        }
        for (const cd of this.clouds) {
          const span = w + cd.rw * 4;
          const x = (((cd.x + t * cd.sp * 0.02) % span) + span) % span - cd.rw * 2;
          const y = cd.y + Math.sin(t * 0.00009 + cd.ph) * 3;
          const warm = Math.max(0, 1 - Math.hypot(x - sunX, y - sunY) / (hz * 1.5));
          const base = [[62,78,80], [44,58,62], [28,40,46], [17,27,33]][cd.L];
          const lit = [Math.round(base[0] + warm * 175), Math.round(base[1] + warm * 132), Math.round(base[2] + warm * 78)];
          const cg = ctx.createRadialGradient(x - cd.rw * 0.18, y - cd.rh * 0.6, cd.rh * 0.15, x, y, cd.rw);
          cg.addColorStop(0, 'rgba(' + lit.join(',') + ',' + (0.5 + cd.L * 0.11) + ')');
          cg.addColorStop(.5, 'rgba(' + base.join(',') + ',' + (0.46 + cd.L * 0.12) + ')');
          cg.addColorStop(1, 'rgba(' + base.join(',') + ',0)');
          ctx.fillStyle = cg;
          ctx.filter = 'blur(' + (10 - cd.L * 1.7).toFixed(1) + 'px)';
          ctx.beginPath(); ctx.ellipse(x, y, cd.rw, cd.rh, 0, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + cd.rw * 0.34, y - cd.rh * 0.52, cd.rw * 0.5, cd.rh * 0.72, 0, 0, 6.283); ctx.fill();
        }
        ctx.filter = 'none';
        ctx.globalAlpha = 0.5;
        this.drawRain(ctx, t, w, hz, 34, 1.05);
        ctx.globalAlpha = 1;
        ctx.restore();

        const haze = ctx.createLinearGradient(0, hz * 0.75, 0, hz);
        haze.addColorStop(0, 'rgba(232,214,168,0)'); haze.addColorStop(1, 'rgba(232,214,168,.35)');
        ctx.fillStyle = haze; ctx.fillRect(0, hz * 0.75, w, hz * 0.26);

        const tgtX = w * 0.14, tgtY = h * 0.075;
        const baseA = Math.atan2(tgtY - sunY, tgtX - sunX);
        const reach = Math.hypot(tgtX - sunX, tgtY - sunY) * 1.9;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 6; i++) {
          const off = (i - 2.5) * 0.052 + Math.sin(t * 0.00013 + i * 1.9) * 0.012;
          const a = baseA + off;
          const spread = 0.018 + (i % 3) * 0.008;
          const pulse = 0.055 + 0.03 * (0.5 + 0.5 * Math.sin(t * 0.00042 + i * 2.3));
          const rg = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(a) * reach, sunY + Math.sin(a) * reach);
          rg.addColorStop(0, 'rgba(255,222,168,' + pulse + ')');
          rg.addColorStop(.45, 'rgba(255,214,164,' + pulse * 0.55 + ')');
          rg.addColorStop(1, 'rgba(255,210,160,0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.lineTo(sunX + Math.cos(a - spread) * reach, sunY + Math.sin(a - spread) * reach);
          ctx.lineTo(sunX + Math.cos(a + spread) * reach, sunY + Math.sin(a + spread) * reach);
          ctx.closePath();
          ctx.fill();
        }
        const bloom = ctx.createRadialGradient(tgtX, tgtY, 0, tgtX, tgtY, h * 0.3);
        const bp = 0.16 + 0.05 * Math.sin(t * 0.0004);
        bloom.addColorStop(0, 'rgba(255,228,182,' + bp + ')');
        bloom.addColorStop(.45, 'rgba(255,216,166,' + bp * 0.3 + ')');
        bloom.addColorStop(1, 'rgba(255,216,166,0)');
        ctx.fillStyle = bloom; ctx.fillRect(0, 0, w, h * 0.6);
        ctx.restore();

        const g = ctx.createLinearGradient(0, hz, 0, h);
        g.addColorStop(0, '#2c5a44'); g.addColorStop(.12, '#12523a'); g.addColorStop(.5, '#0a3b2a'); g.addColorStop(1, '#02150f');
        ctx.fillStyle = g; ctx.fillRect(0, hz, w, h - hz);

        const refl = h * 0.3;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, hz, w, refl); ctx.clip();
        ctx.globalCompositeOperation = 'screen';
        const col = ctx.createLinearGradient(0, hz, 0, hz + refl);
        col.addColorStop(0, 'rgba(255,206,150,.34)'); col.addColorStop(1, 'rgba(255,206,150,0)');
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(sunX - sunR * 0.7, hz);
        ctx.lineTo(sunX + sunR * 0.7, hz);
        ctx.lineTo(sunX + sunR * 3.4, hz + refl);
        ctx.lineTo(sunX - sunR * 3.4, hz + refl);
        ctx.closePath(); ctx.fill();
        ctx.restore();

        const mist = ctx.createLinearGradient(0, hz - h * 0.09, 0, hz + h * 0.05);
        mist.addColorStop(0, 'rgba(224,206,168,0)');
        mist.addColorStop(.55, 'rgba(226,210,174,.24)');
        mist.addColorStop(1, 'rgba(226,210,174,0)');
        ctx.fillStyle = mist; ctx.fillRect(0, hz - h * 0.09, w, h * 0.14);

        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 34; i++) {
          const f = i / 34;
          const y = hz + Math.pow(f, 1.7) * (h - hz);
          const spread = 10 + f * 190;
          const lw = 8 + Math.sin(t * 0.002 + i * 2.1) * 26 + f * 60;
          const gx = sunX + Math.sin(t * 0.0009 + i * 1.7) * spread * 0.5;
          ctx.fillStyle = 'rgba(250,228,178,' + (0.16 - f * 0.13) + ')';
          ctx.fillRect(gx - lw / 2, y, lw, 1.1 + f * 1.6);
        }
        ctx.globalCompositeOperation = 'source-over';

        for (let i = 0; i < 46; i++) {
          const f = i / 46;
          const y = hz + Math.pow(f, 1.5) * (h - hz);
          const persp = 0.15 + f * 1.0;
          ctx.strokeStyle = 'rgba(198, 230, 210,' + (0.018 + 0.07 * f) + ')';
          ctx.lineWidth = 0.6 + f * 1.4;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 10) {
            const yy = y
              + Math.sin(x * 0.0055 + t * 0.00055 * (0.6 + f) + i * 0.9) * 9 * persp
              + Math.sin(x * 0.019 - t * 0.0013 + i * 0.5) * 3.4 * persp
              + Math.sin(x * 0.041 + t * 0.0021 + i) * 1.4 * persp;
            x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
          }
          ctx.stroke();
        }

        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 16; i++) {
          const f = 0.25 + (i / 16) * 0.75;
          const x = ((i * 137.5) % w) + Math.sin(t * 0.0004 + i) * 26;
          const y = hz + f * (h - hz) + Math.sin(t * 0.0009 + i * 2) * 8;
          const rw = 22 + f * 70, rh = 1.6 + f * 3.2;
          const cg = ctx.createRadialGradient(x, y, 0, x, y, rw);
          cg.addColorStop(0, 'rgba(190, 226, 206,' + (0.05 + f * 0.05) + ')');
          cg.addColorStop(1, 'rgba(190, 226, 206,0)');
          ctx.fillStyle = cg;
          ctx.save(); ctx.translate(x, y); ctx.scale(1, rh / rw);
          ctx.beginPath(); ctx.arc(0, 0, rw, 0, 6.283); ctx.fill(); ctx.restore();
        }
        ctx.globalCompositeOperation = 'source-over';

        if (!this.lotus) {
          this.lotus = Array.from({ length: 13 }, (_, i) => ({
            x: Math.random(), y: Math.pow(Math.random(), 0.85),
            s: 0.5 + Math.random() * 0.9, ph: Math.random() * 6.28,
            kind: Math.random() < 0.28 ? 'pad' : Math.random() < 0.62 ? 'petal' : 'flower',
            drift: 0.000004 + Math.random() * 0.00001
          })).sort((a, b) => a.y - b.y);
        }
        const surfTop = hz + (h - hz) * 0.07;
        for (const f of this.lotus) {
          const px = ((f.x + t * f.drift) % 1.24 - 0.12) * w;
          const depth = 0.3 + f.y * 0.95;
          const py = surfTop + f.y * (h - surfTop) + Math.sin(t * 0.00068 + f.ph) * 2.4 * depth;
          if (py < surfTop) continue;
          const rr = 30 * f.s * depth;
          if (f.kind === 'pad') this.drawPad(ctx, px, py, rr * 1.5, Math.sin(t * 0.0003 + f.ph) * 0.2);
          else if (f.kind === 'petal') this.drawPetalFloat(ctx, px, py, rr * 0.55, f.ph + Math.sin(t * 0.00035 + f.ph) * 0.45);
          else {
            this.drawLotus(ctx, px, py, rr, Math.sin(t * 0.0004 + f.ph) * 0.12);
            const rg = ctx.createLinearGradient(0, py, 0, py + rr * 1.1);
            rg.addColorStop(0, 'rgba(226,176,186,.22)'); rg.addColorStop(1, 'rgba(226,176,186,0)');
            ctx.fillStyle = rg;
            ctx.beginPath();
            ctx.ellipse(px + Math.sin(t * 0.0014 + f.ph) * 1.5, py + rr * 0.55, rr * 0.5, rr * 0.62, 0, 0, 6.283);
            ctx.fill();
          }
        }

        this.drawRain(ctx, t, w, h, Math.round(70 * this.rain), 1.15);

        if (Math.random() < 0.11 * this.rain) {
          const yf = 0.3 + Math.random() * 0.68;
          this.ripples.push({ x: Math.random() * w, y: hz + yf * (h - hz), r: 0, max: 30 + yf * 110, d: yf, splash: 1 });
        }
        this.ripples = this.ripples.filter(r => r.r < r.max);
        for (const r of this.ripples) {
          r.r += 0.5 + r.d * 0.9;
          const life = r.r / r.max, a = Math.pow(1 - life, 1.6) * 0.5;
          const sq = 0.16 + r.d * 0.2;
          r.splash = Math.max(0, r.splash - 0.06);
          if (r.splash > 0) {
            ctx.fillStyle = 'rgba(226,244,234,' + r.splash * 0.5 + ')';
            ctx.beginPath(); ctx.ellipse(r.x, r.y - 3 * r.splash, 1.6 + r.d * 2, Math.max(0.1, (2.4 + r.d * 3) * r.splash), 0, 0, 6.283); ctx.fill();
          }
          ctx.lineWidth = 1.1 + r.d * 0.7;
          ctx.strokeStyle = 'rgba(222, 244, 230,' + a + ')';
          ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * sq, 0, 0, 6.283); ctx.stroke();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(4, 32, 22,' + a * 0.55 + ')';
          ctx.beginPath(); ctx.ellipse(r.x, r.y + 1 + r.d, r.r * 0.97, r.r * sq * 0.95, 0, 0, 6.283); ctx.stroke();
          if (r.r > 16) {
            ctx.strokeStyle = 'rgba(214, 238, 224,' + a * 0.45 + ')';
            ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r * 0.56, r.r * sq * 0.56, 0, 0, 6.283); ctx.stroke();
          }
        }
      }

      drawPetalFloat(ctx, x, y, r, rot) {
        ctx.save();
        ctx.translate(x, y); ctx.scale(1, 0.44); ctx.rotate(rot);
        ctx.fillStyle = 'rgba(3,26,17,.3)';
        ctx.beginPath(); ctx.ellipse(0, r * 0.4, r * 0.55, r * 1.0, 0, 0, 6.283); ctx.fill();
        ctx.translate(0, r * 0.8);
        this.petal(ctx, r * 1.7, r * 0.52, r * 0.14, '#f5dee0', '#d9a3b2', 0, true);
        ctx.restore();
      }

      drawPad(ctx, x, y, r, tilt) {
        ctx.save();
        ctx.translate(x, y); ctx.scale(1, 0.34); ctx.rotate(tilt);
        ctx.fillStyle = 'rgba(3,26,17,.35)';
        ctx.beginPath(); ctx.arc(0, r * 0.16, r, 0, 6.283); ctx.fill();
        const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
        g.addColorStop(0, '#2f6d43'); g.addColorStop(.6, '#1d4f30'); g.addColorStop(1, '#123a23');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0.42, 6.283); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(150,196,158,.16)'; ctx.lineWidth = r * 0.03;
        for (let i = 0; i < 9; i++) {
          const a = 0.6 + (i / 9) * 5.6;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92); ctx.stroke();
        }
        ctx.restore();
      }

      petal(ctx, L, W, curl, c1, c2, shade, vein) {
        const g = ctx.createLinearGradient(0, 0, 0, -L);
        g.addColorStop(0, c1); g.addColorStop(0.55, c2); g.addColorStop(1, c2);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-W * 0.85 + curl, -L * 0.3, -W * 1.0 + curl, -L * 0.72, curl * 1.4, -L);
        ctx.bezierCurveTo(W * 1.0 + curl, -L * 0.72, W * 0.85 + curl, -L * 0.3, 0, 0);
        ctx.closePath();
        ctx.fill();
        if (shade > 0) { ctx.fillStyle = 'rgba(58,26,40,' + shade + ')'; ctx.fill(); }
        if (vein) {
          ctx.strokeStyle = 'rgba(180,120,140,.22)';
          ctx.lineWidth = Math.max(0.4, L * 0.012);
          ctx.beginPath(); ctx.moveTo(0, -L * 0.08);
          ctx.quadraticCurveTo(curl * 0.6, -L * 0.55, curl * 1.3, -L * 0.94);
          ctx.stroke();
        }
      }

      drawLotus(ctx, x, y, r, tilt) {
        ctx.save();
        ctx.translate(x, y);
        const sh = ctx.createRadialGradient(0, r * 0.16, r * 0.1, 0, r * 0.16, r * 1.15);
        sh.addColorStop(0, 'rgba(2,20,13,.4)'); sh.addColorStop(1, 'rgba(2,20,13,0)');
        ctx.fillStyle = sh;
        ctx.save(); ctx.scale(1, 0.3);
        ctx.beginPath(); ctx.arc(0, r * 0.5, r * 1.2, 0, 6.283); ctx.fill();
        ctx.restore();

        const rings = [
          { n: 9, len: 1.0, wd: 0.3, sy: 0.30, lift: 0.0, off: 0.0, c1: '#e8ccc4', c2: '#c9899c' },
          { n: 8, len: 0.82, wd: 0.28, sy: 0.42, lift: 0.05, off: 0.36, c1: '#f6e3dc', c2: '#dfa2b2' },
          { n: 6, len: 0.6, wd: 0.26, sy: 0.56, lift: 0.11, off: 0.72, c1: '#fdf3ea', c2: '#efc3c9' },
          { n: 5, len: 0.38, wd: 0.24, sy: 0.68, lift: 0.16, off: 1.1, c1: '#fffaf0', c2: '#f8dcd8' }
        ];
        for (const ring of rings) {
          for (let i = 0; i < ring.n; i++) {
            const a = (i / ring.n) * Math.PI * 2 + ring.off + tilt;
            const back = Math.max(0, -Math.sin(a - Math.PI / 2));
            ctx.save();
            ctx.translate(0, -r * ring.lift);
            ctx.scale(1, ring.sy);
            ctx.rotate(a);
            this.petal(ctx, r * ring.len, r * ring.wd, r * 0.05 * Math.sin(i * 2.4), ring.c1, ring.c2, back * 0.2, r > 16);
            ctx.restore();
          }
        }

        ctx.save();
        ctx.translate(0, -r * 0.2); ctx.scale(1, 0.7);
        const cg = ctx.createRadialGradient(-r * 0.05, -r * 0.06, 0, 0, 0, r * 0.22);
        cg.addColorStop(0, '#f7e6ae'); cg.addColorStop(.7, '#d8b774'); cg.addColorStop(1, '#a98d51');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.17, 0, 6.283); ctx.fill();
        if (r > 14) {
          ctx.strokeStyle = 'rgba(240,214,150,.75)';
          ctx.lineWidth = Math.max(0.4, r * 0.018);
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * 6.283 + 0.2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * r * 0.12, Math.sin(a) * r * 0.12);
            ctx.lineTo(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3);
            ctx.stroke();
          }
        }
        ctx.restore();

        ctx.globalCompositeOperation = 'screen';
        const rim = ctx.createLinearGradient(-r * 0.6, -r * 0.5, r * 0.3, r * 0.3);
        rim.addColorStop(0, 'rgba(255,246,232,.14)'); rim.addColorStop(1, 'rgba(255,246,232,0)');
        ctx.fillStyle = rim;
        ctx.save(); ctx.scale(1, 0.36);
        ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      }

      drawPond(t) {
        const c = this.el('pond'); if (!c) return;
        const { ctx, w, h } = this.fit(c);
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < 20; i++) {
          const y = h * (i / 20) + 6;
          ctx.strokeStyle = 'rgba(180, 216, 197,' + (0.02 + 0.05 * (i / 20)) + ')';
          ctx.beginPath();
          for (let x = 0; x <= w; x += 18) {
            const yy = y + Math.sin(x * 0.008 + t * 0.0005 + i) * 6;
            x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
          }
          ctx.stroke();
        }
        if (Math.random() < 0.05 * this.rain) {
          this.pondRipples.push({ x: Math.random() * w, y: Math.random() * h, r: 0, max: 40 + Math.random() * 70 });
        }
        this.pondRipples = this.pondRipples.filter(r => r.r < r.max);
        for (const r of this.pondRipples) {
          r.r += 0.7;
          ctx.strokeStyle = 'rgba(214, 236, 222,' + (1 - r.r / r.max) * 0.22 + ')';
          ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * 0.28, 0, 0, 6.283); ctx.stroke();
        }
      }

      drawBottomGrass(t) {
        const c = this.el('grassstrip'); if (!c) return;
        const { ctx, w, h } = this.fit(c);
        ctx.clearRect(0, 0, w, h);
        const dt = Math.min(60, this.lastT ? t - this.lastT : 16); this.lastT = t;
        if (!this.leaves || this.stripW !== w) {
          this.stripW = w;
          const n = Math.max(4, Math.round(w / 260));
          const pal = [
            ['rgba(3,22,12,.94)', 'rgba(18,58,32,.88)', 'rgba(150,196,158,.10)'],
            ['rgba(4,26,14,.9)', 'rgba(26,70,40,.82)', null],
            ['rgba(2,18,10,.96)', 'rgba(14,50,28,.9)', 'rgba(160,206,166,.08)']
          ];
          this.leaves = Array.from({ length: n }, (_, i) => ({
            x: ((i + 0.5) / n + (Math.random() - 0.5) * 0.16) * w,
            h: h * (0.46 + Math.random() * 0.42),
            w: 9 + Math.random() * 8,
            lean: (Math.random() - 0.5) * 90,
            ph: Math.random() * 6.28,
            sp: 0.3 + Math.random() * 0.28,
            pal: pal[i % pal.length],
            drops: [],
            next: 400 + Math.random() * 4000
          }));
        }
        for (const L of this.leaves) {
          const sway = Math.sin(t * 0.00034 * L.sp + L.ph) * 16 + Math.sin(t * 0.00091 * L.sp + L.ph * 1.7) * 4.5;
          const lean = L.lean + sway;
          const baseY = h + 4;
          this.blade(ctx, L.x, baseY, L.h, L.w, lean, L.pal[0], L.pal[1], L.pal[2]);

          L.next -= dt;
          if (L.next <= 0) {
            L.drops.push({ u: 0.06 + Math.random() * 0.2, v: 0.00002, r: 1.9 + Math.random() * 1.7, fall: false });
            L.next = 2400 + Math.random() * 7000;
          }
          for (const d of L.drops) {
            if (!d.fall) {
              d.r = Math.max(0.6, d.r);
              d.v = Math.min(0.00048, d.v + 0.00000055 * dt);
              d.u += d.v * dt;
              const p = this.spine(L.x, baseY, L.h, lean, d.u);
              if (d.u >= 0.86) { d.fall = true; d.fx = p.x; d.fy = p.y; d.vy = 0.045; }
              else this.drop(ctx, p.x + Math.cos(d.u * 3) * 0.4, p.y, d.r, 1 + d.v * 900);
            } else {
              d.vy += 0.00075 * dt;
              d.fy += d.vy * dt;
              d.fx += 0.004 * dt;
              this.drop(ctx, d.fx, d.fy, d.r * 0.92, 1.9);
            }
          }
          L.drops = L.drops.filter(d => !d.fall || d.fy < h + 30);
        }
        ctx.globalCompositeOperation = 'destination-out';
        const fade = ctx.createLinearGradient(0, 0, 0, h * 0.55);
        fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(.55, 'rgba(0,0,0,.55)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fade; ctx.fillRect(0, 0, w, h * 0.55);
        ctx.globalCompositeOperation = 'source-over';
      }

      safe(fn) { try { fn(); } catch (e) { /* one bad frame must not blank other layers */ } }

      loop(now) {
        if (!this.done) {
          const p = Math.min(1, (now - this.t0) / this.dur);
          this.safe(() => this.drawIntro(now, p));
          if (p >= 1) this.finish(false);
          this.raf = requestAnimationFrame(this.loop);
          return;
        }
        this.safe(() => this.drawBottomGrass(now));
        this.safe(() => this.drawWater(now));
        this.safe(() => {
          const pond = this.el('pond');
          if (!pond) return;
          const r = pond.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) this.drawPond(now);
        });
        this.raf = requestAnimationFrame(this.loop);
      }

      renderVals() { return {}; }
    }

    var app = new Component({
      showIntro: true,
      introDuration: CFG.duration ?? 12,
      sound: CFG.sound !== false,
      soundVolume: CFG.volume ?? 0.55,
      rainIntensity: CFG.rain ?? 1,
      audioSrc: CFG.audioSrc || ''
    });

    // after the intro dissolves: drop the canvas, keep the ambient toggle, restyle it for a light page
    var origFinish = app.finish.bind(app);
    app.finish = function (instant) {
      if (app.done) return;
      origFinish(instant);
      setTimeout(function () {
        cancelAnimationFrame(app.raf);
        var ov = host.querySelector('[data-hs="overlay"]');
        if (ov) ov.remove();
        var btn = host.querySelector('[data-hs="sound"]');
        if (btn && CFG.keepSoundToggle !== false && CFG.light !== false) {
          btn.style.background = 'rgba(245,242,234,.72)';
          btn.style.borderColor = 'rgba(1,60,28,.22)';
          btn.style.color = 'rgba(1,60,28,.7)';
        } else if (btn && CFG.keepSoundToggle === false) {
          app.audioStop();
          btn.remove();
        }
        if (typeof CFG.onDone === 'function') CFG.onDone();
      }, instant ? 0 : 2200);
    };

    app.componentDidMount();
    window.HSIntro = app;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
