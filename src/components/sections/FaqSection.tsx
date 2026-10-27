import { SvgIcon } from "@/components/icons/SvgIcon";
import { keyboardArrowDown } from "@/components/icons/ui-paths";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { type FaqPage, faqsFor } from "@/data/faq";

/**
 * Questions as native disclosure widgets (<details>): keyboard and screen-reader support
 * with no JavaScript. Emits FAQPage structured data for the same questions.
 */
export function FaqSection({
  page,
  title = "Frequently asked questions",
}: {
  page: FaqPage;
  title?: string;
}) {
  const items = faqsFor(page);
  if (items.length === 0) return null;
  const titleId = `faq-${page}-title`;

  return (
    <section aria-labelledby={titleId} className="border-t border-bluegray/50 bg-white">
      <div className="shell grid items-start gap-12 section-y lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col gap-4 lg:sticky lg:top-32 lg:col-span-5">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id={titleId} className="type-h2 text-balance">
            {title}
          </h2>
        </Reveal>

        <ul className="flex flex-col border-t border-bluegray lg:col-span-7">
          {items.map((faq) => (
            <li key={faq.question} className="border-b border-bluegray">
              <details className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg leading-7 font-extrabold [&::-webkit-details-marker]:hidden [&:hover>span]:decoration-cyan">
                  <span className="underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150">
                    {faq.question}
                  </span>
                  <SvgIcon
                    d={keyboardArrowDown}
                    className="mt-0.5 shrink-0 text-2xl transition-transform duration-150 group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-[680px] pb-6 type-body text-pretty">{faq.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
    </section>
  );
}
