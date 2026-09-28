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
            Your business has enough <span className="text-accent">moving parts.</span>
          </h1>
          <p className="max-w-[520px] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-pretty text-mute">
            You shouldn&rsquo;t have to manage all of them alone. QuintByte brings together the
            people, systems, and support your business needs — managed through one coordinated
            partnership.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href={siteConfig.cta.href} glow arrow>
              {siteConfig.cta.label}
            </ButtonLink>
            <ButtonLink href="#services" variant="outline-dark">
              Explore Services
            </ButtonLink>
          </div>
        </div>

        <OrbitDiagram />
      </div>
    </section>
  );
}
