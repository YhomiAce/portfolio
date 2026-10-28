import type { Core } from '@strapi/strapi';
import { syncPublicPermissions } from './lib/permissions';
import { registerRevalidation } from './lib/revalidate';
import { seedContent } from './lib/seed';

let seeding = false;

export default {
  /** Runs before the app is initialised: hooks web revalidation into the document service. */
  register({ strapi }: { strapi: Core.Strapi }): void {
    registerRevalidation(strapi, () => seeding);
  },

  /** Runs on every start: seeds CV content once and enforces Public role permissions. */
  async bootstrap({ strapi }: { strapi: Core.Strapi }): Promise<void> {
    seeding = true;
    try {
      if (await seedContent(strapi)) {
        strapi.log.info('[seed] Portfolio content seeded from src/seed/portfolio.json');
      }
    } finally {
      seeding = false;
    }
    await syncPublicPermissions(strapi);
  },
};
