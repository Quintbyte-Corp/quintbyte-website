import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { type Service, otherServices, serviceColor, startHereServices } from "@/data/services";

type ServicesSectionProps = {
  /** The services to show; omit to show all of them grouped as "Start here" / "Also available" */
  services?: readonly Service[];
  eyebrow?: string;
  title?: string;
  /** Shows "View All Services →" beside the heading */
  showAllLink?: boolean;
  id?: string;
};

/** Dark services grid (README §6) */
export function ServicesSection({
  services,
  eyebrow = "Our services",
  title = "Comprehensive support for a better running business.",
  showAllLink = true,
  id = "services",
}: ServicesSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-white/5 bg-bg-2">
      <div className="shell flex flex-col gap-11 py-[clamp(64px,8vw,104px)]">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex max-w-[680px] flex-col gap-4">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id={titleId}
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
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
      <div className="flex flex-col gap-5">
        <h3 className="font-mono text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
          Start here
        </h3>
        <ServiceGrid services={startHereServices} heading="h4" />
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="font-mono text-[13px] font-medium tracking-[0.14em] text-mute-2 uppercase">
          Also available
        </h3>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-3">
          {otherServices.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={(i % 4) * 0.04} className="flex">
              <ServiceCard service={service} heading="h4" compact />
            </Reveal>
          ))}
        </ul>
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
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
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
      className={`flex w-full rounded-card border border-white/7 bg-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 focus-visible:border-accent/50 ${
        compact ? "items-start gap-3.5 p-[18px]" : "min-h-[170px] flex-col gap-3.5 p-[26px]"
      }`}
    >
      <Icon
        name={service.icon}
        className={compact ? "mt-0.5 shrink-0 text-2xl" : "text-[30px]"}
        style={{ color: serviceColor(service) }}
      />
      <div className="flex flex-col gap-1">
        <Title className={`font-bold text-ink ${compact ? "text-[15px]" : "text-[17px]"}`}>
          {service.title}
        </Title>
        <span
          className={`leading-[1.55] text-pretty text-mute-2 ${compact ? "text-[13px]" : "text-sm"}`}
        >
          {service.summary}
        </span>
      </div>
    </Link>
  );
}
