import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  getAllProjects,
  getProject,
  getDesignContent,
  hasDesignContent,
  getEngineeringDoc,
  hasEngineeringDoc,
} from "@/lib/content";
import {
  buildPageMeta,
  buildProjectJsonLd,
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
} from "@/lib/seo";
import { siteConfig, projectTabDefaults } from "@/lib/site-config";
import { JsonLd } from "@/components/shared/json-ld";
import { compileMdx } from "@/lib/mdx";
import { generateContentStaticParams } from "@/lib/static-params";
import { ProjectDetailContent } from "../_components/project-detail-content";

export async function generateStaticParams() {
  return generateContentStaticParams((locale) => getAllProjects(locale));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProject(locale, slug);
  if (!project) return {};

  const allKeywords = [
    ...(project.meta.keywords?.primary ?? []),
    ...(project.meta.keywords?.longTail ?? []),
  ];

  return {
    ...buildPageMeta({
      locale,
      pathname: `/projects/${slug}`,
      title: project.meta.title,
      description: project.meta.description,
    }),
    ...(allKeywords.length > 0 ? { keywords: allKeywords } : {}),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const project = getProject(locale, slug);

  if (!project) notFound();

  // Compile main overview content (en.mdx / ko.mdx)
  const overviewMdx = await compileMdx(project.content);

  // Resolve tab visibility: central default AND per-project frontmatter AND file existence
  const tabsConfig = project.meta.tabs;
  const showDesign =
    (projectTabDefaults.design as boolean) &&
    (tabsConfig?.design !== false) &&
    hasDesignContent(locale, slug);
  const showEngineering =
    (projectTabDefaults.engineering as boolean) &&
    (tabsConfig?.engineering !== false) &&
    hasEngineeringDoc(locale, slug);

  // Compile design content (design.en.mdx / design.ko.mdx)
  let designMdx: React.ReactNode = null;
  if (showDesign) {
    const designDoc = getDesignContent(locale, slug);
    if (designDoc) {
      designMdx = await compileMdx(designDoc.content);
    }
  }

  // Compile engineering doc (engineering.en.mdx / engineering.ko.mdx)
  let engineeringMdx: React.ReactNode = null;
  if (showEngineering) {
    const engineeringDoc = getEngineeringDoc(locale, slug);
    if (engineeringDoc) {
      engineeringMdx = await compileMdx(engineeringDoc.content);
    }
  }

  const pageUrl = buildCanonicalUrl(locale, `/projects/${slug}`);
  const breadcrumbLabel = locale === "ko" ? "프로젝트" : "Projects";

  const projectJsonLd = buildProjectJsonLd({
    title: project.meta.title,
    description: project.meta.description,
    url: pageUrl,
    datePublished: project.meta.launchDate,
    techStack: project.meta.techStack,
    keywords: [
      ...project.meta.tags,
      ...(project.meta.keywords?.primary ?? []),
      ...(project.meta.keywords?.longTail ?? []),
    ],
    category: project.meta.category,
  });

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: breadcrumbLabel, url: buildCanonicalUrl(locale, "/projects") },
          { name: project.meta.title, url: pageUrl },
        ])}
      />
      <ProjectDetailContent
        meta={project.meta}
        overviewContent={overviewMdx}
        designContent={designMdx}
        engineeringContent={engineeringMdx}
        hasDesign={showDesign}
        hasEngineering={showEngineering}
      />
    </>
  );
}
