import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getAllBlogPosts,
  getBlogPost,
  getAllCaseStudies,
  getCaseStudy,
  getTestimonials,
  hasPRD,
  getCaseStudyPRD,
  getAllPRDSlugs,
} from "./content";

// Mock fs module
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    statSync: vi.fn(),
  },
}));

import fs from "fs";
const mockFs = fs as any;

describe("content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("toDateString helper", () => {
    it("converts Date object to ISO string format", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      const testDate = new Date("2024-01-15T10:30:00Z");
      mockFs.readFileSync.mockReturnValue(
        `---\ntitle: Test\ndescription: Desc\ndate: ${testDate.toISOString()}\n---\nContent`
      );

      const posts = getAllBlogPosts("en");
      expect(posts[0].date).toBe("2024-01-15");
    });

    it("converts string date to string format", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Test\ndescription: Desc\ndate: 2024-01-15\n---\nContent"
      );

      const posts = getAllBlogPosts("en");
      expect(posts[0].date).toBe("2024-01-15");
    });

    it("handles numeric date values", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Test\ndescription: Desc\ndate: 20240115\n---\nContent"
      );

      const posts = getAllBlogPosts("en");
      expect(posts[0].date).toBe("20240115");
    });
  });

  describe("getAllBlogPosts", () => {
    it("returns empty array when directory does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const posts = getAllBlogPosts("en");
      expect(posts).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/blog")
      );
    });

    it("returns empty array when directory exists but has no slug dirs", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      const posts = getAllBlogPosts("en");
      expect(posts).toEqual([]);
    });

    it("skips slug dirs without matching locale file", () => {
      mockFs.readdirSync.mockReturnValue(["post1", "post2"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      // blog dir exists, but locale files don't
      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/blog")) return true;
        return false; // no en.mdx files
      });

      const posts = getAllBlogPosts("en");
      expect(posts).toEqual([]);
    });

    it("filters out non-directory entries", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "post1",
        "readme.txt",
      ] as unknown as fs.Dirent[]);

      let statCallCount = 0;
      mockFs.statSync.mockImplementation(() => {
        statCallCount++;
        // Only first entry is a directory
        return { isDirectory: () => statCallCount === 1 };
      });

      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Test\ndescription: Desc\ndate: 2024-01-01\n---\nContent"
      );

      const posts = getAllBlogPosts("en");
      expect(posts).toHaveLength(1);
    });

    it("parses MDX frontmatter correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Test Post\ndescription: A test post\ndate: 2024-01-15\ntags:\n  - typescript\n  - testing\n---\nThis is test content with about 200 words to calculate reading time properly. " +
          "Lorem ipsum dolor sit amet ".repeat(25)
      );

      const posts = getAllBlogPosts("en");
      expect(posts).toHaveLength(1);
      expect(posts[0]).toMatchObject({
        slug: "test",
        title: "Test Post",
        description: "A test post",
        date: "2024-01-15",
        tags: ["typescript", "testing"],
        locale: "en",
        draft: false,
      });
    });

    it("excludes draft posts", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "published",
        "draft",
      ] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\ntitle: Published\ndescription: Desc\ndate: 2024-01-01\n---\nContent";
        } else {
          return "---\ntitle: Draft\ndescription: Desc\ndate: 2024-01-02\ndraft: true\n---\nContent";
        }
      });

      const posts = getAllBlogPosts("en");
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("published");
    });

    it("sets default empty tags when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Test\ndescription: Desc\ndate: 2024-01-01\n---\nContent"
      );

      const posts = getAllBlogPosts("en");
      expect(posts[0].tags).toEqual([]);
    });

    it("calculates reading time for English content", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      // 400 words = 2 minutes at 200 words/min
      const words = "word ".repeat(400);
      mockFs.readFileSync.mockReturnValue(
        `---\ntitle: Test\ndescription: Desc\ndate: 2024-01-01\n---\n${words}`
      );

      const posts = getAllBlogPosts("en");
      expect(posts[0].readingTime).toBe(2);
    });

    it("calculates reading time for Korean content", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      // 600 characters = 2 minutes at 300 chars/min
      const koreanText = "한".repeat(600);
      mockFs.readFileSync.mockReturnValue(
        `---\ntitle: Test\ndescription: Desc\ndate: 2024-01-01\n---\n${koreanText}`
      );

      const posts = getAllBlogPosts("ko");
      expect(posts[0].readingTime).toBe(2);
    });

    it("rounds up reading time", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      // 250 words = 1.25 minutes, should round up to 2
      const words = "word ".repeat(250);
      mockFs.readFileSync.mockReturnValue(
        `---\ntitle: Test\ndescription: Desc\ndate: 2024-01-01\n---\n${words}`
      );

      const posts = getAllBlogPosts("en");
      expect(posts[0].readingTime).toBe(2);
    });

    it("sorts posts by date descending", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "old",
        "new",
        "middle",
      ] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\ntitle: Old\ndescription: Desc\ndate: 2023-01-01\n---\nContent";
        } else if (callCount === 2) {
          return "---\ntitle: New\ndescription: Desc\ndate: 2024-03-01\n---\nContent";
        } else {
          return "---\ntitle: Middle\ndescription: Desc\ndate: 2024-01-01\n---\nContent";
        }
      });

      const posts = getAllBlogPosts("en");
      expect(posts).toHaveLength(3);
      expect(posts[0].title).toBe("New");
      expect(posts[1].title).toBe("Middle");
      expect(posts[2].title).toBe("Old");
    });

    it("handles Korean locale correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["test"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: 테스트\ndescription: 설명\ndate: 2024-01-01\n---\n내용"
      );

      const posts = getAllBlogPosts("ko");
      expect(posts[0].locale).toBe("ko");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/blog")
      );
    });
  });

  describe("getBlogPost", () => {
    it("returns null for invalid slug", () => {
      const post = getBlogPost("en", "../../../etc/passwd");
      expect(post).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null for slug with special characters", () => {
      const post = getBlogPost("en", "post@name!");
      expect(post).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null when file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const post = getBlogPost("en", "nonexistent");
      expect(post).toBeNull();
    });

    it("returns post with meta and content when file exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Test Post\ndescription: A test\ndate: 2024-01-01\ntags:\n  - test\n---\nPost content here"
      );

      const post = getBlogPost("en", "test-post");
      expect(post).not.toBeNull();
      expect(post?.meta).toMatchObject({
        slug: "test-post",
        title: "Test Post",
        description: "A test",
        date: "2024-01-01",
        tags: ["test"],
        locale: "en",
        draft: false,
      });
      expect(post?.content).toBe("Post content here");
    });

    it("checks correct file path for en locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getBlogPost("en", "my-post");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/blog/my-post/en.mdx")
      );
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getBlogPost("ko", "my-post");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/blog/my-post/ko.mdx")
      );
    });

    it("handles draft flag correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Draft\ndescription: Desc\ndate: 2024-01-01\ndraft: true\n---\nContent"
      );

      const post = getBlogPost("en", "draft-post");
      expect(post?.meta.draft).toBe(true);
    });

    it("defaults draft to false when not specified", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Post\ndescription: Desc\ndate: 2024-01-01\n---\nContent"
      );

      const post = getBlogPost("en", "post");
      expect(post?.meta.draft).toBe(false);
    });

    it("calculates reading time for returned post", () => {
      mockFs.existsSync.mockReturnValue(true);
      const words = "word ".repeat(200);
      mockFs.readFileSync.mockReturnValue(
        `---\ntitle: Post\ndescription: Desc\ndate: 2024-01-01\n---\n${words}`
      );

      const post = getBlogPost("en", "post");
      expect(post?.meta.readingTime).toBe(1);
    });
  });

  describe("getAllCaseStudies", () => {
    it("returns empty array when directory does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const studies = getAllCaseStudies("en");
      expect(studies).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects")
      );
    });

    it("returns empty array when directory exists but has no slug dirs", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      const studies = getAllCaseStudies("en");
      expect(studies).toEqual([]);
    });

    it("parses case study frontmatter correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: E-commerce Rebuild
description: Rebuilt platform
clientType: SaaS
status: completed
techStack:
  - Next.js
  - TypeScript
duration: 3 months
startDate: 2023-06-01
endDate: 2023-09-01
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies).toHaveLength(1);
      expect(studies[0]).toMatchObject({
        slug: "project",
        title: "E-commerce Rebuild",
        description: "Rebuilt platform",
        clientType: "SaaS",
        status: "completed",
        techStack: ["Next.js", "TypeScript"],
        duration: "3 months",
        startDate: "2023-06-01",
        endDate: "2023-09-01",
        featured: false,
      });
    });

    it("sets default empty techStack when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Agency
status: active
duration: 2 months
startDate: 2024-01-01
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].techStack).toEqual([]);
    });

    it("defaults featured to false when not specified", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Startup
status: active
duration: 1 month
startDate: 2024-01-01
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].featured).toBe(false);
    });

    it("handles featured flag correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Enterprise
status: completed
featured: true
duration: 6 months
startDate: 2023-01-01
endDate: 2023-07-01
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].featured).toBe(true);
    });

    it("sorts case studies by startDate descending", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "old",
        "new",
        "middle",
      ] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        const base = `clientType: Test
status: completed
duration: 1 month`;

        if (callCount === 1) {
          return `---\ntitle: Old\ndescription: Desc\n${base}\nstartDate: 2022-01-01\n---\nContent`;
        } else if (callCount === 2) {
          return `---\ntitle: New\ndescription: Desc\n${base}\nstartDate: 2024-01-01\n---\nContent`;
        } else {
          return `---\ntitle: Middle\ndescription: Desc\n${base}\nstartDate: 2023-01-01\n---\nContent`;
        }
      });

      const studies = getAllCaseStudies("en");
      expect(studies).toHaveLength(3);
      expect(studies[0].title).toBe("New");
      expect(studies[1].title).toBe("Middle");
      expect(studies[2].title).toBe("Old");
    });

    it("handles different status values", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "active",
        "completed",
        "archived",
      ] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        const base = `title: Project
description: Desc
clientType: Test
duration: 1 month
startDate: 2024-01-01`;

        if (callCount === 1) {
          return `---\n${base}\nstatus: active\n---\nContent`;
        } else if (callCount === 2) {
          return `---\n${base}\nstatus: completed\nendDate: 2024-02-01\n---\nContent`;
        } else {
          return `---\n${base}\nstatus: archived\nendDate: 2023-12-01\n---\nContent`;
        }
      });

      const studies = getAllCaseStudies("en");
      expect(studies[0].status).toBe("active");
      expect(studies[1].status).toBe("completed");
      expect(studies[2].status).toBe("archived");
    });

    it("handles Korean locale correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: 프로젝트
description: 설명
clientType: 스타트업
status: active
duration: 3개월
startDate: 2024-01-01
---
내용`
      );

      const studies = getAllCaseStudies("ko");
      expect(studies).toHaveLength(1);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects")
      );
    });

    it("skips slug dirs without matching locale file", () => {
      mockFs.readdirSync.mockReturnValue(["project1", "project2"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        return false; // no locale files
      });

      const studies = getAllCaseStudies("en");
      expect(studies).toEqual([]);
    });

    it("includes d2Diagram field when provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
duration: 1 month
startDate: 2024-01-01
d2Diagram: architecture.d2
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].d2Diagram).toBe("architecture.d2");
    });

    it("includes links field when provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
duration: 1 month
startDate: 2024-01-01
links:
  live: https://example.com
  github: https://github.com/example/repo
  docs: https://docs.example.com
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].links).toEqual({
        live: "https://example.com",
        github: "https://github.com/example/repo",
        docs: "https://docs.example.com",
      });
    });

    it("handles missing d2Diagram field", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
duration: 1 month
startDate: 2024-01-01
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].d2Diagram).toBeUndefined();
    });

    it("handles missing links field", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
duration: 1 month
startDate: 2024-01-01
---
Content`
      );

      const studies = getAllCaseStudies("en");
      expect(studies[0].links).toBeUndefined();
    });
  });

  describe("getCaseStudy", () => {
    it("returns null for invalid slug", () => {
      const study = getCaseStudy("en", "../../../etc/passwd");
      expect(study).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null for slug with special characters", () => {
      const study = getCaseStudy("en", "project@name!");
      expect(study).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null when file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const study = getCaseStudy("en", "nonexistent");
      expect(study).toBeNull();
    });

    it("returns case study with meta and content when file exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Test Project
description: A test project
clientType: Startup
status: active
techStack:
  - React
duration: 2 months
startDate: 2024-01-01
---
Project details here`
      );

      const study = getCaseStudy("en", "test-project");
      expect(study).not.toBeNull();
      expect(study?.meta).toMatchObject({
        slug: "test-project",
        title: "Test Project",
        description: "A test project",
        clientType: "Startup",
        status: "active",
        techStack: ["React"],
        featured: false,
        duration: "2 months",
        startDate: "2024-01-01",
      });
      expect(study?.content).toBe("Project details here");
    });

    it("checks correct file path for en locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getCaseStudy("en", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/en.mdx")
      );
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getCaseStudy("ko", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/ko.mdx")
      );
    });

    it("handles endDate when provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Completed Project
description: Done
clientType: Enterprise
status: completed
duration: 6 months
startDate: 2023-01-01
endDate: 2023-07-01
---
Content`
      );

      const study = getCaseStudy("en", "completed");
      expect(study?.meta.endDate).toBe("2023-07-01");
    });

    it("handles missing endDate", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Active Project
description: Ongoing
clientType: Startup
status: active
duration: ongoing
startDate: 2024-01-01
---
Content`
      );

      const study = getCaseStudy("en", "active");
      expect(study?.meta.endDate).toBeUndefined();
    });

    it("includes d2Diagram field when provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
duration: 1 month
startDate: 2024-01-01
d2Diagram: diagram.d2
---
Content`
      );

      const study = getCaseStudy("en", "project");
      expect(study?.meta.d2Diagram).toBe("diagram.d2");
    });

    it("includes links field when provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
duration: 1 month
startDate: 2024-01-01
links:
  live: https://live.example.com
  github: https://github.com/example
---
Content`
      );

      const study = getCaseStudy("en", "project");
      expect(study?.meta.links).toEqual({
        live: "https://live.example.com",
        github: "https://github.com/example",
      });
    });
  });

  describe("getTestimonials", () => {
    it("returns empty array when file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const testimonials = getTestimonials();
      expect(testimonials).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/testimonials.json")
      );
    });

    it("parses testimonials JSON correctly", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify([
          {
            quote: "Great work!",
            authorName: "John Doe",
            authorRole: "CTO",
            authorCompany: "Tech Corp",
            featured: true,
          },
          {
            quote: "Excellent developer",
            authorName: "Jane Smith",
            authorRole: "CEO",
            authorCompany: "Startup Inc",
          },
        ])
      );

      const testimonials = getTestimonials();
      expect(testimonials).toHaveLength(2);
      expect(testimonials[0]).toMatchObject({
        quote: "Great work!",
        authorName: "John Doe",
        authorRole: "CTO",
        authorCompany: "Tech Corp",
        featured: true,
      });
      expect(testimonials[1]).toMatchObject({
        quote: "Excellent developer",
        authorName: "Jane Smith",
        authorRole: "CEO",
        authorCompany: "Startup Inc",
      });
    });

    it("handles empty testimonials array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify([]));

      const testimonials = getTestimonials();
      expect(testimonials).toEqual([]);
    });

    it("handles testimonials with optional featured field", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify([
          {
            quote: "Test quote",
            authorName: "Test Author",
            authorRole: "Role",
            authorCompany: "Company",
          },
        ])
      );

      const testimonials = getTestimonials();
      expect(testimonials[0].featured).toBeUndefined();
    });
  });

  describe("hasPRD", () => {
    it("returns true when prd.{locale}.mdx file exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasPRD("en", "e-commerce-rebuild");
      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/e-commerce-rebuild/prd.en.mdx")
      );
    });

    it("returns false when prd.{locale}.mdx file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = hasPRD("en", "no-prd-project");
      expect(result).toBe(false);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/no-prd-project/prd.en.mdx")
      );
    });

    it("returns false for invalid slug", () => {
      const result = hasPRD("en", "../../../etc/passwd");
      expect(result).toBe(false);
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns false for slug with special characters", () => {
      const result = hasPRD("en", "project@name");
      expect(result).toBe(false);
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("checks correct path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      hasPRD("ko", "test-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/test-project/prd.ko.mdx")
      );
    });

    it("handles slug with hyphens and underscores", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasPRD("en", "test_project-v2");
      expect(result).toBe(true);
    });

    it("handles slug with numbers", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasPRD("en", "project123");
      expect(result).toBe(true);
    });
  });

  describe("getCaseStudyPRD", () => {
    it("returns null when prd file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = getCaseStudyPRD("en", "nonexistent");
      expect(result).toBeNull();
    });

    it("returns null for invalid slug", () => {
      const result = getCaseStudyPRD("en", "../../../etc/passwd");
      expect(result).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null when parent case study does not exist", () => {
      // PRD file exists but parent locale .mdx does not
      let callCount = 0;
      mockFs.existsSync.mockImplementation(() => {
        callCount++;
        // First call checks prd.en.mdx (exists)
        if (callCount === 1) return true;
        // Second call checks en.mdx (does not exist)
        return false;
      });

      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: PRD Only\n---\nPRD content"
      );

      const result = getCaseStudyPRD("en", "orphan-prd");
      expect(result).toBeNull();
    });

    it("returns PRD content with parent case study meta when both exist", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        // First call reads prd.en.mdx
        if (callCount === 1) {
          return "---\ntitle: PRD Title\n---\nPRD detailed content here";
        }
        // Second call reads en.mdx (parent)
        return `---
title: E-commerce Rebuild
description: Rebuilt platform
clientType: SaaS
status: completed
techStack:
  - Next.js
duration: 3 months
startDate: 2023-06-01
endDate: 2023-09-01
---
Parent case study content`;
      });

      const result = getCaseStudyPRD("en", "e-commerce-rebuild");
      expect(result).not.toBeNull();
      expect(result?.content).toBe("PRD detailed content here");
      expect(result?.meta).toMatchObject({
        slug: "e-commerce-rebuild",
        title: "E-commerce Rebuild",
        description: "Rebuilt platform",
        clientType: "SaaS",
        status: "completed",
        techStack: ["Next.js"],
        duration: "3 months",
        startDate: "2023-06-01",
        endDate: "2023-09-01",
      });
    });

    it("checks correct file path for en locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getCaseStudyPRD("en", "test-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/test-project/prd.en.mdx")
      );
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getCaseStudyPRD("ko", "test-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/test-project/prd.ko.mdx")
      );
    });

    it("inherits all parent meta fields including optional ones", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\ntitle: PRD\n---\nPRD content";
        }
        return `---
title: Featured Project
description: A featured project
clientType: Enterprise
status: completed
techStack:
  - React
  - TypeScript
featured: true
duration: 6 months
startDate: 2023-01-01
endDate: 2023-07-01
d2Diagram: diagram.d2
links:
  live: https://example.com
  github: https://github.com/example/repo
---
Content`;
      });

      const result = getCaseStudyPRD("en", "featured-project");
      expect(result?.meta.featured).toBe(true);
      expect(result?.meta.d2Diagram).toBe("diagram.d2");
      expect(result?.meta.links).toEqual({
        live: "https://example.com",
        github: "https://github.com/example/repo",
      });
    });

    it("handles PRD with different frontmatter than parent", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // PRD has its own frontmatter (should be ignored, parent meta used)
          return `---
title: PRD Specific Title
customField: value
---
PRD content with requirements`;
        }
        return `---
title: Parent Title
description: Parent description
clientType: Startup
status: active
duration: 2 months
startDate: 2024-01-01
---
Parent content`;
      });

      const result = getCaseStudyPRD("en", "test");
      expect(result?.meta.title).toBe("Parent Title");
      expect(result?.content).toBe("PRD content with requirements");
    });
  });

  describe("getAllPRDSlugs", () => {
    it("returns empty array when projects directory does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = getAllPRDSlugs();
      expect(result).toEqual([]);
    });

    it("returns empty array when no slug dirs have PRD files", () => {
      mockFs.readdirSync.mockReturnValue(["project1", "project2"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        return false; // no prd files
      });

      const result = getAllPRDSlugs();
      expect(result).toEqual([]);
    });

    it("returns PRD slugs for en locale", () => {
      mockFs.readdirSync.mockReturnValue(["e-commerce-rebuild", "analytics-dashboard"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        // Only en PRD files exist
        if (p.endsWith("prd.en.mdx")) return true;
        return false;
      });

      const result = getAllPRDSlugs();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ locale: "en", slug: "e-commerce-rebuild" });
      expect(result).toContainEqual({ locale: "en", slug: "analytics-dashboard" });
    });

    it("returns PRD slugs for ko locale", () => {
      mockFs.readdirSync.mockReturnValue(["project-ko"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        if (p.endsWith("prd.ko.mdx")) return true;
        return false;
      });

      const result = getAllPRDSlugs();
      expect(result).toHaveLength(1);
      expect(result).toContainEqual({ locale: "ko", slug: "project-ko" });
    });

    it("returns PRD slugs from both locales", () => {
      mockFs.readdirSync.mockReturnValue(["project1", "project2"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        // project1 has both locales, project2 only has en
        if (p.includes("project1") && p.endsWith("prd.en.mdx")) return true;
        if (p.includes("project1") && p.endsWith("prd.ko.mdx")) return true;
        if (p.includes("project2") && p.endsWith("prd.en.mdx")) return true;
        return false;
      });

      const result = getAllPRDSlugs();
      expect(result).toHaveLength(3);
      expect(result).toContainEqual({ locale: "en", slug: "project1" });
      expect(result).toContainEqual({ locale: "ko", slug: "project1" });
      expect(result).toContainEqual({ locale: "en", slug: "project2" });
    });

    it("correctly extracts slug from directory name", () => {
      mockFs.readdirSync.mockReturnValue(["complex-project-name"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        if (p.endsWith("prd.en.mdx")) return true;
        return false;
      });

      const result = getAllPRDSlugs();
      expect(result[0].slug).toBe("complex-project-name");
    });

    it("handles slugs with hyphens and underscores", () => {
      mockFs.readdirSync.mockReturnValue([
        "test_project-v2",
        "another-project_123",
      ] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });

      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.endsWith("content/projects")) return true;
        if (p.endsWith("prd.en.mdx")) return true;
        return false;
      });

      const result = getAllPRDSlugs();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ locale: "en", slug: "test_project-v2" });
      expect(result).toContainEqual({ locale: "en", slug: "another-project_123" });
    });
  });
});
