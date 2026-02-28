import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getAllBlogPosts, getBlogPost } from "@/lib/content";
import {
  buildPageMeta,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
} from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { siteConfig } from "@/lib/site-config";
import { Comments } from "@/components/shared/comments";
import { proseClassName } from "@/lib/utils";
import { generateContentStaticParams } from "@/lib/static-params";

export async function generateStaticParams() {
  return generateContentStaticParams((locale) => getAllBlogPosts(locale));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getBlogPost(locale, slug);
  if (!post) return {};
  return buildPageMeta({
    locale,
    pathname: `/blog/${slug}`,
    title: post.meta.title,
    description: post.meta.description,
    type: "article",
    publishedTime: post.meta.date,
    tags: post.meta.tags,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const post = getBlogPost(locale, slug);

  if (!post) notFound();

  const { content: mdxContent } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const allPosts = getAllBlogPosts(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const pageUrl = buildCanonicalUrl(locale, `/blog/${slug}`);

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd({
          title: post.meta.title,
          description: post.meta.description,
          url: pageUrl,
          datePublished: post.meta.date,
          tags: post.meta.tags,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: buildCanonicalUrl(locale, "/blog") },
          { name: post.meta.title, url: pageUrl },
        ])}
      />
      <BlogPostContent
        meta={post.meta}
        content={mdxContent}
        prevPost={prevPost}
        nextPost={nextPost}
      />
    </>
  );
}

function BlogPostContent({
  meta,
  content,
  prevPost,
  nextPost,
}: {
  meta: NonNullable<ReturnType<typeof getBlogPost>>["meta"];
  content: React.ReactNode;
  prevPost: { slug: string; title: string } | null;
  nextPost: { slug: string; title: string } | null;
}) {
  const t = useTranslations("blog");

  return (
    <>
      <article className="py-10 md:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">/</li>
              <li className="truncate text-foreground">{meta.title}</li>
            </ol>
          </nav>

          {/* Post header */}
          <header>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={meta.date}>
                {new Date(meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>
                {meta.readingTime} {t("min_read")}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {meta.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Divider */}
          <hr className="my-10 border-border" />

          {/* MDX Content */}
          <div className={proseClassName}>
            {content}
          </div>

          {/* Previous / Next */}
          <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Previous
                </p>
                <p className="mt-1.5 text-sm font-medium group-hover:text-primary transition-colors">{prevPost.title}</p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Next</p>
                <p className="mt-1.5 text-sm font-medium group-hover:text-primary transition-colors">{nextPost.title}</p>
              </Link>
            )}
          </nav>

          {/* Comments */}
          <Comments />
        </div>
      </article>

    </>
  );
}
