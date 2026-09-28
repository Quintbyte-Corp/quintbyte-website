import Image from "next/image";
import businessOwner from "@/assets/images/business-owner.webp";
import { Icon } from "@/components/icons/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { businessChips, floatTags } from "@/data/home";

export function BusinessBehind() {
  return (
    <section aria-labelledby="behind-title" className="bg-light text-ink-dark">
      <div className="shell split section-y">
        <Reveal className="flex flex-col gap-[22px]">
          <Eyebrow tone="light">The business behind the business</Eyebrow>
          <h2
            id="behind-title"
            className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
          >
            Running a business means managing more than the business itself.
          </h2>
          <p className="max-w-[540px] text-[17px] leading-[1.6] text-mute-light">
            There&rsquo;s always something that needs to be done — and it can quickly become
            overwhelming.
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-2.5" aria-label="Everyday business work">
            {businessChips.map((chip) => (
              <li
                key={chip.label}
                className="flex items-center gap-2 rounded-chip border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-chip"
              >
                <Icon name={chip.icon} className="text-lg text-accent-light" />
                {chip.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <figure className="@container relative aspect-4/3 w-full overflow-hidden rounded-frame bg-ink-dark">
            <Image
              src={businessOwner}
              alt="A business owner working late at a laptop in a dark office"
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
            <ul
              aria-hidden
              className="pointer-events-none absolute top-[10%] left-[8%] flex flex-col gap-3 @max-[440px]:gap-2"
            >
              {floatTags.map((tag, i) => (
                <li
                  key={tag.label}
                  className="flex w-max animate-float items-center gap-2 rounded-tag border border-accent/45 bg-[rgb(6_16_26/0.85)] px-3 py-[7px] text-[13px] font-semibold text-ink shadow-tag @max-[440px]:gap-1.5 @max-[440px]:px-2.5 @max-[440px]:py-[5px] @max-[440px]:text-[11px]"
                  style={{ marginLeft: tag.offset, animationDelay: `${i * -0.9}s` }}
                >
                  <Icon name={tag.icon} className="text-base text-accent @max-[440px]:text-sm" />
                  {tag.label}
                </li>
              ))}
            </ul>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
