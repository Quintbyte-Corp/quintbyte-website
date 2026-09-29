/**
 * 06 CLEAR ACCOUNTABILITY (14.3 – 17 s)
 * Whip-pan into a tracking shot along the six-step process. The camera snaps from
 * station to station on the eighth notes; each step's word slot-rolls in, its node
 * fires on the track. Then a pull-back reveals the whole line, lit end to end.
 */
import { C, cyan, font } from "../core/brand.mjs";
import { CX, CY, W, drawIcon, layout, roundRect, text } from "../core/draw.mjs";
import { drawCaption } from "../core/caption.mjs";
import { TAU, clamp, ease, lerp, seg } from "../core/math.mjs";

// Same six steps and copy as the website's How It Works
const STEPS = [
  ["01", "UNDERSTAND", "search", "We identify what your", "business actually needs."],
  ["02", "SCOPE", "description", "We define responsibilities,", "skills, outputs, requirements."],
  [
    "03",
    "CONFIRM",
    "task_alt",
    "We confirm capability, capacity,",
    "pricing, and delivery conditions.",
  ],
  ["04", "ASSIGN", "groups", "We connect the work with the", "appropriate specialist."],
  ["05", "DELIVER", "play_circle", "We perform the work while", "coordinating delivery."],
  ["06", "REVIEW", "visibility", "We maintain visibility and", "review the work."],
];
const SP = 820; // world distance between stations
const hitAt = (i) => 14.75 + i * 0.3;
const WORD = font(800, 104);

/** Whip-pan into the scene (also read by the smear pass) */
export const whipIn = (t) => W * 1.3 * (1 - ease.outExpo(seg(t, 14.3, 14.74)));

function camera(t) {
  let x = 0;
  for (let i = 0; i < STEPS.length - 1; i++) {
    // Hold on each station, then snap to the next just as it fires
    const f = ease.inOutQuart(seg(t, hitAt(i) + 0.15, hitAt(i + 1) + 0.03));
    x += f * SP;
  }
  const pull = ease.inOutCubic(seg(t, 16.3, 16.62));
  const collapse = ease.inExpo(seg(t, 16.88, 17.04));
  return {
    follow: x,
    x: lerp(x, SP * 2.5, pull),
    z: lerp(1, 0.33, pull) * (1 - collapse),
    y: lerp(0, 40, pull),
    pull,
    collapse,
  };
}

