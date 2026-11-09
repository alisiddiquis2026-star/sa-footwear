import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandHasRealProducts, brands, categories, getBrand, products } from "@/data/catalog";
import { Breadcrumbs, ContactCtas, JsonLd, PageHero, Section } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business, INQUIRY_PATH } from "@/config/business";

export const dynamicParams = false;
export const generateStaticParams = () => brands.map((b) => ({ slug: b.slug }));

export async function generateMetadata(props: PageProps<"/brands/[slug]">) {
  const b = getBrand((await props.params).slug);
  if (!b) return {};
  return pageMetadata({
    title: `${b.name} footwear`,
    description: `${b.name} footwear listed by ${business.name}. ${b.tagline}. Send a wholesale inquiry for models and quantities.`,
    path: `/brands/${b.slug}`,
    noindex: b.sample || !brandHasRealProducts(b.slug),
  });
}

export default async function BrandPage(props: PageProps<"/brands/[slug]">) {
  const brand = getBrand((await props.params).slug);
  if (!brand) notFound();
  const list = products.filter((p) => p.brandSlug === brand.slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Brands", path: "/brands" }, { name: brand.name, path: `/brands/${brand.slug}` }];

  // Group by category so retailers can scan ladies / gents separately.
  const groups = categories
    .map((c) => ({ c, items: list.filter((p) => p.categorySlug === c.slug) }))
    .filter((g) => g.items.length > 0);
  const colourCount = new Set(list.flatMap((p) => p.colors ?? [])).size;
  const hero = list.filter((p) => p.images[0] && !p.sample).slice(0, 3);
  const showcase = hero.length === 3 && !brand.sample;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      {showcase ? (
        <section className="overflow-hidden bg-ink text-sand">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-2">
            <div>
              <div className="[&_a]:text-sand/80 [&_li>span]:text-white [&_nav]:text-sand/70"><Breadcrumbs items={crumbs} /></div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-gold-light">Featured brand</p>
              <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-6xl">{brand.name} footwear</h1>
              <p className="mt-4 max-w-xl text-lg text-sand/85">{brand.intro}</p>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
                {[[String(list.length), "Models"], [String(colourCount), "Colours"], [String(groups.length), "Ranges"]].map(([n, l]) => (
                  <div key={l} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <dt className="text-xs uppercase tracking-wider text-sand/70">{l}</dt>
                    <dd className="font-display text-3xl font-bold text-gold-light">{n}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`${INQUIRY_PATH}?brand=${encodeURIComponent(brand.name)}`} className="btn btn-primary">Request {brand.name} quote</Link>
                <a href="#collection" className="btn bg-sand text-ink hover:bg-white">Browse the range</a>
              </div>
            </div>
            <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[32rem]">
              {hero.map((p, i) => {
                const img = p.images[0];
                const pos = ["left-0 top-6 -rotate-6 z-10", "right-0 top-0 rotate-3 z-20", "left-1/4 bottom-0 -rotate-1 z-30"][i];
                return (
                  <Image key={p.slug} src={img.src} alt={img.alt} width={img.width} height={img.height} priority={i === 0}
                    sizes="(min-width:1024px) 220px, 45vw"
                    className={`absolute w-[46%] rounded-2xl border-4 border-white/90 shadow-2xl ${pos}`} />
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <PageHero eyebrow={brand.sample ? "Sample brand" : "Brand"} title={`${brand.name} footwear`} lead={brand.intro}>
          <Breadcrumbs items={crumbs} />
        </PageHero>
      )}

      <Section>
        {brand.sample && (
          <p role="note" className="mb-4 inline-block rounded-full bg-clay px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Sample</p>
        )}
        {brand.note && <p className="mb-8 rounded-xl border border-line bg-paper p-4 text-sm text-ink-soft">{brand.note}</p>}

        {list.length > 0 ? (
          <div id="collection" className="scroll-mt-24 space-y-14">
            {groups.map(({ c, items }) => (
              <section key={c.slug} aria-labelledby={`h-${c.slug}`}>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 id={`h-${c.slug}`} className="font-display text-3xl font-bold">{c.name}</h2>
                  <p className="text-sm text-ink-soft">{items.length} {items.length === 1 ? "model" : "models"}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                  {items.map((p) => <ProductCard key={p.slug} product={p} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
            <h2 className="font-display text-2xl font-bold">{brand.name} models are being added</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">We list a model only once we have confirmed stock and a real photograph. Ask us what is available right now.</p>
            <ContactCtas message={`Hello, I would like details of ${brand.name} footwear.`} className="mt-6 justify-center" />
          </div>
        )}
        <p className="mt-12"><Link href="/brands" className="font-semibold text-clay underline">← All brands</Link></p>
      </Section>
    </>
  );
}
