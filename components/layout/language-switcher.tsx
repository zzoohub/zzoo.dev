"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const targetLocale = locale === "en" ? "ko" : "en";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: targetLocale })}
      className="flex h-9 items-center rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
      aria-label={`Switch to ${targetLocale === "en" ? "English" : "Korean"}`}
    >
      {targetLocale.toUpperCase()}
    </button>
  );
}
