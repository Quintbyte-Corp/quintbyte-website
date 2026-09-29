/**
 * QB loop (12 s, seamless): rest → awaken → hello → walk → at work (paper → data) →
 * joy → walk home → retract → rest. Starts and ends on the untouched official mark.
 * Pure function of time, like the showreel, so it renders in parallel and can be
 * ported to the website as-is.
 *
 * createRenderer("stage") → brand stage + post FX (MP4)
 * createRenderer("alpha") → QB and props only, transparent (WebM with alpha)
 */
import { createCanvas } from "@napi-rs/canvas";
import { C, cyan } from "../core/brand.mjs";
import { createFx } from "../core/fx.mjs";
import { bump, clamp, ease, hash, lerp, seg } from "../core/math.mjs";
import { drawQB } from "./rig.mjs";

export const LOOP = 12;
export const FPS = 60;

const W = 1920;
const H = 1080;
const S = 1.72; // px per logo unit
const ORIGIN_X = 650; // screen x of QB's home stance centre
const GROUND_Y = 830;
const DIST = 264; // how far QB walks to the desk (logo units)

// Timeline (s)
const T = {
  wake: 1.0,
  waveIn: 2.3,
  waveOut: 3.55,
  walk1: [3.6, 5.8],
  work: [6.0, 8.95],
  check: 8.55,
  jump: [9.0, 9.8],
  walk2: [9.85, 11.35],
  retract: 11.42,
};

const STAND_FEET = [
  [160, 320],
  [246, 320],
];
const REST_HANDS = [
  [40, 276],
  [328, 272],
];
const add = ([x, y], dx, dy = 0) => [x + dx, y + dy];
const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const ramp = (t, a, b, c, d) =>
  Math.min(ease.inOutCubic(seg(t, a, b)), 1 - ease.inOutCubic(seg(t, c, d)));

/** A walk from x0 to x1 over [t0, t1]: planted feet, arcing swings, bob, lean, arm swing */
function walk(t, [t0, t1], x0, x1, cadence) {
  const dur = t1 - t0;
  const v = (x1 - x0) / dur;
  const dir = Math.sign(v);
  const u = clamp(t - t0, 0, dur);
  const X = x0 + v * u;
  const k = Math.min(seg(t, t0, t0 + 0.18), 1 - seg(t, t1 - 0.2, t1));
  const feet = [];
  const toes = [];
  STAND_FEET.forEach(([bx, by], i) => {
    const o = i * 0.5;
    const ph = u / cadence + o;
    const c = Math.floor(ph);
    const f = ph - c;
    const plant = (n) => bx + x0 + v * (n - o + 0.25) * cadence;
    let fx;
    let fy = by;
    let toe = 0;
    if (f < 0.5) {
      fx = plant(c);
    } else {
      const s = (f - 0.5) / 0.5;
      fx = lerp(plant(c), plant(c + 1), ease.inOutSine(s));
      fy = by - 17 * Math.sin(Math.PI * s);
      toe = dir * 0.38 * Math.sin(Math.PI * s);
    }
    feet.push(mix([bx + X, by], [fx, fy], k));
    toes.push(toe * k);
  });
  const sw = Math.sin((2 * Math.PI * u) / cadence) * k;
  return {
    X,
    feet,
    toes,
    dir,
    k,
    lift: k * (3 * Math.cos((4 * Math.PI * u) / cadence) - 1),
    tilt: 0.065 * dir * k,
    hands: [
      add(REST_HANDS[0], X + 24 * sw, -5 * Math.abs(sw)),
      add(REST_HANDS[1], X - 24 * sw, -5 * Math.abs(sw)),
    ],
  };
}

