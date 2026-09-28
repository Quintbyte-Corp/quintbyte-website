import type { ContactFields } from "./constants";
import { interestLabel } from "./schema";

/**
 * Delivery channels for contact submissions. Both are optional and configured by
 * environment variables (see .env.example):
 *   - Supabase: stores the submission in `contact_submissions` (system of record)
 *   - Resend:   emails a notification to the QuintByte inbox
 * Plain REST calls keep the SDKs out of the bundle.
 */

type Result = { ok: true } | { ok: false; error: string };

const supabaseEnv = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/+$/, ""), key } : null;
};

const resendEnv = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  return apiKey && from && to ? { apiKey, from, to: to.split(",").map((s) => s.trim()) } : null;
};

export const deliveryConfigured = () => Boolean(supabaseEnv() || resendEnv());

async function storeInSupabase(values: ContactFields, meta: SubmissionMeta): Promise<Result> {
  const env = supabaseEnv();
  if (!env) return { ok: true };
  const res = await fetch(`${env.url}/rest/v1/contact_submissions`, {
    method: "POST",
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: values.name,
      company: values.company || null,
      email: values.email,
      interest: values.interest,
      message: values.message,
      source_path: meta.sourcePath,
      user_agent: meta.userAgent,
    }),
    cache: "no-store",
  });
  return res.ok
    ? { ok: true }
    : { ok: false, error: `Supabase ${res.status}: ${await res.text()}` };
}

async function notifyByEmail(values: ContactFields): Promise<Result> {
  const env = resendEnv();
  if (!env) return { ok: true };
  const lines = [
    `Name: ${values.name}`,
    `Business / Company: ${values.company || "—"}`,
    `Email: ${values.email}`,
    `Area of interest: ${interestLabel(values.interest)}`,
    "",
    values.message,
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.from,
      to: env.to,
      reply_to: values.email,
      subject: `New enquiry — ${interestLabel(values.interest)} — ${values.name}`,
      text: lines.join("\n"),
    }),
    cache: "no-store",
  });
  return res.ok ? { ok: true } : { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
}

export type SubmissionMeta = { sourcePath: string | null; userAgent: string | null };

/**
 * Stores then notifies. The submission counts as received if it reached at least one
 * configured channel; a failed notification after a successful store is logged only.
 */
export async function deliverContact(values: ContactFields, meta: SubmissionMeta): Promise<Result> {
  const [stored, emailed] = await Promise.all([
    storeInSupabase(values, meta).catch((e: unknown) => ({ ok: false as const, error: String(e) })),
    notifyByEmail(values).catch((e: unknown) => ({ ok: false as const, error: String(e) })),
  ]);

  if (!stored.ok) console.error("[contact] store failed:", stored.error);
  if (!emailed.ok) console.error("[contact] notification failed:", emailed.error);

  const reached = (supabaseEnv() && stored.ok) || (resendEnv() && emailed.ok);
  return reached ? { ok: true } : { ok: false, error: "No delivery channel succeeded" };
}
