/**
 * 03 THE WORK BEHIND (3.8 – 7 s)
 * The debris of "moving parts." becomes the everyday work of a business: chips burst out,
 * ricochet around the frame over parallax marquees, badges pile up. Time freezes, the
 * frame racks focus onto "You shouldn't have to manage all of them alone." — then
 * everything is sucked into a single point.
 */
import { createCanvas } from "@napi-rs/canvas";
import { C, cyan, font } from "../core/brand.mjs";
import { CX, CY, H, W, drawChip, layout, text } from "../core/draw.mjs";
import { TAU, clamp, ease, reflect, rng, seg } from "../core/math.mjs";

const CHIPS = [
  ["Inbox", "inbox", true],
  ["Payroll", "payments", false],
  ["Leads", "person_add", true],
  ["Meetings", "calendar_month", true],
  ["Follow-ups", "reply", false],
  ["CRM", "contacts", true],
  ["Reports", "analytics", false],
  ["Customers", "groups", true],
  ["Contracts", "contract", false],
  ["IT & Systems", "dns", true],
  ["Marketing", "campaign", false],
  ["Documents", "description", true],
  ["Expenses", "receipt_long", false],
  ["Processes", "account_tree", true],
  ["Projects", "folder", true],
];
const BADGED = { Inbox: 3, "Follow-ups": 2, CRM: 1, Leads: 4 };

const FREEZE = 5.75;
const IMPLODE = [6.62, 6.99];
/** Time-remap: real time until the freeze, then a crawl */
const clock = (t) => (t < FREEZE ? t : FREEZE + (t - FREEZE) * 0.06);

const r = rng(42);
// Every label appears twice, the second time in the opposite chip style
const chips = [...CHIPS, ...CHIPS.map(([l, ic, light]) => [l, ic, !light])]
  .map(([label, icon, light], i) => {
    const a = r() * TAU;
    const speed = 1200 + r() * 900;
    const drift = 200 + r() * 220;
    const depth = 0.85 + r() * 0.75;
    return {
      label,
      icon,
      light,
      spawn: 3.84 + i * 0.062,
      ox: CX + (r() - 0.5) * 360,
      oy: CY + 120 + (r() - 0.5) * 120,
      v: [Math.cos(a) * speed, Math.sin(a) * speed * 0.8],
      d: [Math.cos(a + 0.6) * drift, Math.sin(a + 0.6) * drift],
      rot0: (r() - 0.5) * 0.6,
      spin: (r() - 0.5) * 0.9,
      depth,
      spinDir: r() < 0.5 ? -1 : 1,
    };
  })
  .sort((a, b) => a.depth - b.depth);

function chipState(c, t) {
  const te = clock(t);
  const tau = te - c.spawn;
  if (tau < 0) return null;
  const k = 2.6;
  const decayed = (1 - Math.exp(-k * tau)) / k;
  const mx = 170 * c.depth;
  const my = 90 * c.depth;
  const x = reflect(c.ox + c.d[0] * tau + (c.v[0] - c.d[0]) * decayed, mx, W - mx);
  const y = reflect(c.oy + c.d[1] * tau + (c.v[1] - c.d[1]) * decayed, my + 60, H - my - 60);
  return {
    x,
    y,
    rot: c.rot0 + c.spin * tau,
    scale: c.depth * ease.outBack(clamp(tau / 0.32)),
  };
}

const layer = createCanvas(W, H);
const MARQUEE = "INBOX • PAYROLL • LEADS • REPORTS • MEETINGS • CRM • CONTRACTS • EXPENSES • ";

