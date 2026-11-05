import { ON_REQUEST_LABEL, isOnRequest } from "@/data/services";

/**
 * Honest status label (GDE-005: never show a limited service as fully available), with
 * the status squares from the QB symbol kit: filled for available now, outlined for
 * available on request after scoping. The square is decorative; the words carry it.
 */
export function StatusLabel({ slug, className = "" }: { slug: string; className?: string }) {
  const onRequest = isOnRequest(slug);
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-bluegray bg-white px-3 py-1.5 text-xs leading-4 font-extrabold tracking-[0.06em] uppercase ${className}`}
    >
      <span
        aria-hidden
        className={`size-2 shrink-0 rounded-full ${onRequest ? "border-[1.5px] border-apricot" : "bg-cyan"}`}
      />
      {onRequest ? ON_REQUEST_LABEL : "Available"}
    </span>
  );
}
