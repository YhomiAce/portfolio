import type { Core, UID } from '@strapi/strapi';

/** Content types whose changes should refresh the public site. */
export const WATCHED_UIDS: ReadonlySet<string> = new Set([
  'api::profile.profile',
  'api::experience.experience',
  'api::skill-group.skill-group',
  'api::project.project',
  'api::post.post',
]);

const WRITE_ACTIONS: ReadonlySet<string> = new Set([
  'create',
  'update',
  'delete',
  'publish',
  'unpublish',
  'discardDraft',
]);

const DEBOUNCE_MS = 1500;

/** Settings for calling the web app's `POST /api/revalidate?secret=` endpoint. */
export interface RevalidateConfig {
  url: string;
  secret: string;
}

/**
 * Reads `WEB_REVALIDATE_URL` and `REVALIDATE_SECRET`. Returns `null` (feature off) unless
 * both are set and the URL is valid.
 */
export function readRevalidateConfig(env: NodeJS.ProcessEnv): RevalidateConfig | null {
  const url = env.WEB_REVALIDATE_URL?.trim();
  const secret = env.REVALIDATE_SECRET?.trim();
  if (!url || !secret) return null;
  try {
    new URL(url);
  } catch {
    return null;
  }
  return { url, secret };
}

/** Builds the request URL, adding the secret as the `secret` query parameter. */
export function buildRevalidateUrl(config: RevalidateConfig): string {
  const url = new URL(config.url);
  url.searchParams.set('secret', config.secret);
  return url.toString();
}

/** Whether a document-service call should trigger revalidation. */
export function shouldRevalidate(uid: string, action: string): boolean {
  return WATCHED_UIDS.has(uid) && WRITE_ACTIONS.has(action);
}

/**
 * Registers a document-service middleware that, after content changes, calls the web
 * app's revalidate endpoint (debounced, so a bulk edit sends one request). Failures are
 * logged and never block the content change.
 *
 * @param isPaused - Returns true while changes should be ignored (e.g. during seeding).
 */
export function registerRevalidation(strapi: Core.Strapi, isPaused: () => boolean): void {
  const config = readRevalidateConfig(process.env);
  if (!config) {
    strapi.log.info('[revalidate] WEB_REVALIDATE_URL or REVALIDATE_SECRET not set; web revalidation is off');
    return;
  }

  let timer: NodeJS.Timeout | undefined;
  const models = new Set<string>();

  const flush = async (): Promise<void> => {
    const changed = [...models];
    models.clear();
    try {
      const response = await fetch(buildRevalidateUrl(config), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ models: changed }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        strapi.log.warn(`[revalidate] web app answered ${response.status}`);
      } else {
        strapi.log.info(`[revalidate] web app revalidated (${changed.join(', ')})`);
      }
    } catch (error) {
      strapi.log.warn(`[revalidate] could not reach web app: ${(error as Error).message}`);
    }
  };

  strapi.documents.use(async (context, next) => {
    const result = await next();
    if (!isPaused() && shouldRevalidate(context.uid as UID.ContentType, context.action)) {
      models.add(context.uid);
      clearTimeout(timer);
      timer = setTimeout(() => void flush(), DEBOUNCE_MS);
    }
    return result;
  });
}
