import type { IconName } from "@/components/icons/Icon";

/**
 * "How QuintByte Works": Understand → Scope → Confirm → Assign → Deliver → Review.
 * `summary` is the design's step copy; `detail` is the corresponding wording from the
 * BMS Service Description.
 */
export type ProcessStep = {
  num: string;
  title: string;
  icon: IconName;
  summary: string;
  detail: string;
};

export const processSteps: readonly ProcessStep[] = [
  {
    num: "01",
    title: "Understand",
    icon: "search",
    summary: "We identify what your business actually needs.",
    detail: "We first understand the client's actual problem.",
  },
  {
    num: "02",
    title: "Scope",
    icon: "description",
    summary: "We define responsibilities, skills, outputs, and requirements.",
    detail:
      "We define the work, responsibilities, expected outputs, deadlines, access requirements, and boundaries.",
  },
  {
    num: "03",
    title: "Confirm",
    icon: "task_alt",
    summary: "We confirm capability, capacity, pricing, and delivery conditions.",
    detail:
      "Before work begins, QuintByte confirms that the required skill, capacity, pricing, funding, reviewer, and delivery conditions are available.",
  },
  {
    num: "04",
    title: "Assign",
    icon: "groups",
    summary: "We connect the work with the appropriate specialist or team member.",
    detail:
      "Once activated, the work is assigned to the right specialist or team member for the agreed scope.",
  },
  {
    num: "05",
    title: "Deliver",
    icon: "play_circle",
    summary: "We perform the work while coordinating delivery.",
    detail:
      "The assigned specialist performs the work while the appropriate QuintByte manager coordinates delivery, escalation, and client communication.",
  },
  {
    num: "06",
    title: "Review",
    icon: "visibility",
    summary: "We maintain visibility, address issues, and review the work.",
    detail:
      "We maintain visibility throughout the engagement, address issues, and review the work so it stays clear, manageable, and accountable.",
  },
];

/** BMS Service Description — the objective behind the process */
export const processObjective =
  "The objective is not simply to complete tasks. It is to make sure the work is clear, manageable, accountable, and useful to the client's business.";
