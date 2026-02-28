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

export function toDateString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return String(value);
}

const CJK_LOCALES = new Set(["ko", "ja"]);

export function calculateReadingTime(content: string, locale: string): number {
  if (CJK_LOCALES.has(locale)) {
    return Math.ceil(content.length / 300);
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200);
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

export function sanitizeLinks(
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

export function sanitizeImages(images: unknown): string[] | undefined {
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

export function sanitizeCta(
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

export function sanitizeCompetitors(
  competitors: unknown
): Array<{ name: string; differentiator: string }> | undefined {
  if (!Array.isArray(competitors)) return undefined;
  const valid = competitors.filter(
    (c): c is { name: string; differentiator: string } =>
      c && typeof c === "object" && typeof c.name === "string" && typeof c.differentiator === "string"
  );
  return valid.length > 0 ? valid : undefined;
}

export function sanitizeFeatures(
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

export function sanitizeKeywords(
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

export function resolveProjectImage(value: string, slug: string): string {
  if (value.startsWith("//")) return "";
  if (value.startsWith("/")) return value;
  if (value.includes("..")) return "";
  return `/images/projects/${slug}/${value}`;
}

export function sanitizeVideo(video: unknown): string | undefined {
  return isYouTubeEmbedUrl(video) ? video : undefined;
}
