import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CaseStudyMeta } from "@/lib/types";

export function ProjectCard({ project, showThumbnail = true }: { project: CaseStudyMeta; showThumbnail?: boolean }) {
  const thumbnail = showThumbnail ? project.thumbnail : undefined;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-border p-6 transition-all duration-150 hover:border-primary/20 hover:shadow-sm md:p-8"
    >
      <article className={thumbnail ? "flex flex-col gap-6 sm:flex-row" : undefined}>
        {thumbnail && (
          <div className="h-24 min-w-24 max-w-[calc(6rem*16/9)] shrink-0 overflow-hidden rounded-lg sm:h-28 sm:min-w-28 sm:max-w-[calc(7rem*16/9)] md:h-32 md:min-w-32 md:max-w-[calc(8rem*16/9)]">
            <Image
              src={thumbnail}
              alt={project.title}
              width={0}
              height={0}
              sizes="224px"
              className="h-full w-auto transition-transform duration-150 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
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
        </div>
      </article>
    </Link>
  );
}
