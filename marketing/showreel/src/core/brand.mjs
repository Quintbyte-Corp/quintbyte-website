/**
 * Brand assets, loaded straight from the website so the reel can never drift from it:
 *  - the official logo SVG (split into mark and wordmark, like the site's generator)
 *  - the Material Symbols weight-300 icon paths the site uses
 *  - the brand typefaces
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { GlobalFonts, Path2D } from "@napi-rs/canvas";

const root = new URL("../../../../", import.meta.url); // repository root
const local = new URL("../../", import.meta.url); // showreel root

export const C = {
  bg: "#05080d",
  bg2: "#070b11",
  card: "#0c131c",
  node: "rgba(8,20,32,0.92)",
  ink: "#eef4f8",
  mute: "#b7c3cc",
  mute2: "#9fb0bc",
  mute3: "#c9d4dc",
  light: "#f4f6f8",
  chipInk: "#1b2630",
  accent: "#22c7ff",
  accentSoft: "#8fe6ff",
  accentLight: "#0a8fc2",
  logoCyan: "#08b5d1",
  alert: "#ff5a6e",
};

export const cyan = (a) => `rgba(34,199,255,${a})`;
export const white = (a) => `rgba(238,244,248,${a})`;

// ---------------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------------
for (const w of [400, 500, 600, 700, 800]) {
  GlobalFonts.registerFromPath(
    fileURLToPath(new URL(`assets/fonts/PlusJakartaSans-${w}.ttf`, local)),
    "Jakarta",
  );
}
for (const w of [500, 700]) {
  GlobalFonts.registerFromPath(
    fileURLToPath(new URL(`assets/fonts/JetBrainsMono-${w}.ttf`, local)),
    "Mono",
  );
}
export const font = (weight, size, family = "Jakarta") => `${weight} ${size}px ${family}`;

// ---------------------------------------------------------------------------------
// Logo — the official SVG's sub-paths split into mark / wordmark by position
// ---------------------------------------------------------------------------------
const svg = readFileSync(new URL("src/assets/brand/quintbyte-logo.svg", root), "utf8");
const svgPaths = [...svg.matchAll(/<path d="([^"]+)" fill="([^"]+)"/g)].map((m) => ({
  d: m[1],
  dark: m[2].toLowerCase() === "#000000",
}));
const WORDMARK_TOP = 326;

/** Parse "M x y L x y ... Z" polylines into point arrays */
const polylines = (d) =>
  d
    .split(/(?=M )/)
    .map((s) => [...s.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => [+m[1], +m[2]]))
    .filter((p) => p.length > 1);

const parts = { markAccent: [], markInk: [], wordAccent: [], wordInk: [] };
for (const p of svgPaths) {
  for (const poly of polylines(p.d)) {
    const isWord = Math.min(...poly.map((q) => q[1])) >= WORDMARK_TOP;
    const key = `${isWord ? "word" : "mark"}${p.dark ? "Ink" : "Accent"}`;
    parts[key].push(poly);
  }
}

const toPath = (polys) => {
  const path = new Path2D();
  for (const poly of polys) {
    path.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) path.lineTo(poly[i][0], poly[i][1]);
    path.closePath();
  }
  return path;
};

const bboxOf = (polys) => {
  const pts = polys.flat();
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
};

export const logo = {
  mark: {
    box: bboxOf([...parts.markAccent, ...parts.markInk]),
    accent: toPath(parts.markAccent),
    ink: toPath(parts.markInk),
    polys: [...parts.markInk, ...parts.markAccent],
    accentPolys: parts.markAccent,
    inkPolys: parts.markInk,
  },
  word: {
    box: bboxOf([...parts.wordAccent, ...parts.wordInk]),
    accent: toPath(parts.wordAccent),
    ink: toPath(parts.wordInk),
  },
};

/** Evenly spaced points along the mark's contours (for particles and draw-on) */
export function sampleMarkContour(count) {
  const segs = [];
  let total = 0;
  for (const poly of logo.mark.polys) {
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ a, b, len, start: total });
      total += len;
    }
  }
  const out = [];
  let s = 0;
  for (let k = 0; k < count; k++) {
    const d = (k / count) * total;
    while (s < segs.length - 1 && segs[s].start + segs[s].len < d) s++;
    const g = segs[s];
    const f = g.len ? (d - g.start) / g.len : 0;
    out.push([g.a[0] + (g.b[0] - g.a[0]) * f, g.a[1] + (g.b[1] - g.a[1]) * f]);
  }
  return out;
}

// ---------------------------------------------------------------------------------
// Icons — Material Symbols Outlined weight 300, from the site's generated module
// ---------------------------------------------------------------------------------
const iconSrc = readFileSync(new URL("src/components/icons/paths.ts", root), "utf8");
const iconJson = iconSrc.match(/export const materialPaths = (\{[\s\S]*?\}) as const;/)[1];
const iconData = JSON.parse(iconJson);
const iconCache = new Map();
export function iconPath(name) {
  if (!iconCache.has(name)) {
    if (!iconData[name]) throw new Error(`Unknown icon ${name}`);
    iconCache.set(name, new Path2D(iconData[name]));
  }
  return iconCache.get(name);
}
