import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CaseStudyMeta } from "./types";
import { projectFrontmatterSchema } from "./schemas";
import {
  contentDir,
  resolveContentPath,
  resolveContentLocale,
  isValidSlug,
  resolveProjectImage,
} from "./utils";

function parseCaseStudyMeta(data: Record<string, unknown>, slug: string): CaseStudyMeta {
  const parsed = projectFrontmatterSchema.parse(data);

  return {
    ...parsed,
    slug,
    thumbnail: parsed.thumbnail ? resolveProjectImage(parsed.thumbnail, slug) : undefined,
    images: parsed.images?.map((img) => resolveProjectImage(img, slug)),
    heroImage: parsed.heroImage ? resolveProjectImage(parsed.heroImage, slug) : undefined,
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
