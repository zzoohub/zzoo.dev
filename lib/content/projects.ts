import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ProjectMeta } from "./types";
import { projectFrontmatterSchema } from "./schemas";
import {
  contentDir,
  resolveContentPath,
  resolveContentLocale,
  isValidSlug,
  resolveProjectImage,
} from "./utils";

function parseProjectMeta(data: Record<string, unknown>, slug: string): ProjectMeta {
  const parsed = projectFrontmatterSchema.parse(data);

  return {
    ...parsed,
    slug,
    thumbnail: parsed.thumbnail ? resolveProjectImage(parsed.thumbnail, slug) : undefined,
    images: parsed.images?.map((img) => resolveProjectImage(img, slug)),
    heroImage: parsed.heroImage ? resolveProjectImage(parsed.heroImage, slug) : undefined,
  };
}

export function getAllProjects(locale: string): ProjectMeta[] {
  const dir = path.join(contentDir, "projects");
  if (!fs.existsSync(dir)) return [];

  const slugDirs = fs.readdirSync(dir).filter((entry) => {
    const entryPath = path.join(dir, entry);
    return fs.statSync(entryPath).isDirectory();
  });

  const seen = new Set<string>();
  const projects = slugDirs
    .map((slug) => {
      const slugDir = path.join(dir, slug);
      const effectiveLocale = resolveContentLocale(slugDir, locale);
      const filePath = path.join(slugDir, `${effectiveLocale}.mdx`);
      if (!fs.existsSync(filePath)) return null;
      if (seen.has(slug)) return null;
      seen.add(slug);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      return parseProjectMeta(data, slug);
    })
    .filter(Boolean) as ProjectMeta[];

  return projects.sort(
    (a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
  );
}

export function getProject(
  locale: string,
  slug: string
): { meta: ProjectMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const slugDir = path.join(contentDir, "projects", slug);
  const effectiveLocale = resolveContentLocale(slugDir, locale);
  const filePath = path.join(slugDir, `${effectiveLocale}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: parseProjectMeta(data, slug),
    content,
  };
}

type ProjectTabType = "design" | "engineering";

function hasTabContent(type: ProjectTabType, locale: string, slug: string): boolean {
  if (!isValidSlug(slug)) return false;
  const dir = path.join(contentDir, "projects", slug);
  return resolveContentPath(dir, locale, `${type}.${locale}.mdx`) !== null;
}

function getTabContent(
  type: ProjectTabType,
  locale: string,
  slug: string
): { meta: ProjectMeta; content: string } | null {
  if (!isValidSlug(slug)) return null;
  const dir = path.join(contentDir, "projects", slug);
  const filePath = resolveContentPath(dir, locale, `${type}.${locale}.mdx`);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  const project = getProject(locale, slug);
  if (!project) return null;

  return { meta: project.meta, content };
}

export function hasDesignContent(locale: string, slug: string): boolean {
  return hasTabContent("design", locale, slug);
}

export function getDesignContent(
  locale: string,
  slug: string
): { meta: ProjectMeta; content: string } | null {
  return getTabContent("design", locale, slug);
}

export function hasEngineeringDoc(locale: string, slug: string): boolean {
  return hasTabContent("engineering", locale, slug);
}

export function getEngineeringDoc(
  locale: string,
  slug: string
): { meta: ProjectMeta; content: string } | null {
  return getTabContent("engineering", locale, slug);
}
