import type { Experience } from "@/lib/content/types";
import { formatDateRange } from "@/lib/format";
import { Section } from "./section";
import { TagList } from "./tag-list";

/** Bullets shown before the "Show more" toggle, keeping the timeline scannable. */
const VISIBLE_BULLETS = 4;

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-[0.97rem] leading-relaxed text-muted">
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-accent"
        >
          {bullet}
        </li>
      ))}
    </ul>
  );
}

/** Work history as a vertical timeline, most recent first. */
export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked"
      intro="Fintech, marketplaces and messaging platforms, from Lagos to London and Riyadh."
    >
      <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-10">
        {experiences.map((experience, index) => (
          <li key={`${experience.company}-${experience.startDate}`} className="reveal-on-scroll relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[1.84rem] top-1.5 size-3 rounded-full ring-4 ring-bg sm:-left-[2.84rem] ${experience.current ? "bg-accent" : "bg-border"}`}
            />
            <article aria-labelledby={`exp-${index}`}>
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 id={`exp-${index}`} className="text-lg font-semibold tracking-tight">
                  {experience.role} <span className="text-muted">·</span>{" "}
                  <span className="text-accent">{experience.company}</span>
                </h3>
                <p className="shrink-0 font-mono text-xs text-muted">
                  <time dateTime={experience.startDate}>{formatDateRange(experience.startDate, experience.endDate, experience.current)}</time>
                </p>
              </header>
              {experience.location ? <p className="mt-1 text-sm text-muted">{experience.location}</p> : null}
              <BulletList bullets={experience.bullets.slice(0, VISIBLE_BULLETS)} />
              {experience.bullets.length > VISIBLE_BULLETS ? (
                <details className="group mt-2">
                  <summary className="cursor-pointer list-none text-sm font-medium text-accent hover:underline [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Show {experience.bullets.length - VISIBLE_BULLETS} more</span>
                    <span className="hidden group-open:inline">Show less</span>
                  </summary>
                  <BulletList bullets={experience.bullets.slice(VISIBLE_BULLETS)} />
                </details>
              ) : null}
              <div className="mt-4">
                <TagList tags={experience.tech} label={`Technologies used at ${experience.company}`} />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
