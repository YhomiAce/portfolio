import { initials } from "@/lib/format";

interface MonogramProps {
  name: string;
  size?: "sm" | "lg";
}

/** Initials in a rounded tile: the site's logo, and the hero image until a photo is uploaded. */
export function Monogram({ name, size = "sm" }: MonogramProps) {
  const sizing =
    size === "lg" ? "size-24 rounded-3xl text-3xl sm:size-28 sm:text-4xl" : "size-9 rounded-xl text-sm";
  return (
    <span
      aria-hidden="true"
      className={`${sizing} inline-flex shrink-0 select-none items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-800 font-semibold tracking-tight text-white shadow-sm ring-1 ring-black/5 dark:from-teal-300 dark:to-emerald-500 dark:text-emerald-950`}
    >
      {initials(name)}
    </span>
  );
}
