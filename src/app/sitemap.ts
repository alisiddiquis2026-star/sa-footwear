import type { MetadataRoute } from "next";
import { brandHasRealProducts, categoryHasRealProducts, realBrands, categories, realProducts as products } from "@/data/catalog";
import { serviceStates } from "@/data/states";
import { abs } from "@/lib/seo";

/** Only indexable pages. Drafts (policies, about) and filtered URLs are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/shop", "/brands", "/wholesale", "/wholesale/inquiry", "/become-a-dealer", "/contact", "/faq", "/service-areas"];
  return [
    ...staticPaths.map((p) => ({ url: abs(p) })),
    ...realBrands.filter((b) => brandHasRealProducts(b.slug)).map((b) => ({ url: abs(`/brands/${b.slug}`) })),
    ...categories.filter((c) => categoryHasRealProducts(c.slug)).map((c) => ({ url: abs(`/category/${c.slug}`) })),
    ...serviceStates.map((s) => ({ url: abs(`/service-areas/${s.slug}`) })),
    ...products.map((p) => ({ url: abs(`/shop/${p.slug}`), lastModified: p.addedOn })),
  ];
}
