import { Fragment } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/icons/Icon";

const parts: { label: string; icon: IconName }[] = [
  { label: "People", icon: "groups" },
  { label: "Systems", icon: "dns" },
  { label: "Processes", icon: "account_tree" },
  { label: "Specialists", icon: "badge" },
  { label: "Coordination", icon: "hub" },
];

const tile =
  "flex items-center gap-3 rounded-2xl border border-accent/40 bg-node px-5 py-4 shadow-node nav:flex-col nav:justify-center nav:gap-3 nav:px-3 nav:py-6 nav:text-center";

function Operator({ symbol }: { symbol: "+" | "=" }) {
  return (
    <span
      aria-hidden
      className="self-center font-mono text-2xl leading-none font-medium text-accent/80"
    >
      {symbol}
    </span>
  );
}

/**
 * People + Systems + Processes + Specialists + Coordination = QuintByte.
 * A horizontal equation on wide screens, a vertical stack on phones and tablets.
 */
export function ModelEquation() {
  return (
    <div
      role="img"
      aria-label="People plus systems plus processes plus specialists plus coordination equals QuintByte"
      className="flex flex-col gap-2.5 nav:grid nav:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1.35fr] nav:items-stretch nav:gap-3"
    >
      {parts.map((part, i) => (
        <Fragment key={part.label}>
          {i > 0 ? <Operator symbol="+" /> : null}
          <div className={tile}>
            <Icon name={part.icon} className="text-[28px] text-accent" />
            <span className="text-[15px] font-bold text-ink">{part.label}</span>
          </div>
        </Fragment>
      ))}
      <Operator symbol="=" />
      <div className="flex items-center gap-4 rounded-2xl border-[1.5px] border-[#3fd2ff] bg-[radial-gradient(circle_at_50%_40%,#12324a_0%,#0a1c2c_60%,#07131f_100%)] px-5 py-5 shadow-[0_0_40px_rgb(34_199_255/0.4),inset_0_0_24px_rgb(34_199_255/0.25)] nav:flex-col nav:justify-center nav:gap-3 nav:text-center">
        <LogoMark
          accent="#22c7ff"
          ink="#22c7ff"
          className="h-10 w-auto drop-shadow-[0_0_10px_rgb(34_199_255/0.8)] nav:h-12"
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-[17px] font-extrabold text-ink">QuintByte</span>
          <span className="text-[13px] text-mute-2">One accountable relationship</span>
        </span>
      </div>
    </div>
  );
}
