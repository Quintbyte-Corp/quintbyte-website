import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";

/** Plain-language legal page: the white opening band, then readable prose */
export function LegalDocument({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  /** Shown under the title, e.g. "October 2026" */
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        lead={
          <>
            {intro}
            <p className="text-base">Last updated: {updated}</p>
          </>
        }
      />
      <section className="bg-paper">
        <div className="shell section-y">
          <div className="flex max-w-[760px] flex-col gap-12 type-body [&_a]:font-extrabold [&_a]:underline [&_a]:decoration-cyan [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-[3px] [&_li]:pl-1 [&_strong]:font-extrabold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="type-h3">
        {title}
      </h2>
      {children}
    </section>
  );
}
