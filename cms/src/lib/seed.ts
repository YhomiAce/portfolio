import type { Core } from '@strapi/strapi';
import rawSeed from '../seed/portfolio.json';
import { paragraphsToBlocks } from './blocks';
import { seedSchema, type SeedContent } from './seed-schema';

const STORE_KEY = 'seeded-at';

/** Parses and validates the committed seed file. Throws if it is malformed. */
export function loadSeed(): SeedContent {
  return seedSchema.parse(rawSeed);
}

function seedStore(strapi: Core.Strapi) {
  return strapi.store({ type: 'core', name: 'portfolio', key: STORE_KEY });
}

/**
 * Seeds the CV content on first start.
 *
 * Idempotent: once seeding has completed, a flag in Strapi's core store stops it from
 * running again (so content the owner deletes in the admin stays deleted). Each content
 * type is also only seeded while it is empty, so a crash half-way through is safe to retry.
 *
 * @returns `true` if anything was written.
 */
export async function seedContent(strapi: Core.Strapi): Promise<boolean> {
  const store = seedStore(strapi);
  if (await store.get({})) {
    return false;
  }

  const seed = loadSeed();
  let wrote = false;

  const profiles = strapi.documents('api::profile.profile');
  if (!(await profiles.findFirst())) {
    const { summary, ...profile } = seed.profile;
    await profiles.create({ data: { ...profile, summary: paragraphsToBlocks(summary) } });
    wrote = true;
  }

  const experiences = strapi.documents('api::experience.experience');
  if ((await experiences.count({})) === 0) {
    for (const { bullets, ...experience } of seed.experiences) {
      await experiences.create({
        data: { ...experience, bullets: bullets.map((text) => ({ text })) },
      });
    }
    wrote = true;
  }

  const skillGroups = strapi.documents('api::skill-group.skill-group');
  if ((await skillGroups.count({})) === 0) {
    for (const group of seed.skillGroups) {
      await skillGroups.create({ data: group });
    }
    wrote = true;
  }

  const projects = strapi.documents('api::project.project');
  if ((await projects.count({})) === 0) {
    for (const { description, ...project } of seed.projects) {
      await projects.create({ data: { ...project, description: paragraphsToBlocks(description) } });
    }
    wrote = true;
  }

  const posts = strapi.documents('api::post.post');
  if (seed.posts.length > 0 && (await posts.count({})) === 0) {
    for (const { body, ...post } of seed.posts) {
      await posts.create({ data: { ...post, body: paragraphsToBlocks(body) }, status: 'published' });
    }
    wrote = true;
  }

  await store.set({ value: new Date().toISOString() });
  return wrote;
}
