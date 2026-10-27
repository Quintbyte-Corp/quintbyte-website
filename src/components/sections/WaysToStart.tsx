import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { entryOffers } from "@/data/offers";
import { getService } from "@/data/services";

/**
 * "Ways to start" (GDE-005 C2): the three entry offers, each with an "Ask for a quote"
 * link that opens the message form with that service pre-selected. Lead from GDE-003 §7.
 */
export function WaysToStart({ id = "ways-to-start" }: { id?: string }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="bg-white">
      <div className="shell flex flex-col gap-12 section-y">
        <Reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow>Start small</Eyebrow>
          <h2 id={titleId} className="type-h2 text-balance">
            Ways to <span className="qb-highlight">start</span>
          </h2>
          <p className="type-body text-pretty">
            Common first steps are a two-week executive assistance pilot, a fixed-scope CRM cleanup,
            or an operations starter that documents one process and sets up a weekly report. You can
            add services once the first one is working.
          </p>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-3">
          {entryOffers.map((offer, i) => {
            const service = getService(offer.service);
            if (!service) return null;
            return (
              <Reveal
                as="li"
                key={offer.service}
                delay={i * 0.06}
                className="flex flex-col gap-4 rounded-card border border-bluegray bg-white p-6"
              >
                <p className="type-eyebrow">{service.title}</p>
                <h3 className="type-h3">{offer.name}</h3>
                <p className="flex-1 text-base leading-6 text-pretty">{offer.howItStarts}</p>
                <ArrowLink href={`${siteConfig.messageCta.href}?service=${offer.service}`}>
                  Ask for a quote
                </ArrowLink>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
