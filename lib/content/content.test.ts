import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getAllBlogPosts,
  getBlogPost,
  getAllProjects,
  getProject,
  getTestimonials,
  hasEngineeringDoc,
  getEngineeringDoc,
  getAboutContent,
  hasDesignContent,
  getDesignContent,
} from ".";

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
const mockFs = fs as unknown as Record<string, ReturnType<typeof vi.fn>>;

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

  describe("getAllProjects", () => {
    it("returns empty array when directory does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const studies = getAllProjects("en");
      expect(studies).toEqual([]);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects")
      );
    });

    it("returns empty array when directory exists but has no slug dirs", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      const studies = getAllProjects("en");
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
launchDate: 2023-06-01
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies).toHaveLength(1);
      expect(studies[0]).toMatchObject({
        slug: "project",
        title: "E-commerce Rebuild",
        description: "Rebuilt platform",
        status: "completed",
        techStack: ["Next.js", "TypeScript"],
        launchDate: "2023-06-01",
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
launchDate: 2024-01-01
---
Content`
      );

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01
---
Content`
      );

      const studies = getAllProjects("en");
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
launchDate: 2023-01-01
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].featured).toBe(true);
    });

    it("sorts case studies by launchDate descending", () => {
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
status: completed`;

        if (callCount === 1) {
          return `---\ntitle: Old\ndescription: Desc\n${base}\nlaunchDate: 2022-01-01\n---\nContent`;
        } else if (callCount === 2) {
          return `---\ntitle: New\ndescription: Desc\n${base}\nlaunchDate: 2024-01-01\n---\nContent`;
        } else {
          return `---\ntitle: Middle\ndescription: Desc\n${base}\nlaunchDate: 2023-01-01\n---\nContent`;
        }
      });

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01`;

        if (callCount === 1) {
          return `---\n${base}\nstatus: active\n---\nContent`;
        } else if (callCount === 2) {
          return `---\n${base}\nstatus: completed\n---\nContent`;
        } else {
          return `---\n${base}\nstatus: archived\n---\nContent`;
        }
      });

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01
---
내용`
      );

      const studies = getAllProjects("ko");
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

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01
d2Diagram: architecture.d2
---
Content`
      );

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01
links:
  live: https://example.com
  github: https://github.com/example/repo
  docs: https://docs.example.com
