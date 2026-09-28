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
  // Add once the policy pages exist; entries with an empty href are not rendered.
  { label: "Privacy Policy", href: "" },
  { label: "Terms of Service", href: "" },
];

export const siteConfig = {
  name: "QuintByte",
  legalName: "QuintByte Corp.",
  url: resolveSiteUrl(),
  tagline: "One business partner. The right specialists. Clear accountability.",
  /** BMS Service Description — "Short Client-Facing Version" */
  description:
    "QuintByte is a Business Management Services company that helps businesses manage the work behind the business — coordinating the right people, processes, and deliverables under one accountable service relationship.",
  /** BMS Service Description — operating principle */
  principle: [
    "Understand the business first.",
    "Build the right support around it.",
    "Deliver only what we can responsibly manage.",
  ],
  /** Public enquiry address. The design used hello@quintbyte.com pending confirmation. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies LinkItem[],
  cta: { label: "Talk to QuintByte", href: "/contact" } satisfies LinkItem,
  /** Footer link columns, as laid out in the design */
  footerColumns: [
    [
      { label: "Services", href: "/services" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "About Us", href: "/about" },
    ],
    [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
    ],
  ] satisfies LinkItem[][],
  socials: socials.filter((s) => s.href),
  legal: legal.filter((l) => l.href),
} as const;

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();
