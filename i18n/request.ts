import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

const MESSAGE_MAP: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("../messages/en.json"),
  es: () => import("../messages/es.json"),
  "pt-BR": () => import("../messages/pt-BR.json"),
  id: () => import("../messages/id.json"),
  ja: () => import("../messages/ja.json"),
  ko: () => import("../messages/ko.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await (MESSAGE_MAP[locale] ?? MESSAGE_MAP.en)()).default,
  };
});
