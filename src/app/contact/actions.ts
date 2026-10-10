"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import type { ContactState } from "@/lib/contact/constants";
import { deliverContact, deliveryConfigured, recentEnquiryCount } from "@/lib/contact/deliver";
import { failureMessage } from "@/lib/contact/messages";
import { parseAttribution, parseContact } from "@/lib/contact/schema";

/** Submissions faster than this after the form rendered are almost certainly automated */
const MIN_FILL_MS = 3000;

/** At most this many enquiries per IP address per hour (GDE-005 §5.1) */
const RATE_LIMIT_PER_HOUR = 5;

/**
 * One-way, keyed hash of the sender's IP so the rate limit never stores the address
 * itself. Keyed with IP_HASH_SECRET, falling back to the (server-only) Supabase key.
 */
function hashIp(ip: string | null): string | null {
  const secret = process.env.IP_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!ip || !secret) return null;
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/** Vercel sets x-real-ip; x-forwarded-for's first entry is the client otherwise */
function clientIp(h: Headers): string | null {
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const { values, errors } = parseContact(form);

  // A filled honeypot is a bot: return a normal-looking success so it doesn't retry.
  const honeypot = form.get("website");
  if (typeof honeypot === "string" && honeypot !== "") {
    return { status: "success", name: values.name };
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  // Implausibly fast submissions get a retry prompt rather than a fake success, so a
  // person using autofill never loses their message.
  const renderedAt = Number(form.get("rendered_at"));
  if (renderedAt > 0 && Date.now() - renderedAt < MIN_FILL_MS) {
    return {
      status: "error",
      message: "Please take a moment to review your message, then send it again.",
      values,
    };
  }

  if (!deliveryConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Delivery not configured; submission logged only:", values);
      return { status: "success", name: values.name };
    }
    console.error("[contact] Delivery not configured (set the Supabase and Resend env vars).");
    return { status: "error", message: failureMessage(), values };
  }

  const h = await headers();
  const ipHash = hashIp(clientIp(h));

  // Over the limit: a person keeps their text and is pointed to email instead.
  if (ipHash) {
    const recent = await recentEnquiryCount(ipHash);
    if (recent === null) console.error("[contact] rate-limit count unavailable");
    else if (recent >= RATE_LIMIT_PER_HOUR) {
      return { status: "error", message: failureMessage(), values };
    }
  }

  const result = await deliverContact(values, {
    ...parseAttribution(form),
    userAgent: h.get("user-agent"),
    ipHash,
  });

  if (!result.ok) {
    return { status: "error", message: failureMessage(), values };
  }
  return { status: "success", name: values.name };
}
