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
      />

      <WhyWeExist />

      {/* The model */}
      <section aria-labelledby="model-title" className="border-t border-bluegray/50 bg-white">
        <div className="shell flex flex-col gap-12 section-y">
          <Reveal className="flex max-w-[760px] flex-col gap-4">
            <Eyebrow>The QuintByte model</Eyebrow>
            <h2 id="model-title" className="type-h2 text-balance">
              One coordinated service firm.
            </h2>
            <p className="type-body text-pretty">
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
      <section aria-labelledby="different-title" className="border-y border-bluegray/50 bg-paper">
        <div className="shell split section-y">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow>What makes QuintByte different</Eyebrow>
            <h2 id="different-title" className="type-h2 text-balance">
              One relationship <span className="qb-highlight">instead of many.</span>
            </h2>
            <p className="max-w-[560px] type-body text-pretty">{differentiator}</p>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-card border border-bluegray bg-white p-6">
              <h3 className="type-eyebrow">Coordinating it yourself</h3>
              <ul className="flex flex-col gap-2">
                {separateRoles.map((role) => (
                  <li
                    key={role}
                    className="rounded-chip border border-dashed border-bluegray px-4 py-2 text-base font-extrabold"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-card border-2 border-slate bg-white p-6">
              <h3 className="type-eyebrow">With QuintByte</h3>
              <Logo file="mark" height={48} className="self-start" />
              <p className="text-lg leading-6 font-extrabold">One accountable relationship</p>
              <ul className="mt-auto flex flex-col gap-2 text-base">
                {withQuintByte.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <Icon name="check_circle" className="shrink-0 text-lg" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Operating principle */}
      <section aria-labelledby="principle-title" className="bg-white">
        <div className="shell flex flex-col gap-12 section-y">
          <Reveal className="flex max-w-[760px] flex-col gap-4">
            <Eyebrow>How we operate</Eyebrow>
            <h2 id="principle-title" className="type-h2 text-balance">
              Responsible <span className="qb-highlight">by design.</span>
            </h2>
          </Reveal>
          <ol className="grid gap-8 md:grid-cols-3">
            {siteConfig.principle.map((line, i) => (
              <Reveal as="li" key={line} delay={i * 0.06} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-slate text-lg font-black">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-0.5 flex-1 bg-bluegray" />
                </div>
                <Icon name={principleIcons[i]} className="text-[32px]" />
                <p className="type-h3 text-balance">{line}</p>
              </Reveal>
            ))}
          </ol>
          <p className="max-w-[760px] border-l-2 border-cyan pl-4 text-base leading-6">
            {availabilityNote}
          </p>
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
