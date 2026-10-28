import { cacheLife, cacheTag } from "next/cache";
import { serverEnv, strapiUrl } from "@/lib/env";
import { fallbackPortfolio } from "./fallback";
import { fetchPortfolioFromStrapi } from "./strapi";
import type { Portfolio, Post, Project } from "./types";

/** Cache tag for everything that comes from Strapi; `/api/revalidate` expires it. */
export const CONTENT_TAG = "strapi-content";

/**
 * Returns the portfolio, preferring Strapi and falling back to bundled content.
 *
 * Cached with ISR semantics: refreshed in the background about every 5 minutes, or
 * immediately when Strapi calls `/api/revalidate`. A fallback result is cached for the
 * same window, so a Strapi outage costs at most one failed request per window.
 */
export async function getPortfolio(): Promise<Portfolio> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife({ stale: 300, revalidate: 300, expire: 60 * 60 * 24 * 7 });

  const baseUrl = strapiUrl();
  if (!baseUrl) {
    console.warn("[content] STRAPI_URL is not set; using bundled fallback content");
    return fallbackPortfolio();
  }
  try {
    return await fetchPortfolioFromStrapi({ baseUrl, token: serverEnv().STRAPI_API_TOKEN });
  } catch (error) {
    console.warn(`[content] Strapi unavailable (${(error as Error).message}); using bundled fallback content`);
    return fallbackPortfolio();
  }
}

/** Finds a project by slug, or undefined. */
export async function getProject(slug: string): Promise<Project | undefined> {
  const { projects } = await getPortfolio();
  return projects.find((project) => project.slug === slug);
}

/** Finds a published post by slug, or undefined. */
export async function getPost(slug: string): Promise<Post | undefined> {
  const { posts } = await getPortfolio();
  return posts.find((post) => post.slug === slug);
}

export type { Portfolio, Post, Project } from "./types";
