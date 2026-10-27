import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { EngagementSection } from "@/components/sections/EngagementSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WaysToStart } from "@/components/sections/WaysToStart";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { absoluteUrl, siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/data/services";

const description =
  "QuintByte is a service firm providing flexible support designed to help businesses operate more efficiently, stay organized, and access the right support without having to manage multiple separate freelancers or service providers.";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Executive assistance, CRM and sales, operations, bookkeeping, web and more: 14 service categories coordinated through one accountable partner.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Comprehensive support for a better running business."
        lead={
          <>
            <p>{description}</p>
            <p>
              Depending on your needs, QuintByte can provide one specific service, a project-based
              solution, or a combination of functions managed under one coordinated relationship.
            </p>
          </>
        }
        actions={
          <>
            <ButtonLink href={siteConfig.cta.href}>{siteConfig.cta.label}</ButtonLink>
            <ArrowLink href="/how-it-works">How It Works</ArrowLink>
          </>
        }
      />
      <WaysToStart />
      <ServicesSection
        id="all-services"
        eyebrow={`${services.length} service categories`}
        title="The right specialists, coordinated through one partner."
        showAllLink={false}
      />
      <EngagementSection />
      <FaqSection page="services" />
      <CtaSection />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "QuintByte services",
            itemListElement: services.map((s) => ({
              "@type": "ListItem",
              position: s.number,
              url: absoluteUrl(`/services/${s.slug}`),
              name: s.title,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Business support services",
            serviceType: "Business support",
            provider: { "@id": organizationId },
            description,
          },
        ]}
      />
    </>
  );
}
