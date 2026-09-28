import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Crumb = { name: string; href: string };

type PageHeroProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons or other actions under the lead */
  actions?: ReactNode;
  /** Optional visual in a second column */
  aside?: ReactNode;
  breadcrumbs?: Crumb[];
};

/**
 * Opening band for inner pages, built from the hero's surface (dark, off-centre radial
 * glow) and the section heading scale.
 */
export function PageHero({ eyebrow, title, lead, actions, aside, breadcrumbs }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative border-b border-white/5 bg-[radial-gradient(ellipse_60%_80%_at_78%_40%,rgb(34_150_255/0.14),transparent_70%)]"
    >
      <div
        className={`shell py-[clamp(48px,6.5vw,88px)] ${
          aside
            ? "grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,5vw,72px)]"
            : ""
        }`}
      >
        <div className="flex flex-col items-start gap-6">
          {breadcrumbs ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-mute-2">
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    {i < breadcrumbs.length - 1 ? (
                      <Link href={crumb.href} className="transition-colors hover:text-accent">
                        {crumb.name}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-mute-3">
                        {crumb.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1
            id="page-title"
            className="max-w-[900px] text-[clamp(38px,4.8vw,64px)] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance"
          >
            {title}
          </h1>
          {lead ? (
            <div className="flex max-w-[640px] flex-col gap-4 text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-pretty text-mute">
              {lead}
            </div>
          ) : null}
          {actions ? <div className="mt-1 flex flex-wrap gap-3.5">{actions}</div> : null}
        </div>
        {aside}
      </div>
    </section>
  );
}
