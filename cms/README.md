# portfolio-cms

Strapi 5 (TypeScript, Postgres) CMS for the portfolio. The repository [README](../README.md) gives the overview.

## What it does

- **Content types:**
  - single type `profile`
  - collections `experience`, `skill-group`, `project`, `post` (with draft and publish) and `message`
  - components in `shared.*`: link, stat, education, bullet
- **Seed:** on first start, `src/index.ts` seeds everything from `src/seed/portfolio.json`. The seed is validated with zod and runs once: a flag in Strapi's core store stops it from running again, so content you delete stays deleted. It also only fills content types that are empty.
- **Public permissions** are set on every start:
  - `find`/`findOne` on profile, experience, skill-group, project and post
  - `create` on message
  - Any other `api::` permission on the Public role is removed, so contact messages can never be made public by accident.
- **Revalidation:** after any create, update, delete, publish or unpublish of public content, a document-service middleware calls `WEB_REVALIDATE_URL?secret=REVALIDATE_SECRET` (debounced to 1.5 s). If either variable is unset, this is off.
- **Health:**
  - `GET /_health` returns `204` (built in, no DB check).
  - `GET /api/health` returns `200 {"status":"ok","database":"up"}`, or `503` if the database is down.

## Local development

```bash
cp .env.example .env     # fill secrets with: openssl rand -base64 32
npm install
npm run develop          # http://localhost:5121/admin
npm test                 # unit tests, no DB needed
```

Any Postgres 14+ database works; set its URL as `DATABASE_URL` in `.env`.

### First run: creating the admin user

1. Start Strapi and open `http://localhost:5121/admin` (in production: `PUBLIC_URL/admin`).
2. Strapi shows a "Welcome" registration form. Enter your name, email and a password (8+ characters, with upper and lower case and a number). This first account becomes the **Super Admin**.
3. The content is already seeded. Edit it under **Content Manager**, and read contact messages under **Content Manager → Message**.
4. Optional: create a read-only API token (**Settings → API Tokens**) and set it as `STRAPI_API_TOKEN` on the web app.

From a shell you can also run `npx strapi admin:create-user --email=… --password=… --firstname=…`.

To upload a photo, open **Content Manager → Profile** and set **avatar**. The site shows it in place of the initials monogram. You can attach a PDF résumé the same way, under **resume**.

## Environment variables

| Name | Required | Example | When |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | `postgresql://user:pass@host:5432/portfolio` | runtime |
| `DATABASE_SSL` | no | `true` (default `false`) | runtime |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | no | `true` (default `false`) | runtime |
| `HOST` | no | `0.0.0.0` (default) | runtime |
| `PORT` | no | `1337` (default) | runtime |
| `PUBLIC_URL` | recommended | `https://cms.example.com` | runtime |
| `APP_KEYS` | yes | `key1,key2` | runtime |
| `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` | yes | `openssl rand -base64 32` | runtime |
| `WEB_REVALIDATE_URL` | no | `https://example.com/api/revalidate` | runtime |
| `REVALIDATE_SECRET` | no | same value as on the web app | runtime |
| `UPLOAD_SIZE_LIMIT` | no | `10485760` (bytes, the default) | runtime |
| `TRUST_PROXY` | no | `true` (default) | runtime |

## Deploying

| Step | Command |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` (`strapi build`: TypeScript and the admin panel) |
| Start | `npm start` (`strapi start`, which applies schema migrations on start) |
| Port | `PORT`, default 1337, on `HOST` (`0.0.0.0`) |

- Build time needs no env vars. Everything listed above is runtime.
- **Memory:** `strapi build` (the Vite admin bundle) peaked at about 1.9 GB RSS (2.4 GB container) on `node:22-alpine`, and it runs out of heap with `--max-old-space-size=1024`. Use a builder with at least 3 GB. At runtime it uses about 270 MB.
- **Native modules:** none compile. `sharp` uses its prebuilt `linuxmusl` binary, and there is no `better-sqlite3` (Postgres only).
- **Uploads:** the local provider writes to `public/uploads`. Files are **lost on redeploy** unless that directory is a persistent volume, or you configure an S3 upload provider. The process must be able to write to `public/uploads` inside the app directory.
- Behind a TLS-terminating proxy, set `PUBLIC_URL` to the https URL. `TRUST_PROXY` defaults to `true`, so secure admin cookies work.
