"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { BlogPostMeta } from "@/lib/types";
import { TagFilter } from "@/components/tag-filter";
import { BlogPostItem } from "@/components/blog-post-item";
import { CTASection } from "@/components/cta-section";

export function BlogListClient({
  posts,
  allTags,
}: {
  posts: BlogPostMeta[];
  allTags: string[];
}) {
  const t = useTranslations("blog");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <TagFilter
              tags={allTags}
              activeTag={activeTag}
              onTagChange={setActiveTag}
              allLabel={t("all")}
            />
          </div>

          <div className="mt-10">
            {filtered.map((post) => (
              <BlogPostItem key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={t("bottom_cta_title")}
        buttonText={t("bottom_cta_button")}
      />
    </>
  );
}
