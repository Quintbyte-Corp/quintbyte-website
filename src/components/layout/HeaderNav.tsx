"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, type ReactNode, useEffect, useState } from "react";
import { SvgIcon } from "@/components/icons/SvgIcon";
import { close as closeIcon, menu as menuIcon } from "@/components/icons/ui-paths";
import { siteConfig } from "@/config/site";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

type HeaderNavProps = { logo: ReactNode; cta: ReactNode; mobileCta: ReactNode };

export function HeaderNav({ logo, cta, mobileCta }: HeaderNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Close the menu whenever the route changes (derived-state pattern, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

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
      onClick={closeOnLink}
      className="sticky top-0 z-50 border-b border-accent/10 bg-bg/82 backdrop-blur-[14px]"
    >
      <div className="shell flex items-center justify-between gap-6 py-[18px]">
        {logo}

        <nav aria-label="Main" className="hidden items-center gap-[34px] nav:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-accent" : "text-mute-3 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Wrapper owns the visibility so it can't conflict with the button's display */}
        <div className="hidden nav:block">{cta}</div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-11 items-center justify-center rounded-icon border border-white/15 text-ink transition-colors hover:border-accent/60 nav:hidden"
        >
          <SvgIcon d={open ? closeIcon : menuIcon} className="text-2xl" />
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="animate-menu-in border-t border-white/6 nav:hidden"
        >
          <div className="shell flex flex-col gap-1 pt-2 pb-6">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-1 py-3.5 text-[17px] font-semibold ${
                    active ? "text-accent" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {mobileCta}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
