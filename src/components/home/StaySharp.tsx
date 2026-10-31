import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { trainingParagraph } from "@/data/claims";
import { pagePhotos } from "@/data/photos";

/**
 * Home: "How we stay sharp" (rebrand brief, 24 Oct 2026). Heading, paragraph and a photo
 * on the left (sticky on wide screens), the four tools as a numbered list on the right.
 * No tool logos: the words do the work, and brand logos would need permission.
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
    <section aria-labelledby="sharp-title" className="bg-white pb-[clamp(80px,10vw,144px)]">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-start gap-x-20 gap-y-12">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-28">
          <Eyebrow>How we stay sharp</Eyebrow>
          <h2 id="sharp-title" className="type-h2 text-balance">
            We train each other, <span className="qb-highlight">so you don&rsquo;t have to</span>{" "}
            train us.
          </h2>
          <p className="max-w-[520px] type-body text-pretty">{trainingParagraph}</p>
          <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-card bg-mint">
            <Image
              src={pagePhotos.training.src}
              alt={pagePhotos.training.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <dl className="flex flex-col">
          {tools.map((tool, i) => (
            <Reveal
              key={tool.label}
              delay={i * 0.06}
              className="relative flex flex-col gap-2 border-t border-bluegray py-9 pl-[72px]"
            >
              <dt className="text-[clamp(28px,3vw,44px)] leading-[1.1] font-black tracking-[-0.025em]">
                <span
                  aria-hidden
                  className="absolute top-[46px] left-0 text-[13px] leading-none font-extrabold tracking-[0.12em]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tool.label}
              </dt>
              <dd className="max-w-[520px] type-body text-pretty">{tool.text}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
