"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { hasLocale, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const localeConfig: Record<string, { flag: string; label: string }> = {
  en: { flag: "\u{1F1FA}\u{1F1F8}", label: "EN" },
  es: { flag: "\u{1F1EA}\u{1F1F8}", label: "ES" },
  "pt-BR": { flag: "\u{1F1E7}\u{1F1F7}", label: "PT" },
  id: { flag: "\u{1F1EE}\u{1F1E9}", label: "ID" },
  ja: { flag: "\u{1F1EF}\u{1F1F5}", label: "JA" },
  ko: { flag: "\u{1F1F0}\u{1F1F7}", label: "KO" },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onChange(value: string) {
    if (hasLocale(routing.locales, value)) {
      router.replace(pathname, { locale: value });
    }
  }

  return (
    <select
      value={locale}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 appearance-none items-center rounded-md bg-transparent px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none"
      aria-label="Select language"
    >
      {routing.locales.map((loc) => {
        const cfg = localeConfig[loc];
        return (
          <option key={loc} value={loc}>
            {cfg ? `${cfg.flag} ${cfg.label}` : loc.toUpperCase()}
          </option>
        );
      })}
    </select>
  );
}
