import Link from "next/link";
import { business, hasPhone, hasWhatsapp, telHref, waHref, INQUIRY_PATH } from "@/config/business";

export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Escape "<" so data can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap gap-x-2">
        {items.map((it, i) => (
          <li key={it.path} className="flex gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-ink">{it.name}</span>
            ) : (
              <Link href={it.path} className="underline-offset-4 hover:underline">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Contact buttons that only show channels the owner has confirmed. */
export function ContactCtas({ message, className = "" }: { message: string; className?: string }) {
  const wa = waHref(message);
  const tel = telHref();
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link href={INQUIRY_PATH} className="btn btn-primary">Request wholesale quote</Link>
      {wa && (
        <a href={wa} className="btn btn-wa" target="_blank" rel="noopener noreferrer" data-evt="whatsapp_click">
          WhatsApp us
        </a>
      )}
      {tel && (
        <a href={tel} className="btn btn-ghost" data-evt="call_click">
          Call {business.phone}
        </a>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {children && <div className="mb-6">{children}</div>}
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-clay">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{lead}</p>}
      </div>
    </section>
  );
}

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-6xl px-4 py-12 sm:py-16 ${className}`}>{children}</section>;
}

export function Faqs({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-paper">
      {items.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {f.q}
            <span aria-hidden="true" className="text-xl text-clay transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export const hasAnyDirectChannel = hasPhone || hasWhatsapp;
