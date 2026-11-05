import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

type CtaSectionProps = {
  title?: string;
  body?: string;
};

/**
 * Closing call to action: a full-width Deep Slate band with the headline at its largest,
 * then the line and one white button. The footer continues the band below it.
 */
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
    <section
      id="get-started"
      aria-labelledby="cta-title"
      className="qb-band overflow-hidden bg-slate pt-[clamp(80px,11vw,168px)] pb-[clamp(64px,8vw,120px)] text-white"
    >
      <div className="shell">
        <Reveal>
          <h2 id="cta-title" className="type-band text-balance">
            {title}
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-20 gap-y-10 lg:mt-[72px]">
          <Reveal>
            <p className="max-w-[600px] text-lg leading-[1.55] text-pretty lg:text-[22px]">
              {body}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink
              href={siteConfig.cta.href}
              variant="inverse"
              className="min-h-[60px] px-8 text-[17px] font-black"
            >
              {siteConfig.cta.label}
            </ButtonLink>
            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex min-h-12 items-center font-extrabold underline decoration-cyan decoration-2 underline-offset-[6px] transition-[text-decoration-thickness] duration-150 hover:decoration-[3px]"
              >
                {secondary.label}
              </a>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
