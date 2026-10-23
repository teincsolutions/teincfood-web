"use client";

import { parseMarkdown, type MarkdownToken } from "@teincfood/chat-client";

function decodeEntities(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

export function MarkdownText({ text, className }: { text: string; className?: string }) {
  const tokens = parseMarkdown(decodeEntities(text));
  return (
    <span className={className}>
      {tokens.map((t: MarkdownToken, i: number) => {
        switch (t.type) {
          case "bold":
            return <strong key={i}>{t.text}</strong>;
          case "italic":
            return <em key={i}>{t.text}</em>;
          case "boldItalic":
            return <strong key={i}><em>{t.text}</em></strong>;
          case "strikethrough":
            return <s key={i}>{t.text}</s>;
          case "code":
            return <code key={i} className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em]">{t.text}</code>;
          default:
            return <span key={i}>{t.text}</span>;
        }
      })}
    </span>
  );
}
