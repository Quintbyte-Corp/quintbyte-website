/**
 * Renders frames [start, end) of any renderer module and pipes raw RGBA to an encoder.
 *   node src/render-worker.mjs <module> <variant> <start> <end> <fps> <codec> <out>
 * The module must export createRenderer(variant) → { ctx, renderFrame(t) }.
 * codec: "h264" (opaque MP4) or "vp9a" (WebM with alpha).
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import { pathToFileURL } from "node:url";

const [mod, variant, a, b, fpsArg, codec, out] = process.argv.slice(2);
const start = Number(a);
const end = Number(b);
const fps = Number(fpsArg);
const { createRenderer } = await import(pathToFileURL(mod).href);
const { ctx, renderFrame } = createRenderer(variant);
const { width: W, height: H } = ctx.canvas;

const encode = {
  h264: [
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "14",
    "-pix_fmt",
    "yuv420p",
    "-x264-params",
    `keyint=${fps}:min-keyint=${fps}:scenecut=0:threads=2`,
    "-color_primaries",
    "bt709",
    "-color_trc",
    "bt709",
    "-colorspace",
    "bt709",
  ],
  vp9a: [
    "-c:v",
    "libvpx-vp9",
    "-pix_fmt",
    "yuva420p",
    "-b:v",
    "0",
    "-crf",
    "24",
    "-row-mt",
    "1",
    "-deadline",
    "good",
    "-cpu-used",
    "2",
    "-g",
    String(fps),
    "-auto-alt-ref",
    "0",
  ],
}[codec];

const ff = spawn(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "rawvideo",
    "-pix_fmt",
    "rgba",
    "-s",
    `${W}x${H}`,
    "-r",
    String(fps),
    "-i",
    "-",
    ...encode,
    out,
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);

const t0 = performance.now();
for (let f = start; f < end; f++) {
  renderFrame(f / fps);
  const px = ctx.getImageData(0, 0, W, H).data;
  if (!ff.stdin.write(Buffer.from(px.buffer, px.byteOffset, px.byteLength)))
    await once(ff.stdin, "drain");
}
ff.stdin.end();
const [code] = await once(ff, "close");
if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
console.log(`[${start}-${end}] ${codec} done in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
