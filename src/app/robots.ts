import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { allowIndexing } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Non-production deployments (previews, staging, local) block all crawling.
  if (!allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/account/", "/hosting/order"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
