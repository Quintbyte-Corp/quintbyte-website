import Script from "next/script";

/**
 * Plausible Analytics (decision D-06): cookie-free, so no consent banner is needed.
 * NEXT_PUBLIC_PLAUSIBLE_SCRIPT is the site-specific script URL from Plausible
 * (Site settings → Site installation), e.g. https://plausible.io/js/pa-XXXXXXXX.js.
 * Loads on the production deployment only, so previews and local runs never count.
 */
const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT ?? "";
const enabled = process.env.VERCEL_ENV === "production" && src.startsWith("https://");

export function Plausible() {
  if (!enabled) return null;
  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      {/* Queues events sent before the script has loaded (Plausible's install snippet) */}
      <Script id="plausible-init" strategy="afterInteractive">
        {
          "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()"
        }
      </Script>
    </>
  );
}
