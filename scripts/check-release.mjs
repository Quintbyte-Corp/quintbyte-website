/**
 * Release gate G1 (GDE-005 §10 and §11). Run after `next build`:
 *   - no "[CONFIRM", "TODO" or "Lorem ipsum" in any page's visible text, and no "["
 *     in it at all (GDE-005 §10: "Search the site for '[' before each release")
 *   - nothing shaped like a BIR TIN (000-000-000-00000) anywhere in the page source
 *   - none of the retired positioning ("Business Management Services", "One business
 *     partner") anywhere in the page source, metadata and structured data included
 *     (rebrand brief, 24 Oct 2026, step 5)
 *
 * Scans the prerendered HTML in .next/server/app. Pages rendered on request (/contact)
 * have no prerendered HTML: pass the address of a running build to fetch them too:
 *   node scripts/check-release.mjs --url http://localhost:3000
 * Exits 1 on any finding.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), ".next", "server", "app");

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith(".html") ? [p] : [];
  });

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");

const TIN = /\b\d{3}-\d{3}-\d{3}-\d{3,5}\b/;
const RETIRED = [
  [/Business Management Services/i, '"Business Management Services"'],
  [/One business partner/i, '"One business partner"'],
];
const textRules = [
  [/\[CONFIRM/i, "[CONFIRM marker"],
  [/\bTODO\b/, "TODO"],
  [/lorem ipsum/i, "Lorem ipsum"],
  [/\[/, 'a "[" in visible text'],
];

let files;
try {
  files = htmlFiles(root);
} catch {
  console.error("No build output found. Run `npm run build` first.");
  process.exit(1);
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Search snippet rules (GDE-005 D1), measured on the decoded text */
function checkMetadata(page, html) {
  const meta = (attr, key) => {
    const raw = html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
    return raw === undefined ? null : decode(raw);
  };
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = meta("name", "description");
  const out = [];
  if (title.length >= 60) out.push(`${page}: title is ${title.length} characters (limit 59)`);
  if (!description) out.push(`${page}: no meta description`);
  else {
    if (description.length >= 155)
      out.push(`${page}: description is ${description.length} characters (limit 154)`);
    for (const [attr, key] of [
      ["property", "og:description"],
      ["name", "twitter:description"],
    ])
      if (meta(attr, key) !== description) out.push(`${page}: ${key} differs from the description`);
  }
  if (!meta("property", "og:image")) out.push(`${page}: no og:image`);
  return out;
}

/** Routes rendered on request, so absent from the prerendered output */
const DYNAMIC_PATHS = ["/contact"];

const pages = files.map((file) => ({
  page: relative(root, file),
  html: readFileSync(file, "utf8"),
}));

const urlFlag = process.argv.indexOf("--url");
if (urlFlag > -1) {
  const base = process.argv[urlFlag + 1];
  for (const path of DYNAMIC_PATHS) {
    const res = await fetch(new URL(path, base));
    if (!res.ok) {
      console.error(`${path}: HTTP ${res.status}`);
      process.exit(1);
    }
    pages.push({ page: path, html: await res.text() });
  }
} else {
  console.warn(`Not checked (pass --url to include): ${DYNAMIC_PATHS.join(", ")}`);
}

const problems = [];
for (const { page, html } of pages) {
  if (!page.startsWith("_")) problems.push(...checkMetadata(page, html));
  if (TIN.test(html)) problems.push(`${page}: something shaped like a TIN in the page source`);
  const source = decode(html);
  for (const [re, label] of RETIRED) {
    const m = source.match(re);
    if (m) {
      const at = Math.max(0, m.index - 40);
      problems.push(
        `${page}: retired ${label} near "…${source.slice(at, at + 90).replace(/\s+/g, " ")}…"`,
      );
    }
  }
  const text = visibleText(html);
  for (const [re, label] of textRules) {
    const m = text.match(re);
    if (m) {
      const at = Math.max(0, m.index - 40);
      problems.push(`${page}: ${label} near "…${text.slice(at, at + 90).replace(/\s+/g, " ")}…"`);
    }
  }
}

if (problems.length) {
  console.error(`Release check failed (${problems.length}):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`Release check passed: ${pages.length} pages scanned.`);
