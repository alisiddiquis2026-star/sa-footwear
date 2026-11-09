import { beforeEach, describe, expect, it } from "vitest";
import { inquirySchema, normalizeMobile } from "../inquiry-schema";
import { _resetForTests, isDuplicate, markSeen, rateLimited } from "../rate-limit";
import { filterProducts, facetValues } from "@/data/catalog";
import type { Product } from "@/data/types";

const valid = {
  contactName: "Ravi Kumar",
  shopName: "Ravi Footwear",
  mobile: "+91 98765 43210",
  whatsapp: "",
  email: "",
  state: "Telangana",
  city: "Hyderabad",
  brand: "Woccy",
  category: "Slippers and chappals",
  quantity: "120 pairs",
  message: "",
  gstin: "",
  consent: true,
};

describe("inquiry schema", () => {
  it("accepts a valid inquiry and normalises the mobile", () => {
    const r = inquirySchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.mobile).toBe("9876543210");
  });
  it("rejects bad mobile numbers", () => {
    expect(inquirySchema.safeParse({ ...valid, mobile: "12345" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, mobile: "5876543210" }).success).toBe(false);
  });
  it("requires consent", () => {
    expect(inquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
  it("validates optional GSTIN", () => {
    expect(inquirySchema.safeParse({ ...valid, gstin: "36AABCU9603R1ZX" }).success).toBe(true);
    expect(inquirySchema.safeParse({ ...valid, gstin: "NOTAGSTIN" }).success).toBe(false);
  });
  it("rejects invalid email but allows blank", () => {
    expect(inquirySchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, email: "a@b.in" }).success).toBe(true);
  });
  it("gives friendly messages for missing fields", () => {
    const r = inquirySchema.safeParse({ consent: true });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.every((i) => !/expected string/i.test(i.message))).toBe(true);
  });
  it("normalizeMobile strips prefixes", () => {
    expect(normalizeMobile("09876543210")).toBe("9876543210");
    expect(normalizeMobile("919876543210")).toBe("9876543210");
  });
});

describe("abuse protection", () => {
  beforeEach(_resetForTests);
  it("rate limits after the max", () => {
    for (let i = 0; i < 5; i++) expect(rateLimited("ip")).toBe(false);
    expect(rateLimited("ip")).toBe(true);
  });
  it("window expires", () => {
    for (let i = 0; i < 5; i++) rateLimited("ip", 5, 1000, 0);
    expect(rateLimited("ip", 5, 1000, 2000)).toBe(false);
  });
  it("only flags duplicates after a successful save is recorded", () => {
    expect(isDuplicate("x")).toBe(false);
    expect(isDuplicate("x")).toBe(false); // a failed save must not poison retries
    markSeen("x");
    expect(isDuplicate("x")).toBe(true);
  });
});

const fixture: Product[] = [
  { slug: "a", name: "Alpha Sandal", brandSlug: "b1", categorySlug: "sandals", description: "light", sizes: ["6", "7"], colors: ["Black"], images: [], availability: "inquiry", addedOn: "2026-01-01", priceInr: 500 },
  { slug: "b", name: "Beta Slipper", brandSlug: "b2", categorySlug: "slippers", description: "soft", sizes: ["8"], colors: ["Blue"], images: [], availability: "inquiry", addedOn: "2026-02-01" },
];

describe("catalog filtering", () => {
  it("filters by brand, size, colour and text", () => {
    expect(filterProducts(fixture, { brand: "b1" }).map((p) => p.slug)).toEqual(["a"]);
    expect(filterProducts(fixture, { size: "8" }).map((p) => p.slug)).toEqual(["b"]);
    expect(filterProducts(fixture, { color: "blue" }).map((p) => p.slug)).toEqual(["b"]);
    expect(filterProducts(fixture, { q: "alpha sandal" }).map((p) => p.slug)).toEqual(["a"]);
  });
  it("returns empty for no match", () => {
    expect(filterProducts(fixture, { q: "zzz" })).toEqual([]);
  });
  it("sorts newest first and by price with unpriced last", () => {
    expect(filterProducts(fixture, {}).map((p) => p.slug)).toEqual(["b", "a"]);
    expect(filterProducts(fixture, { sort: "price-asc" }).map((p) => p.slug)).toEqual(["a", "b"]);
  });
  it("collects facets", () => {
    expect(facetValues(fixture)).toEqual({ sizes: ["6", "7", "8"], colors: ["Black", "Blue"] });
  });
});
