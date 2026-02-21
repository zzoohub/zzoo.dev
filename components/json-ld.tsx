export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Data comes from trusted internal config (lib/seo.ts, lib/site-config.ts)
  // and sanitized frontmatter (lib/content.ts). Escaping </script> prevents
  // HTML structure breakage if content ever contains that sequence.
  const safe = JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
