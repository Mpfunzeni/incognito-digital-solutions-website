import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { PostMeta } from "./blog-utils";
export { formatDate } from "./blog-utils";

/**
 * Simple file-based blog. Each article is a Markdown file in
 * src/content/blog with front matter (see README). Files are read at build
 * time, so publishing an article means adding a file and redeploying.
 */

export type { PostMeta };

export type Post = PostMeta & { html: string; headings: { id: string; text: string }[] };

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function readFile(file: string): { meta: PostMeta; body: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    meta: {
      slug,
      title: String(data.title),
      description: String(data.description),
      date: String(data.date),
      updated: String(data.updated ?? data.date),
      category: String(data.category),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      author: String(data.author ?? "Incognito Digital Solutions"),
      image: String(data.image),
      imageAlt: String(data.imageAlt ?? ""),
      readingMinutes: Math.max(1, Math.round(words / 220)),
    },
    body: content,
  };
}

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readFile(f).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  const { meta, body } = readFile(file);
  const headings: { id: string; text: string }[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = slugify(text);
    if (depth === 2) headings.push({ id, text: text.replace(/<[^>]+>/g, "") });
    // Article H1 is the page title, so Markdown headings start at H2.
    const level = Math.max(2, depth);
    return `<h${level} id="${id}">${text}</h${level}>`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const external = /^https?:\/\//.test(href);
    const t = title ? ` title="${title}"` : "";
    return external
      ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
      : `<a href="${href}"${t}>${text}</a>`;
  };
  const html = marked.parse(body, { renderer, async: false }) as string;
  return { ...meta, html, headings };
}

export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map(({ p }) => p);
}
