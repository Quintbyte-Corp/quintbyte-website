import { siteConfig } from "@/config/site";
import type { ContactFields } from "./constants";
import { interestLabel } from "./schema";

/**
 * Delivery for website enquiries (GDE-005 §5.1). Configured by environment variables
 * (see .env.example); both channels must be set before the form accepts enquiries:
 *   - Supabase: stores the enquiry in `enquiries` (system of record, rate limiting)
 *   - Resend:   notifies the shared inbox, and optionally sends the enquirer an auto-reply
 * Plain REST calls keep the SDKs out of the bundle.
 */

type Result = { ok: true } | { ok: false; error: string };

export type Attribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  page: string | null;
};

export type SubmissionMeta = Attribution & {
  userAgent: string | null;
  ipHash: string | null;
};

const supabaseEnv = () => {
  const url = process.env.SUPABASE_URL;
  // A secret key (sb_secret_…); the legacy service_role JWT still works until Supabase retires it
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/+$/, ""), key } : null;
};

const resendEnv = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  // RESEND_API_URL exists only to point local tests at a stand-in server
  const api = (process.env.RESEND_API_URL || "https://api.resend.com").replace(/\/+$/, "");
  return apiKey && from && to
    ? { apiKey, from, to: to.split(",").map((s) => s.trim()), api }
    : null;
};

/** Storage and notification are both required (GDE-005 §5.1) */
export const deliveryConfigured = () => Boolean(supabaseEnv() && resendEnv());

/** The auto-reply ships switched off until the CEO approves it (decision D-09) */
const autoReplyEnabled = () => process.env.CONTACT_AUTOREPLY === "on";

/** Secret keys go on the apikey header only (they are not JWTs); legacy JWT keys also as Bearer */
const supabaseHeaders = (key: string) => ({
  apikey: key,
  ...(key.startsWith("sb_") ? {} : { Authorization: `Bearer ${key}` }),
  "Content-Type": "application/json",
});

/**
 * Error bodies can echo the submitted row (e.g. a failed check constraint), so only the
 * status and error code are logged, never personal data.
 */
async function errorCode(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    const code = body && typeof body === "object" && "code" in body ? body.code : null;
    return code ? ` (${String(code)})` : "";
  } catch {
    return "";
  }
}

/**
 * Enquiries stored from this IP hash in the last hour, or null if the count failed.
 * Uses PostgREST's exact count on a HEAD request, so no rows are transferred.
 */
export async function recentEnquiryCount(ipHash: string): Promise<number | null> {
  const env = supabaseEnv();
  if (!env) return null;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const query = new URLSearchParams({
    select: "id",
    ip_hash: `eq.${ipHash}`,
    created_at: `gte.${since}`,
  });
  try {
    const res = await fetch(`${env.url}/rest/v1/enquiries?${query}`, {
      method: "HEAD",
      headers: { ...supabaseHeaders(env.key), Prefer: "count=exact" },
      cache: "no-store",
    });
    const total = res.headers.get("content-range")?.split("/")[1];
    return res.ok && total !== undefined && total !== "*" ? Number(total) : null;
  } catch {
    return null;
  }
}

/**
 * One tiny read (a HEAD request, no rows transferred) so the Supabase free plan sees
 * activity and doesn't pause the project (see app/api/keep-alive). True if it answered.
 */
