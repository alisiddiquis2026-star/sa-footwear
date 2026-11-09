import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { business, siteIsLive } from "@/config/business";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileContactBar } from "@/components/MobileContactBar";
import { JsonLd } from "@/components/ui";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const body = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} | Multi-brand footwear, retail and wholesale`,
    template: `%s | ${business.name}`,
  },
  description:
    "Multi-brand footwear for shoppers and wholesale buyers across Telangana, Andhra Pradesh, Tamil Nadu and Karnataka, with Woccy footwear among the brands listed.",
  robots: siteIsLive ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1019",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col pb-20 lg:pb-0">
        <a href="#main" className="skip-link">Skip to main content</a>
        {!siteIsLive && (
          <p className="bg-clay px-4 py-2 text-center text-sm font-medium text-white">
            Preview build. Business details and products are placeholders until confirmed.
          </p>
        )}
        <SiteHeader name={business.name} />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
        <MobileContactBar />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
      </body>
    </html>
  );
}
