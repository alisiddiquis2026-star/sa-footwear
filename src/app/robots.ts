import type { MetadataRoute } from "next";
import { siteIsLive } from "@/config/business";
import { abs } from "@/lib/seo";

/** Blocks everything until SITE_LIVE=true so a preview never gets indexed by accident. */
export default function robots(): MetadataRoute.Robots {
  if (!siteIsLive) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/shop?*"] },
    sitemap: abs("/sitemap.xml"),
  };
}
