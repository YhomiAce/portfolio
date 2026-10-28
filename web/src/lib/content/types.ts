/**
 * Domain types for the portfolio. Both sources (Strapi and the bundled fallback)
 * are normalised into these shapes, so components never see Strapi's wire format.
 */

/** Inline text node in Strapi "blocks" rich text. */
export interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

/** Inline link node in Strapi "blocks" rich text. */
export interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

export type InlineNode = TextNode | LinkNode;

/** List item, which may hold nested lists. */
export interface ListItemNode {
  type: "list-item";
  children: (InlineNode | ListBlock)[];
}

export interface ListBlock {
  type: "list";
  format: "ordered" | "unordered";
  children: (ListItemNode | ListBlock)[];
}

/** A top-level block in Strapi "blocks" rich text. */
export type Block =
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: "quote"; children: InlineNode[] }
  | { type: "code"; language?: string; children: InlineNode[] }
  | { type: "image"; image: { url: string; alternativeText?: string | null; width?: number | null; height?: number | null } }
  | ListBlock;

export type RichText = Block[];

export type LinkKind = "github" | "linkedin" | "email" | "website" | "other";

export interface ProfileLink {
  label: string;
  url: string;
  kind: LinkKind;
}

export interface Media {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Profile {
  name: string;
  headline: string;
  summary: RichText;
  location: string;
  email: string;
  availableForWork: boolean;
  links: ProfileLink[];
  highlights: { value: string; label: string }[];
  education: { qualification: string; institution: string; startYear?: number; endYear?: number }[];
  resume?: Media;
  avatar?: Media;
}

export interface Experience {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  tech: string[];
  order: number;
}

export interface SkillGroup {
  name: string;
  skills: string[];
  order: number;
}

export type ProjectCategory = "product" | "infrastructure";

export interface Project {
  title: string;
  slug: string;
  category: ProjectCategory;
  role?: string;
  summary: string;
  description: RichText;
  tech: string[];
  repoUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  cover?: Media;
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  body: RichText;
  publishedDate?: string;
}

/** Everything the site renders, plus where it came from. */
export interface Portfolio {
  profile: Profile;
  experiences: Experience[];
  skillGroups: SkillGroup[];
  projects: Project[];
  posts: Post[];
  source: "strapi" | "fallback";
}
