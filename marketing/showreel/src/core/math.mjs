/**
 * Math, easing and deterministic randomness. Every frame of the reel is a pure function
 * of time, so nothing here holds state — frames can render in any order, in parallel.
 */

export const TAU = Math.PI * 2;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, x) => clamp((x - a) / (b - a));
/** Progress of t through the window [a, b], clamped to 0..1 */
export const seg = (t, a, b) => invLerp(a, b, t);
export const deg = (d) => (d * Math.PI) / 180;
/** 0 → 1 → 0 bump across [a, b] */
export const bump = (t, a, b) => Math.sin(seg(t, a, b) * Math.PI);

export const ease = {
  linear: (x) => x,
  inQuad: (x) => x * x,
  outQuad: (x) => 1 - (1 - x) * (1 - x),
  inOutQuad: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2),
  inCubic: (x) => x ** 3,
  outCubic: (x) => 1 - (1 - x) ** 3,
  inOutCubic: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  outQuart: (x) => 1 - (1 - x) ** 4,
  inQuart: (x) => x ** 4,
  inOutQuart: (x) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2),
  inExpo: (x) => (x === 0 ? 0 : 2 ** (10 * x - 10)),
  outExpo: (x) => (x === 1 ? 1 : 1 - 2 ** (-10 * x)),
  inOutExpo: (x) =>
    x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2,
  inOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  outBack: (x, s = 1.70158) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2,
};

/**
 * Analytic damped spring: response of a spring to a unit step, `t` seconds after release.
 * Overshoots and settles on 1. freq in Hz, damp is the damping ratio (0..1).
 */
export function spring(t, freq = 3.2, damp = 0.42) {
  if (t <= 0) return 0;
  const w = TAU * freq;
  const wd = w * Math.sqrt(1 - damp * damp);
  return 1 - Math.exp(-damp * w * t) * (Math.cos(wd * t) + ((damp * w) / wd) * Math.sin(wd * t));
}

/** Seeded PRNG (mulberry32) */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stateless hash of an integer to [0, 1) */
export function hash(n) {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/** Smooth 1-D value noise in [-1, 1] */
export function noise(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = hash(i * 7919 + seed * 104729) * 2 - 1;
  const b = hash((i + 1) * 7919 + seed * 104729) * 2 - 1;
  return a + (b - a) * u;
}

/** Bounce x inside [min, max] like a ball off walls (triangle wave), statelessly */
export function reflect(x, min, max) {
  const span = max - min;
  let r = (x - min) % (2 * span);
  if (r < 0) r += 2 * span;
  return min + (r < span ? r : 2 * span - r);
}
