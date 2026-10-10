import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { entryOffers } from "@/data/offers";
import { getService } from "@/data/services";

/**
 * "Ways to start" (GDE-005 C2): the three entry offers, one "Ask for a quote" button
 * each, opening the message form with that service pre-selected. Lead from GDE-003 §7.
 */
export function WaysToStart({ id = "ways-to-start" }: { id?: string }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-white/5 bg-bg">
      <div className="shell flex flex-col gap-11 section-y">
        <Reveal className="flex max-w-[720px] flex-col gap-4">
          <Eyebrow>Start small</Eyebrow>
          <h2
            id={titleId}
            className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
          >
            Ways to start
          </h2>
          <p className="text-[17px] leading-[1.6] text-pretty text-mute">
            Common first steps are a two-week executive assistance pilot, a fixed-scope CRM cleanup,
            or an operations starter that documents one process and sets up a weekly report. You can
            add services once the first one is working.
          </p>
        </Reveal>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {entryOffers.map((offer, i) => {
            const service = getService(offer.service);
            if (!service) return null;
            return (
              <Reveal
                as="li"
                key={offer.service}
                delay={i * 0.06}
                className="flex flex-col gap-4 rounded-card border border-accent/25 bg-card p-[26px]"
              >
                <p className="font-mono text-[12px] font-medium tracking-[0.12em] text-accent uppercase">
                  {service.title}
                </p>
                <h3 className="text-xl font-extrabold tracking-[-0.01em] text-ink">{offer.name}</h3>
                <p className="flex-1 text-[15px] leading-[1.6] text-pretty text-mute-2">
                  {offer.howItStarts}
                </p>
                <ButtonLink
                  href={`${siteConfig.messageCta.href}?service=${offer.service}`}
                  variant="outline-dark"
                  size="sm"
                  arrow
                  className="self-start"
                >
                  Ask for a quote
                </ButtonLink>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
