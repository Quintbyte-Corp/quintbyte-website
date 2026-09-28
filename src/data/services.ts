import type { IconName } from "@/components/icons/Icon";

/**
 * The 14 official QuintByte service categories.
 *
 * Source of truth: "QuintByte Corp. Business Management Services — Comprehensive
 * Service Description". `description`, `items` and `bestSuitedFor` are taken verbatim
 * from that document. `summary` is the one-line card copy: the design's copy for
 * services 1–9, and a condensed list of the document's own items for 10–14.
 */
export type Service = {
  slug: string;
  /** Position in the official document, 1–14 */
  number: number;
  /** Official category name */
  title: string;
  /** Compact label used where space is tight (orbit, form options) */
  shortTitle: string;
  category: ServiceCategory;
  /** One-line card description */
  summary: string;
  /** Opening paragraph from the service description */
  description: string;
  /** "Services may include" */
  items: readonly string[];
  /** "Best suited for" */
  bestSuitedFor: string;
  icon: IconName;
  /** OKLCH hue for the icon colour, per the design's token scheme */
  hue: number;
  /** Optional supporting image; none of the services has one in the design */
  image?: { src: string; alt: string };
};

export type ServiceCategory =
  | "Executive & Administrative"
  | "Sales & Customer"
  | "Marketing & Creative"
  | "Technology & Digital"
  | "Finance & People"
  | "Research & Operations"
  | "Custom Support";

