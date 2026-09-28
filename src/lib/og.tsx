import { ImageResponse } from "next/og";
import { LOGO_CYAN, mark, wordmark } from "@/components/brand/logo-paths";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type OgProps = { eyebrow: string; title: string; highlight?: string };

/**
 * Fetches a Google Fonts TTF subset containing only `text` (Satori can't read woff2).
 * Returns null on failure so the image still renders with the default font.
 */
async function loadGoogleFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Shared Open Graph card: dark surface, radial glow, official logo, headline */
export async function renderOgImage({ eyebrow, title, highlight }: OgProps) {
  const [, , mw, mh] = mark.viewBox.split(" ").map(Number);
  const [, , ww, wh] = wordmark.viewBox.split(" ").map(Number);
  const markH = 64;
  const wordH = 38;

  const words = [
    ...title.split(" ").map((w) => ({ w, accent: false })),
    ...(highlight ?? "")
      .split(" ")
      .filter(Boolean)
      .map((w) => ({ w, accent: true })),
  ];
  const fontSize = title.length + (highlight?.length ?? 0) > 40 ? 68 : 80;

  const [extraBold, bold, regular] = await Promise.all([
    loadGoogleFont("Plus Jakarta Sans", 800, `${title} ${highlight ?? ""}`),
    loadGoogleFont("Plus Jakarta Sans", 700, eyebrow.toUpperCase()),
    loadGoogleFont("Plus Jakarta Sans", 400, siteConfig.tagline),
  ]);
  const fonts = [
    extraBold && { name: "Jakarta", data: extraBold, weight: 800 as const },
    bold && { name: "Jakarta", data: bold, weight: 700 as const },
    regular && { name: "Jakarta", data: regular, weight: 400 as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#05080d",
        backgroundImage:
          "radial-gradient(ellipse 60% 80% at 80% 40%, rgba(34,150,255,0.22), transparent 70%)",
        color: "#eef4f8",
        fontFamily: fonts.length ? "Jakarta" : "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width={(markH * mw) / mh} height={markH} viewBox={mark.viewBox} fillRule="evenodd">
          <path d={mark.accent} fill={LOGO_CYAN} />
          <path d={mark.ink} fill="#eef4f8" />
        </svg>
        <svg width={(wordH * ww) / wh} height={wordH} viewBox={wordmark.viewBox} fillRule="evenodd">
          <path d={wordmark.accent} fill={LOGO_CYAN} />
          <path d={wordmark.ink} fill="#eef4f8" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#c9d4dc",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -fontSize * 0.035,
            maxWidth: 1000,
          }}
        >
          {words.map(({ w, accent }, i) => (
            <span
              key={i}
              style={{ color: accent ? "#22c7ff" : "#eef4f8", marginRight: fontSize * 0.24 }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 24, color: "#9fb0bc" }}>{siteConfig.tagline}</div>
    </div>,
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
