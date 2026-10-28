import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time check of a revalidation secret.
 *
 * @param provided - Secret from the request (query string or header).
 * @param expected - `REVALIDATE_SECRET`; when unset, every request is rejected.
 */
export function isValidSecret(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
