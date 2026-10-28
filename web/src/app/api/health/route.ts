import { connection } from "next/server";
import { strapiUrl } from "@/lib/env";

/**
 * `GET /api/health`: always 200 while the server is up. The web app has no database of
 * its own and keeps serving bundled content when Strapi is down, so Strapi's state is
 * reported for information only.
 */
export async function GET(): Promise<Response> {
  await connection();
  const baseUrl = strapiUrl();
  let strapi: "up" | "down" | "not-configured" = "not-configured";
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/_health`, { signal: AbortSignal.timeout(1500), cache: "no-store" });
      strapi = response.ok ? "up" : "down";
    } catch {
      strapi = "down";
    }
  }
  return Response.json({ status: "ok", strapi }, { headers: { "cache-control": "no-store" } });
}
