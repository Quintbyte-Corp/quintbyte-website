import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollPhoto } from "./ScrollPhoto";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Photo } from "@/data/photos";

type Crumb = { name: string; href: string };

type PageHeroProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** One button, plus any text links, under the lead */
  actions?: ReactNode;
  /** Optional visual in a second column (used when there is no photo) */
  aside?: ReactNode;
  breadcrumbs?: Crumb[];
  /**
   * A photo: "wide" runs full width below the hero (main pages); "aside" sits in the
   * right-hand column (service pages)
   */
  photo?: Photo;
  photoLayout?: "wide" | "aside";
};

/** Opening band for inner pages: white, left-aligned, the hero headline scale */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  aside,
  breadcrumbs,
  photo,
  photoLayout = "wide",
}: PageHeroProps) {
  const side =
    photo && photoLayout === "aside" ? (
      <div className="relative aspect-[4/3] origin-top overflow-hidden rounded-[32px] bg-mint">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    ) : (
      aside
    );
  const twoColumns = Boolean(side);

  return (
    <>
      <section aria-labelledby="page-title" className="bg-white">
        <div className="shell pt-10 pb-12 sm:pt-14 lg:pt-20">
          {breadcrumbs ? (
            <nav aria-label="Breadcrumb" className="mb-10 lg:mb-16">
              <ol className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-muted">
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    {i < breadcrumbs.length - 1 ? (
                      <Link
                        href={crumb.href}
                        className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-150 hover:text-slate hover:decoration-cyan"
                      >
                        {crumb.name}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-slate">
                        {crumb.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {twoColumns ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-center gap-x-16 gap-y-10">
              <div className="flex flex-col items-start gap-6">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h1
                  id="page-title"
                  data-reveal=""
                  className="text-[clamp(44px,6vw,96px)] leading-[0.98] font-black tracking-[-0.035em] text-balance"
                >
                  {title}
                </h1>
                {lead ? (
                  <div
                    data-reveal=""
                    className="flex max-w-[600px] flex-col gap-4 text-[17px] leading-[1.6] text-pretty lg:text-xl"
                  >
                    {lead}
                  </div>
                ) : null}
                {actions ? (
                  <div data-reveal="" className="flex flex-wrap items-center gap-x-7 gap-y-4">
                    {actions}
                  </div>
                ) : null}
              </div>
              <div data-reveal="">{side}</div>
            </div>
          ) : (
            <>
              <Eyebrow className="mb-7">{eyebrow}</Eyebrow>
              <h1 id="page-title" data-reveal="" className="max-w-[16ch] type-hero text-balance">
                {title}
              </h1>
              {lead || actions ? (
                <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-16 gap-y-8 lg:mt-14">
                  {lead ? (
                    <div
                      data-reveal=""
                      className="flex max-w-[640px] flex-col gap-4 text-[17px] leading-[1.6] text-pretty lg:text-xl"
                    >
                      {lead}
                    </div>
                  ) : (
                    <span />
                  )}
                  {actions ? (
                    <div data-reveal="" className="flex flex-wrap items-center gap-x-7 gap-y-4">
                      {actions}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
      {photo && photoLayout === "wide" ? <ScrollPhoto photo={photo} priority /> : null}
    </>
  );
}
