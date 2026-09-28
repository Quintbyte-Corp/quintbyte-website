"use server";

import { headers } from "next/headers";
import { deliverContact, deliveryConfigured } from "@/lib/contact/deliver";
import type { ContactState } from "@/lib/contact/constants";
import { parseContact } from "@/lib/contact/schema";

/** Submissions faster than this after the form rendered are almost certainly automated */
const MIN_FILL_MS = 1500;

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
      console.info("[contact] No delivery channel configured; submission logged only:", values);
      return { status: "success", name: values.name };
    }
    console.error(
      "[contact] No delivery channel configured (set Supabase and/or Resend env vars).",
    );
    return {
      status: "error",
      message: "Sorry — the contact form isn't available right now. Please try again later.",
      values,
    };
  }

  const h = await headers();
  const result = await deliverContact(values, {
    sourcePath: h.get("referer"),
    userAgent: h.get("user-agent"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: "Sorry — we couldn't send your message. Please try again in a moment.",
      values,
    };
  }
  return { status: "success", name: values.name };
}
