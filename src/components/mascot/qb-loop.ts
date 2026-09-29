/**
 * The QB loop (12 s, seamless): rest → awaken → hello → walk → at work (paper → data) →
 * joy → walk home → retract → rest. A pure function of time, drawn in logo units.
 * Browser port of marketing/showreel/src/mascot/loop.mjs, framed for the page hero.
 */
import { INK, type Pose, type Pt, cyan, drawQB } from "./qb-rig";

export const LOOP = 12;
/** World window drawn by the canvas (logo units): QB's walk, the paper and the desk */
export const VIEW = { x: -110, y: -100, w: 870, h: 455 };
/** A calm, representative frame for reduced motion: the Hello wave */
export const STILL_AT = 2.95;

const DIST = 210;
const T = {
  waveIn: 2.3,
  waveOut: 3.55,
  walk1: [3.6, 5.6] as Pt,
  work: [5.85, 8.95] as Pt,
  check: 8.55,
  walk2: [9.85, 11.25] as Pt,
  retract: 11.42,
};
const STAND_FEET: Pt[] = [
  [160, 320],
  [246, 320],
];
const REST_HANDS: Pt[] = [
  [40, 276],
  [328, 272],
];

// ---- small motion helpers --------------------------------------------------------
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const bump = (t: number, a: number, b: number) => Math.sin(seg(t, a, b) * Math.PI);
const inOutCubic = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const inOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const outBack = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
const inCubic = (x: number) => x ** 3;
const outCubic = (x: number) => 1 - (1 - x) ** 3;
const hash = (n: number) => {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};
const add = ([x, y]: Pt, dx: number, dy = 0): Pt => [x + dx, y + dy];
const mix = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const ramp = (t: number, a: number, b: number, c: number, d: number) =>
  Math.min(inOutCubic(seg(t, a, b)), 1 - inOutCubic(seg(t, c, d)));

/** Walk from x0 to x1 over [t0, t1]: planted feet, arcing swings, bob, lean, arm swing */
function walk(t: number, [t0, t1]: Pt, x0: number, x1: number, cadence: number) {
  const dur = t1 - t0;
  const v = (x1 - x0) / dur;
  const dir = Math.sign(v);
  const u = clamp(t - t0, 0, dur);
  const X = x0 + v * u;
  const k = Math.min(seg(t, t0, t0 + 0.18), 1 - seg(t, t1 - 0.2, t1));
  const feet: Pt[] = [];
  const toes: number[] = [];
  STAND_FEET.forEach(([bx, by], i) => {
    const o = i * 0.5;
    const ph = u / cadence + o;
    const c = Math.floor(ph);
    const f = ph - c;
    const plant = (n: number) => bx + x0 + v * (n - o + 0.25) * cadence;
    let fx = plant(c);
    let fy = by;
    let toe = 0;
    if (f >= 0.5) {
      const s = (f - 0.5) / 0.5;
      fx = lerp(plant(c), plant(c + 1), inOutSine(s));
      fy = by - 17 * Math.sin(Math.PI * s);
      toe = dir * 0.38 * Math.sin(Math.PI * s);
    }
    feet.push(mix([bx + X, by], [fx, fy], k));
    toes.push(toe * k);
  });
  const sw = Math.sin((2 * Math.PI * u) / cadence) * k;
  return {
    X,
    dir,
    feet,
    toes,
    lift: k * (3 * Math.cos((4 * Math.PI * u) / cadence) - 1),
    tilt: 0.065 * dir * k,
    hands: [
      add(REST_HANDS[0], X + 24 * sw, -5 * Math.abs(sw)),
      add(REST_HANDS[1], X - 24 * sw, -5 * Math.abs(sw)),
    ],
  };
}

