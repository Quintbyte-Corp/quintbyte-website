import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/icons/Icon";
import { TreeConnectors } from "@/components/ui/TreeConnectors";
import { ecosystemPillars } from "@/data/home";

/**
 * One partner and the three pillars it brings together: the qb mark above, People,
 * Processes and Systems below, joined by connectors on wider screens. Flat and static:
 * no glows, gradients or loops (asset-pack README).
 */
export function EcosystemVisual() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center">
      <span className="flex size-24 items-center justify-center rounded-full border-[3px] border-slate bg-white">
        <Logo file="mark" height={44} />
      </span>
      <TreeConnectors count={ecosystemPillars.length} className="hidden w-full sm:block" />
      <ul
        aria-label="What QuintByte brings together"
        className="mt-6 grid w-full gap-4 sm:mt-0 sm:grid-cols-3"
      >
        {ecosystemPillars.map((pillar) => (
          <li
            key={pillar.label}
            className="flex items-center gap-4 rounded-card border border-bluegray bg-white p-4 sm:flex-col sm:items-center sm:gap-2 sm:p-6 sm:text-center"
          >
            <Icon name={pillar.icon} className="shrink-0 text-[28px]" />
            <span className="flex flex-col">
              <span className="text-lg font-extrabold">{pillar.label}</span>
              {/* Keeps label and caption apart when read as plain text ("People: Right Specialists") */}
              <span className="sr-only">: </span>
              <span className="text-base">{pillar.caption}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
