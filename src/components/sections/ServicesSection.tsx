import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { type Service, otherServices, startHereServices } from "@/data/services";

type ServicesSectionProps = {
  /** The services to show; omit to show all of them grouped as "Start here" / "Also available" */
  services?: readonly Service[];
  eyebrow?: string;
  title?: string;
  /** Shows "View All Services →" beside the heading */
  showAllLink?: boolean;
  id?: string;
};

/** Services grid on the near-white ground */
export function ServicesSection({
  services,
  eyebrow = "Our services",
  title = "Comprehensive support for a better running business.",
  showAllLink = true,
  id = "services",
}: ServicesSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-bluegray/50 bg-paper">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[760px] flex-col gap-4">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={titleId} className="type-h2 text-balance">
              {title}
            </h2>
          </div>
          {showAllLink ? <ArrowLink href="/services">View All Services</ArrowLink> : null}
        </Reveal>

        {services ? <ServiceGrid services={services} /> : <GroupedServices />}
      </div>
    </section>
  );
}

/** All services: the three entry services first, then the rest (GDE-005 A6) */
function GroupedServices() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="type-eyebrow">Start here</h3>
        <ServiceGrid services={startHereServices} heading="h4" />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="type-eyebrow">Also available</h3>
        <ServiceLedger services={otherServices} />
      </div>
    </div>
  );
}

type Heading = "h3" | "h4";

export function ServiceGrid({
  services,
  heading,
}: {
  services: readonly Service[];
  heading?: Heading;
}) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,296px),1fr))] gap-4">
      {services.map((service, i) => (
        <Reveal as="li" key={service.slug} delay={(i % 3) * 0.06} className="flex">
          <ServiceCard service={service} heading={heading} />
        </Reveal>
      ))}
    </ul>
  );
}

export function ServiceCard({
  service,
  heading: Title = "h3",
  compact = false,
}: {
  service: Service;
  heading?: Heading;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      data-event="service_card_click"
      data-event-label={service.slug}
      className={`group flex w-full rounded-card border border-bluegray bg-white transition-[border-color] duration-150 hover:border-slate ${
        compact ? "items-start gap-4 p-4" : "min-h-[176px] flex-col gap-4 p-6"
      }`}
    >
      <Icon name={service.icon} className={compact ? "mt-0.5 shrink-0 text-2xl" : "text-[32px]"} />
      <div className="flex flex-1 flex-col gap-1">
        <Title
          className={`font-extrabold underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-cyan ${
            compact ? "text-base leading-6" : "text-lg leading-6"
          }`}
        >
          {service.title}
        </Title>
        <span className={`text-pretty ${compact ? "text-sm leading-5" : "text-base leading-6"}`}>
          {service.summary}
        </span>
        <StatusLabel slug={service.slug} className="mt-auto pt-2" />
      </div>
    </Link>
  );
}

/**
 * Scope ledger: services as numbered rows with their status, one line each on wide
 * screens. Each row links to the service page.
 */
export function ServiceLedger({ services }: { services: readonly Service[] }) {
  return (
    <ul className="border-t border-bluegray">
      {services.map((service, i) => (
        <Reveal
          as="li"
          key={service.slug}
          delay={(i % 6) * 0.03}
          className="border-b border-bluegray"
        >
          <Link
            href={`/services/${service.slug}`}
            data-event="service_card_click"
            data-event-label={service.slug}
            className="group grid gap-x-6 gap-y-2 px-2 py-4 transition-colors duration-150 hover:bg-white sm:grid-cols-[48px_1fr] lg:grid-cols-[48px_minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)] lg:items-baseline"
          >
            <span className="type-eyebrow" aria-hidden>
              {String(service.number).padStart(2, "0")}
            </span>
            <span className="text-lg leading-6 font-extrabold underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-cyan">
              {service.title}
            </span>
            <span className="text-base leading-6 text-pretty sm:col-start-2 lg:col-start-auto">
              {service.summary}
            </span>
            <StatusLabel slug={service.slug} className="sm:col-start-2 lg:col-start-auto" />
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
