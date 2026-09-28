import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { EngagementSection } from "@/components/sections/EngagementSection";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ButtonLink } from "@/components/ui/Button";
import { absoluteUrl, siteConfig } from "@/config/site";
import { services } from "@/data/services";

const description =
  "QuintByte provides flexible Business Management Services designed to help businesses operate more efficiently, stay organized, and access the right support without having to manage multiple separate freelancers or service providers.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | QuintByte", description, url: "/services" },
};

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
              solution, or a combination of functions managed under one coordinated Business
              Management Services relationship.
            </p>
          </>
        }
        actions={
          <>
            <ButtonLink href={siteConfig.cta.href} glow arrow>
              {siteConfig.cta.label}
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="outline-dark">
              How It Works
            </ButtonLink>
          </>
        }
      />
      <ServicesSection
        services={services}
        id="all-services"
        eyebrow={`${services.length} service categories`}
        title="The right specialists, coordinated through one partner."
        showAllLink={false}
      />
      <EngagementSection />
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
            name: "QuintByte Business Management Services",
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
            name: "Business Management Services",
            serviceType: "Business Management Services",
            provider: { "@id": organizationId },
            description,
          },
        ]}
      />
    </>
  );
}
