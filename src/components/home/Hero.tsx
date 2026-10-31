import type { CSSProperties } from "react";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";
import { heroParagraph } from "@/data/claims";
import { pagePhotos } from "@/data/photos";
import { ScrollPhoto } from "@/components/sections/ScrollPhoto";

/** The headline, word by word, so each one can rise in on load */
const headline: { text: string; highlight?: boolean }[] = [
  { text: "Hire" },
  { text: "one" },
  { text: "person." },
  { text: "Get" },
  { text: "a" },
  { text: "whole firm", highlight: true },
  { text: "behind" },
  { text: "them." },
];

/**
 * Home hero: the headline at display size, the paragraph and one button beside each
 * other below it, then a full-width photo that settles into place as it scrolls in.
 */
export function Hero() {
  return (
    <>
      <section id="top" aria-labelledby="hero-title" className="bg-white">
        <div className="shell flex flex-col pt-14 pb-12 sm:pt-20 lg:pt-32">
          <Eyebrow as="span" className="mb-7">
            QuintByte (QB) · A service firm
          </Eyebrow>
          <h1 id="hero-title" className="max-w-[13ch] type-display text-balance text-slate">
            {headline.map((word, i) => (
              <span key={word.text}>
                <span
                  data-reveal=""
                  style={{ "--reveal-delay": `${i * 0.06}s` } as CSSProperties}
                  className={
                    word.highlight ? "inline-block qb-highlight whitespace-nowrap" : "inline-block"
                  }
                >
                  {word.text}
                </span>{" "}
              </span>
            ))}
          </h1>
          <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8 lg:mt-16">
            <p
              data-reveal=""
              style={{ "--reveal-delay": "0.5s" } as CSSProperties}
              className="max-w-[600px] text-[17px] leading-[1.6] text-pretty lg:text-xl"
            >
              {heroParagraph}
            </p>
            <div
              data-reveal=""
              style={{ "--reveal-delay": "0.6s" } as CSSProperties}
              className="flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              <ButtonLink href={siteConfig.cta.href}>{siteConfig.cta.label}</ButtonLink>
              <ArrowLink href="/how-it-works">See how it works</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <ScrollPhoto photo={pagePhotos.home} priority>
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-b from-transparent to-[rgba(31,46,51,0.55)] p-5 sm:p-8 lg:p-10">
          <p className="text-[22px] leading-[1.1] font-black text-white sm:text-3xl lg:text-4xl">
            {siteConfig.tagline}
          </p>
          <span className="rounded-full border border-white/60 px-4 py-2.5 text-[13px] font-extrabold tracking-[0.14em] text-white uppercase">
            San Pablo City, Laguna · PH
          </span>
        </div>
      </ScrollPhoto>
    </>
  );
}
