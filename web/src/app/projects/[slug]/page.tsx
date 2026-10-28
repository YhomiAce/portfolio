/* eslint-disable @next/next/no-img-element -- cover images come from Strapi uploads on any host */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/icons";
import { RichText } from "@/components/rich-text";
import { TagList } from "@/components/tag-list";
import { getPortfolio, getProject } from "@/lib/content";

/**
 * Render unknown slugs completely before responding, so missing ones get a real 404
 * (instead of a streamed App Shell with status 200) and new CMS entries are cached.
 */
export const ensureStatic = "navigation";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { projects } = await getPortfolio();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.slug}`, type: "article" },
  };
}

/** Project detail page. */
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const { projects } = await getPortfolio();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 rounded-lg text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeftIcon width={16} height={16} />
        All projects
      </Link>

      <header className="reveal mt-8">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
          {project.category === "infrastructure" ? "Infrastructure" : "Product"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{project.title}</h1>
        {project.role ? <p className="mt-3 text-muted">{project.role}</p> : null}
        <p className="mt-6 text-xl leading-relaxed text-muted">{project.summary}</p>
        {project.liveUrl || project.repoUrl ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90"
              >
                Visit site
                <ArrowUpRightIcon width={16} height={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-surface-2"
              >
                <GitHubIcon width={16} height={16} />
                Source code
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      {project.cover ? (
        <img
          src={project.cover.url}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          className="mt-10 h-auto w-full rounded-2xl border border-border"
        />
      ) : null}

      <RichText value={project.description} className="mt-10 text-lg leading-relaxed text-muted" />

      <section aria-labelledby="tech-heading" className="mt-10">
        <h2 id="tech-heading" className="text-sm font-medium text-muted">
          Built with
        </h2>
        <div className="mt-3">
          <TagList tags={project.tech} label={`Technologies in ${project.title}`} />
        </div>
      </section>

      {next && next.slug !== project.slug ? (
        <nav aria-label="Next project" className="mt-16 border-t border-border pt-8">
          <Link href={`/projects/${next.slug}`} className="group block rounded-2xl">
            <span className="text-sm text-muted">Next project</span>
            <span className="mt-1 block text-xl font-semibold tracking-tight group-hover:text-accent">{next.title} →</span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
