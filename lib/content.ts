import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { AboutData, BlogPostMeta, CaseStudyMeta, Testimonial } from "./types";
import { routing } from "@/i18n/routing";

const contentDir = path.join(process.cwd(), "content");
const FALLBACK_LOCALE = "en";
const ALLOWED_LOCALES = new Set<string>(routing.locales);

const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;

function isValidSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

function safeLocale(locale: string): string {
  return ALLOWED_LOCALES.has(locale) ? locale : FALLBACK_LOCALE;
}

/** Resolve a content file path, falling back to FALLBACK_LOCALE if the requested locale file doesn't exist. */
function resolveContentPath(dir: string, locale: string, filename?: string): string | null {
  const loc = safeLocale(locale);
  const name = filename ?? `${loc}.mdx`;
  const primary = path.join(dir, name);
  if (fs.existsSync(primary)) return primary;

  if (loc !== FALLBACK_LOCALE) {
    const fallbackName = filename
      ? filename.replace(new RegExp(`\\.${loc}\\.mdx$`), `.${FALLBACK_LOCALE}.mdx`)
      : `${FALLBACK_LOCALE}.mdx`;
    const fallback = path.join(dir, fallbackName);
    if (fs.existsSync(fallback)) return fallback;
  }

  return null;
}

/** Resolve the effective locale for a content file — returns the requested locale if its file exists, otherwise FALLBACK_LOCALE. */
function resolveContentLocale(dir: string, locale: string): string {
  const loc = safeLocale(locale);
  const primary = path.join(dir, `${loc}.mdx`);
  if (fs.existsSync(primary)) return loc;
  return FALLBACK_LOCALE;
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

const SAFE_IMAGE_PATH = /^[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|webp|svg|avif)$/i;

function sanitizeImages(images: unknown): string[] | undefined {
  if (!Array.isArray(images)) return undefined;
  const valid = images.filter(
    (v): v is string =>
      typeof v === "string" &&
      (v.startsWith("/") ? !v.includes("..") && !v.startsWith("//") : SAFE_IMAGE_PATH.test(v))
  );
  return valid.length > 0 ? valid : undefined;
}

function isYouTubeEmbedUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === "www.youtube.com" || parsed.hostname === "youtube.com") &&
      parsed.pathname.startsWith("/embed/")
    );
  } catch {
    return false;
  }
}

