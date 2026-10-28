// Copies the CMS seed file into the web app, so the bundled fallback content matches
// what Strapi seeds. Run from web/: `npm run sync:content`. Each app stays
// self-contained: the web build never reads outside web/.
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../../cms/src/seed/portfolio.json', import.meta.url));
const target = fileURLToPath(new URL('../src/content/portfolio.json', import.meta.url));

if (!existsSync(source)) {
  console.error(`Seed file not found at ${source}`);
  process.exit(1);
}
copyFileSync(source, target);
console.log(`Copied ${source} -> ${target}`);
