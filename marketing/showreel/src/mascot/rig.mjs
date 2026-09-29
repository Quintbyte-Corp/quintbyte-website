/**
 * "QB" — the QuintByte mascot, rigged from the official mark.
 *
 * Anatomy (all in the logo SVG's own coordinate space):
 *  - Head/body: the q and b bowls, drawn from the official paths. Nothing is redrawn.
 *  - Eyes: the two counters (r ≈ 40) get pupils, so the mark reads as a face.
 *  - Left leg: the q's descender. At rest it IS the descender; when alive it articulates.
 *  - Right leg, arms: new strokes in the same weight family as the letter stems.
 *  - Antenna: the b's ascender, with a signal orb above it.
 * Colour follows the mark's two-tone split: the q side is light ink, the b side is cyan.
 *
 * Every limb is a two-bone chain solved with analytic IK, so feet and hands can be placed
 * anywhere and elbows/knees fall out naturally — the same rig will drive the animation.
 */
import { Path2D } from "@napi-rs/canvas";
import { C, cyan, logo } from "../core/brand.mjs";

export const RIG = {
  ground: 331, // bottom of the q descender = where the feet stand
  pivot: [184, 250], // body squash/tilt pivot: between the bowls, at their base
  eyes: [
    [116, 192.5],
    [251, 191],
  ],
  eyeR: 40,
  hips: [
    [168.5, 246], // exactly on the q descender
    [240, 250],
  ],
  shoulders: [
    [62, 202],
    [305, 198],
  ],
  antennaTop: [199.5, 53],
  leg: { thigh: 39, shin: 39, width: [29, 22] },
  arm: { upper: 40, fore: 38, width: [14, 12] },
};

const INK = C.ink;
const CYAN = C.logoCyan;

// The q path without its descender (the descender is re-drawn as an articulated leg)
const DESCENDER_CLIP = (() => {
  const p = new Path2D();
  p.rect(-1000, -1000, 3000, 3000);
  p.rect(149, 251, 40, 100);
  return p;
})();

/** Apply the body transform (lift, tilt and squash about the pivot) to a point */
export function bodyPoint(pose, [x, y]) {
  const [px, py] = RIG.pivot;
  const [sx, sy] = pose.squash ?? [1, 1];
  const a = pose.tilt ?? 0;
  const dx = (x - px) * sx;
  const dy = (y - py) * sy;
  return [
    px + dx * Math.cos(a) - dy * Math.sin(a) + (pose.shift ?? 0),
    py + dx * Math.sin(a) + dy * Math.cos(a) - (pose.lift ?? 0),
  ];
}

/**
 * Two-bone IK: from root towards target with bone lengths a, b.
 * `bend` (+1 / -1) picks which side the joint folds to. Returns [joint, end].
 */
export function solve2(root, target, a, b, bend = 1) {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const d = Math.min(Math.hypot(dx, dy), a + b - 0.001);
  const base = Math.atan2(dy, dx);
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const ang = base - bend * Math.acos(Math.max(-1, Math.min(1, cosA)));
  const joint = [root[0] + Math.cos(ang) * a, root[1] + Math.sin(ang) * a];
  const end = [root[0] + Math.cos(base) * d, root[1] + Math.sin(base) * d];
  return [joint, end];
}

function glowStroke(ctx, color, width, glow = 10) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = color === INK ? "rgba(190,235,255,0.55)" : cyan(0.75);
  ctx.shadowBlur = glow;
}

