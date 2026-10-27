/**
 * Company-level copy from the BMS Service Description ("What Makes QuintByte Different",
 * "Short Client-Facing Version"), with the service-firm positioning of the 24 Oct 2026
 * rebrand brief. Kept close to the source so the site never overstates scope.
 */
import { firmOfFive } from "./claims";

export const clientFacingSummary = [
  `QuintByte (QB) is ${firmOfFive} who help businesses manage the work behind the business.`,
  "From Executive Assistance, Administration, CRM and Sales Support to Marketing, Creative, IT, Bookkeeping, AI, and Operations, we build flexible support around what your business actually needs.",
  "Instead of managing multiple freelancers yourself, QuintByte coordinates the right people, processes, and deliverables under one accountable service relationship.",
  "You focus on running your business. We help manage the work that keeps it moving.",
] as const;

export const differentiator =
  "Instead of asking a client to independently hire and coordinate an executive assistant, designer, marketer, CRM specialist, bookkeeper, and technical person, QuintByte can bring appropriate functions together under one accountable relationship.";

/** The separate roles a business would otherwise coordinate itself (from the sentence above) */
export const separateRoles = [
  "Executive assistant",
  "Designer",
  "Marketer",
  "CRM specialist",
  "Bookkeeper",
  "Technical person",
] as const;

export const availabilityNote =
  "QuintByte does not claim that every possible service is immediately available. New services are activated only when the people, capability, cost, capacity, supervision, and authority required to deliver them properly have been confirmed.";
