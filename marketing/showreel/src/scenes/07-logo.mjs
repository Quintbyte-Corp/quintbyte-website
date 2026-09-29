/**
 * 07 QUINTBYTE (17 – 20 s) — end card
 * 2,200 particles spiral in and settle onto points sampled along the official mark's
 * contours; the outline draws itself on; the mark fills (official colours) with a burst
 * on the downbeat; the wordmark wipes in behind a light edge; the tagline follows;
 * a specular sweep crosses the mark before the final hold.
 */
import { Path2D } from "@napi-rs/canvas";
import { C, cyan, font, logo, sampleMarkContour } from "../core/brand.mjs";
import { CX, W, drawWordmark, layout, markTransform, text, wordmarkWidth } from "../core/draw.mjs";
import { scramble } from "../core/caption.mjs";
import { TAU, clamp, ease, hash, lerp, seg } from "../core/math.mjs";

const MARK_H = 360;
const MY = 392;
const MT = markTransform(CX, MY, MARK_H);
const toScreen = ([x, y]) => [MT.ox + x * MT.s, MT.oy + y * MT.s];

const N = 2200;
const targets = sampleMarkContour(N).map(toScreen);
const particles = targets.map((tg, i) => {
  const a = hash(i * 3 + 1) * TAU;
  const d = 850 + hash(i * 3 + 2) * 700;
  return {
    tg,
    start: [CX + Math.cos(a) * d, MY + Math.sin(a) * d * 0.7],
    delay: hash(i * 3 + 3) * 0.32,
    burst: [Math.cos(a) * (40 + hash(i + 77) * 220), Math.sin(a) * (40 + hash(i + 77) * 220)],
    hot: hash(i + 5) < 0.25,
  };
});

function particlePos(p, t) {
  const q = ease.inOutCubic(seg(t, 17.0 + p.delay, 17.92 + p.delay * 0.45));
  const ox = p.start[0] - p.tg[0];
  const oy = p.start[1] - p.tg[1];
  const rot = (1 - q) ** 2 * 2.3;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const k = 1 - q;
  let x = p.tg[0] + (ox * c - oy * s) * k;
  let y = p.tg[1] + (ox * s + oy * c) * k;
  const b = ease.outExpo(seg(t, 18.46, 19.4));
  x += p.burst[0] * b;
  y += p.burst[1] * b;
  return { x, y, q, b };
}

// Contour polylines in screen space, with lengths, for the draw-on
const outlines = logo.mark.polys.map((poly) => {
  const pts = poly.map(toScreen);
  pts.push(pts[0]);
  let len = 0;
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    cum.push(len);
  }
  return { pts, cum, len };
});

function withMarkSpace(ctx, fn) {
  ctx.save();
  ctx.translate(MT.ox, MT.oy);
  ctx.scale(MT.s, MT.s);
  fn(ctx);
  ctx.restore();
}

const TAGLINE = ["One business partner.", "The right specialists.", "Clear accountability."];

