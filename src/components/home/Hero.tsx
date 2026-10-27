import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { heroParagraph } from "@/data/claims";
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
          <Eyebrow as="span">QuintByte (QB) · A service firm</Eyebrow>
          <h1 id="hero-title" className="type-hero text-balance text-slate">
            <span className="block">Hire one person.</span> Get a{" "}
            <span className="qb-highlight whitespace-nowrap">whole firm</span> behind them.
          </h1>
          {/* Copy: rebrand brief, 24 Oct 2026 (Home: hero) */}
          <p className="max-w-[560px] type-body text-pretty">{heroParagraph}</p>
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
