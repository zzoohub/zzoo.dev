import { useTranslations } from "next-intl";
import type { ProjectMeta } from "@/lib/content";
import { proseClassName } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TagList } from "@/components/shared/tag-list";
import { Comments } from "@/components/shared/comments";
import { D2Diagram } from "./d2-diagram";
import { ProjectDetailTabs } from "./project-detail-tabs";
import { ProjectImageGallery } from "./project-image-gallery";
import { FeatureGrid } from "./feature-grid";
import { ProductCTA } from "./product-cta";
import { VideoEmbed } from "./video-embed";
import { ProjectTitle } from "./project-title";

export function ProjectDetailContent({
  meta,
  overviewContent,
  designContent,
  engineeringContent,
  hasDesign,
  hasEngineering,
}: {
  meta: ProjectMeta;
  overviewContent: React.ReactNode;
  designContent: React.ReactNode;
  engineeringContent: React.ReactNode;
  hasDesign: boolean;
  hasEngineering: boolean;
}) {
  const t = useTranslations("project");

  const hasMultipleTabs = hasDesign || hasEngineering;

  const fullOverviewContent = (
    <div className="space-y-12">
      <div className={proseClassName}>{overviewContent}</div>

      {meta.features && meta.features.length > 0 && (
        <FeatureGrid features={meta.features} heading={t("features")} />
      )}

      {meta.video && <VideoEmbed url={meta.video} title={meta.title} />}

      {meta.cta && (
        <ProductCTA
          primary={meta.cta.primary}
          secondary={meta.cta.secondary}
          heading={t("get_started")}
        />
      )}
    </div>
  );

  return (
    <section className="py-10 md:py-16">
      <div className="content-container">
        <Breadcrumb
          parentHref="/projects"
          parentLabel={t("breadcrumb_projects")}
          currentLabel={meta.title}
        />

        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <ProjectTitle title={meta.title} />
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {meta.description}
          </p>

          <div className="mt-6">
            <TagList tags={meta.tags} />
          </div>
        </header>

        {meta.images && meta.images.length > 0 && (
          <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <ProjectImageGallery images={meta.images} alt={meta.title} />
            </div>
          </div>
        )}

        <div className="mt-10" />

        {hasMultipleTabs ? (
          <ProjectDetailTabs
            overviewLabel={t("tab_overview")}
            designLabel={t("tab_design")}
            engineeringLabel={t("tab_engineering")}
            overviewContent={fullOverviewContent}
            designContent={designContent}
            engineeringContent={
              <>
                {engineeringContent}
                {meta.d2Diagram && (
                  <section className="mt-12">
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                      {t("architecture")}
                    </h2>
                    <div className="mt-6">
                      <D2Diagram name={meta.d2Diagram} />
                    </div>
                  </section>
                )}
              </>
            }
            hasDesign={hasDesign}
            hasEngineering={hasEngineering}
          />
        ) : (
          fullOverviewContent
        )}

        <Comments />
      </div>
    </section>
  );
}
