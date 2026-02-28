import { routing } from "@/i18n/routing";

export function generateContentStaticParams(
  getAll: (locale: string) => { slug: string }[]
) {
  return routing.locales.flatMap((locale) =>
    getAll(locale).map((item) => ({ slug: item.slug }))
  );
}
