import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
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
import { D2Diagram } from "../_components/d2-diagram";
import { ProjectDetailTabs } from "../_components/project-detail-tabs";
import { ProjectImageGallery } from "../_components/project-image-gallery";
import { FeatureGrid } from "../_components/feature-grid";

import { ProductCTA } from "../_components/product-cta";
import { VideoEmbed } from "../_components/video-embed";
import { compileMdx } from "@/lib/mdx";
import type { ProjectMeta } from "@/lib/types";
import { Comments } from "@/components/shared/comments";
import { ProjectTitle } from "../_components/project-title";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TagList } from "@/components/shared/tag-list";
import { proseClassName } from "@/lib/utils";
import { generateContentStaticParams } from "@/lib/static-params";

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
  // If any source says false, the tab is hidden
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
        slug={slug}
      />
    </>
  );
}

function ProjectDetailContent({
  meta,
  overviewContent,
  designContent,
  engineeringContent,
  hasDesign,
  hasEngineering,
}: {
  meta: ProjectMeta;
  overviewContent: React.ReactNode;
  designContent: React.ReactNode;
  engineeringContent: React.ReactNode;
  hasDesign: boolean;
  hasEngineering: boolean;
  slug: string;
}) {
  const t = useTranslations("project");

  const hasMultipleTabs = hasDesign || hasEngineering;

  // Build the full overview tab content with marketing components
  const fullOverviewContent = (
    <div className="space-y-12">
      {/* MDX body */}
      <div className={proseClassName}>{overviewContent}</div>

      {/* Feature grid */}
      {meta.features && meta.features.length > 0 && (
        <FeatureGrid features={meta.features} heading={t("features")} />
      )}


      {/* Video embed */}
      {meta.video && <VideoEmbed url={meta.video} title={meta.title} />}

      {/* Bottom CTA */}
      {meta.cta && (
        <ProductCTA
          primary={meta.cta.primary}
          secondary={meta.cta.secondary}
          heading={t("get_started")}
        />
      )}
    </div>
  );

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          parentHref="/projects"
          parentLabel={t("breadcrumb_projects")}
          currentLabel={meta.title}
        />

        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <ProjectTitle title={meta.title} />
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {meta.description}
          </p>

          {/* Tags */}
          <div className="mt-6">
            <TagList tags={meta.tags} />
          </div>
        </header>

        {/* Image Gallery */}
        {meta.images && meta.images.length > 0 && (
          <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <ProjectImageGallery images={meta.images} alt={meta.title} />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mt-10" />

        {/* Content — tabs if case study or design doc exists, otherwise just product content */}
        {hasMultipleTabs ? (
          <ProjectDetailTabs
            overviewLabel={t("tab_overview")}
            designLabel={t("tab_design")}
            engineeringLabel={t("tab_engineering")}
            overviewContent={fullOverviewContent}
            designContent={designContent}
            engineeringContent={
              <>
                {engineeringContent}
                {meta.d2Diagram && (
                  <section className="mt-12">
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                      {t("architecture")}
                    </h2>
                    <div className="mt-6">
                      <D2Diagram name={meta.d2Diagram} />
                    </div>
                  </section>
                )}
              </>
            }
            hasDesign={hasDesign}
            hasEngineering={hasEngineering}
          />
        ) : (
          fullOverviewContent
        )}

        {/* Comments */}
        <Comments />
      </div>
    </section>
  );
}
