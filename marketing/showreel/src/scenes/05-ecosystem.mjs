/**
 * 05 THE RIGHT SPECIALISTS (11 – 14.5 s)
 * The orbit has become the isometric platform. The floor grid slams in, plates fall
 * under gravity onto the beat (dust rings, sparks, flashes), the top plate lights the
 * mark, a light column rises, and People / Processes / Systems lock into place.
 * Exits on a whip-pan.
 */
import { createCanvas } from "@napi-rs/canvas";
import { C, cyan, font } from "../core/brand.mjs";
import { W, drawIcon, drawMark, roundRect, text } from "../core/draw.mjs";
import { drawCaption } from "../core/caption.mjs";
import { TAU, clamp, deg, ease, hash, seg } from "../core/math.mjs";
import { STAGE } from "./stage.mjs";

const U = STAGE.u;
const LANDS = [null, 11.5, 12.0, 12.5]; // bottom plate is already there (morphed from the core)
const PLATES = [
  { fill: "#050d16", stroke: cyan(0.45), glow: 0.35 },
  { fill: "#06111c", stroke: cyan(0.55), glow: 0.35 },
  { fill: "#081624", stroke: cyan(0.65), glow: 0.4 },
  { fill: null, stroke: "#3fd2ff", glow: 0.55, top: true },
];
const PILLARS = [
  { icon: "groups", title: "People", caption: "Right Specialists", at: 13.0, from: [-170, 0] },
  {
    icon: "account_tree",
    title: "Processes",
    caption: "Clear Workflows",
    at: 13.22,
    from: [170, 0],
  },
  { icon: "dns", title: "Systems", caption: "The Right Tools", at: 13.44, from: [0, 150] },
];

/** Whip-pan out of the scene (also read by the smear pass) */
export const whipOut = (t) => -W * 1.3 * ease.inExpo(seg(t, 14.08, 14.46));

// Floor grid, prebuilt once: grid lines every 7% with a radial fade
const grid = (() => {
  const s = Math.round(STAGE.floorSide);
  const c = createCanvas(s, s);
  const g = c.getContext("2d");
  g.strokeStyle = cyan(0.11);
  g.lineWidth = 1.5;
  for (let k = 0; k <= 1.0001; k += 0.07) {
    g.beginPath();
    g.moveTo(k * s, 0);
    g.lineTo(k * s, s);
    g.moveTo(0, k * s);
    g.lineTo(s, k * s);
    g.stroke();
  }
  roundRect(g, 1, 1, s - 2, s - 2, STAGE.floorCorner);
  g.strokeStyle = cyan(0.25);
  g.stroke();
  g.globalCompositeOperation = "destination-in";
  const m = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.72);
  m.addColorStop(0, "#000");
  m.addColorStop(0.42, "#000");
  m.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = m;
  g.fillRect(0, 0, s, s);
  return c;
})();

/** Enter the site's plate transform: translate → scaleY(.5) → rotate(45°) */
function iso(ctx, cx, cy, fn) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, 0.5);
  ctx.rotate(deg(45));
  fn(ctx);
  ctx.restore();
}

function plateOffset(i, t) {
  const land = LANDS[i];
  if (land === null) return { y: 0, a: 1, impact: 0 };
  const u = t - land;
  if (u < -0.34) return null;
  if (u < 0) {
    const f = seg(t, land - 0.34, land);
    return { y: -420 * (1 - ease.inQuad(f)), a: clamp(f * 3), impact: 0 };
  }
  return { y: -16 * Math.exp(-9 * u) * Math.sin(u * 26), a: 1, impact: Math.exp(-7 * u) };
}

