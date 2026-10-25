import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { publishedServices } from "@/content/services";
import { locations } from "@/content/locations";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/hosting", priority: 0.9, changeFrequency: "monthly" },
    { path: "/get-a-quote", priority: 0.8, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/portfolio", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p.path), changeFrequency: p.changeFrequency, priority: p.priority })),
    ...publishedServices.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...locations.map((l) => ({
      url: absoluteUrl(`/locations/${l.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllPosts().map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
