const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Formats an ISO date (YYYY-MM-DD) as "Aug 2025". */
export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}

/** Formats an ISO date as "28 October 2026". */
export function formatFullDate(isoDate: string): string {
  return fullDate.format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}

/** "Aug 2025 – Present" or "Jan 2024 – Sep 2025". */
export function formatDateRange(start: string, end: string | undefined, current: boolean): string {
  const to = current || !end ? "Present" : formatMonthYear(end);
  return `${formatMonthYear(start)} – ${to}`;
}

/** Initials for the monogram: "Lateef Yomi Kareem" -> "LK" (first and last name). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}
