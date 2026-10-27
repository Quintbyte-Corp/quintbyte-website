import { pingSupabase } from "@/lib/contact/deliver";

/**
 * Daily keep-alive for the database. The Supabase free plan pauses a project after about
 * a week without activity, and while it is paused the contact form can only email, not
 * save (it happened once, found 27 Oct 2026). The Vercel cron in vercel.json calls this
 * once a day on production; Vercel sends CRON_SECRET as a Bearer token, and anything
 * without it is refused, so the address can't be used to poke the database.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const ok = await pingSupabase();
  if (!ok) console.error("[keep-alive] Supabase did not answer; check whether it is paused");
  return Response.json({ ok }, { status: ok ? 200 : 502 });
}
