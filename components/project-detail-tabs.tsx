"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ProjectDetailTabs({
  overviewLabel,
  designDocLabel,
  overviewContent,
  designDocContent,
}: {
  overviewLabel: string;
  designDocLabel: string;
  overviewContent: React.ReactNode;
  designDocContent: React.ReactNode;
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
        <TabsTrigger
          value="design-doc"
          className="px-1 pb-3 text-base font-semibold"
        >
          {designDocLabel}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-8">
        <div className="prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary">
          {overviewContent}
        </div>
      </TabsContent>
      <TabsContent value="design-doc" className="pt-8">
        <div className="prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary">
          {designDocContent}
        </div>
      </TabsContent>
    </Tabs>
  );
}
