import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { siteConfig } from "@/config/site";

const linkClass =
  "font-extrabold text-slate underline decoration-cyan decoration-2 underline-offset-4 transition-[text-decoration-thickness] duration-150 hover:decoration-[3px]";

/**
 * Public contact block (GDE-005 A1): email and tap-to-call phone as links, then city,
 * hours and the countries served. Shown on /contact and in the footer of every page.
 */
export function ContactDetails({ className = "" }: { className?: string }) {
  const rows: { icon: IconName; content: ReactNode }[] = [
    {
      icon: "mail",
      content: (
        <a href={`mailto:${siteConfig.contactEmail}`} className={linkClass}>
          {siteConfig.contactEmail}
        </a>
      ),
    },
    {
      icon: "call",
      content: (
        <a href={siteConfig.phone.href} className={linkClass}>
          {siteConfig.phone.display}
        </a>
      ),
    },
    { icon: "location_on", content: siteConfig.location },
    { icon: "schedule", content: siteConfig.hours },
    { icon: "public", content: siteConfig.serving },
  ];

  return (
    <address className={`flex flex-col gap-2 text-slate not-italic ${className}`}>
      {rows.map((row) => (
        <p key={row.icon} className="flex items-start gap-2">
          <Icon name={row.icon} className="mt-1 shrink-0 text-lg" />
          <span>{row.content}</span>
        </p>
      ))}
    </address>
  );
}
