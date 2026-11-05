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
    <section aria-labelledby={titleId} className="border-t border-bluegray/50 bg-white section-y">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-x-20 gap-y-10">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-28">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id={titleId} className="type-h2 text-balance">
            {title}
          </h2>
        </Reveal>

        <ul className="flex flex-col border-t-2 border-slate">
          {items.map((faq) => (
            <li key={faq.question} className="border-b border-bluegray">
              <details className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-6 px-1 py-6 text-[clamp(20px,1.8vw,26px)] leading-[1.25] font-black tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                  <span className="underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-cyan">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className="qb-plus flex size-10 shrink-0 items-center justify-center rounded-full border border-slate text-[22px] font-extrabold transition-[rotate,background-color,color] duration-300 ease-qb group-hover:bg-slate group-hover:text-white"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[820px] px-1 pr-16 pb-7 type-body text-pretty">{faq.answer}</p>
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
