import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon } from "@/components/icons/Icon";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { pageMetadata } from "@/lib/metadata";
import { processSteps } from "@/data/process";
import { NOT_SURE } from "@/lib/contact/constants";
import { interestOptions } from "@/lib/contact/schema";

const description =
  "You don't need to know exactly which service you need. Tell us what you're trying to achieve — we'll help define the right support.";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell us what you're trying to achieve. We reply within one business day with a few questions or times for a short call.",
  path: "/contact",
});

/** The first three steps are what happens after someone gets in touch */
const nextSteps = processSteps.slice(0, 3);

export default async function ContactPage(props: PageProps<"/contact">) {
  const { service } = await props.searchParams;
  const preselected =
    typeof service === "string" && interestOptions.some((o) => o.value === service)
      ? service
      : NOT_SURE;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to <span className="text-accent">QuintByte.</span>
          </>
        }
        lead={<p>{description}</p>}
      />

      <section aria-label="Contact form" className="bg-light text-ink-dark">
        <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(36px,5vw,64px)] section-y nav:grid-cols-[1.45fr_1fr]">
          <ContactForm options={interestOptions} defaultInterest={preselected} />

          <aside aria-labelledby="next-title" className="flex flex-col gap-6">
            <Eyebrow tone="light">What happens next</Eyebrow>
            <h2
              id="next-title"
              className="text-[clamp(26px,2.6vw,34px)] leading-[1.15] font-extrabold tracking-[-0.03em] text-balance"
            >
              Understand the business first.
            </h2>
            <ol className="flex flex-col gap-5">
              {nextSteps.map((step) => (
                <li key={step.num} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <span className="row-span-2 self-start rounded-full border border-line-step bg-white px-3 py-1 font-mono text-base font-medium">
                    <span className="sr-only">Step </span>
                    {step.num}
                  </span>
                  <h3 className="flex items-center gap-2 pt-1 text-[17px] font-bold">
                    <Icon name={step.icon} className="text-xl text-accent-light" />
                    {step.title}
                  </h3>
                  <p className="text-sm leading-[1.55] text-pretty text-mute-light">
                    {step.summary}
                  </p>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <h2 className="text-lg font-extrabold tracking-[-0.01em]">Contact details</h2>
              <ContactDetails tone="light" className="text-[15px]" />
            </div>
          </aside>
        </div>
      </section>

      <FaqSection page="contact" />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}
