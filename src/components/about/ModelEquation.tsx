import { Fragment } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/icons/Icon";

const parts: { label: string; icon: IconName }[] = [
  { label: "People", icon: "groups" },
  { label: "Systems", icon: "dns" },
  { label: "Processes", icon: "account_tree" },
  { label: "Specialists", icon: "badge" },
  { label: "Coordination", icon: "hub" },
];

const tile =
  "flex items-center gap-4 rounded-[20px] border border-bluegray bg-white px-6 py-4 nav:flex-col nav:justify-center nav:gap-2 nav:px-4 nav:py-6 nav:text-center";

function Operator({ symbol }: { symbol: "+" | "=" }) {
  return (
    <span aria-hidden className="self-center text-2xl leading-none font-black text-current">
      {symbol}
    </span>
  );
}

/**
 * People + Systems + Processes + Specialists + Coordination = QuintByte.
 * A horizontal equation on wide screens, a vertical stack on phones and tablets. The
 * result tile carries the section's one mint highlight.
 */
export function ModelEquation() {
  return (
    <div
      role="img"
      aria-label="People plus systems plus processes plus specialists plus coordination equals QuintByte"
      className="flex flex-col gap-2 text-slate nav:grid nav:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1.35fr] nav:items-stretch nav:gap-4"
    >
      {parts.map((part, i) => (
        <Fragment key={part.label}>
          {i > 0 ? <Operator symbol="+" /> : null}
          <div className={tile}>
            <Icon name={part.icon} className="text-[28px]" />
            <span className="text-base font-extrabold">{part.label}</span>
          </div>
        </Fragment>
      ))}
      <Operator symbol="=" />
      <div className="flex items-center gap-4 rounded-[20px] border-2 border-cyan bg-mint px-6 py-4 nav:flex-col nav:justify-center nav:gap-2 nav:text-center">
        <Logo file="mark" height={40} />
        <span className="flex flex-col">
          <span className="text-lg font-black">QuintByte</span>
          <span className="text-sm">One accountable relationship</span>
        </span>
      </div>
    </div>
  );
}
