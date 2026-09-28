import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt =
  "QuintByte — Business Management Services. Your business has enough moving parts.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Business Management Services",
    title: "Your business has enough",
    highlight: "moving parts.",
  });
}
