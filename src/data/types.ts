export type ProductImage = {
  src: string; // path under /public, e.g. /products/woccy-xyz-1.webp
  alt: string; // human-written
  width: number;
  height: number;
};

export type Availability = "in_stock" | "out_of_stock" | "inquiry";

export type Product = {
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  sku?: string;
  description: string;
  colors?: string[];
  sizes?: string[];
  images: ProductImage[];
  /** Only set when the owner has approved a public retail price. */
  priceInr?: number;
  availability: Availability;
  featured?: boolean;
  /** Placeholder entry (invented layout data and illustration). Never indexed or listed in the sitemap. */
  sample?: boolean;
  /** ISO date; used for "latest arrivals" and sitemap lastmod. */
  addedOn: string;
};

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  /** Only true once written evidence exists. */
  relationshipVerified: boolean;
  /** Shown on the brand page. Owner-stated facts only. */
  note?: string;
  /** Placeholder entry for layout. Never indexed, listed in sitemap or offered in forms. */
  sample?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  intro: string;
};

export type ServiceState = {
  slug: string;
  name: string;
  language: string;
  headline: string;
  paragraphs: string[];
  /** Research targets only. Never rendered as "we serve" until confirmed. */
  cityTargets: string[];
  /** Owner states we distribute Woccy here. */
  woccyDistribution?: boolean;
};
