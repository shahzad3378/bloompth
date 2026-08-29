import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fulfillmena.com";
  const routes = ["", "/dropshipping-uae", "/products", "/about", "/contact", "/become-seller", "/blog"];
  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const), priority: route === "" ? 1 : route === "/dropshipping-uae" ? 0.9 : 0.7 })),
    ...blogPosts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.publishedAt), changeFrequency: "monthly" as const, priority: 0.65 })),
  ];
}
