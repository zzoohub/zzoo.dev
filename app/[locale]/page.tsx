import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getAllCaseStudies, getTestimonials } from "@/lib/content";
import { getLocale } from "next-intl/server";
import { AvailabilityBadge } from "@/components/availability-badge";
import { Section } from "@/components/section";
import { ProjectCard } from "@/components/project-card";
import { Testimonial } from "@/components/testimonial";
import { CTASection } from "@/components/cta-section";

export default async function HomePage() {
  const locale = await getLocale();
  const projects = getAllCaseStudies(locale).filter((p) => p.featured);
  const testimonials = getTestimonials().filter((t) => t.featured);

  return <HomeContent projects={projects} testimonial={testimonials[0]} />;
}

function HomeContent({
  projects,
  testimonial,
}: {
  projects: Awaited<ReturnType<typeof getAllCaseStudies>>;
  testimonial?: Awaited<ReturnType<typeof getTestimonials>>[number];
}) {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl md:max-w-2xl">
            <AvailabilityBadge size="md" />

            <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
              {t("hero.title")}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
              >
                {t("hero.cta_primary")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-medium transition-colors duration-150 hover:bg-muted"
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

      {/* Bottom CTA */}
      <CTASection
        title={t("home.bottom_cta_title")}
        subtitle={t("home.bottom_cta_subtitle")}
        buttonText={t("home.bottom_cta_button")}
      />
    </>
  );
}
