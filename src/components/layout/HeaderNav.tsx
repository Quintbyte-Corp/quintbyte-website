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
  // No button may link to the page it is on (GDE-005 A5): drop the CTA where it points here
  const showCta = pathname !== siteConfig.cta.href;
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
      className="sticky top-0 z-50 border-b border-bluegray/50 bg-white"
    >
      <div className="shell flex items-center justify-between gap-6 py-4">
        {logo}

        <nav aria-label="Main" className="hidden items-center gap-8 nav:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`py-2 text-base text-slate underline decoration-2 underline-offset-8 transition-[text-decoration-color] duration-150 ${
                  active
                    ? "font-extrabold decoration-cyan"
                    : "decoration-transparent hover:decoration-bluegray"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Wrapper owns the visibility so it can't conflict with the button's display */}
        {showCta ? <div className="hidden nav:block">{cta}</div> : null}

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
            {showCta ? mobileCta : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
