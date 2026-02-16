import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllPRDSlugs, getCaseStudyPRD } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const prdSlugs = getAllPRDSlugs();
  return prdSlugs.map((p) => ({ slug: p.slug }));
}

export default async function PRDPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const prd = getCaseStudyPRD(locale, slug);

  if (!prd) notFound();

  const { content: mdxContent } = await compileMDX({
    source: prd.content,
    options: { parseFrontmatter: false },
  });

  return <PRDContent meta={prd.meta} content={mdxContent} slug={slug} />;
}

function PRDContent({
  meta,
  content,
  slug,
}: {
  meta: NonNullable<ReturnType<typeof getCaseStudyPRD>>["meta"];
  content: React.ReactNode;
  slug: string;
}) {
  const t = useTranslations("project");

  return (
    <article className="py-10 md:py-16">
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
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li>
              <Link
                href={`/projects/${slug}`}
                className="transition-colors hover:text-foreground"
              >
                {meta.title}
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li className="text-foreground">PRD</li>
          </ol>
        </nav>

        {/* Header */}
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("prd_available")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {meta.title}
          </h1>
        </header>

        {/* Divider */}
        <hr className="my-10 border-border" />

        {/* MDX Content */}
        <div className="prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary">
          {content}
        </div>
      </div>
    </article>
  );
}
