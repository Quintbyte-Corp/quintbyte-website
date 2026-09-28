import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { type Service, serviceColor } from "@/data/services";

type ServicesSectionProps = {
  services: readonly Service[];
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

        <ServiceGrid services={services} />
      </div>
    </section>
  );
}

export function ServiceGrid({ services }: { services: readonly Service[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4">
      {services.map((service, i) => (
        <Reveal as="li" key={service.slug} delay={(i % 3) * 0.06} className="flex">
          <ServiceCard service={service} />
        </Reveal>
      ))}
    </ul>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="flex min-h-[170px] w-full flex-col gap-3.5 rounded-card border border-white/7 bg-card p-[26px] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 focus-visible:border-accent/50"
    >
      <Icon name={service.icon} className="text-[30px]" style={{ color: serviceColor(service) }} />
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[17px] font-bold text-ink">{service.title}</h3>
        <span className="text-sm leading-[1.55] text-pretty text-mute-2">{service.summary}</span>
      </div>
    </Link>
  );
}
