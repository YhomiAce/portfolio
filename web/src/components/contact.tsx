import type { Profile } from "@/lib/content/types";
import { ContactForm } from "./contact-form";
import { MailIcon } from "./icons";
import { Section } from "./section";
import { SocialLinks } from "./social-links";

/** Contact section: direct email, links and the contact form. */
export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk"
      intro="Hiring for a backend, platform or full-stack role, or need help scaling a system? Send a message and I'll get back to you."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="reveal-on-scroll space-y-6">
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/50"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <MailIcon />
            </span>
            <span>
              <span className="block text-sm text-muted">Email</span>
              <span className="font-medium break-all group-hover:text-accent">{profile.email}</span>
            </span>
          </a>
          <div>
            <p className="text-sm text-muted">Elsewhere</p>
            <SocialLinks links={profile.links.filter((link) => link.kind !== "email")} className="-ml-2 mt-1" />
          </div>
        </div>
        <div className="reveal-on-scroll rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
