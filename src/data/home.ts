import type { IconName } from "@/components/icons/Icon";

type Labelled = { label: string; icon: IconName };

/**
 * "The business behind the business": the twelve chips (unchanged, rebrand brief) grouped
 * into four clusters. The cluster labels are new and need the CEO's OK with the preview.
 */
export const businessClusters: readonly { label: string; chips: readonly Labelled[] }[] = [
  {
    label: "Day to day",
    chips: [
      { label: "Inbox", icon: "inbox" },
      { label: "Meetings", icon: "calendar_month" },
      { label: "Documents", icon: "description" },
    ],
  },
  {
    label: "Customers and sales",
    chips: [
      { label: "Customers", icon: "groups" },
      { label: "Leads", icon: "person_add" },
      { label: "CRM", icon: "contacts" },
    ],
  },
  {
    label: "Money and growth",
    chips: [
      { label: "Payroll", icon: "payments" },
      { label: "Marketing", icon: "campaign" },
      { label: "Reports", icon: "analytics" },
    ],
  },
  {
    label: "Systems and delivery",
    chips: [
      { label: "IT & Systems", icon: "dns" },
      { label: "Processes", icon: "account_tree" },
      { label: "Projects", icon: "folder" },
    ],
  },
];

/** Ecosystem visual — the three pillars around the platform */
export const ecosystemPillars: readonly (Labelled & { caption: string })[] = [
  { label: "People", caption: "Right Specialists", icon: "groups" },
  { label: "Processes", caption: "Clear Workflows", icon: "account_tree" },
  { label: "Systems", caption: "The Right Tools", icon: "dns" },
];
