/**
 * 04 ONE PARTNER (7 – 11 s)
 * The implosion ignites the QuintByte core: shockwave, then ten service nodes swirl out
 * into orbit with light trails while connectors draw and signals flow. The whole system
 * then tilts in 3-D into the exact isometric projection of the next scene — the core
 * disc morphs into the ecosystem's bottom plate and the inner ring into its glow ring.
 */
import { C, cyan } from "../core/brand.mjs";
import { CX, CY, W, drawMark, drawNodeCard, drawWordmark, roundRect } from "../core/draw.mjs";
import { drawCaption } from "../core/caption.mjs";
import { TAU, clamp, deg, ease, lerp, seg, spring } from "../core/math.mjs";
import { STAGE } from "./stage.mjs";

const R = 350; // orbit radius in plane units
const NODE_W = 150;
const NODES = [
  ["person", "Executive\nSupport"],
  ["bar_chart", "CRM & Sales"],
  ["campaign", "Marketing"],
  ["palette", "Creative"],
  ["computer", "IT & Tech"],
  ["smart_toy", "AI &\nAutomation"],
  ["database", "Finance"],
  ["groups", "HR & People"],
  ["forum", "Customer\nSupport"],
  ["settings", "Operations"],
];

const launchAt = (i) => 7.16 + i * 0.07;

/** Camera: tilt 0 → 1 takes the flat orbit to the ecosystem's isometric plane */
function camera(t) {
  const tilt = ease.inOutCubic(seg(t, 8.95, 10.75));
  return {
    tilt,
    rz: deg(45) * tilt,
    sq: 1 - 0.5 * tilt, // cos(60°) at full tilt, same squash as the site's scaleY(.5)
    // Slides right to make room for the caption, then glides back to centre as it tilts
    cx: CX + 360 * ease.inOutCubic(seg(t, 7.75, 8.45)) * (1 - tilt),
    cy: lerp(CY, STAGE.ringY, tilt),
  };
}

function project(cam, x, y) {
  const c = Math.cos(cam.rz);
  const s = Math.sin(cam.rz);
  const rx = x * c - y * s;
  const ry = x * s + y * c;
  return [cam.cx + rx, cam.cy + ry * cam.sq, ry];
}

/** Draw in plane space: callback receives a context already rotated + squashed */
function inPlane(ctx, cam, cx, cy, fn) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, cam.sq);
  ctx.rotate(cam.rz);
  fn(ctx);
  ctx.restore();
}

function nodePlanePos(i, t) {
  const spin = 0.16 * Math.max(0, t - 7.7);
  const target = deg(-90 + i * 36) + spin;
  const e = ease.outExpo(seg(t, launchAt(i), launchAt(i) + 0.7));
  const a = target - (1 - e) * 1.5;
  return { x: Math.cos(a) * R * e, y: Math.sin(a) * R * e, e };
}