function sanitizeCta(
  cta: unknown
): { primary?: { label: string; url: string }; secondary?: { label: string; url: string } } | undefined {
  if (!cta || typeof cta !== "object") return undefined;
  const raw = cta as Record<string, unknown>;
  const result: { primary?: { label: string; url: string }; secondary?: { label: string; url: string } } = {};

  for (const key of ["primary", "secondary"] as const) {
    const entry = raw[key];
    if (entry && typeof entry === "object") {
      const e = entry as Record<string, unknown>;
      if (typeof e.label === "string" && isValidUrl(e.url)) {
        result[key] = { label: e.label, url: e.url };
      }
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function sanitizeCompetitors(
  competitors: unknown
): Array<{ name: string; differentiator: string }> | undefined {
  if (!Array.isArray(competitors)) return undefined;
  const valid = competitors.filter(
    (c): c is { name: string; differentiator: string } =>
      c && typeof c === "object" && typeof c.name === "string" && typeof c.differentiator === "string"
  );
  return valid.length > 0 ? valid : undefined;
}

function sanitizeFeatures(
  features: unknown
): Array<{ title: string; description: string; icon?: string }> | undefined {
  if (!Array.isArray(features)) return undefined;
  const valid = features
    .filter(
      (f): f is { title: string; description: string; icon?: string } =>
        f && typeof f === "object" && typeof f.title === "string" && typeof f.description === "string"
    )
    .map((f) => ({
      title: f.title,
      description: f.description,
      ...(typeof f.icon === "string" ? { icon: f.icon } : {}),
    }));
  return valid.length > 0 ? valid : undefined;
}

function sanitizeKeywords(
  keywords: unknown
): { primary?: string[]; longTail?: string[] } | undefined {
  if (!keywords || typeof keywords !== "object") return undefined;
  const raw = keywords as Record<string, unknown>;
  const result: { primary?: string[]; longTail?: string[] } = {};
  if (Array.isArray(raw.primary)) {
    result.primary = raw.primary.filter((v): v is string => typeof v === "string");
  }
  if (Array.isArray(raw.longTail)) {
    result.longTail = raw.longTail.filter((v): v is string => typeof v === "string");
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function resolveProjectImage(value: string, slug: string): string {
  if (value.startsWith("//")) return "";
  if (value.startsWith("/")) return value;
  if (value.includes("..")) return "";
  return `/images/projects/${slug}/${value}`;
}

function toDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return String(value);
}

const CJK_LOCALES = new Set(["ko", "ja"]);

function calculateReadingTime(content: string, locale: string): number {
  if (CJK_LOCALES.has(locale)) {
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

function parseCaseStudyMeta(data: Record<string, unknown>, slug: string): CaseStudyMeta {
  const VALID_CATEGORIES = ["mobile-app", "chrome-extension", "web", "cli"] as const;
  const category = typeof data.category === "string" && (VALID_CATEGORIES as readonly string[]).includes(data.category)
    ? (data.category as CaseStudyMeta["category"])
    : undefined;

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    clientType: data.clientType as string,
    status: data.status as CaseStudyMeta["status"],
    techStack: (data.techStack as string[]) ?? [],
    featured: (data.featured as boolean) ?? false,
    launchDate: toDateString(data.launchDate),
    thumbnail: typeof data.thumbnail === "string" ? resolveProjectImage(data.thumbnail, slug) : undefined,
    images: sanitizeImages(data.images)?.map((img) => resolveProjectImage(img, slug)),
    d2Diagram: (data.d2Diagram as string) ?? undefined,
    links: sanitizeLinks(data.links),
    tagline: typeof data.tagline === "string" ? data.tagline : undefined,
    category,
    keywords: sanitizeKeywords(data.keywords),
    competitors: sanitizeCompetitors(data.competitors),
    cta: sanitizeCta(data.cta),
    features: sanitizeFeatures(data.features),
    heroImage: typeof data.heroImage === "string" ? resolveProjectImage(data.heroImage, slug) : undefined,
    video: isYouTubeEmbedUrl(data.video) ? data.video : undefined,
  };
}

export function getAllCaseStudies(locale: string): CaseStudyMeta[] {
  const dir = path.join(contentDir, "projects");
  if (!fs.existsSync(dir)) return [];

  const slugDirs = fs.readdirSync(dir).filter((entry) => {
    const entryPath = path.join(dir, entry);
    return fs.statSync(entryPath).isDirectory();
  });

  const seen = new Set<string>();
  const studies = slugDirs
    .map((slug) => {
      const slugDir = path.join(dir, slug);
      const effectiveLocale = resolveContentLocale(slugDir, locale);
      const filePath = path.join(slugDir, `${effectiveLocale}.mdx`);
      if (!fs.existsSync(filePath)) return null;
      if (seen.has(slug)) return null;
      seen.add(slug);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      return parseCaseStudyMeta(data, slug);
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
  const slugDir = path.join(contentDir, "projects", slug);
  const effectiveLocale = resolveContentLocale(slugDir, locale);
  const filePath = path.join(slugDir, `${effectiveLocale}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: parseCaseStudyMeta(data, slug),
    content,
  };
}

export function hasCaseStudy(locale: string, slug: string): boolean {
  if (!isValidSlug(slug)) return false;
  const dir = path.join(contentDir, "projects", slug);
  return resolveContentPath(dir, locale, `casestudy.${locale}.mdx`) !== null;
}

export function getCaseStudyContent(
  locale: string,
  slug: string
): { meta: CaseStudyMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const dir = path.join(contentDir, "projects", slug);
  const filePath = resolveContentPath(dir, locale, `casestudy.${locale}.mdx`);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  const parentStudy = getCaseStudy(locale, slug);
  if (!parentStudy) return null;

  return {
    meta: parentStudy.meta,
    content,
  };
}

export function hasDesignDoc(locale: string, slug: string): boolean {
  if (!isValidSlug(slug)) return false;
  const dir = path.join(contentDir, "projects", slug);
  return resolveContentPath(dir, locale, `design.${locale}.mdx`) !== null;
}

export function getDesignDoc(
  locale: string,
  slug: string
): { meta: CaseStudyMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const dir = path.join(contentDir, "projects", slug);
  const filePath = resolveContentPath(dir, locale, `design.${locale}.mdx`);
  if (!filePath) return null;

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
  const dir = path.join(contentDir, "about");
  const effectiveLocale = resolveContentLocale(dir, locale);
  const filePath = path.join(dir, `${effectiveLocale}.mdx`);
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
