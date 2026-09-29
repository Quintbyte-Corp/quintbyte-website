/**
 * Key poses for QB, in logo units (ground y = 331). Each is a plain object for the rig,
 * so the animation can later interpolate between them.
 */
import { C, cyan } from "../core/brand.mjs";

const STAND_FEET = [
  { foot: [160, 320], bend: -1, facing: -1 },
  { foot: [246, 320], bend: 1, facing: 1 },
];

function sparkle(ctx, x, y, r, a = 1) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.shadowColor = cyan(0.9);
  ctx.shadowBlur = 12;
  ctx.fillStyle = C.accentSoft;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
  ctx.restore();
}

function arcs(ctx, x, y, from, to, radii, width = 4) {
  ctx.save();
  ctx.strokeStyle = cyan(0.75);
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.shadowColor = cyan(0.8);
  ctx.shadowBlur = 10;
  radii.forEach((r, i) => {
    ctx.globalAlpha = 1 - i * 0.35;
    ctx.beginPath();
    ctx.arc(x, y, r, from, to);
    ctx.stroke();
  });
  ctx.restore();
}

function roundPanel(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const POSES = [
  {
    id: "rest",
    title: "Rest",
    note: "The official mark, untouched",
    pose: { official: true, eyes: { mode: "none" } },
  },
  {
    id: "awaken",
    title: "Awaken",
    note: "Eyes open, limbs grow from the letterforms",
    pose: {
      eyes: { mode: "dot", look: [0, -12], size: 0.72 },
      antenna: 1,
      signal: true,
      legs: [
        { foot: [168.5, 320], bend: -1, facing: -1 },
        { foot: [246, 320], bend: 1, facing: 1, grow: 0.55 },
      ],
      arms: [
        { hand: [30, 250], bend: 1, grow: 0.45 },
        { hand: [338, 246], bend: -1, grow: 0.45 },
      ],
      front: (ctx) => {
        sparkle(ctx, 250, 300, 12, 0.9);
        sparkle(ctx, 20, 232, 9, 0.8);
        sparkle(ctx, 352, 226, 10, 0.85);
        sparkle(ctx, 290, 20, 7, 0.6);
      },
    },
  },
  {
    id: "walk",
    title: "Walk",
    note: "Contact pose — lean, stride, counter-swing",
    pose: {
      tilt: 0.07,
      squash: [1.01, 0.98],
      eyes: { mode: "dot", look: [13, 1] },
      antenna: 0.7,
      legs: [
        { foot: [132, 314], bend: 1, facing: 1, toe: 0.4 },
        { foot: [278, 319], bend: 1, facing: 1, toe: -0.15 },
      ],
      arms: [
        { hand: [16, 246], bend: 1 },
        { hand: [352, 236], bend: -1 },
      ],
      behind: (ctx) => {
        ctx.save();
        ctx.strokeStyle = cyan(0.45);
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        [
          [150, -70, 10],
          [196, -95, 30],
          [240, -60, 0],
        ].forEach(([y, x0, x1]) => {
          ctx.beginPath();
          ctx.moveTo(x0, y);
          ctx.lineTo(x1, y);
          ctx.stroke();
        });
        ctx.restore();
      },
    },
  },
  {
    id: "wave",
    title: "Hello",
    note: "Happy squint, big wave",
    pose: {
      tilt: -0.05,
      eyes: { mode: "happy" },
      antenna: 0.8,
      legs: STAND_FEET,
      arms: [
        { hand: [34, 290], bend: 1 },
        { hand: [376, 118], bend: -1 },
      ],
      front: (ctx) => {
        arcs(ctx, 380, 116, -Math.PI * 0.35, Math.PI * 0.1, [30, 44]);
        arcs(ctx, 376, 118, Math.PI * 0.85, Math.PI * 1.25, [30, 44]);
      },
    },
  },
  {
    id: "joy",
    title: "Joy",
    note: "Mid-jump stretch, arms up",
    pose: {
      lift: 62,
      squash: [0.94, 1.07],
      eyes: { mode: "happy" },
      antenna: 1,
      signal: true,
      legs: [
        { foot: [138, 232], bend: 1, facing: -1, toe: -0.35 },
        { foot: [266, 230], bend: -1, facing: 1, toe: 0.35 },
      ],
      arms: [
        { hand: [2, 90], bend: -1 },
        { hand: [372, 86], bend: 1 },
      ],
      front: (ctx) => {
        sparkle(ctx, -30, 40, 16);
        sparkle(ctx, 420, 30, 13);
        sparkle(ctx, -50, 170, 9, 0.7);
        sparkle(ctx, 440, 170, 10, 0.75);
        sparkle(ctx, 200, -40, 11, 0.8);
      },
    },
  },
  {
    id: "work",
    title: "At work",
    note: "Digitalising: paper in, data out",
    shiftX: -20,
    pose: {
      eyes: { mode: "dot", look: [0, 13], size: 0.95 },
      antenna: 1,
      signal: true,
      legs: STAND_FEET,
      arms: [
        { hand: [104, 276], bend: -1 },
        { hand: [268, 274], bend: 1 },
      ],
      front: (ctx) => {
        // Holographic keyboard
        ctx.save();
        ctx.shadowColor = cyan(0.8);
        ctx.shadowBlur = 18;
        ctx.strokeStyle = cyan(0.85);
        ctx.fillStyle = cyan(0.12);
        ctx.lineWidth = 3;
        roundPanel(ctx, 60, 280, 260, 30, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = cyan(0.55);
        for (let k = 0; k < 10; k++) ctx.fillRect(74 + k * 24, 290, 16, 4);
        // Floating screen with a chart
        ctx.shadowColor = cyan(0.8);
        ctx.shadowBlur = 20;
        ctx.strokeStyle = cyan(0.85);
        ctx.fillStyle = "rgba(8,20,32,0.9)";
        roundPanel(ctx, 350, 80, 170, 120, 14);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 8;
        ctx.fillStyle = C.accent;
        [34, 54, 44, 72, 82].forEach((h, k) => ctx.fillRect(368 + k * 29, 186 - h, 16, h));
        ctx.fillStyle = C.ink;
        ctx.fillRect(368, 96, 64, 7);
        ctx.fillStyle = "rgba(238,244,248,0.4)";
        ctx.fillRect(368, 110, 100, 5);
        // A paper document dissolving into data that streams to the screen
        ctx.shadowBlur = 0;
        ctx.save();
        ctx.translate(-118, 140);
        ctx.rotate(-0.12);
        ctx.fillStyle = "rgba(238,244,248,0.92)";
        roundPanel(ctx, 0, 0, 72, 94, 6);
        ctx.fill();
        ctx.fillStyle = "rgba(10,143,194,0.8)";
        for (let k = 0; k < 5; k++)
          ctx.fillRect(11, 15 + k * 14, k === 0 ? 34 : 50 - (k % 3) * 9, 5);
        ctx.restore();
        ctx.shadowColor = cyan(0.9);
        ctx.shadowBlur = 10;
        for (let k = 0; k < 34; k++) {
          const f = k / 33;
          const x = -40 + f * 400 + Math.sin(k * 1.7) * 6;
          const y = 120 - Math.sin(f * Math.PI) * 150 + Math.cos(k * 2.3) * 8;
          const s = 3 + (k % 3) * 2;
          ctx.fillStyle = k % 4 === 0 ? C.ink : C.accent;
          ctx.globalAlpha = 0.35 + 0.65 * Math.sin(f * Math.PI);
          ctx.fillRect(x, y, s, s);
        }
        ctx.restore();
      },
    },
  },
];
