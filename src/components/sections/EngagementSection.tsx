import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { availabilityNote } from "@/data/company";

/** BMS: "one specific service, a project-based solution, or a combination of functions" */
const options: { title: string; body: string }[] = [
  {
    title: "One specific service",
    body: "Support in a single area — for example Executive Assistance or CRM & Sales Support.",
  },
  {
    title: "A project-based solution",
    body: "A defined one-time, seasonal, or cross-functional piece of work, scoped before it begins.",
  },
  {
    title: "A combination of functions",
    body: "Several functions managed together under one coordinated relationship.",
  },
];

/** How engagements can be shaped — used on the Services page, as a mint panel */
export function EngagementSection() {
  return (
    <section
      aria-labelledby="engagement-title"
      className="bg-white px-2 pb-[clamp(80px,10vw,144px)] sm:px-4 lg:px-6"
    >
      <div className="panel-wrap rounded-[32px] bg-mint px-[clamp(20px,4vw,56px)] py-[clamp(48px,7vw,112px)]">
        <div className="mx-auto grid max-w-[1328px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-20 gap-y-12">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow>Flexible support</Eyebrow>
            <h2 id="engagement-title" className="type-h2 text-balance">
              Build the right support{" "}
              <span className="bg-white [box-decoration-break:clone] px-[0.1em]">
                around your business.
              </span>
            </h2>
            <p className="max-w-[560px] type-body text-pretty">
              Instead of offering isolated tasks, QuintByte works as a business support partner. We
              help identify what a client actually needs, define the appropriate scope, assign the
              right specialist or team member, coordinate delivery, and maintain visibility
              throughout the engagement.
            </p>
          </Reveal>

          <div className="grid gap-3">
            <ul className="grid gap-3">
              {options.map((option, i) => (
                <Reveal
                  as="li"
                  key={option.title}
                  delay={i * 0.06}
                  className="grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-1.5 rounded-[20px] bg-white px-6 py-6 sm:px-8 sm:py-7"
                >
                  <span
                    aria-hidden
                    className="row-span-2 mt-2 size-5 rounded-full border-4 border-cyan"
                  />
                  <h3 className="text-[clamp(24px,2.4vw,34px)] leading-[1.15] font-black tracking-[-0.02em]">
                    {option.title}
                  </h3>
                  <p className="text-[17px] leading-[1.55] text-pretty">{option.body}</p>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <p className="mt-2 rounded-2xl bg-slate px-6 py-5 text-[15px] leading-[1.6] text-white">
                {availabilityNote}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
