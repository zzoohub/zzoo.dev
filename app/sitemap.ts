import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllBlogPosts, getAllCaseStudies } from "@/lib/content";

const locales = ["en", "ko"] as const;

function entry(
  pathname: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const clean = pathname === "/" ? "" : pathname;
    languages[loc] = `${siteConfig.url}/${loc}${clean}`;
  }

  return {
    url: `${siteConfig.url}/en${pathname === "/" ? "" : pathname}`,
    lastModified: lastModified ?? new Date().toISOString(),
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    entry("/", "weekly", 1.0),
    entry("/projects", "weekly", 0.9),
    entry("/blog", "weekly", 0.9),
    entry("/about", "monthly", 0.8),
    entry("/now", "weekly", 0.7),
    entry("/contact", "monthly", 0.6),
  ];

  const blogPosts = getAllBlogPosts("en").map((post) =>
    entry(`/blog/${post.slug}`, "monthly", 0.7, post.date)
  );

  const projects = getAllCaseStudies("en").map((project) =>
    entry(`/projects/${project.slug}`, "monthly", 0.8, project.launchDate)
  );

  return [...staticPages, ...blogPosts, ...projects];
}
