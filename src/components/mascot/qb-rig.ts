/**
 * QB — the QuintByte mascot, rigged from the official mark (browser canvas port of
 * marketing/showreel/src/mascot/rig.mjs; keep the two in step).
 *
 * All coordinates are in the logo SVG's own space. The q and b bowls are the official
 * paths; the counters become eyes; the q's descender is the left leg; the b's ascender
 * is an antenna. Limbs are two-bone chains solved with analytic IK.
 */
import { LOGO_CYAN, mark } from "@/components/brand/logo-paths";

export type Pt = [number, number];
export type Bend = 1 | -1;
export type LegSpec = { foot: Pt; bend: Bend; facing?: Bend; toe?: number; grow?: number };
export type ArmSpec = { hand: Pt; bend: Bend; grow?: number };
export type EyeSpec = {
  mode: "dot" | "happy" | "closed" | "none";
  look?: Pt;
  size?: number;
  open?: number;
};
export type Pose = {
  alpha?: number;
  lift?: number;
  tilt?: number;
  shift?: number;
  squash?: Pt;
  eyes?: EyeSpec;
  legs?: [LegSpec, LegSpec];
  arms?: [ArmSpec, ArmSpec];
  antenna?: number;
  signal?: boolean;
  official?: boolean;
  behind?: (ctx: CanvasRenderingContext2D) => void;
  front?: (ctx: CanvasRenderingContext2D) => void;
};

export const INK = "#eef4f8";
export const CYAN = LOGO_CYAN;
export const cyan = (a: number) => `rgba(34,199,255,${a})`;

export const RIG = {
  ground: 331,
  pivot: [184, 250] as Pt,
  eyes: [
    [116, 192.5],
    [251, 191],
  ] as Pt[],
  eyeR: 40,
  hips: [
    [168.5, 246],
    [240, 250],
  ] as Pt[],
  shoulders: [
    [62, 202],
    [305, 198],
  ] as Pt[],
  antennaTop: [199.5, 53] as Pt,
  leg: { thigh: 39, shin: 39, width: [29, 22] },
  arm: { upper: 40, fore: 38, width: [14, 12] },
};

// Path2D exists only in the browser; build lazily so the module is SSR-safe
let paths: { ink: Path2D; accent: Path2D; noDescender: Path2D } | null = null;
function getPaths() {
  if (!paths) {
    const noDescender = new Path2D();
    noDescender.rect(-1000, -1000, 3000, 3000);
    noDescender.rect(149, 251, 40, 100);
    paths = { ink: new Path2D(mark.ink), accent: new Path2D(mark.accent), noDescender };
  }
  return paths;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function bodyPoint(pose: Pose, [x, y]: Pt): Pt {
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

/** Two-bone IK: joint and end positions reaching from root toward target */
export function solve2(root: Pt, target: Pt, a: number, b: number, bend: Bend): [Pt, Pt] {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const d = Math.min(Math.hypot(dx, dy), a + b - 0.001);
  const base = Math.atan2(dy, dx);
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const ang = base - bend * Math.acos(Math.max(-1, Math.min(1, cosA)));
  return [
    [root[0] + Math.cos(ang) * a, root[1] + Math.sin(ang) * a],
    [root[0] + Math.cos(base) * d, root[1] + Math.sin(base) * d],
  ];
}

function limbStyle(ctx: CanvasRenderingContext2D, color: string, width: number) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = color === INK ? "rgba(190,235,255,0.55)" : cyan(0.75);
  ctx.shadowBlur = 10;
}

function drawLeg(ctx: CanvasRenderingContext2D, pose: Pose, i: number, spec: LegSpec) {
  const hip = bodyPoint(pose, RIG.hips[i]);
  const grow = spec.grow ?? 1;
  const L = RIG.leg;
  const target: Pt = [lerp(hip[0], spec.foot[0], grow), lerp(hip[1] + 1, spec.foot[1], grow)];
  const [knee, foot] = solve2(hip, target, L.thigh * grow, L.shin * grow, spec.bend);
  const color = i === 0 ? INK : CYAN;
  ctx.save();
  limbStyle(ctx, color, L.width[0]);
  ctx.beginPath();
  ctx.moveTo(hip[0], hip[1] - (i === 0 ? 14 : 0));
  ctx.lineTo(hip[0], hip[1]);
  ctx.lineTo(knee[0], knee[1]);
  ctx.stroke();
  limbStyle(ctx, color, L.width[1]);
  ctx.beginPath();
  ctx.moveTo(knee[0], knee[1]);
  ctx.lineTo(foot[0], foot[1]);
  ctx.stroke();
  if (grow > 0.6) {
    const dir = spec.facing ?? 1;
    ctx.translate(foot[0], foot[1]);
    ctx.rotate(spec.toe ?? 0);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-13 + dir * 4, -2, 30, 13, 6.5);
    ctx.fill();
  }
  ctx.restore();
}

