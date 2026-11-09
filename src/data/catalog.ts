import type { Brand, Category, Product } from "./types";
import { woccyProducts } from "./imported-products";
import { sampleProducts } from "./sample-products";

/**
 * CATALOG DATA, deliberately empty of invented stock.
 *
 * Add real products to `products` once images and details are approved.
 * Add a category only when it has real products (no empty SEO categories).
 * See docs/OWNER_GUIDE.md for the step-by-step.
 */

export const brands: Brand[] = [
  {
    slug: "woccy",
    name: "Woccy",
    tagline: "Everyday sandals, slippers and casual footwear",
    intro:
      "SA Footwear distributes Woccy footwear at wholesale across Telangana and Andhra Pradesh. Ask us for current models, size runs and quantities, and we will reply with what is available.",
    relationshipVerified: false, // owner-stated; set true only with a distribution letter on file
    note:
      "SA Footwear is a wholesale distributor of Woccy footwear in Telangana and Andhra Pradesh. This is not Woccy's own website. Woccy is a brand of its respective owner.",
  },
  {
    slug: "abc",
    name: "ABC",
    tagline: "Footwear range, details coming soon",
    intro:
      "ABC is one of the brands we carry. Its models are being added with real photographs. Meanwhile, send us an inquiry for current models, sizes and wholesale quantities.",
    relationshipVerified: false,
  },
  {
    slug: "ss-footwear",
    name: "SS Footwear",
    tagline: "Footwear range, details coming soon",
    intro:
      "SS Footwear is one of the brands we carry. Its models are being added with real photographs. Meanwhile, send us an inquiry for current models, sizes and wholesale quantities.",
    relationshipVerified: false,
  },
  {
    slug: "gg-foots",
    name: "GG Foots",
    tagline: "Footwear range, details coming soon",
    intro:
      "GG Foots is one of the brands we carry. Its models are being added with real photographs. Meanwhile, send us an inquiry for current models, sizes and wholesale quantities.",
    relationshipVerified: false,
  },
  {
    slug: "hoppins",
    name: "Hoppins",
    tagline: "Girls' sandals and slippers",
    intro: "Sample entry from the supplied creatives. Confirm you carry Hoppins before publishing: remove the sample flag in src/data/catalog.ts.",
    relationshipVerified: false,
    sample: true,
    note: "Sample content: this brand is not yet confirmed as part of our range.",
  },
  {
    slug: "foremost",
    name: "Foremost",
    tagline: "Premium ladies' collection",
    intro: "Sample entry from the supplied creatives. Confirm you carry Foremost before publishing: remove the sample flag in src/data/catalog.ts.",
    relationshipVerified: false,
    sample: true,
    note: "Sample content: this brand is not yet confirmed as part of our range.",
  },
];

/** Brands that are real (not sample placeholders). Used by forms, sitemap and schema. */
export const realBrands = brands.filter((b) => !b.sample);

export const categories: Category[] = [
  {
    slug: "ladies-footwear",
    name: "Ladies' footwear",
    intro: "Ladies' sandals, slippers and casual footwear with cushion soles, in sizes 5 to 9. Ask us for wholesale quantities and colour availability.",
  },
  {
    slug: "gents-footwear",
    name: "Gents' footwear",
    intro: "Gents' sandals and slippers, mostly in sizes 6 to 10. Send an inquiry for models, colours and wholesale quantities.",
  },
  {
    slug: "girls-footwear",
    name: "Girls' footwear",
    intro: "Girls' sandals in two size runs, 1 to 4 and 11 to 13. Currently sample entries pending brand confirmation.",
  },
];

export const products: Product[] = [...woccyProducts, ...sampleProducts];

/** True when the product belongs to a sample (unconfirmed) brand. */
export const isSampleProduct = (p: Product) => Boolean(p.sample || brands.find((b) => b.slug === p.brandSlug)?.sample);

/** Products that are real (not placeholders). */
export const realProducts = products.filter((p) => !isSampleProduct(p));

/** A brand page is only indexable once it has at least one real product. */
export const brandHasRealProducts = (slug: string) => realProducts.some((p) => p.brandSlug === slug);
export const categoryHasRealProducts = (slug: string) => realProducts.some((p) => p.categorySlug === slug);

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export type ShopQuery = {
  q?: string;
  brand?: string;
  category?: string;
  size?: string;
  color?: string;
  sort?: "newest" | "name" | "price-asc" | "price-desc";
};

export function filterProducts(list: Product[], query: ShopQuery): Product[] {
  const q = query.q?.trim().toLowerCase();
  let out = list.filter((p) => {
    if (query.brand && p.brandSlug !== query.brand) return false;
    if (query.category && p.categorySlug !== query.category) return false;
    if (query.size && !p.sizes?.includes(query.size)) return false;
    if (query.color && !p.colors?.some((c) => c.toLowerCase() === query.color!.toLowerCase())) return false;
    if (q) {
      const hay = `${p.name} ${p.sku ?? ""} ${p.brandSlug} ${p.categorySlug} ${p.description}`.toLowerCase();
      if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  switch (query.sort) {
    case "name":
      out = [...out].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price-asc":
      out = [...out].sort((a, b) => (a.priceInr ?? Infinity) - (b.priceInr ?? Infinity));
      break;
    case "price-desc":
      out = [...out].sort((a, b) => (b.priceInr ?? -1) - (a.priceInr ?? -1));
      break;
    default:
      out = [...out].sort((a, b) => b.addedOn.localeCompare(a.addedOn));
  }
  return out;
}

export function facetValues(list: Product[]) {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  for (const p of list) {
    p.sizes?.forEach((s) => sizes.add(s));
    p.colors?.forEach((c) => colors.add(c));
  }
  const sortedSizes = [...sizes].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  return { sizes: sortedSizes, colors: [...colors].sort() };
}
