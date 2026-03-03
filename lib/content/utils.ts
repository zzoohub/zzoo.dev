import fs from "fs";
import path from "path";
import { routing } from "@/i18n/routing";

export const contentDir = path.join(process.cwd(), "content");
export const FALLBACK_LOCALE = "en";
export const ALLOWED_LOCALES = new Set<string>(routing.locales);

const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;

export function isValidSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

export function safeLocale(locale: string): string {
  return ALLOWED_LOCALES.has(locale) ? locale : FALLBACK_LOCALE;
}

/** Resolve a content file path, falling back to FALLBACK_LOCALE if the requested locale file doesn't exist. */
export function resolveContentPath(dir: string, locale: string, filename?: string): string | null {
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
export function resolveContentLocale(dir: string, locale: string): string {
  const loc = safeLocale(locale);
  const primary = path.join(dir, `${loc}.mdx`);
  if (fs.existsSync(primary)) return loc;
  return FALLBACK_LOCALE;
}

const CJK_LOCALES = new Set(["ko"]);

export function calculateReadingTime(content: string, locale: string): number {
  if (CJK_LOCALES.has(locale)) {
    return Math.ceil(content.length / 300);
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200);
}

export function resolveProjectImage(value: string, slug: string): string {
  if (value.startsWith("//")) return "";
  if (value.startsWith("/")) return value;
  if (value.includes("..")) return "";
  return `/images/projects/${slug}/${value}`;
}
