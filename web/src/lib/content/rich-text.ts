import { z } from "zod";
import type { Block, InlineNode, ListBlock, ListItemNode, RichText, TextNode } from "./types";

const textNode: z.ZodType<TextNode> = z.object({
  type: z.literal("text"),
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  code: z.boolean().optional(),
});

const inlineNode: z.ZodType<InlineNode> = z.union([
  textNode,
  z.object({ type: z.literal("link"), url: z.string(), children: z.array(textNode) }),
]);

const listBlock: z.ZodType<ListBlock> = z.lazy(() =>
  z.object({
    type: z.literal("list"),
    format: z.enum(["ordered", "unordered"]),
    children: z.array(z.union([listItem, listBlock])),
  }),
);

const listItem: z.ZodType<ListItemNode> = z.lazy(() =>
  z.object({
    type: z.literal("list-item"),
    children: z.array(z.union([inlineNode, listBlock])),
  }),
);

const block: z.ZodType<Block> = z.union([
  z.object({ type: z.literal("paragraph"), children: z.array(inlineNode) }),
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
    children: z.array(inlineNode),
  }),
  z.object({ type: z.literal("quote"), children: z.array(inlineNode) }),
  z.object({ type: z.literal("code"), language: z.string().optional(), children: z.array(inlineNode) }),
  z.object({
    type: z.literal("image"),
    image: z.object({
      url: z.string(),
      alternativeText: z.string().nullish(),
      width: z.number().nullish(),
      height: z.number().nullish(),
    }),
  }),
  listBlock,
]);

/**
 * Parses Strapi blocks rich text leniently: unknown or malformed blocks are dropped
 * rather than failing the whole page.
 *
 * @param value - The raw `blocks` attribute from the API (may be null).
 */
export function parseRichText(value: unknown): RichText {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = block.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

/** Builds rich text from plain paragraphs (the seed JSON format). */
export function paragraphsToRichText(paragraphs: readonly string[]): RichText {
  return paragraphs.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
}

/** Flattens rich text to plain text, e.g. for meta descriptions. */
export function richTextToPlain(richText: RichText): string {
  const inline = (nodes: readonly (InlineNode | ListBlock | ListItemNode)[]): string =>
    nodes
      .map((node) => {
        if (node.type === "text") return node.text;
        if (node.type === "link") return inline(node.children);
        return inline(node.children);
      })
      .join("");
  return richText
    .map((b) => (b.type === "image" ? "" : inline(b.children)))
    .filter(Boolean)
    .join(" ");
}
