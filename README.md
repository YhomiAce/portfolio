# Lateef Yomi Kareem: portfolio

Personal portfolio of **Lateef (Yomi) Kareem**, senior backend engineer. One repository, two independent apps:

| App                | What                                                                                      | Stack                                        | Dev port |
| ------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------- | -------- |
| [`cms/`](cms/)     | Headless CMS that holds the content: profile, experience, skills, projects, writing, contact messages | Strapi 5, TypeScript, Postgres               | 5121     |
| [`web/`](web/)     | The public site                                                                           | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 | 5101     |

There is no root workspace. Each folder has its own `package.json` and `package-lock.json` (npm) and is built and deployed on its own, with a root directory of `cms` or `web`.

![Home page, desktop](docs/screenshots/home-desktop.png)

## Features

- **Single-page home:** hero with highlights, about, experience timeline, skills, featured projects, writing (only shown once a post is published) and contact.
- **Project pages** (`/projects/[slug]`) and **post pages** (`/writing/[slug]`).
- **Contact form:** a server action validates input with zod, drops honeypot submissions and stores the message in Strapi. Messages are **not** publicly readable.
- **Content managed in Strapi**, seeded on first start from [`cms/src/seed/portfolio.json`](cms/src/seed/portfolio.json), which was merged from the CVs.
- **ISR:** pages are static and refresh about every 5 minutes. Strapi also calls the site's `POST /api/revalidate?secret=` after every content change, so edits show up right away.
- **Resilient:** if Strapi is down or not configured, the site builds and serves the same content from a bundled copy of the seed file, and logs a warning.
- SEO metadata, a generated Open Graph image (`next/og`), `sitemap.xml`, `robots.txt` and JSON-LD.
- Dark mode, subtle motion that respects `prefers-reduced-motion`, semantic and accessible markup, and a mobile-first layout.

## How the pieces fit

```
             REST (ISR, ~300 s)                        POST /api/messages (contact form)
  web  ─────────────────────────────▶  cms  ◀──────────────────────────────────────────── web
  ▲                                     │
  └──── POST /api/revalidate?secret= ───┘   (after content changes)
```

The content lives in one JSON file, kept in two copies so that each app stays self-contained:

- `cms/src/seed/portfolio.json` is seeded into Strapi on first start.
- `web/src/content/portfolio.json` is the web app's fallback.

After editing the seed, run `npm run sync:content` in `web/`. A web test fails if the two copies drift.

## Local development

Prerequisites: Node 22 and a Postgres database.

```bash
# 1. CMS
cd cms
cp .env.example .env          # then fill the secrets: openssl rand -base64 32
npm install
npm run develop               # http://localhost:5121/admin (create the first admin user)

# 2. Web (in another terminal)
cd web
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:5101
```

Tests: `npm test` in each folder (no external services needed).

## Environment variables

### `cms/`

| Name | Required | Example | When |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | `postgresql://user:pass@host:5432/portfolio` | runtime |
| `DATABASE_SSL` | no | `true` (default `false`) | runtime |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | no | `true` (default `false`) | runtime |
| `HOST` | no | `0.0.0.0` (default) | runtime |
| `PORT` | no | `1337` (default) | runtime |
| `PUBLIC_URL` | recommended | `https://cms.example.com` | runtime |
| `APP_KEYS` | yes | `key1,key2` (comma-separated) | runtime |
| `API_TOKEN_SALT` | yes | output of `openssl rand -base64 32` | runtime |
| `ADMIN_JWT_SECRET` | yes | output of `openssl rand -base64 32` | runtime |
| `TRANSFER_TOKEN_SALT` | yes | output of `openssl rand -base64 32` | runtime |
| `JWT_SECRET` | yes | output of `openssl rand -base64 32` | runtime |
| `ENCRYPTION_KEY` | yes | output of `openssl rand -base64 32` | runtime |
| `WEB_REVALIDATE_URL` | no | `https://example.com/api/revalidate` | runtime |
| `REVALIDATE_SECRET` | no (needed with the above) | a long random string | runtime |

### `web/`

| Name | Required | Example | When |
| --- | --- | --- | --- |
| `STRAPI_URL` | recommended | `https://cms.example.com` | build **and** runtime |
| `NEXT_PUBLIC_SITE_URL` | recommended | `https://example.com` | **build** (inlined) |
| `REVALIDATE_SECRET` | for on-demand ISR | same value as the CMS | runtime |
| `STRAPI_API_TOKEN` | no | a read-only Strapi API token | runtime |
| `PORT` | no | `3000` (default) | runtime |

## Deploying

The apps are deployed as two projects from this one repository.

### CMS (root directory `cms`)

- Install: `npm ci`
- Build: `npm run build` (`strapi build`: compiles TypeScript and builds the admin panel)
- Start: `npm start` (`strapi start`). Database migrations run automatically on start, then the seed runs once.
- Port: `PORT` (default 1337), on `0.0.0.0`.
- Health: `GET /_health` returns `204` (Strapi built-in, no DB check). `GET /api/health` returns `200` after a DB round-trip, or `503`.
- Env: all runtime (see the table). Nothing is needed at build time.
- Generate secrets with `openssl rand -base64 32`. `APP_KEYS` takes two or more of them, comma-separated.
- **Uploads** use the local provider and are written to `public/uploads`. They are **lost on every redeploy** unless that folder is a persistent volume, or you switch to an S3 upload provider.
- **Build memory:** `strapi build` peaked at about 1.9 GB RSS (2.4 GB for the whole container) on `node:22-alpine`, and it runs out of heap with `--max-old-space-size=1024`. Give the builder at least 3 GB. At runtime it uses about 270 MB.
- First run: open `PUBLIC_URL/admin` and register the first administrator. Until then, the admin panel is open to whoever gets there first, so do it straight after the first deploy.

### Web (root directory `web`)

- Install: `npm ci`
- Build: `npm run build` (`next build`). It works without Strapi, using the bundled content.
- Start: `npm start` (`next start -H 0.0.0.0`, which reads `PORT`).
- Port: `PORT` (default 3000).
- Health: `GET /api/health` always returns `200` and reports whether Strapi is reachable.
- Build-time env: `NEXT_PUBLIC_SITE_URL`, plus `STRAPI_URL` so the prerendered pages hold live content. Runtime env: `STRAPI_URL`, `REVALIDATE_SECRET`, `STRAPI_API_TOKEN`.
- Point the CMS's `WEB_REVALIDATE_URL` at `https://<site>/api/revalidate` and use the same `REVALIDATE_SECRET` on both apps.

## Repository layout

```
cms/   Strapi 5 app (content types in src/api, seed in src/seed, bootstrap in src/index.ts)
web/   Next.js 16 app (pages in src/app, content layer in src/lib/content)
docs/  screenshots
```
