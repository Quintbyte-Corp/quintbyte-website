/**
 * Downloads the brand typefaces (SIL Open Font License) from Google Fonts as TTF,
 * which the canvas renderer can register. Run once: npm run fonts
 */
import { mkdirSync, writeFileSync } from "node:fs";

const FAMILIES = [
  { family: "Plus Jakarta Sans", file: "PlusJakartaSans", weights: [400, 500, 600, 700, 800] },
  { family: "JetBrains Mono", file: "JetBrainsMono", weights: [500, 700] },
];

const dir = new URL("../assets/fonts/", import.meta.url);
mkdirSync(dir, { recursive: true });

for (const { family, file, weights } of FAMILIES) {
  for (const w of weights) {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${w}`;
    // A non-woff2 user agent makes the API answer with TrueType sources
    const css = await (await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/4.0" } })).text();
    const src = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
    if (!src) throw new Error(`No TTF for ${family} ${w}`);
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    writeFileSync(new URL(`${file}-${w}.ttf`, dir), buf);
    console.log(`${file}-${w}.ttf  ${(buf.length / 1024).toFixed(0)} KB`);
  }
}
