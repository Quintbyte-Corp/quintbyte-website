import type { IconName } from "@/components/icons/Icon";

type Labelled = { label: string; icon: IconName };

/** "The business behind the business" chips */
export const businessChips: readonly Labelled[] = [
  { label: "Inbox", icon: "inbox" },
  { label: "Meetings", icon: "calendar_month" },
  { label: "Customers", icon: "groups" },
  { label: "Leads", icon: "person_add" },
  { label: "Payroll", icon: "payments" },
  { label: "CRM", icon: "contacts" },
  { label: "Marketing", icon: "campaign" },
  { label: "IT & Systems", icon: "dns" },
  { label: "Documents", icon: "description" },
  { label: "Processes", icon: "account_tree" },
  { label: "Reports", icon: "analytics" },
  { label: "Projects", icon: "folder" },
];

/** Ecosystem visual — the three pillars around the platform */
export const ecosystemPillars: readonly (Labelled & { caption: string })[] = [
  { label: "People", caption: "Right Specialists", icon: "groups" },
  { label: "Processes", caption: "Clear Workflows", icon: "account_tree" },
  { label: "Systems", caption: "The Right Tools", icon: "dns" },
];
