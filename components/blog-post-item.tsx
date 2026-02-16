import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { BlogPostMeta } from "@/lib/types";

export function BlogPostItem({ post }: { post: BlogPostMeta }) {
  const t = useTranslations("blog");

  return (
    <article className="border-b border-border py-6 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">&middot;</span>
        <span aria-label={`${post.readingTime} minute read`}>
          {post.readingTime} {t("min_read")}
        </span>
      </div>

      <h3 className="mt-2 text-lg font-semibold md:text-xl">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors duration-150 hover:text-primary"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {post.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