export const services = [
  {
    slug: "executive-assistance",
    number: 1,
    title: "Executive Assistance",
    shortTitle: "Executive Support",
    category: "Executive & Administrative",
    summary: "Calendar, emails, travel, meetings and more.",
    description:
      "Our Executive Assistance services are designed for business owners, executives, managers, and professionals who need reliable support with their daily administrative workload.",
    items: [
      "Calendar and schedule management",
      "Meeting coordination",
      "Inbox and email management",
      "Travel planning and booking",
      "Hotel, airfare, and transportation coordination",
      "Restaurant and reservation booking",
      "Expense report preparation",
      "Meeting notes and action-item tracking",
      "Executive research",
      "Presentation preparation",
      "Contact and database management",
      "Client gift research and coordination",
      "Task and deadline monitoring",
      "Administrative follow-ups",
    ],
    bestSuitedFor:
      "Executives who need more time to focus on decision-making, client relationships, and higher-value work instead of repetitive administrative tasks.",
    icon: "person",
    hue: 225,
  },
  {
    slug: "administrative-operations-support",
    number: 2,
    title: "Administrative & Operations Support",
    shortTitle: "Operations Support",
    category: "Executive & Administrative",
    summary: "Documentation, coordination, internal systems.",
    description:
      "QuintByte helps businesses organize and maintain the day-to-day processes that keep operations moving.",
    items: [
      "Data entry and records management",
      "Document preparation and formatting",
      "File and folder organization",
      "Internal trackers",
      "Task and deadline management",
      "Task follow-up and accountability support",
      "SOP creation and process documentation",
      "Meeting minutes",
      "Internal reporting",
      "Forms and templates",
      "Workflow documentation",
      "Database maintenance",
      "Vendor coordination",
      "Procurement research",
      "Project coordination",
      "Cross-functional task tracking",
      "Operational dashboards",
    ],
    bestSuitedFor:
      "Growing teams that have work getting done but lack consistent systems, documentation, ownership, or visibility.",
    icon: "settings",
    hue: 250,
  },
  {
    slug: "crm-sales-support",
    number: 3,
    title: "CRM & Sales Support",
    shortTitle: "CRM & Sales",
    category: "Sales & Customer",
    summary: "Manage leads, pipeline and sales activities.",
    description:
      "Our CRM and Sales Support services help businesses organize leads, maintain clean customer records, and improve visibility throughout the sales pipeline.",
    items: [
      "CRM administration",
      "Salesforce support",
      "CRM cleanup",
      "Duplicate record management",
      "Contact and account maintenance",
      "Lead database management",
      "Lead research",
      "Lead qualification support",
      "Opportunity tracking",
      "Pipeline management",
      "Sales activity tracking",
      "Follow-up monitoring",
      "Appointment setting support",
      "Proposal coordination",
      "Sales documentation",
      "CRM reporting",
      "Data imports and exports",
      "Sales administration",
    ],
    bestSuitedFor:
      "Businesses with leads coming in but inconsistent follow-up, outdated CRM records, or limited pipeline visibility.",
    icon: "bar_chart",
    hue: 240,
  },
  {
    slug: "customer-service-client-support",
    number: 4,
    title: "Customer Service & Client Support",
    shortTitle: "Customer Support",
    category: "Sales & Customer",
    summary: "Email, chat, inquiries and client care.",
    description:
      "QuintByte can help manage routine customer and client communication while maintaining clear escalation channels for concerns that require management attention.",
    items: [
      "Email customer support",
      "Chat support",
      "Inquiry management",
      "Appointment and booking support",
      "Customer follow-ups",
      "Client onboarding support",
      "Request tracking",
      "Complaint routing and escalation",
      "Feedback collection",
      "FAQ management",
      "Customer database updates",
      "Client relationship administration",
      "Status updates and coordination",
    ],
    bestSuitedFor:
      "Businesses that need consistent customer communication without requiring owners or managers to personally handle every inquiry.",
    icon: "forum",
    hue: 290,
  },
  {
    slug: "marketing-creative-support",
    number: 5,
    title: "Marketing & Creative Support",
    shortTitle: "Marketing",
    category: "Marketing & Creative",
    summary: "Social media, content, campaigns.",
    description:
      "Our Marketing & Creative services help businesses maintain a professional digital presence and consistently produce useful marketing materials.",
    items: [
      "Digital marketing support",
      "Social media management",
      "Content scheduling",
      "Content calendar management",
      "Caption and basic copywriting",
      "Marketing research",
      "Competitor research",
      "Campaign coordination",
      "Email marketing support",
      "Community engagement",
      "Social media inbox management",
      "Performance and analytics reporting",
      "Promotional materials",
      "Lead magnets",
      "Presentation graphics",
      "Publication material or PUBMAT creation",
      "Social media graphics",
      "Branding materials",
      "Canva-based design support",
      "Brochures and digital collateral",
      "Creative production support",
    ],
    bestSuitedFor:
      "Businesses that want consistent marketing execution but do not necessarily need a full internal marketing department.",
    icon: "campaign",
    hue: 45,
  },
  {
    slug: "graphic-design-creative-production",
    number: 6,
    title: "Graphic Design & Creative Production",
    shortTitle: "Creative",
    category: "Marketing & Creative",
    summary: "Graphic design, branding and visual assets.",
    description:
      "QuintByte provides project-based graphic design support for both internal company needs and client-facing materials.",
    items: [
      "Social media graphics",
      "Publication materials",
      "Promotional assets",
      "Brand visuals",
      "Presentation layouts",
      "Brochures",
      "Digital banners",
      "Marketing collateral",
      "Event materials",
      "Website visual assets",
      "Business documents",
      "Campaign graphics",
      "Editable design files when included in scope",
    ],
    bestSuitedFor:
      "Organizations that need dependable creative output without maintaining a full-time design department.",
    icon: "palette",
    hue: 340,
  },
  {
    slug: "it-technical-support",
    number: 7,
    title: "IT & Technical Support",
    shortTitle: "IT & Tech",
    category: "Technology & Digital",
    summary: "Systems, tools and technical assistance.",
    description:
      "QuintByte provides practical technical support for businesses that need assistance with everyday systems, software, access, and technology coordination.",
    items: [
      "Basic IT helpdesk support",
      "User account setup",
      "Email account support",
      "Microsoft 365 support",
      "Google Workspace support",
      "Software installation assistance",
      "Basic troubleshooting",
      "Password and access assistance",
      "User access management",
      "Technical documentation",
      "Tool configuration",
      "IT account and asset documentation",
      "CRM technical support",
      "Website support coordination",
      "Domain and hosting coordination",
    ],
    bestSuitedFor:
      "Small and growing businesses that need technical support but do not require a dedicated internal IT department.",
    icon: "computer",
    hue: 215,
  },
  {
    slug: "website-digital-solutions",
    number: 8,
    title: "Website & Digital Solutions",
    shortTitle: "Website & Digital",
    category: "Technology & Digital",
    // The design card read "Websites, apps and digital products." — apps are not in the
    // documented scope, so the summary follows the service description instead.
    summary: "Websites, landing pages, forms and integrations.",
    description:
      "QuintByte can provide project-based digital solutions for businesses that need a stronger online presence or improved digital workflows.",
    items: [
      "Business website development",
      "Landing page development",
      "Website content updates",
      "Website maintenance",
      "Inquiry form setup",
      "Booking form integration",
      "CRM integration",
      "Website analytics setup",
      "Domain and hosting assistance",
      "Technical website coordination",
      "Basic workflow integration",
      "Website support",
    ],
    bestSuitedFor:
      "Businesses that need a professional digital presence or a more organized online inquiry process.",
    icon: "language",
    hue: 185,
  },
  {
    slug: "ai-automation-support",
    number: 9,
    title: "AI & Automation Support",
    shortTitle: "AI & Automation",
    category: "Technology & Digital",
    summary: "Automate workflows and reduce manual work.",
    description:
      "QuintByte helps businesses use AI and automation as practical productivity tools rather than as replacements for human judgment.",
    items: [
      "AI-assisted administrative workflows",
      "AI-assisted research",
      "Email drafting support",
      "Document summarization",
      "Meeting summaries",
      "Action-item extraction",
      "AI-assisted reporting",
      "AI-assisted content drafting",
      "Prompt template development",
      "AI workflow setup",
      "Business process automation",
      "Automated task routing",
      "Basic chatbot setup",
      "CRM workflow assistance",
      "Automated follow-up support",
      "Knowledge base setup",
      "AI productivity tool configuration",
      "Automation documentation",
      "User guides and training",
    ],
    bestSuitedFor:
      "Businesses that want to reduce repetitive work and make better use of AI without introducing uncontrolled automation.",
    icon: "smart_toy",
    hue: 85,
  },
  {
    slug: "bookkeeping-finance-support",
    number: 10,
    title: "Bookkeeping & Finance Administrative Support",
    shortTitle: "Finance",
    category: "Finance & People",
    summary: "Bookkeeping, invoices, expenses and financial records.",
    description:
      "Our finance support services focus on bookkeeping, documentation, tracking, and financial administration within a clearly defined scope.",
    items: [
      "Bookkeeping support",
      "Payroll support",
      "Expense tracking",
      "Invoice tracking",
      "Receipt organization",
      "Accounts receivable tracking",
      "Accounts payable tracking",
      "Financial record maintenance",
      "Reconciliation support",
      "Compensation records",
      "Monthly financial summaries",
      "Basic management reports",
      "Financial document organization",
      "Billing administration",
      "Payment-status tracking",
      "Finance-related data entry",
    ],
    bestSuitedFor:
      "Businesses that need accurate and organized financial administration but want to retain final financial authority internally or with their accountant.",
    icon: "database",
    hue: 155,
  },
  {
    slug: "human-resources-people-support",
    number: 11,
    title: "Human Resources & People Support",
    shortTitle: "HR & People",
    category: "Finance & People",
    summary: "Recruitment, onboarding, records and HR documentation.",
    description:
      "QuintByte can assist with administrative and operational parts of managing people and workforce documentation.",
    items: [
      "Recruitment coordination",
      "Candidate research",
      "Interview scheduling",
      "Applicant tracking",
      "Employee records management",
      "Freelancer records management",
      "Onboarding coordination",
      "Training material preparation",
      "Attendance tracking",
      "Leave tracking",
      "HR documentation",
      "Employee file organization",
      "Internal communication support",
      "Workforce coordination",
      "Training administration",
      "Role and responsibility documentation",
    ],
    bestSuitedFor:
      "Small teams that need HR organization and administrative support without immediately maintaining a large internal HR department.",
    icon: "groups",
    hue: 20,
  },
  {
    slug: "research-data-support",
    number: 12,
    title: "Research & Data Support",
    shortTitle: "Research & Data",
    category: "Research & Operations",
    summary: "Market, competitor and lead research, and data cleanup.",
    description:
      "QuintByte can support businesses that need structured information before making operational, commercial, or strategic decisions.",
    items: [
      "Market research",
      "Competitor research",
      "Lead research",
      "Vendor research",
      "Product and service research",
      "Online research",
      "Data collection",
      "Data cleanup",
      "Data encoding",
      "Business information verification",
      "Research summaries",
      "Industry research",
      "Basic data analysis",
      "Comparison reports",
      "Research documentation",
    ],
    bestSuitedFor:
      "Businesses that need useful information prepared and organized before making decisions.",
    icon: "query_stats",
    hue: 265,
  },
  {
    slug: "business-operations-management-support",
    number: 13,
    title: "Business Operations & Management Support",
    shortTitle: "Operations Management",
    category: "Research & Operations",
    summary: "Workflows, KPIs, reporting and cross-functional coordination.",
    description:
      "This is where QuintByte's BMS model becomes more than traditional VA support. Instead of only assigning individual tasks, QuintByte can help coordinate an agreed business function.",
    items: [
      "Business process coordination",
      "Workflow management",
      "Project coordination",
      "Internal operations tracking",
      "SOP development",
      "KPI tracking",
      "Weekly or monthly operational reporting",
      "Task delegation tracking",
      "Cross-functional coordination",
      "Process improvement support",
      "Internal dashboard management",
      "Business documentation",
      "Client operations coordination",
      "Vendor and specialist coordination",
      "Workload and delivery monitoring",
    ],
    bestSuitedFor:
      "Business owners who need execution and coordination, not simply another person to assign tasks to.",
    icon: "monitoring",
    hue: 200,
  },
  {
    slug: "custom-project-based-support",
    number: 14,
    title: "Custom & Project-Based Business Support",
    shortTitle: "Custom Projects",
    category: "Custom Support",
    summary: "One-time, seasonal and custom project support.",
    description:
      "Not every business requirement fits neatly into a predefined service package. QuintByte can evaluate custom or one-time projects based on scope, available expertise, cost, timeline, access requirements, and delivery feasibility.",
    items: [
      "Business presentations",
      "Spreadsheet and tracker creation",
      "Database cleanup",
      "Special research",
      "Event coordination",
      "Temporary administrative support",
      "Business documentation",
      "Seasonal workload support",
      "Project-based virtual assistance",
      "Data migration support",
      "Internal process setup",
      "One-time creative projects",
      "Custom operational support",
    ],
    bestSuitedFor: "Businesses with specific one-time, seasonal, or cross-functional requirements.",
    icon: "extension",
    hue: 120,
  },
] as const satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]["slug"];

/** The nine services featured on the home page, in the design's order */
export const featuredServices: readonly Service[] = services.slice(0, 9);

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

/** Icon colour from the design's token scheme: oklch(0.76 0.14 H) */
export const serviceColor = (service: Pick<Service, "hue">) => `oklch(0.76 0.14 ${service.hue})`;

/** Same-category services first, then neighbours in document order */
export function relatedServices(service: Service, count = 3): Service[] {
  const others: Service[] = services.filter((s) => s.slug !== service.slug);
  const sameCategory = others.filter((s) => s.category === service.category);
  const byDistance = others
    .filter((s) => s.category !== service.category)
    .sort((a, b) => Math.abs(a.number - service.number) - Math.abs(b.number - service.number));
  return [...sameCategory, ...byDistance].slice(0, count);
}
