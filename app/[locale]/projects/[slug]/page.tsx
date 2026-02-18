import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  getAllCaseStudies,
  getCaseStudy,
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
import { JsonLd } from "@/components/json-ld";
import { D2Diagram } from "@/components/d2-diagram";
import { ProjectDetailTabs } from "@/components/project-detail-tabs";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ProjectImageGallery } from "@/components/project-image-gallery";
import { ExternalLink, Github, FileText } from "lucide-react";

const mdxOptions = {
  parseFrontmatter: false,
  mdxOptions: { remarkPlugins: [remarkGfm] },
};

export async function generateStaticParams() {
  const enStudies = getAllCaseStudies("en");
  const koStudies = getAllCaseStudies("ko");
  return [
    ...enStudies.map((s) => ({ slug: s.slug })),
    ...koStudies.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const study = getCaseStudy(locale, slug);
  if (!study) return {};
  return buildPageMeta({
    locale,
    pathname: `/projects/${slug}`,
    title: study.meta.title,
    description: study.meta.description,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const study = getCaseStudy(locale, slug);

  if (!study) notFound();

  const { content: overviewMdx } = await compileMDX({
    source: study.content,
    options: mdxOptions,
  });

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

  return (
    <>
      <JsonLd
        data={buildProjectJsonLd({
          title: study.meta.title,
          description: study.meta.description,
          url: pageUrl,
          datePublished: study.meta.launchDate,
          techStack: study.meta.techStack,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: breadcrumbLabel, url: buildCanonicalUrl(locale, "/projects") },
          { name: study.meta.title, url: pageUrl },
        ])}
      />
      <ProjectDetailContent
        meta={study.meta}
        overviewContent={overviewMdx}
        designDocContent={designDocMdx}
        hasDesign={hasDesignDoc(locale, slug)}
        slug={slug}
      />
    </>
  );
}

function ProjectDetailContent({
  meta,
  overviewContent,
  designDocContent,
  hasDesign,
}: {
  meta: NonNullable<ReturnType<typeof getCaseStudy>>["meta"];
  overviewContent: React.ReactNode;
  designDocContent: React.ReactNode;
  hasDesign: boolean;
  slug: string;
}) {
  const t = useTranslations("project");

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

          {/* Product Links */}
          {meta.links && (
            <div className="mt-6 flex flex-wrap gap-3">
              {meta.links.live && (
                <a
                  href={meta.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ExternalLink className="size-4" />
                  {t("view_live")}
                </a>
              )}
              {meta.links.github && (
                <a
                  href={meta.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Github className="size-4" />
                  {t("view_source")}
                </a>
              )}
              {meta.links.docs && (
                <a
                  href={meta.links.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <FileText className="size-4" />
                  {t("documentation")}
                </a>
              )}
            </div>
          )}

          {/* Tech Stack */}
          <div className="mt-6 flex flex-wrap gap-2">
            {meta.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
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

        {/* Content — tabs if design doc exists, otherwise just overview */}
        {hasDesign && designDocContent ? (
          <ProjectDetailTabs
            overviewLabel={t("tab_overview")}
            designDocLabel={t("tab_design_doc")}
            overviewContent={overviewContent}
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
          />
        ) : (
          <div className="prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary">
            {overviewContent}
          </div>
        )}
      </div>
    </section>
  );
}
