import Link from "next/link";
import { business, telHref, hasWhatsapp, waHref } from "@/config/business";
import { serviceStates } from "@/data/states";

export function SiteFooter() {
  const tel = telHref();
  const wa = waHref("Hello, I would like wholesale footwear details.");
  return (
    <footer className="bg-ink text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">{business.name}</p>
          <p className="mt-3 text-sm text-sand/80">
            Multi-brand footwear for retailers and shoppers. Brand names belong to their respective owners and are
            used only to identify products.
          </p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link className="hover:underline" href="/shop">Shop</Link></li>
            <li><Link className="hover:underline" href="/brands">Brands</Link></li>
            <li><Link className="hover:underline" href="/wholesale">Wholesale</Link></li>
            <li><Link className="hover:underline" href="/become-a-dealer">Become a dealer</Link></li>
            <li><Link className="hover:underline" href="/faq">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Where we supply</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {serviceStates.map((s) => (
              <li key={s.slug}><Link className="hover:underline" href={`/service-areas/${s.slug}`}>{s.name}</Link></li>
            ))}
            <li><Link className="hover:underline" href="/service-areas">All India inquiries</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {tel && <li><a className="hover:underline" href={tel}>{business.phone}</a></li>}
            {hasWhatsapp && wa && <li><a className="hover:underline" href={wa} rel="noopener noreferrer" target="_blank">WhatsApp</a></li>}
            {business.email && <li><a className="hover:underline" href={`mailto:${business.email}`}>{business.email}</a></li>}
            <li><Link className="hover:underline" href="/contact">Contact page</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand/15">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-5 text-xs text-sand/70">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/shipping-and-returns" className="hover:underline">Shipping &amp; returns</Link>
            <Link href="/accessibility" className="hover:underline">Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
