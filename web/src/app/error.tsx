"use client";

/** Error boundary: a friendly page instead of a stack trace. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-5 py-24 sm:px-8">
      <p className="font-mono text-sm text-accent">Error</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-4 text-lg text-muted">Please try again in a moment.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-fg hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
