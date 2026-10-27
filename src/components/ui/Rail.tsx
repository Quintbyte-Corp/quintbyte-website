import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * A connected sequence with nodes from the QB symbol kit (asset pack /symbols): a step
 * node (cyan dot in a blue-gray ring), a checkpoint (slate ring with a check) and the
 * client node (apricot, "You" only). Vertical by default; `row` lays it out as one
 * horizontal line from 1024px. Lines and nodes are decorative; the list carries the
 * meaning. Styles live in globals.css (".qb-rail").
 */
export type RailNodeKind = "step" | "checkpoint" | "client";

export function Rail({
  children,
  count,
  row = false,
  className = "",
}: {
  children: ReactNode;
  /** Number of items, for the horizontal row's columns */
  count: number;
  row?: boolean;
  className?: string;
}) {
  return (
    <ol
      className={`qb-rail ${row ? "qb-rail-row" : ""} ${className}`}
      style={{ "--rail-n": count } as CSSProperties}
    >
      {children}
    </ol>
  );
}

export function RailItem({
  node = "step",
  delay = 0,
  className = "",
  children,
}: {
  node?: RailNodeKind;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="li" delay={delay} className={className}>
      <RailNode kind={node} />
      {children}
    </Reveal>
  );
}

function RailNode({ kind }: { kind: RailNodeKind }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="qb-rail-node size-6 overflow-visible"
      focusable="false"
    >
      {kind === "checkpoint" ? (
        <>
          <circle cx="12" cy="12" r="11" fill="#fff" stroke="var(--color-slate)" strokeWidth="2" />
          <path
            d="M7.5 12.3l3 3 6-6.3"
            fill="none"
            stroke="var(--color-slate)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : kind === "client" ? (
        <circle cx="12" cy="12" r="10" fill="var(--color-apricot)" />
      ) : (
        <>
          <circle
            cx="12"
            cy="12"
            r="11"
            fill="#fff"
            stroke="var(--color-bluegray)"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="5" fill="var(--color-cyan)" />
        </>
      )}
    </svg>
  );
}
