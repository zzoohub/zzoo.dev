import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { buildPageMeta } from "@/lib/seo";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CTASection } from "@/components/cta-section";

const titles: Record<string, string> = { en: "Now", ko: "현재" };
const descriptions: Record<string, string> = {
  en: "What I'm currently working on, learning, and available for.",
  ko: "지금 하고 있는 것, 배우는 것, 가능한 일.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMeta({
    locale,
    pathname: "/now",
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
  });
}

export default async function NowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NowPageContent />;
}

function NowPageContent() {
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
