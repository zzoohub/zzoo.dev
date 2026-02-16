import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { CaseStudyMeta } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export function ProjectCard({ project }: { project: CaseStudyMeta }) {
  const t = useTranslations("projects");

  return (
    <article className="rounded-xl border border-border p-6 transition-all duration-150 hover:border-primary/20 hover:shadow-sm md:p-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{project.clientType}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{project.duration}</span>
        <span aria-hidden="true">&middot;</span>
        <span className="capitalize">{project.status}</span>
      </div>

      <h3 className="mt-3 text-xl font-semibold md:text-2xl">
        {project.title}
      </h3>

      <div className="mt-3 rounded-md bg-primary/10 px-4 py-2">
        <p className="text-base font-semibold text-foreground">
          {project.outcomeMetric}
        </p>
      </div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-muted px-2 py-0.5 text-xs"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 5 && (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
            +{project.techStack.length - 5}
          </span>
        )}
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/80"
      >
        {t("read_case_study")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
