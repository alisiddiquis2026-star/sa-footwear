import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/inquiry-schema";
import { saveInquiry, StoreNotConfigured } from "@/lib/inquiry-store";
import { isDuplicate, markSeen, rateLimited } from "@/lib/rate-limit";
import { business } from "@/config/business";

export const runtime = "nodejs";

const MAX_BODY = 10_000;

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false; // browsers always send Origin on cross-site POST
  try {
    const o = new URL(origin);
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return o.host === host || origin === business.siteUrl;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(`inq:${ip}`)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a few minutes or contact us directly." },
      { status: 429 },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "Request too large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing, store nothing.
  if (typeof json === "object" && json && "website" in json && String((json as { website: unknown }).website).length > 0) {
    return NextResponse.json({ ok: true, id: "ok" });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }
  const inq = parsed.data;

  const fingerprint = `${inq.mobile}|${inq.brand}|${inq.category}|${inq.quantity}`;
  if (isDuplicate(fingerprint)) {
    return NextResponse.json({ ok: true, id: "duplicate", duplicate: true });
  }

  try {
    const id = await saveInquiry(inq, { ip, userAgent: req.headers.get("user-agent") ?? "" });
    markSeen(fingerprint);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    if (err instanceof StoreNotConfigured) {
      return NextResponse.json(
        { ok: false, error: "Online inquiries are not switched on yet. Please call or WhatsApp us.", unavailable: true },
        { status: 503 },
      );
    }
    console.error("inquiry save failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { ok: false, error: "We could not save your inquiry. Please call or WhatsApp us." },
      { status: 500 },
    );
  }
}
