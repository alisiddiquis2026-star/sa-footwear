import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import type { Inquiry } from "./inquiry-schema";

/**
 * Storage adapters, in priority order:
 *  1. INQUIRY_WEBHOOK_URL: POST JSON to your CRM / Google Sheet script / n8n.
 *  2. Local JSONL file (dev, or a VPS with INQUIRY_FILE_STORE=1).
 *  3. Nothing configured: throws StoreNotConfigured so the API answers 503
 *     and the form shows the phone/WhatsApp fallback. We never pretend a
 *     lead was saved when it was not.
 */
export class StoreNotConfigured extends Error {}

export function storeIsConfigured() {
  return Boolean(
    process.env.INQUIRY_WEBHOOK_URL ||
      process.env.INQUIRY_FILE_STORE === "1" ||
      process.env.NODE_ENV !== "production",
  );
}

export async function saveInquiry(inq: Inquiry, meta: { ip: string; userAgent: string }) {
  const record = {
    id: createHash("sha256").update(`${Date.now()}${inq.mobile}${Math.random()}`).digest("hex").slice(0, 12),
    receivedAt: new Date().toISOString(),
    ...inq,
    consent: true,
    userAgent: meta.userAgent.slice(0, 200),
  };

  const hook = process.env.INQUIRY_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return record.id;
  }

  if (process.env.INQUIRY_FILE_STORE === "1" || process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "inquiries.jsonl"), JSON.stringify(record) + "\n", "utf8");
    return record.id;
  }

  throw new StoreNotConfigured("No inquiry storage configured");
}
