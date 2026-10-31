"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";
import type { Photo } from "@/data/photos";

/**
 * A full-width rounded photo that grows from 92% to full size, and loosens its corners,
 * as it scrolls into view. Static under reduced motion. Optional overlay as children.
 */
export function ScrollPhoto({
  photo,
  priority = false,
  position = "center 40%",
  children,
}: {
  photo: Photo;
  priority?: boolean;
  position?: string;
  children?: ReactNode;
}) {
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
        className="relative panel-wrap h-[clamp(320px,56vw,800px)] origin-top overflow-hidden rounded-[32px] bg-mint will-change-transform"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          placeholder="blur"
          sizes="(min-width: 1600px) 1600px, 100vw"
          className="object-cover"
          style={{ objectPosition: position }}
        />
        {children}
      </div>
    </div>
  );
}
