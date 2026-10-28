import { z } from 'zod';

/** JSON `null` means "not set"; Strapi inputs want `undefined` for that. */
const nullish = <T extends z.ZodType>(schema: T) =>
  schema.nullish().transform((value) => value ?? undefined);

const link = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  kind: z.enum(['github', 'linkedin', 'email', 'website', 'other']),
});

/** Shape of `src/seed/portfolio.json`, the content merged from the CVs. */
export const seedSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    headline: z.string().min(1),
    summary: z.array(z.string()),
    location: z.string(),
    email: z.email(),
    availableForWork: z.boolean(),
    links: z.array(link),
    highlights: z.array(z.object({ value: z.string(), label: z.string() })),
    education: z.array(
      z.object({
        qualification: z.string(),
        institution: z.string(),
        startYear: nullish(z.number().int()),
        endYear: nullish(z.number().int()),
      }),
    ),
  }),
  experiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string(),
      startDate: z.iso.date(),
      endDate: nullish(z.iso.date()),
      current: z.boolean(),
      order: z.number().int(),
      bullets: z.array(z.string()),
      tech: z.array(z.string()),
    }),
  ),
  skillGroups: z.array(z.object({ name: z.string(), order: z.number().int(), skills: z.array(z.string()) })),
  projects: z.array(
    z.object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      category: z.enum(['product', 'infrastructure']),
      role: nullish(z.string()),
      summary: z.string(),
      description: z.array(z.string()),
      tech: z.array(z.string()),
      repoUrl: nullish(z.url()),
      liveUrl: nullish(z.url()),
      featured: z.boolean(),
      order: z.number().int(),
    }),
  ),
  posts: z.array(
    z.object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      excerpt: z.string(),
      body: z.array(z.string()),
      publishedDate: z.iso.date(),
    }),
  ),
});

/** Parsed seed content. */
export type SeedContent = z.infer<typeof seedSchema>;
