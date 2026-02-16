import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  getAllCaseStudies,
  getCaseStudy,
  getDesignDoc,
  hasDesignDoc,
} from "@/lib/content";
import { D2Diagram } from "@/components/d2-diagram";
import { ProjectDetailTabs } from "@/components/project-detail-tabs";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
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

  return (
    <ProjectDetailContent
      meta={study.meta}
      overviewContent={overviewMdx}
      designDocContent={designDocMdx}
      hasDesign={hasDesignDoc(locale, slug)}
      slug={slug}
    />
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
