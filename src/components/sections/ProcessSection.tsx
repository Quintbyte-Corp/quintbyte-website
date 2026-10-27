import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rail, RailItem } from "@/components/ui/Rail";
import { processSteps } from "@/data/process";

type ProcessSectionProps = {
  eyebrow?: string;
  title?: ReactNode;
  body?: string;
  id?: string;
};

/** "How It Works" — six numbered steps (home, How It Works page, service pages) */
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
}: ProcessSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-bluegray/50 bg-white">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={titleId} className="type-h2 text-balance">
            {title}
          </h2>
          <p className="type-body text-pretty">{body}</p>
        </Reveal>

        <ProcessSteps />
      </div>
    </section>
  );
}

/** The six steps as one connected rail; Confirm and Review are checkpoints */
export function ProcessSteps() {
  return (
    <Rail count={processSteps.length} row>
      {processSteps.map((step, i) => (
        <RailItem
          key={step.num}
          node={step.checkpoint ? "checkpoint" : "step"}
          delay={i * 0.06}
          className="flex flex-col gap-2"
        >
          <p className="type-eyebrow">
            <span className="sr-only">Step </span>
            {step.num}
            {step.checkpoint ? " · Checkpoint" : null}
          </p>
          <h3 className="text-lg leading-6 font-extrabold">{step.title}</h3>
          <p className="text-base leading-6 text-pretty">{step.summary}</p>
        </RailItem>
      ))}
    </Rail>
  );
}
