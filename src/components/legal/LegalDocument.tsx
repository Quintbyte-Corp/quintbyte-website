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
            <p className="w-fit rounded-full bg-mint px-4 py-2 text-sm font-extrabold">
              Last updated: {updated}
            </p>
          </>
        }
      />
      <section className="bg-white pt-6 pb-[clamp(80px,10vw,144px)]">
        <div className="shell">
          <div className="flex max-w-[780px] flex-col gap-12 type-body [&_a]:font-extrabold [&_a]:underline [&_a]:decoration-cyan [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-[3px] [&_li]:pl-1 [&_strong]:font-extrabold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
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
    <section aria-labelledby={id} className="flex flex-col gap-4 border-t border-bluegray pt-8">
      <h2
        id={id}
        className="text-[clamp(24px,2.4vw,32px)] leading-[1.2] font-black tracking-[-0.015em]"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
