interface TimelineEntry {
  period: string;
  title: string;
  company: string;
  description: string;
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative ml-4 border-l-2 border-border pl-8 space-y-8">
      {entries.map((entry, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
          <p className="font-mono text-sm text-muted-foreground">
            {entry.period}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
          <p className="text-sm text-muted-foreground">{entry.company}</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {entry.description}
          </p>
        </div>
      ))}
    </div>
  );
}
