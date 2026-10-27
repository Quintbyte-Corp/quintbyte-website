import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

type CtaSectionProps = {
  title?: string;
  body?: string;
};

/**
 * Closing call to action: a full-width Deep Slate band with the reversed tagline lockup
 * on the left and the heading and one white button on the right (brief, step 7).
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
    <section id="get-started" aria-labelledby="cta-title" className="qb-band bg-slate text-white">
      <div className="shell grid items-center gap-12 section-y lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Logo file="taglineReversed" height={96} className="h-auto w-full max-w-[268px]" />
        </div>

        <Reveal className="flex flex-col items-start gap-6 lg:col-span-7">
          <h2 id="cta-title" className="type-h2 text-balance">
            {title}
          </h2>
          <p className="max-w-[560px] type-body text-pretty">{body}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
            <ButtonLink href={siteConfig.cta.href} variant="inverse">
              {siteConfig.cta.label}
            </ButtonLink>
            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex min-h-12 items-center font-extrabold underline decoration-cyan decoration-2 underline-offset-4 transition-[text-decoration-thickness] duration-150 hover:decoration-[3px]"
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
