import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const statusColors = {
  available: "bg-green-500",
  limited: "bg-amber-500",
  booked: "bg-red-500",
} as const;

export function AvailabilityBadge({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const t = useTranslations("availability");
  const status = siteConfig.availability;
  const dotColor = statusColors[status];

  const text =
    status === "booked"
      ? t("booked", { date: siteConfig.bookedUntil ?? "" })
      : t(status);

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border",
        size === "sm" && "px-2.5 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-2 text-base"
      )}
    >
      <span
        className={cn("rounded-full", dotColor, "animate-pulse", {
          "h-1.5 w-1.5": size === "sm",
          "h-2 w-2": size === "md",
          "h-2.5 w-2.5": size === "lg",
        })}
        aria-hidden="true"
      />
      {text}
    </span>
  );
}
