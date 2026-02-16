import { useTranslations } from "next-intl";
import { CTASection } from "@/components/cta-section";
import { ArrowDownToLine } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>

          {/* Bio */}
          <div className="mt-8 space-y-4 text-base leading-7 text-muted-foreground">
            {t("bio_1") && <p>{t("bio_1")}</p>}
            {t("bio_2") && <p>{t("bio_2")}</p>}
            {t("bio_3") && <p>{t("bio_3")}</p>}
          </div>

          {/* Resume download */}
          <a
            href="/resume.pdf"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t("download_resume")}
            <ArrowDownToLine className="h-4 w-4" />
          </a>
        </div>
      </section>

      <CTASection
        title={t("bottom_cta_title")}
        subtitle={t("bottom_cta_subtitle")}
        buttonText={t("bottom_cta_button")}
      />
    </>
  );
}