function qbAt(t: number) {
  let gait: ReturnType<typeof walk> | null = null;
  let X = 0;
  if (t >= T.walk1[0] && t <= T.walk1[1]) gait = walk(t, T.walk1, 0, DIST, 0.55);
  else if (t > T.walk1[1] && t < T.walk2[0]) X = DIST;
  else if (t >= T.walk2[0] && t <= T.walk2[1]) gait = walk(t, T.walk2, DIST, 0, 0.5);
  if (gait) X = gait.X;

  let feet: Pt[] = gait ? gait.feet : STAND_FEET.map((p) => add(p, X));
  let toes = gait ? gait.toes : [0, 0];
  let hands: Pt[] = gait ? gait.hands : REST_HANDS.map((p) => add(p, X));
  let lift = gait ? gait.lift : 0;
  let tilt = gait ? gait.tilt : 0;

  // Awaken: anticipation → hop → landing
  const antic = bump(t, 1.0, 1.22);
  const hop = bump(t, 1.22, 1.62);
  const land = bump(t, 1.62, 1.84);
  let sx = 1 + 0.07 * antic - 0.04 * hop + 0.05 * land;
  let sy = 1 - 0.09 * antic + 0.06 * hop - 0.06 * land;
  lift += 26 * hop;

  const wave = ramp(t, T.waveIn, T.waveIn + 0.25, T.waveOut - 0.25, T.waveOut);
  if (wave > 0) {
    const w = 2 * Math.PI * 3 * (t - T.waveIn);
    hands[1] = mix(hands[1], [376 + 22 * Math.sin(w), 118 + 7 * Math.cos(w)], wave);
    tilt -= 0.05 * wave;
  }

  const arrive = bump(t, T.walk1[1], T.walk1[1] + 0.22);
  sx += 0.04 * arrive;
  sy -= 0.05 * arrive;

  const typing = ramp(t, T.work[0] - 0.1, T.work[0] + 0.1, T.work[1] - 0.1, T.work[1] + 0.05);
  if (typing > 0) {
    const keys: Pt[] = [
      [104, 276],
      [268, 274],
    ];
    hands = hands.map((h, i) =>
      mix(
        h,
        add(keys[i], X, -9 * Math.max(0, Math.sin(2 * Math.PI * 6 * t + i * Math.PI))),
        typing,
      ),
    );
  }

  // Joy: crouch → jump → land
  const crouch = bump(t, 9.0, 9.14);
  const airP = seg(t, 9.12, 9.62);
  const air = airP > 0 && airP < 1 ? 4 * airP * (1 - airP) : 0;
  const landJ = bump(t, 9.6, 9.8);
  const up = ramp(t, 9.08, 9.2, 9.55, 9.72);
  lift += 72 * air;
  sx += 0.06 * crouch - 0.05 * air + 0.05 * landJ;
  sy += -0.08 * crouch + 0.07 * air - 0.06 * landJ;
  if (up > 0) {
    hands = [mix(hands[0], add([2, 92], X), up), mix(hands[1], add([372, 88], X), up)];
    feet = [
      mix(feet[0], add([140, 294 - 72 * air], X), up),
      mix(feet[1], add([264, 292 - 72 * air], X), up),
    ];
    toes = [-0.35 * up, 0.35 * up];
  }

  const grow =
    t < T.retract ? outBack(seg(t, 1.12, 1.5)) : 1 - inCubic(seg(t, T.retract, T.retract + 0.4));

  let look: Pt = [4, 2];
  if (t < 1.65) look = [0, -12];
  else if (t < 1.85) look = [0, 0];
  else if (t < 2.02) look = [-13, 0];
  else if (t < 2.22) look = [13, 0];
  if (gait) look = [12 * gait.dir, 1];
  if (typing > 0.5) look = t > 7.35 && t < 7.8 ? [14, -6] : [0, 13];
  const blink = (tb: number) => 1 - bump(t, tb, tb + 0.16);
  let open = seg(t, 1.2, 1.32) * blink(5.75) * blink(10.9) * blink(4.6);
  if (t > T.retract + 0.08) open *= 1 - seg(t, T.retract + 0.08, T.retract + 0.2);
  const happy = wave > 0.5 || (t > T.check + 0.1 && t < 9.85);
  const antenna =
    t < 1 ? seg(t, 0.75, 0.95) * (0.6 + 0.4 * Math.sin(t * 60)) : 1 - seg(t, 11.6, 11.9);

  const pose: Pose = {
    shift: X,
    lift,
    tilt,
    squash: [sx, sy],
    antenna: clamp(antenna),
    signal: (t > 1.0 && t < 2.3) || (t > T.work[0] && t < T.check + 0.3),
    eyes: { mode: happy ? "happy" : "dot", look, open },
    legs: [
      { foot: feet[0], bend: -1, facing: -1, toe: toes[0] },
      { foot: feet[1], bend: 1, facing: 1, toe: toes[1], grow },
    ],
    arms: [
      { hand: hands[0], bend: 1, grow },
      { hand: hands[1], bend: -1, grow },
    ],
  };
  const official = t < 1.05 ? 1 : t < 1.2 ? 1 - seg(t, 1.05, 1.2) : seg(t, 11.72, 11.98);
  return { X, lift, pose, official };
}

