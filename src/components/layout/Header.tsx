import { LogoHomeLink } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { HeaderNav } from "./HeaderNav";

/**
 * Sticky white header with the qb mark. The logo and CTA buttons are rendered on the server
 * and handed to the small client component that owns active-link state and the menu.
 */
export function Header() {
  return (
    <HeaderNav
      logo={<LogoHomeLink />}
      cta={<ButtonLink href={siteConfig.cta.href}>{siteConfig.cta.label}</ButtonLink>}
      mobileCta={
        <ButtonLink href={siteConfig.cta.href} className="mt-4 w-full">
          {siteConfig.cta.label}
        </ButtonLink>
      }
    />
  );
}
