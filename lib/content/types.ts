import type { z } from "zod";
import type {
  blogFrontmatterSchema,
  projectFrontmatterSchema,
  aboutFrontmatterSchema,
  testimonialSchema,
} from "./schemas";

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  locale: string;
  readingTime: number;
};
export interface BlogPost extends BlogPostMeta {
  content: string;
}

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ProjectMeta = ProjectFrontmatter & {
  slug: string;
};
export interface Project extends ProjectMeta {
  content: string;
}

/** @deprecated Use ProjectMeta instead */
export type CaseStudyMeta = ProjectMeta;
/** @deprecated Use Project instead */
export type CaseStudy = Project;

export type ExperienceEntry = z.infer<typeof aboutFrontmatterSchema>["experience"][number];
export type AboutData = z.infer<typeof aboutFrontmatterSchema> & {
  content: string;
};

export type Testimonial = z.infer<typeof testimonialSchema>;
