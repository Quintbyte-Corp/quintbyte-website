/**
 * The score — synthesized from scratch, sample-accurate to the picture.
 * 120 BPM, A minor. Drums, sub bass, detuned-saw pads, risers, impacts, whooshes and UI
 * sound design all keyed off the same timing module the visuals use.
 * Output: out/audio.wav (48 kHz, stereo, 16-bit). Run: npm run audio
 */
import { writeFileSync } from "node:fs";
import { BEAT, DURATION, IMPACTS } from "./timing.mjs";
import { rng } from "./core/math.mjs";

const SR = 48000;
const LEN = Math.ceil((DURATION + 0.05) * SR);
const L = new Float32Array(LEN);
const R = new Float32Array(LEN);
const verbL = new Float32Array(LEN); // reverb send
const verbR = new Float32Array(LEN);
const noise = (() => {
  const r = rng(99);
  return () => r() * 2 - 1;
})();
const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const idx = (t) => Math.max(0, Math.min(LEN - 1, Math.round(t * SR)));

/** Mix a mono buffer in at time t with gain, pan (-1..1) and reverb send */
function mix(buf, t, gain = 1, pan = 0, send = 0) {
  const i0 = idx(t);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < buf.length && i0 + i < LEN; i++) {
    L[i0 + i] += buf[i] * gl;
    R[i0 + i] += buf[i] * gr;
    if (send) {
      verbL[i0 + i] += buf[i] * gl * send;
      verbR[i0 + i] += buf[i] * gr * send;
    }
  }
}

/** One-pole low-pass (in place) */
function lowpass(buf, hz) {
  const a = Math.exp((-2 * Math.PI * hz) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) buf[i] = y = (1 - a) * buf[i] + a * y;
  return buf;
}
function highpass(buf, hz) {
  const a = Math.exp((-2 * Math.PI * hz) / SR);
  let y = 0;
  let xp = 0;
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i];
    y = a * (y + x - xp);
    xp = x;
    buf[i] = y;
  }
  return buf;
}
/** Band-pass biquad with optionally swept centre frequency (hz can be a function of 0..1) */
function bandpass(buf, hz, q = 1.2) {
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < buf.length; i++) {
    const f = typeof hz === "function" ? hz(i / buf.length) : hz;
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const alpha = Math.sin(w) / (2 * q);
    const a0 = 1 + alpha;
    const b0 = alpha / a0;
    const b2 = -alpha / a0;
    const a1 = (-2 * Math.cos(w)) / a0;
    const a2 = (1 - alpha) / a0;
    const x = buf[i];
    const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    buf[i] = y;
  }
  return buf;
}
const buffer = (sec) => new Float32Array(Math.round(sec * SR));

