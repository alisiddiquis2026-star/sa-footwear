/**
 * SINGLE SOURCE OF TRUTH for business facts.
 *
 * Every value here is either:
 *   - supplied by the owner (marked `verified: true`), or
 *   - an empty placeholder. Empty values are NEVER invented by the site:
 *     UI that needs them hides itself or falls back to the inquiry form.
 *
 * Fill these in (or set the matching env vars) and update BUSINESS_CONFIG.md.
 */

const env = process.env;

export const business = {
  /** Display name. Placeholder until the owner confirms the trading name. */
  /** Trading name confirmed by the owner (2026-11-09). */
  name: env.NEXT_PUBLIC_BUSINESS_NAME || "SA Footwear",
  nameIsPlaceholder: false,
  legalName: "",
  siteUrl: (env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  /** Digits only with country code, e.g. 919876543210. Empty = not confirmed. */
  whatsapp: env.NEXT_PUBLIC_WHATSAPP || "",
  /** Display + tel: number, e.g. +91 98765 43210. Empty = not confirmed. */
  phone: env.NEXT_PUBLIC_PHONE || "",
  email: env.NEXT_PUBLIC_EMAIL || "",

  /** A real, verified premises only. null = no public address is shown. */
  address: null as null | {
    street: string;
    locality: string;
    city: string;
    state: string;
    postalCode: string;
  },
  gstin: "",
  hours: null as null | string,
  social: {} as Partial<Record<"instagram" | "facebook" | "youtube", string>>,

  /**
   * Relationship to Woccy. Do NOT change to "authorized" unless written
   * authorization exists. See ASSET_LICENSE_AUDIT.md.
   */
  woccyRelationship: "owner-stated-distributor" as "unverified" | "owner-stated-distributor" | "authorized-distributor",
} as const;

/** The site stays out of search engines until the owner explicitly goes live. */
export const siteIsLive = env.SITE_LIVE === "true";

export const hasPhone = Boolean(business.phone);
export const hasWhatsapp = Boolean(business.whatsapp);

export function telHref(): string | null {
  if (!hasPhone) return null;
  return `tel:${business.phone.replace(/[^+\d]/g, "")}`;
}

/** WhatsApp deep link, or null when no number is confirmed. */
export function waHref(message: string): string | null {
  if (!hasWhatsapp) return null;
  return `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const INQUIRY_PATH = "/wholesale/inquiry";
