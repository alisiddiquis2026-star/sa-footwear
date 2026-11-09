import { notFound } from "next/navigation";
import { categories, categoryHasRealProducts, getCategory, products } from "@/data/catalog";
import { Breadcrumbs, JsonLd, PageHero, Section } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

export async function generateMetadata(props: PageProps<"/category/[slug]">) {
  const c = getCategory((await props.params).slug);
  if (!c) return {};
  return pageMetadata({ title: c.name, description: c.intro.slice(0, 155), path: `/category/${c.slug}`, noindex: !categoryHasRealProducts(c.slug) });
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const c = getCategory((await props.params).slug);
  if (!c) notFound();
  const list = products.filter((p) => p.categorySlug === c.slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: c.name, path: `/category/${c.slug}` }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero title={c.name} lead={c.intro}><Breadcrumbs items={crumbs} /></PageHero>
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </Section>
    </>
  );
}
