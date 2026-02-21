interface Competitor {
  name: string;
  differentiator: string;
}

export function CompetitorComparison({
  competitors,
  heading,
  vsLabel,
}: {
  competitors: Competitor[];
  heading: string;
  vsLabel: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-6 space-y-4">
        {competitors.map((competitor) => (
          <div
            key={competitor.name}
            className="rounded-lg border border-border bg-card p-5"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {vsLabel} {competitor.name}
            </p>
            <p className="mt-1.5 text-base leading-relaxed">
              {competitor.differentiator}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
