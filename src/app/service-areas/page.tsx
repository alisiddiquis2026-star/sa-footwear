import Link from "next/link";
import { serviceStates } from "@/data/states";
import { Breadcrumbs, JsonLd, PageHero, Section } from "@/components/ui";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Where we supply wholesale footwear",
  description: "Wholesale footwear inquiries from Telangana, Andhra Pradesh, Tamil Nadu and Karnataka, plus all-India inquiries.",
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Service areas", path: "/service-areas" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero eyebrow="Service areas" title="Where we supply" lead="Four states are our focus. Retailers elsewhere in India are welcome to ask whether we can supply their location.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2">
          {serviceStates.map((s) => (
            <li key={s.slug}>
              <Link href={`/service-areas/${s.slug}`} className="block h-full rounded-2xl border border-line bg-paper p-6 transition hover:-translate-y-1 hover:shadow-xl">
                <h2 className="font-display text-2xl font-bold">{s.name}</h2>
                <p className="mt-2 text-ink-soft">{s.headline}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-display text-2xl font-bold">Rest of India</h2>
          <p className="mt-2 text-ink-soft">Not in these four states? Send an inquiry with your city and requirement. We will tell you honestly whether we can supply there.</p>
          <Link href="/wholesale/inquiry" className="btn btn-primary mt-4">Send an inquiry</Link>
        </div>
        <p className="mt-6 text-sm text-ink-soft">These are supply regions, not shop locations.</p>
      </Section>
    </>
  );
}
