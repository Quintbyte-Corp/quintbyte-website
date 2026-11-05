import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ecosystemPillars } from "@/data/home";

/**
 * The three pillars QuintByte brings together, then the one relationship they all serve:
 * yours. White rows on the mint panel; the client row carries the apricot "You" node.
 */
export function EcosystemVisual() {
  return (
    <ul aria-label="What QuintByte brings together" className="grid gap-3">
      {ecosystemPillars.map((pillar, i) => (
        <Reveal
          as="li"
          key={pillar.label}
          delay={i * 0.06}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[20px] bg-white px-6 py-6 transition-transform duration-300 ease-qb hover:translate-x-2 sm:gap-6 sm:px-8 sm:py-7"
        >
          <Icon name={pillar.icon} className="text-[28px]" />
          <span className="text-[clamp(28px,3vw,44px)] leading-none font-black tracking-[-0.025em]">
            {pillar.label}
          </span>
          {/* Keeps label and caption apart when read as plain text ("People: Right Specialists") */}
          <span className="text-right text-xs font-extrabold tracking-[0.12em] uppercase sm:text-[13px]">
            <span className="sr-only">: </span>
            {pillar.caption}
          </span>
        </Reveal>
      ))}
      <Reveal
        as="li"
        delay={0.2}
        className="grid grid-cols-[auto_1fr] items-center gap-6 rounded-[20px] bg-slate px-6 py-6 text-white sm:px-8 sm:py-7"
      >
        <span aria-hidden className="size-5 rounded-full bg-apricot" />
        <span className="text-[clamp(20px,2vw,26px)] leading-[1.2] font-black">
          You · one accountable relationship
        </span>
      </Reveal>
    </ul>
  );
}
