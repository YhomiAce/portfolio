import seed from "@/content/portfolio.json";
import { paragraphsToRichText } from "./rich-text";
import type { LinkKind, Portfolio, ProjectCategory } from "./types";

const orUndefined = (value: string | null | undefined): string | undefined => value ?? undefined;

/**
 * The bundled portfolio, generated from the same seed JSON Strapi uses. Served when
 * Strapi is not configured or unreachable, so builds and pages never fail.
 */
export function fallbackPortfolio(): Portfolio {
  const { profile } = seed;
  return {
    source: "fallback",
    profile: {
      name: profile.name,
      headline: profile.headline,
      summary: paragraphsToRichText(profile.summary),
      location: profile.location,
      email: profile.email,
      availableForWork: profile.availableForWork,
      links: profile.links.map((link) => ({ ...link, kind: link.kind as LinkKind })),
      highlights: profile.highlights,
      education: profile.education,
    },
    experiences: seed.experiences.map((experience) => ({
      ...experience,
      endDate: orUndefined(experience.endDate),
    })),
    skillGroups: seed.skillGroups,
    projects: seed.projects.map((project) => ({
      ...project,
      category: project.category as ProjectCategory,
      description: paragraphsToRichText(project.description),
      repoUrl: orUndefined(project.repoUrl),
      liveUrl: orUndefined(project.liveUrl),
    })),
    posts: [],
  };
}
