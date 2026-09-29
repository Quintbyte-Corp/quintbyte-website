/**
 * Renders chosen moments to a contact sheet for review.
 *   node src/preview.mjs 0.5 1.2 2.1        → out/preview.png (grid of those times)
 *   node src/preview.mjs --full 12.4        → out/frame-12.40.png at full resolution
 */
import { writeFileSync } from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import { createRenderer } from "./frame.mjs";
import { H, W } from "./core/draw.mjs";

const args = process.argv.slice(2);
const full = args[0] === "--full";
const times = (full ? args.slice(1) : args).map(Number);
const { renderFrame } = createRenderer();
const out = new URL("../out/", import.meta.url);

if (full) {
  for (const t of times) {
    const t0 = performance.now();
    const c = renderFrame(t);
    writeFileSync(new URL(`frame-${t.toFixed(2)}.png`, out), await c.encode("png"));
    console.log(`t=${t}  ${(performance.now() - t0).toFixed(0)} ms`);
  }
} else {
  const cols = times.length <= 4 ? 2 : 3;
  const rows = Math.ceil(times.length / cols);
  const tw = 800;
  const th = (tw * H) / W;
  const sheet = createCanvas(cols * tw, rows * th);
  const s = sheet.getContext("2d");
  s.fillStyle = "#222";
  s.fillRect(0, 0, sheet.width, sheet.height);
  let total = 0;
  times.forEach((t, i) => {
    const t0 = performance.now();
    const c = renderFrame(t);
    total += performance.now() - t0;
    const x = (i % cols) * tw;
    const y = Math.floor(i / cols) * th;
    s.drawImage(c, x, y, tw - 2, th - 2);
    s.fillStyle = "#ff0";
    s.font = "bold 22px sans-serif";
    s.fillText(`t=${t}`, x + 10, y + 28);
  });
  writeFileSync(new URL("preview.png", out), await sheet.encode("png"));
  console.log(`${times.length} frames, avg ${(total / times.length).toFixed(0)} ms/frame`);
}
