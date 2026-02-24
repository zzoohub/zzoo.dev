"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";

export function Comments() {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();

  return (
    <section className="mt-16 border-t border-border pt-8">
      <Giscus
        repo="zzoohub/zzoo.dev"
        repoId="R_kgDORQ-ciA"
        category="General"
        categoryId="DIC_kwDORQ-ciM4C3G_p"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang={locale === "ko" ? "ko" : "en"}
        loading="lazy"
      />
    </section>
  );
}
