export function ProjectTitle({ title }: { title: string }) {
  const separatorIndex = title.indexOf(" — ");
  if (separatorIndex === -1) return <>{title}</>;

  const name = title.slice(0, separatorIndex);
  const subtitle = title.slice(separatorIndex);

  return (
    <>
      {name}
      <span className="text-muted-foreground font-normal">{subtitle}</span>
    </>
  );
}
