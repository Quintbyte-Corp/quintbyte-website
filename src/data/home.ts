import type { IconName } from "@/components/icons/Icon";
import type { ServiceSlug } from "./services";

type Labelled = { label: string; icon: IconName };

/** Hero orbit — 10 nodes, clockwise from the top, each linking to its service */
export const orbitNodes: readonly (Labelled & { service: ServiceSlug })[] = [
  { label: "Executive Support", icon: "person", service: "executive-assistance" },
  { label: "CRM & Sales", icon: "bar_chart", service: "crm-sales-support" },
  { label: "Marketing", icon: "campaign", service: "marketing-creative-support" },
  { label: "Creative", icon: "palette", service: "graphic-design-creative-production" },
  { label: "IT & Tech", icon: "computer", service: "it-technical-support" },
  { label: "AI & Automation", icon: "smart_toy", service: "ai-automation-support" },
  { label: "Finance", icon: "database", service: "bookkeeping-finance-support" },
  { label: "HR & People", icon: "groups", service: "human-resources-people-support" },
  { label: "Customer Support", icon: "forum", service: "customer-service-client-support" },
  { label: "Operations", icon: "settings", service: "administrative-operations-support" },
];

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

/** Floating tags over the business-owner photo, with the design's staggered offsets */
export const floatTags: readonly (Labelled & { offset: string })[] = [
  { label: "Follow-ups", icon: "reply", offset: "40%" },
  { label: "Reports", icon: "analytics", offset: "0%" },
  { label: "Contracts", icon: "contract", offset: "30%" },
  { label: "Marketing", icon: "campaign", offset: "4%" },
  { label: "Expenses", icon: "receipt_long", offset: "26%" },
  { label: "Payroll", icon: "payments", offset: "14%" },
];

/** Ecosystem visual — the three pillars around the platform */
export const ecosystemPillars: readonly (Labelled & { caption: string })[] = [
  { label: "People", caption: "Right Specialists", icon: "groups" },
  { label: "Processes", caption: "Clear Workflows", icon: "account_tree" },
  { label: "Systems", caption: "The Right Tools", icon: "dns" },
];
