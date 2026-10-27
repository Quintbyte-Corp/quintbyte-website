import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { trainingParagraph } from "@/data/claims";

/**
 * Home: "How we stay sharp" (rebrand brief, 24 Oct 2026), after "A complete business
 * support ecosystem". Heading and paragraph on the left (5 of 12 columns), the four tools
 * as a plain two-column list on the right (7 of 12). No cards, icons or tool logos: the
 * words do the work, and brand logos would need permission.
 */
const tools = [
  {
    label: "AI assistants",
    text: "Claude and ChatGPT for research, drafting and analysis, always checked by a person",
  },
  {
    label: "CRM platforms",
    text: "Clean records, pipelines and follow-ups. We work in your CRM, or recommend one if you don't have one.",
  },
  { label: "Google Workspace", text: "Email, calendars, shared documents and spreadsheets" },
  { label: "Canva", text: "On-brand graphics, social posts and documents" },
] as const;

export function StaySharp() {
  return (
    <section aria-labelledby="sharp-title" className="border-t border-bluegray/50 bg-white">
      <div className="shell grid items-start gap-12 section-y lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex flex-col gap-4 lg:col-span-5">
          <Eyebrow>How we stay sharp</Eyebrow>
          <h2 id="sharp-title" className="type-h2 text-balance">
            We train each other, <span className="qb-highlight">so you don&rsquo;t have to</span>{" "}
            train us.
          </h2>
          <p className="type-body text-pretty">{trainingParagraph}</p>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <dl className="grid gap-x-12 gap-y-8 border-t border-bluegray pt-8 sm:grid-cols-2">
            {tools.map((tool) => (
              <div key={tool.label} className="flex flex-col gap-2">
                <dt className="type-h3">{tool.label}</dt>
                <dd className="type-body text-pretty">{tool.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
