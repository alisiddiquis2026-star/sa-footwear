import { realBrands as brands, categories } from "@/data/catalog";
import { Breadcrumbs, PageHero, Section } from "@/components/ui";
import { InquiryForm } from "@/components/InquiryForm";
import { pageMetadata } from "@/lib/seo";
import { business, waHref } from "@/config/business";

export const metadata = pageMetadata({
  title: "Bulk order and wholesale inquiry",
  description: "Send a bulk footwear inquiry with your shop details, brand, category and quantity. We reply with availability and next steps.",
  path: "/wholesale/inquiry",
});

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 120);

const DEFAULT_CATEGORIES = ["Men's footwear", "Women's footwear", "Kids' footwear", "Sandals", "Slippers and chappals", "Casual footwear", "Mixed assortment"];

export default async function InquiryPage(props: PageProps<"/wholesale/inquiry">) {
  const sp = await props.searchParams;
  const product = one(sp.product);
  const brandParam = one(sp.brand);
  const brandNames = brands.map((b) => b.name);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Wholesale", path: "/wholesale" }, { name: "Inquiry", path: "/wholesale/inquiry" }];

  return (
    <>
      <PageHero eyebrow="Wholesale" title="Bulk order inquiry" lead="Fill this in and we will get back to you on your mobile number. Takes about two minutes.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section className="max-w-3xl">
        <InquiryForm
          brands={brandNames}
          categories={categories.length ? categories.map((c) => c.name) : DEFAULT_CATEGORIES}
          presetBrand={brandParam && brandNames.includes(brandParam) ? brandParam : undefined}
          presetProduct={product}
          whatsappHref={waHref("Hello, I tried the wholesale inquiry form and would like to share my requirement.")}
          phone={business.phone}
        />
      </Section>
    </>
  );
}
