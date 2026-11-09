import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-clay">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold">We could not find that page</h1>
      <p className="mt-4 text-ink-soft">The link may be old or mistyped. Try one of these instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-dark">Home</Link>
        <Link href="/shop" className="btn btn-ghost">Shop</Link>
        <Link href="/wholesale/inquiry" className="btn btn-primary">Wholesale inquiry</Link>
      </div>
    </section>
  );
}
