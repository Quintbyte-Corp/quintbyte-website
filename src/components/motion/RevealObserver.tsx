"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Flips `data-revealed` on elements as they scroll into view; CSS does the animating.
 *  - [data-reveal]: fade/slide-up, fires as soon as the element enters the viewport
 *  - [data-build]:  multi-step build-up (ecosystem visual), fires once a third of it is
 *                   visible so the whole sequence is seen
 * Re-scans after each client-side navigation. Renders nothing.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const groups = [
      {
        selector: "[data-reveal]:not([data-revealed])",
        options: { rootMargin: "0px 0px -10% 0px" },
      },
      { selector: "[data-build]:not([data-revealed])", options: { threshold: 0.35 } },
    ];

    if (!("IntersectionObserver" in window)) {
      for (const { selector } of groups)
        document.querySelectorAll(selector).forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const observers = groups.map(({ selector, options }) => {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      }, options);
      document.querySelectorAll(selector).forEach((el) => io.observe(el));
      return io;
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [pathname]);

  return null;
}
