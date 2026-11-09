import { z } from "zod";

const clean = (max: number) => z.string().trim().max(max);

/** Indian mobile: 10 digits starting 6-9, optional +91 / 0 prefix and spaces. */
export const normalizeMobile = (v: string) => {
  const d = v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  return d;
};
const mobile = z
  .string()
  .trim()
  .transform(normalizeMobile)
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number");

const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const TEXT_KEYS = ["contactName", "shopName", "mobile", "whatsapp", "email", "state", "city", "brand", "category", "quantity", "message", "gstin"];

/** Missing text fields become "" so users see our messages, not raw type errors. */
function fillBlanks(input: unknown) {
  if (typeof input !== "object" || input === null) return input;
  const out: Record<string, unknown> = { ...(input as Record<string, unknown>) };
  for (const k of TEXT_KEYS) if (out[k] === undefined || out[k] === null) out[k] = "";
  return out;
}

const inquiryObject = z.object({
  contactName: clean(80).min(2, "Enter your name"),
  shopName: clean(120).min(2, "Enter your shop or company name"),
  mobile,
  whatsapp: z
    .string()
    .trim()
    .transform((v) => (v ? normalizeMobile(v) : ""))
    .refine((v) => v === "" || /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit WhatsApp number"),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address"),
  state: clean(60).min(2, "Select your state"),
  city: clean(80).min(2, "Enter your city or town"),
  brand: clean(80).min(1, "Select a brand of interest"),
  category: clean(80).min(1, "Select a footwear category"),
  quantity: clean(60).min(1, "Enter an approximate quantity"),
  message: clean(1500),
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || GSTIN.test(v), "Enter a valid 15-character GSTIN or leave it blank"),
  consent: z.literal(true, { error: "Please tick the consent box so we can contact you" }),
  /** Honeypot: real users never fill this. */
  website: z.string().max(0).optional().default(""),
  /** Page the inquiry came from (for attribution). */
  source: clean(200).optional().default(""),
});

export const inquirySchema = z.preprocess(fillBlanks, inquiryObject);

export type InquiryInput = z.input<typeof inquiryObject>;
export type Inquiry = z.output<typeof inquiryObject>;

export const STATE_OPTIONS = [
  "Telangana",
  "Andhra Pradesh",
  "Tamil Nadu",
  "Karnataka",
  "Other state in India",
] as const;
