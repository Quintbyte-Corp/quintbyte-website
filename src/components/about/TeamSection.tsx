import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { initials, team, type TeamMember } from "@/data/team";

/** Previews and local runs show unapproved cards (marked as drafts) for review */
const showDrafts = process.env.VERCEL_ENV !== "production";

/**
 * Founders and team cards (GDE-005 C4): the first member in data/team.ts leads, on a
 * Deep Slate card; everyone else follows in a grid. Each card has the person's own
 * headshot, or initials until it arrives (GDE-005 §14), never placeholder faces.
 */
export function TeamSection() {
  const members = team.filter((m) => m.approved || showDrafts);
  if (members.length === 0) return null;
  const [lead, ...reports] = members;
  if (!lead) return null;

  return (
    <section aria-labelledby="team-title" className="bg-white section-y">
      <div className="shell flex flex-col gap-5">
        <Reveal className="mb-6 flex max-w-[900px] flex-col gap-5 lg:mb-10">
          <Eyebrow>Our team</Eyebrow>
          <h2 id="team-title" className="type-h2 text-balance">
            The people behind <span className="qb-highlight">QuintByte.</span>
          </h2>
        </Reveal>

        <Reveal className="qb-band grid grid-cols-[auto_1fr] items-center gap-x-8 gap-y-6 rounded-card bg-slate p-7 text-white sm:p-10 lg:p-12">
          <Avatar member={lead} size="lg" />
          <div className="flex flex-col gap-2">
            <h3 className="text-[clamp(28px,3vw,44px)] leading-[1.1] font-black tracking-[-0.02em]">
              {lead.name}
            </h3>
            <p className="type-eyebrow text-mint">{lead.role}</p>
          </div>
          <p className="col-span-full max-w-[820px] text-lg leading-[1.6] text-pretty lg:text-[21px]">
            {lead.lines.filter(Boolean).join(" ")}
          </p>
          <DraftNote member={lead} />
        </Reveal>

        {reports.length > 0 ? (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
            {reports.map((m, i) => (
              <Reveal
                as="li"
                key={m.name}
                delay={(i % 4) * 0.06}
                className="flex flex-col gap-4 rounded-card border border-bluegray/60 bg-white p-7"
              >
                <Avatar member={m} />
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl leading-[1.2] font-black tracking-[-0.01em]">{m.name}</h3>
                  <p className="text-[13px] leading-5 font-extrabold tracking-[0.1em] text-muted uppercase">
                    {m.role}
                  </p>
                </div>
                <p className="text-base leading-[1.6] text-pretty">
                  {m.lines.filter(Boolean).join(" ")}
                </p>
                <DraftNote member={m} />
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function Avatar({ member: m, size = "md" }: { member: TeamMember; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-24 text-3xl" : "size-20 text-2xl";
  return m.photo ? (
    <Image
      src={m.photo}
      alt=""
      sizes={size === "lg" ? "192px" : "160px"}
      quality={90}
      placeholder="blur"
      className={`${box} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span
      aria-hidden
      className={`${box} flex shrink-0 items-center justify-center rounded-full bg-mint font-black text-slate`}
    >
      {initials(m.name)}
    </span>
  );
}

function DraftNote({ member: m }: { member: TeamMember }) {
  return !m.approved ? (
    <p className="w-fit rounded-full border border-dashed border-bluegray px-3 py-1 text-xs font-extrabold tracking-[0.12em] uppercase">
      Draft · awaiting approval
    </p>
  ) : null;
}
