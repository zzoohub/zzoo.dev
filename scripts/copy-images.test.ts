import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock fs module before any imports so the mock is in place when the script
// auto-executes copyImages() at module load time.
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    lstatSync: vi.fn(),
    mkdirSync: vi.fn(),
    copyFileSync: vi.fn(),
  },
}));

import fs from "fs";

const mockFs = fs as unknown as Record<string, ReturnType<typeof vi.fn>>;

// Each test re-imports the script (which re-runs copyImages()) with the fs
// mocks configured for that specific scenario.
async function runScript() {
  vi.resetModules();
  // Re-apply the mock after resetModules so the freshly-imported module gets
  // our mock rather than the real fs.
  vi.mock("fs", () => ({
    default: {
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      lstatSync: vi.fn(),
      mkdirSync: vi.fn(),
      copyFileSync: vi.fn(),
    },
  }));
  await import("./copy-images");
}

describe("copy-images script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when content/projects directory does not exist", () => {
    it("logs a skip message and does not read any slugs", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No content/projects directory found, skipping."
      );
      expect(mockFs.readdirSync).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("does not create any destination directories", async () => {
      mockFs.existsSync.mockReturnValue(false);
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });

    it("does not copy any files", async () => {
      mockFs.existsSync.mockReturnValue(false);
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).not.toHaveBeenCalled();
    });
  });

  describe("when content/projects exists but has no slug directories", () => {
    it("logs no-images message when slug list is empty", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No images found, skipping."
      );
      consoleSpy.mockRestore();
    });

    it("does not create destination directories", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([]);
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe("when a slug exists but has no images/ subdirectory", () => {
    it("skips the slug and logs no-images message", async () => {
      // content/projects exists; readdirSync("content/projects") → ["my-project"]
      // existsSync("content/projects/my-project/images") → false
      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.includes("my-project/images")) return false;
        return true; // content/projects itself exists
      });
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["my-project"];
        return [];
      });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No images found, skipping."
      );
      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("skips the slug when the images path exists but is not a directory", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["my-project"];
        return [];
      });
      // images path exists but isDirectory() returns false (it's a file)
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => false });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No images found, skipping."
      );
      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("when a slug has an images/ directory with image files", () => {
    it("creates the destination directory", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["my-project"];
        return ["photo.png"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining("public/images/projects/my-project"),
        { recursive: true }
      );
    });

    it("copies image files to the destination directory", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["my-project"];
        return ["hero.png"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("my-project/images/hero.png"),
        expect.stringContaining("public/images/projects/my-project/hero.png")
      );
    });

    it("logs each copied file as slug/filename", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["my-project"];
        return ["hero.png"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] my-project/hero.png"
      );
      consoleSpy.mockRestore();
    });

    it("logs the total count of copied images on completion", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["my-project"];
        return ["a.png", "b.jpg"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] Done. Copied 2 image(s)."
      );
      consoleSpy.mockRestore();
    });
  });

  describe("image extension filtering", () => {
    const imageExtensions = [
      "photo.png",
      "photo.jpg",
      "photo.jpeg",
      "photo.webp",
      "photo.avif",
      "photo.svg",
      "photo.gif",
    ];

    it.each(imageExtensions)("copies %s (supported image format)", async (filename) => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return [filename];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining(filename),
        expect.stringContaining(filename)
      );
    });

    it("copies files with uppercase extensions (case-insensitive)", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return ["PHOTO.PNG"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("PHOTO.PNG"),
        expect.stringContaining("PHOTO.PNG")
      );
    });

    it("copies files with mixed-case extensions (case-insensitive)", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return ["Banner.Jpg"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("Banner.Jpg"),
        expect.stringContaining("Banner.Jpg")
      );
    });

    const nonImageFiles = [
      "readme.md",
      "notes.txt",
      "data.json",
      "style.css",
      "script.js",
      "archive.zip",
      "doc.pdf",
    ];

    it.each(nonImageFiles)("skips %s (non-image file)", async (filename) => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return [filename];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).not.toHaveBeenCalled();
      // No per-file log, only the "no images" log
      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No images found, skipping."
      );
      consoleSpy.mockRestore();
    });

    it("skips non-image files and only copies image files in the same directory", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return ["hero.png", "readme.md", "data.json", "banner.webp"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledTimes(2);
      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("hero.png"),
        expect.stringContaining("hero.png")
      );
      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("banner.webp"),
        expect.stringContaining("banner.webp")
      );
    });

    it("does not log non-image files individually", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return ["hero.png", "readme.md"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      // Should log the image file but NOT the readme
      expect(consoleSpy).toHaveBeenCalledWith("[copy-images] slug/hero.png");
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("readme.md")
      );
      consoleSpy.mockRestore();
    });
  });

  describe("multiple slugs", () => {
    it("processes images from all slugs", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        const str = p.toString();
        if (str.endsWith("projects")) return ["alpha", "beta"];
        if (str.includes("alpha")) return ["logo.svg"];
        if (str.includes("beta")) return ["screenshot.jpg"];
        return [];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledTimes(2);
      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("alpha/images/logo.svg"),
        expect.stringContaining("public/images/projects/alpha/logo.svg")
      );
      expect(mockFs.copyFileSync).toHaveBeenCalledWith(
        expect.stringContaining("beta/images/screenshot.jpg"),
        expect.stringContaining("public/images/projects/beta/screenshot.jpg")
      );
    });

    it("creates a separate destination directory for each slug", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        const str = p.toString();
        if (str.endsWith("projects")) return ["alpha", "beta"];
        return ["image.png"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.mkdirSync).toHaveBeenCalledTimes(2);
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining("public/images/projects/alpha"),
        { recursive: true }
      );
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining("public/images/projects/beta"),
        { recursive: true }
      );
    });

    it("logs per-file lines for all slugs", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        const str = p.toString();
        if (str.endsWith("projects")) return ["alpha", "beta"];
        if (str.includes("alpha")) return ["logo.svg"];
        if (str.includes("beta")) return ["shot.gif"];
        return [];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith("[copy-images] alpha/logo.svg");
      expect(consoleSpy).toHaveBeenCalledWith("[copy-images] beta/shot.gif");
      consoleSpy.mockRestore();
    });

    it("reports the correct total count across all slugs", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        const str = p.toString();
        if (str.endsWith("projects")) return ["alpha", "beta"];
        // each images dir has 3 images
        return ["a.png", "b.jpg", "c.webp"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] Done. Copied 6 image(s)."
      );
      consoleSpy.mockRestore();
    });

    it("skips a slug without an images dir but still processes others", async () => {
      mockFs.existsSync.mockImplementation((p: string) => {
        if (p.toString().includes("no-images/images")) return false;
        return true;
      });
      mockFs.readdirSync.mockImplementation((p: string) => {
        const str = p.toString();
        if (str.endsWith("projects")) return ["no-images", "has-images"];
        return ["photo.png"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(mockFs.copyFileSync).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] has-images/photo.png"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] Done. Copied 1 image(s)."
      );
      consoleSpy.mockRestore();
    });
  });

  describe("zero images found across all slugs", () => {
    it("logs no-images message when all slugs have empty images directories", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug-a", "slug-b"];
        return []; // empty images dirs
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No images found, skipping."
      );
      consoleSpy.mockRestore();
    });

    it("logs no-images message when all files in images dirs are non-images", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug-a"];
        return ["notes.txt", "config.json"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] No images found, skipping."
      );
      consoleSpy.mockRestore();
    });
  });

  describe("singular vs plural count message", () => {
    it("says '1 image(s)' when exactly one image is copied", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((p: string) => {
        if (p.toString().endsWith("projects")) return ["slug"];
        return ["single.png"];
      });
      mockFs.lstatSync.mockReturnValue({ isDirectory: () => true });
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[copy-images] Done. Copied 1 image(s)."
      );
      consoleSpy.mockRestore();
    });
  });
});
