import { ON_REQUEST_LABEL, isOnRequest } from "@/data/services";

/**
 * Honest status label (GDE-005: never show a limited service as fully available), with
 * the status squares from the QB symbol kit: filled for available now, outlined for
 * available on request after scoping. The square is decorative; the words carry it.
 */
export function StatusLabel({ slug, className = "" }: { slug: string; className?: string }) {
  const onRequest = isOnRequest(slug);
  return (
    <span className={`flex items-center gap-2 text-sm leading-5 font-extrabold ${className}`}>
      <span
        aria-hidden
        className={`size-2 shrink-0 ${onRequest ? "border-[1.5px] border-slate" : "bg-slate"}`}
      />
      {onRequest ? ON_REQUEST_LABEL : "Available"}
    </span>
  );
}
