/**
 * 02 MOVING PARTS (2 – 4 s)
 * "Your business has enough moving parts." — words slam in on the beat with motion-blur
 * ghosts; the cyan letters of "moving parts." spring in from all directions and never
 * quite stop moving, then explode outward into the next scene.
 */
import { C, cyan, font } from "../core/brand.mjs";
import { CX, CY, W, layout, text } from "../core/draw.mjs";
import { TAU, clamp, ease, rng, seg, spring } from "../core/math.mjs";

const SIZE = 172;
const TRACK = -SIZE * 0.035;
const F = font(800, SIZE);

// Lines and the moment each word lands
const LINES = [
  { str: "Your business", y: CY - 150, times: [2.0, 2.18] },
  { str: "has enough", y: CY + 18, times: [2.5, 2.68] },
];
const HERO = { str: "moving parts.", y: CY + 186, start: 3.0, stagger: 0.017 };

let cache = null;
function measure(ctx) {
  if (cache) return cache;
  const lines = LINES.map((l) => {
    const lay = layout(ctx, l.str, F, TRACK);
    const words = [];
    let i = 0;
    for (const w of l.str.split(" ")) {
      const g0 = lay.glyphs[i];
      const g1 = lay.glyphs[i + w.length - 1];
      words.push({ str: w, x: g0.x, w: g1.x + g1.w - g0.x });
      i += w.length + 1;
    }
    return { ...l, width: lay.width, words };
  });
  const hero = layout(ctx, HERO.str, F, TRACK);
  const r = rng(23);
  const glyphs = hero.glyphs.map((g) => {
    const a = r() * TAU;
    const d = 260 + r() * 420;
    return {
      ...g,
      dx: Math.cos(a) * d,
      dy: Math.sin(a) * d,
      rot: (r() - 0.5) * 2.6,
      exit: [Math.cos(a) * (0.6 + r()), Math.sin(a) * (0.6 + r())],
      spin: (r() - 0.5) * 6,
      phase: r() * TAU,
    };
  });
  cache = { lines, hero: { width: hero.width, glyphs } };
  return cache;
}

/** Horizontal lens flare that fires as each word lands */
function flare(ctx, y, u) {
  if (u < 0 || u > 0.5) return;
  const a = (1 - u / 0.5) ** 2;
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "rgba(34,199,255,0)");
  g.addColorStop(0.5, cyan(0.5 * a));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.fillRect(0, y - 2, W, 4);
  ctx.restore();
}

export function type(ctx, t) {
  if (t < 1.98 || t > 4.05) return;
  const m = measure(ctx);
  const exitUp = ease.inCubic(seg(t, 3.68, 3.95));

  // Lines 1–2: word slams
  for (const line of m.lines) {
    const x0 = CX - line.width / 2;
    line.words.forEach((word, wi) => {
      const u = t - line.times[wi];
      if (u < 0) return;
      flare(ctx, line.y - SIZE * 0.32, u);
      const s = 1 + 0.45 * (1 - ease.outExpo(clamp(u / 0.32)));
      const alpha = clamp(u / 0.06) * (1 - exitUp);
      const cx = x0 + word.x + word.w / 2;
      const cy = line.y - SIZE * 0.35 - exitUp * 90;
      // Motion-blur ghosts while it is still travelling
      const ghosts = u < 0.2 ? 4 : 0;
      for (let k = ghosts; k >= 0; k--) {
        const gs = s * (1 + k * 0.07 * (1 - u / 0.2));
        ctx.save();
        ctx.globalAlpha = k === 0 ? alpha : alpha * 0.22 * (1 - u / 0.2) * (1 - k / 5);
        ctx.translate(cx, cy);
        ctx.scale(gs, gs);
        text(ctx, word.str, -word.w / 2, SIZE * 0.35, { f: F, tracking: TRACK });
        ctx.restore();
      }
    });
  }

  // Line 3: the moving parts
  const x0 = CX - m.hero.width / 2;
  const boom = seg(t, 3.72, 4.05);
  const boomE = ease.inCubic(boom);
  const idle = clamp(seg(t, 3.3, 3.5));
  ctx.save();
  ctx.shadowColor = cyan(0.65);
  ctx.shadowBlur = 36;
  m.hero.glyphs.forEach((g, i) => {
    if (g.ch === " ") return;
    const u = t - HERO.start - i * HERO.stagger;
    if (u < 0) return;
    const sp = spring(u, 3.4, 0.58);
    let x = x0 + g.x + g.w / 2 + g.dx * (1 - sp);
    let y = HERO.y - SIZE * 0.35 + g.dy * (1 - sp);
    let rot = g.rot * (1 - sp);
    // Once landed, every letter keeps moving on its own rhythm
    y += Math.sin(t * 7 + g.phase) * 5 * idle;
    rot += Math.sin(t * 5 + g.phase * 1.3) * 0.05 * idle;
    // Then they blow apart
    x += g.exit[0] * 1500 * boomE;
    y += g.exit[1] * 1500 * boomE;
    rot += g.spin * boomE;
    const sc = 1 - 0.35 * boomE;
    ctx.save();
    ctx.globalAlpha = clamp(u / 0.1) * (1 - ease.inQuad(boom));
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(sc, sc);
    text(ctx, g.ch, -g.w / 2, SIZE * 0.35, { f: F, color: C.accent, tracking: TRACK });
    ctx.restore();
  });
  ctx.restore();
  flare(ctx, HERO.y - SIZE * 0.32, t - HERO.start - 0.15);
}
