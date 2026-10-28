import { z } from "zod";
import { parseRichText } from "./rich-text";
import type { Experience, Media, Portfolio, Post, Profile, Project, SkillGroup } from "./types";

const REQUEST_TIMEOUT_MS = 5000;

const stringList = z
  .unknown()
  .transform((value) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []));

const media = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullish(),
    width: z.number().nullish(),
    height: z.number().nullish(),
  })
  .nullish();

const profileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  summary: z.unknown(),
  location: z.string().nullish(),
  email: z.string(),
  availableForWork: z.boolean().nullish(),
  links: z
    .array(z.object({ label: z.string(), url: z.string(), kind: z.enum(["github", "linkedin", "email", "website", "other"]).nullish() }))
    .nullish(),
  highlights: z.array(z.object({ value: z.string(), label: z.string() })).nullish(),
  education: z
    .array(
      z.object({
        qualification: z.string(),
        institution: z.string(),
        startYear: z.number().nullish(),
        endYear: z.number().nullish(),
      }),
    )
    .nullish(),
  resume: media,
  avatar: media,
});

const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().nullish(),
  startDate: z.string(),
  endDate: z.string().nullish(),
  current: z.boolean().nullish(),
  bullets: z.array(z.object({ text: z.string() })).nullish(),
  tech: stringList,
  order: z.number().nullish(),
});

const skillGroupSchema = z.object({ name: z.string(), skills: stringList, order: z.number().nullish() });

const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.enum(["product", "infrastructure"]).nullish(),
  role: z.string().nullish(),
  summary: z.string(),
  description: z.unknown(),
  tech: stringList,
  repoUrl: z.string().nullish(),
  liveUrl: z.string().nullish(),
  featured: z.boolean().nullish(),
  order: z.number().nullish(),
  cover: media,
});

const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullish(),
  body: z.unknown(),
  publishedDate: z.string().nullish(),
  publishedAt: z.string().nullish(),
});

const single = <T extends z.ZodType>(schema: T) => z.object({ data: schema });
const list = <T extends z.ZodType>(schema: T) => z.object({ data: z.array(schema) });

/** Thrown when Strapi can't be reached or answers with something unexpected. */
export class StrapiError extends Error {
  override name = "StrapiError";
}

/** Settings for talking to Strapi. */
export interface StrapiConfig {
  baseUrl: string;
  token?: string;
}

async function getJson<T extends z.ZodType>(config: StrapiConfig, path: string, schema: T): Promise<z.infer<T>> {
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}${path}`, {
      headers: config.token ? { Authorization: `Bearer ${config.token}` } : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new StrapiError(`GET ${path} failed: ${(error as Error).message}`);
  }
  if (!response.ok) {
    throw new StrapiError(`GET ${path} answered ${response.status}`);
  }
  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new StrapiError(`GET ${path} returned an unexpected shape: ${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}

const toMedia = (baseUrl: string, value: z.infer<typeof media>): Media | undefined =>
  value
    ? {
        url: value.url.startsWith("http") ? value.url : `${baseUrl}${value.url}`,
        alt: value.alternativeText ?? "",
        width: value.width ?? undefined,
        height: value.height ?? undefined,
      }
    : undefined;

const nonEmpty = (value: string | null | undefined): string | undefined => (value && value.trim() ? value : undefined);

/**
 * Loads the whole portfolio from Strapi's REST API in parallel.
 *
 * @throws {StrapiError} if any request fails, so the caller can fall back as a whole
 *   instead of rendering a half-Strapi, half-bundled page.
 */
export async function fetchPortfolioFromStrapi(config: StrapiConfig): Promise<Portfolio> {
  const all = "pagination[pageSize]=100&sort=order:asc";
  const [profileRes, experiencesRes, skillGroupsRes, projectsRes, postsRes] = await Promise.all([
    getJson(config, "/api/profile?populate=*", single(profileSchema)),
    getJson(config, `/api/experiences?populate=*&${all}`, list(experienceSchema)),
    getJson(config, `/api/skill-groups?${all}`, list(skillGroupSchema)),
    getJson(config, `/api/projects?populate=*&${all}`, list(projectSchema)),
    getJson(config, "/api/posts?pagination[pageSize]=100&sort=publishedDate:desc", list(postSchema)),
  ]);

  const p = profileRes.data;
  const profile: Profile = {
    name: p.name,
    headline: p.headline,
    summary: parseRichText(p.summary),
    location: p.location ?? "",
    email: p.email,
    availableForWork: p.availableForWork ?? false,
    links: (p.links ?? []).map((link) => ({ label: link.label, url: link.url, kind: link.kind ?? "other" })),
    highlights: p.highlights ?? [],
    education: (p.education ?? []).map((e) => ({
      qualification: e.qualification,
      institution: e.institution,
      startYear: e.startYear ?? undefined,
      endYear: e.endYear ?? undefined,
    })),
    resume: toMedia(config.baseUrl, p.resume),
    avatar: toMedia(config.baseUrl, p.avatar),
  };

  const experiences: Experience[] = experiencesRes.data.map((e) => ({
    company: e.company,
    role: e.role,
    location: nonEmpty(e.location),
    startDate: e.startDate,
    endDate: nonEmpty(e.endDate),
    current: e.current ?? false,
    bullets: (e.bullets ?? []).map((b) => b.text),
    tech: e.tech,
    order: e.order ?? 0,
  }));

  const skillGroups: SkillGroup[] = skillGroupsRes.data.map((g) => ({ name: g.name, skills: g.skills, order: g.order ?? 0 }));

  const projects: Project[] = projectsRes.data.map((pr) => ({
    title: pr.title,
    slug: pr.slug,
    category: pr.category ?? "product",
    role: nonEmpty(pr.role),
    summary: pr.summary,
    description: parseRichText(pr.description),
    tech: pr.tech,
    repoUrl: nonEmpty(pr.repoUrl),
    liveUrl: nonEmpty(pr.liveUrl),
    featured: pr.featured ?? false,
    order: pr.order ?? 0,
    cover: toMedia(config.baseUrl, pr.cover),
  }));

  const posts: Post[] = postsRes.data.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    body: parseRichText(post.body),
    publishedDate: nonEmpty(post.publishedDate) ?? nonEmpty(post.publishedAt?.slice(0, 10)),
  }));

  return { source: "strapi", profile, experiences, skillGroups, projects, posts };
}
