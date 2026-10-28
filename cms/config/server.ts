import type { Core } from '@strapi/strapi';

/**
 * HTTP server. `PUBLIC_URL` is the public URL of this Strapi instance (used for the
 * admin panel and absolute media URLs); behind a reverse proxy, `proxy` makes Koa trust
 * `X-Forwarded-*` headers so secure cookies work over HTTPS.
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  proxy: { koa: env.bool('TRUST_PROXY', true) },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
