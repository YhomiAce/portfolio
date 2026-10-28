import { z } from "zod";

/** Validation for the contact form. Mirrors the limits on Strapi's `message` type. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email address.").trim().max(254),
  body: z
    .string()
    .trim()
    .min(10, "Please write at least a sentence (10 characters).")
    .max(5000, "Please keep it under 5,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Field-level errors keyed by input name. */
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

/** State returned by the contact server action to `useActionState`. */
export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: ContactFieldErrors; values?: Partial<ContactInput> };

/** Name of the hidden honeypot field. Humans never fill it; naive bots do. */
export const HONEYPOT_FIELD = "website";

/**
 * Validates submitted form data.
 *
 * @returns `{ spam: true }` when the honeypot is filled, otherwise the zod result.
 */
export function parseContactForm(formData: FormData):
  | { spam: true }
  | { spam: false; result: ReturnType<typeof contactSchema.safeParse> } {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { spam: true };
  }
  const raw = {
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    body: formData.get("body") ?? "",
  };
  return { spam: false, result: contactSchema.safeParse(raw) };
}

/** Turns zod issues into one message per field. */
export function fieldErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if ((key === "name" || key === "email" || key === "body") && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
