import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { processObjective, processSteps } from "@/data/process";
import { ProcessStepper } from "./ProcessStepper";

type ProcessSectionProps = {
  eyebrow?: string;
  title?: ReactNode;
  body?: string;
  id?: string;
  /** "stepper": the step list beside a detail panel (home). "grid": six step cards. */
  variant?: "stepper" | "grid";
};

/** "How It Works" — six numbered steps (home, service pages) */
export function ProcessSection({
  eyebrow = "How it works",
  title = (
    <>
      Simple for you.
      <br />
      <span className="qb-highlight">Structured behind the&nbsp;scenes.</span>
    </>
  ),
  body = "We follow a clear process to make sure you get the right support, the right people, and the right results.",
  id = "how",
  variant = "stepper",
}: ProcessSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`section-y ${variant === "grid" ? "border-t border-bluegray/50 bg-paper" : "bg-white"}`}
    >
      <div className="shell flex flex-col gap-10 lg:gap-16">
        <Reveal className="flex max-w-[880px] flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={titleId} className="type-h2 text-balance">
            {title}
          </h2>
          <p className="max-w-[620px] type-body text-pretty">{body}</p>
        </Reveal>

        {variant === "stepper" ? (
          <ProcessStepper steps={processSteps} objective={processObjective} />
        ) : (
          <ProcessSteps />
        )}
      </div>
    </section>
  );
}

/** The six steps as cards; Confirm and Review are checkpoints, in Deep Slate */
export function ProcessSteps({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {processSteps.map((step, i) => (
        <Reveal
          as="li"
          key={step.num}
          delay={(i % 3) * 0.06}
          className={`flex flex-col gap-3 rounded-[20px] border border-bluegray/60 p-6 lg:p-8 ${
            step.checkpoint ? "bg-slate text-white" : "bg-white"
          }`}
        >
          <p className={`type-eyebrow ${step.checkpoint ? "text-cyan" : "text-muted"}`}>
            <span className="sr-only">Step </span>
            {step.num}
            {step.checkpoint ? " · Checkpoint" : null}
          </p>
          {detailed ? (
            <span
              aria-hidden
              className={`text-[clamp(64px,6vw,96px)] leading-[0.9] font-black tracking-[-0.04em] ${
                step.checkpoint ? "text-cyan" : "text-mint"
              }`}
            >
              {step.num}
            </span>
          ) : null}
          <h3
            className={`font-black tracking-[-0.015em] ${
              detailed
                ? "text-[clamp(28px,2.6vw,40px)] leading-[1.05]"
                : "text-[clamp(22px,2vw,28px)]"
            }`}
          >
            {step.title}
          </h3>
          <p className="text-base leading-[1.6] text-pretty lg:text-[17px]">
            {detailed ? step.detail : step.summary}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
