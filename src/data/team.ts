import type { StaticImageData } from "next/image";
import heartLotitud from "@/assets/team/heart-lotitud.jpg";
import joaoExconde from "@/assets/team/joao-exconde.jpg";
import knightSabado from "@/assets/team/knight-sabado.jpg";
import kurtneyAsegurado from "@/assets/team/kurtney-asegurado.jpg";

/**
 * Founders and team (GDE-005 C4; names and titles from GDE-005 §6 and §13). The two
 * lines per person are condensed from the GDE-003 §4.3 draft bios, leaving out every
 * "[CONFIRM]" detail.
 *
 * `approved` turns a card on in production. Set it only after the person has approved
 * their card and Heart has their written consent (which covers the photo too). Until then
 * the card shows in previews only, marked as a draft, so each person can review it.
 *
 * `photo` is a square headshot from src/assets/team; without one the card shows initials.
 */
export type TeamMember = {
  name: string;
  role: string;
  lines: readonly [string, string?];
  photo?: StaticImageData;
  approved: boolean;
};

export const team: readonly TeamMember[] = [
  {
    name: "Joao Exconde",
    role: "Co-Founder & CEO",
    lines: [
      "Leads QuintByte's strategy, client relationships and operations.",
      "Designs the processes, quality checks and reporting behind every engagement.",
    ],
    photo: joaoExconde,
    approved: true,
  },
  {
    name: "Kurtney Asegurado",
    role: "Co-Founder & Chief Operating Officer",
    lines: [
      "Runs day-to-day operations: workflows, SOPs, capacity planning and client delivery.",
      "Has worked as an executive and productivity assistant to U.S.-based executives.",
    ],
    photo: kurtneyAsegurado,
    approved: true,
  },
  {
    name: "Heart Lotitud",
    role: "Chief Financial Officer",
    lines: [
      "Manages finance and controls: pricing, project costing, budgets, cash flow and reporting.",
      "Keeps every engagement clearly scoped and properly priced.",
    ],
    photo: heartLotitud,
    approved: true,
  },
  {
    name: "Mark Laurence Bongulto",
    role: "Software Engineer",
    lines: [
      "Builds QuintByte's web and software solutions with React, Next.js, TypeScript, React Native and Laravel.",
      "Has worked on government and enterprise systems.",
    ],
    approved: true,
  },
  {
    name: "Knight Sabado",
    role: "Co-Founder & Software Engineer",
    // Second line from Knight's CV, approved with the card (16 Oct 2026)
    lines: [
      "Builds and maintains QuintByte's web and software solutions.",
      "Works in React, Next.js, TypeScript and Tailwind CSS, and holds a BS in Information Technology from Pamantasan ng Lungsod ng San Pablo.",
    ],
    photo: knightSabado,
    approved: true,
  },
];

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part, i, parts) => i === 0 || i === parts.length - 1)
    .map((part) => part[0])
    .join("");
