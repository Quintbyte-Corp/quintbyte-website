import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Search snippet limits (GDE-005 D1): title under 60 characters, description under 155 */
const DESCRIPTION_MAX = 155;

/**
 * Shortens approved copy to a meta description: whole sentences while they fit, else
 * whole words with an ellipsis. Never rewrites the wording itself.
 */
export function metaDescription(text: string, max = DESCRIPTION_MAX): string {
  if (text.length < max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length >= max) break;
    out += s;
  }
  if (out.trim()) return out.trim();
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "")}…`;
}

/** Shared Open Graph fields; a page's openGraph replaces the layout's whole object */
export const openGraphBase = {
  type: "website",
  siteName: siteConfig.name,
  locale: "en_US",
} as const;

/**
 * The site-wide share image (app/opengraph-image.tsx). File-based images apply only to
 * their own segment, so inner pages without one point at it explicitly; a segment's own
 * opengraph-image file still takes precedence.
 */
const shareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name };

/**
 * Page metadata with one description used everywhere: standard, Open Graph and Twitter
 * (GDE-005 D1). `title` feeds the layout's "%s | QuintByte" template.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase,
      title: socialTitle,
      description,
      url: path,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [shareImage] },
  };
}