// ---------------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------------
function kick(t, gain = 1, low = 45) {
  const b = buffer(0.55);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const s = i / SR;
    const f = low + 110 * Math.exp(-s * 38);
    ph += (2 * Math.PI * f) / SR;
    b[i] = Math.sin(ph) * Math.exp(-s * 6.5) + (s < 0.004 ? noise() * 0.5 : 0);
  }
  mix(b, t, 0.9 * gain);
}
function clap(t, gain = 1) {
  const b = buffer(0.3);
  for (let i = 0; i < b.length; i++) {
    const s = i / SR;
    const burst = [0, 0.011, 0.022].some((o) => s >= o && s < o + 0.006) ? 1 : 0;
    b[i] = noise() * (burst * 0.8 + Math.exp(-s * 18) * 0.6);
  }
  bandpass(b, 1500, 0.9);
  mix(b, t, 0.55 * gain, 0, 0.35);
}
function hat(t, gain = 1, open = false, pan = 0.2) {
  const b = buffer(open ? 0.22 : 0.05);
  for (let i = 0; i < b.length; i++) b[i] = noise() * Math.exp(-(i / SR) * (open ? 16 : 70));
  highpass(b, 7500);
  mix(b, t, 0.28 * gain, pan, 0.1);
}
function pluck(t, note, gain = 1, pan = 0) {
  const b = buffer(0.5);
  const f = midi(note);
  for (let i = 0; i < b.length; i++) {
    const s = i / SR;
    b[i] =
      (Math.sin(2 * Math.PI * f * s) + 0.35 * Math.sin(4 * Math.PI * f * s)) * Math.exp(-s * 11);
  }
  mix(b, t, 0.22 * gain, pan, 0.45);
}
function uiClick(t, hz, pan) {
  const b = buffer(0.045);
  for (let i = 0; i < b.length; i++) {
    const s = i / SR;
    b[i] = Math.sin(2 * Math.PI * hz * s) * Math.exp(-s * 120);
  }
  mix(b, t, 0.16, pan, 0.2);
}
function bassNote(t, note, dur, gain = 1) {
  const b = buffer(dur);
  const f = midi(note);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const s = i / SR;
    ph += f / SR;
    const saw = 2 * (ph % 1) - 1;
    const env = Math.min(1, s / 0.005) * Math.exp(-s * 5);
    b[i] = (Math.sin(2 * Math.PI * ph) * 0.8 + saw * 0.35) * env;
  }
  lowpass(b, 420);
  mix(b, t, 0.34 * gain);
}
function pad(t, notes, dur, gain = 1, bright = 1800) {
  const b = buffer(dur + 0.6);
  const detune = [-0.11, 0, 0.12];
  for (const n of notes) {
    for (const d of detune) {
      const f = midi(n + d);
      let ph = (n * 0.137 + d + 1) % 1; // fixed, spread start phases
      for (let i = 0; i < b.length; i++) {
        ph += f / SR;
        b[i] += (2 * (ph % 1) - 1) * 0.06;
      }
    }
  }
  for (let i = 0; i < b.length; i++) {
    const s = i / SR;
    b[i] *= Math.min(1, s / 0.25) * (s > dur ? Math.exp(-(s - dur) * 6) : 1);
  }
  lowpass(lowpass(b, bright), bright * 1.4);
  mix(b, t, 0.5 * gain, 0, 0.5);
}
function riser(t0, t1, gain = 1) {
  const b = buffer(t1 - t0);
  for (let i = 0; i < b.length; i++) b[i] = noise() * (i / b.length) ** 2.2;
  bandpass(b, (x) => 300 + 7000 * x * x, 1.6);
  const tone = buffer(t1 - t0);
  let ph = 0;
  for (let i = 0; i < tone.length; i++) {
    const x = i / tone.length;
    ph += (80 + 520 * x * x) / SR;
    tone[i] = Math.sin(2 * Math.PI * ph) * x ** 2 * 0.35;
  }
  mix(b, t0, 0.55 * gain, 0, 0.3);
  mix(tone, t0, 0.5 * gain, 0, 0.2);
}
function reverseSwell(t, len = 0.55, gain = 1) {
  const b = buffer(len);
  for (let i = 0; i < b.length; i++) b[i] = noise() * (i / b.length) ** 3;
  lowpass(b, 5000);
  mix(b, t - len, 0.5 * gain, 0, 0.4);
}
function impact(t, gain = 1) {
  const boom = buffer(1.8);
  let ph = 0;
  for (let i = 0; i < boom.length; i++) {
    const s = i / SR;
    ph += (38 + 70 * Math.exp(-s * 10)) / SR;
    boom[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-s * 2.4);
  }
  const crash = buffer(1.6);
  for (let i = 0; i < crash.length; i++) crash[i] = noise() * Math.exp(-(i / SR) * 3.2);
  highpass(crash, 900);
  mix(boom, t, 0.72 * gain);
  mix(crash, t, 0.28 * gain, 0, 0.6);
  kick(t, 0.6 * gain, 40);
}
function whoosh(t0, t1, gain = 1) {
  const b = buffer(t1 - t0);
  for (let i = 0; i < b.length; i++) {
    const x = i / b.length;
    b[i] = noise() * Math.sin(Math.PI * x) ** 1.5;
  }
  bandpass(b, (x) => 400 + 5000 * x, 2.2);
  mix(b, t0, 0.8 * gain, 0, 0.3);
}
function thud(t, gain = 1) {
  kick(t, 0.7 * gain, 55);
  const b = buffer(0.25);
  for (let i = 0; i < b.length; i++) b[i] = noise() * Math.exp(-(i / SR) * 22);
  lowpass(b, 1200);
  mix(b, t, 0.35 * gain, 0, 0.3);
}

// ---------------------------------------------------------------------------------
// Arrangement
// ---------------------------------------------------------------------------------
// A minor: Am9 – Fmaj7 – Cmaj7 – G6 (one chord per bar = 2 s)
const CHORDS = [
  [57, 60, 64, 71],
  [53, 57, 60, 64],
  [48, 55, 59, 64],
  [55, 59, 62, 64],
];
const ROOTS = [33, 29, 36, 31];
const beats = (from, to, step = BEAT) => {
  const out = [];
  for (let t = from; t < to - 1e-6; t += step) out.push(+t.toFixed(4));
  return out;
};

// Intro: drone, heartbeat, riser into the detonation
pad(0, [45, 52, 57], 2.0, 0.55, 600);
beats(0.5, 2.0).forEach((t, i) => kick(t, 0.25 + i * 0.12, 50));
riser(0.4, 2.0, 1.0);

// Groove sections
const groove = [
  [2.0, 5.75],
  [7.0, 16.9],
];
for (const [a, b] of groove) {
  beats(a, b).forEach((t) => kick(t));
  beats(a + BEAT / 2, b).forEach((t) => hat(t, 0.9, false, 0.25));
  beats(a, b, BEAT / 4).forEach((t, i) => i % 2 && hat(t, 0.35, false, -0.3));
  beats(a + BEAT, b, BEAT * 2).forEach((t) => clap(t));
  beats(a, b, BEAT / 2).forEach((t) => {
    const bar = Math.floor(t / 2) % 4;
    bassNote(t, ROOTS[bar] + (Math.round(t * 4) % 4 === 3 ? 12 : 0), BEAT / 2 - 0.01);
  });
}
for (let bar = 1; bar < 9; bar++) {
  const t = bar * 2;
  if (t >= 5.75 && t < 7) continue;
  pad(t, CHORDS[bar % 4], 2.0, t >= 7 ? 0.9 : 0.7, t >= 7 ? 2600 : 1500);
}
// Breakdown under the freeze-frame: muffled chord, heartbeat, swell into the drop
pad(5.75, [45, 52, 57, 60], 1.25, 0.7, 500);
[5.75, 6.25, 6.75].forEach((t) => kick(t, 0.35, 48));
reverseSwell(7.0, 0.7, 1.2);
riser(6.0, 7.0, 0.7);

