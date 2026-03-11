import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hasLocale, useTranslations } from "next-intl";
import { getAllProjects, getTestimonials } from "@/lib/content";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  buildPageMeta,
  buildWebSiteJsonLd,
  buildPersonJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Section } from "@/components/shared/section";
import { ProjectCard } from "@/components/project/project-card";
import { Testimonial } from "@/components/shared/testimonial";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("home");
  return buildPageMeta({
    locale,
    pathname: "/",
    title: t("meta_title"),
    description: t("meta_description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const projects = getAllProjects(locale).filter((p) => p.featured);
  const testimonials = getTestimonials().filter((t) => t.featured);

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildPersonJsonLd()} />
      <HomeContent projects={projects} testimonial={testimonials[0]} />
    </>
  );
}

function HomeContent({
  projects,
  testimonial,
}: {
  projects: Awaited<ReturnType<typeof getAllProjects>>;
  testimonial?: Awaited<ReturnType<typeof getTestimonials>>[number];
}) {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <AvailabilityBadge size="md" />

            <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
              {t("hero.title")}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
              >
                {t("hero.cta_primary")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 font-medium transition-colors duration-150 hover:bg-muted"
              >
                {t("hero.cta_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <Section
          label={t("home.featured_label")}
          title={t("home.featured_title")}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>
      )}

      {/* Testimonial */}
      {testimonial && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Testimonial testimonial={testimonial} />
          </div>
        </section>
      )}

    </>
  );
}
