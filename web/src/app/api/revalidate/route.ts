import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CONTENT_TAG } from "@/lib/content";
import { serverEnv } from "@/lib/env";
import { isValidSecret } from "@/lib/revalidate-auth";

/**
 * `POST /api/revalidate?secret=…`: on-demand ISR. Strapi calls this after content
 * changes; the next visit to any page renders with fresh content. The secret may also be
 * sent in an `x-revalidate-secret` header.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const provided = request.nextUrl.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");
  const expected = serverEnv().REVALIDATE_SECRET;
  if (!expected) {
    return Response.json({ revalidated: false, error: "Revalidation is not configured" }, { status: 503 });
  }
  if (!isValidSecret(provided, expected)) {
    return Response.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
