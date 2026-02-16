import { useTranslations } from "next-intl";
import { Timeline } from "@/components/timeline";
import { CTASection } from "@/components/cta-section";
import { ArrowDownToLine } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  const experience = [
    {
      period: t("exp_1_period"),
      title: t("exp_1_title"),
      company: t("exp_1_company"),
      description: t("exp_1_description"),
    },
    {
      period: t("exp_2_period"),
      title: t("exp_2_title"),
      company: t("exp_2_company"),
      description: t("exp_2_description"),
    },
    {
      period: t("exp_3_period"),
      title: t("exp_3_title"),
      company: t("exp_3_company"),
      description: t("exp_3_description"),
    },
    {
      period: t("exp_4_period"),
      title: t("exp_4_title"),
      company: t("exp_4_company"),
      description: t("exp_4_description"),
    },
  ];

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h1>

          {/* Bio */}
          <div className="mt-8 space-y-4 text-base leading-7 text-muted-foreground">
            <p>{t("bio_1")}</p>
            <p>{t("bio_2")}</p>
            <p>{t("bio_3")}</p>
          </div>

          {/* Experience */}
          <h2 className="mt-16 text-2xl font-bold">{t("experience")}</h2>
          <div className="mt-8">
            <Timeline entries={experience} />
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