// ---- props -----------------------------------------------------------------------
function panel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawDesk(ctx: CanvasRenderingContext2D, t: number) {
  const p = ramp(t, 5.4, 5.85, 9.85, 10.2);
  if (p <= 0) return;
  const flicker = p < 1 ? 0.6 + 0.4 * Math.sin(t * 90) : 1;
  ctx.save();
  ctx.globalAlpha *= p * flicker;

  // Holographic keyboard
  ctx.save();
  ctx.translate(DIST + 190, 295);
  ctx.scale(1, p);
  ctx.shadowColor = cyan(0.8);
  ctx.shadowBlur = 18;
  ctx.strokeStyle = cyan(0.85);
  ctx.fillStyle = cyan(0.12);
  ctx.lineWidth = 3;
  panel(ctx, -130, -15, 260, 30, 8);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  for (let k = 0; k < 10; k++) {
    const lit = t > T.work[0] && t < T.work[1] && hash(Math.floor(t * 14) * 13 + k) > 0.72;
    ctx.fillStyle = lit ? "#8fe6ff" : cyan(0.5);
    ctx.fillRect(-116 + k * 24, -5, 16, 4);
  }
  ctx.restore();

  // Screen: progress, chart bars growing as data arrives, then a check mark
  const sx = DIST + 330;
  const sy = 80;
  const done = seg(t, T.check, T.check + 0.3);
  ctx.save();
  ctx.translate(sx + 85, sy + 60);
  ctx.scale(1, p);
  ctx.translate(-(sx + 85), -(sy + 60));
  ctx.shadowColor = cyan(0.8);
  ctx.shadowBlur = 20 + 30 * bump(t, T.check, T.check + 0.5);
  ctx.strokeStyle = cyan(0.85);
  ctx.fillStyle = "rgba(8,20,32,0.9)";
  ctx.lineWidth = 3;
  panel(ctx, sx, sy, 170, 120, 14);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 8;
  ctx.fillStyle = INK;
  ctx.fillRect(sx + 18, sy + 16, 64, 7);
  ctx.fillStyle = "rgba(238,244,248,0.18)";
  ctx.fillRect(sx + 18, sy + 30, 134, 5);
  ctx.fillStyle = "#22c7ff";
  ctx.fillRect(sx + 18, sy + 30, 134 * seg(t, 6.0, 8.5), 5);
  [34, 54, 44, 72, 82].forEach((h, k) => {
    const g = outBack(seg(t, 6.2 + k * 0.4, 6.7 + k * 0.4));
    ctx.globalAlpha = p * flicker * (1 - 0.7 * done);
    ctx.fillRect(sx + 18 + k * 29, sy + 106 - h * 0.8 * g, 16, h * 0.8 * g);
  });
  ctx.globalAlpha = p * flicker;
  if (done > 0) {
    const pts: Pt[] = [
      [sx + 58, sy + 66],
      [sx + 78, sy + 86],
      [sx + 116, sy + 46],
    ];
    const d = outCubic(done) * 2;
    ctx.strokeStyle = "#8fe6ff";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = cyan(1);
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    if (d <= 1) ctx.lineTo(...mix(pts[0], pts[1], d));
    else {
      ctx.lineTo(...pts[1]);
      ctx.lineTo(...mix(pts[1], pts[2], d - 1));
    }
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

const PAPER: Pt = [-84, 120];
function drawPaper(ctx: CanvasRenderingContext2D, t: number) {
  const a = ramp(t, 5.6, 5.95, 8.4, 8.6);
  if (a <= 0) return;
  const d = seg(t, 6.2, 8.5);
  const h = 94 * (1 - d);
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.translate(PAPER[0], PAPER[1] + Math.sin(t * 2.4) * 5);
  ctx.rotate(-0.12 + Math.sin(t * 1.7) * 0.03);
  ctx.beginPath();
  ctx.rect(-4, 94 - h, 90, h + 4);
  ctx.clip();
  ctx.shadowColor = "rgba(200,240,255,0.6)";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "rgba(238,244,248,0.94)";
  panel(ctx, 0, 0, 72, 94, 6);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(10,143,194,0.85)";
  for (let k = 0; k < 5; k++) ctx.fillRect(11, 15 + k * 14, k === 0 ? 34 : 50 - (k % 3) * 9, 5);
  ctx.restore();
}

function drawStream(ctx: CanvasRenderingContext2D, t: number) {
  const a = ramp(t, 6.1, 6.35, 8.35, 8.6);
  if (a <= 0) return;
  const d = seg(t, 6.2, 8.5);
  const p0: Pt = [PAPER[0] + 36, PAPER[1] + 94 * d];
  const p2: Pt = [DIST + 380, 150];
  const p1: Pt = [(p0[0] + p2[0]) / 2, -130];
  ctx.save();
  ctx.shadowColor = cyan(0.9);
  ctx.shadowBlur = 10;
  for (let i = 0; i < 46; i++) {
    const f = (t * 0.55 + i / 46) % 1;
    const q = 1 - f;
    const x = q * q * p0[0] + 2 * q * f * p1[0] + f * f * p2[0] + Math.sin(i * 1.7 + t * 3) * 7;
    const y = q * q * p0[1] + 2 * q * f * p1[1] + f * f * p2[1] + Math.cos(i * 2.3 + t * 3) * 9;
    const s = 3 + (i % 3) * 2;
    ctx.globalAlpha = a * Math.sin(f * Math.PI);
    ctx.fillStyle = i % 4 === 0 ? INK : "#22c7ff";
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  ctx.restore();
}

function drawSparkles(ctx: CanvasRenderingContext2D, t: number, X: number) {
  const p = seg(t, 9.2, 9.85);
  if (p <= 0 || p >= 1) return;
  const pts: [number, number, number][] = [
    [-30, 40, 16],
    [420, 30, 13],
    [-50, 170, 9],
    [440, 170, 10],
    [200, -60, 11],
  ];
  ctx.save();
  ctx.shadowColor = cyan(0.9);
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#8fe6ff";
  pts.forEach(([x, y, r], i) => {
    const s = r * Math.sin(Math.PI * clamp(p * 1.3 - i * 0.06));
    if (s <= 0) return;
    const cx = x + X;
    ctx.beginPath();
    ctx.moveTo(cx, y - s);
    ctx.quadraticCurveTo(cx, y, cx + s, y);
    ctx.quadraticCurveTo(cx, y, cx, y + s);
    ctx.quadraticCurveTo(cx, y, cx - s, y);
    ctx.quadraticCurveTo(cx, y, cx, y - s);
    ctx.fill();
  });
  ctx.restore();
}

function drawFloor(ctx: CanvasRenderingContext2D, X: number, lift: number) {
  const g = ctx.createLinearGradient(VIEW.x, 0, VIEW.x + VIEW.w, 0);
  g.addColorStop(0, "rgba(34,199,255,0)");
  g.addColorStop(0.5, cyan(0.45));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(VIEW.x, 332, VIEW.w, 1.5);
  const k = 1 / (1 + lift / 70);
  const cx = 200 + X;
  ctx.save();
  ctx.translate(cx, 333);
  ctx.scale(1, 0.16);
  const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 140 * k);
  sg.addColorStop(0, cyan(0.3 * k));
  sg.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(0, 0, 140 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Draw the loop at time t into a context already mapped to VIEW (logo units) */
export function drawLoopFrame(ctx: CanvasRenderingContext2D, time: number) {
  const t = ((time % LOOP) + LOOP) % LOOP;
  const q = qbAt(t);
  drawFloor(ctx, q.X, q.lift);
  const props = {
    behind: (c: CanvasRenderingContext2D) => {
      drawPaper(c, t);
      drawStream(c, t);
    },
    front: (c: CanvasRenderingContext2D) => {
      drawDesk(c, t);
      drawSparkles(c, t, q.X);
    },
  };
  if (q.official < 1) drawQB(ctx, { ...q.pose, ...props, alpha: 1 - q.official });
  if (q.official > 0) {
    drawQB(ctx, {
      official: true,
      shift: q.X,
      antenna: q.pose.antenna,
      alpha: q.official,
      ...(q.official < 1 ? {} : props),
    });
  }
}
