import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Writing } from "@/components/writing";
import { getPortfolio } from "@/lib/content";
import { siteUrl } from "@/lib/env";

/** Single-page home: hero, about, experience, skills, projects, writing (if any), contact. */
export default async function HomePage() {
  const { profile, experiences, skillGroups, projects, posts } = await getPortfolio();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    email: `mailto:${profile.email}`,
    url: siteUrl(),
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: profile.links.filter((link) => link.url.startsWith("http")).map((link) => link.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero profile={profile} />
      <About profile={profile} experiences={experiences} />
      <ExperienceTimeline experiences={experiences} />
      <Skills groups={skillGroups} />
      <Projects projects={projects} />
      {posts.length > 0 ? <Writing posts={posts} /> : null}
      <Contact profile={profile} />
    </>
  );
}
