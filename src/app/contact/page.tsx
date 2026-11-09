import Link from "next/link";
import { Breadcrumbs, ContactCtas, PageHero, Section } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { business, hasPhone, hasWhatsapp, INQUIRY_PATH, telHref } from "@/config/business";

export const metadata = pageMetadata({
  title: "Contact us",
  description: "Call, WhatsApp or send a wholesale inquiry. We reply to retail and wholesale questions.",
  path: "/contact",
});

export default function ContactPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  const tel = telHref();
  const missing = !hasPhone && !hasWhatsapp && !business.email;
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to us" lead="The quickest way to start is the wholesale inquiry form. You can also reach us directly.">
        <Breadcrumbs items={crumbs} />
      </PageHero>
      <Section className="max-w-3xl">
        <ContactCtas message="Hello, I have a question about footwear." />
        <dl className="mt-10 grid gap-5 text-lg">
          {tel && <div><dt className="font-semibold">Phone</dt><dd><a className="underline" href={tel}>{business.phone}</a></dd></div>}
          {business.email && <div><dt className="font-semibold">Email</dt><dd><a className="underline" href={`mailto:${business.email}`}>{business.email}</a></dd></div>}
          {business.address && (
            <div><dt className="font-semibold">Address</dt><dd>{business.address.street}, {business.address.locality}, {business.address.city}, {business.address.state} {business.address.postalCode}</dd></div>
          )}
          {business.hours && <div><dt className="font-semibold">Hours</dt><dd>{business.hours}</dd></div>}
        </dl>
        {missing && (
          <p className="mt-8 rounded-xl border border-dashed border-line bg-paper p-4 text-sm text-ink-soft">
            Phone, WhatsApp and email have not been confirmed yet, so they are not shown. Until they are, please use the{" "}
            <Link className="font-semibold underline" href={INQUIRY_PATH}>inquiry form</Link>.
          </p>
        )}
      </Section>
    </>
  );
}
