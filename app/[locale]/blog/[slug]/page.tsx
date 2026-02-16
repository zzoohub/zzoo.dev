import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllBlogPosts, getBlogPost } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const enPosts = getAllBlogPosts("en");
  const koPosts = getAllBlogPosts("ko");
  return [
    ...enPosts.map((p) => ({ slug: p.slug })),
    ...koPosts.map((p) => ({ slug: p.slug })),
  ];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
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

  return (
    <BlogPostContent
      meta={post.meta}
      content={mdxContent}
      prevPost={prevPost}
      nextPost={nextPost}
    />
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
          <div className="prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary">
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
        </div>
      </article>

    </>
  );
}
