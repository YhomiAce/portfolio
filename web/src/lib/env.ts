import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const serverEnvSchema = z.object({
  STRAPI_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  STRAPI_API_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  REVALIDATE_SECRET: z.preprocess(emptyToUndefined, z.string().min(8).optional()),
});

/** Validated server-side environment. */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Reads and validates server env vars. Invalid values are treated as unset (with a
 * warning) so a typo never takes the site down; the bundled content is used instead.
 */
export function serverEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (parsed.success) return parsed.data;
  console.warn(`[env] ignoring invalid environment: ${z.prettifyError(parsed.error)}`);
  return {};
}

/** Strapi's base URL without a trailing slash, or undefined when not configured. */
export function strapiUrl(): string | undefined {
  return serverEnv().STRAPI_URL?.replace(/\/+$/, "");
}

/**
 * Public site URL, used for canonical URLs, Open Graph and the sitemap. Inlined at
 * build time (`NEXT_PUBLIC_`), so set it before `next build`.
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  const parsed = z.url().safeParse(raw);
  return (parsed.success ? parsed.data : "http://localhost:5101").replace(/\/+$/, "");
}
