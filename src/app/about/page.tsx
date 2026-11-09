import { Breadcrumbs, ContactCtas, PageHero, Section } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { business } from "@/config/business";

export const metadata = pageMetadata({
  title: "About us",
  description: "An independent multi-brand footwear seller supplying shops and shoppers, with a wholesale focus on four southern states.",
  path: "/about",
  noindex: true, // thin until the owner supplies approved facts
});

export default function AboutPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }];
  return (
    <>
      <PageHero eyebrow="About" title={`About ${business.name}`} lead="We are an independent footwear seller working with shop owners and shoppers.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section className="max-w-3xl space-y-5 text-lg text-ink-soft">
        <p>We supply multi-brand footwear to retailers and resellers, and we also serve individual shoppers. Our wholesale focus is Telangana, Andhra Pradesh, Tamil Nadu and Karnataka, and we take inquiries from the rest of India.</p>
        <p>We distribute Woccy footwear at wholesale across Telangana and Andhra Pradesh, and we carry other brands too. We would rather show a smaller, honest range than a long list of things we cannot supply.</p>
        <p>If you are stocking a shop, send us your requirement and we will tell you what is available, what it will cost and how to place the order.</p>
        <p className="rounded-xl border border-dashed border-line bg-paper p-4 text-sm">
          <strong>Owner to complete:</strong> add your story, year started, location and any facts you can document. See BUSINESS_CONFIG.md. This page is hidden from search engines until then.
        </p>
        <ContactCtas message="Hello, I would like to know more about your business." />
      </Section>
    </>
  );
}
