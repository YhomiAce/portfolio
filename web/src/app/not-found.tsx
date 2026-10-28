import Link from "next/link";

/** 404 page. */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-lg text-muted">That page doesn&apos;t exist, or it has moved.</p>
      <Link href="/" className="mt-8 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-fg hover:opacity-90">
        Back to the home page
      </Link>
    </div>
  );
}
