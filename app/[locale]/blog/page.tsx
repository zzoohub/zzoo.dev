import { getLocale } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/content";
import { BlogListClient } from "./blog-list-client";

export default async function BlogPage() {
  const locale = await getLocale();
  const posts = getAllBlogPosts(locale);
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  return (
    <>
      <BlogListClient posts={posts} allTags={allTags} />
    </>
  );
}
