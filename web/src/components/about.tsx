import type { Experience, Profile } from "@/lib/content/types";
import { RichText } from "./rich-text";
import { Section } from "./section";

/** Summary plus a sidebar with current roles and education. */
export function About({ profile, experiences }: { profile: Profile; experiences: Experience[] }) {
  const current = experiences.filter((experience) => experience.current);
  return (
    <Section id="about" eyebrow="About" title="Backend first, with the whole stack in reach">
      <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
        <RichText value={profile.summary} className="reveal-on-scroll max-w-2xl text-lg leading-relaxed text-muted" />
        <aside className="reveal-on-scroll space-y-6" aria-label="At a glance">
          {current.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-muted">Currently</h3>
              <ul className="mt-3 space-y-3">
                {current.map((experience) => (
                  <li key={experience.company}>
                    <p className="font-medium">{experience.role}</p>
                    <p className="text-sm text-muted">{experience.company}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {profile.education.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-medium text-muted">Education</h3>
              <ul className="mt-3 space-y-3">
                {profile.education.map((education) => (
                  <li key={education.qualification + education.institution}>
                    <p className="font-medium">{education.qualification}</p>
                    <p className="text-sm text-muted">
                      {education.institution}
                      {education.endYear ? `, ${education.startYear ? `${education.startYear}–` : ""}${education.endYear}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </Section>
  );
}
