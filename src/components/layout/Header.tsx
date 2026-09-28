import { LogoHomeLink } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { HeaderNav } from "./HeaderNav";

/**
 * Sticky site header (README §1). The logo and CTA buttons are rendered on the server
 * and handed to the small client component that owns active-link state and the menu.
 */
export function Header() {
  return (
    <HeaderNav
      logo={<LogoHomeLink />}
      cta={
        <ButtonLink href={siteConfig.cta.href} size="sm" glow arrow>
          {siteConfig.cta.label}
        </ButtonLink>
      }
      mobileCta={
        <ButtonLink href={siteConfig.cta.href} arrow className="mt-2.5 w-full">
          {siteConfig.cta.label}
        </ButtonLink>
      }
    />
  );
}
