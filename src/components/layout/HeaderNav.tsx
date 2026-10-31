"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { SvgIcon } from "@/components/icons/SvgIcon";
import { close as closeIcon, menu as menuIcon } from "@/components/icons/ui-paths";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

type HeaderNavProps = { logo: ReactNode };

export function HeaderNav({ logo }: HeaderNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // No button may link to the page it is on (GDE-005 A5): on the page the CTA points to,
  // it scrolls to the form instead (rebrand brief, Contact page checks)
  const ctaHref = pathname === siteConfig.cta.href ? "#contact-form" : siteConfig.cta.href;
  // Close the menu whenever the route changes (derived-state pattern, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // The header slides away while scrolling down and returns on the way up (never while the
  // menu is open, and never under reduced motion: CSS drops the transition there).
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > lastY && y > 200 && !open;
      headerRef.current?.toggleAttribute("data-hidden", hide);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Escape closes the menu; widening past the nav breakpoint resets it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  // Any link click inside the header closes the menu (covers same-page links too)
  const closeOnLink = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <header
      ref={headerRef}
      onClick={closeOnLink}
      className="sticky top-0 z-50 border-b border-bluegray/35 bg-white/90 backdrop-blur-md transition-transform duration-400 ease-qb data-hidden:-translate-y-full"
    >
      <div className="shell flex items-center justify-between gap-6 py-4">
        {logo}

        {/* Desktop: the pages as one pill group; the logo is the way home */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 rounded-full border border-bluegray p-1 nav:flex"
        >
          {siteConfig.nav
            .filter((item) => item.href !== "/")
            .map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[15px] font-extrabold text-slate transition-colors duration-200 hover:bg-mint ${
                    active ? "bg-mint" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Wrapper owns the visibility so it can't conflict with the button's display */}
        <div className="hidden nav:block">
          <ButtonLink href={ctaHref} className="min-h-12 px-6 text-[15px]">
            {siteConfig.cta.label}
            <span aria-hidden className="size-2 rounded-full bg-cyan" />
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-12 items-center justify-center rounded-chip border border-bluegray text-slate transition-colors duration-150 hover:border-slate nav:hidden"
        >
          <SvgIcon d={open ? closeIcon : menuIcon} className="text-2xl" />
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="animate-menu-in border-t border-bluegray/50 nav:hidden"
        >
          <div className="shell flex flex-col pt-2 pb-6">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`py-3 text-lg text-slate ${
                    active
                      ? "font-extrabold underline decoration-cyan decoration-2 underline-offset-8"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <ButtonLink href={ctaHref} className="mt-4 w-full">
              {siteConfig.cta.label}
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
