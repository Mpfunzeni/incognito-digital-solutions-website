import { describe, expect, it } from "vitest";
import { getAllPosts, getPost } from "@/lib/blog";

describe("blog", () => {
  it("loads posts sorted newest first with required front matter", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) {
      expect(p.title && p.description && p.date && p.image && p.imageAlt).toBeTruthy();
    }
    const dates = posts.map((p) => p.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("renders markdown without an extra H1 and rejects unsafe slugs", () => {
    const post = getPost(getAllPosts()[0].slug)!;
    expect(post.html).not.toContain("<h1");
    expect(getPost("../../etc/passwd")).toBeNull();
  });
});
