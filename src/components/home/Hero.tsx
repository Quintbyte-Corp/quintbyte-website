import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { CoordinationDiagram } from "./CoordinationDiagram";

/**
 * White hero, no glow or gradient (brief, step 7). Order of attention: headline, then the
 * paragraph, then the one button; the coordination diagram sits in the right column.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-white">
      <div className="shell grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <Eyebrow as="span">Business Management Services</Eyebrow>
          <h1 id="hero-title" className="type-hero text-balance text-slate">
            <span className="block">Hire one person.</span>{" "}
            <span className="qb-highlight">Get a whole company behind them.</span>
          </h1>
          {/* Headline and sub-line: GDE-005 C1 */}
          <p className="max-w-[560px] type-body text-pretty">
            QuintByte is a Business Management Services team. Instead of hiring and managing
            separate freelancers, you get the right specialists coordinated under one accountable
            partner.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
            <ButtonLink href={siteConfig.cta.href}>{siteConfig.cta.label}</ButtonLink>
            <ArrowLink href="/how-it-works">See how it works</ArrowLink>
          </div>
        </div>

        <CoordinationDiagram className="mx-auto max-w-[560px] lg:col-span-6" />
      </div>
    </section>
  );
}
