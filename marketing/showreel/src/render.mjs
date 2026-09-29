/**
 * Full render: score → parallel frame rendering → lossless concat → loudness-normalised
 * mux → poster frame.   npm run render   (outputs to out/)
 */
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { cpus } from "node:os";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { FPS, FRAMES } from "./timing.mjs";

const out = (name) => fileURLToPath(new URL(`../out/${name}`, import.meta.url));
const src = (name) => fileURLToPath(new URL(name, import.meta.url));
const ff = (args) =>
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });

const t0 = performance.now();

console.log("1/4  score");
execFileSync("node", [src("audio.mjs")], { stdio: "inherit" });

const workers = Math.max(2, Math.min(8, cpus().length - 1));
console.log(`2/4  rendering ${FRAMES} frames on ${workers} processes`);
const chunk = Math.ceil(FRAMES / workers);
const segments = [];
await Promise.all(
  Array.from({ length: workers }, async (_, k) => {
    const a = k * chunk;
    const b = Math.min(FRAMES, a + chunk);
    if (a >= b) return;
    const seg = out(`seg-${String(k).padStart(2, "0")}.mp4`);
    segments[k] = seg;
    const args = [
      src("render-worker.mjs"),
      src("frame.mjs"),
      "reel",
      String(a),
      String(b),
      String(FPS),
      "h264",
      seg,
    ];
    const p = spawn("node", args, {
      stdio: "inherit",
    });
    const [code] = await once(p, "close");
    if (code !== 0) throw new Error(`worker ${k} failed (${code})`);
  }),
);

console.log("3/4  concat + loudness-normalised mux");
writeFileSync(
  out("segments.txt"),
  segments
    .filter(Boolean)
    .map((s) => `file '${s.replace(/\\/g, "/")}'`)
    .join("\n"),
);
ff(["-f", "concat", "-safe", "0", "-i", out("segments.txt"), "-c", "copy", out("video.mp4")]);

// Two-pass EBU R128 loudness normalisation: -14 LUFS, -1 dBTP (web / social standard)
const probe = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-nostats",
    "-i",
    out("audio.wav"),
    "-af",
    "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8" },
);
const m = JSON.parse(probe.stderr.match(/\{[\s\S]*\}/)[0]);
const ln = `loudnorm=I=-14:TP=-1:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
ff([
  "-i",
  out("video.mp4"),
  "-i",
  out("audio.wav"),
  "-map",
  "0:v",
  "-map",
  "1:a",
  "-af",
  `${ln},aresample=48000`,
  "-c:v",
  "copy",
  "-c:a",
  "aac",
  "-b:a",
  "256k",
  "-t",
  String(FRAMES / FPS),
  "-movflags",
  "+faststart",
  out("QuintByte-Showreel-1080p60.mp4"),
]);

console.log("4/4  poster frame");
ff([
  "-ss",
  "19.9",
  "-i",
  out("QuintByte-Showreel-1080p60.mp4"),
  "-frames:v",
  "1",
  out("QuintByte-Showreel-poster.png"),
]);

console.log(
  `done in ${((performance.now() - t0) / 1000).toFixed(0)} s → out/QuintByte-Showreel-1080p60.mp4`,
);
