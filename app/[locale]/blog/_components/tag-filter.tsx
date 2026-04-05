"use client";

import { cn } from "@/lib/utils";

export function TagFilter({
  tags,
  activeTag,
  onTagChange,
  allLabel,
}: {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  allLabel: string;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter by tag"
    >
      <button
        role="tab"
        aria-selected={activeTag === null}
        onClick={() => onTagChange(null)}
        className={cn(
          "rounded-full px-3 py-1 text-sm transition-colors duration-150",
          activeTag === null
            ? "bg-primary text-primary-foreground"
            : "border border-border hover:bg-muted"
        )}
      >
        {allLabel}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          role="tab"
          aria-selected={activeTag === tag}
          onClick={() => onTagChange(tag)}
          className={cn(
            "rounded-full px-3 py-1 text-sm transition-colors duration-150",
            activeTag === tag
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:bg-muted"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
