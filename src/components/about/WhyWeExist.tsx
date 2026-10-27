import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * About: "Why we exist", the vision and mission (rebrand brief, 24 Oct 2026), right after
 * the hero. The heading takes the full width; vision and mission sit below as two columns
 * with small labels, no boxes or icons, stacking vision first on phones. The client in the
 * vision stays unnamed unless they agree.
 */
export function WhyWeExist() {
  return (
    <section aria-labelledby="why-title" className="bg-white">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>Why we exist</Eyebrow>
          <h2 id="why-title" className="max-w-[1000px] type-h2 text-balance">
            Every business deserves a fair chance.{" "}
            <span className="block">
              <span className="qb-highlight">Someone gave us ours.</span>
            </span>
          </h2>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <Reveal delay={0.06} className="flex flex-col gap-4">
            <Eyebrow as="span">Our vision</Eyebrow>
            <p className="type-body text-pretty">
              We live in a competitive economy where the winners and the left-behind live side by
              side. We want more businesses, and the people behind them, to get a fair chance to
              grow and reach their goals, the way one client once believed in us.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-col gap-4">
            <Eyebrow as="span">Our mission</Eyebrow>
            <p className="type-body text-pretty">
              We help aspiring business owners grow and keep their businesses by taking on the work
              that eats their time. With that time back, they can create more jobs, offer fair
              prices and better products and services, and live better lives themselves.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
