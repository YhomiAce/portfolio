import Link from "next/link";
import { getPortfolio } from "@/lib/content";
import { MenuIcon } from "./icons";
import { Monogram } from "./monogram";
import { ThemeToggle } from "./theme-toggle";

/** Sticky top bar with the monogram, section links and the theme toggle. */
export async function SiteHeader() {
  const { profile, posts } = await getPortfolio();
  const links = [
    { href: "/#about", label: "About" },
    { href: "/#experience", label: "Experience" },
    { href: "/#skills", label: "Skills" },
    { href: "/#projects", label: "Projects" },
    ...(posts.length > 0 ? [{ href: "/#writing", label: "Writing" }] : []),
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label={`${profile.name}, home`}>
          <Monogram name={profile.name} />
          <span className="hidden font-semibold tracking-tight sm:inline">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <details className="group relative md:hidden">
            <summary
              className="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </summary>
            <ul className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface p-2 shadow-lg">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </div>
    </header>
  );
}
