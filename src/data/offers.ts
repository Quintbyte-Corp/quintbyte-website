import type { ServiceSlug } from "./services";

/**
 * The three entry offers (GDE-005 C2), word for word from GDE-003 §6.2–6.4.
 * No prices on the site (CEO decision): every card asks for a quote.
 */
export type EntryOffer = {
  service: ServiceSlug;
  /** Name of the first step */
  name: string;
  howItStarts: string;
  deliverables: readonly string[];
  /** GDE-003 marks it illustrative, and the page labels it so */
  scenario?: string;
};

export const entryOffers: readonly EntryOffer[] = [
  {
    service: "executive-assistance",
    name: "2-week paid pilot",
    howItStarts:
      "In week one we agree priorities, access and a daily handoff; in week two we run your routine and send a short report. Then you decide whether to continue monthly.",
    deliverables: [
      "Inbox triage and priority flags",
      "Calendar and meeting coordination across time zones",
      "Travel research and booking",
      "Meeting notes with action items",
      "Expense report preparation",
      "Research and follow-up tracking",
    ],
    scenario:
      "A property manager with 60 units wants two hours a day back from tenant emails and scheduling. Our assistant triages the inbox each morning, books maintenance visits, drafts replies for approval and sends a daily summary. By the end of the pilot, the owner reads one short summary instead of the whole inbox.",
  },
  {
    service: "crm-sales-support",
    name: "CRM or database cleanup",
    howItStarts:
      "A fixed-scope CRM or database cleanup with a clear record count and finish date, then optional monthly support.",
    deliverables: [
      "Duplicate merging and record updates",
      "Ownership and stage tidy-up",
      "Follow-up tracking",
      "Lead research",
      "Weekly pipeline report",
      "Appointment setting support",
    ],
  },
  {
    // Operations Coordination is the entry offer of this service (GDE-003 §6.4)
    service: "business-operations-management-support",
    name: "Ops Starter",
    howItStarts: "An Ops Starter over 2–4 weeks, then a monthly arrangement if it's useful.",
    deliverables: [
      "One documented SOP",
      "One tracker or dashboard",
      "Weekly report (done, in progress, next)",
      "Coordination of tasks across your team and ours",
    ],
  },
];

export const offerFor = (slug: string) => entryOffers.find((o) => o.service === slug);
