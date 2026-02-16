import { setRequestLocale } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/content";
import { BlogListClient } from "./blog-list-client";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllBlogPosts(locale);
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  return (
    <>
      <BlogListClient posts={posts} allTags={allTags} />
    </>
  );
}
