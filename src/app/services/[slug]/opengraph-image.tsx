import { getService, services } from "@/data/services";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "QuintByte service";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOgImage({
    eyebrow: service ? `QuintByte · ${service.category}` : "QuintByte services",
    title: service?.title ?? "Business Management Services",
  });
}
