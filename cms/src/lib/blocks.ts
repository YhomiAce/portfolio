/** A Strapi "blocks" rich-text paragraph node. */
export interface ParagraphBlock {
  type: 'paragraph';
  children: { type: 'text'; text: string }[];
}

/**
 * Converts plain paragraphs (as stored in the seed JSON) into Strapi blocks rich text.
 *
 * @param paragraphs - One string per paragraph.
 * @returns A blocks value accepted by `blocks` attributes.
 */
export function paragraphsToBlocks(paragraphs: readonly string[]): ParagraphBlock[] {
  return paragraphs.map((text) => ({ type: 'paragraph', children: [{ type: 'text', text }] }));
}
