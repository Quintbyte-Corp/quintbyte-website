"use client";

import { useState } from "react";
import type { ProcessStep } from "@/data/process";

/**
 * The six steps as a list of buttons beside a Deep Slate panel that shows the chosen
 * step in full. Hover or focus previews a step; the panel announces changes politely.
 */
export function ProcessStepper({
  steps,
  objective,
}: {
  steps: readonly ProcessStep[];
  objective: string;
}) {
  const [active, setActive] = useState(0);
  const step = steps[active] ?? steps[0];
  if (!step) return null;
  const total = String(steps.length).padStart(2, "0");

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-x-20 gap-y-10">
      <ol className="border-t border-bluegray">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.num} className="border-b border-bluegray">
              <button
                type="button"
                aria-pressed={on}
                aria-controls="process-panel"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`grid w-full cursor-pointer grid-cols-[48px_1fr_auto] items-center gap-4 py-5 pr-2 text-left transition-[background-color,padding] duration-300 ease-qb sm:grid-cols-[64px_1fr_auto] ${
                  on ? "bg-mint pl-6" : "pl-2 hover:bg-paper"
                }`}
              >
                <span className="text-[13px] font-extrabold tracking-[0.12em]">
                  <span className="sr-only">Step </span>
                  {s.num}
                </span>
                <span
                  className={`text-[clamp(24px,2.6vw,40px)] leading-[1.1] font-black tracking-[-0.02em] transition-opacity duration-300 ${
                    on ? "opacity-100" : "opacity-55"
                  }`}
                >
                  {s.title}
                </span>
                <span className="text-xs font-extrabold tracking-[0.12em] text-muted uppercase">
                  {s.checkpoint ? "Checkpoint" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        id="process-panel"
        className="qb-band flex min-h-[400px] flex-col justify-between gap-8 rounded-card bg-slate p-7 text-white sm:p-10 lg:sticky lg:top-28 lg:p-12"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="type-eyebrow">
            Step {step.num} of {total}
          </span>
          <span aria-hidden className="flex gap-1.5">
            {steps.map((s, i) => (
              <span
                key={s.num}
                className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                  i <= active ? "bg-cyan" : "bg-white/25"
                }`}
              />
            ))}
          </span>
        </div>
        <div aria-live="polite" className="flex flex-col gap-4">
          <h3 className="text-[clamp(40px,5vw,80px)] leading-none font-black tracking-[-0.035em]">
            {step.title}
          </h3>
          <p className="text-[clamp(20px,1.8vw,26px)] leading-[1.35] font-extrabold text-pretty text-mint">
            {step.summary}
          </p>
          <p className="text-[17px] leading-[1.6] text-pretty">{step.detail}</p>
        </div>
        <p className="border-t border-white/25 pt-6 text-[15px] leading-[1.6]">{objective}</p>
      </div>
    </div>
  );
}
