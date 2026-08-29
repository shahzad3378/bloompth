import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/seller/"] }, sitemap: "https://www.fulfillmena.com/sitemap.xml" };
}
