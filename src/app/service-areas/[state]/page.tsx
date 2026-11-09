import Link from "next/link";
import { notFound } from "next/navigation";
import { getState, serviceStates } from "@/data/states";
import { Breadcrumbs, ContactCtas, JsonLd, PageHero, Section } from "@/components/ui";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { business } from "@/config/business";

export const dynamicParams = false;
export const generateStaticParams = () => serviceStates.map((s) => ({ state: s.slug }));

export async function generateMetadata(props: PageProps<"/service-areas/[state]">) {
  const s = getState((await props.params).state);
  if (!s) return {};
  return pageMetadata({
    title: `Wholesale footwear inquiries, ${s.name}`,
    description: `Footwear shops in ${s.name} can request a wholesale quote for the brands we list. See how to inquire and what to ask.`,
    path: `/service-areas/${s.slug}`,
  });
}

export default async function StatePage(props: PageProps<"/service-areas/[state]">) {
  const s = getState((await props.params).state);
  if (!s) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service areas", path: "/service-areas" },
    { name: s.name, path: `/service-areas/${s.slug}` },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero eyebrow={s.name} title={s.headline}><Breadcrumbs items={crumbs} /></PageHero>
      <Section className="max-w-3xl">
        <div className="space-y-5 text-lg text-ink-soft">{s.paragraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        {s.woccyDistribution && (
          <p className="mt-6 rounded-2xl border border-line bg-paper p-5 text-lg">
            <strong>Woccy in {s.name}:</strong> {business.name} distributes Woccy footwear at wholesale across {s.name}. See the <Link className="font-semibold text-clay underline" href="/brands/woccy">Woccy collection</Link> or send an inquiry for models and quantities.
          </p>
        )}
        <ContactCtas message={`Hello, I run a footwear shop in ${s.name} and would like a wholesale quote.`} className="mt-8" />
        <p className="mt-8 text-sm text-ink-soft">
          Looking at another state? <Link className="font-semibold text-clay underline" href="/service-areas">See all service areas</Link>.
        </p>
      </Section>
    </>
  );
}
