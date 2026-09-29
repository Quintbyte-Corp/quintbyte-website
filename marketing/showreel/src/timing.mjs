/**
 * The reel's clock: 20 s at 60 fps, cut to a 120 BPM score (1 beat = 0.5 s, 1 bar = 2 s).
 * Impacts drive camera shake, flashes, lens aberration and bloom — and the audio score
 * reads the same list, so picture and sound hit together.
 */
import { noise } from "./core/math.mjs";

export const FPS = 60;
export const DURATION = 20;
export const FRAMES = FPS * DURATION;
export const BPM = 120;
export const BEAT = 60 / BPM;

/** Every hit in the reel. s = strength 0..1 */
export const IMPACTS = [
  { t: 2.0, s: 1.0, flash: 0.95 }, // particles detonate → type
  { t: 2.18, s: 0.22 },
  { t: 2.5, s: 0.3 },
  { t: 2.68, s: 0.22 },
  { t: 3.0, s: 0.35 },
  { t: 7.0, s: 1.0, flash: 0.6 }, // implosion → orbit core
  { t: 11.0, s: 0.45, flash: 0.12 }, // ecosystem floor
  { t: 11.5, s: 0.5 }, // plates land
  { t: 12.0, s: 0.5 },
  { t: 12.5, s: 0.7 },
  { t: 17.0, s: 0.55, flash: 0.45 }, // process collapses → logo
  { t: 18.5, s: 1.0, flash: 0.4 }, // logo fills
];

const decay = (t, i, k) => (t < i.t ? 0 : i.s * Math.exp(-(t - i.t) * k));

export function shake(t) {
  let x = 0;
  let y = 0;
  IMPACTS.forEach((i, n) => {
    const a = decay(t, i, 10) * 26;
    if (a < 0.05) return;
    x += noise(t * 38, n) * a;
    y += noise(t * 38, n + 97) * a;
  });
  return [x, y];
}

export const aberrationAt = (t) => IMPACTS.reduce((s, i) => s + decay(t, i, 6) * 16, 0);
export const flashAt = (t) =>
  Math.min(
    0.85,
    IMPACTS.reduce((s, i) => s + (i.flash ? decay(t, { ...i, s: i.flash }, 16) : 0), 0),
  );
export const bloomAt = (t) => 0.45 + IMPACTS.reduce((s, i) => s + decay(t, i, 4) * 0.6, 0);

/** Chapters, for the HUD */
export const CHAPTERS = [
  { t: 0, n: "01", name: "IGNITE" },
  { t: 2, n: "02", name: "MOVING PARTS" },
  { t: 3.8, n: "03", name: "THE WORK BEHIND" },
  { t: 7, n: "04", name: "ONE PARTNER" },
  { t: 11, n: "05", name: "THE RIGHT SPECIALISTS" },
  { t: 14.4, n: "06", name: "CLEAR ACCOUNTABILITY" },
  { t: 17, n: "07", name: "QUINTBYTE" },
];
