import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getCategory, getProduct, isSampleProduct, products } from "@/data/catalog";
import { Breadcrumbs, JsonLd, Section } from "@/components/ui";
import { ImageSlot, ProductCard } from "@/components/ProductCard";
import { abs, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business, INQUIRY_PATH, waHref } from "@/config/business";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) return {};
  const brand = getBrand(p.brandSlug)?.name ?? "";
  return pageMetadata({
    title: `${p.name}${brand ? `, ${brand}` : ""}`,
    description: p.description.slice(0, 155),
    path: `/shop/${p.slug}`,
    noindex: isSampleProduct(p),
  });
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) notFound();

  const brand = getBrand(p.brandSlug);
  const category = getCategory(p.categorySlug);
  const related = products.filter((x) => x.slug !== p.slug && (x.brandSlug === p.brandSlug || x.categorySlug === p.categorySlug)).slice(0, 4);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: p.name, path: `/shop/${p.slug}` },
  ];

  const message = `Hello, I am interested in ${p.name}${p.sku ? ` (SKU ${p.sku})` : ""}${brand ? ` by ${brand.name}` : ""}. Page: ${abs(`/shop/${p.slug}`)}`;
  const wa = waHref(message);

  // Offer markup ONLY when we hold a confirmed price. Inquiry-only products get no Offer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    ...(p.sku ? { sku: p.sku } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand.name } } : {}),
    ...(p.images.length ? { image: p.images.map((i) => abs(i.src)) } : {}),
    ...(p.priceInr && p.availability !== "inquiry"
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: p.priceInr,
            url: abs(`/shop/${p.slug}`),
            availability: p.availability === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: business.name },
          },
        }
      : {}),
  };

  return (
    <Section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="grid gap-3">
          {p.images.length ? (
            p.images.map((img, i) => (
              <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} priority={i === 0}
                sizes="(min-width:1024px) 50vw, 100vw" className="w-full rounded-2xl border border-line bg-paper object-contain" />
            ))
          ) : (
            <ImageSlot />
          )}
        </div>
        <div>
          {brand && <Link href={`/brands/${brand.slug}`} className="text-sm font-semibold uppercase tracking-wider text-clay">{brand.name}</Link>}
          <h1 className="mt-1 font-display text-4xl font-bold">{p.name}</h1>
          {isSampleProduct(p) && <p role="note" className="mt-2 inline-block rounded-full bg-clay px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Sample listing, image and details are placeholders</p>}
          <p className="mt-3 text-xl font-semibold">{p.priceInr ? `₹${p.priceInr.toLocaleString("en-IN")}` : "Price on inquiry"}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {p.availability === "in_stock" ? "In stock" : p.availability === "out_of_stock" ? "Currently out of stock" : "Ask us for current availability"}
          </p>
          <p className="mt-5 text-ink-soft">{p.description}</p>
          {p.colors?.length ? (
            <div className="mt-6">
              <p className="text-sm font-semibold">Colours</p>
              <ul className="mt-2 flex flex-wrap gap-2">{p.colors.map((c) => <li key={c} className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm">{c}</li>)}</ul>
            </div>
          ) : null}
          {p.sizes?.length ? (
            <div className="mt-5">
              <p className="text-sm font-semibold">Available size run</p>
              <ul className="mt-2 flex flex-wrap gap-2">{p.sizes.map((z) => <li key={z} className="grid size-11 place-items-center rounded-lg border border-line bg-paper text-sm font-semibold">{z}</li>)}</ul>
            </div>
          ) : null}
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {p.sku && (<><dt className="font-semibold">SKU</dt><dd>{p.sku}</dd></>)}
            {category && (<><dt className="font-semibold">Category</dt><dd>{category.name}</dd></>)}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${INQUIRY_PATH}?product=${encodeURIComponent(p.name)}${brand ? `&brand=${encodeURIComponent(brand.name)}` : ""}`} className="btn btn-primary">
              Inquire about this product
            </Link>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa" data-evt="whatsapp_click">WhatsApp about this</a>}
          </div>
          <p className="mt-4 text-xs text-ink-soft">Online checkout is not enabled. Orders are confirmed through inquiry.</p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.slug} product={r} />)}
          </div>
        </div>
      )}
    </Section>
  );
}
