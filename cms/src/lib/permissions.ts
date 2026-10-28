import type { Core } from '@strapi/strapi';

/**
 * The only content-API actions the Public role may perform. Everything else under
 * `api::` is removed from the Public role on every start, so contact messages can
 * never be made publicly readable by accident.
 */
export const PUBLIC_ACTIONS: readonly string[] = [
  'api::profile.profile.find',
  'api::experience.experience.find',
  'api::experience.experience.findOne',
  'api::skill-group.skill-group.find',
  'api::skill-group.skill-group.findOne',
  'api::project.project.find',
  'api::project.project.findOne',
  'api::post.post.find',
  'api::post.post.findOne',
  'api::message.message.create',
];

interface PermissionRow {
  id: number;
  action: string;
}

/**
 * Makes the users-permissions Public role match {@link PUBLIC_ACTIONS} exactly for this
 * app's APIs (plugin permissions such as auth routes are left alone). Idempotent.
 */
export async function syncPublicPermissions(strapi: Core.Strapi): Promise<void> {
  const role = (await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } })) as { id: number } | null;
  if (!role) {
    strapi.log.warn('[permissions] Public role not found; skipping permission sync');
    return;
  }

  const permissions = strapi.db.query('plugin::users-permissions.permission');
  const existing = (await permissions.findMany({
    where: { role: role.id, action: { $startsWith: 'api::' } },
  })) as PermissionRow[];

  const allowed = new Set(PUBLIC_ACTIONS);
  const stale = existing.filter((permission) => !allowed.has(permission.action));
  if (stale.length > 0) {
    await permissions.deleteMany({ where: { id: { $in: stale.map((permission) => permission.id) } } });
  }

  const present = new Set(existing.map((permission) => permission.action));
  for (const action of PUBLIC_ACTIONS) {
    if (!present.has(action)) {
      await permissions.create({ data: { action, role: role.id } });
    }
  }
}
