/**
 * Website events (GDE-005 B3), sent to Plausible (decision D-06), which uses no cookies.
 * The script loads on the production site only (components/analytics/Plausible.tsx);
 * elsewhere track() is a no-op and nothing leaves the browser. Each event name needs a
 * matching custom-event goal in Plausible before it appears in the dashboard.
 */

export type EventName =
  "book_call_click" | "form_submit_success" | "email_click" | "service_card_click" | "pdf_download";

type Props = Record<string, string>;

declare global {
  interface Window {
    /** Plausible's documented custom-event API */
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(name: EventName, props?: Props) {
  try {
    window.plausible?.(name, props ? { props } : undefined);
  } catch {
    // Analytics must never break the page
  }
}

/** Campaign tags from the landing URL, kept for the session (GDE-005 B2) */
const CAMPAIGN_KEY = "qb_campaign";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
export type Campaign = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Records the first tagged landing of the session; later tags don't overwrite it */
export function rememberCampaign(search: string) {
  try {
    if (sessionStorage.getItem(CAMPAIGN_KEY)) return;
    const params = new URLSearchParams(search);
    const campaign: Campaign = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) campaign[key] = value.slice(0, 100);
    }
    if (campaign.utm_source) sessionStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
  }
}

export function readCampaign(): Campaign {
  try {
    const raw = sessionStorage.getItem(CAMPAIGN_KEY);
    return raw ? (JSON.parse(raw) as Campaign) : {};
  } catch {
    return {};
  }
}
