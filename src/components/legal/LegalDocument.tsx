import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";

/** Plain-language legal page: dark opening band, then readable prose on light */
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
            <p className="text-sm text-mute-2">Last updated: {updated}</p>
          </>
        }
      />
      <section className="bg-light text-ink-dark">
        <div className="shell section-y">
          <div className="mx-auto flex max-w-[760px] flex-col gap-10 text-[16px] leading-[1.7] text-mute-light [&_a]:font-semibold [&_a]:text-ink-dark [&_a]:underline [&_a]:decoration-line-3 [&_a]:underline-offset-4 [&_a:hover]:decoration-ink-dark [&_li]:pl-1 [&_strong]:text-ink-dark [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
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
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2
        id={id}
        className="text-[clamp(20px,2vw,24px)] leading-[1.25] font-extrabold tracking-[-0.02em] text-ink-dark"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
