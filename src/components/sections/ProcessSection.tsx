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

export function ProcessSteps() {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,168px),1fr))] gap-8">
      {processSteps.map((step, i) => (
        <Reveal as="li" key={step.num} delay={i * 0.06} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-slate text-lg font-black">
              <span className="sr-only">Step </span>
              {step.num}
            </span>
            <span aria-hidden className="h-0.5 flex-1 bg-bluegray" />
          </div>
          <Icon name={step.icon} className="text-[32px]" />
          <div className="flex flex-col gap-2">
            <h3 className="text-lg leading-6 font-extrabold">{step.title}</h3>
            <p className="text-base leading-6 text-pretty">{step.summary}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
