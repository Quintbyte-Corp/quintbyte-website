/**
 * Drawing primitives: brand components (logo, icons, node cards, chips, plates) and
 * typography helpers, all in canvas form.
 */
import { C, cyan, font, iconPath, logo } from "./brand.mjs";

export const W = 1920;
export const H = 1080;
export const CX = W / 2;
export const CY = H / 2;

export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Material Symbols glyph centred on (cx, cy) */
export function drawIcon(ctx, name, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 960, size / 960);
  ctx.translate(0, 960);
  ctx.fillStyle = color;
  ctx.fill(iconPath(name));
  ctx.restore();
}

/**
 * The official qb mark centred on (cx, cy) at a given height.
 * `accent` colours the b, `ink` the q (black in the file, light on dark backgrounds).
 */
export function drawMark(ctx, cx, cy, height, { accent = C.logoCyan, ink = C.ink } = {}) {
  const b = logo.mark.box;
  const s = height / b.h;
  ctx.save();
  ctx.translate(cx - (b.w * s) / 2, cy - height / 2);
  ctx.scale(s, s);
  ctx.translate(-b.x, -b.y);
  ctx.fillStyle = ink;
  ctx.fill(logo.mark.ink, "evenodd");
  ctx.fillStyle = accent;
  ctx.fill(logo.mark.accent, "evenodd");
  ctx.restore();
}

/** Transform mapping logo-space coordinates of the mark to screen space */
export function markTransform(cx, cy, height) {
  const b = logo.mark.box;
  const s = height / b.h;
  return { s, ox: cx - (b.w * s) / 2 - b.x * s, oy: cy - height / 2 - b.y * s };
}

export function drawWordmark(ctx, cx, cy, height, { accent = C.logoCyan, ink = C.ink } = {}) {
  const b = logo.word.box;
  const s = height / b.h;
  ctx.save();
  ctx.translate(cx - (b.w * s) / 2, cy - height / 2);
  ctx.scale(s, s);
  ctx.translate(-b.x, -b.y);
  ctx.fillStyle = ink;
  ctx.fill(logo.word.ink, "evenodd");
  ctx.fillStyle = accent;
  ctx.fill(logo.word.accent, "evenodd");
  ctx.restore();
}

export const wordmarkWidth = (height) => (logo.word.box.w * height) / logo.word.box.h;

/**
 * Lay out a string glyph by glyph using prefix measurement (keeps the font's kerning).
 * Returns each character's x offset from the string start, plus the total width.
 */
export function layout(ctx, text, fontStr, tracking = 0) {
  ctx.save();
  ctx.font = fontStr;
  ctx.letterSpacing = `${tracking}px`;
  const glyphs = [];
  for (let i = 0; i < text.length; i++) {
    const x = ctx.measureText(text.slice(0, i)).width;
    const w = ctx.measureText(text[i]).width;
    glyphs.push({ ch: text[i], x, w });
  }
  const width = ctx.measureText(text).width - tracking;
  ctx.restore();
  return { glyphs, width };
}

export function text(
  ctx,
  str,
  x,
  y,
  { f, color = C.ink, align = "left", tracking = 0, base = "alphabetic" },
) {
  ctx.font = f;
  ctx.letterSpacing = `${tracking}px`;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
  ctx.letterSpacing = "0px";
}

/** Orbit node card (site: rgba(8,20,32,.92) fill, cyan/40 border, glow, icon + label) */
export function drawNodeCard(
  ctx,
  cx,
  cy,
  w,
  icon,
  label,
  { glow = 0.18, alpha = 1, iconColor = C.accent } = {},
) {
  const h = w * 0.92;
  const r = w * 0.176;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.shadowColor = cyan(glow + 0.1);
  ctx.shadowBlur = w * 0.28;
  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, r);
  ctx.fillStyle = C.node;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = cyan(0.4 + glow);
  ctx.stroke();
  drawIcon(ctx, icon, cx, cy - h * 0.16, w * 0.32, iconColor);
  const lines = label.split("\n");
  const fs = w * 0.135;
  lines.forEach((ln, i) =>
    text(ctx, ln, cx, cy + h * 0.2 + (i - (lines.length - 1) / 2) * fs * 1.12, {
      f: font(700, fs),
      align: "center",
      base: "middle",
    }),
  );
  ctx.restore();
}

/** Business chip. `light` = the site's white chips, otherwise the dark floating tags. */
export function drawChip(ctx, x, y, label, icon, { light = true, scale = 1, badge = 0 } = {}) {
  const fs = 26 * scale;
  ctx.font = font(700, fs);
  const tw = ctx.measureText(label).width;
  const pad = 20 * scale;
  const is = 30 * scale;
  const w = pad * 2 + is + 12 * scale + tw;
  const h = fs + 30 * scale;
  ctx.save();
  ctx.shadowColor = light ? "rgba(0,0,0,0.45)" : cyan(0.35);
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = light ? 10 * scale : 0;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 14 * scale);
  ctx.fillStyle = light ? "#ffffff" : "rgba(6,16,26,0.92)";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeStyle = light ? "#dde3e8" : cyan(0.55);
  ctx.stroke();
  drawIcon(ctx, icon, x - w / 2 + pad + is / 2, y, is, light ? C.accentLight : C.accent);
  text(ctx, label, x - w / 2 + pad + is + 12 * scale, y + 1 * scale, {
    f: font(700, fs),
    color: light ? C.chipInk : C.ink,
    base: "middle",
  });
  if (badge > 0) {
    const bx = x + w / 2 - 4 * scale;
    const by = y - h / 2 + 2 * scale;
    const br = 17 * scale;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = C.alert;
    ctx.fill();
    text(ctx, String(badge), bx, by + 1, {
      f: font(800, 17 * scale),
      color: "#fff",
      align: "center",
      base: "middle",
    });
  }
  ctx.restore();
  return { w, h };
}

/**
 * Isometric plate (site: translate(-50%,-50%) scaleY(.5) rotate(45deg)).
 * `size` is the unrotated square side; drawing callback runs in plate space.
 */
export function isoPlate(ctx, cx, cy, size, radius, drawFn) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, 0.5);
  ctx.rotate(Math.PI / 4);
  roundRect(ctx, -size / 2, -size / 2, size, size, radius);
  drawFn(ctx);
  ctx.restore();
}

/** Mono HUD label */
export function hud(
  ctx,
  str,
  x,
  y,
  { color = "rgba(201,212,220,0.55)", align = "left", size = 15 } = {},
) {
  text(ctx, str, x, y, { f: font(500, size, "Mono"), color, align, tracking: 2 });
}
