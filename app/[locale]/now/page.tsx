import { useTranslations } from "next-intl";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CTASection } from "@/components/cta-section";

export default function NowPage() {
  const t = useTranslations("now");

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>

          {/* Availability banner */}
          <div className="mt-8 rounded-lg bg-muted p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <AvailabilityBadge size="md" />
            </div>
          </div>
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
