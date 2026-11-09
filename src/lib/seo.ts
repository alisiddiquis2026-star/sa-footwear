import type { Metadata } from "next";
import { business, siteIsLive } from "@/config/business";

type Opts = {
  title: string;
  description: string;
  path: string;
  /** Force noindex (drafts, thin pages, filtered views). */
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, noindex }: Opts): Metadata {
  const url = `${business.siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: business.name, locale: "en_IN", type: "website", images: [{ url: "/brand/sa-footwear-logo.webp", width: 1536, height: 1024, alt: `${business.name} logo` }] },
    twitter: { card: "summary", title, description },
    robots: !siteIsLive || noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function abs(path: string) {
  return `${business.siteUrl}${path}`;
}

export function organizationJsonLd() {
  const sameAs = Object.values(business.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    url: business.siteUrl,
    ...(business.email ? { email: business.email } : {}),
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** LocalBusiness only when a real, verified address exists. */
export function localBusinessJsonLd() {
  if (!business.address) return null;
  const a = business.address;
  return {
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    name: business.name,
    url: business.siteUrl,
    ...(business.phone ? { telephone: business.phone } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.postalCode,
      addressCountry: "IN",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
