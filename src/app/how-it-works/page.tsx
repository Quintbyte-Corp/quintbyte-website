import type { Metadata } from "next";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { processObjective, processSteps } from "@/data/process";

const description =
  "We follow a clear process to make sure you get the right support, the right people, and the right results: Understand, Scope, Confirm, Assign, Deliver, Review.";

export const metadata: Metadata = {
  title: "How It Works",
  description,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: "How It Works | QuintByte", description, url: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            Simple for you. <span className="text-accent">Structured behind the scenes.</span>
          </>
        }
        lead={
          <p>
            We follow a clear process to make sure you get the right support, the right people, and
            the right results.
          </p>
        }
        actions={
          <ButtonLink href={siteConfig.cta.href} glow arrow>
            {siteConfig.cta.label}
          </ButtonLink>
        }
      />

      <ProcessSection
        id="steps"
        eyebrow="Six steps"
        title="Understand. Scope. Confirm. Assign. Deliver. Review."
        body="Every engagement moves through the same structure, whether it is one specific service, a project-based solution, or a combination of functions."
      />

      <section aria-labelledby="detail-title" className="bg-light text-ink-dark">
        <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(36px,5vw,72px)] section-y">
          <Reveal className="flex flex-col gap-5 nav:sticky nav:top-28">
            <Eyebrow tone="light">In detail</Eyebrow>
            <h2
              id="detail-title"
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
              Understand the business first.
            </h2>
            <ul className="flex flex-col gap-2 text-[17px] leading-[1.6] text-mute-light">
              {siteConfig.principle.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Icon name="check" className="mt-1 shrink-0 text-lg text-accent-light" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>

          <ol className="flex flex-col">
            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.num}
                delay={i * 0.04}
                className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-b border-dashed border-dash py-7 first:pt-0 last:border-b-0"
              >
                <span className="row-span-2 self-start rounded-full border border-line-step bg-white px-3.5 py-1.5 font-mono text-xl font-medium">
                  <span className="sr-only">Step </span>
                  {step.num}
                </span>
                <h3 className="flex items-center gap-2.5 pt-1.5 text-xl font-bold">
                  <Icon name={step.icon} className="text-2xl text-accent-light" />
                  {step.title}
                </h3>
                <p className="text-base leading-[1.6] text-pretty text-mute-light">{step.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Our objective" className="bg-bg">
        <div className="shell section-y">
          <Reveal>
            <blockquote className="mx-auto max-w-[980px] text-center text-[clamp(24px,3vw,40px)] leading-[1.25] font-bold tracking-[-0.02em] text-balance">
              <p>
                {processObjective.split(". ")[0]}.{" "}
                <span className="text-accent">{processObjective.split(". ")[1]}</span>
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <CtaSection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" },
        ])}
      />
    </>
  );
}