export function chaos(ctx, t) {
  if (t < 3.8 || t > 7.05) return;
  const te = clock(t);
  const freeze = ease.inOutCubic(seg(t, FREEZE, FREEZE + 0.3));
  const imp = ease.inCubic(seg(t, ...IMPLODE));
  const intro = clamp(seg(t, 3.8, 4.1));

  // Parallax outline marquees, accelerating with the chaos
  ctx.save();
  ctx.globalAlpha = intro * (1 - imp);
  ctx.font = font(800, 210);
  ctx.lineWidth = 1.5;
  const mw = ctx.measureText(MARQUEE).width;
  [
    [250, 1, 380],
    [560, -1, 520],
    [870, 1, 300],
  ].forEach(([y, dir, speed], row) => {
    const accel = 1 + 2.2 * ease.inQuad(seg(te, 4.2, FREEZE));
    const off = (te * speed * accel * dir + row * 700) % mw;
    ctx.strokeStyle = cyan(0.07 + row * 0.015);
    for (let x = off - mw; x < W + mw; x += mw) ctx.strokeText(MARQUEE, x, y + 75);
  });
  ctx.restore();

  // Chips into their own layer so the freeze can defocus them in one pass
  const l = layer.getContext("2d");
  l.clearRect(0, 0, W, H);
  for (const c of chips) {
    const s = chipState(c, t);
    if (!s) continue;
    let { x, y, rot, scale } = s;
    if (imp > 0) {
      x += (CX - x) * imp;
      y += (CY - y) * imp;
      rot += c.spinDir * imp * 4;
      scale *= 1 - imp;
    }
    if (scale <= 0.01) continue;
    const badge = BADGED[c.label]
      ? Math.min(99, BADGED[c.label] + Math.floor(Math.max(0, te - c.spawn) * 11))
      : 0;
    l.save();
    l.globalAlpha = 0.8 + 0.2 * clamp((c.depth - 0.85) / 0.75);
    l.translate(x, y);
    l.rotate(rot);
    drawChip(l, 0, 0, c.label, c.icon, { light: c.light, scale, badge });
    l.restore();
  }
  ctx.save();
  if (freeze > 0)
    ctx.filter = `blur(${(freeze * 7 * (1 - imp)).toFixed(1)}px) saturate(${1 - freeze * 0.6})`;
  ctx.globalAlpha = 1 - freeze * 0.45;
  ctx.drawImage(layer, 0, 0);
  ctx.restore();

  // Implosion streaks towards the core
  if (imp > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const rr = rng(5);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 90; i++) {
      const a = rr() * TAU;
      const d0 = (1 - imp) * (500 + rr() * 900);
      const d1 = d0 + 60 + rr() * 220 * (1 - imp);
      ctx.strokeStyle = cyan(0.5 * imp);
      ctx.beginPath();
      ctx.moveTo(CX + Math.cos(a) * d0, CY + Math.sin(a) * d0);
      ctx.lineTo(CX + Math.cos(a) * d1, CY + Math.sin(a) * d1);
      ctx.stroke();
    }
    const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 160 * imp + 1);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.3, cyan(0.6));
    g.addColorStop(1, "rgba(34,199,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(CX - 200, CY - 200, 400, 400);
    ctx.restore();
  }

  // The freeze-frame line, rising out of masks
  const lines = [
    { str: "You shouldn't have to manage", t0: FREEZE + 0.08 },
    { str: "all of them alone.", t0: FREEZE + 0.2 },
  ];
  const size = 92;
  const f = font(800, size);
  lines.forEach((ln, i) => {
    const p = ease.outExpo(seg(t, ln.t0, ln.t0 + 0.6));
    if (p <= 0) return;
    const lay = layout(ctx, ln.str, f, -size * 0.03);
    const y = CY - 30 + i * (size * 1.08);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y - size, W, size * 1.3);
    ctx.clip();
    const s = 1 + imp * 0.25;
    ctx.translate(CX, y - size * 0.3);
    ctx.scale(s, s);
    ctx.globalAlpha = 1 - imp;
    const dy = (1 - p) * size * 1.1;
    if (i === 1) {
      const before = "all of them ";
      const bw = layout(ctx, before, f, -size * 0.03).width;
      text(ctx, before, -lay.width / 2, size * 0.3 + dy, { f, tracking: -size * 0.03 });
      text(ctx, "alone.", -lay.width / 2 + bw, size * 0.3 + dy, {
        f,
        tracking: -size * 0.03,
        color: C.accent,
      });
    } else {
      text(ctx, ln.str, -lay.width / 2, size * 0.3 + dy, { f, tracking: -size * 0.03 });
    }
    ctx.restore();
  });
}
