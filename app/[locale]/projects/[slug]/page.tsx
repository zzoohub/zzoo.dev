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
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/shared/json-ld";
import { D2Diagram } from "@/components/project/d2-diagram";
import { ProjectDetailTabs } from "@/components/project/project-detail-tabs";
import { ProjectImageGallery } from "@/components/project/project-image-gallery";
import { FeatureGrid } from "@/components/project/feature-grid";

import { ProductCTA } from "@/components/project/product-cta";
import { VideoEmbed } from "@/components/project/video-embed";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ProjectMeta } from "@/lib/types";
import { Comments } from "@/components/shared/comments";
import { ProjectTitle } from "@/components/project/project-title";
import { proseClassName } from "@/lib/utils";
import { generateContentStaticParams } from "@/lib/static-params";

const mdxOptions = {
  parseFrontmatter: false,
  mdxOptions: { remarkPlugins: [remarkGfm] },
};

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
  const { content: overviewMdx } = await compileMDX({
    source: project.content,
    options: mdxOptions,
  });

  // Compile design content (design.en.mdx / design.ko.mdx)
  const designDoc = getDesignContent(locale, slug);
  let designMdx: React.ReactNode = null;
  if (designDoc) {
    const { content: compiled } = await compileMDX({
      source: designDoc.content,
      options: mdxOptions,
    });
    designMdx = compiled;
  }

  // Compile engineering doc (engineering.en.mdx / engineering.ko.mdx)
  const engineeringDoc = getEngineeringDoc(locale, slug);
  let engineeringMdx: React.ReactNode = null;
  if (engineeringDoc) {
    const { content: compiled } = await compileMDX({
      source: engineeringDoc.content,
      options: mdxOptions,
    });
    engineeringMdx = compiled;
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
        hasDesign={hasDesignContent(locale, slug)}
        hasEngineering={hasEngineeringDoc(locale, slug)}
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
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                href="/projects"
                className="transition-colors hover:text-foreground"
              >
                {t("breadcrumb_projects")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li className="text-foreground">{meta.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <ProjectTitle title={meta.title} />
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {meta.description}
          </p>

          {/* Tags */}
          {meta.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
