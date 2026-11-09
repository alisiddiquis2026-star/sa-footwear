import { wholesaleFaqs } from "@/data/faqs";
import { Breadcrumbs, Faqs, JsonLd, PageHero, Section } from "@/components/ui";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently asked questions",
  description: "Answers on wholesale inquiries, brands, bulk quantities, states served and how to contact us.",
  path: "/faq",
});

export default function FaqPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "FAQs", path: "/faq" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(wholesaleFaqs)} />
      <PageHero eyebrow="FAQs" title="Questions we are asked most"><Breadcrumbs items={crumbs} /></PageHero>
      <Section className="max-w-3xl"><Faqs items={wholesaleFaqs} /></Section>
    </>
  );
}
