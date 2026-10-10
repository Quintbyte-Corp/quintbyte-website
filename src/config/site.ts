/**
 * Global site configuration: brand lines, navigation, contact and social details.
 *
 * Anything not confirmed by QuintByte is left empty and the UI hides it —
 * nothing here is a placeholder address, handle or URL.
 */

/**
 * Canonical origin. Order: NEXT_PUBLIC_SITE_URL (the production domain), the Vercel
 * production domain, the per-deployment preview URL, then local dev.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export type SocialNetwork = "facebook" | "linkedin" | "youtube" | "x";

export type SocialLink = { network: SocialNetwork; label: string; href: string };

export type LinkItem = { label: string; href: string };

const socials: SocialLink[] = [
  // Add confirmed profile URLs here; entries with an empty href are not rendered.
  { network: "facebook", label: "Facebook", href: "" },
  { network: "linkedin", label: "LinkedIn", href: "" },
  { network: "youtube", label: "YouTube", href: "" },
  { network: "x", label: "X", href: "" },
];

const legal: LinkItem[] = [
  // Entries with an empty href are not rendered (and the form consent line follows Privacy).
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

/**
 * Booking page (Google Calendar appointment page). Every "Book a call" button stays
 * hidden until NEXT_PUBLIC_BOOKING_URL holds an https link (GDE-005 A4).
 */
function resolveBookingUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ?? "";
  return raw.startsWith("https://") ? raw : "";
}

const bookingUrl = resolveBookingUrl();
const messageCta: LinkItem = { label: "Send a message", href: "/contact" };

export const siteConfig = {
  name: "QuintByte",
  legalName: "QuintByte Corp.",
  /** SEC Certificate of Incorporation (GDE-003 §1.1). The BIR TIN is never published. */
  secRegNo: "2026080262425-18",
  /** City only, by decision of the CEO (GDE-005 §13): no street address anywhere */
  location: "San Pablo City, Laguna, Philippines",
  /** Date of incorporation on the SEC certificate (GDE-003 §1.1) */
  foundingDate: "2026-08-04",
  /** Countries served, as ISO codes for structured data (GDE-003 §1.1) */
  areaServed: ["US", "AU", "PH"],
  url: resolveSiteUrl(),
  tagline: "One business partner. The right specialists. Clear accountability.",
  /** BMS Service Description — "Short Client-Facing Version" */
  description:
    "QuintByte is a Business Management Services company that helps businesses manage the work behind the business — coordinating the right people, processes, and deliverables under one accountable service relationship.",
  /** Search and share snippet for the home page; draft for CEO approval (GDE-005 D1) */
  metaDescription:
    "QuintByte is a Business Management Services team. Get the right specialists, coordinated under one accountable partner.",
  /** BMS Service Description — operating principle */
  principle: [
    "Understand the business first.",
    "Build the right support around it.",
    "Deliver only what we can responsibly manage.",
  ],
  /**
   * Public contact details, as decided in GDE-005 §13 and task A1. NEXT_PUBLIC_CONTACT_EMAIL
   * can override the address per environment.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@quintbyte.com",
  phone: { display: "+63 995 236 7138", href: "tel:+639952367138" },
  hours: "Monday to Friday, 9:00 AM to 6:00 PM Philippine Time",
  serving: "Serving the United States, Australia and the Philippines",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies LinkItem[],
  bookingUrl,
  /** Main call to action: "Book a call" once the booking link is set, else "Send a message" */
  cta: (bookingUrl ? { label: "Book a call", href: bookingUrl } : messageCta) satisfies LinkItem,
  /** The contact form; the secondary action wherever "Book a call" is the main one */
  messageCta,
  /** Footer link columns (the contact details block sits beside them) */
  footerColumns: [
    [
      { label: "Services", href: "/services" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  ] satisfies LinkItem[][],
  socials: socials.filter((s) => s.href),
  legal: legal.filter((l) => l.href),
} as const;

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();
