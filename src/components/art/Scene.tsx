import type { CSSProperties } from "react";
import { type SceneName, scenes } from "./scenes";

/**
 * One of QuintByte's brand illustrations (scripts/illustrations.py), inline so it can build
 * once as it scrolls into view: RevealObserver flips `data-revealed` ([data-build]) and
 * globals.css (".qb-scene") plays the beats in order. Static without JavaScript and under
 * reduced motion. Fills its box like object-cover; give it an empty label when the scene is
 * decorative (cards, where the title says it all). Server only: the markup stays out of
 * the client bundle.
 */
export function Scene({
  name,
  label,
  className = "",
}: {
  name: SceneName;
  label: string;
  className?: string;
}) {
  const scene = scenes[name];
  return (
    <svg
      data-build=""
      viewBox={`0 0 ${scene.w} ${scene.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`qb-scene absolute inset-0 size-full ${className}`}
      style={{ "--qa-step": `${scene.step}ms` } as CSSProperties}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      // Our own static artwork, generated at build time; no user content
      dangerouslySetInnerHTML={{ __html: scene.body }}
    />
  );
}
