import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllBlogPosts } from "@/lib/content";
import { buildPageMeta } from "@/lib/seo";
import { BlogListClient } from "./blog-list-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("blog");
  return buildPageMeta({
    locale,
    pathname: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const posts = getAllBlogPosts(locale);
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  return <BlogListClient posts={posts} allTags={allTags} />;
}