export function qbAt(t) {
  // Position and gait
  let X = 0;
  let gait = null;
  if (t >= T.walk1[0] && t <= T.walk1[1] + 0.001) gait = walk(t, T.walk1, 0, DIST, 0.55);
  else if (t > T.walk1[1] && t < T.walk2[0]) X = DIST;
  else if (t >= T.walk2[0] && t <= T.walk2[1]) gait = walk(t, T.walk2, DIST, 0, 0.5);
  if (gait) X = gait.X;

  let feet = STAND_FEET.map((p) => add(p, X));
  let toes = [0, 0];
  let hands = REST_HANDS.map((p) => add(p, X));
  let lift = 0;
  let tilt = 0;
  let squash = [1, 1];
  if (gait) ({ feet, toes, hands, lift, tilt } = gait);

  // Awaken: anticipation squash → hop → landing
  const antic = bump(t, 1.0, 1.22);
  const hop = bump(t, 1.22, 1.62);
  const land = bump(t, 1.62, 1.84);
  squash = [
    1 + 0.07 * antic - 0.04 * hop + 0.05 * land,
    1 - 0.09 * antic + 0.06 * hop - 0.06 * land,
  ];
  lift += 26 * hop;

  // Hello
  const wave = ramp(t, T.waveIn, T.waveIn + 0.25, T.waveOut - 0.25, T.waveOut);
  if (wave > 0) {
    const w = 2 * Math.PI * 3 * (t - T.waveIn);
    hands[1] = mix(hands[1], [376 + 22 * Math.sin(w), 118 + 7 * Math.cos(w)], wave);
    tilt += -0.05 * wave;
  }

  // Arrive at the desk
  const arrive = bump(t, T.walk1[1], T.walk1[1] + 0.22);
  squash = [squash[0] + 0.04 * arrive, squash[1] - 0.05 * arrive];

  // At work: typing hands
  const typing = ramp(t, T.work[0] - 0.1, T.work[0] + 0.1, T.work[1] - 0.1, T.work[1] + 0.05);
  if (typing > 0) {
    [
      [104, 276],
      [268, 274],
    ].forEach((base, i) => {
      const tap = -9 * Math.max(0, Math.sin(2 * Math.PI * 6 * t + i * Math.PI));
      hands[i] = mix(hands[i], add(base, X, tap), typing);
    });
  }

  // Joy: crouch → jump → land
  const crouch = bump(t, 9.0, 9.14);
  const airP = seg(t, 9.12, 9.62);
  const air = airP > 0 && airP < 1 ? 4 * airP * (1 - airP) : 0;
  const landJ = bump(t, 9.6, 9.8);
  const up = ramp(t, 9.08, 9.2, 9.55, 9.72);
  lift += 72 * air;
  squash = [
    squash[0] + 0.06 * crouch - 0.05 * air + 0.05 * landJ,
    squash[1] - 0.08 * crouch + 0.07 * air - 0.06 * landJ,
  ];
  if (up > 0) {
    hands = [mix(hands[0], add([2, 92], X), up), mix(hands[1], add([372, 88], X), up)];
    feet = [
      mix(feet[0], add([140, 320 - 72 * air - 26], X), up),
      mix(feet[1], add([264, 320 - 72 * air - 28], X), up),
    ];
    toes = [-0.35 * up, 0.35 * up];
  }

  // Limbs grow on waking and retract at the end
  const grow =
    t < T.retract
      ? ease.outBack(seg(t, 1.12, 1.5))
      : 1 - ease.inCubic(seg(t, T.retract, T.retract + 0.4));

  // Eyes
  let look = [4, 2];
  if (t < 1.65) look = [0, -12];
  else if (t < 1.85) look = [0, 0];
  else if (t < 2.02) look = [-13, 0];
  else if (t < 2.22) look = [13, 0];
  if (gait) look = [12 * gait.dir, 1];
  if (typing > 0.5) look = t > 7.35 && t < 7.8 ? [14, -6] : [0, 13];
  const blink = (tb) => 1 - bump(t, tb, tb + 0.16);
  let open = seg(t, 1.2, 1.32) * blink(5.95) * blink(10.9) * blink(4.6);
  if (t > T.retract + 0.08) open *= 1 - seg(t, T.retract + 0.08, T.retract + 0.2);
  const happy = wave > 0.5 || (t > T.check + 0.1 && t < 9.85);

  const antenna =
    t < 1 ? seg(t, 0.75, 0.95) * (0.6 + 0.4 * Math.sin(t * 60)) : 1 - seg(t, 11.6, 11.9);
  const signal = (t > 1.0 && t < 2.3) || (t > T.work[0] && t < T.check + 0.3);

  return {
    X,
    lift,
    grow,
    official: t < 1.05 ? 1 : t < 1.2 ? 1 - seg(t, 1.05, 1.2) : seg(t, 11.72, 11.98),
    pose: {
      shift: X,
      lift,
      tilt,
      squash,
      antenna: clamp(antenna),
      signal,
      eyes: { mode: happy ? "happy" : "dot", look, open },
      legs: [
        { foot: feet[0], bend: -1, facing: -1, toe: toes[0], grow: 1 },
        { foot: feet[1], bend: 1, facing: 1, toe: toes[1], grow },
      ],
      arms: [
        { hand: hands[0], bend: 1, grow },
        { hand: hands[1], bend: -1, grow },
      ],
    },
  };
}

