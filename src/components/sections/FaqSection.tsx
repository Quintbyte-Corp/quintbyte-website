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
    <section aria-labelledby={titleId} className="border-t border-white/5 bg-bg">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,72px)] section-y nav:grid-cols-[1fr_1.6fr]">
        <Reveal className="flex flex-col gap-4 nav:sticky nav:top-28">
          <Eyebrow>FAQ</Eyebrow>
          <h2
            id={titleId}
            className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
          >
            {title}
          </h2>
        </Reveal>

        <ul className="flex flex-col border-t border-white/8">
          {items.map((faq) => (
            <li key={faq.question} className="border-b border-white/8">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] leading-[1.45] font-bold text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <SvgIcon
                    d={keyboardArrowDown}
                    className="mt-0.5 shrink-0 text-2xl text-accent transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-[640px] pb-6 text-base leading-[1.65] text-pretty text-mute">
                  {faq.answer}
                </p>
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
