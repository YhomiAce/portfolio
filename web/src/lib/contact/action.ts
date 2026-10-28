"use server";

import { strapiUrl } from "@/lib/env";
import { fieldErrors, parseContactForm, type ContactState } from "./schema";

/**
 * Contact form server action: validates input, drops honeypot submissions silently,
 * and stores the message in Strapi (`POST /api/messages`, allowed for the Public role).
 */
export async function sendMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = parseContactForm(formData);
  if (parsed.spam) {
    // Pretend it worked so bots learn nothing.
    return { status: "success" };
  }
  const { result } = parsed;
  if (!result.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrors(result.error),
      values: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        body: String(formData.get("body") ?? ""),
      },
    };
  }

  const baseUrl = strapiUrl();
  const failure: ContactState = {
    status: "error",
    message: "Sorry, your message couldn't be sent right now. Please email me directly instead.",
    values: result.data,
  };
  if (!baseUrl) {
    console.warn("[contact] STRAPI_URL is not set; cannot store message");
    return failure;
  }

  try {
    const response = await fetch(`${baseUrl}/api/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: result.data }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(`[contact] Strapi answered ${response.status} when storing a message`);
      return failure;
    }
  } catch (error) {
    console.warn(`[contact] could not reach Strapi: ${(error as Error).message}`);
    return failure;
  }
  return { status: "success" };
}
