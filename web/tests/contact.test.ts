import { describe, expect, it } from "vitest";
import { fieldErrors, HONEYPOT_FIELD, parseContactForm } from "@/lib/contact/schema";
import { isValidSecret } from "@/lib/revalidate-auth";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

describe("parseContactForm", () => {
  it("accepts a valid message and trims it", () => {
    const parsed = parseContactForm(form({ name: "  Ada ", email: "ada@example.com", body: "Hello, let's talk about a role." }));
    expect(parsed.spam).toBe(false);
    if (!parsed.spam) {
      expect(parsed.result.success).toBe(true);
      expect(parsed.result.data?.name).toBe("Ada");
    }
  });

  it("reports one error per invalid field", () => {
    const parsed = parseContactForm(form({ name: "A", email: "nope", body: "short" }));
    if (parsed.spam || parsed.result.success) throw new Error("expected a validation failure");
    expect(Object.keys(fieldErrors(parsed.result.error)).sort()).toEqual(["body", "email", "name"]);
  });

  it("flags the honeypot as spam", () => {
    const parsed = parseContactForm(form({ name: "Bot", email: "b@x.io", body: "Buy now buy now", [HONEYPOT_FIELD]: "http://spam" }));
    expect(parsed.spam).toBe(true);
  });
});

describe("isValidSecret", () => {
  it("matches only the exact secret", () => {
    expect(isValidSecret("s3cret-value", "s3cret-value")).toBe(true);
    expect(isValidSecret("s3cret-valuX", "s3cret-value")).toBe(false);
    expect(isValidSecret("short", "s3cret-value")).toBe(false);
    expect(isValidSecret(null, "s3cret-value")).toBe(false);
    expect(isValidSecret("anything", undefined)).toBe(false);
  });
});
