import type { Context } from 'koa';

/** Health controller: answers 200 when the database responds, 503 otherwise. */
export default {
  async check(ctx: Context): Promise<void> {
    try {
      await strapi.db.connection.raw('select 1');
      ctx.status = 200;
      ctx.body = { status: 'ok', database: 'up' };
    } catch {
      ctx.status = 503;
      ctx.body = { status: 'error', database: 'down' };
    }
  },
};
