import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/types";
import { ProjectTitle } from "@/components/project/project-title";

const CATEGORY_LABELS: Record<string, string> = {
  "mobile-app": "Mobile App",
  "chrome-extension": "Chrome Extension",
  web: "Web",
  cli: "CLI",
};

export function ProjectCard({ project }: { project: ProjectMeta }) {
  const categoryLabel = project.category ? CATEGORY_LABELS[project.category] ?? project.category : undefined;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-border p-6 transition-all duration-150 hover:border-primary/20 hover:shadow-sm md:p-8"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {categoryLabel && (
          <>
            <span>{categoryLabel}</span>
            <span aria-hidden="true">&middot;</span>
          </>
        )}
        <span className="capitalize">{project.status}</span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime={project.launchDate}>
          {new Date(project.launchDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </time>
      </div>

      <h3 className="mt-3 text-xl font-semibold group-hover:text-primary transition-colors duration-150 md:text-2xl">
        <ProjectTitle title={project.title} />
      </h3>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>

      {project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
