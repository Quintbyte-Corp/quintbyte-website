"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * A full-width rounded 16:9 frame that grows from 92% to full size, and loosens its
 * corners, as it scrolls into view. Static under reduced motion. `art` fills the frame (a
 * <Scene>, rendered on the server and passed in); optional strip below it, inside the same
 * rounded frame, as children.
 */
export function ScrollPhoto({ art, children }: { art: ReactNode; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
      el.style.transform = `scale(${0.92 + 0.08 * p})`;
      el.style.borderRadius = `${40 - 24 * p}px`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <div
        ref={ref}
        className="relative panel-wrap origin-top overflow-hidden rounded-[32px] bg-paper will-change-transform"
      >
        <div className="relative aspect-[16/9]">{art}</div>
        {children}
      </div>
    </div>
  );
}
