import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main"
      className="fixed left-4 top-0 z-50 -translate-y-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform focus:top-4 focus:translate-y-0"
    >
      {t("skip_to_main")}
    </a>
  );
}
