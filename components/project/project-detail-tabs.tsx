"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const proseClassName =
  "prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary";

export function ProjectDetailTabs({
  overviewLabel,
  designLabel,
  engineeringLabel,
  overviewContent,
  designContent,
  engineeringContent,
  hasDesign,
  hasEngineering,
}: {
  overviewLabel: string;
  designLabel: string;
  engineeringLabel: string;
  overviewContent: React.ReactNode;
  designContent: React.ReactNode;
  engineeringContent: React.ReactNode;
  hasDesign: boolean;
  hasEngineering: boolean;
}) {
  return (
    <Tabs defaultValue="overview" className="gap-0">
      <TabsList
        variant="line"
        className="h-12 gap-4 border-b border-border pb-0"
      >
        <TabsTrigger
          value="overview"
          className="px-1 pb-3 text-base font-semibold"
        >
          {overviewLabel}
        </TabsTrigger>
        {hasDesign && (
          <TabsTrigger
            value="design"
            className="px-1 pb-3 text-base font-semibold"
          >
            {designLabel}
          </TabsTrigger>
        )}
        {hasEngineering && (
          <TabsTrigger
            value="engineering"
            className="px-1 pb-3 text-base font-semibold"
          >
            {engineeringLabel}
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="overview" className="pt-8">
        {overviewContent}
      </TabsContent>
      {hasDesign && (
        <TabsContent value="design" className="pt-8">
          <div className={proseClassName}>{designContent}</div>
        </TabsContent>
      )}
      {hasEngineering && (
        <TabsContent value="engineering" className="pt-8">
          <div className={proseClassName}>{engineeringContent}</div>
        </TabsContent>
      )}
    </Tabs>
  );
}
