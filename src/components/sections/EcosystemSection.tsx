import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EcosystemVisual } from "./EcosystemVisual";

/** "One partner, multiple capabilities": a mint panel with the three pillars and you */
export function EcosystemSection({ showLink = true }: { showLink?: boolean }) {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="bg-white px-2 pb-[clamp(80px,10vw,144px)] sm:px-4 lg:px-6"
    >
      <div className="panel-wrap rounded-[32px] bg-mint px-[clamp(20px,4vw,56px)] py-[clamp(48px,7vw,112px)]">
        <div className="mx-auto grid max-w-[1328px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-20 gap-y-12">
          <Reveal className="flex flex-col items-start gap-5">
            <Eyebrow>One partner, multiple capabilities.</Eyebrow>
            <h2 id="ecosystem-title" className="type-h2 text-balance">
              A complete business support ecosystem.
            </h2>
            <p className="max-w-[520px] type-body text-pretty">
              Instead of coordinating multiple freelancers or providers, you get one service firm
              with the right specialists, clear processes, and accountable delivery.
            </p>
            {showLink ? <ArrowLink href="/about">More about QuintByte</ArrowLink> : null}
          </Reveal>

          <EcosystemVisual />
        </div>
      </div>
    </section>
  );
}
