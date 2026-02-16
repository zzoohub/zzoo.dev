import { Link } from "@/i18n/navigation";
import type { CaseStudyMeta } from "@/lib/types";

export function ProjectCard({ project }: { project: CaseStudyMeta }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-border p-6 transition-all duration-150 hover:border-primary/20 hover:shadow-sm md:p-8"
    >
      <article>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{project.clientType}</span>
          <span aria-hidden="true">&middot;</span>
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
          {project.title}
        </h3>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
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
      </article>
    </Link>
  );
}
