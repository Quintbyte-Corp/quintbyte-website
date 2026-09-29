/**
 * Renders QB's key poses:
 *   out/mascot/qb-pose-sheet.png   — all poses on the brand stage, labelled
 *   out/mascot/qb-<pose>.png       — each pose alone on a transparent background
 * Run: node src/mascot/render-poses.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import { C, cyan, font } from "../core/brand.mjs";
import { text } from "../core/draw.mjs";
import { drawQB } from "./rig.mjs";
import { POSES } from "./poses.mjs";

const outDir = new URL("../../out/mascot/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const CELL_W = 900;
const CELL_H = 660;
const COLS = 3;
const SCALE = 1.22;
const GROUND = 540;

function stage(ctx, x, y, w, h, lift) {
  const cx = x + w / 2;
  const g = ctx.createRadialGradient(cx, y + h * 0.55, 0, cx, y + h * 0.55, w * 0.62);
  g.addColorStop(0, cyan(0.13));
  g.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = C.bg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  // Floor line
  const fg = ctx.createLinearGradient(x, 0, x + w, 0);
  fg.addColorStop(0, "rgba(34,199,255,0)");
  fg.addColorStop(0.5, cyan(0.55));
  fg.addColorStop(1, "rgba(34,199,255,0)");
  ctx.fillStyle = fg;
  ctx.fillRect(x + 40, y + GROUND + 1, w - 80, 1.5);
  // Contact shadow, shrinking as QB leaves the ground
  const k = 1 / (1 + lift / 90);
  const sg = ctx.createRadialGradient(cx, y + GROUND, 0, cx, y + GROUND, 170 * k);
  sg.addColorStop(0, `rgba(34,199,255,${0.28 * k})`);
  sg.addColorStop(1, "rgba(34,199,255,0)");
  ctx.save();
  ctx.translate(cx, y + GROUND);
  ctx.scale(1, 0.16);
  ctx.translate(-cx, -(y + GROUND));
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(cx, y + GROUND, 170 * k, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function bloom(canvas, amount = 0.7) {
  const w = canvas.width / 4;
  const h = canvas.height / 4;
  const small = createCanvas(w, h);
  const s = small.getContext("2d");
  s.filter = "blur(4px) brightness(0.85) contrast(1.8)";
  s.drawImage(canvas, 0, 0, w, h);
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = amount;
  ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// Pose sheet
const rows = Math.ceil(POSES.length / COLS);
const sheet = createCanvas(CELL_W * COLS, CELL_H * rows + 150);
const sx = sheet.getContext("2d");
sx.fillStyle = "#03060a";
sx.fillRect(0, 0, sheet.width, sheet.height);
text(sx, "QB — CHARACTER KEY POSES", 60, 78, { f: font(800, 44), tracking: -1 });
text(sx, "Rigged from the official qb mark · brand neon · rig drives the animation", 60, 116, {
  f: font(500, 22),
  color: C.mute2,
});
POSES.forEach((p, i) => {
  const x = (i % COLS) * CELL_W;
  const y = 150 + Math.floor(i / COLS) * CELL_H;
  sx.save();
  sx.beginPath();
  sx.rect(x + 6, y + 6, CELL_W - 12, CELL_H - 12);
  sx.clip();
  stage(sx, x + 6, y + 6, CELL_W - 12, CELL_H - 12, (p.pose.lift ?? 0) * SCALE);
  drawQB(sx, x + CELL_W / 2 + (p.shiftX ?? 0), y + GROUND + 6, SCALE, p.pose);
  sx.restore();
  text(sx, String(i + 1).padStart(2, "0"), x + 40, y + 62, {
    f: font(700, 22, "Mono"),
    color: C.accent,
  });
  text(sx, p.title, x + 84, y + 64, { f: font(800, 30) });
  text(sx, p.note, x + 40, y + CELL_H - 40, { f: font(500, 20), color: C.mute2 });
});
bloom(sheet, 0.3);
writeFileSync(new URL("qb-pose-sheet.png", outDir), await sheet.encode("png"));

// Individual transparent PNGs
for (const p of POSES) {
  const c = createCanvas(1000, 1000);
  drawQB(c.getContext("2d"), 500 + (p.shiftX ?? 0) * 1.6, 820, 1.9, p.pose);
  writeFileSync(new URL(`qb-${p.id}.png`, outDir), await c.encode("png"));
}
console.log(`rendered ${POSES.length} poses → out/mascot/`);
