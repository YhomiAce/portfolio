import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/content";
import { siteUrl } from "@/lib/env";

/** sitemap.xml: home, every project and every post. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const { projects, posts } = await getPortfolio();
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.5,
    })),
    ...posts.map((post) => ({
      url: `${base}/writing/${post.slug}`,
      lastModified: post.publishedDate,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
