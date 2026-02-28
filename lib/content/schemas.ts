import { z } from "zod";

// --- Helpers ---

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isYouTubeEmbedUrl(url: string): boolean {
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

const SAFE_IMAGE_PATH = /^[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|webp|svg|avif)$/i;

function isValidImagePath(v: string): boolean {
  if (v.startsWith("/")) {
    return v.startsWith("/images/") && !v.includes("..") && !v.startsWith("//");
  }
  return SAFE_IMAGE_PATH.test(v);
}

const urlSchema = z.string().refine(isValidUrl, { message: "Invalid URL" });

const ctaEntrySchema = z.object({
  label: z.string(),
  url: urlSchema,
});

// --- Date coercion ---

const dateSchema = z.union([z.date(), z.string(), z.number()]).transform((val) => {
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  return String(val);
});

// --- Blog ---

export const blogFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: dateSchema,
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

// --- Project ---

export const projectFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["active", "completed", "archived"]),
  tags: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  launchDate: dateSchema,
  thumbnail: z.string().refine(isValidImagePath, { message: "Invalid image path" }).optional().catch(undefined),
  images: z
    .array(z.string().refine(isValidImagePath, { message: "Invalid image path" }))
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .catch(undefined),
  d2Diagram: z.string().refine((v) => /^[a-zA-Z0-9._-]+$/.test(v), { message: "Invalid diagram name" }).optional().catch(undefined),
  links: z
    .object({
      live: urlSchema.optional().catch(undefined),
      github: urlSchema.optional().catch(undefined),
      docs: urlSchema.optional().catch(undefined),
    })
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      const entries = Object.entries(v).filter(([, val]) => val !== undefined);
      return entries.length > 0 ? (Object.fromEntries(entries) as typeof v) : undefined;
    })
    .catch(undefined),
  tagline: z.string().optional(),
  category: z.enum(["mobile-app", "chrome-extension", "web", "cli"]).optional().catch(undefined),
  keywords: z
    .object({
      primary: z.array(z.string()).optional(),
      longTail: z.array(z.string()).optional(),
    })
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      const hasPrimary = v.primary && v.primary.length > 0;
      const hasLongTail = v.longTail && v.longTail.length > 0;
      return hasPrimary || hasLongTail ? v : undefined;
    })
    .catch(undefined),
  competitors: z
    .array(
      z.object({
        name: z.string(),
        differentiator: z.string(),
      })
    )
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .catch(undefined),
  cta: z
    .object({
      primary: ctaEntrySchema.optional().catch(undefined),
      secondary: ctaEntrySchema.optional().catch(undefined),
    })
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      return v.primary || v.secondary ? v : undefined;
    })
    .catch(undefined),
  features: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .catch(undefined),
  heroImage: z.string().refine(isValidImagePath, { message: "Invalid image path" }).optional().catch(undefined),
  video: z
    .string()
    .refine(isYouTubeEmbedUrl, { message: "Must be a YouTube embed URL" })
    .optional()
    .catch(undefined),
});

// --- About ---

export const aboutFrontmatterSchema = z.object({
  experience: z
    .array(
      z.object({
        period: z.string(),
        title: z.string(),
        description: z.string(),
        current: z.boolean().optional(),
      })
    )
    .default([]),
});

// --- Testimonial ---

export const testimonialSchema = z.object({
  quote: z.string(),
  authorName: z.string(),
  authorRole: z.string(),
  authorCompany: z.string(),
  featured: z.boolean().optional(),
});