function drawCard(ctx, x, y, w, p, pillar) {
  const h = 6 * U + 5.5 * U + 1.6 * U + (3.4 + 2.5) * U * 1.2;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.shadowColor = cyan(0.32);
  ctx.shadowBlur = 34;
  roundRect(ctx, x, y, w, h, 2.5 * U);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "rgba(14,30,46,0.96)");
  g.addColorStop(1, "rgba(6,14,22,0.96)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = cyan(0.55);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "rgba(143,230,255,0.25)";
  ctx.fillRect(x + 2.5 * U, y + 1, w - 5 * U, 1);
  const px = x + 3.2 * U;
  let cy = y + 3 * U;
  drawIcon(ctx, pillar.icon, px + 2.75 * U, cy + 2.75 * U, 5.5 * U, C.accent);
  cy += 5.5 * U + 0.8 * U;
  text(ctx, pillar.title, px, cy + 3.4 * U, { f: font(700, 3.4 * U) });
  cy += 3.4 * U * 1.2 + 0.8 * U;
  text(ctx, pillar.caption, px, cy + 2.5 * U, { f: font(500, 2.5 * U), color: C.mute2 });
  ctx.restore();
  return h;
}

export function ecosystem(ctx, t) {
  if (t < 10.98 || t > 14.5) return;
  ctx.save();
  ctx.translate(whipOut(t), 0);
  const push = 1 + 0.07 * ease.inOutSine(seg(t, 11, 14.1));
  ctx.translate(960, 560);
  ctx.scale(push, push);
  ctx.translate(-960, -560);

  // Floor grid slams in on the downbeat, with a scanning light band
  const floorIn = ease.outExpo(seg(t, 11.0, 11.45));
  iso(ctx, 960, STAGE.floorY, (p) => {
    const s = STAGE.floorSide * (0.86 + 0.14 * floorIn);
    p.globalAlpha = floorIn;
    p.drawImage(grid, -s / 2, -s / 2, s, s);
    const band = ((((t - 11.2) * 0.55) % 1.3) - 0.15) * s - s / 2;
    const bg = p.createLinearGradient(0, band - 150, 0, band + 150);
    bg.addColorStop(0, "rgba(34,199,255,0)");
    bg.addColorStop(0.5, cyan(0.07));
    bg.addColorStop(1, "rgba(34,199,255,0)");
    p.globalCompositeOperation = "lighter";
    p.fillStyle = bg;
    roundRect(p, -s / 2, -s / 2, s, s, STAGE.floorCorner);
    p.save();
    p.clip();
    p.fillRect(-s / 2, band - 150, s, 300);
    p.restore();
  });

  // Glow ring (continuous with the orbit's inner ring)
  iso(ctx, 960, STAGE.ringY, (p) => {
    const s = STAGE.ringSide;
    p.shadowColor = cyan(0.55);
    p.shadowBlur = 50;
    p.strokeStyle = cyan(0.5 + 0.1 * Math.sin(t * 4));
    p.lineWidth = 2.5;
    roundRect(p, -s / 2, -s / 2, s, s, STAGE.ringCorner);
    p.stroke();
  });

  // Plates, bottom to top
  PLATES.forEach((plate, i) => {
    const o = plateOffset(i, t);
    if (!o) return;
    const cy = STAGE.plateY[i] + o.y;
    const s = STAGE.plateSide;

    // Landing: dust ring + sparks across the plate plane
    if (o.impact > 0.01) {
      const u = t - LANDS[i];
      iso(ctx, 960, STAGE.plateY[i], (p) => {
        const k = 1 + ease.outExpo(clamp(u / 0.6)) * 0.7;
        p.strokeStyle = cyan(0.55 * o.impact);
        p.lineWidth = 3;
        roundRect(p, (-s / 2) * k, (-s / 2) * k, s * k, s * k, STAGE.plateCorner * k);
        p.stroke();
        p.globalCompositeOperation = "lighter";
        for (let n = 0; n < 46; n++) {
          const a = hash(n + i * 100) * TAU;
          const d = s * 0.5 + ease.outExpo(clamp(u / 0.7)) * (120 + hash(n + i * 999) * 260);
          p.fillStyle = cyan(0.9 * o.impact);
          p.fillRect(Math.cos(a) * d - 2, Math.sin(a) * d - 2, 4, 4);
        }
      });
    }

    iso(ctx, 960, cy, (p) => {
      p.globalAlpha = o.a;
      p.shadowColor = cyan(plate.glow + o.impact * 0.4);
      p.shadowBlur = 40 + 50 * o.impact;
      roundRect(p, -s / 2, -s / 2, s, s, STAGE.plateCorner);
      if (plate.top) {
        const g = p.createRadialGradient(0, 0, 0, 0, 0, s * 0.7);
        g.addColorStop(0, "#12324a");
        g.addColorStop(0.6, "#0a1c2c");
        g.addColorStop(1, "#07131f");
        p.fillStyle = g;
      } else {
        p.fillStyle = plate.fill;
      }
      p.fill();
      p.shadowBlur = 0;
      p.lineWidth = plate.top ? 2.5 : 1.5;
      p.strokeStyle = plate.stroke;
      p.stroke();
      if (o.impact > 0.01) {
        p.strokeStyle = `rgba(220,248,255,${0.8 * o.impact})`;
        p.stroke();
      }
    });

    // The mark lights up on the top plate, lying on its surface
    if (plate.top) {
      const lit = ease.outBack(seg(t, 12.72, 13.05));
      if (lit > 0) {
        ctx.save();
        ctx.translate(960, cy);
        ctx.scale(lit, lit * 0.5);
        ctx.shadowColor = cyan(0.95);
        ctx.shadowBlur = 30;
        drawMark(ctx, 0, 0, 12 * U, { accent: C.accentSoft, ink: C.accentSoft });
        ctx.restore();
        // Light column rising from the stack
        const col = clamp(seg(t, 12.8, 13.3));
        const lg = ctx.createLinearGradient(0, cy - 420, 0, cy);
        lg.addColorStop(0, "rgba(34,199,255,0)");
        lg.addColorStop(1, cyan(0.22 * col * (0.85 + 0.15 * Math.sin(t * 30))));
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(960 - 150, cy);
        ctx.lineTo(960 - 60, cy - 420);
        ctx.lineTo(960 + 60, cy - 420);
        ctx.lineTo(960 + 150, cy);
        ctx.fill();
        ctx.restore();
      }
    }
  });

  // Pillar cards with flowing connectors to the stack
  const cw = STAGE.cardWidth;
  PILLARS.forEach((pl, i) => {
    const p = ease.outExpo(seg(t, pl.at, pl.at + 0.6));
    if (p <= 0) return;
    const hEst = 6 * U + 5.5 * U + 1.6 * U + 5.9 * U * 1.2;
    const baseX = i === 0 ? STAGE.left : i === 1 ? STAGE.left + STAGE.width - cw : 960 - cw / 2;
    const baseY = i === 2 ? STAGE.cardBottom - hEst : STAGE.cardY;
    const x = baseX + pl.from[0] * (1 - p);
    const y = baseY + pl.from[1] * (1 - p);
    // connector
    const ax = i === 0 ? x + cw : i === 1 ? x : x + cw / 2;
    const ay = i === 2 ? y : y + hEst / 2;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = -t * 60;
    ctx.strokeStyle = cyan(0.45);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    // ends at the stack corner facing the card (diamond half-diagonal = side·√2/2)
    const d = (STAGE.plateSide * Math.SQRT2) / 2;
    const [tx, ty] =
      i === 0
        ? [960 - d, STAGE.plateY[1]]
        : i === 1
          ? [960 + d, STAGE.plateY[1]]
          : [960, STAGE.plateY[0] + d / 2];
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.restore();
    drawCard(ctx, x, y, cw, p, pl);
  });

  ctx.restore();

  drawCaption(ctx, t, {
    tIn: 13.05,
    tOut: 13.95,
    eyebrow: "05 — THE RIGHT SPECIALISTS",
    title: "The right specialists.",
  });
}
