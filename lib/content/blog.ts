import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPostMeta } from "./types";
import { contentDir, resolveContentLocale, isValidSlug, toDateString, calculateReadingTime } from "./utils";

export function getAllBlogPosts(locale: string): BlogPostMeta[] {
  const dir = path.join(contentDir, "blog");
  if (!fs.existsSync(dir)) return [];

  const slugDirs = fs.readdirSync(dir).filter((entry) => {
    const entryPath = path.join(dir, entry);
    return fs.statSync(entryPath).isDirectory();
  });

  const seen = new Set<string>();
  const posts = slugDirs
    .map((slug) => {
      const slugDir = path.join(dir, slug);
      const effectiveLocale = resolveContentLocale(slugDir, locale);
      const filePath = path.join(slugDir, `${effectiveLocale}.mdx`);
      if (!fs.existsSync(filePath)) return null;
      if (seen.has(slug)) return null;
      seen.add(slug);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      return {
        slug,
        title: data.title,
        description: data.description,
        date: toDateString(data.date),
        tags: data.tags ?? [],
        locale: effectiveLocale,
        draft: data.draft ?? false,
        readingTime: calculateReadingTime(content, effectiveLocale),
      } satisfies BlogPostMeta;
    })
    .filter(Boolean) as BlogPostMeta[];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPost(
  locale: string,
  slug: string
): { meta: BlogPostMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const slugDir = path.join(contentDir, "blog", slug);
  const effectiveLocale = resolveContentLocale(slugDir, locale);
  const filePath = path.join(slugDir, `${effectiveLocale}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      date: toDateString(data.date),
      tags: data.tags ?? [],
      locale: effectiveLocale,
      draft: data.draft ?? false,
      readingTime: calculateReadingTime(content, effectiveLocale),
    },
    content,
  };
}
