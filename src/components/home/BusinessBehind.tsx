import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { claims } from "@/data/claims";
import { businessClusters } from "@/data/home";
import { services } from "@/data/services";
import { CountUp } from "./CountUp";

/** Four plain facts under the chip strip; every number is true on the day it ships */
const facts = [
  {
    n: 5,
    label: claims.friends
      ? "Friends running one service firm"
      : "Partners running one service firm",
  },
  { n: services.length, label: "Service categories under one relationship" },
  { n: 3, label: "Countries served: US, Australia, Philippines" },
  { n: 1, label: "Accountable partner instead of a string of freelancers" },
];

const chips = businessClusters.flatMap((cluster) =>
  cluster.chips.map((chip) => ({ ...chip, group: cluster.label })),
);

/**
 * The problem section: heading beside the eyebrow, then the twelve everyday chips as an
 * endless strip (the list is read once by assistive technology; the repeat is hidden),
 * then four facts. Copy: rebrand brief, 24 Oct 2026.
 */
export function BusinessBehind() {
  return (
    <section aria-labelledby="behind-title" className="bg-white section-y">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-start gap-x-20 gap-y-10">
        <Reveal>
          <Eyebrow>The business behind the business</Eyebrow>
        </Reveal>
        <Reveal className="flex flex-col gap-7">
          <h2
            id="behind-title"
            className="text-[clamp(34px,4.4vw,64px)] leading-[1.04] font-black tracking-[-0.025em] text-balance"
          >
            Running a business means managing more than the business itself.
          </h2>
          <p className="text-[clamp(22px,2vw,28px)] font-extrabold">
            <span className="qb-highlight">Trust us. We know.</span>
          </p>
          <p className="max-w-[560px] type-body text-pretty">
            We run a business too, so we know the inbox, payroll and CRM never wait their turn.
            That&rsquo;s the work we take off your plate.
          </p>
        </Reveal>
      </div>

      <div className="qb-marquee mt-14 overflow-hidden border-y border-bluegray/50 bg-paper py-5 lg:mt-24">
        <div className="qb-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? "Everyday business work" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex gap-3 pr-3"
            >
              {chips.map((chip) => (
                <li
                  key={chip.label}
                  className="flex items-center gap-3 rounded-full border border-bluegray bg-white px-6 py-3.5 text-[clamp(18px,1.8vw,26px)] font-extrabold whitespace-nowrap"
                >
                  <Icon name={chip.icon} className="shrink-0 text-[1.1em]" />
                  <span className="text-xs tracking-[0.12em] text-muted uppercase">
                    {chip.group}
                  </span>
                  {chip.label}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <dl className="shell mt-14 grid grid-cols-2 gap-x-6 lg:mt-24 lg:grid-cols-4 lg:gap-x-0">
        {facts.map((fact, i) => (
          <Reveal
            key={fact.label}
            delay={i * 0.06}
            className="flex flex-col-reverse justify-end gap-2 border-t-2 border-slate py-7 pr-6"
          >
            <dt className="max-w-[220px] text-[17px] leading-[1.4] font-extrabold">{fact.label}</dt>
            <dd className="text-[clamp(64px,7vw,112px)] leading-none font-black tracking-[-0.04em]">
              <CountUp to={fact.n} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
