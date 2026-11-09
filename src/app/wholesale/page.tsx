import Link from "next/link";
import { realBrands as brands } from "@/data/catalog";
import { serviceStates } from "@/data/states";
import { wholesaleFaqs } from "@/data/faqs";
import { Breadcrumbs, ContactCtas, Faqs, JsonLd, PageHero, Section } from "@/components/ui";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Wholesale footwear supply for retailers",
  description:
    "Multi-brand wholesale footwear for shops and resellers in Telangana, Andhra Pradesh, Tamil Nadu and Karnataka. See brands, how to inquire and what to ask a supplier.",
  path: "/wholesale",
});

export default function WholesalePage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Wholesale", path: "/wholesale" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero eyebrow="For retailers and resellers" title="Wholesale footwear for your shop" lead="Tell us the brand, category and quantity you want. We reply with availability, then pricing and order terms directly.">
        <Breadcrumbs items={crumbs} />
        <ContactCtas message="Hello, I would like a wholesale footwear quote." className="mt-2" />
      </PageHero>

      <Section>
        <h2 className="font-display text-3xl font-bold">What you can ask us for</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Brand availability", `Currently listed: ${brands.map((b) => b.name).join(", ")}.`],
            ["Models and size runs", "Ask for article numbers, size ranges and colours before you commit."],
            ["Bulk quantities", "Share pairs or cartons you plan to buy. Minimum quantities are confirmed directly."],
            ["Repeat orders", "Already stocking from us? Use the same form to reorder or ask for new arrivals."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-line bg-paper p-6">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-ink-soft">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section className="bg-paper">
        <Section>
          <h2 className="font-display text-3xl font-bold">States we focus on</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceStates.map((s) => (
              <li key={s.slug}><Link className="block rounded-2xl border border-line p-5 font-semibold hover:border-clay" href={`/service-areas/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
          <p className="mt-4 text-ink-soft">Outside these states? <Link className="font-semibold text-clay underline" href="/wholesale/inquiry">Send an inquiry</Link> and we will confirm whether we can supply your location.</p>
        </Section>
      </section>

      <Section>
        <h2 className="font-display text-3xl font-bold">What to ask any wholesale footwear supplier</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Checklist for wholesale footwear buyers</caption>
            <thead className="bg-sand"><tr><th scope="col" className="p-4">Ask about</th><th scope="col" className="p-4">Why it matters</th></tr></thead>
            <tbody className="divide-y divide-line">
              {[
                ["Article / model number", "So you order exactly the design your customers have seen."],
                ["Size run and pairs per carton", "Decides how many pairs of each size you actually receive."],
                ["Price per pair and tax", "Confirm whether GST is included before comparing offers."],
                ["Dispatch time and mode", "Plan stock around festival demand."],
                ["Photos of the exact article", "Avoids surprises on colour and finish."],
              ].map(([a, b]) => (<tr key={a}><th scope="row" className="p-4 font-semibold">{a}</th><td className="p-4 text-ink-soft">{b}</td></tr>))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="!pt-0">
        <h2 className="font-display text-3xl font-bold">Wholesale FAQs</h2>
        <div className="mt-6"><Faqs items={wholesaleFaqs} /></div>
      </Section>
    </>
  );
}
