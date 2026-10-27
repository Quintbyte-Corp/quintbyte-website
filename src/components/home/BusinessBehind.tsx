import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { businessClusters } from "@/data/home";

/** The problem section: light ground, chips across the full width. Copy: rebrand brief, 24 Oct 2026 */
export function BusinessBehind() {
  return (
    <section aria-labelledby="behind-title" className="border-y border-bluegray/50 bg-paper">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow>The business behind the business</Eyebrow>
          <h2 id="behind-title" className="type-h2 text-balance">
            Running a business means managing more than the business itself.
          </h2>
          {/* Kicker: Deep Slate with the section's mint highlight, one step below the heading */}
          <p className="type-h3">
            <span className="qb-highlight">Trust us. We know.</span>
          </p>
          <p className="max-w-[600px] type-body text-pretty">
            We run a business too, so we know the inbox, payroll and CRM never wait their turn.
            That&rsquo;s the work we take off your plate.
          </p>
        </Reveal>

        {/* Grouped problem clusters: four labelled groups of three, one chip style */}
        <ul
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
          aria-label="Everyday business work"
        >
          {businessClusters.map((cluster, i) => (
            <Reveal as="li" key={cluster.label} delay={i * 0.06} className="flex flex-col gap-4">
              <h3 className="border-t-2 border-bluegray pt-4 type-eyebrow">{cluster.label}</h3>
              <ul className="flex flex-col gap-2">
                {cluster.chips.map((chip) => (
                  <li
                    key={chip.label}
                    className="flex min-h-12 items-center gap-2 rounded-chip border border-bluegray bg-white px-4 py-3 text-base font-extrabold"
                  >
                    <Icon name={chip.icon} className="shrink-0 text-xl" />
                    {chip.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
