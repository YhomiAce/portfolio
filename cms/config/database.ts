import type { Core } from '@strapi/strapi';

/**
 * Postgres connection, read from `DATABASE_URL` (required at runtime, not at build time).
 *
 * Set `DATABASE_SSL=true` for managed databases that require TLS. Certificates are
 * not verified unless `DATABASE_SSL_REJECT_UNAUTHORIZED=true`, which matches how most
 * managed Postgres providers hand out self-signed certificates.
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database<'postgres'> => {
  // `strapi build` loads this file too, but never connects, so a missing URL must not
  // throw here. At `strapi start` an unset DATABASE_URL fails with a connection error.
  const connectionString = env('DATABASE_URL', 'postgresql://localhost:5432/portfolio');
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error('DATABASE_URL must be a Postgres URL, e.g. postgresql://user:pass@host:5432/portfolio');
  }

  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString,
        host: url.hostname,
        port: Number(url.port || 5432),
        database: decodeURIComponent(url.pathname.replace(/^\//, '')),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        ssl: env.bool('DATABASE_SSL', false)
          ? { rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false) }
          : false,
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 0), max: env.int('DATABASE_POOL_MAX', 10) },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

export default config;
