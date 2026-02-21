import type { Metadata } from "next";
import { siteConfig } from "./site-config";

const locales = ["en", "ko"] as const;

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

export function buildCanonicalUrl(locale: string, pathname: string): string {
  const clean = pathname === "/" ? "" : pathname;
  return `${siteConfig.url}/${locale}${clean}`;
}

export function buildAlternates(pathname: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const clean = pathname === "/" ? "" : pathname;
    languages[loc] = `${siteConfig.url}/${loc}${clean}`;
  }
  languages["x-default"] = `${siteConfig.url}/en${pathname === "/" ? "" : pathname}`;

  return {
    canonical: languages["en"],
    languages,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page metadata builder
// ---------------------------------------------------------------------------

interface PageMetaOptions {
  locale: string;
  pathname: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

export function buildPageMeta(options: PageMetaOptions): Metadata {
  const {
    locale,
    pathname,
    title,
    description,
    type = "website",
    publishedTime,
    tags,
  } = options;

  const url = buildCanonicalUrl(locale, pathname);

  return {
    title,
    description,
    alternates: buildAlternates(pathname),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      type: type === "article" ? "article" : "website",
      images: [
        {
          url: `${siteConfig.url}/og-default.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && publishedTime
        ? { publishedTime, tags }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/og-default.png`],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      "Full-stack developer and solopreneur specializing in scalable web applications and technical architecture.",
    inLanguage: ["en", "ko"],
  };
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "zzoo",
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    jobTitle: "Full-stack Developer & Solopreneur",
    knowsAbout: [
      "Full-stack Development",
      "React",
      "Next.js",
      "TypeScript",
      "AI-assisted Development",
      "Cloudflare Workers",
    ],
  };
}

interface ArticleJsonLdOptions {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  tags?: string[];
}

export function buildArticleJsonLd(options: ArticleJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished,
    author: {
      "@type": "Person",
      name: "zzoo",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: "zzoo",
      url: siteConfig.url,
    },
    ...(options.tags?.length ? { keywords: options.tags.join(", ") } : {}),
  };
}

interface ProjectJsonLdOptions {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  techStack?: string[];
  keywords?: string[];
  category?: string;
}

const categoryToOS: Record<string, string> = {
  "mobile-app": "iOS, Android",
  "chrome-extension": "Chrome",
  web: "All",
  cli: "Windows, macOS, Linux",
};

const categoryToAppCategory: Record<string, string> = {
  "mobile-app": "HealthApplication",
  "chrome-extension": "BrowserApplication",
  web: "WebApplication",
  cli: "DeveloperApplication",
};

export function buildProjectJsonLd(options: ProjectJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished,
    author: {
      "@type": "Person",
      name: "zzoo",
      url: siteConfig.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(options.techStack?.length
      ? { applicationCategory: options.techStack.join(", ") }
      : {}),
    ...(options.keywords?.length
      ? { keywords: options.keywords.join(", ") }
      : {}),
    ...(options.category && categoryToOS[options.category]
      ? { operatingSystem: categoryToOS[options.category] }
      : {}),
    ...(options.category && categoryToAppCategory[options.category]
      ? { applicationCategory: categoryToAppCategory[options.category] }
      : {}),
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
