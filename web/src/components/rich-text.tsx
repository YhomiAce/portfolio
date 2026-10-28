/* eslint-disable @next/next/no-img-element -- CMS images have unknown hosts and sizes */
import type { ReactNode } from "react";
import type { Block, InlineNode, ListBlock, ListItemNode, RichText as RichTextValue, TextNode } from "@/lib/content/types";

function renderText(node: TextNode, key: number): ReactNode {
  let content: ReactNode = node.text;
  if (node.code) content = <code>{content}</code>;
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return <span key={key}>{content}</span>;
}

function isSafeUrl(url: string): boolean {
  return /^(https?:|mailto:|\/|#)/i.test(url);
}

function renderInline(nodes: readonly (InlineNode | ListBlock)[]): ReactNode[] {
  return nodes.map((node, index) => {
    if (node.type === "text") return renderText(node, index);
    if (node.type === "link") {
      const children = node.children.map(renderText);
      if (!isSafeUrl(node.url)) return <span key={index}>{children}</span>;
      const external = /^https?:/i.test(node.url);
      return (
        <a key={index} href={node.url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    }
    return renderList(node, index);
  });
}

function renderList(list: ListBlock, key: number): ReactNode {
  const items = list.children.map((child: ListItemNode | ListBlock, index) =>
    child.type === "list" ? renderList(child, index) : <li key={index}>{renderInline(child.children)}</li>,
  );
  return list.format === "ordered" ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "paragraph":
      return <p key={key}>{renderInline(block.children)}</p>;
    case "heading": {
      // The page owns h1; content headings start at h2.
      const level = Math.min(Math.max(block.level, 2), 4);
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return <Tag key={key}>{renderInline(block.children)}</Tag>;
    }
    case "quote":
      return <blockquote key={key}>{renderInline(block.children)}</blockquote>;
    case "code":
      return (
        <pre key={key}>
          <code>{block.children.map((child) => (child.type === "text" ? child.text : "")).join("")}</code>
        </pre>
      );
    case "image":
      return (
        <img
          key={key}
          src={block.image.url}
          alt={block.image.alternativeText ?? ""}
          width={block.image.width ?? undefined}
          height={block.image.height ?? undefined}
          loading="lazy"
          className="h-auto max-w-full rounded-xl border border-border"
        />
      );
    case "list":
      return renderList(block, key);
  }
}

/** Renders Strapi blocks rich text as semantic HTML. */
export function RichText({ value, className = "" }: { value: RichTextValue; className?: string }) {
  return <div className={`prose-body ${className}`}>{value.map(renderBlock)}</div>;
}
