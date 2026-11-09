import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { brands, categories, isSampleProduct, products, realProducts } from "../catalog";

describe("catalogue data integrity", () => {
  it("has unique slugs", () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });
  it("every product references an existing brand and category", () => {
    for (const p of products) {
      expect(brands.some((b) => b.slug === p.brandSlug), p.slug).toBe(true);
      expect(categories.some((c) => c.slug === p.categorySlug), p.slug).toBe(true);
    }
  });
  it("every image file exists and has real alt text and dimensions", () => {
    for (const p of products) {
      expect(p.images.length, p.slug).toBeGreaterThan(0);
      for (const i of p.images) {
        expect(existsSync(path.join(process.cwd(), "public", i.src)), i.src).toBe(true);
        expect(i.alt.length, i.src).toBeGreaterThan(10);
        expect(i.width).toBeGreaterThan(0);
        expect(i.height).toBeGreaterThan(0);
      }
    }
  });
  it("placeholder products are flagged and never counted as real", () => {
    const phs = products.filter((p) => p.slug.includes("-sample-"));
    expect(phs.length).toBe(9);
    expect(phs.every((p) => p.sample && isSampleProduct(p))).toBe(true);
    expect(realProducts.every((p) => !p.slug.includes("-sample-"))).toBe(true);
  });
  it("publishes no invented prices", () => {
    expect(products.every((p) => p.priceInr === undefined)).toBe(true);
  });
  it("sample brands are flagged and their products detected", () => {
    expect(brands.find((b) => b.slug === "hoppins")?.sample).toBe(true);
    expect(products.filter(isSampleProduct).every((p) => p.sample || ["hoppins", "foremost"].includes(p.brandSlug))).toBe(true);
    expect(products.filter((p) => p.brandSlug === "woccy").length).toBeGreaterThan(20);
  });
});
