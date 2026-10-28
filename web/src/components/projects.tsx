import Link from "next/link";
import type { Project } from "@/lib/content/types";
import { ArrowRightIcon } from "./icons";
import { Section } from "./section";
import { TagList } from "./tag-list";

const CATEGORY_LABEL = { product: "Product", infrastructure: "Infrastructure" } as const;

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="reveal-on-scroll group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-black/5 motion-reduce:hover:translate-y-0">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{CATEGORY_LABEL[project.category]}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
          {project.title}
        </Link>
      </h3>
      {project.role ? <p className="mt-1 text-sm text-muted">{project.role}</p> : null}
      <p className="mt-3 flex-1 leading-relaxed text-muted">{project.summary}</p>
      <div className="mt-5">
        <TagList tags={project.tech.slice(0, 6)} label={`Technologies in ${project.title}`} />
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Read more
        <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

/** Featured project cards plus a compact list of the rest. */
export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      intro="Production systems I've built at work, and infrastructure projects I've built to go deeper on DevOps."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {others.length > 0 ? (
        <div className="mt-14">
          <h3 className="text-lg font-semibold tracking-tight">More projects</h3>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {others.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span>
                    <span className="font-medium">{project.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{project.summary}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted">{project.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
