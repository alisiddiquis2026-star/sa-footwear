import Link from "next/link";
import { brands, realBrands } from "@/data/catalog";
import { Breadcrumbs, JsonLd, PageHero, Section } from "@/components/ui";
import { abs, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Footwear brands",
  description: "The footwear brands we list, starting with Woccy. Ask us about availability and wholesale quantities.",
  path: "/brands",
});

export default function BrandsPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Brands", path: "/brands" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: realBrands.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, url: abs(`/brands/${b.slug}`) })) }} />
      <PageHero eyebrow="Brands" title="Brands we list" lead="We publish only the brands we actually carry. Looking for another label? Ask us, as the list grows with confirmed stock.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link href={`/brands/${b.slug}`} className="block h-full rounded-2xl border border-line bg-paper p-6 transition hover:-translate-y-1 hover:shadow-xl">
                <h2 className="font-display text-2xl font-bold">{b.name}</h2>
                <p className="mt-2 text-ink-soft">{b.tagline}</p>
                {b.sample && <span className="mt-3 inline-block rounded-full bg-clay px-2.5 py-0.5 text-xs font-semibold text-white">Sample</span>}
                <p className="mt-4 text-sm font-semibold text-clay">View collection →</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
