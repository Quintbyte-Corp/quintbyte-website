import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowDot } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { entryOffers } from "@/data/offers";
import { photoFor } from "@/data/photos";
import { getService } from "@/data/services";

/**
 * "Ways to start" (GDE-005 C2): the three entry offers as photo cards. Each card opens the
 * message form with that service pre-selected. Lead from GDE-003 §7.
 */
export function WaysToStart({ id = "ways-to-start" }: { id?: string }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="bg-paper section-y">
      <div className="shell flex flex-col gap-10 lg:gap-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex max-w-[760px] flex-col gap-5">
            <Eyebrow>Start small</Eyebrow>
            <h2
              id={titleId}
              className="text-[clamp(44px,6.4vw,104px)] leading-[0.98] font-black tracking-[-0.035em]"
            >
              Ways to <span className="qb-highlight">start</span>
            </h2>
          </div>
          <p className="max-w-[460px] text-[17px] leading-[1.6] text-pretty">
            Common first steps are a two-week executive assistance pilot, a fixed-scope CRM cleanup,
            or an operations starter that documents one process and sets up a weekly report. You can
            add services once the first one is working.
          </p>
        </Reveal>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">
          {entryOffers.map((offer, i) => {
            const service = getService(offer.service);
            if (!service) return null;
            const photo = photoFor(service.slug);
            return (
              <Reveal as="li" key={offer.service} delay={i * 0.06} className="flex">
                <Link
                  href={`${siteConfig.messageCta.href}?service=${offer.service}`}
                  data-event="offer_card_click"
                  data-event-label={offer.service}
                  className="group flex w-full flex-col overflow-hidden rounded-card border border-bluegray/60 bg-white transition-[translate,box-shadow] duration-400 ease-qb hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(51,74,82,0.35)]"
                >
                  {photo ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-mint">
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-qb group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-3.5 p-7">
                    <p className="text-xs font-extrabold tracking-[0.14em] text-muted uppercase">
                      {String(i + 1).padStart(2, "0")} · {service.title}
                    </p>
                    <h3 className="text-[clamp(24px,2.2vw,32px)] leading-[1.1] font-black tracking-[-0.015em]">
                      {offer.name}
                    </h3>
                    <p className="flex-1 text-base leading-[1.6] text-pretty">
                      {offer.howItStarts}
                    </p>
                    <span className="flex items-center gap-2.5 pt-2 font-extrabold">
                      Ask for a quote <ArrowDot />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
