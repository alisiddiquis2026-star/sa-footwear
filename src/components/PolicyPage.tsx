import { Breadcrumbs, PageHero, Section } from "@/components/ui";

/** Policies stay noindex and visibly marked until approved by the owner/legal reviewer. */
export function PolicyPage({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero title={title}>
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path }]} />
      </PageHero>
      <Section className="max-w-3xl">
        <p role="note" className="mb-8 rounded-xl border border-clay/40 bg-paper p-4 text-sm">
          <strong>Draft for owner and legal review.</strong> This page is hidden from search engines and must be checked
          against current Indian requirements before launch.
        </p>
        <div className="space-y-4 text-ink-soft [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-6">{children}</div>
      </Section>
    </>
  );
}
