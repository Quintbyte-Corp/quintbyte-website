import type { Metadata } from "next";
import { Icon } from "@/components/icons/Icon";
import { QBLoop } from "@/components/mascot/QBLoop";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { processObjective, processSteps } from "@/data/process";

export const metadata: Metadata = pageMetadata({
  title: "How It Works",
  description:
    "Understand, Scope, Confirm, Assign, Deliver, Review: the one clear process QuintByte follows for every engagement.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            Simple for you. <span className="qb-highlight">Structured behind the&nbsp;scenes.</span>
          </>
        }
        lead={
          <p>
            We follow a clear process to make sure you get the right support, the right people, and
            the right results.
          </p>
        }
        actions={<ButtonLink href={siteConfig.cta.href}>{siteConfig.cta.label}</ButtonLink>}
        aside={<QBLoop className="mx-auto max-w-[720px]" />}
      />

      <section aria-labelledby="detail-title" className="bg-paper">
        <div className="shell grid items-start gap-12 section-y lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-4 lg:sticky lg:top-32 lg:col-span-5">
            <Eyebrow>Six steps</Eyebrow>
            <h2 id="detail-title" className="type-h2 text-balance">
              Understand the business <span className="qb-highlight">first.</span>
            </h2>
            <ul className="flex flex-col gap-2 type-body">
              {siteConfig.principle.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Icon name="check" className="mt-1 shrink-0 text-lg" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>

          <ol className="flex flex-col lg:col-span-7">
            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.num}
                delay={i * 0.04}
                className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-bluegray py-8 first:pt-0 last:border-b-0"
              >
                <span className="row-span-2 flex size-12 items-center justify-center self-start rounded-full border-2 border-slate bg-white text-lg font-black">
                  <span className="sr-only">Step </span>
                  {step.num}
                </span>
                <h3 className="flex items-center gap-2 pt-2 type-h3">
                  <Icon name={step.icon} className="text-2xl" />
                  {step.title}
                </h3>
                <p className="type-body text-pretty">{step.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Our objective" className="border-t border-bluegray/50 bg-white">
        <div className="shell section-y">
          <Reveal>
            <blockquote className="max-w-[1000px] type-h2 text-balance">
              <p>
                {processObjective.split(". ")[0]}.{" "}
                <span className="qb-highlight">{processObjective.split(". ")[1]}</span>
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <FaqSection page="how-it-works" />
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
