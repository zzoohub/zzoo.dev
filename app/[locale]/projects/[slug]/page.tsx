import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllCaseStudies, getCaseStudy, hasPRD } from "@/lib/content";
import { CTASection } from "@/components/cta-section";
import { D2Diagram } from "@/components/d2-diagram";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ExternalLink, Github, FileText } from "lucide-react";

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

  const { content: mdxContent } = await compileMDX({
    source: study.content,
    options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const hasPrd = hasPRD(locale, slug);

  return (
    <ProjectDetailContent
      meta={study.meta}
      content={mdxContent}
      slug={slug}
      hasPrd={hasPrd}
    />
  );
}

function ProjectDetailContent({
  meta,
  content,
  slug,
  hasPrd,
}: {
  meta: NonNullable<ReturnType<typeof getCaseStudy>>["meta"];
  content: React.ReactNode;
  slug: string;
  hasPrd: boolean;
}) {
  const t = useTranslations("project");

  return (
    <>
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
                  Projects
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">/</li>
              <li className="text-foreground">{meta.title}</li>
            </ol>
          </nav>

          {/* Header */}
          <header>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{meta.clientType}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{meta.duration}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="capitalize">{meta.status}</span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
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
          <hr className="my-10 border-border" />

          {/* MDX Content */}
          <div className="prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary">
            {content}
          </div>

          {/* Architecture Diagram */}
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

          {/* PRD Callout */}
          {hasPrd && (
            <section className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
              <h3 className="text-lg font-semibold">{t("prd_available")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("prd_description")}
              </p>
              <Link
                href={`/projects/${slug}/prd`}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <FileText className="size-4" />
                {t("view_prd")}
              </Link>
            </section>
          )}
        </div>
      </section>

      <CTASection
        title={t("bottom_cta_title")}
        subtitle={t("bottom_cta_subtitle")}
        buttonText={t("bottom_cta_button")}
        mailtoSubject={`Re: ${meta.title}`}
      />
    </>
  );
}
