import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const webCopy = fileURLToPath(new URL("../src/content/portfolio.json", import.meta.url));
const cmsSeed = fileURLToPath(new URL("../../cms/src/seed/portfolio.json", import.meta.url));

describe("bundled content", () => {
  // Only meaningful in the monorepo checkout; Selfship builds web/ on its own.
  it.skipIf(!existsSync(cmsSeed))("matches the CMS seed file (run `npm run sync:content`)", () => {
    expect(readFileSync(webCopy, "utf8")).toBe(readFileSync(cmsSeed, "utf8"));
  });
});
