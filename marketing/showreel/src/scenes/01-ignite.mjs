/**
 * 01 IGNITE (0 – 2 s)
 * A single cyan point wakes up, a HUD scanner line calibrates, and 1,400 particles
 * spiral into the core, which detonates on the downbeat at 2.0 s.
 */
import { cyan } from "../core/brand.mjs";
import { CX, CY, W, hud } from "../core/draw.mjs";
import { TAU, clamp, ease, rng, seg } from "../core/math.mjs";

const N = 1400;
const r = rng(11);
const particles = Array.from({ length: N }, () => ({
  a0: r() * TAU,
  r0: 520 + r() ** 0.6 * 900,
  spin: (0.55 + r() * 0.9) * (r() < 0.85 ? 1 : -1),
  delay: r() * 0.55,
  hot: r() < 0.22,
  width: 0.8 + r() * 1.6,
}));

function particleAt(p, q) {
  const e = ease.inCubic(q);
  const a = p.a0 + p.spin * e * e * TAU * 1.1;
  const rad = p.r0 * (1 - e);
  return [CX + Math.cos(a) * rad, CY + Math.sin(a) * rad * 0.82];
}

export function ignite(ctx, t) {
  if (t > 2.06) return;

  // Ambient glow that gathers with the particles
  const gather = ease.inCubic(seg(t, 0.3, 2.0));
  const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 900);
  g.addColorStop(0, cyan(0.04 + gather * 0.32));
  g.addColorStop(0.4, cyan(0.02 + gather * 0.08));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 1080);

  // HUD scanner line with ticks and readouts
  const ext = ease.outExpo(seg(t, 0.3, 1.05)) * (1 - ease.inExpo(seg(t, 1.35, 1.8)));
  if (ext > 0.001) {
    const half = 760 * ext;
    const lg = ctx.createLinearGradient(CX - half, 0, CX + half, 0);
    lg.addColorStop(0, "rgba(34,199,255,0)");
    lg.addColorStop(0.5, cyan(0.85));
    lg.addColorStop(1, "rgba(34,199,255,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(CX - half, CY - 0.75, half * 2, 1.5);
    ctx.fillStyle = cyan(0.35);
    for (let x = -760; x <= 760; x += 38) {
      if (Math.abs(x) > half) continue;
      const major = x % 190 === 0;
      ctx.fillRect(CX + x - 0.5, CY + 10, 1, major ? 16 : 7);
    }
    ctx.save();
    ctx.globalAlpha = clamp(ext * 2);
    hud(ctx, "QB—SYS // INITIALISING CORE", CX - half, CY - 22, { color: cyan(0.8) });
    const pct = String(Math.round(100 * seg(t, 0.35, 1.8))).padStart(3, "0");
    hud(ctx, `CALIBRATING ${pct}%`, CX + half, CY - 22, { align: "right", color: cyan(0.8) });
    hud(
      ctx,
      `X ${(t * 1234.5).toFixed(1).padStart(7, "0")}   Y ${(t * 987.6).toFixed(1).padStart(7, "0")}`,
      CX - half,
      CY + 52,
      {
        color: "rgba(201,212,220,0.45)",
        size: 13,
      },
    );
    ctx.restore();
  }

  // Particles — batched into a few strokes by colour/alpha bucket for speed
  const buckets = new Map();
  for (const p of particles) {
    const start = 0.3 + p.delay;
    const q = seg(t, start, 1.97);
    if (q <= 0 || q >= 1) continue;
    const q0 = seg(t - 0.045, start, 1.97);
    const [x1, y1] = particleAt(p, q);
    const [x0, y0] = particleAt(p, q0);
    const alpha = Math.round(clamp(seg(t, start, start + 0.35)) * (0.3 + 0.7 * q) * 4) / 4;
    if (alpha <= 0) continue;
    const key = `${p.hot ? 1 : 0}|${alpha}|${p.width > 1.6 ? 2 : 1}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(x0, y0, x1, y1);
  }
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  for (const [key, segs] of buckets) {
    const [hot, alpha, wide] = key.split("|");
    ctx.strokeStyle = hot === "1" ? `rgba(220,248,255,${alpha})` : cyan(+alpha);
    ctx.lineWidth = wide === "2" ? 2.2 : 1.2;
    ctx.beginPath();
    for (let i = 0; i < segs.length; i += 4) {
      ctx.moveTo(segs[i], segs[i + 1]);
      ctx.lineTo(segs[i + 2], segs[i + 3]);
    }
    ctx.stroke();
  }
  ctx.restore();

  // The core: a pinpoint that swells, then detonates at 2.0 s
  const wake = ease.outBack(seg(t, 0.12, 0.45));
  const swell = ease.inExpo(seg(t, 1.55, 2.0));
  const coreR = 2.5 * wake + 60 * swell;
  if (coreR > 0.1) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR * 7 + 40 * wake);
    cg.addColorStop(0, "rgba(255,255,255,1)");
    cg.addColorStop(0.08, cyan(0.95));
    cg.addColorStop(0.35, cyan(0.25));
    cg.addColorStop(1, "rgba(34,199,255,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(CX, CY, coreR * 7 + 40 * wake, 0, TAU);
    ctx.fill();
    // Anamorphic flare through the core as it charges
    const flare = 0.25 + swell * 0.75;
    const fg = ctx.createLinearGradient(0, 0, W, 0);
    fg.addColorStop(0, "rgba(34,199,255,0)");
    fg.addColorStop(0.5, cyan(0.55 * flare * wake));
    fg.addColorStop(1, "rgba(34,199,255,0)");
    ctx.fillStyle = fg;
    ctx.fillRect(0, CY - 1.5 - swell * 3, W, 3 + swell * 6);
    ctx.restore();
  }
}
