import Image from "next/image";
import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/blog-utils";

export function PostCard({ post, headingLevel = "h2" }: { post: PostMeta; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="glow-card lift reveal group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
      <div className="aspect-[1200/630] overflow-hidden bg-ink-900">
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={1200}
          height={630}
          unoptimized
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold text-brand-teal-dark">{post.category}</p>
        <H className="mt-2 text-xl font-bold leading-snug text-ink-900">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </H>
        <p className="mt-3 flex-1 leading-relaxed text-text-muted">{post.description}</p>
        <p className="mt-5 text-sm text-text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
