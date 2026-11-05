import type { Metadata } from "next";
import { ModelEquation } from "@/components/about/ModelEquation";
import { TeamSection } from "@/components/about/TeamSection";
import { WhyWeExist } from "@/components/about/WhyWeExist";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { CtaSection } from "@/components/sections/CtaSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { pagePhotos } from "@/data/photos";
import {
  availabilityNote,
  clientFacingSummary,
  differentiator,
  separateRoles,
} from "@/data/company";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "QuintByte helps businesses manage the work behind the business, coordinating the right people, processes and deliverables under one accountable partner.",
  path: "/about",
});

const principleIcons: IconName[] = ["search", "extension", "task_alt"];

/** What one relationship gives you (formerly the old tagline, retired in the rebrand) */
const withQuintByte = ["One point of contact", "The right specialists", "Clear accountability"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About QuintByte"
        title={
          <>
            Think First. <span className="qb-highlight">Then Execute.</span>
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
            <ButtonLink href={siteConfig.cta.href}>{siteConfig.cta.label}</ButtonLink>
            <ArrowLink href="/services">Explore Services</ArrowLink>
          </>
        }
        photo={pagePhotos.about}
      />

      <WhyWeExist />

      {/* The model */}
      <section aria-labelledby="model-title" className="qb-band bg-slate section-y text-white">
        <div className="shell flex flex-col gap-12 lg:gap-16">
          <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-x-20 gap-y-6">
            <div className="flex flex-col gap-5">
              <Eyebrow>The QuintByte model</Eyebrow>
              <h2 id="model-title" className="type-h2 text-balance">
                One coordinated service firm.
              </h2>
            </div>
            <p className="max-w-[600px] text-lg leading-[1.6] text-pretty lg:text-[21px]">
              {clientFacingSummary[2]} It is more than traditional VA support: instead of only
              assigning individual tasks, QuintByte can help coordinate an agreed business function.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ModelEquation />
          </Reveal>
        </div>
      </section>

      <div aria-hidden className="h-[clamp(80px,10vw,144px)]" />
      <EcosystemSection showLink={false} />

      {/* What makes QuintByte different */}
      <section aria-labelledby="different-title" className="bg-white pb-[clamp(80px,10vw,144px)]">
        <div className="shell split">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow>What makes QuintByte different</Eyebrow>
            <h2 id="different-title" className="type-h2 text-balance">
              One relationship <span className="qb-highlight">instead of many.</span>
            </h2>
            <p className="max-w-[560px] type-body text-pretty">{differentiator}</p>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-5 rounded-card border border-bluegray/60 bg-paper p-6 sm:p-8">
              <h3 className="type-eyebrow text-muted">Coordinating it yourself</h3>
              <ul className="flex flex-col gap-2.5">
                {separateRoles.map((role) => (
                  <li
                    key={role}
                    className="rounded-full border border-dashed border-bluegray bg-white px-5 py-2.5 text-base font-extrabold"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <div className="qb-band flex flex-col gap-5 rounded-card bg-slate p-6 text-white sm:p-8">
              <h3 className="type-eyebrow text-mint">With QuintByte</h3>
              <Logo file="markReversed" height={48} className="self-start" />
              <p className="text-[clamp(26px,2.6vw,36px)] leading-[1.05] font-black tracking-[-0.02em]">
                One accountable relationship
              </p>
              <ul className="mt-auto flex flex-col gap-3 text-lg font-extrabold">
                {withQuintByte.map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <Icon name="check_circle" className="shrink-0 text-xl text-cyan" />
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
        className="border-y border-bluegray/50 bg-paper section-y"
      >
        <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-20 gap-y-10">
          <Reveal className="flex flex-col gap-5 lg:sticky lg:top-28">
            <Eyebrow>How we operate</Eyebrow>
            <h2 id="principle-title" className="type-h2 text-balance">
              Responsible <span className="qb-highlight">by design.</span>
            </h2>
            <p className="mt-3 max-w-[480px] rounded-r-xl border-l-[3px] border-cyan bg-white px-6 py-5 text-base leading-[1.6]">
              {availabilityNote}
            </p>
          </Reveal>
          <ol className="border-b border-bluegray">
            {siteConfig.principle.map((line, i) => (
              <Reveal
                as="li"
                key={line}
                delay={i * 0.06}
                className="grid grid-cols-[56px_1fr] items-center gap-4 border-t border-bluegray py-7 sm:grid-cols-[72px_auto_1fr]"
              >
                <span className="text-[13px] font-extrabold tracking-[0.12em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={principleIcons[i]} className="hidden text-[32px] sm:block" />
                <span className="text-[clamp(26px,3vw,44px)] leading-[1.1] font-black tracking-[-0.025em] text-balance">
                  {line}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <TeamSection />

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
