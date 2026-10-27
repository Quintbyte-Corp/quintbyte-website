import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rail, RailItem } from "@/components/ui/Rail";
import { pageMetadata } from "@/lib/metadata";
import { processSteps } from "@/data/process";
import { NOT_SURE } from "@/lib/contact/constants";
import { interestOptions } from "@/lib/contact/schema";

/** Intro: rebrand brief, 24 Oct 2026 (Contact page) */
const description =
  "You don't need to pick a service. Describe the goal, and we'll think it through first, then tell you how we'd execute it. We reply within one business day.";

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
            Tell us what you&rsquo;re trying to <span className="qb-highlight">get done.</span>
          </>
        }
        lead={<p>{description}</p>}
      />

      <section aria-label="Contact form" className="bg-paper">
        <div className="shell grid items-start gap-12 section-y lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm options={interestOptions} defaultInterest={preselected} />
          </div>

          <aside aria-labelledby="next-title" className="flex flex-col gap-4 lg:col-span-5">
            <Eyebrow>What happens next</Eyebrow>
            <h2 id="next-title" className="type-h3 text-balance">
              Understand the business first.
            </h2>
            {/* Contact rail: you first (the apricot client node), then the first three steps */}
            <Rail count={nextSteps.length + 1} className="pt-2">
              <RailItem node="client" className="flex flex-col gap-1">
                <h3 className="text-lg leading-6 font-extrabold">You</h3>
                <p className="text-base leading-6 text-pretty">Describe the goal.</p>
              </RailItem>
              {nextSteps.map((step) => (
                <RailItem
                  key={step.num}
                  node={step.checkpoint ? "checkpoint" : "step"}
                  className="flex flex-col gap-1"
                >
                  <h3 className="text-lg leading-6 font-extrabold">
                    <span className="sr-only">Step </span>
                    {step.num} {step.title}
                  </h3>
                  <p className="text-base leading-6 text-pretty">{step.summary}</p>
                </RailItem>
              ))}
            </Rail>
            <div className="mt-4 flex flex-col gap-4 border-t border-bluegray pt-8">
              <h2 className="type-h3">Contact details</h2>
              <ContactDetails />
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
