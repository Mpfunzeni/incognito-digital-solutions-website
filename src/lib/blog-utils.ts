/** Client-safe blog helpers and types (no Node.js APIs). */

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  category: string;
  tags: string[];
  author: string;
  image: string;
  imageAlt: string;
  readingMinutes: number;
};

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" }).format(
    new Date(iso),
  );
}
