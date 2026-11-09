import Link from "next/link";
import { Breadcrumbs, ContactCtas, PageHero, Section } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Become a business partner or dealer",
  description: "Opening or expanding a footwear shop? Tell us about your business and we will discuss how we can work together.",
  path: "/become-a-dealer",
});

export default function DealerPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Become a dealer", path: "/become-a-dealer" }];
  return (
    <>
      <PageHero eyebrow="Partners" title="Become a business partner" lead="If you run, or plan to open, a footwear shop, we would like to hear about it.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section className="max-w-3xl">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-ink-soft">
          <li>Send an inquiry with your shop details, location and the kind of customers you serve.</li>
          <li>We discuss brands, categories and starting quantities that suit your shop.</li>
          <li>Terms such as pricing and minimum orders are agreed directly with you.</li>
        </ol>
        <p className="mt-6 rounded-xl border border-line bg-paper p-4 text-sm text-ink-soft">
          Sending an inquiry does not create a dealership or exclusive territory. Any such arrangement would be agreed in writing.
        </p>
        <ContactCtas message="Hello, I am interested in becoming a business partner for footwear." className="mt-8" />
        <p className="mt-6 text-sm">Already know what you need? <Link className="font-semibold text-clay underline" href="/wholesale/inquiry">Go to the bulk inquiry form</Link>.</p>
      </Section>
    </>
  );
}
