import Link from "next/link";
import { LogoMark, LogoWordmark } from "@/components/brand/Logo";
import { Icon } from "@/components/icons/Icon";
import { orbitNodes } from "@/data/home";

const RADIUS = 40; // % of the diagram, per the design
const STEP = 360 / orbitNodes.length;

/** Node angle: starts at the top (-90°) and steps clockwise */
const angleOf = (i: number) => -90 + i * STEP;

/**
 * Hero orbit: QuintByte at the centre, service areas around it. Sized entirely in
 * container-query units so it scales with its column; on narrow containers the nodes
 * grow slightly and labels/icons get a minimum size so they stay legible on phones.
 */
export function OrbitDiagram() {
  return (
    <div className="@container relative mx-auto aspect-square w-full max-w-[600px]">
      {/* Rings */}
      <div aria-hidden className="absolute inset-[14%] rounded-full border border-accent/18" />
      <div
        aria-hidden
        className="absolute inset-[4%] animate-orbit-spin rounded-full border border-dashed border-accent/12"
      />

      {/* Connectors from the centre to each node */}
      {orbitNodes.map((node, i) => (
        <div
          key={`line-${node.label}`}
          aria-hidden
          className="absolute top-1/2 left-1/2 h-px origin-top-left bg-linear-to-r from-accent/50 to-accent/5"
          style={{ width: `${RADIUS}%`, transform: `rotate(${angleOf(i)}deg)` }}
        />
      ))}

      {/* Centre disc */}
      <div className="absolute top-1/2 left-1/2 flex aspect-square w-[38%] -translate-1/2 flex-col items-center justify-center gap-[2cqw] rounded-full border border-accent/55 bg-[radial-gradient(circle_at_50%_40%,#0e3a58_0%,#071a2a_55%,#040a12_100%)] shadow-[0_0_60px_rgb(34_199_255/0.45),inset_0_0_40px_rgb(34_199_255/0.25)]">
        <div
          aria-hidden
          className="absolute -inset-[6%] animate-glow-pulse rounded-full shadow-[0_0_70px_rgb(34_199_255/0.35)]"
        />
        <LogoMark
          title="QuintByte"
          accent="#22c7ff"
          ink="#22c7ff"
          className="relative h-[14cqw] w-auto drop-shadow-[0_0_12px_rgb(34_199_255/0.8)]"
        />
        <LogoWordmark ink="#eef4f8" className="relative h-[3.4cqw] w-auto" />
      </div>

      {/* Service nodes */}
      <ul aria-label="Service areas QuintByte coordinates">
        {orbitNodes.map((node, i) => {
          const rad = (angleOf(i) * Math.PI) / 180;
          return (
            <li
              key={node.label}
              className="absolute w-[17%] -translate-1/2 @max-[480px]:w-[19%]"
              style={{
                left: `${50 + RADIUS * Math.cos(rad)}%`,
                top: `${50 + RADIUS * Math.sin(rad)}%`,
              }}
            >
              <Link
                href={`/services/${node.service}`}
                className="flex aspect-[1/0.92] w-full flex-col items-center justify-center gap-[1.2cqw] rounded-[3cqw] border border-accent/40 bg-node p-[1cqw] text-center shadow-node transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-node-hover focus-visible:border-accent focus-visible:shadow-node-hover"
              >
                <Icon name={node.icon} className="text-[max(5.4cqw,18px)] text-accent" />
                <span className="text-[max(2.3cqw,9px)] leading-[1.15] font-semibold text-ink">
                  {node.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
