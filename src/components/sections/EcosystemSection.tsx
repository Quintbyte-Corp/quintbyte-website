import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EcosystemVisual } from "./EcosystemVisual";

/** "One partner, multiple capabilities": the qb mark and its three pillars */
export function EcosystemSection({ showLink = true }: { showLink?: boolean }) {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="border-t border-bluegray/50 bg-white"
    >
      <div className="shell split section-y">
        <Reveal className="flex flex-col items-start gap-4">
          <Eyebrow>One partner, multiple capabilities.</Eyebrow>
          <h2 id="ecosystem-title" className="type-h2 text-balance">
            A complete <span className="qb-highlight">business support ecosystem.</span>
          </h2>
          <p className="max-w-[520px] type-body text-pretty">
            Instead of coordinating multiple freelancers or providers, you get one business partner
            with the right specialists, clear processes, and accountable delivery.
          </p>
          {showLink ? <ArrowLink href="/about">More about QuintByte</ArrowLink> : null}
        </Reveal>

        <Reveal delay={0.08}>
          <EcosystemVisual />
        </Reveal>
      </div>
    </section>
  );
}
