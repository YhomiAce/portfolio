# portfolio-web

The public portfolio site: Next.js 16 (App Router, Cache Components), TypeScript and Tailwind CSS 4. The repository [README](../README.md) gives the overview.

## Features

- **Home** (`/`): hero, about, experience timeline, skills, featured projects, writing (only when posts exist) and contact.
- **Detail pages:** `/projects/[slug]` and `/writing/[slug]`. Unknown slugs return a real 404.
- **Contact form:** a server action with zod validation and a honeypot field stores the message via Strapi's `POST /api/messages`, then shows a success state.
- **Data:** fetched from Strapi's REST API inside a `'use cache'` function. Results are tagged and live for 300 s (ISR), and `POST /api/revalidate?secret=` expires them on demand.
- **Fallback:** if `STRAPI_URL` is unset or Strapi is unreachable (5 s timeout), the site uses `src/content/portfolio.json`, a copy of the CMS seed, and logs `[content] … using bundled fallback content`. Builds never fail because of Strapi.
- **SEO:** metadata, a generated Open Graph image (`app/opengraph-image.tsx`), `sitemap.xml`, `robots.txt` and Person JSON-LD.
- **Theming:** dark mode (it follows the system and can be toggled and remembered), and motion that is disabled under `prefers-reduced-motion`.
- `GET /api/health` returns `200 {"status":"ok","strapi":"up|down|not-configured"}`.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev            # http://localhost:5101
npm test               # unit tests
npm run lint && npm run typecheck
npm run sync:content   # copy ../cms/src/seed/portfolio.json into src/content/
```

## Environment variables

| Name | Required | Example | When |
| --- | --- | --- | --- |
| `STRAPI_URL` | recommended | `https://cms.example.com` | build **and** runtime |
| `NEXT_PUBLIC_SITE_URL` | recommended | `https://example.com` | **build** (inlined into canonical URLs, OG and the sitemap) |
| `REVALIDATE_SECRET` | for on-demand ISR | 8+ characters, same as the CMS | runtime |
| `STRAPI_API_TOKEN` | no | read-only Strapi API token | runtime |
| `PORT` | no | `3000` (default) | runtime |

## Deploying

| Step | Command |
| --- | --- |
| Install | `npm ci` |
| Build | `npm run build` (`next build`) |
| Start | `npm start` (`next start -H 0.0.0.0`) |
| Port | `PORT` (default 3000) |

- **Build-time:** `NEXT_PUBLIC_SITE_URL` and `STRAPI_URL`. Without `STRAPI_URL`, the prerendered pages use the bundled content until the first revalidation.
- **Runtime:** `STRAPI_URL`, `REVALIDATE_SECRET`, `STRAPI_API_TOKEN`.
- The ISR cache is written to `.next/` inside the app directory at runtime, so the process needs write access there.
- No standalone output and no Dockerfile: a plain `next start`.
