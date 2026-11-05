import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { absoluteUrl, siteConfig } from "@/config/site";
import { offerFor } from "@/data/offers";
import { photoFor } from "@/data/photos";
import { getService, relatedServices, services } from "@/data/services";
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
  const photo = photoFor(service.slug);

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
        lead={<p>{service.description}</p>}
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
            <StatusLabel slug={service.slug} />
          </>
        }
        photo={photo}
        photoLayout="aside"
      />

      {/* Best suited for: one mint panel under the hero */}
      <section aria-labelledby="suited-title" className="bg-white px-2 pt-6 sm:px-4 lg:px-6">
        <Reveal className="panel-wrap rounded-[32px] bg-mint px-[clamp(20px,4vw,56px)] py-[clamp(40px,5vw,80px)]">
          <div className="mx-auto grid max-w-[1328px] items-start gap-x-20 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <h2 id="suited-title" className="flex items-center gap-3 type-eyebrow">
              <Icon name={service.icon} className="shrink-0 text-2xl" />
              Best suited for
            </h2>
            <p className="text-[clamp(22px,2.4vw,34px)] leading-[1.3] font-black tracking-[-0.015em] text-pretty">
              {service.bestSuitedFor}
            </p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="scope-title" className="bg-white section-y">
        <div className="shell flex flex-col gap-10 lg:gap-16">
          <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-20 gap-y-6">
            <div className="flex flex-col gap-5">
              <Eyebrow>Scope</Eyebrow>
              <h2 id="scope-title" className="type-h2 text-balance">
                Services <span className="qb-highlight">may include</span>
              </h2>
            </div>
            <p className="max-w-[520px] text-[17px] leading-[1.6] text-pretty">
              Every engagement is scoped first. Before work begins, QuintByte confirms the
              responsibilities, expected outputs, access requirements, and delivery conditions.
            </p>
          </Reveal>
          {/* Scope ledger: what the service can include, numbered, in columns on wide screens */}
          <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,380px),1fr))] gap-x-12 border-t-2 border-slate">
            {service.items.map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[44px_1fr] items-baseline gap-3 border-b border-bluegray px-1 py-5"
              >
                <span
                  className="text-[13px] font-extrabold tracking-[0.12em] text-muted"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg leading-[1.35] font-extrabold lg:text-xl">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {offer ? (
        <section
          aria-labelledby="start-title"
          className="bg-white px-2 pb-[clamp(80px,10vw,144px)] sm:px-4 lg:px-6"
        >
          <div className="qb-band panel-wrap rounded-[32px] bg-slate px-[clamp(20px,4vw,56px)] py-[clamp(48px,7vw,112px)] text-white">
            <div className="mx-auto grid max-w-[1328px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-20 gap-y-12">
              <Reveal className="flex flex-col items-start gap-5">
                <Eyebrow className="text-white">How it starts</Eyebrow>
                <h2 id="start-title" className="type-h2 text-balance">
                  {offer.name}
                </h2>
                <p className="max-w-[520px] type-body text-pretty">{offer.howItStarts}</p>
                <ButtonLink
                  href={`${siteConfig.messageCta.href}?service=${service.slug}`}
                  variant="inverse"
                  className="font-black"
                >
                  Ask for a quote
                </ButtonLink>
              </Reveal>
              <Reveal delay={0.08} className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                  <h3 className="type-eyebrow text-mint">Typical deliverables</h3>
                  <ul className="flex flex-col gap-4">
                    {offer.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3.5 text-lg leading-[1.45] font-extrabold"
                      >
                        <Icon name="check" className="mt-1 shrink-0 text-xl text-cyan" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {offer.scenario ? (
                  <figure className="flex flex-col gap-2 rounded-[20px] border border-white/20 bg-white/[0.08] p-6 sm:p-7">
                    <figcaption className="type-eyebrow text-mint">
                      Example (illustrative)
                    </figcaption>
                    <p className="text-[17px] leading-[1.65] text-pretty">{offer.scenario}</p>
                  </figure>
                ) : null}
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      <ProcessSection eyebrow="How we deliver it" variant="grid" />

      <ServicesSection
        id="related"
        services={relatedServices(service)}
        eyebrow="Related services"
        title="Support that works well alongside this one."
        tone="white"
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
