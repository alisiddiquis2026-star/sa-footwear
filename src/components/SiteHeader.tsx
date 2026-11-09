"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu after navigating (adjust state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label={`${name} home`} className="flex items-center">
          <Image src="/brand/sa-footwear-header.webp" alt={name} width={1290} height={610} priority className="h-12 w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname.startsWith(n.href) ? "page" : undefined}
              className="py-2 text-sm font-medium underline-offset-8 hover:underline aria-[current=page]:text-gold-light aria-[current=page]:underline"
            >
              {n.label}
            </Link>
          ))}
          <Link href="/wholesale/inquiry" className="btn btn-primary !min-h-11 !px-5 text-sm">
            Wholesale quote
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-lg border border-white/25 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M4 4l14 14M18 4L4 18" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-white/10 bg-ink px-4 pb-5 lg:hidden"
      >
        <ul className="grid gap-1 pt-2">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="flex min-h-12 items-center rounded-lg px-3 text-lg font-medium hover:bg-white/10">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/wholesale/inquiry" className="btn btn-primary mt-3 w-full">
          Request wholesale quote
        </Link>
      </nav>
    </header>
  );
}
