import Image from "next/image";
import Link from "next/link";
import { categories, categoryHasRealProducts, realBrands, realProducts } from "@/data/catalog";
import { serviceStates } from "@/data/states";
import { wholesaleFaqs } from "@/data/faqs";
import { ContactCtas, Faqs, JsonLd, Section } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { pageMetadata, organizationJsonLd } from "@/lib/seo";
import { business, telHref } from "@/config/business";

export const metadata = pageMetadata({
  title: `${business.name} | Multi-brand footwear, retail and wholesale`,
  description:
    "Browse footwear brands including Woccy, or send a wholesale inquiry for your shop. Supplying retailers in Telangana, Andhra Pradesh, Tamil Nadu and Karnataka.",
  path: "/",
});

export default function Home() {
  const tel = telHref();
  const featured = realProducts.filter((p) => p.featured).slice(0, 8);
  const slides: Slide[] = realProducts
    .filter((p) => p.brandSlug === "woccy" && p.images[0])
    .slice(0, 4)
    .map((p) => ({
      href: `/shop/${p.slug}`,
      title: p.name,
      caption: `Woccy${p.sizes?.length ? ` · sizes ${p.sizes[0]}-${p.sizes[p.sizes.length - 1]}` : ""} · price on inquiry`,
      src: p.images[0].src, alt: p.images[0].alt, width: p.images[0].width, height: p.images[0].height,
    }));
  const tiles = categories
    .filter((c) => categoryHasRealProducts(c.slug))
    .map((c) => {
      const list = realProducts.filter((p) => p.categorySlug === c.slug);
      return { c, count: list.length, img: list[0]?.images[0] };
    });
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: business.name, url: business.siteUrl }} />
      <JsonLd data={organizationJsonLd()} />

      <section className="relative overflow-hidden bg-ink text-sand">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-light">Retail · Wholesale · South India</p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
              Multi-brand footwear for your shop, and for your feet.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sand/85">
              We are a wholesale distributor of Woccy footwear across Telangana and Andhra Pradesh, and we supply other brands to shops in Tamil Nadu and Karnataka too. Ask us for a wholesale quote, or send an inquiry from anywhere in India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn bg-sand text-ink hover:bg-white">Shop footwear</Link>
              <Link href="/wholesale/inquiry" className="btn btn-primary">Request wholesale quote</Link>
            </div>
          </div>
          <div>
            <HeroSlider slides={slides} />
            <div className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-light">Talk to us</p>
              {tel && <p className="mt-2 font-display text-2xl font-bold"><a href={tel} className="hover:underline">{business.phone}</a></p>}
              <p className="mt-1 text-sm text-sand/80">{business.location}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/wholesale/inquiry" className="btn btn-primary">Request quote</Link>
                {tel && <a href={tel} className="btn bg-sand text-ink hover:bg-white">Call now</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Why retailers choose us" className="border-b border-line bg-paper">
        <ul className="mx-auto grid max-w-6xl gap-px px-4 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Woccy wholesale", "Distributor for Telangana and Andhra Pradesh"],
            ["Real size runs", "Ladies 5 to 9, gents 6 to 10 on Woccy models"],
            ["Cushion-sole ranges", "Everyday sandals and slippers"],
            ["Quote your way", "Form, call or WhatsApp, whichever is quickest"],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3 py-2 pr-4">
              <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-full bg-gold" />
              <span><strong className="block text-ink">{t}</strong><span className="text-ink-soft">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      {tiles.length > 0 && (
        <Section>
          <Reveal>
            <h2 className="font-display text-3xl font-bold">Shop by category</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {tiles.map(({ c, count, img }) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-3xl bg-ink">
                    {img && (
                      <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(min-width:640px) 50vw, 100vw"
                        className="absolute inset-0 h-full w-full object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                      <span>
                        <span className="block font-display text-2xl font-bold">{c.name}</span>
                        <span className="text-sm text-white/80">{count} {count === 1 ? "model" : "models"}</span>
                      </span>
                      <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-gold text-ink transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      )}

      {featured.length > 0 && (
        <Section className="!pt-0">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl font-bold">Featured from Woccy</h2>
              <Link href="/brands/woccy" className="font-semibold text-clay underline underline-offset-4">View all Woccy →</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </Reveal>
        </Section>
      )}

      <Section className="!pt-0">
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Brands we carry</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">Woccy is our featured range. The others are being added with real photographs.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {realBrands.map((b) => (
              <li key={b.slug}>
                <Link href={`/brands/${b.slug}`} className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-paper p-6 transition hover:-translate-y-1 hover:border-gold hover:shadow-xl">
                  <span>
                    <span className="font-display text-2xl font-bold">{b.name}</span>
                    <span className="mt-2 block text-sm text-ink-soft">{b.tagline}</span>
                  </span>
                  <span className="mt-6 text-sm font-semibold text-clay">View collection <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <section className="bg-paper">
        <Section>
          <Reveal>
            <h2 className="font-display text-3xl font-bold">How a wholesale inquiry works</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                ["1", "Tell us what you need", "Send the brand, category and rough quantity through the inquiry form or WhatsApp."],
                ["2", "We reply with availability", "We confirm what is in stock and share pricing and order terms directly with you."],
                ["3", "Finalise your order", "Agree sizes and quantities, then we arrange the next steps for dispatch."],
              ].map(([n, t, d]) => (
                <li key={n} className="rounded-2xl border border-line p-6">
                  <span className="grid size-10 place-items-center rounded-full bg-clay font-bold text-white">{n}</span>
                  <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Section>
      </section>

      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-bold">Where we supply</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">Our focus is four southern states. Shops elsewhere in India can still send an inquiry and we will confirm if we can supply your location.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceStates.map((s) => (
              <li key={s.slug}>
                <Link href={`/service-areas/${s.slug}`} className="block rounded-2xl border border-line bg-paper p-5 transition hover:border-clay">
                  <span className="font-display text-xl font-bold">{s.name}</span>
                  <span className="mt-1 block text-sm text-ink-soft">Wholesale inquiries →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <h2 className="font-display text-3xl font-bold">Questions retailers ask</h2>
        <div className="mt-6"><Faqs items={wholesaleFaqs.slice(0, 5)} /></div>
        <p className="mt-4"><Link href="/faq" className="font-semibold text-clay underline">See all FAQs</Link></p>
      </Section>

      <section className="bg-ink text-sand">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="font-display text-3xl font-bold">Stocking a shop? Start with a conversation.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sand/80">Send us your brand, category and quantity. We will respond with what we can supply.</p>
          <ContactCtas message="Hello, I would like wholesale footwear details." className="mt-8 justify-center" />
        </div>
      </section>
    </>
  );
}