// ---------------------------------------------------------------------------------
// Props: holographic desk, the paper document, and the data stream between them
// ---------------------------------------------------------------------------------
function panel(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Power state of the desk: boots on arrival, powers down as QB leaves */
const deskPower = (t) => ramp(t, 5.55, 6.0, 9.85, 10.2);

function drawDesk(ctx, t) {
  const p = deskPower(t);
  if (p <= 0) return;
  const flicker = p < 1 ? 0.6 + 0.4 * Math.sin(t * 90) : 1;
  const D = DIST;
  ctx.save();
  ctx.globalAlpha *= p * flicker;

  // Keyboard
  ctx.save();
  ctx.translate(D + 190, 295);
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
    ctx.fillStyle = lit ? C.accentSoft : cyan(0.5);
    ctx.fillRect(-116 + k * 24, -5, 16, 4);
  }
  ctx.restore();

  // Screen
  const sx = D + 350;
  const sy = 80;
  ctx.save();
  ctx.translate(sx + 85, sy + 60);
  ctx.scale(1, p);
  ctx.translate(-(sx + 85), -(sy + 60));
  const done = seg(t, T.check, T.check + 0.3);
  ctx.shadowColor = cyan(0.8 + 0.2 * done);
  ctx.shadowBlur = 20 + 30 * bump(t, T.check, T.check + 0.5);
  ctx.strokeStyle = cyan(0.85);
  ctx.fillStyle = "rgba(8,20,32,0.9)";
  ctx.lineWidth = 3;
  panel(ctx, sx, sy, 170, 120, 14);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 8;
  ctx.fillStyle = C.ink;
  ctx.fillRect(sx + 18, sy + 16, 64, 7);
  // progress bar
  const prog = seg(t, 6.1, 8.5);
  ctx.fillStyle = "rgba(238,244,248,0.18)";
  ctx.fillRect(sx + 18, sy + 30, 134, 5);
  ctx.fillStyle = C.accent;
  ctx.fillRect(sx + 18, sy + 30, 134 * prog, 5);
  // chart bars grow as the data arrives
  [34, 54, 44, 72, 82].forEach((h, k) => {
    const g = ease.outBack(seg(t, 6.3 + k * 0.4, 6.8 + k * 0.4));
    ctx.fillStyle = C.accent;
    ctx.globalAlpha = p * flicker * (1 - 0.7 * done);
    ctx.fillRect(sx + 18 + k * 29, sy + 106 - h * 0.8 * g, 16, h * 0.8 * g);
  });
  ctx.globalAlpha = p * flicker;
  // done: check mark draws on
  if (done > 0) {
    ctx.save();
    ctx.strokeStyle = C.accentSoft;
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = cyan(1);
    ctx.shadowBlur = 16;
    const pts = [
      [sx + 58, sy + 66],
      [sx + 78, sy + 86],
      [sx + 116, sy + 46],
    ];
    const d = ease.outCubic(done) * 2;
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    if (d <= 1) ctx.lineTo(...mix(pts[0], pts[1], d));
    else {
      ctx.lineTo(...pts[1]);
      ctx.lineTo(...mix(pts[1], pts[2], d - 1));
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

const PAPER = [-84, 120];
function drawPaper(ctx, t) {
  const a = ramp(t, 5.75, 6.1, 8.4, 8.6);
  if (a <= 0) return;
  const d = seg(t, 6.3, 8.5); // how much has been digitised
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.translate(PAPER[0], PAPER[1] + Math.sin(t * 2.4) * 5);
  ctx.rotate(-0.12 + Math.sin(t * 1.7) * 0.03);
  const h = 94 * (1 - d);
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

function drawStream(ctx, t) {
  const a = ramp(t, 6.2, 6.45, 8.35, 8.6);
  if (a <= 0) return;
  const d = seg(t, 6.3, 8.5);
  const p0 = [PAPER[0] + 36, PAPER[1] + 94 * d];
  const p2 = [DIST + 400, 150];
  const p1 = [(p0[0] + p2[0]) / 2, -150];
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
    ctx.fillStyle = i % 4 === 0 ? C.ink : C.accent;
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  ctx.restore();
}

function sparkles(ctx, t, X) {
  const p = seg(t, 9.2, 9.85);
  if (p <= 0 || p >= 1) return;
  const pts = [
    [-30, 40, 16],
    [420, 30, 13],
    [-50, 170, 9],
    [440, 170, 10],
    [200, -60, 11],
  ];
  ctx.save();
  ctx.shadowColor = cyan(0.9);
  ctx.shadowBlur = 12;
  ctx.fillStyle = C.accentSoft;
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

// ---------------------------------------------------------------------------------
// Frame
// ---------------------------------------------------------------------------------
function drawStage(ctx, t, q) {
  const qx = ORIGIN_X + q.X * S;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(qx, GROUND_Y - 220, 0, qx, GROUND_Y - 220, 900);
  g.addColorStop(0, cyan(0.12 + 0.03 * Math.sin(t * 2)));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // Floor: glowing line and receding grid
  const fg = ctx.createLinearGradient(0, 0, W, 0);
  fg.addColorStop(0, "rgba(34,199,255,0)");
  fg.addColorStop(0.5, cyan(0.55));
  fg.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = fg;
  ctx.fillRect(0, GROUND_Y + 1, W, 1.5);
  ctx.strokeStyle = cyan(0.06);
  ctx.lineWidth = 1;
  for (let k = -12; k <= 12; k++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + k * 40, GROUND_Y + 2);
    ctx.lineTo(W / 2 + k * 260, H);
    ctx.stroke();
  }
  // Contact shadow
  const k = 1 / (1 + (q.lift * S) / 110);
  ctx.save();
  ctx.translate(qx, GROUND_Y + 2);
  ctx.scale(1, 0.16);
  const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 240 * k);
  sg.addColorStop(0, `rgba(34,199,255,${0.3 * k})`);
  sg.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(0, 0, 240 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function createRenderer(variant = "stage") {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const fx = variant === "stage" ? createFx() : null;

  function renderFrame(time) {
    const t = ((time % LOOP) + LOOP) % LOOP;
    const q = qbAt(t);
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    if (fx) drawStage(ctx, t, q);
    else ctx.clearRect(0, 0, W, H);

    const props = {
      behind: (c) => {
        drawPaper(c, t);
        drawStream(c, t);
      },
      front: (c) => {
        drawDesk(c, t);
        sparkles(c, t, q.X);
      },
    };
    const x = ORIGIN_X;
    if (q.official < 1) drawQB(ctx, x, GROUND_Y, S, { ...q.pose, ...props, alpha: 1 - q.official });
    if (q.official > 0) {
      drawQB(ctx, x, GROUND_Y, S, {
        official: true,
        shift: q.X,
        antenna: q.pose.antenna,
        alpha: q.official,
        ...(q.official < 1 ? {} : props),
      });
    }
    ctx.restore();

    if (fx) {
      fx.bloom(canvas, 0.32);
      fx.finish(canvas, { frame: Math.round(time * FPS), grainAmount: 0.05 });
    }
    return canvas;
  }
  return { canvas, ctx, renderFrame };
}
