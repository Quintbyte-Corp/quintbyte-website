/**
 * Post-processing: bloom, lens chromatic aberration, directional smear (whip pans),
 * flash, vignette and animated film grain. All buffers are allocated once per renderer.
 */
import { createCanvas } from "@napi-rs/canvas";
import { rng } from "./math.mjs";
import { H, W } from "./draw.mjs";

export function createFx() {
  const tmpA = createCanvas(W, H);
  const tmpB = createCanvas(W, H);
  const bloomA = createCanvas(W / 4, H / 4);
  const bloomB = createCanvas(W / 8, H / 8);

  // Vignette, precomputed
  const vignette = createCanvas(W, H);
  {
    const v = vignette.getContext("2d");
    const g = v.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.62)");
    v.fillStyle = g;
    v.fillRect(0, 0, W, H);
  }

  // Grain: a handful of noise tiles, cycled per frame
  const grain = Array.from({ length: 6 }, (_, k) => {
    const c = createCanvas(W / 2, H / 2);
    const g = c.getContext("2d");
    const img = g.createImageData(W / 2, H / 2);
    const r = rng(1337 + k);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (r() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  });

  /** Glow: soft-threshold the frame at low resolution and add it back on top */
  function bloom(main, amount) {
    if (amount <= 0) return;
    const ctx = main.getContext("2d");
    for (const [buf, blur, gain] of [
      [bloomA, 3, 0.55],
      [bloomB, 5, 0.6],
    ]) {
      const b = buf.getContext("2d");
      b.globalCompositeOperation = "copy";
      b.filter = `blur(${blur}px) brightness(0.85) contrast(1.9)`;
      b.drawImage(main, 0, 0, buf.width, buf.height);
      b.filter = "none";
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = amount * gain;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(buf, 0, 0, W, H);
      ctx.restore();
    }
  }

  /** Radial RGB split, like a lens under stress */
  function aberration(main, px) {
    if (px < 0.4) return;
    const ctx = main.getContext("2d");
    const a = tmpA.getContext("2d");
    a.globalCompositeOperation = "copy";
    a.drawImage(main, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = "copy";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const b = tmpB.getContext("2d");
    for (const [color, k] of [
      ["#ff0000", 1],
      ["#00ff00", 0],
      ["#0000ff", -1],
    ]) {
      b.globalCompositeOperation = "copy";
      b.drawImage(tmpA, 0, 0);
      b.globalCompositeOperation = "multiply";
      b.fillStyle = color;
      b.fillRect(0, 0, W, H);
      const s = 1 + (k * px) / (W / 2);
      ctx.drawImage(tmpB, (W - W * s) / 2, (H - H * s) / 2, W * s, H * s);
    }
    ctx.restore();
  }

  /** Box blur along x — the frame averaged with shifted copies of itself */
  function smear(main, px) {
    if (Math.abs(px) < 1) return;
    const ctx = main.getContext("2d");
    const a = tmpA.getContext("2d");
    a.globalCompositeOperation = "copy";
    a.drawImage(main, 0, 0);
    const n = Math.min(14, Math.ceil(Math.abs(px) / 12) + 3);
    ctx.save();
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(tmpA, -px / 2, 0);
    ctx.globalCompositeOperation = "source-over";
    for (let i = 1; i < n; i++) {
      ctx.globalAlpha = 1 / (i + 1);
      ctx.drawImage(tmpA, -px / 2 + (px * i) / (n - 1), 0);
    }
    ctx.restore();
  }

  function flash(main, amount, color = "255,255,255") {
    if (amount <= 0.002) return;
    const ctx = main.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(${color},${Math.min(1, amount)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function finish(main, { frame, grainAmount = 0.07, fade = 0 }) {
    const ctx = main.getContext("2d");
    ctx.save();
    ctx.drawImage(vignette, 0, 0);
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = grainAmount;
    ctx.drawImage(grain[frame % grain.length], 0, 0, W, H);
    ctx.restore();
    if (fade > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  return { bloom, aberration, smear, flash, finish };
}
