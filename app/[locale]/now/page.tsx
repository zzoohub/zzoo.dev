import { useTranslations } from "next-intl";
import { AvailabilityBadge } from "@/components/availability-badge";
import { CTASection } from "@/components/cta-section";

export default function NowPage() {
  const t = useTranslations("now");

  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
            {t("last_updated")}: February 14, 2026
          </p>

          {/* Availability banner */}
          <div className="mt-8 rounded-lg bg-muted p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">Open for New Projects</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Currently scheduling for March 2026 start dates. Priority
                  given to SaaS MVP builds and technical strategy audits.
                </p>
              </div>
              <AvailabilityBadge size="md" />
            </div>
          </div>

          {/* Working On */}
          <h2 className="mt-12 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <span aria-hidden="true">&lt;/&gt;</span>
            {t("working_on")}
          </h2>
          <ul className="mt-4 space-y-4">
            <li className="border-l-2 border-border pl-4">
              <p className="font-semibold">
                ScaleKit UI
              </p>
              <p className="text-sm text-muted-foreground">
                Developing a component library specifically for data-heavy
                dashboard applications. Focusing on accessible data grids and
                virtualization performance.
              </p>
            </li>
            <li className="border-l-2 border-border pl-4">
              <p className="font-semibold">
                Client Project: FinTech Migration
              </p>
              <p className="text-sm text-muted-foreground">
                Consulting for a Seoul-based startup to migrate their legacy
                monolithic architecture to a modular serverless setup on AWS.
              </p>
            </li>
          </ul>

          {/* Learning */}
          <h2 className="mt-12 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <span aria-hidden="true">&#9675;</span>
            {t("learning")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold">Rust</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Working through &quot;Rust for Rustaceans&quot;. Exploring
                memory safety patterns for embedded systems.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold">WebGPU</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Experimenting with compute shaders for browser-based data
                visualizations.
              </p>
            </div>
          </div>

          {/* Reading */}
          <h2 className="mt-12 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <span aria-hidden="true">&#9632;</span>
            {t("reading")}
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-1 h-8 w-8 rounded bg-muted" />
              <div>
                <p className="font-medium">
                  The Staff Engineer&apos;s Path
                </p>
                <p className="text-sm text-muted-foreground">by Tanya Reilly</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-8 w-8 rounded bg-muted" />
              <div>
                <p className="font-medium">
                  Wait But Why: The Story of Us
                </p>
                <p className="text-sm text-muted-foreground">
                  Long-form blog series
                </p>
              </div>
            </li>
          </ul>

          {/* Available For */}
          <h2 className="mt-12 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <span aria-hidden="true">&#9679;</span>
            {t("available_for")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              "MVP Development",
              "Technical Consultation",
              "Code Audits",
              "Performance Tuning",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {item}
              </span>
            ))}
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