function drawArm(ctx: CanvasRenderingContext2D, pose: Pose, i: number, spec: ArmSpec) {
  const sh = bodyPoint(pose, RIG.shoulders[i]);
  const grow = spec.grow ?? 1;
  const A = RIG.arm;
  const target: Pt = [lerp(sh[0], spec.hand[0], grow), lerp(sh[1], spec.hand[1], grow)];
  const [elbow, hand] = solve2(sh, target, A.upper * grow, A.fore * grow, spec.bend);
  const color = i === 0 ? INK : CYAN;
  ctx.save();
  limbStyle(ctx, color, A.width[0]);
  ctx.beginPath();
  ctx.moveTo(sh[0], sh[1]);
  ctx.lineTo(elbow[0], elbow[1]);
  ctx.stroke();
  limbStyle(ctx, color, A.width[1]);
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
}

function drawEyes(ctx: CanvasRenderingContext2D, eyes?: EyeSpec) {
  if (!eyes || eyes.mode === "none") return;
  const [lx, ly] = eyes.look ?? [0, 0];
  const size = eyes.size ?? 1;
  const open = eyes.open ?? 1;
  const mode = eyes.mode === "dot" && open < 0.18 ? "closed" : eyes.mode;
  RIG.eyes.forEach(([cx, cy], i) => {
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
    ctx.beginPath();
    if (mode === "dot") {
      ctx.ellipse(cx + lx, cy + ly, 17 * size, 17 * size * open, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (mode === "happy") {
      ctx.lineWidth = 9;
      ctx.arc(cx + lx, cy + ly + 12, 17, Math.PI * 1.18, Math.PI * 1.82);
      ctx.stroke();
    } else {
      ctx.lineWidth = 8;
      ctx.moveTo(cx - 16 + lx, cy + ly + 2);
      ctx.quadraticCurveTo(cx + lx, cy + ly + 10, cx + 16 + lx, cy + ly + 2);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawAntennaOrb(ctx: CanvasRenderingContext2D, pose: Pose) {
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

/** Draw QB in logo units (the caller sets up the world → canvas transform) */
export function drawQB(ctx: CanvasRenderingContext2D, pose: Pose) {
  const p = getPaths();
  ctx.save();
  ctx.globalAlpha *= pose.alpha ?? 1;
  pose.behind?.(ctx);
  if (!pose.official) {
    pose.legs?.forEach((spec, i) => drawLeg(ctx, pose, i, spec));
    pose.arms?.forEach((spec, i) => drawArm(ctx, pose, i, spec));
  }
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
  if (!pose.official) ctx.clip(p.noDescender, "evenodd");
  ctx.fillStyle = INK;
  ctx.fill(p.ink, "evenodd");
  ctx.restore();
  ctx.fillStyle = CYAN;
  ctx.fill(p.accent, "evenodd");
  ctx.shadowBlur = 0;
  drawEyes(ctx, pose.eyes);
  ctx.restore();
  drawAntennaOrb(ctx, pose);
  pose.front?.(ctx);
  ctx.restore();
}
