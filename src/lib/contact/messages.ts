import { siteConfig } from "@/config/site";

/**
 * Shown when an enquiry can't be delivered: no delivery channel, a failed send or a
 * network error. Wording from GDE-005 §5.1; it only names channels that are configured.
 */
export function failureMessage(): string {
  const email = siteConfig.contactEmail;
  const book = Boolean(siteConfig.bookingUrl);
  const next =
    email && book
      ? `Please email ${email} or book a call.`
      : email
        ? `Please email ${email}.`
        : book
          ? "Please book a call instead."
          : "Please try again later.";
  return `We could not send your message. ${next}`;
}

/** Privacy page link, once the page is published (the consent line depends on it) */
export const privacyHref = siteConfig.legal.find((l) => l.href === "/privacy")?.href ?? "";
