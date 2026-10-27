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
    <section aria-labelledby="engagement-title" className="border-t border-bluegray/50 bg-white">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow>Flexible support</Eyebrow>
          <h2 id="engagement-title" className="type-h2 text-balance">
            Build the right support <span className="qb-highlight">around your business.</span>
          </h2>
          <p className="type-body text-pretty">
            Instead of offering isolated tasks, QuintByte works as a business support partner. We
            help identify what a client actually needs, define the appropriate scope, assign the
            right specialist or team member, coordinate delivery, and maintain visibility throughout
            the engagement.
          </p>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-3">
          {options.map((option, i) => (
            <Reveal
              as="li"
              key={option.title}
              delay={i * 0.06}
              className="flex flex-col gap-4 rounded-card border border-bluegray bg-white p-6"
            >
              <Icon name={option.icon} className="text-[32px]" />
              <h3 className="text-lg leading-6 font-extrabold">{option.title}</h3>
              <p className="text-base leading-6 text-pretty">{option.body}</p>
            </Reveal>
          ))}
        </ul>

        <p className="max-w-[760px] border-l-2 border-cyan pl-4 text-base leading-6">
          {availabilityNote}
        </p>
      </div>
    </section>
  );
}
