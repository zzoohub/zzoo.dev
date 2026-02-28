import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CaseStudyMeta } from "./types";
import {
  contentDir,
  resolveContentPath,
  resolveContentLocale,
  isValidSlug,
  toDateString,
  sanitizeLinks,
  sanitizeImages,
  sanitizeCta,
  sanitizeCompetitors,
  sanitizeFeatures,
  sanitizeKeywords,
  resolveProjectImage,
  sanitizeVideo,
} from "./utils";

function parseCaseStudyMeta(data: Record<string, unknown>, slug: string): CaseStudyMeta {
  const VALID_CATEGORIES = ["mobile-app", "chrome-extension", "web", "cli"] as const;
  const category = typeof data.category === "string" && (VALID_CATEGORIES as readonly string[]).includes(data.category)
    ? (data.category as CaseStudyMeta["category"])
    : undefined;

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    status: data.status as CaseStudyMeta["status"],
    tags: Array.isArray(data.tags)
      ? data.tags.filter((v): v is string => typeof v === "string")
      : [],
    techStack: Array.isArray(data.techStack)
      ? data.techStack.filter((v): v is string => typeof v === "string")
      : [],
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
    video: sanitizeVideo(data.video),
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
