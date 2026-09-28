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
import { getService, relatedServices, serviceColor, services } from "@/data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  const path = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${service.title} | QuintByte`,
      description: service.description,
      url: path,
    },
  };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const color = serviceColor(service);

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
        lead={<p>{service.description}</p>}
        actions={
          <>
            <ButtonLink href={`${siteConfig.cta.href}?service=${service.slug}`} glow arrow>
              {siteConfig.cta.label}
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
