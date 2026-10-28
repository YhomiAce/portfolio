import type { ProfileLink } from "@/lib/content/types";
import { GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon } from "./icons";

const ICONS = { github: GitHubIcon, linkedin: LinkedInIcon, email: MailIcon, website: GlobeIcon, other: GlobeIcon };

/** Icon buttons for the profile's links (GitHub, LinkedIn, email…). */
export function SocialLinks({ links, className = "" }: { links: ProfileLink[]; className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {links.map((link) => {
        const Icon = ICONS[link.kind];
        const external = link.url.startsWith("http");
        return (
          <li key={link.url}>
            <a
              href={link.url}
              {...(external ? { target: "_blank", rel: "noopener noreferrer me" } : {})}
              className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              aria-label={external ? `${link.label} (opens in a new tab)` : link.label}
              title={link.label}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
