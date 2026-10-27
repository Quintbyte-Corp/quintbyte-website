import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Crumb = { name: string; href: string };

type PageHeroProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** One button, plus any text links, under the lead */
  actions?: ReactNode;
  /** Optional visual in a second column */
  aside?: ReactNode;
  breadcrumbs?: Crumb[];
};

/** Opening band for inner pages: white, left-aligned, the hero headline scale */
export function PageHero({ eyebrow, title, lead, actions, aside, breadcrumbs }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="border-b border-bluegray/50 bg-white">
      <div
        className={`shell py-16 lg:py-24 ${
          aside ? "grid items-center gap-12 lg:grid-cols-12 lg:gap-16" : ""
        }`}
      >
        <div className={`flex flex-col items-start gap-6 ${aside ? "lg:col-span-7" : ""}`}>
          {breadcrumbs ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    {i < breadcrumbs.length - 1 ? (
                      <Link
                        href={crumb.href}
                        className="underline decoration-cyan decoration-2 underline-offset-4 transition-[text-decoration-thickness] duration-150 hover:decoration-[3px]"
                      >
                        {crumb.name}
                      </Link>
                    ) : (
                      <span aria-current="page">{crumb.name}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id="page-title" className="max-w-[960px] type-hero text-balance">
            {title}
          </h1>
          {lead ? (
            <div className="flex max-w-[680px] flex-col gap-4 type-body text-pretty">{lead}</div>
          ) : null}
          {actions ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">{actions}</div>
          ) : null}
        </div>
        {aside ? <div className="lg:col-span-5">{aside}</div> : null}
      </div>
    </section>
  );
}
