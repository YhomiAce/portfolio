import Link from "next/link";
import type { Post } from "@/lib/content/types";
import { formatFullDate } from "@/lib/format";
import { Section } from "./section";

/** Latest posts. Only rendered when at least one post is published. */
export function Writing({ posts }: { posts: Post[] }) {
  return (
    <Section id="writing" eyebrow="Writing" title="Notes from the trenches">
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="reveal-on-scroll">
            <article className="group relative rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50">
              {post.publishedDate ? (
                <p className="font-mono text-xs text-muted">
                  <time dateTime={post.publishedDate}>{formatFullDate(post.publishedDate)}</time>
                </p>
              ) : null}
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                <Link href={`/writing/${post.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
                  {post.title}
                </Link>
              </h3>
              {post.excerpt ? <p className="mt-2 leading-relaxed text-muted">{post.excerpt}</p> : null}
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
