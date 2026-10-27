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
            Talk to <span className="qb-highlight">QuintByte.</span>
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
            <ol className="flex flex-col gap-6 pt-2">
              {nextSteps.map((step) => (
                <li key={step.num} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <span className="row-span-2 flex size-12 items-center justify-center self-start rounded-full border-2 border-slate bg-white text-lg font-black">
                    <span className="sr-only">Step </span>
                    {step.num}
                  </span>
                  <h3 className="flex items-center gap-2 pt-2 text-lg leading-6 font-extrabold">
                    <Icon name={step.icon} className="text-xl" />
                    {step.title}
                  </h3>
                  <p className="text-base leading-6 text-pretty">{step.summary}</p>
                </li>
              ))}
            </ol>
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
