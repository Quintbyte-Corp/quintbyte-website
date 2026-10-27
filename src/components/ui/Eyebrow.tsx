import type { ReactNode } from "react";

/**
 * Section label: small Deep Slate caps with a short cyan rule above (brief, hero eyebrow).
 * It sits 16px above its heading; the parent's gap sets that distance.
 */
export function Eyebrow({
  children,
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  as?: "p" | "span";
  className?: string;
}) {
  return (
    <Tag className={`flex flex-col items-start gap-2 type-eyebrow text-slate ${className}`}>
      <span aria-hidden className="block h-[3px] w-8 bg-cyan" />
      <span>{children}</span>
    </Tag>
  );
}
