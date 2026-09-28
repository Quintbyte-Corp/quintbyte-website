import type { ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
      Structured behind the scenes.
    </>
  ),
  body = "We follow a clear process to make sure you get the right support, the right people, and the right results.",
  id = "how",
}: ProcessSectionProps) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="border-t border-line-2 bg-white text-ink-dark"
    >
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex max-w-[720px] flex-col gap-4">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h2
            id={titleId}
            className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
          >
            {title}
          </h2>
          <p className="text-[17px] leading-[1.6] text-mute-light">{body}</p>
        </Reveal>

        <ProcessSteps />
      </div>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-7">
      {processSteps.map((step, i) => (
        <Reveal as="li" key={step.num} delay={i * 0.06} className="flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-line-step px-3.5 py-1.5 font-mono text-2xl font-medium text-ink-dark">
              <span className="sr-only">Step </span>
              {step.num}
            </span>
            <span
              aria-hidden
              className="h-px flex-1 bg-[repeating-linear-gradient(90deg,var(--color-dash)_0_4px,transparent_4px_8px)]"
            />
          </div>
          <Icon name={step.icon} className="text-[34px] text-ink-dark" />
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[17px] font-bold">{step.title}</h3>
            <p className="text-sm leading-[1.55] text-pretty text-mute-light">{step.summary}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