export function processScene(ctx, t) {
  if (t < 14.3 || t > 17.05) return;
  const cam = camera(t);
  ctx.save();
  ctx.translate(whipIn(t), 0);
  ctx.translate(CX, CY + cam.y);
  ctx.rotate(cam.collapse * 0.5);
  ctx.globalAlpha = 1 - cam.collapse * 0.6;

  // Giant outline numbers drifting behind at half speed (parallax)
  ctx.save();
  ctx.font = font(800, 620);
  ctx.textAlign = "center";
  ctx.lineWidth = 2;
  STEPS.forEach(([num], i) => {
    const x = (i * SP - cam.x) * 0.5 * cam.z;
    if (Math.abs(x) > 1400) return;
    ctx.strokeStyle = cyan(0.045 + 0.04 * clamp(seg(t, hitAt(i) - 0.05, hitAt(i) + 0.2)));
    ctx.strokeText(num, x, 220 * cam.z);
  });
  ctx.restore();

  ctx.scale(cam.z, cam.z);
  ctx.translate(-cam.x, 0);

  // Track, progress and head
  const TRACK_Y = 215;
  ctx.fillStyle = "rgba(201,212,220,0.16)";
  ctx.fillRect(-2600, TRACK_Y - 1, SP * 5 + 5200, 2);
  const headX = lerp(cam.follow, SP * 5, cam.pull);
  const pg = ctx.createLinearGradient(headX - 1600, 0, headX, 0);
  pg.addColorStop(0, "rgba(34,199,255,0)");
  pg.addColorStop(1, cyan(0.95));
  ctx.fillStyle = pg;
  ctx.fillRect(-2600, TRACK_Y - 1.5, headX + 2600, 3);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const hg = ctx.createRadialGradient(headX, TRACK_Y, 0, headX, TRACK_Y, 60);
  hg.addColorStop(0, "rgba(220,248,255,0.95)");
  hg.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = hg;
  ctx.fillRect(headX - 60, TRACK_Y - 60, 120, 120);
  ctx.restore();

  STEPS.forEach(([num, word, icon, l1, l2], i) => {
    const X = i * SP;
    const on = ease.outExpo(seg(t, hitAt(i) - 0.05, hitAt(i) + 0.35));
    const screenDist = Math.abs(X - cam.x) * cam.z;
    const focus = cam.pull > 0 ? 1 : 1 - clamp(screenDist / 1300);
    const dim = 0.28 + 0.72 * Math.max(focus, cam.pull);

    ctx.save();
    ctx.globalAlpha *= dim;

    // Number pill — fills cyan when the step fires
    const pw = 116;
    const ph = 58;
    roundRect(ctx, X - pw / 2, -300, pw, ph, ph / 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = on > 0.5 ? C.accent : "rgba(201,212,220,0.3)";
    ctx.stroke();
    if (on > 0) {
      ctx.save();
      ctx.globalAlpha *= on;
      ctx.shadowColor = cyan(0.7);
      ctx.shadowBlur = 30;
      ctx.fillStyle = C.accent;
      ctx.fill();
      ctx.restore();
    }
    text(ctx, num, X, -300 + ph / 2 + 2, {
      f: font(700, 30, "Mono"),
      align: "center",
      base: "middle",
      color: on > 0.5 ? "#03131c" : C.mute2,
    });

    // Icon
    ctx.save();
    const is = 104 * (0.8 + 0.2 * ease.outBack(clamp(on)));
    if (on > 0) {
      ctx.shadowColor = cyan(0.6 * on);
      ctx.shadowBlur = 26;
    }
    drawIcon(ctx, icon, X, -160, is, on > 0.3 ? C.accent : "rgba(183,195,204,0.45)");
    ctx.restore();

    // The word slot-rolls in, letter by letter
    const lay = layout(ctx, word, WORD, 3);
    lay.glyphs.forEach((g, k) => {
      const p = ease.outExpo(seg(t, hitAt(i) - 0.04 + k * 0.014, hitAt(i) + 0.2 + k * 0.014));
      if (p <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(X - lay.width / 2 + g.x - 4, -85, g.w + 8, 118);
      ctx.clip();
      text(ctx, g.ch, X - lay.width / 2 + g.x, 18 + (1 - p) * 118, { f: WORD, tracking: 3 });
      ctx.restore();
    });

    // Summary
    ctx.globalAlpha *= clamp(seg(t, hitAt(i) + 0.08, hitAt(i) + 0.3));
    text(ctx, l1, X, 88, { f: font(500, 27), color: C.mute, align: "center" });
    text(ctx, l2, X, 124, { f: font(500, 27), color: C.mute, align: "center" });
    ctx.restore();

    // Node on the track, with a ring pulse as it fires
    ctx.beginPath();
    ctx.arc(X, TRACK_Y, 11, 0, TAU);
    ctx.fillStyle = on > 0.2 ? C.accent : "#0c131c";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = on > 0.2 ? "#bff1ff" : "rgba(201,212,220,0.35)";
    ctx.stroke();
    const ring = seg(t, hitAt(i), hitAt(i) + 0.5);
    if (ring > 0 && ring < 1) {
      ctx.beginPath();
      ctx.arc(X, TRACK_Y, 11 + ring * 70, 0, TAU);
      ctx.strokeStyle = cyan(0.7 * (1 - ring));
      ctx.stroke();
    }
  });
  ctx.restore();

  drawCaption(ctx, t, {
    tIn: 16.28,
    tOut: 16.86,
    eyebrow: "06 — CLEAR ACCOUNTABILITY",
    title: "Clear accountability.",
  });
}
