import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSection";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { pagePhotos } from "@/data/photos";
import { processObjective } from "@/data/process";

export const metadata: Metadata = pageMetadata({
  title: "How It Works",
  description:
    "Understand, Scope, Confirm, Assign, Deliver, Review: the one clear process QuintByte follows for every engagement.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  const [objectiveLead, objectiveRest] = processObjective.split(". ");

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
        photo={pagePhotos.howItWorks}
      />

      <section aria-labelledby="detail-title" className="bg-white section-y">
        <div className="shell flex flex-col gap-12 lg:gap-20">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-20 gap-y-10">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow>Six steps</Eyebrow>
              <h2 id="detail-title" className="type-h2 text-balance">
                Understand the business <span className="qb-highlight">first.</span>
              </h2>
            </Reveal>
            <ol className="border-t-2 border-slate">
              {siteConfig.principle.map((line, i) => (
                <Reveal
                  as="li"
                  key={line}
                  delay={i * 0.06}
                  className="grid grid-cols-[56px_1fr] items-baseline gap-4 border-b border-bluegray py-5"
                >
                  <span aria-hidden className="text-[13px] font-extrabold tracking-[0.12em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(22px,2.2vw,32px)] leading-[1.2] font-black tracking-[-0.02em]">
                    {line}
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>

          <ProcessSteps detailed />
        </div>
      </section>

      <section
        aria-label="Our objective"
        className="bg-white px-2 pb-[clamp(80px,10vw,144px)] sm:px-4 lg:px-6"
      >
        <div className="panel-wrap rounded-[32px] bg-mint px-[clamp(20px,4vw,56px)] py-[clamp(56px,8vw,128px)]">
          <Reveal>
            <blockquote className="mx-auto max-w-[1200px] text-[clamp(30px,4vw,60px)] leading-[1.12] font-black tracking-[-0.025em] text-balance">
              <span aria-hidden className="mb-8 block h-1 w-12 bg-cyan" />
              <p>
                {objectiveLead}. <span className="text-muted">{objectiveRest}</span>
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
