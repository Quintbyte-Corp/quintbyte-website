/**
 * QB loop renders.
 *   node src/mascot/render-loop.mjs --preview 0.5 1.4 2.8   → out/mascot/loop-preview.png
 *   node src/mascot/render-loop.mjs                         → out/mascot/qb-loop.mp4
 *                                                            out/mascot/qb-loop-alpha.webm
 */
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import { FPS, LOOP, createRenderer } from "./loop.mjs";

const outDir = new URL("../../out/mascot/", import.meta.url);
mkdirSync(outDir, { recursive: true });
const out = (n) => fileURLToPath(new URL(n, outDir));
const here = (n) => fileURLToPath(new URL(n, import.meta.url));

const args = process.argv.slice(2);
if (args[0] === "--preview") {
  const times = args.slice(1).map(Number);
  const { renderFrame } = createRenderer("stage");
  const cols = 3;
  const tw = 800;
  const th = 450;
  const sheet = createCanvas(cols * tw, Math.ceil(times.length / cols) * th);
  const s = sheet.getContext("2d");
  times.forEach((t, i) => {
    s.drawImage(renderFrame(t), (i % cols) * tw, Math.floor(i / cols) * th, tw - 2, th - 2);
    s.fillStyle = "#ff0";
    s.font = "bold 22px sans-serif";
    s.fillText(`t=${t}`, (i % cols) * tw + 10, Math.floor(i / cols) * th + 28);
  });
  writeFileSync(out("loop-preview.png"), await sheet.encode("png"));
  console.log("preview → out/mascot/loop-preview.png");
  process.exit(0);
}

const FRAMES = LOOP * FPS;
const t0 = performance.now();
for (const [variant, codec, ext, name] of [
  ["stage", "h264", "mp4", "qb-loop.mp4"],
  ["alpha", "vp9a", "webm", "qb-loop-alpha.webm"],
]) {
  const workers = Math.max(2, Math.min(8, cpus().length - 1));
  const chunk = Math.ceil(FRAMES / workers);
  const segs = [];
  await Promise.all(
    Array.from({ length: workers }, async (_, k) => {
      const a = k * chunk;
      const b = Math.min(FRAMES, a + chunk);
      if (a >= b) return;
      const seg = out(`_${variant}-${k}.${ext}`);
      segs[k] = seg;
      const p = spawn(
        "node",
        [
          here("../render-worker.mjs"),
          here("loop.mjs"),
          variant,
          String(a),
          String(b),
          String(FPS),
          codec,
          seg,
        ],
        { stdio: "inherit" },
      );
      const [code] = await once(p, "close");
      if (code !== 0) throw new Error(`${variant} worker ${k} failed`);
    }),
  );
  const list = out(`_${variant}.txt`);
  writeFileSync(
    list,
    segs
      .filter(Boolean)
      .map((s) => `file '${s.replace(/\\/g, "/")}'`)
      .join("\n"),
  );
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      list,
      "-c",
      "copy",
      ...(ext === "mp4" ? ["-movflags", "+faststart"] : []),
      out(name),
    ],
    { stdio: "inherit" },
  );
  for (const s of [...segs.filter(Boolean), list]) rmSync(s);
}
console.log(`done in ${((performance.now() - t0) / 1000).toFixed(0)} s → out/mascot/`);