export async function pingSupabase(): Promise<boolean> {
  const env = supabaseEnv();
  if (!env) return false;
  try {
    const res = await fetch(`${env.url}/rest/v1/enquiries?select=id&limit=1`, {
      method: "HEAD",
      headers: supabaseHeaders(env.key),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function storeInSupabase(values: ContactFields, meta: SubmissionMeta): Promise<Result> {
  const env = supabaseEnv();
  if (!env) return { ok: false, error: "Supabase not configured" };
  const res = await fetch(`${env.url}/rest/v1/enquiries`, {
    method: "POST",
    headers: { ...supabaseHeaders(env.key), Prefer: "return=minimal" },
    body: JSON.stringify({
      name: values.name,
      company: values.company || null,
      email: values.email,
      service: values.interest,
      message: values.message,
      source: meta.source,
      utm_medium: meta.medium,
      utm_campaign: meta.campaign,
      page: meta.page,
      user_agent: meta.userAgent,
      ip_hash: meta.ipHash,
    }),
    cache: "no-store",
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: `Supabase ${res.status}${await errorCode(res)}` };
}

async function sendEmail(payload: Record<string, unknown>): Promise<Result> {
  const env = resendEnv();
  if (!env) return { ok: false, error: "Resend not configured" };
  const res = await fetch(`${env.api}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.from, ...payload }),
    cache: "no-store",
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: `Resend ${res.status}${await errorCode(res)}` };
}

/** Notification to the shared inbox; the internal note is from GDE-003 §2.2 */
function notifyInbox(values: ContactFields, meta: SubmissionMeta): Promise<Result> {
  const service = interestLabel(values.interest);
  const lines = [
    "New enquiry. Target: reply within one business hour. Log it in the QB Sales Tracker (source: Website) before replying.",
    "",
    `Name: ${values.name}`,
    `Business / Company: ${values.company || "—"}`,
    `Email: ${values.email}`,
    `Service: ${service}`,
    `Source: ${meta.source ?? "direct / unknown"}`,
    `Medium: ${meta.medium ?? "—"}`,
    `Campaign: ${meta.campaign ?? "—"}`,
    `Page: ${meta.page ?? "—"}`,
    "",
    "Message:",
    values.message,
  ];
  return sendEmail({
    to: resendEnv()?.to,
    reply_to: values.email,
    subject: `New enquiry: ${service} | ${values.name}`,
    text: lines.join("\n"),
  });
}

/**
 * A first name only when it is plainly a name (letters, apostrophes, hyphens), so the
 * auto-reply can never carry a link or other text a sender typed.
 */
export function greetingName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return /^[\p{L}][\p{L}'’-]{0,29}$/u.test(first) ? first : "there";
}

/** Auto-reply to the enquirer; wording from GDE-003 §2.2 */
function autoReply(values: ContactFields): Promise<Result> {
  const booking = siteConfig.bookingUrl
    ? `Prefer to talk? Book a 15-minute call here: ${siteConfig.bookingUrl}\n\n`
    : "";
  const text = [
    `Mabuhay! Hi ${greetingName(values.name)},`,
    "",
    "Thank you for reaching out to QuintByte. We have your message, and one of us will reply within one business day.",
    "",
    "It helps if you share what takes up most of your time, which tools you use (like your CRM or Google Workspace), and when you would like support to start.",
    "",
    `${booking}Talk soon.`,
    "",
    "The QuintByte team",
    siteConfig.tagline,
  ].join("\n");
  return sendEmail({
    to: [values.email],
    reply_to: siteConfig.contactEmail,
    subject: "We received your message | QuintByte",
    text,
  });
}

/**
 * Stores and notifies in parallel. The enquiry counts as received if it reached at least
 * one channel; the auto-reply goes out only then, and its failure is logged only.
 */
export async function deliverContact(values: ContactFields, meta: SubmissionMeta): Promise<Result> {
  const failed = (e: unknown) => ({ ok: false as const, error: String(e) });
  const [stored, emailed] = await Promise.all([
    storeInSupabase(values, meta).catch(failed),
    notifyInbox(values, meta).catch(failed),
  ]);

  if (!stored.ok) console.error("[contact] store failed:", stored.error);
  if (!emailed.ok) console.error("[contact] notification failed:", emailed.error);
  if (!stored.ok && !emailed.ok) return { ok: false, error: "No delivery channel succeeded" };

  if (autoReplyEnabled()) {
    const replied = await autoReply(values).catch(failed);
    if (!replied.ok) console.error("[contact] auto-reply failed:", replied.error);
  }
  return { ok: true };
}
