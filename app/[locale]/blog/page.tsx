import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllBlogPosts } from "@/lib/content";
import { buildPageMeta } from "@/lib/seo";
import { BlogListClient } from "./blog-list-client";

const titles: Record<string, string> = { en: "Blog", ko: "블로그" };
const descriptions: Record<string, string> = {
  en: "Notes on building stuff, breaking stuff, and shipping anyway.",
  ko: "만들고, 부수고, 그래도 배포하는 이야기.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMeta({
    locale,
    pathname: "/blog",
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
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
