import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { initials, team } from "@/data/team";

/** Previews and local runs show unapproved cards (marked as drafts) for review */
const showDrafts = process.env.VERCEL_ENV !== "production";

/**
 * Founders and team cards (GDE-005 C4): initials until headshots and written consent
 * arrive (GDE-005 §14), never placeholder faces. Hidden when no card is approved.
 */
export function TeamSection() {
  const members = team.filter((m) => m.approved || showDrafts);
  if (members.length === 0) return null;

  return (
    <section aria-labelledby="team-title" className="border-t border-white/5 bg-bg">
      <div className="shell flex flex-col gap-11 section-y">
        <Reveal className="flex max-w-[720px] flex-col gap-4">
          <Eyebrow>Our team</Eyebrow>
          <h2
            id="team-title"
            className="text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance"
          >
            The people behind QuintByte.
          </h2>
        </Reveal>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
          {members.map((m, i) => (
            <Reveal
              as="li"
              key={m.name}
              delay={(i % 3) * 0.06}
              className="flex flex-col gap-4 rounded-card border border-white/7 bg-card p-[26px]"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex size-14 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-node font-mono text-lg font-bold text-accent"
                >
                  {initials(m.name)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[17px] font-bold text-ink">{m.name}</h3>
                  <p className="text-sm text-accent">{m.role}</p>
                </div>
              </div>
              <p className="text-[15px] leading-[1.6] text-pretty text-mute-2">
                {m.lines.filter(Boolean).join(" ")}
              </p>
              {!m.approved ? (
                <p className="self-start rounded-full border border-dashed border-white/25 px-3 py-1 font-mono text-[11px] tracking-[0.1em] text-mute-3 uppercase">
                  Draft · awaiting approval
                </p>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