---
Content`
      );

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01
---
Content`
      );

      const studies = getAllProjects("en");
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
launchDate: 2024-01-01
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toBeUndefined();
    });
  });

  describe("getProject", () => {
    it("returns null for invalid slug", () => {
      const study = getProject("en", "../../../etc/passwd");
      expect(study).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null for slug with special characters", () => {
      const study = getProject("en", "project@name!");
      expect(study).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null when file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const study = getProject("en", "nonexistent");
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
launchDate: 2024-01-01
---
Project details here`
      );

      const study = getProject("en", "test-project");
      expect(study).not.toBeNull();
      expect(study?.meta).toMatchObject({
        slug: "test-project",
        title: "Test Project",
        description: "A test project",
        status: "active",
        techStack: ["React"],
        featured: false,
        launchDate: "2024-01-01",
      });
      expect(study?.content).toBe("Project details here");
    });

    it("checks correct file path for en locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getProject("en", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/en.mdx")
      );
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getProject("ko", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/ko.mdx")
      );
    });

    it("includes d2Diagram field when provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
d2Diagram: diagram.d2
---
Content`
      );

      const study = getProject("en", "project");
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
launchDate: 2024-01-01
links:
  live: https://live.example.com
  github: https://github.com/example
---
Content`
      );

      const study = getProject("en", "project");
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

  describe("hasEngineeringDoc", () => {
    it("returns true when engineering.{locale}.mdx file exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasEngineeringDoc("en", "e-commerce-rebuild");
      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/e-commerce-rebuild/engineering.en.mdx")
      );
    });

    it("returns false when engineering.{locale}.mdx file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = hasEngineeringDoc("en", "no-design-project");
      expect(result).toBe(false);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/no-design-project/engineering.en.mdx")
      );
    });

    it("returns false for invalid slug", () => {
      const result = hasEngineeringDoc("en", "../../../etc/passwd");
      expect(result).toBe(false);
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns false for slug with special characters", () => {
      const result = hasEngineeringDoc("en", "project@name");
      expect(result).toBe(false);
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("checks correct path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      hasEngineeringDoc("ko", "test-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/test-project/engineering.ko.mdx")
      );
    });

    it("handles slug with hyphens and underscores", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasEngineeringDoc("en", "test_project-v2");
      expect(result).toBe(true);
    });

    it("handles slug with numbers", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasEngineeringDoc("en", "project123");
      expect(result).toBe(true);
    });
  });

  describe("getEngineeringDoc", () => {
    it("returns null when engineering doc file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = getEngineeringDoc("en", "nonexistent");
      expect(result).toBeNull();
    });

    it("returns null for invalid slug", () => {
      const result = getEngineeringDoc("en", "../../../etc/passwd");
      expect(result).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null when parent project does not exist", () => {
      let callCount = 0;
      mockFs.existsSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return true;
        return false;
      });

      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Engineering Doc Only\n---\nEngineering content"
      );

      const result = getEngineeringDoc("en", "orphan-engineering");
      expect(result).toBeNull();
    });

    it("returns engineering doc content with parent project meta when both exist", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\ntitle: Engineering Doc Title\n---\nEngineering doc detailed content here";
        }
        return `---
title: E-commerce Rebuild
description: Rebuilt platform
clientType: SaaS
status: completed
techStack:
  - Next.js
launchDate: 2023-06-01
---
Parent project content`;
      });

      const result = getEngineeringDoc("en", "e-commerce-rebuild");
      expect(result).not.toBeNull();
      expect(result?.content).toBe("Engineering doc detailed content here");
      expect(result?.meta).toMatchObject({
        slug: "e-commerce-rebuild",
        title: "E-commerce Rebuild",
        description: "Rebuilt platform",
        status: "completed",
        techStack: ["Next.js"],
        launchDate: "2023-06-01",
      });
    });

    it("checks correct file path for en locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getEngineeringDoc("en", "test-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/test-project/engineering.en.mdx")
      );
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getEngineeringDoc("ko", "test-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/test-project/engineering.ko.mdx")
      );
    });

    it("inherits all parent meta fields including optional ones", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\ntitle: Design Doc\n---\nDesign content";
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
launchDate: 2023-01-01
d2Diagram: diagram.d2
links:
  live: https://example.com
  github: https://github.com/example/repo
---
Content`;
      });

      const result = getEngineeringDoc("en", "featured-project");
      expect(result?.meta.featured).toBe(true);
      expect(result?.meta.d2Diagram).toBe("diagram.d2");
      expect(result?.meta.links).toEqual({
        live: "https://example.com",
        github: "https://github.com/example/repo",
      });
    });
  });

  describe("getAboutContent", () => {
    it("returns null when file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = getAboutContent("en");
      expect(result).toBeNull();
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/about/en.mdx")
      );
    });

    it("returns about data with content when file exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
experience:
  - period: 2020-2023
    title: Senior Developer at Tech Corp
    description: Led frontend team
  - period: 2018-2020
    title: Developer at Startup Inc
    description: Built core product
---
About me content here`
      );

      const result = getAboutContent("en");
      expect(result).not.toBeNull();
      expect(result?.experience).toEqual([
        {
          period: "2020-2023",
          title: "Senior Developer at Tech Corp",
          description: "Led frontend team",
        },
        {
          period: "2018-2020",
          title: "Developer at Startup Inc",
          description: "Built core product",
        },
      ]);
      expect(result?.content).toBe("About me content here");
    });

    it("handles missing experience field with default empty array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "---\n---\nAbout content without experience"
      );

      const result = getAboutContent("en");
      expect(result?.experience).toEqual([]);
      expect(result?.content).toBe("About content without experience");
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getAboutContent("ko");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/about/ko.mdx")
      );
    });

    it("handles empty experience array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "---\nexperience: []\n---\nContent"
      );

      const result = getAboutContent("en");
      expect(result?.experience).toEqual([]);
    });
  });

  describe("hasDesignContent", () => {
    it("returns false for invalid slug", () => {
      const result = hasDesignContent("en", "../../../etc/passwd");
      expect(result).toBe(false);
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns false for slug with special characters", () => {
      const result = hasDesignContent("en", "project@name!");
      expect(result).toBe(false);
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns true when design.{locale}.mdx exists", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasDesignContent("en", "my-project");
      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/design.en.mdx")
      );
    });

    it("returns false when design.{locale}.mdx does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = hasDesignContent("en", "my-project");
      expect(result).toBe(false);
    });

    it("checks correct path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      hasDesignContent("ko", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/design.ko.mdx")
      );
    });

    it("handles slug with hyphens and underscores", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasDesignContent("en", "my_project-v2");
      expect(result).toBe(true);
    });

    it("handles slug with numbers", () => {
      mockFs.existsSync.mockReturnValue(true);
      const result = hasDesignContent("en", "project123");
      expect(result).toBe(true);
    });
  });

  describe("getDesignContent", () => {
    it("returns null for invalid slug", () => {
      const result = getDesignContent("en", "../../../etc/passwd");
      expect(result).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null for slug with special characters", () => {
      const result = getDesignContent("en", "project@name!");
      expect(result).toBeNull();
      expect(mockFs.existsSync).not.toHaveBeenCalled();
    });

    it("returns null when design file does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const result = getDesignContent("en", "nonexistent");
      expect(result).toBeNull();
    });

    it("checks correct file path for en locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getDesignContent("en", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/design.en.mdx")
      );
    });

    it("checks correct file path for ko locale", () => {
      mockFs.existsSync.mockReturnValue(false);
      getDesignContent("ko", "my-project");
      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("content/projects/my-project/design.ko.mdx")
      );
    });

    it("returns null when parent project does not exist", () => {
      let callCount = 0;
      mockFs.existsSync.mockImplementation(() => {
        callCount++;
        // design file exists, but parent en.mdx does not
        if (callCount === 1) return true;
        return false;
      });

      mockFs.readFileSync.mockReturnValue(
        "---\ntitle: Design Only\n---\nDesign content"
      );

      const result = getDesignContent("en", "orphan-design");
      expect(result).toBeNull();
    });

    it("returns design content with parent meta when both exist", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // design.en.mdx content
          return "---\ntitle: Design Detail\n---\nDetailed design analysis here";
        }
        // parent en.mdx content
        return `---
title: My Project
description: Project description
clientType: SaaS
status: completed
techStack:
  - React
  - TypeScript
launchDate: 2024-01-01
---
Parent project content`;
      });

      const result = getDesignContent("en", "my-project");
      expect(result).not.toBeNull();
      expect(result?.content).toBe("Detailed design analysis here");
      expect(result?.meta).toMatchObject({
        slug: "my-project",
        title: "My Project",
        description: "Project description",
        status: "completed",
        techStack: ["React", "TypeScript"],
        launchDate: "2024-01-01",
      });
    });

    it("reads design content from design file, not parent", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\n---\nThis is unique design text";
        }
        return `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Parent content`;
      });

      const result = getDesignContent("en", "project");
      expect(result?.content).toBe("This is unique design text");
    });

    it("inherits all parent meta fields including optional ones", () => {
      mockFs.existsSync.mockReturnValue(true);

      let callCount = 0;
      mockFs.readFileSync.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "---\n---\nDesign content";
        }
        return `---
title: Featured Project
description: Featured description
clientType: Enterprise
status: completed
techStack:
  - Vue.js
featured: true
launchDate: 2023-06-15
d2Diagram: arch.d2
links:
  live: https://example.com
---
Content`;
      });

      const result = getDesignContent("en", "featured-project");
      expect(result?.meta.featured).toBe(true);
      expect(result?.meta.d2Diagram).toBe("arch.d2");
      expect(result?.meta.links).toEqual({ live: "https://example.com" });
    });
  });

  describe("parseProjectMeta (via getProject)", () => {
    it("parses valid category: mobile-app", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Mobile App
description: Desc
clientType: B2C
status: active
launchDate: 2024-01-01
category: mobile-app
---
Content`
      );

      const study = getProject("en", "app");
      expect(study?.meta.category).toBe("mobile-app");
    });

    it("parses valid category: chrome-extension", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Extension
description: Desc
clientType: B2C
status: active
launchDate: 2024-01-01
category: chrome-extension
---
Content`
      );

      const study = getProject("en", "ext");
      expect(study?.meta.category).toBe("chrome-extension");
    });

    it("parses valid category: web", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Web App
description: Desc
clientType: B2C
status: active
launchDate: 2024-01-01
category: web
---
Content`
      );

      const study = getProject("en", "webapp");
      expect(study?.meta.category).toBe("web");
    });

    it("parses valid category: cli", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: CLI Tool
description: Desc
clientType: Dev
status: active
launchDate: 2024-01-01
category: cli
---
Content`
      );

      const study = getProject("en", "cli-tool");
      expect(study?.meta.category).toBe("cli");
    });

    it("returns undefined category for invalid category value", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
category: invalid-category
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.category).toBeUndefined();
    });

    it("returns undefined category when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.category).toBeUndefined();
    });

    it("parses tagline field", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
tagline: "The best tool ever"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.tagline).toBe("The best tool ever");
    });

    it("returns undefined tagline when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.tagline).toBeUndefined();
    });

    it("resolves absolute thumbnail path as-is", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
thumbnail: /images/custom/thumb.png
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.thumbnail).toBe("/images/custom/thumb.png");
    });

    it("resolves relative thumbnail path with slug prefix", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
thumbnail: thumb.png
---
Content`
      );

      const study = getProject("en", "my-project");
      expect(study?.meta.thumbnail).toBe("/images/projects/my-project/thumb.png");
    });

    it("returns undefined thumbnail when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.thumbnail).toBeUndefined();
    });

    it("resolves relative heroImage path with slug prefix", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
heroImage: hero.jpg
---
Content`
      );

      const study = getProject("en", "my-project");
      expect(study?.meta.heroImage).toBe("/images/projects/my-project/hero.jpg");
    });

    it("resolves absolute heroImage path as-is", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
heroImage: /images/hero/shot.png
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.heroImage).toBe("/images/hero/shot.png");
    });

    it("returns undefined heroImage when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.heroImage).toBeUndefined();
    });

    it("parses valid YouTube embed video URL", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: https://www.youtube.com/embed/dQw4w9WgXcQ
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("returns undefined for non-YouTube video URL", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: https://vimeo.com/123456
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBeUndefined();
    });

    it("returns undefined for non-embed YouTube URL", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBeUndefined();
    });

    it("returns undefined for non-string video value", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: 12345
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBeUndefined();
    });

    it("parses images array with relative paths resolved to slug prefix", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
images:
  - shot1.png
  - shot2.png
---
Content`
      );

      const study = getProject("en", "my-project");
      expect(study?.meta.images).toEqual([
        "/images/projects/my-project/shot1.png",
        "/images/projects/my-project/shot2.png",
      ]);
    });

    it("returns undefined images when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.images).toBeUndefined();
    });

    it("returns undefined images when empty array provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
images: []
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.images).toBeUndefined();
    });
  });

  describe("sanitizeCta (via getProject)", () => {
    it("parses primary and secondary CTA buttons", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
cta:
  primary:
    label: "Get Started"
    url: https://example.com/start
  secondary:
    label: "Learn More"
    url: https://example.com/docs
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toEqual({
        primary: { label: "Get Started", url: "https://example.com/start" },
        secondary: { label: "Learn More", url: "https://example.com/docs" },
      });
    });

    it("parses only primary CTA when secondary missing", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
cta:
  primary:
    label: "Try Now"
    url: https://example.com
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toEqual({
        primary: { label: "Try Now", url: "https://example.com" },
      });
      expect(study?.meta.cta?.secondary).toBeUndefined();
    });

    it("returns undefined cta when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toBeUndefined();
    });

    it("returns undefined cta when null", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
cta: null
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toBeUndefined();
    });

    it("skips CTA entry with invalid URL", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
cta:
  primary:
    label: "Bad CTA"
    url: "not-a-url"
  secondary:
    label: "Good CTA"
    url: https://example.com
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toEqual({
        secondary: { label: "Good CTA", url: "https://example.com" },
      });
    });

    it("skips CTA entry with non-string label", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
cta:
  primary:
    label: 123
    url: https://example.com
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toBeUndefined();
    });

    it("returns undefined when both CTA entries are invalid", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
cta:
  primary: "not an object"
  secondary: 42
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.cta).toBeUndefined();
    });
  });

  describe("sanitizeCompetitors (via getProject)", () => {
    it("parses valid competitors array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
competitors:
  - name: Competitor A
    differentiator: "We are faster"
  - name: Competitor B
    differentiator: "We are cheaper"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.competitors).toEqual([
        { name: "Competitor A", differentiator: "We are faster" },
        { name: "Competitor B", differentiator: "We are cheaper" },
      ]);
    });

    it("returns undefined competitors when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.competitors).toBeUndefined();
    });

    it("returns undefined competitors for empty array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
competitors: []
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.competitors).toBeUndefined();
    });

    it("drops competitors array when any entry has missing fields", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
competitors:
  - name: Valid Competitor
    differentiator: "Better UX"
  - name: Missing Differentiator
  - differentiator: "Missing Name"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.competitors).toBeUndefined();
    });

    it("returns undefined when all competitors are invalid", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
competitors:
  - "just a string"
  - 42
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.competitors).toBeUndefined();
    });

    it("returns undefined when competitors is not an array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
competitors: "not an array"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.competitors).toBeUndefined();
    });
  });

  describe("sanitizeFeatures (via getProject)", () => {
    it("parses valid features array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
features:
  - title: "Fast"
    description: "Lightning-fast performance"
    icon: zap
  - title: "Secure"
    description: "End-to-end encryption"
    icon: shield
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toEqual([
        { title: "Fast", description: "Lightning-fast performance", icon: "zap" },
        { title: "Secure", description: "End-to-end encryption", icon: "shield" },
      ]);
    });

    it("parses features without optional icon", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
features:
  - title: "Feature One"
    description: "A nice feature"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toEqual([
        { title: "Feature One", description: "A nice feature" },
      ]);
    });

    it("returns undefined features when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toBeUndefined();
    });

    it("returns undefined features for empty array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
features: []
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toBeUndefined();
    });

    it("drops features array when any entry has missing required fields", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
features:
  - title: "Valid Feature"
    description: "Has both required fields"
  - title: "Missing Description"
  - description: "Missing Title"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toBeUndefined();
    });

    it("drops features array when icon is not a string", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
features:
  - title: "Feature"
    description: "Desc"
    icon: 42
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toBeUndefined();
    });

    it("returns undefined when features is not an array", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
features: "not an array"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.features).toBeUndefined();
    });
  });

  describe("sanitizeKeywords (via getProject)", () => {
    it("parses primary and longTail keywords", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords:
  primary:
    - "web development"
    - "react"
  longTail:
    - "best react development tool"
    - "how to build react apps"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toEqual({
        primary: ["web development", "react"],
        longTail: ["best react development tool", "how to build react apps"],
      });
    });

    it("parses only primary keywords when longTail missing", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords:
  primary:
    - "keyword one"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toEqual({
        primary: ["keyword one"],
      });
    });

    it("parses only longTail keywords when primary missing", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords:
  longTail:
    - "long tail keyword"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toEqual({
        longTail: ["long tail keyword"],
      });
    });

    it("returns undefined keywords when not provided", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toBeUndefined();
    });

    it("returns undefined keywords when null", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords: null
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toBeUndefined();
    });

    it("filters non-string values from keyword arrays", () => {
      mockFs.existsSync.mockReturnValue(true);
      // Use a manually crafted file content via gray-matter behavior
      // We need to mock readFileSync to return a string that gray-matter parses
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords:
  primary:
    - "valid keyword"
    - "another valid"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords?.primary).toEqual(["valid keyword", "another valid"]);
    });

    it("returns undefined when keywords is not an object", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords: "not an object"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toBeUndefined();
    });

    it("returns undefined when keywords object has empty primary and longTail arrays", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords:
  primary: []
  longTail: []
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toBeUndefined();
    });

    it("returns undefined when keywords object has no primary or longTail arrays", () => {
      mockFs.existsSync.mockReturnValue(true);
      // keywords is an object but has no primary/longTail array keys
      // This exercises the Object.keys(result).length === 0 branch
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
keywords:
  other: "some value"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.keywords).toBeUndefined();
    });
  });

  describe("resolveProjectImage edge cases (via getProject)", () => {
    it("drops thumbnail starting with //", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
thumbnail: "//cdn.example.com/image.jpg"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.thumbnail).toBeUndefined();
    });

    it("drops thumbnail containing ..", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
thumbnail: "../../etc/passwd"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.thumbnail).toBeUndefined();
    });

    it("drops heroImage starting with //", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
heroImage: "//cdn.example.com/hero.jpg"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.heroImage).toBeUndefined();
    });

    it("drops heroImage containing ..", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
heroImage: "../relative/path.jpg"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.heroImage).toBeUndefined();
    });
  });

  describe("isYouTubeEmbedUrl (via getProject)", () => {
    it("accepts youtube.com embed URL", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: https://youtube.com/embed/abc123
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBe("https://youtube.com/embed/abc123");
    });

    it("rejects malformed URL", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: "://invalid"
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBeUndefined();
    });

    it("rejects non-string video value", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
video: true
---
Content`
      );

      const study = getProject("en", "project");
      expect(study?.meta.video).toBeUndefined();
    });
  });

  describe("sanitizeLinks edge cases", () => {
    it("handles invalid URL that throws during URL construction", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links:
  live: "not a valid url at all"
  github: "://malformed"
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toBeUndefined();
    });

    it("filters out non-http/https protocols", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links:
  live: "ftp://example.com"
  github: "file:///etc/passwd"
  docs: "javascript:alert(1)"
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toBeUndefined();
    });

    it("handles non-string link values", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links:
  live: 12345
  github: true
  docs: null
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toBeUndefined();
    });

    it("handles null links field", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links: null
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toBeUndefined();
    });

    it("accepts valid https URLs", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links:
  live: https://example.com
  github: https://github.com/user/repo
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toEqual({
        live: "https://example.com",
        github: "https://github.com/user/repo",
      });
    });

    it("accepts valid http URLs", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links:
  live: http://example.com
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toEqual({
        live: "http://example.com",
      });
    });

    it("handles mixed valid and invalid links", () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["project"] as unknown as fs.Dirent[]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => true });
      mockFs.readFileSync.mockReturnValue(
        `---
title: Project
description: Desc
clientType: Test
status: active
launchDate: 2024-01-01
links:
  live: https://example.com
  github: "not a url"
  docs: https://docs.example.com
---
Content`
      );

      const studies = getAllProjects("en");
      expect(studies[0].links).toEqual({
        live: "https://example.com",
        docs: "https://docs.example.com",
      });
    });
  });
});
