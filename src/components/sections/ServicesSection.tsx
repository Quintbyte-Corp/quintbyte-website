import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowDot, ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { photoFor } from "@/data/photos";
import { type Service, otherServices, services, startHereServices } from "@/data/services";

type ServicesSectionProps = {
  /** The services to show as photo cards; omit to show them grouped or as one ledger */
  services?: readonly Service[];
  eyebrow?: string;
  title?: string;
  /** Shows "View All Services →" beside the heading */
  showAllLink?: boolean;
  id?: string;
  /** "grouped": "Start here" cards, then the rest as a ledger. "ledger": all 14 as rows. */
  layout?: "grouped" | "ledger";
  /** Ground colour of the section */
  tone?: "paper" | "white";
};

/** Services: photo cards, a numbered ledger, or both */
export function ServicesSection({
  services: picked,
  eyebrow = "Our services",
  title = "Comprehensive support for a better running business.",
  showAllLink = true,
  id = "services",
  layout = "grouped",
  tone = "paper",
}: ServicesSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`section-y ${tone === "paper" ? "border-t border-bluegray/50 bg-paper" : "bg-white"}`}
    >
      <div className="shell flex flex-col gap-10 lg:gap-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[900px] flex-col gap-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={titleId} className="type-h2 text-balance">
              {title}
            </h2>
          </div>
          {showAllLink ? <ArrowLink href="/services">View All Services</ArrowLink> : null}
        </Reveal>

        {picked ? (
          <ServiceGrid services={picked} />
        ) : layout === "ledger" ? (
          <ServiceLedger services={services} />
        ) : (
          <GroupedServices />
        )}
      </div>
    </section>
  );
}

/** All services: the three entry services first, then the rest (GDE-005 A6) */
function GroupedServices() {
  return (
    <div className="flex flex-col gap-14 lg:gap-20">
      <div className="flex flex-col gap-5">
        <h3 className="type-eyebrow text-muted">Start here</h3>
        <ServiceGrid services={startHereServices} heading="h4" />
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="type-eyebrow text-muted">Also available</h3>
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
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <Reveal as="li" key={service.slug} delay={(i % 3) * 0.06} className="flex">
          <ServiceCard service={service} heading={heading} />
        </Reveal>
      ))}
    </ul>
  );
}

/** A service as a photo card linking to its page */
export function ServiceCard({
  service,
  heading: Title = "h3",
}: {
  service: Service;
  heading?: Heading;
}) {
  const photo = photoFor(service.slug);
  return (
    <Link
      href={`/services/${service.slug}`}
      data-event="service_card_click"
      data-event-label={service.slug}
      className="group flex w-full flex-col overflow-hidden rounded-card border border-bluegray/60 bg-white transition-[translate,box-shadow] duration-400 ease-qb hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(51,74,82,0.35)]"
    >
      {photo ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-mint">
          <Image
            src={photo.src}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-qb group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6 pb-7">
        <StatusLabel slug={service.slug} />
        <Title className="text-[clamp(22px,2vw,28px)] leading-[1.15] font-black tracking-[-0.015em]">
          {service.title}
        </Title>
        <span className="flex-1 text-base leading-[1.55] text-pretty">{service.summary}</span>
        <span className="flex items-center gap-2.5 pt-1 font-extrabold">
          View service <ArrowDot className="size-8" />
        </span>
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
    <ul className="border-t-2 border-slate">
      {services.map((service, i) => (
        <Reveal as="li" key={service.slug} delay={(i % 6) * 0.03}>
          <Link
            href={`/services/${service.slug}`}
            data-event="service_card_click"
            data-event-label={service.slug}
            className="group grid items-center gap-x-6 gap-y-2 border-b border-bluegray px-3 py-5 transition-[background-color,padding] duration-300 ease-qb hover:bg-mint sm:grid-cols-[48px_1fr] lg:grid-cols-[56px_minmax(0,1.3fr)_minmax(0,1fr)_auto_44px] lg:hover:pl-7"
          >
            <span className="text-[13px] font-extrabold tracking-[0.12em]" aria-hidden>
              {String(service.number).padStart(2, "0")}
            </span>
            <span className="text-[clamp(20px,2.1vw,30px)] leading-[1.15] font-black tracking-[-0.02em]">
              {service.title}
            </span>
            <span className="text-base leading-[1.5] text-pretty sm:col-start-2 lg:col-start-auto">
              {service.summary}
            </span>
            <StatusLabel slug={service.slug} className="sm:col-start-2 lg:col-start-auto" />
            <span
              aria-hidden
              className="hidden size-11 items-center justify-center rounded-full border border-slate font-extrabold transition-colors duration-300 group-hover:bg-slate group-hover:text-white lg:inline-flex"
            >
              →
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
