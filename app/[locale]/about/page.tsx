import { getLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAboutContent } from "@/lib/content";
import { CTASection } from "@/components/cta-section";
import type { ExperienceEntry } from "@/lib/types";

export default async function AboutPage() {
  const locale = await getLocale();
  const about = getAboutContent(locale);

  const mdxContent = about
    ? (
        await compileMDX({
          source: about.content,
          options: { parseFrontmatter: false },
        })
      ).content
    : null;

  return (
    <AboutPageContent
      content={mdxContent}
      experience={about?.experience ?? []}
    />
  );
}

function AboutPageContent({
  content,
  experience,
}: {
  content: React.ReactNode | null;
  experience: ExperienceEntry[];
}) {
  const t = useTranslations("about");

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>

          {/* Bio from MDX */}
          {content && (
            <div className="mt-8 space-y-4 text-base leading-7 text-muted-foreground [&>p]:mt-0 [&>p+p]:mt-4">
              {content}
            </div>
          )}

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold">{t("experience")}</h2>
              <div className="relative mt-6 border-l-2 border-border ml-1.5 space-y-10">
                {experience.map((entry) => (
                  <div key={entry.period} className="relative pl-8 group">
                    {/* Dot */}
                    <span
                      className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-background ${
                        entry.current
                          ? "bg-primary ring-1 ring-primary"
                          : "bg-background border-2 border-muted-foreground/40 group-hover:border-primary transition-colors"
                      }`}
                    />
                    <p
                      className={`font-mono text-xs font-bold uppercase tracking-wider ${
                        entry.current
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {entry.period}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <CTASection
        title={t("bottom_cta_title")}
        buttonText={t("bottom_cta_button")}
        size="sm"
      />
    </>
  );
}
