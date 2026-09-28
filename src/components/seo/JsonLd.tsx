import { absoluteUrl, siteConfig } from "@/config/site";

type Thing = Record<string, unknown>;

/** Renders schema.org JSON-LD, escaping "<" so the payload can't break out of the tag */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationId = absoluteUrl("/#organization");

export const organizationSchema: Thing = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  logo: absoluteUrl("/apple-icon.png"),
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
  ...(siteConfig.socials.length > 0 ? { sameAs: siteConfig.socials.map((s) => s.href) } : {}),
};

export const websiteSchema: Thing = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { "@id": organizationId },
};

export function breadcrumbSchema(items: { name: string; path: string }[]): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
