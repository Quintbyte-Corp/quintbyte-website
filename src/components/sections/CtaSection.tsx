import Image from "next/image";
import office from "@/assets/images/office.webp";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

type CtaSectionProps = {
  title?: string;
  body?: string;
};

/** "Ready to get started?" — light CTA with the office photo (README §7) */
export function CtaSection({
  title = "Ready to get started?",
  body = "You don't need to know exactly which service you need. Tell us what you're trying to achieve — we'll help define the right support.",
}: CtaSectionProps) {
  // Secondary action: the message form when "Book a call" leads, otherwise a direct email
  // link once the address is confirmed (never an unverified address).
  const secondary = siteConfig.bookingUrl
    ? siteConfig.messageCta
    : siteConfig.contactEmail
      ? { label: "Email us", href: `mailto:${siteConfig.contactEmail}` }
      : null;

  return (
    <section id="get-started" aria-labelledby="cta-title" className="bg-light text-ink-dark">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(36px,5vw,64px)] section-y">
        <Reveal className="flex flex-col items-start gap-5">
          <h2
            id="cta-title"
            className="text-[clamp(32px,3.8vw,52px)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance"
          >
            {title}
          </h2>
          <p className="max-w-[480px] text-[17px] leading-[1.6] text-pretty text-mute-light">
            {body}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3.5">
            <ButtonLink href={siteConfig.cta.href} arrow>
              {siteConfig.cta.label}
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="outline-light">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-frame bg-line">
            <Image
              src={office}
              alt="A QuintByte meeting room with the qb logo on a glass wall"
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
