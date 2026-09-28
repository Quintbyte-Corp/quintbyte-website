import type { Metadata } from "next";
import { ModelEquation } from "@/components/about/ModelEquation";
import { LogoMark } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import {
  availabilityNote,
  clientFacingSummary,
  differentiator,
  separateRoles,
} from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description: `${clientFacingSummary[0]} ${clientFacingSummary[2]}`,
  alternates: { canonical: "/about" },
  openGraph: { title: "About | QuintByte", description: clientFacingSummary[0], url: "/about" },
};

const principleIcons: IconName[] = ["search", "extension", "task_alt"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About QuintByte"
        title={
          <>
            One business partner. The right specialists.{" "}
            <span className="text-accent">Clear accountability.</span>
          </>
        }
        lead={
          <>
            <p>{clientFacingSummary[0]}</p>
            <p>{clientFacingSummary[1]}</p>
          </>
        }
        actions={
          <>
            <ButtonLink href={siteConfig.cta.href} glow arrow>
              {siteConfig.cta.label}
            </ButtonLink>
            <ButtonLink href="/services" variant="outline-dark">
              Explore Services
            </ButtonLink>
          </>
        }
      />

      {/* The model */}
      <section aria-labelledby="model-title" className="bg-bg-2">
        <div className="shell flex flex-col gap-12 section-y">
          <Reveal className="flex max-w-[760px] flex-col gap-4">
            <Eyebrow>
              The QuintByte <span className="text-accent">model</span>
            </Eyebrow>
            <h2
              id="model-title"
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
              Coordinated Business Management Services.
            </h2>
            <p className="text-[17px] leading-[1.6] text-pretty text-mute">
              {clientFacingSummary[2]} It is more than traditional VA support: instead of only
              assigning individual tasks, QuintByte can help coordinate an agreed business function.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ModelEquation />
          </Reveal>
        </div>
      </section>

      <EcosystemSection showLink={false} />

      {/* What makes QuintByte different */}
      <section aria-labelledby="different-title" className="bg-light text-ink-dark">
        <div className="shell split section-y">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow tone="light">What makes QuintByte different</Eyebrow>
            <h2
              id="different-title"
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
              One relationship instead of many.
            </h2>
            <p className="max-w-[540px] text-[17px] leading-[1.6] text-pretty text-mute-light">
              {differentiator}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-frame border border-line bg-white p-6">
              <h3 className="text-sm font-bold text-mute-light">Coordinating it yourself</h3>
              <ul className="flex flex-col gap-2">
                {separateRoles.map((role) => (
                  <li
                    key={role}
                    className="rounded-chip border border-dashed border-line-3 px-3.5 py-2.5 text-sm font-semibold text-chip"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5 rounded-frame border border-accent/45 bg-bg p-6 text-ink shadow-[0_0_28px_rgb(34_199_255/0.22)]">
              <h3 className="text-sm font-bold text-mute-3">With QuintByte</h3>
              <LogoMark accent="#22c7ff" ink="#eef4f8" className="h-12 w-auto self-start" />
              <p className="text-[17px] leading-snug font-bold">
                One Business Management Services relationship
              </p>
              <ul className="mt-auto flex flex-col gap-2.5 text-sm text-mute">
                {siteConfig.tagline
                  .split(". ")
                  .map((line) => line.replace(/\.$/, ""))
                  .map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <Icon name="check_circle" className="shrink-0 text-lg text-accent" />
                      {line}
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Operating principle */}
      <section
        aria-labelledby="principle-title"
        className="border-t border-line-2 bg-white text-ink-dark"
      >
        <div className="shell flex flex-col gap-12 section-y">
          <Reveal className="flex max-w-[720px] flex-col gap-4">
            <Eyebrow tone="light">How we operate</Eyebrow>
            <h2
              id="principle-title"
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
              Responsible by design.
            </h2>
          </Reveal>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-7">
            {siteConfig.principle.map((line, i) => (
              <Reveal as="li" key={line} delay={i * 0.06} className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-line-step px-3.5 py-1.5 font-mono text-2xl font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--color-dash)_0_4px,transparent_4px_8px)]"
                  />
                </div>
                <Icon name={principleIcons[i]} className="text-[34px]" />
                <p className="text-xl leading-snug font-bold text-balance">{line}</p>
              </Reveal>
            ))}
          </ol>
          <p className="max-w-[760px] border-l-2 border-accent-light pl-4 text-sm leading-[1.6] text-mute-light">
            {availabilityNote}
          </p>
        </div>
      </section>

      <CtaSection
        title="You focus on running your business."
        body="We help manage the work that keeps it moving. Tell us what you're trying to achieve — we'll help define the right support."
      />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
