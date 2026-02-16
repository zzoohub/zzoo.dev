import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPostMeta, CaseStudyMeta, Testimonial } from "./types";

const contentDir = path.join(process.cwd(), "content");

const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;

function isValidSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

function isValidUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeLinks(
  links: unknown
): { live?: string; github?: string; docs?: string } | undefined {
  if (!links || typeof links !== "object") return undefined;
  const raw = links as Record<string, unknown>;
  const result: { live?: string; github?: string; docs?: string } = {};
  if (isValidUrl(raw.live)) result.live = raw.live;
  if (isValidUrl(raw.github)) result.github = raw.github;
  if (isValidUrl(raw.docs)) result.docs = raw.docs;
  return Object.keys(result).length > 0 ? result : undefined;
}

function toDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return String(value);
}

function calculateReadingTime(content: string, locale: string): number {
  if (locale === "ko") {
    return Math.ceil(content.length / 300);
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200);
}

export function getAllBlogPosts(locale: string): BlogPostMeta[] {
  const dir = path.join(contentDir, "blog", locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        date: toDateString(data.date),
        tags: data.tags ?? [],
        locale: locale as "en" | "ko",
        draft: data.draft ?? false,
        readingTime: calculateReadingTime(content, locale),
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
  const filePath = path.join(contentDir, "blog", locale, `${slug}.mdx`);
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
      locale: locale as "en" | "ko",
      draft: data.draft ?? false,
      readingTime: calculateReadingTime(content, locale),
    },
    content,
  };
}

export function getAllCaseStudies(locale: string): CaseStudyMeta[] {
  const dir = path.join(contentDir, "projects", locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && !f.endsWith(".prd.mdx"));
  const studies = files.map((filename) => {
    const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
    const { data } = matter(raw);
    return {
      slug: filename.replace(/\.mdx$/, ""),
      title: data.title,
      description: data.description,
      clientType: data.clientType,
      status: data.status,
      techStack: data.techStack ?? [],
      featured: data.featured ?? false,
      duration: data.duration,
      startDate: toDateString(data.startDate),
      endDate: data.endDate ? toDateString(data.endDate) : undefined,
      d2Diagram: data.d2Diagram ?? undefined,
      links: sanitizeLinks(data.links),
    } satisfies CaseStudyMeta;
  });

  return studies.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export function getCaseStudy(
  locale: string,
  slug: string
): { meta: CaseStudyMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(contentDir, "projects", locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      clientType: data.clientType,
      status: data.status,
      techStack: data.techStack ?? [],
      featured: data.featured ?? false,
      duration: data.duration,
      startDate: toDateString(data.startDate),
      endDate: data.endDate ? toDateString(data.endDate) : undefined,
      d2Diagram: data.d2Diagram ?? undefined,
      links: sanitizeLinks(data.links),
    },
    content,
  };
}

export function hasPRD(locale: string, slug: string): boolean {
  if (!isValidSlug(slug)) return false;
  const filePath = path.join(contentDir, "projects", locale, `${slug}.prd.mdx`);
  return fs.existsSync(filePath);
}

export function getCaseStudyPRD(
  locale: string,
  slug: string
): { meta: CaseStudyMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(contentDir, "projects", locale, `${slug}.prd.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Get the parent case study meta for context
  const parentStudy = getCaseStudy(locale, slug);
  if (!parentStudy) return null;

  return {
    meta: parentStudy.meta,
    content,
  };
}

export function getAllPRDSlugs(): { locale: string; slug: string }[] {
  const results: { locale: string; slug: string }[] = [];
  for (const locale of ["en", "ko"]) {
    const dir = path.join(contentDir, "projects", locale);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".prd.mdx"));
    for (const filename of files) {
      results.push({
        locale,
        slug: filename.replace(/\.prd\.mdx$/, ""),
      });
    }
  }
  return results;
}

export function getTestimonials(): Testimonial[] {
  const filePath = path.join(contentDir, "testimonials.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
