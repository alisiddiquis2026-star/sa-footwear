"use client";
import { useEffect, useRef } from "react";

/** Filters stay open on desktop (server-rendered open) and collapse on phones so products show first. */
export function FilterPanel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) ref.current?.removeAttribute("open");
  }, []);
  return (
    <details ref={ref} open className="group h-fit rounded-2xl border border-line bg-paper lg:[&>summary]:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 font-semibold lg:hidden">
        Filters &amp; search
        <span aria-hidden="true" className="text-xl text-clay transition-transform group-open:rotate-45">+</span>
      </summary>
      {children}
    </details>
  );
}
