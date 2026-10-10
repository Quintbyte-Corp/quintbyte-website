"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { type EventName, rememberCampaign, track } from "@/lib/analytics";

/**
 * Remembers the campaign tags of the landing URL, and turns clicks into events
 * (GDE-005 B2, B3): booking links, email links, and anything marked data-event.
 */
export function SiteTracking() {
  useEffect(() => {
    rememberCampaign(window.location.search);

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("a, [data-event]");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      const page = window.location.pathname;
      const marked = el.dataset.event as EventName | undefined;
      if (marked)
        track(marked, { page, ...(el.dataset.eventLabel && { label: el.dataset.eventLabel }) });
      else if (siteConfig.bookingUrl && href === siteConfig.bookingUrl)
        track("book_call_click", { page });
      else if (href.startsWith("mailto:")) track("email_click", { page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
