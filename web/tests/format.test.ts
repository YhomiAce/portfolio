import { describe, expect, it } from "vitest";
import { formatDateRange, initials } from "@/lib/format";

describe("format", () => {
  it("formats date ranges", () => {
    expect(formatDateRange("2025-08-01", undefined, true)).toBe("Aug 2025 – Present");
    expect(formatDateRange("2024-01-01", "2025-09-30", false)).toBe("Jan 2024 – Sep 2025");
  });

  it("builds a two-letter monogram from first and last name", () => {
    expect(initials("Lateef Yomi Kareem")).toBe("LK");
    expect(initials("Madonna")).toBe("M");
  });
});
