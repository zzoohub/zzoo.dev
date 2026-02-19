import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { AboutData, BlogPostMeta, CaseStudyMeta, Testimonial } from "./types";

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

function sanitizeImages(images: unknown): string[] | undefined {
  if (!Array.isArray(images)) return undefined;
  const valid = images.filter((v): v is string => typeof v === "string" && v.length > 0);
  return valid.length > 0 ? valid : undefined;
}

function resolveProjectImage(value: string, slug: string): string {
  if (value.startsWith("/")) return value;
  return `/images/projects/${slug}/${value}`;
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
  const dir = path.join(contentDir, "blog");
  if (!fs.existsSync(dir)) return [];

  const slugDirs = fs.readdirSync(dir).filter((entry) => {
    const entryPath = path.join(dir, entry);
    return fs.statSync(entryPath).isDirectory();
  });

  const posts = slugDirs
    .map((slug) => {
      const filePath = path.join(dir, slug, `${locale}.mdx`);
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      return {
        slug,
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
  const filePath = path.join(contentDir, "blog", slug, `${locale}.mdx`);
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
  const dir = path.join(contentDir, "projects");
  if (!fs.existsSync(dir)) return [];

  const slugDirs = fs.readdirSync(dir).filter((entry) => {
    const entryPath = path.join(dir, entry);
    return fs.statSync(entryPath).isDirectory();
  });

  const studies = slugDirs
    .map((slug) => {
      const filePath = path.join(dir, slug, `${locale}.mdx`);
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title,
        description: data.description,
        clientType: data.clientType,
        status: data.status,
        techStack: data.techStack ?? [],
        featured: data.featured ?? false,
        launchDate: toDateString(data.launchDate),
        thumbnail: typeof data.thumbnail === "string" ? resolveProjectImage(data.thumbnail, slug) : undefined,
        images: sanitizeImages(data.images)?.map((img) => resolveProjectImage(img, slug)),
        d2Diagram: data.d2Diagram ?? undefined,
        links: sanitizeLinks(data.links),
      } satisfies CaseStudyMeta;
    })
    .filter(Boolean) as CaseStudyMeta[];

  return studies.sort(
    (a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
  );
}

export function getCaseStudy(
  locale: string,
  slug: string
): { meta: CaseStudyMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(contentDir, "projects", slug, `${locale}.mdx`);
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
      launchDate: toDateString(data.launchDate),
      thumbnail: typeof data.thumbnail === "string" ? resolveProjectImage(data.thumbnail, slug) : undefined,
      images: sanitizeImages(data.images)?.map((img) => resolveProjectImage(img, slug)),
      d2Diagram: data.d2Diagram ?? undefined,
      links: sanitizeLinks(data.links),
    },
    content,
  };
}

export function hasDesignDoc(locale: string, slug: string): boolean {
  if (!isValidSlug(slug)) return false;
  const filePath = path.join(
    contentDir,
    "projects",
    slug,
    `design.${locale}.mdx`
  );
  return fs.existsSync(filePath);
}

export function getDesignDoc(
  locale: string,
  slug: string
): { meta: CaseStudyMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(
    contentDir,
    "projects",
    slug,
    `design.${locale}.mdx`
  );
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  const parentStudy = getCaseStudy(locale, slug);
  if (!parentStudy) return null;

  return {
    meta: parentStudy.meta,
    content,
  };
}

export function getAboutContent(locale: string): AboutData | null {
  const filePath = path.join(contentDir, "about", `${locale}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    experience: (data.experience ?? []) as AboutData["experience"],
    content,
  };
}

export function getTestimonials(): Testimonial[] {
  const filePath = path.join(contentDir, "testimonials.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
