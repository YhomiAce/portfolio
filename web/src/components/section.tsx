import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

/** A labelled home-page section with a consistent heading. */
export function Section({ id, eyebrow, title, intro, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="reveal-on-scroll mb-10 max-w-2xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h2 id={headingId} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p> : null}
      </div>
      {children}
    </section>
  );
}
