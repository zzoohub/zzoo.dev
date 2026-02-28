import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  getAllCaseStudies,
  getCaseStudy,
  getCaseStudyContent,
  hasCaseStudy,
  getDesignDoc,
  hasDesignDoc,
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
import { CompetitorComparison } from "@/components/project/competitor-comparison";
import { ProductCTA } from "@/components/project/product-cta";
import { VideoEmbed } from "@/components/project/video-embed";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { CaseStudyMeta } from "@/lib/types";
import { Comments } from "@/components/shared/comments";

const mdxOptions = {
  parseFrontmatter: false,
  mdxOptions: { remarkPlugins: [remarkGfm] },
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllCaseStudies(locale).map((s) => ({ slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const study = getCaseStudy(locale, slug);
  if (!study) return {};

  const allKeywords = [
    ...(study.meta.keywords?.primary ?? []),
    ...(study.meta.keywords?.longTail ?? []),
  ];

  return {
    ...buildPageMeta({
      locale,
      pathname: `/projects/${slug}`,
      title: study.meta.title,
      description: study.meta.description,
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
  const study = getCaseStudy(locale, slug);

  if (!study) notFound();

  // Compile main marketing content (en.mdx / ko.mdx)
  const { content: productMdx } = await compileMDX({
    source: study.content,
    options: mdxOptions,
  });

  // Compile case study content (casestudy.en.mdx / casestudy.ko.mdx)
  const caseStudyDoc = getCaseStudyContent(locale, slug);
  let caseStudyMdx: React.ReactNode = null;
  if (caseStudyDoc) {
    const { content: compiled } = await compileMDX({
      source: caseStudyDoc.content,
      options: mdxOptions,
    });
    caseStudyMdx = compiled;
  }

  // Compile design doc (design.en.mdx / design.ko.mdx)
  const designDoc = getDesignDoc(locale, slug);
  let designDocMdx: React.ReactNode = null;
  if (designDoc) {
    const { content: compiled } = await compileMDX({
      source: designDoc.content,
      options: mdxOptions,
    });
    designDocMdx = compiled;
  }

  const pageUrl = buildCanonicalUrl(locale, `/projects/${slug}`);
  const breadcrumbLabel = locale === "ko" ? "프로젝트" : "Projects";

  const projectJsonLd = buildProjectJsonLd({
    title: study.meta.title,
    description: study.meta.description,
    url: pageUrl,
    datePublished: study.meta.launchDate,
    techStack: study.meta.techStack,
    keywords: [
      ...study.meta.tags,
      ...(study.meta.keywords?.primary ?? []),
      ...(study.meta.keywords?.longTail ?? []),
    ],
    category: study.meta.category,
  });

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: breadcrumbLabel, url: buildCanonicalUrl(locale, "/projects") },
          { name: study.meta.title, url: pageUrl },
        ])}
      />
      <ProjectDetailContent
        meta={study.meta}
        productContent={productMdx}
        caseStudyContent={caseStudyMdx}
        designDocContent={designDocMdx}
        hasCaseStudyContent={hasCaseStudy(locale, slug)}
        hasDesign={hasDesignDoc(locale, slug)}
        slug={slug}
      />
    </>
  );
}

function ProjectDetailContent({
  meta,
  productContent,
  caseStudyContent,
  designDocContent,
  hasCaseStudyContent,
  hasDesign,
}: {
  meta: CaseStudyMeta;
  productContent: React.ReactNode;
  caseStudyContent: React.ReactNode;
  designDocContent: React.ReactNode;
  hasCaseStudyContent: boolean;
  hasDesign: boolean;
  slug: string;
}) {
  const t = useTranslations("project");

  const hasMultipleTabs = hasCaseStudyContent || hasDesign;

  const proseClassName =
    "prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary";

  // Build the full product tab content with marketing components
  const fullProductContent = (
    <div className="space-y-12">
      {/* MDX body */}
      <div className={proseClassName}>{productContent}</div>

      {/* Feature grid */}
      {meta.features && meta.features.length > 0 && (
        <FeatureGrid features={meta.features} heading={t("features")} />
      )}

      {/* Competitor comparison */}
      {meta.competitors && meta.competitors.length > 0 && (
        <CompetitorComparison
          competitors={meta.competitors}
          heading={t("how_its_different")}
          vsLabel={t("vs")}
        />
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
            {meta.title}
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
            productLabel={t("tab_product")}
            caseStudyLabel={t("tab_case_study")}
            designDocLabel={t("tab_design_doc")}
            productContent={fullProductContent}
            caseStudyContent={caseStudyContent}
            designDocContent={
              <>
                {designDocContent}
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
            hasCaseStudy={hasCaseStudyContent}
            hasDesignDoc={hasDesign}
          />
        ) : (
          fullProductContent
        )}

        {/* Tech Stack */}
        {meta.techStack.length > 0 && (
          <p className="mt-12 text-sm text-muted-foreground">
            {t("built_with")}: {meta.techStack.join(", ")}
          </p>
        )}

        {/* Comments */}
        <Comments />
      </div>
    </section>
  );
}
