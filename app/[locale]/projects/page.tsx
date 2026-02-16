import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { getAllCaseStudies } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";


export default async function ProjectsPage() {
  const locale = await getLocale();
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
