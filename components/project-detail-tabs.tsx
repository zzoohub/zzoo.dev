"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const proseClassName =
  "prose prose-lg prose-neutral dark:prose-invert prose-custom prose-headings:tracking-tight prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary";

export function ProjectDetailTabs({
  productLabel,
  caseStudyLabel,
  designDocLabel,
  productContent,
  caseStudyContent,
  designDocContent,
  hasCaseStudy,
  hasDesignDoc,
}: {
  productLabel: string;
  caseStudyLabel: string;
  designDocLabel: string;
  productContent: React.ReactNode;
  caseStudyContent: React.ReactNode;
  designDocContent: React.ReactNode;
  hasCaseStudy: boolean;
  hasDesignDoc: boolean;
}) {
  return (
    <Tabs defaultValue="product" className="gap-0">
      <TabsList
        variant="line"
        className="h-12 gap-4 border-b border-border pb-0"
      >
        <TabsTrigger
          value="product"
          className="px-1 pb-3 text-base font-semibold"
        >
          {productLabel}
        </TabsTrigger>
        {hasCaseStudy && (
          <TabsTrigger
            value="case-study"
            className="px-1 pb-3 text-base font-semibold"
          >
            {caseStudyLabel}
          </TabsTrigger>
        )}
        {hasDesignDoc && (
          <TabsTrigger
            value="design-doc"
            className="px-1 pb-3 text-base font-semibold"
          >
            {designDocLabel}
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="product" className="pt-8">
        {productContent}
      </TabsContent>
      {hasCaseStudy && (
        <TabsContent value="case-study" className="pt-8">
          <div className={proseClassName}>{caseStudyContent}</div>
        </TabsContent>
      )}
      {hasDesignDoc && (
        <TabsContent value="design-doc" className="pt-8">
          <div className={proseClassName}>{designDocContent}</div>
        </TabsContent>
      )}
    </Tabs>
  );
}
