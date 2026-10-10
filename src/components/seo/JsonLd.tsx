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
  // GDE-005 §7.2: legal name and SEC number; the BIR TIN is never included
  identifier: {
    "@type": "PropertyValue",
    propertyID: "SEC Reg. No.",
    value: siteConfig.secRegNo,
  },
  foundingDate: siteConfig.foundingDate,
  email: siteConfig.contactEmail,
  telephone: siteConfig.phone.display,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Pablo City",
    addressRegion: "Laguna",
    addressCountry: "PH",
  },
  areaServed: siteConfig.areaServed,
  // Social profiles are added here automatically once their URLs are set in site.ts
  sameAs: siteConfig.socials.map((s) => s.href),
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
