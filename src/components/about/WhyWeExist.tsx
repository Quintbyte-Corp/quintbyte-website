import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * About: "Why we exist", the vision and mission (rebrand brief, 24 Oct 2026), right after
 * the hero. The eyebrow sits beside the heading; vision and mission follow under it with
 * small labels, no boxes or icons. The client in the vision stays unnamed unless they agree.
 */
export function WhyWeExist() {
  return (
    <section aria-labelledby="why-title" className="bg-white section-y">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-start gap-x-20 gap-y-10">
        <Reveal>
          <Eyebrow>Why we exist</Eyebrow>
        </Reveal>
        <div className="flex flex-col gap-10">
          <Reveal>
            <h2
              id="why-title"
              className="text-[clamp(34px,4.4vw,64px)] leading-[1.04] font-black tracking-[-0.025em] text-balance"
            >
              Every business deserves a fair chance.{" "}
              <span className="block">
                <span className="qb-highlight">Someone gave us ours.</span>
              </span>
            </h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal delay={0.06} className="flex flex-col gap-4">
              <Eyebrow as="span" className="text-muted">
                Our vision
              </Eyebrow>
              <p className="type-body text-pretty">
                We live in a competitive economy where the winners and the left-behind live side by
                side. We want more businesses, and the people behind them, to get a fair chance to
                grow and reach their goals, the way one client once believed in us.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="flex flex-col gap-4">
              <Eyebrow as="span" className="text-muted">
                Our mission
              </Eyebrow>
              <p className="type-body text-pretty">
                We help aspiring business owners grow and keep their businesses by taking on the
                work that eats their time. With that time back, they can create more jobs, offer
                fair prices and better products and services, and live better lives themselves.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
