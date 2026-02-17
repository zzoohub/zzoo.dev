import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getAllCaseStudies } from "@/lib/content";
import { buildPageMeta } from "@/lib/seo";
import { ProjectCard } from "@/components/project-card";

const titles: Record<string, string> = { en: "Projects", ko: "프로젝트" };
const descriptions: Record<string, string> = {
  en: "Ideas I turned into products.",
  ko: "아이디어를 제품으로 만든 기록.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMeta({
    locale,
    pathname: "/projects",
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = getAllCaseStudies(locale);

  return <ProjectsContent projects={projects} />;
}

function ProjectsContent({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getAllCaseStudies>>;
}) {
  const t = useTranslations("projects");

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

          <div className="mt-12 space-y-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
