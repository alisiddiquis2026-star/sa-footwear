"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

export type Slide = { href: string; title: string; caption: string; src: string; alt: string; width: number; height: number };

const RM = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(RM); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(RM).matches,
    () => true,
  );
}

/**
 * Image slideshow for the home hero (right side). Auto-advance pauses on hover/focus,
 * has a Pause button, and never auto-plays for visitors who prefer reduced motion.
 * The four thumbnails are the slide controls. Without JavaScript the first slide shows.
 */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, reduced, slides.length]);

  return (
    <div
      role="group" aria-roledescription="carousel" aria-label="Featured Woccy models"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="mx-auto w-full max-w-md"
    >
      <div className="relative aspect-[5/6] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl">
        {slides.map((s, n) => (
          <Link
            key={s.src} href={s.href} role="group" aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}: ${s.title}`}
            aria-hidden={n !== i} tabIndex={n === i ? 0 : -1}
            className={`absolute inset-0 block transition-opacity duration-700 motion-reduce:transition-none ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image src={s.src} alt={s.alt} width={s.width} height={s.height} priority={n === 0} sizes="(min-width:1024px) 28rem, 90vw" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16 text-white">
              <span className="block font-display text-xl font-bold">{s.title}</span>
              <span className="text-sm text-white/85">{s.caption}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {slides.map((s, n) => (
            <button key={s.src} type="button" onClick={() => setI(n)} aria-label={`Show ${s.title}`} aria-current={n === i}
              className={`size-14 overflow-hidden rounded-xl border-2 bg-white transition ${n === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <Image src={s.src} alt="" width={112} height={134} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        {!reduced && (
          <button type="button" onClick={() => setPaused((p) => !p)} className="min-h-11 rounded-full border border-sand/30 px-4 text-sm text-sand/90 hover:border-sand">
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
