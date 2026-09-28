import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating — used to stagger siblings */
  delay?: number;
  as?: "div" | "li";
};

/**
 * Fade/slide-up on first scroll into view (README "Interactions & Behavior").
 * A server component: it only marks the element. The single <RevealObserver /> in the
 * root layout flips `data-revealed`, and the transition itself is CSS (globals.css),
 * so there is no per-element JavaScript and reduced-motion is handled in CSS.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  return (
    <Tag
      className={className}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
