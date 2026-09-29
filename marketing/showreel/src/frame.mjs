/**
 * Composites one frame: background → camera shake → scenes → post FX → HUD → grade.
 * Pure function of time: renderFrame(t) always yields the same image.
 */
import { createCanvas } from "@napi-rs/canvas";
import { C } from "./core/brand.mjs";
import { H, W } from "./core/draw.mjs";
import { createFx } from "./core/fx.mjs";
import { drawHud } from "./core/hud.mjs";
import { FPS, aberrationAt, bloomAt, flashAt, shake } from "./timing.mjs";
import { SCENES, smearAt } from "./scenes/index.mjs";

export function createRenderer() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const fx = createFx();

  function renderFrame(t) {
    const frame = Math.round(t * FPS);
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    const [sx, sy] = shake(t);
    ctx.translate(sx, sy);
    for (const scene of SCENES) {
      if (t >= scene.from && t <= scene.to) {
        ctx.save();
        scene.draw(ctx, t);
        ctx.restore();
      }
    }
    ctx.restore();

    fx.bloom(canvas, bloomAt(t));
    fx.smear(canvas, smearAt(t));
    fx.aberration(canvas, aberrationAt(t));
    fx.flash(canvas, flashAt(t), "150,225,255"); // cyan-white reads brighter than grey over navy
    drawHud(ctx, t, frame);
    fx.finish(canvas, { frame });
    return canvas;
  }

  return { canvas, ctx, renderFrame };
}
