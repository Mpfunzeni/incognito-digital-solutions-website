import { getAllPosts } from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { BlogList } from "@/components/sections/BlogList";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog and Resources",
  description:
    "Practical guides on websites, SEO, domains, hosting, e-commerce and website maintenance for South African businesses.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Guides and resources"
        intro="Practical, plain-language advice on websites, search visibility, hosting and running your business online."
        crumbs={[{ name: "Blog", path: "/blog" }]}
      />
      <section aria-label="Articles" className="py-16 sm:py-20">
        <Container>
          <BlogList posts={posts} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
