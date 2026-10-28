import { afterEach, describe, expect, it, vi } from "vitest";
import { fallbackPortfolio } from "@/lib/content/fallback";
import { parseRichText, richTextToPlain } from "@/lib/content/rich-text";
import { fetchPortfolioFromStrapi, StrapiError } from "@/lib/content/strapi";

describe("fallbackPortfolio", () => {
  const portfolio = fallbackPortfolio();

  it("contains the six roles from the CVs, newest first", () => {
    expect(portfolio.source).toBe("fallback");
    expect(portfolio.experiences.map((e) => e.company)).toEqual([
      "Moniepoint Microfinance Bank",
      "MISPay",
      "Artisan Technology",
      "CobbleWeb",
      "Scelloo",
      "Novaji Introserve",
    ]);
  });

  it("has unique project slugs and featured projects for the home page", () => {
    const slugs = portfolio.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(portfolio.projects.some((p) => p.featured)).toBe(true);
  });

  it("never contains a phone number or street address", () => {
    const text = JSON.stringify(portfolio);
    expect(text).not.toMatch(/\+?234\d{6,}/);
    expect(text).not.toMatch(/\b(street|close|crescent|avenue)\b/i);
    expect(portfolio.profile.email).toBe("kareemyomi91@gmail.com");
  });
});

describe("parseRichText", () => {
  it("keeps valid blocks and drops unknown ones", () => {
    const value = parseRichText([
      { type: "paragraph", children: [{ type: "text", text: "Hello " }, { type: "link", url: "https://x.dev", children: [{ type: "text", text: "world" }] }] },
      { type: "mystery", children: [] },
      { type: "list", format: "unordered", children: [{ type: "list-item", children: [{ type: "text", text: "item" }] }] },
    ]);
    expect(value).toHaveLength(2);
    expect(richTextToPlain(value)).toBe("Hello world item");
  });

  it("returns an empty array for null", () => {
    expect(parseRichText(null)).toEqual([]);
  });
});

describe("fetchPortfolioFromStrapi", () => {
  afterEach(() => vi.unstubAllGlobals());

  const json = (data: unknown) => new Response(JSON.stringify({ data }), { headers: { "content-type": "application/json" } });

  it("normalises Strapi responses and prefixes relative media URLs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        if (input.includes("/api/profile")) {
          return json({
            name: "Lateef Yomi Kareem",
            headline: "Senior Backend Engineer",
            summary: [{ type: "paragraph", children: [{ type: "text", text: "Hi" }] }],
            location: "Lagos, Nigeria",
            email: "kareemyomi91@gmail.com",
            availableForWork: true,
            links: [],
            avatar: { url: "/uploads/me.jpg", alternativeText: null, width: 100, height: 100 },
          });
        }
        if (input.includes("/api/experiences")) {
          return json([{ company: "MISPay", role: "Dev", startDate: "2025-01-01", endDate: null, current: true, bullets: [{ text: "Built things" }], tech: ["Go", 3], order: 1 }]);
        }
        return json([]);
      }),
    );
    const portfolio = await fetchPortfolioFromStrapi({ baseUrl: "http://cms.test" });
    expect(portfolio.source).toBe("strapi");
    expect(portfolio.profile.avatar?.url).toBe("http://cms.test/uploads/me.jpg");
    expect(portfolio.experiences[0]).toMatchObject({ company: "MISPay", bullets: ["Built things"], tech: ["Go"], endDate: undefined });
  });

  it("throws StrapiError when Strapi is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("fetch failed"); }));
    await expect(fetchPortfolioFromStrapi({ baseUrl: "http://cms.test" })).rejects.toBeInstanceOf(StrapiError);
  });

  it("throws StrapiError on a non-2xx answer", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 403 })));
    await expect(fetchPortfolioFromStrapi({ baseUrl: "http://cms.test" })).rejects.toThrow(/403/);
  });
});
