import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TreeConnectors } from "@/components/ui/TreeConnectors";
import { initials, team, type TeamMember } from "@/data/team";

/** Previews and local runs show unapproved cards (marked as drafts) for review */
const showDrafts = process.env.VERCEL_ENV !== "production";

/**
 * Founders and team cards (GDE-005 C4) as an organization chart: the first member in
 * data/team.ts heads it, everyone else sits on the row below. Each card has the person's
 * own headshot, or initials until it arrives (GDE-005 §14), never placeholder faces.
 * The connectors are only drawn on wide screens, where the row is one line.
 */
export function TeamSection() {
  const members = team.filter((m) => m.approved || showDrafts);
  if (members.length === 0) return null;
  const [lead, ...reports] = members;
  const columns = { "--cols": Math.max(reports.length, 1) } as CSSProperties;

  return (
    <section aria-labelledby="team-title" className="border-t border-bluegray/50 bg-white">
      <div className="shell flex flex-col section-y">
        <div className="grid gap-8 lg:grid-cols-4 lg:items-center lg:gap-4">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow>Our team</Eyebrow>
            <h2 id="team-title" className="type-h2 text-balance">
              The people behind <span className="qb-highlight">QuintByte.</span>
            </h2>
          </Reveal>
          <div className="flex justify-center lg:col-span-2">
            <MemberCard
              member={lead}
              lead
              className="w-full sm:max-w-[calc((100%-16px)/2)] lg:max-w-[380px]"
            />
          </div>
        </div>

        {reports.length > 0 ? (
          <>
            <TreeConnectors count={reports.length} className="hidden lg:block" />
            <ul
              style={columns}
              className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
            >
              {reports.map((m, i) => (
                <MemberCard key={m.name} member={m} as="li" delay={0.08 + (i % 4) * 0.06} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}

function MemberCard({
  member: m,
  lead = false,
  as = "div",
  delay = 0,
  className = "",
}: {
  member: TeamMember;
  lead?: boolean;
  as?: "div" | "li";
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal
      as={as}
      delay={delay}
      className={`flex flex-col items-center gap-4 rounded-card bg-white p-6 text-center ${
        lead ? "border-2 border-slate" : "border border-bluegray"
      } ${className}`}
    >
      {m.photo ? (
        <Image
          src={m.photo}
          alt=""
          sizes="192px"
          quality={90}
          placeholder="blur"
          className="size-24 shrink-0 rounded-full border-2 border-bluegray object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-bluegray bg-white text-2xl font-black"
        >
          {initials(m.name)}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg leading-6 font-extrabold">{m.name}</h3>
        <p className="text-base">{m.role}</p>
      </div>
      <p className="text-base leading-6 text-pretty">{m.lines.filter(Boolean).join(" ")}</p>
      {!m.approved ? (
        <p className="rounded-chip border border-dashed border-bluegray px-3 py-1 text-xs font-extrabold tracking-[0.12em] uppercase">
          Draft · awaiting approval
        </p>
      ) : null}
    </Reveal>
  );
}
