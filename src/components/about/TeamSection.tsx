import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { initials, team, type TeamMember } from "@/data/team";

/** Previews and local runs show unapproved cards (marked as drafts) for review */
const showDrafts = process.env.VERCEL_ENV !== "production";

/** Must match the gap-4 on the chart rows, so the connectors meet each card's centre */
const GAP = "1rem";

/**
 * Founders and team cards (GDE-005 C4) as an organization chart: the first member in
 * data/team.ts heads it, everyone else sits on the row below. Each card has the person's
 * own headshot, or initials until it arrives (GDE-005 §14), never placeholder faces.
 * The connectors are decorative and only drawn on wide screens, where the row is one line.
 */
export function TeamSection() {
  const members = team.filter((m) => m.approved || showDrafts);
  if (members.length === 0) return null;
  const [lead, ...reports] = members;
  const columns = { "--cols": Math.max(reports.length, 1) } as CSSProperties;

  return (
    <section aria-labelledby="team-title" className="border-t border-white/5 bg-bg">
      <div className="shell flex flex-col section-y">
        <div className="grid gap-8 lg:grid-cols-4 lg:items-center lg:gap-4">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow>Our team</Eyebrow>
            <h2
              id="team-title"
              className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
            >
              The people behind QuintByte.
            </h2>
          </Reveal>
          <div className="flex justify-center lg:col-span-2">
            <MemberCard member={lead} lead className="w-full sm:max-w-[calc((100%-1rem)/2)] lg:max-w-[380px]" />
          </div>
        </div>

        {reports.length > 0 ? (
          <>
            <Connectors count={reports.length} />
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

/** Line down from the lead card, across the row, and down into each card below */
function Connectors({ count }: { count: number }) {
  const line = "bg-accent/45";
  // Half a column's width: where the first and last column centres sit
  const inset = `calc((100% - ${count - 1} * ${GAP}) / ${count * 2})`;
  return (
    <div aria-hidden className="relative hidden h-14 lg:block">
      <span className={`absolute top-0 left-1/2 h-1/2 w-px -translate-x-1/2 ${line}`} />
      {count > 1 ? (
        <span className={`absolute top-1/2 h-px ${line}`} style={{ left: inset, right: inset }} />
      ) : null}
      <div
        className="absolute inset-x-0 top-1/2 bottom-0 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="relative">
            <span className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${line}`} />
            <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
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
      className={`flex flex-col items-center gap-4 rounded-card border bg-card p-[26px] text-center ${
        lead
          ? "border-accent/40 shadow-[0_0_32px_rgb(34_199_255/0.14)]"
          : "border-accent/20 shadow-[0_0_24px_rgb(34_199_255/0.06)]"
      } ${className}`}
    >
      {m.photo ? (
        <Image
          src={m.photo}
          alt=""
          sizes="192px"
          quality={90}
          placeholder="blur"
          className="size-24 shrink-0 rounded-full border-2 border-accent/50 object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-accent/50 bg-node font-mono text-2xl font-bold text-accent"
        >
          {initials(m.name)}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-[17px] font-bold text-ink">{m.name}</h3>
        <p className="text-sm text-accent">{m.role}</p>
      </div>
      <p className="text-[15px] leading-[1.6] text-pretty text-mute-2">
        {m.lines.filter(Boolean).join(" ")}
      </p>
      {!m.approved ? (
        <p className="rounded-full border border-dashed border-white/25 px-3 py-1 font-mono text-[11px] tracking-[0.1em] text-mute-3 uppercase">
          Draft · awaiting approval
        </p>
      ) : null}
    </Reveal>
  );
}