export function logoScene(ctx, t) {
  if (t < 16.95) return;

  // Soft glow + echo of the orbit rings behind the mark
  const settle = ease.outExpo(seg(t, 18.4, 19.2));
  const g = ctx.createRadialGradient(CX, MY, 0, CX, MY, 900);
  g.addColorStop(0, cyan(0.05 + 0.13 * settle));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 1080);
  ctx.save();
  ctx.globalAlpha = settle;
  ctx.setLineDash([6, 12]);
  ctx.lineDashOffset = -t * 20;
  ctx.strokeStyle = cyan(0.16);
  ctx.lineWidth = 1.5;
  for (const r of [300 + 30 * settle, 420 + 50 * settle]) {
    ctx.beginPath();
    ctx.arc(CX, MY, r, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();

  // Shockwave on the fill
  const sw = seg(t, 18.5, 19.3);
  if (sw > 0 && sw < 1) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = cyan(0.6 * (1 - sw));
    ctx.lineWidth = 2 + 18 * (1 - sw);
    ctx.beginPath();
    ctx.arc(CX, MY, 200 + 1000 * ease.outExpo(sw), 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  // Particles: streaks while travelling, sparks once they burst
  const fade = 1 - ease.inQuad(seg(t, 18.5, 19.35));
  if (fade > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const hot of [false, true]) {
      ctx.strokeStyle = hot ? `rgba(220,248,255,${0.9 * fade})` : cyan(0.85 * fade);
      ctx.lineWidth = hot ? 2.2 : 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const p of particles) {
        if (p.hot !== hot || t < 17.0 + p.delay) continue;
        const a = particlePos(p, t);
        const b = particlePos(p, t - 0.022);
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(a.x + 0.01, a.y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Outline draws itself on
  const draw = ease.inOutCubic(seg(t, 17.82, 18.45));
  const outlineA = clamp(seg(t, 17.82, 17.95)) * (1 - seg(t, 18.5, 18.9));
  if (draw > 0 && outlineA > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = cyan(0.9);
    ctx.shadowBlur = 18;
    ctx.strokeStyle = `rgba(160,236,255,${outlineA})`;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    for (const o of outlines) {
      const lim = o.len * draw;
      ctx.beginPath();
      ctx.moveTo(o.pts[0][0], o.pts[0][1]);
      for (let i = 1; i < o.pts.length; i++) {
        if (o.cum[i] <= lim) {
          ctx.lineTo(o.pts[i][0], o.pts[i][1]);
        } else {
          const f = (lim - o.cum[i - 1]) / (o.cum[i] - o.cum[i - 1]);
          ctx.lineTo(lerp(o.pts[i - 1][0], o.pts[i][0], f), lerp(o.pts[i - 1][1], o.pts[i][1], f));
          break;
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Fill — official colours, with a white-hot flash as it lands
  const fill = ease.outCubic(seg(t, 18.36, 18.6));
  if (fill > 0) {
    withMarkSpace(ctx, (m) => {
      m.globalAlpha = fill;
      m.shadowColor = cyan(0.5);
      m.shadowBlur = 40 / MT.s;
      m.fillStyle = C.ink;
      m.fill(logo.mark.ink, "evenodd");
      m.fillStyle = C.logoCyan;
      m.fill(logo.mark.accent, "evenodd");
      const hot = 1 - seg(t, 18.5, 18.85);
      if (hot > 0) {
        m.globalCompositeOperation = "lighter";
        m.globalAlpha = hot * 0.8;
        m.fillStyle = "#ffffff";
        m.fill(logo.mark.ink, "evenodd");
        m.fill(logo.mark.accent, "evenodd");
      }
    });
  }

  // Specular sweep across the finished mark
  const sweep = seg(t, 19.3, 19.9);
  if (sweep > 0 && sweep < 1) {
    ctx.save();
    ctx.translate(MT.ox, MT.oy);
    ctx.scale(MT.s, MT.s);
    const clip = new Path2D();
    clip.addPath(logo.mark.ink);
    clip.addPath(logo.mark.accent);
    ctx.clip(clip, "evenodd");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const x = lerp(CX - 400, CX + 400, ease.inOutSine(sweep));
    const sg = ctx.createLinearGradient(x - 90, MY - 200, x + 90, MY + 200);
    sg.addColorStop(0, "rgba(255,255,255,0)");
    sg.addColorStop(0.5, "rgba(255,255,255,0.55)");
    sg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = sg;
    ctx.fillRect(CX - 400, MY - 220, 800, 440);
    ctx.restore();
  }

  // Wordmark wipes in behind a light edge
  const WM_H = 62;
  const WM_Y = MY + MARK_H / 2 + 92;
  const ww = wordmarkWidth(WM_H);
  const wipe = ease.inOutCubic(seg(t, 18.62, 19.02));
  if (wipe > 0) {
    const left = CX - ww / 2 - 10;
    const edge = left + (ww + 20) * wipe;
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, WM_Y - 60, edge - left, 120);
    ctx.clip();
    drawWordmark(ctx, CX, WM_Y, WM_H, { accent: C.logoCyan, ink: C.ink });
    ctx.restore();
    if (wipe < 1) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = cyan(1);
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(220,248,255,0.9)";
      ctx.fillRect(edge - 1.5, WM_Y - 50, 3, 100);
      ctx.restore();
    }
  }

  // Tagline, phrase by phrase, with cyan separators
  const TF = font(600, 30);
  const sep = "   ·   ";
  const full = TAGLINE.join(sep);
  const lay = layout(ctx, full, TF, 0);
  const TY = WM_Y + 118;
  let idx = 0;
  TAGLINE.forEach((phrase, i) => {
    const p = ease.outExpo(seg(t, 18.95 + i * 0.14, 19.55 + i * 0.14));
    const x = CX - lay.width / 2 + lay.glyphs[idx].x;
    ctx.save();
    ctx.globalAlpha = p;
    text(ctx, phrase, x, TY + (1 - p) * 26, { f: TF, color: C.mute3 });
    if (i < TAGLINE.length - 1) {
      const sx = CX - lay.width / 2 + lay.glyphs[idx + phrase.length + 3].x;
      text(ctx, "·", sx, TY + (1 - p) * 26, { f: TF, color: C.accent });
    }
    ctx.restore();
    idx += phrase.length + sep.length;
  });

  // Eyebrow under it, resolving from scrambled glyphs
  const e = seg(t, 19.35, 19.8);
  if (e > 0) {
    ctx.save();
    ctx.globalAlpha = clamp(e * 3);
    text(ctx, scramble("BUSINESS MANAGEMENT SERVICES", e, 3), CX, TY + 66, {
      f: font(500, 17, "Mono"),
      color: C.accent,
      align: "center",
      tracking: 6,
    });
    ctx.restore();
  }
}
