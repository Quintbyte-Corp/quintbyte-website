import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt =
  "QuintByte — Business Management Services. Hire one person. Get a whole company behind them.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Business Management Services",
    title: "Hire one person.",
    highlight: "Get a whole company behind them.",
  });
}
