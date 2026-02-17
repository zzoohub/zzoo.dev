import { describe, it, expect } from "vitest";
import {
  buildCanonicalUrl,
  buildAlternates,
  buildPageMeta,
  buildWebSiteJsonLd,
  buildPersonJsonLd,
  buildArticleJsonLd,
  buildProjectJsonLd,
  buildBreadcrumbJsonLd,
} from "./seo";
import { siteConfig } from "./site-config";

describe("seo", () => {
  describe("buildCanonicalUrl", () => {
    it("builds canonical URL for root path with en locale", () => {
      const result = buildCanonicalUrl("en", "/");
      expect(result).toBe("https://zzoo.dev/en");
    });

    it("builds canonical URL for root path with ko locale", () => {
      const result = buildCanonicalUrl("ko", "/");
      expect(result).toBe("https://zzoo.dev/ko");
    });

    it("builds canonical URL for non-root path with en locale", () => {
      const result = buildCanonicalUrl("en", "/blog");
      expect(result).toBe("https://zzoo.dev/en/blog");
    });

    it("builds canonical URL for non-root path with ko locale", () => {
      const result = buildCanonicalUrl("ko", "/about");
      expect(result).toBe("https://zzoo.dev/ko/about");
    });

    it("builds canonical URL for nested path", () => {
      const result = buildCanonicalUrl("en", "/blog/my-post");
      expect(result).toBe("https://zzoo.dev/en/blog/my-post");
    });

    it("handles paths with multiple segments", () => {
      const result = buildCanonicalUrl("ko", "/projects/case-study/details");
      expect(result).toBe("https://zzoo.dev/ko/projects/case-study/details");
    });

    it("handles empty string locale", () => {
      const result = buildCanonicalUrl("", "/test");
      expect(result).toBe("https://zzoo.dev//test");
    });
  });

  describe("buildAlternates", () => {
    it("returns alternates for root path", () => {
      const result = buildAlternates("/");
      expect(result).toEqual({
        canonical: "https://zzoo.dev/en",
        languages: {
          en: "https://zzoo.dev/en",
          ko: "https://zzoo.dev/ko",
          "x-default": "https://zzoo.dev/en",
        },
        types: {
          "application/rss+xml": "https://zzoo.dev/rss.xml",
        },
      });
    });

    it("returns alternates for non-root path", () => {
      const result = buildAlternates("/blog");
      expect(result).toEqual({
        canonical: "https://zzoo.dev/en/blog",
        languages: {
          en: "https://zzoo.dev/en/blog",
          ko: "https://zzoo.dev/ko/blog",
          "x-default": "https://zzoo.dev/en/blog",
        },
        types: {
          "application/rss+xml": "https://zzoo.dev/rss.xml",
        },
      });
    });

    it("canonical is always en locale", () => {
      const result = buildAlternates("/about");
      expect(result?.canonical).toBe("https://zzoo.dev/en/about");
    });

    it("includes all locales in languages", () => {
      const result = buildAlternates("/projects");
      expect(result?.languages).toHaveProperty("en");
      expect(result?.languages).toHaveProperty("ko");
    });

    it("sets x-default to en locale", () => {
      const result = buildAlternates("/contact");
      expect(result?.languages?.["x-default"]).toBe(
        "https://zzoo.dev/en/contact"
      );
    });

    it("includes RSS feed in types", () => {
      const result = buildAlternates("/blog");
      expect(result?.types).toEqual({
        "application/rss+xml": "https://zzoo.dev/rss.xml",
      });
    });

    it("handles nested paths", () => {
      const result = buildAlternates("/blog/my-post");
      expect(result?.languages?.en).toBe("https://zzoo.dev/en/blog/my-post");
      expect(result?.languages?.ko).toBe("https://zzoo.dev/ko/blog/my-post");
    });
  });

  describe("buildPageMeta", () => {
    it("builds metadata for website type with en locale", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/",
        title: "Home",
        description: "Welcome to my site",
      });

      expect(result.title).toBe("Home");
      expect(result.description).toBe("Welcome to my site");
      expect(result.alternates).toBeDefined();
    });

    it("builds metadata for website type with ko locale", () => {
      const result = buildPageMeta({
        locale: "ko",
        pathname: "/about",
        title: "소개",
        description: "저를 소개합니다",
      });

      expect(result.title).toBe("소개");
      expect(result.description).toBe("저를 소개합니다");
    });

    it("defaults type to website", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/",
        title: "Test",
        description: "Test desc",
      });

      expect(result.openGraph?.type).toBe("website");
    });

    it("sets type to website when explicitly specified", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/about",
        title: "About",
        description: "About page",
        type: "website",
      });

      expect(result.openGraph?.type).toBe("website");
    });

    it("sets type to article when specified", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/blog/post",
        title: "Blog Post",
        description: "A blog post",
        type: "article",
      });

      expect(result.openGraph?.type).toBe("article");
    });

    it("sets en_US locale for en", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/",
        title: "Test",
        description: "Test",
      });

      expect(result.openGraph?.locale).toBe("en_US");
    });

    it("sets ko_KR locale for ko", () => {
      const result = buildPageMeta({
        locale: "ko",
        pathname: "/",
        title: "Test",
        description: "Test",
      });

      expect(result.openGraph?.locale).toBe("ko_KR");
    });

    it("includes OpenGraph title and description", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/test",
        title: "Test Title",
        description: "Test Description",
      });

      expect(result.openGraph?.title).toBe("Test Title");
      expect(result.openGraph?.description).toBe("Test Description");
    });

    it("includes OpenGraph URL from canonical", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/blog",
        title: "Blog",
        description: "Blog page",
      });

      expect(result.openGraph?.url).toBe("https://zzoo.dev/en/blog");
    });

    it("includes siteName from siteConfig", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/",
        title: "Home",
        description: "Home page",
      });

      expect(result.openGraph?.siteName).toBe(siteConfig.name);
    });

    it("includes OpenGraph image with correct properties", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/",
        title: "Home",
        description: "Home page",
      });

      expect(result.openGraph?.images).toEqual([
        {
          url: "https://zzoo.dev/og-default.png",
          width: 1200,
          height: 630,
          alt: "Home",
        },
      ]);
    });

    it("includes publishedTime and tags for article type", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/blog/post",
        title: "Post",
        description: "Post desc",
        type: "article",
        publishedTime: "2024-01-01T00:00:00Z",
        tags: ["typescript", "nextjs"],
      });

      expect(result.openGraph?.publishedTime).toBe("2024-01-01T00:00:00Z");
      expect(result.openGraph?.tags).toEqual(["typescript", "nextjs"]);
    });

    it("excludes publishedTime and tags for website type", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/about",
        title: "About",
        description: "About page",
        type: "website",
        publishedTime: "2024-01-01T00:00:00Z",
        tags: ["test"],
      });

      expect(result.openGraph).not.toHaveProperty("publishedTime");
      expect(result.openGraph).not.toHaveProperty("tags");
    });

    it("excludes publishedTime and tags when type is article but publishedTime is missing", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/blog/post",
        title: "Post",
        description: "Post desc",
        type: "article",
        tags: ["test"],
      });

      expect(result.openGraph).not.toHaveProperty("publishedTime");
      expect(result.openGraph).not.toHaveProperty("tags");
    });

    it("includes Twitter card metadata", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/",
        title: "Home",
        description: "Home page",
      });

      expect(result.twitter?.card).toBe("summary_large_image");
      expect(result.twitter?.title).toBe("Home");
      expect(result.twitter?.description).toBe("Home page");
      expect(result.twitter?.images).toEqual([
        "https://zzoo.dev/og-default.png",
      ]);
    });

    it("builds correct URL for nested path", () => {
      const result = buildPageMeta({
        locale: "ko",
        pathname: "/projects/case-study",
        title: "사례 연구",
        description: "프로젝트 사례",
      });

      expect(result.openGraph?.url).toBe(
        "https://zzoo.dev/ko/projects/case-study"
      );
    });

    it("includes empty tags array for article without tags", () => {
      const result = buildPageMeta({
        locale: "en",
        pathname: "/blog/post",
        title: "Post",
        description: "Post desc",
        type: "article",
        publishedTime: "2024-01-01T00:00:00Z",
      });

      expect(result.openGraph?.publishedTime).toBe("2024-01-01T00:00:00Z");
      expect(result.openGraph?.tags).toBeUndefined();
    });
  });

  describe("buildWebSiteJsonLd", () => {
    it("returns WebSite schema", () => {
      const result = buildWebSiteJsonLd();
      expect(result["@type"]).toBe("WebSite");
    });

    it("includes schema.org context", () => {
      const result = buildWebSiteJsonLd();
      expect(result["@context"]).toBe("https://schema.org");
    });

    it("includes site name from config", () => {
      const result = buildWebSiteJsonLd();
      expect(result.name).toBe(siteConfig.name);
    });

    it("includes site URL from config", () => {
      const result = buildWebSiteJsonLd();
      expect(result.url).toBe(siteConfig.url);
    });

    it("includes description", () => {
      const result = buildWebSiteJsonLd();
      expect(result.description).toBeDefined();
      expect(typeof result.description).toBe("string");
      expect(result.description.length).toBeGreaterThan(0);
    });

    it("includes both languages", () => {
      const result = buildWebSiteJsonLd();
      expect(result.inLanguage).toEqual(["en", "ko"]);
    });
  });

  describe("buildPersonJsonLd", () => {
    it("returns Person schema", () => {
      const result = buildPersonJsonLd();
      expect(result["@type"]).toBe("Person");
    });

    it("includes schema.org context", () => {
      const result = buildPersonJsonLd();
      expect(result["@context"]).toBe("https://schema.org");
    });

    it("includes name", () => {
      const result = buildPersonJsonLd();
      expect(result.name).toBe("zzoo");
    });

    it("includes URL from config", () => {
      const result = buildPersonJsonLd();
      expect(result.url).toBe(siteConfig.url);
    });

    it("includes email from config", () => {
      const result = buildPersonJsonLd();
      expect(result.email).toBe(siteConfig.email);
    });

    it("includes social links", () => {
      const result = buildPersonJsonLd();
      expect(result.sameAs).toEqual([
        siteConfig.social.github,
        siteConfig.social.linkedin,
      ]);
    });

    it("includes job title", () => {
      const result = buildPersonJsonLd();
      expect(result.jobTitle).toBeDefined();
      expect(typeof result.jobTitle).toBe("string");
    });

    it("includes knowsAbout array", () => {
      const result = buildPersonJsonLd();
      expect(Array.isArray(result.knowsAbout)).toBe(true);
      expect(result.knowsAbout.length).toBeGreaterThan(0);
    });
  });

  describe("buildArticleJsonLd", () => {
    it("returns BlogPosting schema", () => {
      const result = buildArticleJsonLd({
        title: "Test Post",
        description: "Test description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result["@type"]).toBe("BlogPosting");
    });

    it("includes schema.org context", () => {
      const result = buildArticleJsonLd({
        title: "Test Post",
        description: "Test description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result["@context"]).toBe("https://schema.org");
    });

    it("includes headline from title", () => {
      const result = buildArticleJsonLd({
        title: "My Blog Post",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.headline).toBe("My Blog Post");
    });

    it("includes description", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "This is the description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.description).toBe("This is the description");
    });

    it("includes URL", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/my-post",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.url).toBe("https://zzoo.dev/en/blog/my-post");
    });

    it("includes datePublished", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-06-15T12:00:00Z",
      });
      expect(result.datePublished).toBe("2024-06-15T12:00:00Z");
    });

    it("includes author as Person", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.author).toEqual({
        "@type": "Person",
        name: "zzoo",
        url: siteConfig.url,
      });
    });

    it("includes publisher as Person", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.publisher).toEqual({
        "@type": "Person",
        name: "zzoo",
        url: siteConfig.url,
      });
    });

    it("includes keywords when tags provided", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
        tags: ["typescript", "nextjs", "react"],
      });
      expect(result.keywords).toBe("typescript, nextjs, react");
    });

    it("excludes keywords when tags is empty array", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
        tags: [],
      });
      expect(result).not.toHaveProperty("keywords");
    });

    it("excludes keywords when tags is undefined", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result).not.toHaveProperty("keywords");
    });

    it("handles single tag", () => {
      const result = buildArticleJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/blog/test",
        datePublished: "2024-01-01T00:00:00Z",
        tags: ["typescript"],
      });
      expect(result.keywords).toBe("typescript");
    });
  });

  describe("buildProjectJsonLd", () => {
    it("returns SoftwareApplication schema", () => {
      const result = buildProjectJsonLd({
        title: "Test Project",
        description: "Test description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result["@type"]).toBe("SoftwareApplication");
    });

    it("includes schema.org context", () => {
      const result = buildProjectJsonLd({
        title: "Test Project",
        description: "Test description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result["@context"]).toBe("https://schema.org");
    });

    it("includes name from title", () => {
      const result = buildProjectJsonLd({
        title: "My Amazing Project",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.name).toBe("My Amazing Project");
    });

    it("includes description", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "This is the project description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.description).toBe("This is the project description");
    });

    it("includes URL", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/my-project",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.url).toBe("https://zzoo.dev/en/projects/my-project");
    });

    it("includes datePublished", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-06-15T12:00:00Z",
      });
      expect(result.datePublished).toBe("2024-06-15T12:00:00Z");
    });

    it("includes author as Person", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result.author).toEqual({
        "@type": "Person",
        name: "zzoo",
        url: siteConfig.url,
      });
    });

    it("includes applicationCategory when techStack provided", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
      });
      expect(result.applicationCategory).toBe(
        "Next.js, TypeScript, Tailwind CSS"
      );
    });

    it("excludes applicationCategory when techStack is empty array", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
        techStack: [],
      });
      expect(result).not.toHaveProperty("applicationCategory");
    });

    it("excludes applicationCategory when techStack is undefined", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
      });
      expect(result).not.toHaveProperty("applicationCategory");
    });

    it("handles single tech stack item", () => {
      const result = buildProjectJsonLd({
        title: "Test",
        description: "Description",
        url: "https://zzoo.dev/en/projects/test",
        datePublished: "2024-01-01T00:00:00Z",
        techStack: ["React"],
      });
      expect(result.applicationCategory).toBe("React");
    });
  });

  describe("buildBreadcrumbJsonLd", () => {
    it("returns BreadcrumbList schema", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
      ]);
      expect(result["@type"]).toBe("BreadcrumbList");
    });

    it("includes schema.org context", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
      ]);
      expect(result["@context"]).toBe("https://schema.org");
    });

    it("creates itemListElement from items", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
        { name: "Blog", url: "https://zzoo.dev/en/blog" },
      ]);
      expect(result.itemListElement).toHaveLength(2);
    });

    it("sets correct position starting at 1", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
        { name: "Blog", url: "https://zzoo.dev/en/blog" },
        { name: "Post", url: "https://zzoo.dev/en/blog/post" },
      ]);
      expect(result.itemListElement[0].position).toBe(1);
      expect(result.itemListElement[1].position).toBe(2);
      expect(result.itemListElement[2].position).toBe(3);
    });

    it("includes name for each item", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
        { name: "Blog", url: "https://zzoo.dev/en/blog" },
      ]);
      expect(result.itemListElement[0].name).toBe("Home");
      expect(result.itemListElement[1].name).toBe("Blog");
    });

    it("includes item URL for each item", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
        { name: "Projects", url: "https://zzoo.dev/en/projects" },
      ]);
      expect(result.itemListElement[0].item).toBe("https://zzoo.dev/en");
      expect(result.itemListElement[1].item).toBe(
        "https://zzoo.dev/en/projects"
      );
    });

    it("sets ListItem type for each element", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
        { name: "About", url: "https://zzoo.dev/en/about" },
      ]);
      expect(result.itemListElement[0]["@type"]).toBe("ListItem");
      expect(result.itemListElement[1]["@type"]).toBe("ListItem");
    });

    it("handles single item breadcrumb", () => {
      const result = buildBreadcrumbJsonLd([
        { name: "Home", url: "https://zzoo.dev/en" },
      ]);
      expect(result.itemListElement).toHaveLength(1);
      expect(result.itemListElement[0].position).toBe(1);
      expect(result.itemListElement[0].name).toBe("Home");
    });

    it("handles empty items array", () => {
      const result = buildBreadcrumbJsonLd([]);
      expect(result.itemListElement).toHaveLength(0);
    });

    it("handles long breadcrumb trail", () => {
      const items = [
        { name: "Home", url: "https://zzoo.dev/en" },
        { name: "Projects", url: "https://zzoo.dev/en/projects" },
        { name: "Case Study", url: "https://zzoo.dev/en/projects/case-study" },
        {
          name: "Details",
          url: "https://zzoo.dev/en/projects/case-study/details",
        },
      ];
      const result = buildBreadcrumbJsonLd(items);
      expect(result.itemListElement).toHaveLength(4);
      expect(result.itemListElement[3].position).toBe(4);
      expect(result.itemListElement[3].name).toBe("Details");
    });

    it("preserves item order", () => {
      const items = [
        { name: "First", url: "https://zzoo.dev/en/first" },
        { name: "Second", url: "https://zzoo.dev/en/second" },
        { name: "Third", url: "https://zzoo.dev/en/third" },
      ];
      const result = buildBreadcrumbJsonLd(items);
      expect(result.itemListElement[0].name).toBe("First");
      expect(result.itemListElement[1].name).toBe("Second");
      expect(result.itemListElement[2].name).toBe("Third");
    });
  });
});
