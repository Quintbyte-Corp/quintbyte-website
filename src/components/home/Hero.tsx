import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { OrbitDiagram } from "./OrbitDiagram";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative bg-[radial-gradient(ellipse_60%_70%_at_72%_45%,rgb(34_150_255/0.16),transparent_70%)]"
    >
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(40px,5vw,72px)] py-[clamp(48px,7vw,96px)]">
        <div className="flex flex-col items-start gap-7">
          <Eyebrow tone="pill" as="span">
            Business Management Services
          </Eyebrow>
          <h1
            id="hero-title"
            className="text-[clamp(42px,5.6vw,76px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance"
          >
            Hire one person. <span className="text-accent">Get a whole company behind them.</span>
          </h1>
          {/* Headline and sub-line: GDE-005 C1 */}
          <p className="max-w-[520px] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-pretty text-mute">
            QuintByte is a Business Management Services team. Instead of hiring and managing
            separate freelancers, you get the right specialists coordinated under one accountable
            partner.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href={siteConfig.cta.href} glow arrow>
              {siteConfig.cta.label}
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="outline-dark">
              See how it works
            </ButtonLink>
          </div>
        </div>

        <OrbitDiagram />
      </div>
    </section>
  );
}
