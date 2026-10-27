import { LogoHomeLink } from "@/components/brand/Logo";
import { HeaderNav } from "./HeaderNav";

/**
 * Sticky white header with the qb mark. The logo is rendered on the server and handed to
 * the small client component that owns active-link state, the menu and the CTA target.
 */
export function Header() {
  return <HeaderNav logo={<LogoHomeLink />} />;
}
