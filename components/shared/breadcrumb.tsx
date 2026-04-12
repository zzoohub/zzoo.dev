import { Link } from "@/i18n/navigation";

export function Breadcrumb({
  parentHref,
  parentLabel,
  currentLabel,
}: {
  parentHref: string;
  parentLabel: string;
  currentLabel: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href={parentHref}
            className="transition-colors hover:text-foreground"
          >
            {parentLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="text-border">
          /
        </li>
        <li className="truncate text-foreground">{currentLabel}</li>
      </ol>
    </nav>
  );
}
