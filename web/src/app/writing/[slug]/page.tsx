import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { RichText } from "@/components/rich-text";
import { getPortfolio, getPost } from "@/lib/content";
import { formatFullDate } from "@/lib/format";

/** Placeholder so the route still builds when no posts exist (Cache Components needs one param). */
const NO_POSTS_PLACEHOLDER = "__no-posts__";

/**
 * Render unknown slugs completely before responding, so missing ones get a real 404
 * (instead of a streamed App Shell with status 200) and new CMS entries are cached.
 */
export const ensureStatic = "navigation";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { posts } = await getPortfolio();
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: NO_POSTS_PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url: `/writing/${post.slug}`,
      type: "article",
      publishedTime: post.publishedDate,
    },
  };
}

/** A single post. */
export default async function PostPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-20">
      <Link href="/#writing" className="inline-flex items-center gap-1.5 rounded-lg text-sm text-muted hover:text-fg">
        <ArrowLeftIcon width={16} height={16} />
        All writing
      </Link>
      <header className="reveal mt-8">
        {post.publishedDate ? (
          <p className="font-mono text-xs text-muted">
            <time dateTime={post.publishedDate}>{formatFullDate(post.publishedDate)}</time>
          </p>
        ) : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p> : null}
      </header>
      <RichText value={post.body} className="mt-10 text-lg leading-relaxed" />
    </article>
  );
}
