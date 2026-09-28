import { Icon, type IconName } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { availabilityNote } from "@/data/company";

/** BMS: "one specific service, a project-based solution, or a combination of functions" */
const options: { title: string; body: string; icon: IconName }[] = [
  {
    title: "One specific service",
    body: "Support in a single area — for example Executive Assistance or CRM & Sales Support.",
    icon: "person",
  },
  {
    title: "A project-based solution",
    body: "A defined one-time, seasonal, or cross-functional piece of work, scoped before it begins.",
    icon: "extension",
  },
  {
    title: "A combination of functions",
    body: "Several functions managed together under one coordinated Business Management Services relationship.",
    icon: "hub",
  },
];

/** How engagements can be shaped — used on the Services page */
export function EngagementSection() {
  return (
    <section aria-labelledby="engagement-title" className="bg-light text-ink-dark">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow tone="light">Flexible support</Eyebrow>
          <h2
            id="engagement-title"
            className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
          >
            Build the right support around your business.
          </h2>
          <p className="text-[17px] leading-[1.6] text-pretty text-mute-light">
            Instead of offering isolated tasks, QuintByte works as a business support partner. We
            help identify what a client actually needs, define the appropriate scope, assign the
            right specialist or team member, coordinate delivery, and maintain visibility throughout
            the engagement.
          </p>
        </Reveal>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
          {options.map((option, i) => (
            <Reveal
              as="li"
              key={option.title}
              delay={i * 0.06}
              className="flex flex-col gap-3.5 rounded-card border border-line bg-white p-[26px]"
            >
              <Icon name={option.icon} className="text-[30px] text-accent-light" />
              <h3 className="text-[17px] font-bold">{option.title}</h3>
              <p className="text-sm leading-[1.55] text-pretty text-mute-light">{option.body}</p>
            </Reveal>
          ))}
        </ul>

        <p className="max-w-[760px] border-l-2 border-accent-light pl-4 text-sm leading-[1.6] text-mute-light">
          {availabilityNote}
        </p>
      </div>
    </section>
  );
}