export function orbit(ctx, t) {
  if (t < 6.95 || t > 11.25) return;
  const cam = camera(t);
  const morph = ease.inOutCubic(seg(t, 10.25, 11.0));
  const birth = spring(t - 7.0, 2.1, 0.5);

  // Background glow (the site's hero gradient)
  const g = ctx.createRadialGradient(cam.cx, cam.cy, 0, cam.cx, cam.cy, 1000);
  g.addColorStop(0, cyan(0.14 * birth));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 1080);

  // Polar grid on the plane — makes the 3-D tilt legible
  inPlane(ctx, cam, cam.cx, cam.cy, (p) => {
    p.globalAlpha = clamp(seg(t, 7.3, 8.0)) * (1 - morph);
    p.strokeStyle = cyan(0.07);
    p.lineWidth = 1;
    for (let rr = 150; rr <= 1050; rr += 150) {
      p.beginPath();
      p.arc(0, 0, rr, 0, TAU);
      p.stroke();
    }
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * TAU;
      p.beginPath();
      p.moveTo(Math.cos(a) * 150, Math.sin(a) * 150);
      p.lineTo(Math.cos(a) * 1050, Math.sin(a) * 1050);
      p.stroke();
    }
  });

  // Shockwave from the ignition
  const sw = seg(t, 7.0, 7.85);
  if (sw > 0 && sw < 1) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = cyan(0.8 * (1 - sw));
    ctx.lineWidth = 2 + 26 * (1 - sw);
    ctx.beginPath();
    ctx.arc(CX, CY, 40 + 1150 * ease.outExpo(sw), 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  // Rings: outer dashed (rotating) and inner solid → the ecosystem glow ring
  inPlane(ctx, cam, cam.cx, cam.cy, (p) => {
    const ringIn = ease.outExpo(seg(t, 7.3, 8.1));
    p.save();
    p.globalAlpha = ringIn * (1 - clamp(seg(t, 9.7, 10.5)));
    p.setLineDash([7, 12]);
    p.lineDashOffset = -t * 30;
    p.strokeStyle = cyan(0.22);
    p.lineWidth = 1.5;
    p.beginPath();
    p.arc(0, 0, R * 1.2 * ringIn, 0, TAU);
    p.stroke();
    p.restore();

    const half = lerp(R * 0.9, STAGE.ringSide / 2, morph);
    const corner = lerp(R * 0.9, STAGE.ringCorner, morph);
    p.save();
    p.globalAlpha = ringIn;
    p.shadowColor = cyan(0.2 + 0.5 * morph);
    p.shadowBlur = 10 + 40 * morph;
    p.strokeStyle = cyan(0.2 + 0.35 * morph);
    p.lineWidth = 1.5 + morph;
    roundRect(
      p,
      -half * ringIn,
      -half * ringIn,
      half * 2 * ringIn,
      half * 2 * ringIn,
      corner * ringIn,
    );
    p.stroke();
    p.restore();
  });

  // Nodes, connectors, trails and signals
  const exitAt = (i) => 9.95 + i * 0.035;
  const nodes = NODES.map(([icon, label], i) => {
    const pp = nodePlanePos(i, t);
    const [sx, sy, depth] = project(cam, pp.x, pp.y);
    const ex = ease.inCubic(seg(t, exitAt(i), exitAt(i) + 0.5));
    return { i, icon, label, pp, sx, sy: sy - ex * 420, depth, ex };
  });

  const [coreX, coreY] = [cam.cx, lerp(cam.cy, STAGE.plateY[0], morph)];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const n of nodes) {
    if (n.pp.e <= 0 || n.ex >= 1) continue;
    const a0 = Math.atan2(n.pp.y, n.pp.x);
    const [ix, iy] = project(cam, Math.cos(a0) * 150 * birth, Math.sin(a0) * 150 * birth);
    // Connector
    const lg = ctx.createLinearGradient(ix, iy, n.sx, n.sy);
    lg.addColorStop(0, cyan(0.55 * (1 - n.ex)));
    lg.addColorStop(1, cyan(0.06));
    ctx.strokeStyle = lg;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(lerp(ix, n.sx, 1 - n.ex), lerp(iy, n.sy, 1 - n.ex));
    ctx.stroke();
    // Light trail while in flight
    if (n.pp.e < 0.995) {
      ctx.lineCap = "round";
      for (let k = 1; k <= 10; k++) {
        const a = nodePlanePos(n.i, t - (k - 1) * 0.016);
        const b = nodePlanePos(n.i, t - k * 0.016);
        const [ax, ay] = project(cam, a.x, a.y);
        const [bx, by] = project(cam, b.x, b.y);
        ctx.strokeStyle = cyan(0.55 * (1 - k / 11) * (1 - n.pp.e * 0.6));
        ctx.lineWidth = 14 * (1 - k / 11);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }
    // Signal travelling from the core to the node
    const f = ((((t - 7.95 - n.i * 0.24) % 2.4) + 2.4) % 2.4) / 0.75;
    if (t > 7.95 && f < 1 && n.ex === 0) {
      const px = lerp(ix, n.sx, f);
      const py = lerp(iy, n.sy, f);
      const sg = ctx.createRadialGradient(px, py, 0, px, py, 14);
      sg.addColorStop(0, "rgba(220,248,255,0.95)");
      sg.addColorStop(1, "rgba(34,199,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(px - 14, py - 14, 28, 28);
    }
  }
  ctx.restore();

  // Core disc → morphs into the ecosystem's bottom plate
  inPlane(ctx, cam, coreX, coreY, (p) => {
    const half = lerp(150, STAGE.plateSide / 2, morph) * birth;
    const corner = lerp(150, STAGE.plateCorner, morph) * birth;
    if (half <= 0.5) return;
    p.shadowColor = cyan(0.45);
    p.shadowBlur = 60;
    roundRect(p, -half, -half, half * 2, half * 2, corner);
    const dg = p.createRadialGradient(0, -half * 0.2, 0, 0, 0, half * 1.1);
    dg.addColorStop(0, "#0e3a58");
    dg.addColorStop(0.55, "#071a2a");
    dg.addColorStop(1, "#040a12");
    p.fillStyle = morph < 1 ? dg : "#050d16";
    p.fill();
    if (morph > 0) {
      p.globalAlpha = morph;
      p.fillStyle = "#050d16";
      p.fill();
      p.globalAlpha = 1;
    }
    p.shadowBlur = 0;
    p.strokeStyle = cyan(0.55 - 0.1 * morph);
    p.lineWidth = 1.5;
    p.stroke();
  });

  // Mark on the core: upright, squashing onto the plane as it tilts, gone by the morph
  const logoA = birth * (1 - clamp(seg(t, 10.2, 10.6)));
  if (logoA > 0.01) {
    ctx.save();
    ctx.globalAlpha = clamp(logoA);
    ctx.translate(coreX, coreY);
    ctx.scale(birth, birth * cam.sq);
    ctx.shadowColor = cyan(0.85);
    ctx.shadowBlur = 26;
    drawMark(ctx, 0, -14, 120, { accent: C.accent, ink: C.accent });
    ctx.shadowBlur = 0;
    drawWordmark(ctx, 0, 70, 26, { accent: C.logoCyan, ink: C.ink });
    ctx.restore();
  }

  // Node cards, back to front
  for (const n of [...nodes].sort((a, b) => a.sy - b.sy)) {
    if (n.pp.e <= 0 || n.ex >= 1) continue;
    const scale = (0.35 + 0.65 * n.pp.e) * (1 + (n.depth / R) * 0.12 * cam.tilt) * (1 - n.ex * 0.4);
    const hover = n.pp.e > 0.98 ? 0.18 + 0.12 * Math.max(0, Math.sin(t * 3 + n.i)) : 0.35;
    drawNodeCard(ctx, n.sx, n.sy, NODE_W * scale, n.icon, n.label, {
      glow: hover,
      alpha: clamp(n.pp.e * 3) * (1 - n.ex),
    });
  }

  drawCaption(ctx, t, {
    tIn: 8.35,
    tOut: 9.85,
    eyebrow: "04 — ONE PARTNER",
    title: "One business partner.",
  });
}
