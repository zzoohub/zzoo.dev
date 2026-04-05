import { ExternalLink } from "lucide-react";

interface CtaButton {
  label: string;
  url: string;
}

export function ProductCTA({
  primary,
  secondary,
  heading,
}: {
  primary?: CtaButton;
  secondary?: CtaButton;
  heading: string;
}) {
  if (!primary && !secondary) return null;

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {primary && (
          <a
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ExternalLink className="size-4" />
            {primary.label}
          </a>
        )}
        {secondary && (
          <a
            href={secondary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ExternalLink className="size-4" />
            {secondary.label}
          </a>
        )}
      </div>
    </section>
  );
}
