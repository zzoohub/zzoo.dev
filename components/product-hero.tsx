import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface CtaButton {
  label: string;
  url: string;
}

export function ProductHero({
  tagline,
  heroImage,
  title,
  ctaPrimary,
  ctaSecondary,
}: {
  tagline: string;
  heroImage?: string;
  title: string;
  ctaPrimary?: CtaButton;
  ctaSecondary?: CtaButton;
}) {
  return (
    <section className="mt-6">
      <p className="text-lg font-medium leading-relaxed text-primary sm:text-xl">
        {tagline}
      </p>

      {(ctaPrimary || ctaSecondary) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {ctaPrimary && (
            <a
              href={ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="size-4" />
              {ctaPrimary.label}
            </a>
          )}
          {ctaSecondary && (
            <a
              href={ctaSecondary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-4" />
              {ctaSecondary.label}
            </a>
          )}
        </div>
      )}

      {heroImage && (
        <div className="mt-8 relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={heroImage}
            alt={title}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
            priority
          />
        </div>
      )}
    </section>
  );
}
