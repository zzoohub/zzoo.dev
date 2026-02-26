import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "pt-BR", "id", "ja", "ko"],
  defaultLocale: "en",
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax" as const,
    secure: true,
  },
});