// Type slams: a pluck per word
[2.0, 2.18, 2.5, 2.68].forEach((t, i) => pluck(t, [69, 72, 76, 79][i], 0.9));
beats(3.0, 3.25, 0.017 * 2).forEach((t, i) => pluck(t, 81 + ((i * 2) % 7), 0.35, (i % 3) - 1));

// Chips: a tiny UI click per spawn, panned across the stereo field
for (let i = 0; i < 30; i++)
  uiClick(3.84 + i * 0.062, 1800 + ((i * 37) % 9) * 180, ((i * 53) % 17) / 8 - 1);

// Orbit: pings as signals fly
for (let i = 0; i < 10; i++) pluck(7.16 + i * 0.07, [81, 84, 88, 91, 93][i % 5], 0.35, i / 4.5 - 1);
beats(8.0, 10.2, 0.6).forEach((t, i) => pluck(t, 93 + (i % 3) * 2, 0.18, (i % 2) * 2 - 1));

// Ecosystem: plates land
[11.5, 12.0, 12.5].forEach((t, i) => thud(t, 0.8 + i * 0.15));
pluck(12.75, 88, 0.6);

// Whip pan
whoosh(14.05, 14.75, 1.1);

// Process: ascending plucks per step
[69, 72, 74, 76, 79, 81].forEach((n, i) => pluck(14.75 + i * 0.3, n + 12, 0.85, i / 2.5 - 1));

// Build into the logo: snare roll accelerating, riser
riser(17.0, 18.5, 1.3);
for (let t = 17.0, step = 0.125; t < 18.45; t += step, step = Math.max(0.03, step * 0.93)) {
  clap(t, 0.25 + ((t - 17) / 1.5) * 0.6);
}
reverseSwell(18.5, 0.8, 1.3);

// Impacts from the shared timeline
for (const i of IMPACTS) if (i.s >= 0.9) impact(i.t, i.s);
impact(17.0, 0.55);

// Final chord and chime
pad(18.5, [57, 64, 68, 71, 76], 1.3, 1.0, 3200);
bassNote(18.5, 33, 1.4, 1.2);
pluck(19.3, 88, 0.5, -0.4);
pluck(19.42, 95, 0.4, 0.4);

// ---------------------------------------------------------------------------------
// Reverb (Schroeder: 4 combs + 2 all-passes per side) and master
// ---------------------------------------------------------------------------------
function reverb(input, seed) {
  const out = new Float32Array(LEN);
  const combs = [1557, 1617, 1491, 1422].map((d) => d + seed);
  for (const d of combs) {
    const buf = new Float32Array(d);
    let p = 0;
    let lp = 0;
    for (let i = 0; i < LEN; i++) {
      const y = buf[p];
      lp = y * 0.8 + lp * 0.2;
      buf[p] = input[i] + lp * 0.84;
      out[i] += y * 0.25;
      p = (p + 1) % d;
    }
  }
  for (const d of [225 + seed, 556 + seed]) {
    const buf = new Float32Array(d);
    let p = 0;
    for (let i = 0; i < LEN; i++) {
      const b = buf[p];
      const x = out[i];
      buf[p] = x + b * 0.5;
      out[i] = b - x * 0.5;
      p = (p + 1) % d;
    }
  }
  return out;
}
const rvL = reverb(verbL, 0);
const rvR = reverb(verbR, 23);
for (let i = 0; i < LEN; i++) {
  L[i] += rvL[i] * 0.5;
  R[i] += rvR[i] * 0.5;
}

// Soft-clip, normalise to -1 dBFS, fade the last 80 ms
let peak = 0;
let rawPeak = 0;
for (let i = 0; i < LEN; i++) rawPeak = Math.max(rawPeak, Math.abs(L[i]), Math.abs(R[i]));
// Gain-stage so the soft clipper only warms the loudest transients (no hard crushing)
const drive = 1.6 / rawPeak;
for (let i = 0; i < LEN; i++) {
  L[i] = Math.tanh(L[i] * drive);
  R[i] = Math.tanh(R[i] * drive);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
const fadeStart = LEN - Math.round(0.08 * SR);
const pcm = Buffer.alloc(LEN * 4);
for (let i = 0; i < LEN; i++) {
  const f = i > fadeStart ? 1 - (i - fadeStart) / (LEN - fadeStart) : 1;
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm * f)) * 32767), i * 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm * f)) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);
writeFileSync(new URL("../out/audio.wav", import.meta.url), Buffer.concat([header, pcm]));
console.log(
  `audio.wav  ${(LEN / SR).toFixed(2)} s, mix peak ${rawPeak.toFixed(2)} → drive ${drive.toFixed(2)}`,
);