function drawLeg(ctx, pose, i, spec) {
  const hip = bodyPoint(pose, RIG.hips[i]);
  const grow = spec.grow ?? 1;
  const L = RIG.leg;
  const target = [lerp(hip[0], spec.foot[0], grow), lerp(hip[1] + 1, spec.foot[1], grow)];
  const [knee, foot] = solve2(hip, target, L.thigh * grow, L.shin * grow, spec.bend ?? 1);
  const color = i === 0 ? INK : CYAN;
  ctx.save();
  glowStroke(ctx, color, L.width[0]);
  ctx.beginPath();
  ctx.moveTo(hip[0], hip[1] - (i === 0 ? 14 : 0));
  ctx.lineTo(hip[0], hip[1]);
  ctx.lineTo(knee[0], knee[1]);
  ctx.stroke();
  glowStroke(ctx, color, L.width[1]);
  ctx.beginPath();
  ctx.moveTo(knee[0], knee[1]);
  ctx.lineTo(foot[0], foot[1]);
  ctx.stroke();
  // Foot: a rounded sole, pointing the way the character faces
  if (grow > 0.6) {
    const dir = spec.facing ?? 1;
    const toe = spec.toe ?? 0;
    ctx.save();
    ctx.translate(foot[0], foot[1]);
    ctx.rotate(toe);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-13 + dir * 4, -2, 30, 13, 6.5);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawArm(ctx, pose, i, spec) {
  const sh = bodyPoint(pose, RIG.shoulders[i]);
  const grow = spec.grow ?? 1;
  const A = RIG.arm;
  const target = [lerp(sh[0], spec.hand[0], grow), lerp(sh[1], spec.hand[1], grow)];
  const [elbow, hand] = solve2(sh, target, A.upper * grow, A.fore * grow, spec.bend ?? 1);
  const color = i === 0 ? INK : CYAN;
  ctx.save();
  glowStroke(ctx, color, A.width[0]);
  ctx.beginPath();
  ctx.moveTo(sh[0], sh[1]);
  ctx.lineTo(elbow[0], elbow[1]);
  ctx.stroke();
  glowStroke(ctx, color, A.width[1]);
  ctx.beginPath();
  ctx.moveTo(elbow[0], elbow[1]);
  ctx.lineTo(hand[0], hand[1]);
  ctx.stroke();
  if (grow > 0.6) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(hand[0], hand[1], 10.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return hand;
}

function drawEyes(ctx, eyes) {
  if (!eyes || eyes.mode === "none") return;
  const [lx, ly] = eyes.look ?? [0, 0];
  const size = eyes.size ?? 1;
  const open = eyes.open ?? 1;
  const mode = eyes.mode === "dot" && open < 0.18 ? "closed" : eyes.mode;
  RIG.eyes.forEach(([cx, cy], i) => {
    // Lens tint so the counters read as eyes
    ctx.save();
    ctx.fillStyle = i === 0 ? "rgba(238,244,248,0.06)" : cyan(0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, RIG.eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "rgba(200,240,255,0.9)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = INK;
    ctx.strokeStyle = INK;
    ctx.lineCap = "round";
    if (mode === "dot") {
      ctx.beginPath();
      ctx.ellipse(cx + lx, cy + ly, 17 * size, 17 * size * open, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (mode === "happy") {
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(cx + lx, cy + ly + 12, 17, Math.PI * 1.18, Math.PI * 1.82);
      ctx.stroke();
    } else if (mode === "closed") {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx - 16 + lx, cy + ly + 2);
      ctx.quadraticCurveTo(cx + lx, cy + ly + 10, cx + 16 + lx, cy + ly + 2);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawAntennaOrb(ctx, pose) {
  const g = pose.antenna ?? 0;
  if (g <= 0) return;
  const [x, y] = bodyPoint(pose, [RIG.antennaTop[0], RIG.antennaTop[1] - 24]);
  ctx.save();
  ctx.shadowColor = cyan(0.95);
  ctx.shadowBlur = 26 * g;
  ctx.fillStyle = `rgba(143,230,255,${g})`;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  if (pose.signal) {
    ctx.shadowBlur = 8;
    ctx.strokeStyle = cyan(0.6 * g);
    ctx.lineWidth = 3;
    for (const [r, a] of [
      [20, 0.85],
      [33, 0.5],
    ]) {
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, r, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/**
 * Draw QB with its ground contact at (x, y) screen px, `scale` px per logo unit.
 * pose: { alpha, lift, tilt, shift, squash:[sx,sy], eyes:{mode,look,size,open}, legs:[..], arms:[..],
 *         antenna:0..1, signal:bool, official:bool, behind?(ctx), front?(ctx) }
 */
export function drawQB(ctx, x, y, scale, pose = {}) {
  ctx.save();
  ctx.globalAlpha *= pose.alpha ?? 1;
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-200, -RIG.ground);

  pose.behind?.(ctx);

  // Limbs sit behind the bowls so their roots tuck in
  if (!pose.official) {
    pose.legs?.forEach((spec, i) => spec && drawLeg(ctx, pose, i, spec));
    pose.arms?.forEach((spec, i) => spec && drawArm(ctx, pose, i, spec));
  }

  // The body: official paths, transformed as one piece
  ctx.save();
  const [px, py] = RIG.pivot;
  const [sx, sy] = pose.squash ?? [1, 1];
  ctx.translate(pose.shift ?? 0, -(pose.lift ?? 0));
  ctx.translate(px, py);
  ctx.rotate(pose.tilt ?? 0);
  ctx.scale(sx, sy);
  ctx.translate(-px, -py);
  ctx.shadowColor = cyan(0.5);
  ctx.shadowBlur = 16;
  ctx.save();
  if (!pose.official) ctx.clip(DESCENDER_CLIP, "evenodd");
  ctx.fillStyle = INK;
  ctx.fill(logo.mark.ink, "evenodd");
  ctx.restore();
  ctx.fillStyle = CYAN;
  ctx.fill(logo.mark.accent, "evenodd");
  ctx.shadowBlur = 0;
  drawEyes(ctx, pose.eyes);
  ctx.restore();

  drawAntennaOrb(ctx, pose);
  pose.front?.(ctx);
  ctx.restore();
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
