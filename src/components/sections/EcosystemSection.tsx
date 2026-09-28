import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EcosystemVisual } from "./EcosystemVisual";

/**
 * "One partner, multiple capabilities" — dark section with the isometric platform.
 * Clipped horizontally because the rotated floor grid is wider than its box on phones.
 */
export function EcosystemSection({ showLink = true }: { showLink?: boolean }) {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="overflow-x-clip bg-[radial-gradient(ellipse_50%_70%_at_75%_55%,rgb(34_150_255/0.14),transparent_70%),var(--color-bg)]"
    >
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,5vw,72px)] section-y-lg">
        <Reveal className="flex flex-col items-start gap-[22px]">
          <Eyebrow>
            One partner, multiple <span className="text-accent">capabilities.</span>
          </Eyebrow>
          <h2
            id="ecosystem-title"
            className="text-[clamp(32px,3.8vw,52px)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance"
          >
            A complete business support ecosystem.
          </h2>
          <p className="max-w-[500px] text-[17px] leading-[1.6] text-pretty text-mute">
            Instead of coordinating multiple freelancers or providers, you get one business partner
            with the right specialists, clear processes, and accountable delivery.
          </p>
          {showLink ? <ArrowLink href="/about">Learn More</ArrowLink> : null}
        </Reveal>

        {/* Not wrapped in <Reveal>: the visual runs its own build-up animation */}
        <EcosystemVisual />
      </div>
    </section>
  );
}
