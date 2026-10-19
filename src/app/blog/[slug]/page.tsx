import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { formatDate, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { absoluteUrl, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { PostCard } from "@/components/sections/PostCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated,
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    datePublished: post.date,
    dateModified: post.updated,
    author: { "@type": "Organization", name: post.author, url: site.url },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "en-ZA",
  };

  return (
    <>
      <article>
        <header className="on-dark bg-ink-900 pb-14 pt-10 sm:pt-14">
          <Container className="max-w-4xl">
            <Breadcrumbs
              items={[
                { name: "Blog", path: "/blog" },
                { name: post.title, path: `/blog/${post.slug}` },
              ]}
            />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">{post.category}</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.12] text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">{post.description}</p>
            <p className="mt-6 text-sm text-slate-300">
              By {post.author} · Published <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updated !== post.date && (
                <>
                  {" "}
                  · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </>
              )}{" "}
              · {post.readingMinutes} min read
            </p>
          </Container>
        </header>
        <Container className="max-w-4xl">
          <div className="-mt-2 overflow-hidden rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-card)]">
            <Image src={post.image} alt={post.imageAlt} width={1200} height={630} unoptimized priority className="h-auto w-full" />
          </div>
          <div className="mx-auto max-w-3xl py-12 sm:py-16">
            {post.headings.length > 2 && (
              <nav aria-label="In this article" className="mb-10 rounded-2xl border border-line bg-surface-muted p-6">
                <p className="text-sm font-bold uppercase tracking-wider text-ink-900">In this article</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.95rem] text-ink-700 marker:text-text-muted">
                  {post.headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="hover:text-ink-900 hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: post.html }} />
            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t} className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-ink-700">
                    #{t}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/blog" className="mt-10 inline-flex items-center gap-2 font-semibold text-ink-900 hover:underline">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to all articles
            </Link>
          </div>
        </Container>
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-posts" className="border-t border-line bg-surface-muted py-16 sm:py-20">
          <Container>
            <h2 id="related-posts" className="text-2xl font-bold text-ink-900 sm:text-3xl">
              Related articles
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <CtaBanner />
      <JsonLd data={articleLd} />
    </>
  );
}
