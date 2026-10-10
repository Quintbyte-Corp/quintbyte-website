import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { siteConfig } from "@/config/site";

type Tone = "dark" | "light";

const tones: Record<Tone, { item: string; icon: string; link: string }> = {
  dark: {
    item: "text-mute-2",
    icon: "text-accent",
    link: "font-semibold text-ink transition-colors hover:text-accent",
  },
  light: {
    item: "text-mute-light",
    icon: "text-accent-light",
    link: "font-semibold text-ink-dark underline decoration-line-3 underline-offset-4 hover:decoration-ink-dark",
  },
};

/**
 * Public contact block (GDE-005 A1): email and tap-to-call phone as links, then city,
 * hours and the countries served. Shown on /contact and in the footer of every page.
 */
export function ContactDetails({
  tone = "dark",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  const t = tones[tone];
  const rows: { icon: IconName; content: ReactNode }[] = [
    {
      icon: "mail",
      content: (
        <a href={`mailto:${siteConfig.contactEmail}`} className={t.link}>
          {siteConfig.contactEmail}
        </a>
      ),
    },
    {
      icon: "call",
      content: (
        <a href={siteConfig.phone.href} className={t.link}>
          {siteConfig.phone.display}
        </a>
      ),
    },
    { icon: "location_on", content: siteConfig.location },
    { icon: "schedule", content: siteConfig.hours },
    { icon: "public", content: siteConfig.serving },
  ];

  return (
    <address className={`flex flex-col gap-2.5 not-italic ${className}`}>
      {rows.map((row) => (
        <p key={row.icon} className={`flex items-start gap-2.5 ${t.item}`}>
          <Icon name={row.icon} className={`mt-0.5 shrink-0 text-lg ${t.icon}`} />
          <span>{row.content}</span>
        </p>
      ))}
    </address>
  );
}
