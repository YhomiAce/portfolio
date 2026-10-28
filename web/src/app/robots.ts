import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

/** robots.txt: everything is public except the API routes. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
