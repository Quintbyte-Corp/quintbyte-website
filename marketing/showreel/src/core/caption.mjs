/**
 * Chapter captions (top-left, title-safe): a scrambling mono eyebrow and a headline whose
 * words rise out of masks. Used for the tagline beats: "One business partner." etc.
 */
import { C, cyan, font } from "./brand.mjs";
import { clamp, ease, hash, seg } from "./math.mjs";
import { layout, text } from "./draw.mjs";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#";

/** Text that resolves from random glyphs, left to right */
export function scramble(str, p, seed = 0) {
  const settled = Math.floor(str.length * p);
  let out = "";
  for (let i = 0; i < str.length; i++) {
    if (i < settled || str[i] === " ") out += str[i];
    else out += GLYPHS[Math.floor(hash(i * 31 + seed + Math.floor(p * 40)) * GLYPHS.length)];
  }
  return out;
}

export function drawCaption(
  ctx,
  t,
  { tIn, tOut, eyebrow, title, accentLast = true, x = 120, y = 150, size = 84 },
) {
  if (t < tIn || t > tOut + 0.5) return;
  const out = ease.inCubic(seg(t, tOut, tOut + 0.4));

  // Eyebrow: scramble-resolve + rule line
  const pe = seg(t, tIn, tIn + 0.45);
  ctx.save();
  ctx.globalAlpha = clamp(pe * 4) * (1 - out);
  ctx.fillStyle = cyan(0.9);
  ctx.fillRect(x, y - 6, 36 * ease.outExpo(pe), 2);
  text(ctx, scramble(eyebrow, pe, 7), x + 50, y, {
    f: font(500, 17, "Mono"),
    color: C.accent,
    tracking: 3,
    base: "middle",
  });
  ctx.restore();

  // Headline: words rise out of clipping masks, staggered
  const f = font(800, size);
  const words = title.split(" ");
  const full = layout(ctx, title, f, -size * 0.03);
  let charIndex = 0;
  words.forEach((word, wi) => {
    const wx = full.glyphs[charIndex].x;
    charIndex += word.length + 1;
    const p = ease.outExpo(seg(t, tIn + 0.12 + wi * 0.07, tIn + 0.75 + wi * 0.07));
    const lineY = y + 34 + size;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + wx - 10, lineY - size * 1.05, 2000, size * 1.35);
    ctx.clip();
    const dy = (1 - p) * size * 1.2 - out * size * 1.2;
    const isLast = wi === words.length - 1;
    text(ctx, word, x + wx, lineY + dy, {
      f,
      tracking: -size * 0.03,
      color: isLast && accentLast ? C.accent : C.ink,
    });
    ctx.restore();
  });
}
