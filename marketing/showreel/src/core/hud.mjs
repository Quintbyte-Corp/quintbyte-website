/**
 * Reel HUD: corner crop marks, chapter index (scramble-cuts between chapters), running
 * timecode and format tag. Fades out as the end card resolves.
 */
import { cyan, font } from "./brand.mjs";
import { H, W, hud, text } from "./draw.mjs";
import { clamp, ease, seg } from "./math.mjs";
import { scramble } from "./caption.mjs";
import { CHAPTERS, FPS } from "../timing.mjs";

const M = 56; // margin

function corner(ctx, x, y, dx, dy) {
  ctx.beginPath();
  ctx.moveTo(x, y + dy * 22);
  ctx.lineTo(x, y);
  ctx.lineTo(x + dx * 22, y);
  ctx.stroke();
}

export function drawHud(ctx, t, frame) {
  const alpha = clamp(seg(t, 0.2, 0.7)) * (1 - ease.inOutCubic(seg(t, 17.6, 18.3)));
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.strokeStyle = "rgba(201,212,220,0.35)";
  ctx.lineWidth = 1.5;
  corner(ctx, M, M, 1, 1);
  corner(ctx, W - M, M, -1, 1);
  corner(ctx, M, H - M, 1, -1);
  corner(ctx, W - M, H - M, -1, -1);

  // Chapter index — scrambles into each new chapter name
  let ch = CHAPTERS[0];
  for (const c of CHAPTERS) if (t >= c.t) ch = c;
  const p = clamp((t - ch.t) / 0.35);
  ctx.fillStyle = cyan(0.9);
  ctx.fillRect(M + 36, M + 30, 18 * ease.outExpo(p), 2);
  text(ctx, ch.n, M + 36, M + 26, { f: font(700, 15, "Mono"), color: cyan(0.95), tracking: 2 });
  hud(ctx, scramble(ch.name, p, ch.t * 10), M + 66, M + 36, { color: "rgba(238,244,248,0.7)" });

  // Timecode HH:MM:SS:FF
  const s = Math.floor(t);
  const ff = String(frame % FPS).padStart(2, "0");
  hud(ctx, `TC 00:00:${String(s).padStart(2, "0")}:${ff}`, W - M - 36, M + 36, { align: "right" });

  hud(ctx, "QUINTBYTE / BUSINESS MANAGEMENT SERVICES", M + 36, H - M - 30, { size: 13 });
  hud(ctx, "1920×1080 · 60 FPS · REEL 2026", W - M - 36, H - M - 30, { align: "right", size: 13 });

  // Progress rule along the bottom
  ctx.fillStyle = "rgba(201,212,220,0.14)";
  ctx.fillRect(M + 36, H - M - 14, W - 2 * M - 72, 1);
  ctx.fillStyle = cyan(0.7);
  ctx.fillRect(M + 36, H - M - 14, (W - 2 * M - 72) * (t / 20), 1);
  ctx.restore();
}
