import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { OnRequestLabel, ServicesSection } from "@/components/sections/ServicesSection";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { absoluteUrl, siteConfig } from "@/config/site";
import { offerFor } from "@/data/offers";
import { getService, isOnRequest, relatedServices, services } from "@/data/services";
import { metaDescription, pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: metaDescription(service.description),
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const offer = offerFor(service.slug);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title, href: path },
        ]}
        eyebrow={`${String(service.number).padStart(2, "0")} · ${service.category}`}
        title={service.title}
        lead={
          <>
            <p>{service.description}</p>
            {isOnRequest(service.slug) ? <OnRequestLabel /> : null}
          </>
        }
        actions={
          <>
            {siteConfig.bookingUrl ? (
              <ButtonLink href={siteConfig.bookingUrl}>Book a call</ButtonLink>
            ) : null}
            {/* The message form opens with this service pre-selected */}
            {siteConfig.bookingUrl ? (
              <ArrowLink href={`${siteConfig.messageCta.href}?service=${service.slug}`}>
                {siteConfig.messageCta.label}
              </ArrowLink>
            ) : (
              <ButtonLink href={`${siteConfig.messageCta.href}?service=${service.slug}`}>
                {siteConfig.messageCta.label}
              </ButtonLink>
            )}
            <ArrowLink href="/services">All Services</ArrowLink>
          </>
        }
        aside={
          <aside
            aria-labelledby="suited-title"
            className="flex flex-col gap-4 rounded-card border border-bluegray bg-white p-8"
          >
            <Icon name={service.icon} className="text-[40px]" />
            <h2 id="suited-title" className="type-eyebrow">
              Best suited for
            </h2>
            <p className="type-h3 text-pretty">{service.bestSuitedFor}</p>
          </aside>
        }
      />

      <section aria-labelledby="scope-title" className="bg-paper">
        <div className="shell flex flex-col gap-12 section-y">
          <Reveal className="flex max-w-[760px] flex-col gap-4">
            <Eyebrow>Scope</Eyebrow>
            <h2 id="scope-title" className="type-h2 text-balance">
              Services <span className="qb-highlight">may include</span>
            </h2>
            <p className="type-body text-pretty">
              Every engagement is scoped first. Before work begins, QuintByte confirms the
              responsibilities, expected outputs, access requirements, and delivery conditions.
            </p>
          </Reveal>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,264px),1fr))] gap-2">
            {service.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-chip border border-bluegray bg-white px-4 py-3 text-base leading-6 font-extrabold"
              >
                <Icon name="check" className="mt-0.5 shrink-0 text-lg" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {offer ? (
        <section aria-labelledby="start-title" className="border-t border-bluegray/50 bg-white">
          <div className="shell grid items-start gap-12 section-y lg:grid-cols-12 lg:gap-16">
            <Reveal className="flex flex-col items-start gap-4 lg:col-span-5">
              <Eyebrow>How it starts</Eyebrow>
              <h2 id="start-title" className="type-h2 text-balance">
                {offer.name}
              </h2>
              <p className="type-body text-pretty">{offer.howItStarts}</p>
              <ArrowLink href={`${siteConfig.messageCta.href}?service=${service.slug}`}>
                Ask for a quote
              </ArrowLink>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col gap-8 lg:col-span-7">
              <div className="flex flex-col gap-4">
                <h3 className="type-eyebrow">Typical deliverables</h3>
                <ul className="flex flex-col gap-2 type-body">
                  {offer.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon name="check" className="mt-1 shrink-0 text-lg" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {offer.scenario ? (
                <figure className="flex flex-col gap-2 rounded-card border border-bluegray bg-paper p-6">
                  <figcaption className="type-eyebrow">Example (illustrative)</figcaption>
                  <p className="text-base leading-6 text-pretty">{offer.scenario}</p>
                </figure>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      <ProcessSection eyebrow="How we deliver it" />

      <ServicesSection
        id="related"
        services={relatedServices(service)}
        eyebrow="Related services"
        title="Support that works well alongside this one."
      />

      <CtaSection />

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            serviceType: service.title,
            category: service.category,
            description: service.description,
            url: absoluteUrl(path),
            provider: { "@id": organizationId },
            audience: { "@type": "BusinessAudience", audienceType: service.bestSuitedFor },
          },
        ]}
      />
    </>
  );
}
