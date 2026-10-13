import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema, organizationId } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { absoluteUrl, siteConfig } from "@/config/site";
import { offerFor } from "@/data/offers";
import {
  ON_REQUEST_LABEL,
  getService,
  isOnRequest,
  relatedServices,
  serviceColor,
  services,
} from "@/data/services";
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
  const color = serviceColor(service);
  const offer = offerFor(service.slug);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title, href: path },
        ]}
        eyebrow={
          <span className="flex items-center gap-3">
            <span className="font-mono tracking-normal text-accent">
              {String(service.number).padStart(2, "0")}
            </span>
            {service.category}
          </span>
        }
        title={service.title}
        lead={
          <>
            <p>{service.description}</p>
            {isOnRequest(service.slug) ? (
              <p className="self-start rounded-full border border-accent/40 bg-accent/8 px-3.5 py-1.5 text-sm font-semibold text-accent-soft">
                {ON_REQUEST_LABEL}
              </p>
            ) : null}
          </>
        }
        actions={
          <>
            {siteConfig.bookingUrl ? (
              <ButtonLink href={siteConfig.bookingUrl} glow arrow>
                Book a call
              </ButtonLink>
            ) : null}
            {/* The message form opens with this service pre-selected */}
            <ButtonLink
              href={`${siteConfig.messageCta.href}?service=${service.slug}`}
              variant={siteConfig.bookingUrl ? "outline-dark" : "primary"}
              glow={!siteConfig.bookingUrl}
              arrow={!siteConfig.bookingUrl}
            >
              {siteConfig.messageCta.label}
            </ButtonLink>
            <ButtonLink href="/services" variant="outline-dark">
              All Services
            </ButtonLink>
          </>
        }
        aside={
          <aside
            aria-labelledby="suited-title"
            className="relative flex flex-col gap-5 overflow-hidden rounded-frame border border-accent/40 bg-node p-[clamp(24px,3vw,36px)] shadow-node"
          >
            <span
              aria-hidden
              className="flex size-16 items-center justify-center rounded-2xl border border-accent/40 bg-card shadow-node"
            >
              <Icon name={service.icon} className="text-[34px]" style={{ color }} />
            </span>
            <h2
              id="suited-title"
              className="text-xs font-bold tracking-[1.4px] text-mute-3 uppercase"
            >
              Best suited for
            </h2>
            <p className="text-[clamp(18px,1.7vw,22px)] leading-[1.45] font-semibold text-pretty text-ink">
              {service.bestSuitedFor}
            </p>
          </aside>
        }
      />

      <section aria-labelledby="scope-title" className="bg-light text-ink-dark">
        <div className="shell flex flex-col gap-10 section-y">
          <Reveal className="flex max-w-[720px] flex-col gap-4">
            <Eyebrow tone="light">Scope</Eyebrow>
            <h2
              id="scope-title"
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
              Services may include
            </h2>
            <p className="text-[17px] leading-[1.6] text-pretty text-mute-light">
              Every engagement is scoped first. Before work begins, QuintByte confirms the
              responsibilities, expected outputs, access requirements, and delivery conditions.
            </p>
          </Reveal>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-2.5">
            {service.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-chip border border-line bg-white px-4 py-3 text-[15px] leading-snug font-semibold text-chip"
              >
                <Icon name="check" className="mt-px shrink-0 text-lg text-accent-light" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {offer ? (
        <section aria-labelledby="start-title" className="border-t border-white/5 bg-bg">
          <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,72px)] section-y">
            <Reveal className="flex flex-col items-start gap-5">
              <Eyebrow>How it starts</Eyebrow>
              <h2
                id="start-title"
                className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
              >
                {offer.name}
              </h2>
              <p className="text-[17px] leading-[1.6] text-pretty text-mute">{offer.howItStarts}</p>
              <ButtonLink
                href={`${siteConfig.messageCta.href}?service=${service.slug}`}
                variant="outline-dark"
                arrow
              >
                Ask for a quote
              </ButtonLink>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold tracking-[1.4px] text-mute-3 uppercase">
                  Typical deliverables
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {offer.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <Icon name="check" className="mt-0.5 shrink-0 text-lg text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {offer.scenario ? (
                <figure className="flex flex-col gap-2 rounded-card border border-white/8 bg-card p-5">
                  <figcaption className="text-xs font-bold tracking-[1.4px] text-mute-3 uppercase">
                    Example (illustrative)
                  </figcaption>
                  <p className="text-[15px] leading-[1.6] text-pretty text-mute">
                    {offer.scenario}
                  </p>
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
