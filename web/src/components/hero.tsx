/* eslint-disable @next/next/no-img-element -- avatar comes from Strapi uploads on any host */
import type { Profile } from "@/lib/content/types";
import { ArrowRightIcon, DownloadIcon, MapPinIcon } from "./icons";
import { Monogram } from "./monogram";
import { SocialLinks } from "./social-links";

/** Above-the-fold introduction: name, headline, calls to action and highlights. */
export function Hero({ profile }: { profile: Profile }) {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[28rem] bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-5xl px-5 pb-6 pt-14 sm:px-8 sm:pb-10 sm:pt-24">
        <div className="reveal flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
          {profile.avatar ? (
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt || `Photo of ${profile.name}`}
              width={112}
              height={112}
              className="size-24 shrink-0 rounded-3xl object-cover shadow-sm ring-1 ring-border sm:size-28"
            />
          ) : (
            <Monogram name={profile.name} size="lg" />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon width={16} height={16} />
                {profile.location}
              </span>
              {profile.availableForWork ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Open to new opportunities
                </span>
              ) : null}
            </div>
            <h1 id="hero-heading" className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
          </div>
        </div>

        <p
          className="reveal mt-8 max-w-3xl text-xl leading-relaxed text-balance text-muted sm:text-2xl"
          style={{ ["--reveal-delay" as string]: "80ms" }}
        >
          <span className="text-fg">{profile.headline}.</span> Event-driven microservices in Java, Go and
          TypeScript, shipped on Kubernetes with Terraform, from API to interface.
        </p>

        <div className="reveal mt-8 flex flex-wrap items-center gap-3" style={{ ["--reveal-delay" as string]: "140ms" }}>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-fg shadow-sm transition hover:opacity-90"
          >
            Get in touch
            <ArrowRightIcon width={16} height={16} />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium transition hover:bg-surface-2"
          >
            View projects
          </a>
          {profile.resume ? (
            <a
              href={profile.resume.url}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium transition hover:bg-surface-2"
              download
            >
              <DownloadIcon width={16} height={16} />
              Résumé
            </a>
          ) : null}
          <SocialLinks links={profile.links} className="sm:ml-2" />
        </div>

        {profile.highlights.length > 0 ? (
          <dl
            className="reveal mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4"
            style={{ ["--reveal-delay" as string]: "200ms" }}
          >
            {profile.highlights.map((highlight) => (
              <div key={highlight.label} className="flex flex-col-reverse gap-1 bg-surface p-5">
                <dt className="text-sm leading-snug text-muted">{highlight.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
