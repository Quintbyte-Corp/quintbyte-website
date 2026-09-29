"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SvgIcon } from "@/components/icons/SvgIcon";
import { pause, playArrow } from "@/components/icons/ui-paths";
import { LOOP, STILL_AT, VIEW, drawLoopFrame } from "./qb-loop";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * QB, the QuintByte mascot, turning a paper document into organised data — drawn live
 * on a canvas. Runs only while on screen, in a visible tab and not paused; visitors who
 * prefer reduced motion get a single still frame. Has a pause control (WCAG 2.2.2).
 */
export function QBLoop({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const syncRef = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let inView = false;
    let raf = 0;
    let last = 0;
    let clock = 0;

    const draw = () => {
      const s = canvas.width / VIEW.w;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(s, 0, 0, s, -VIEW.x * s, -VIEW.y * s);
      drawLoopFrame(ctx, reduced ? STILL_AT : clock);
    };

    const running = () => inView && !reduced && !pausedRef.current && !document.hidden;

    const tick = (now: number) => {
      raf = 0;
      if (!running()) return;
      clock = (clock + Math.min(0.1, (now - last) / 1000)) % LOOP;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (running()) {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        draw();
      }
    };
    syncRef.current = sync;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round((width * VIEW.h * dpr) / VIEW.w);
      draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncRef.current();
  };

  return (
    <figure className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animation: QB, the QuintByte mascot, wakes up, waves, walks to a desk and turns a paper document into organised data."
        className="block w-full"
        style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
      />
      {!reduced ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? "Play animation" : "Pause animation"}
          className="absolute right-2 bottom-2 flex size-9 items-center justify-center rounded-full border border-white/15 bg-bg/70 text-mute-3 backdrop-blur transition-colors hover:border-accent hover:text-accent"
        >
          <SvgIcon d={paused ? playArrow : pause} className="text-xl" />
        </button>
      ) : null}
    </figure>
  );
}
