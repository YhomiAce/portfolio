import { getPortfolio } from "@/lib/content";
import { SocialLinks } from "./social-links";

/** Footer with name and links. */
export async function SiteFooter() {
  const { profile } = await getPortfolio();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:px-8">
        <p>
          {profile.name} · {profile.location}
        </p>
        <SocialLinks links={profile.links} />
      </div>
    </footer>
  );
}
