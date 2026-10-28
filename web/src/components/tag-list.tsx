/** Small pills for technology tags. */
export function TagList({ tags, label }: { tags: string[]; label: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[0.72rem] leading-5 text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
