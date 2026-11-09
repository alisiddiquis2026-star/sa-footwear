import Link from "next/link";
import { brands, categories, products, filterProducts, facetValues, type ShopQuery } from "@/data/catalog";
import { Breadcrumbs, JsonLd, PageHero, Section } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { abs, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { INQUIRY_PATH } from "@/config/business";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

/** Filtered/sorted/searched URLs are noindex; the bare /shop page is indexable. */
export async function generateMetadata(props: PageProps<"/shop">) {
  const sp = (await props.searchParams) as Search;
  const filtered = Object.keys(sp).length > 0;
  return pageMetadata({
    title: "Shop footwear",
    description: "Browse footwear by brand, category and size. Wholesale quotes available on request.",
    path: "/shop",
    noindex: filtered,
  });
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const sp = (await props.searchParams) as Search;
  const query: ShopQuery = {
    q: one(sp.q),
    brand: one(sp.brand),
    category: one(sp.category),
    size: one(sp.size),
    color: one(sp.color),
    sort: one(sp.sort) as ShopQuery["sort"],
  };
  const results = filterProducts(products, query);
  const { sizes, colors } = facetValues(products);
  const hasFilters = Object.values(query).some(Boolean);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero eyebrow="Retail catalogue" title="Shop footwear" lead="Filter by brand, category and size. Prices appear only when confirmed; otherwise ask us for a quote.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section>
        <nav aria-label="Quick categories" className="-mt-2 mb-6 flex flex-wrap gap-2">
          {[{ slug: "", name: "All" }, ...categories].map((c) => {
            const active = (query.category ?? "") === c.slug;
            const href = c.slug ? `/shop?category=${c.slug}` : "/shop";
            return (
              <Link key={c.slug || "all"} href={href} aria-current={active ? "true" : undefined}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-5 text-sm font-semibold transition hover:border-ink aria-[current=true]:border-ink aria-[current=true]:bg-ink aria-[current=true]:text-white">
                {c.name}
              </Link>
            );
          })}
        </nav>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* A plain GET form: filters work without JavaScript and every state is a shareable URL. */}
          <FilterPanel>
          <form method="get" action="/shop" role="search" aria-label="Filter products" className="grid gap-4 p-5">
            <div className="field">
              <label htmlFor="q">Search</label>
              <input id="q" name="q" type="search" defaultValue={query.q} className="input" placeholder="Model, SKU or brand" />
            </div>
            <div className="field">
              <label htmlFor="brand">Brand</label>
              <select id="brand" name="brand" defaultValue={query.brand ?? ""} className="input">
                <option value="">All brands</option>
                {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
              </select>
            </div>
            {categories.length > 0 && (
              <div className="field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" defaultValue={query.category ?? ""} className="input">
                  <option value="">All categories</option>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            )}
            {sizes.length > 0 && (
              <div className="field">
                <label htmlFor="size">Size</label>
                <select id="size" name="size" defaultValue={query.size ?? ""} className="input">
                  <option value="">Any size</option>
                  {sizes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            {colors.length > 0 && (
              <div className="field">
                <label htmlFor="color">Colour</label>
                <select id="color" name="color" defaultValue={query.color ?? ""} className="input">
                  <option value="">Any colour</option>
                  {colors.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div className="field">
              <label htmlFor="sort">Sort by</label>
              <select id="sort" name="sort" defaultValue={query.sort ?? "newest"} className="input">
                <option value="newest">Newest</option>
                <option value="name">Name A–Z</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </div>
            <button className="btn btn-dark" type="submit">Apply filters</button>
            {hasFilters && <Link href="/shop" className="text-center text-sm font-semibold underline">Clear all</Link>}
          </form>
          </FilterPanel>

          <div>
            <p className="mb-4 text-sm text-ink-soft" role="status">{results.length} {results.length === 1 ? "product" : "products"}</p>
            {results.length > 0 ? (
              <>
                <JsonLd data={{
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  itemListElement: results.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/shop/${p.slug}`), name: p.name })),
                }} />
                <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
                  {results.map((p) => <ProductCard key={p.slug} product={p} />)}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
                <h2 className="font-display text-2xl font-bold">
                  {products.length === 0 ? "Our catalogue is being prepared" : "No products match these filters"}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-ink-soft">
                  {products.length === 0
                    ? "We are adding confirmed stock with real photographs. Meanwhile, tell us what you are looking for and we will reply with what is available."
                    : "Try removing a filter or searching a different word."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {hasFilters && <Link href="/shop" className="btn btn-ghost">Clear filters</Link>}
                  <Link href={INQUIRY_PATH} className="btn btn-primary">Send an inquiry</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
