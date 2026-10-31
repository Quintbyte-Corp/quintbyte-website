import type { ReactNode } from "react";

/**
 * Section label: small Deep Slate caps led by a short cyan rule.
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
    <Tag className={`flex items-center gap-3 type-eyebrow ${className}`}>
      <span aria-hidden className="block h-0.5 w-8 shrink-0 bg-cyan" />
      <span>{children}</span>
    </Tag>
  );
}
