import type { ReactNode } from "react";

export function Section({
  label,
  title,
  subtitle,
  children,
}: {
  label?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {label && (
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        )}
        {title && (
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
