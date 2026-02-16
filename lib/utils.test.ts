import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      const result = cn("foo", false && "bar", "baz");
      expect(result).toBe("foo baz");
    });

    it("merges Tailwind classes without duplicates", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toBe("py-1 px-4");
    });

    it("handles empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("handles null and undefined", () => {
      const result = cn("foo", null, undefined, "bar");
      expect(result).toBe("foo bar");
    });

    it("handles arrays of class names", () => {
      const result = cn(["foo", "bar"], "baz");
      expect(result).toBe("foo bar baz");
    });

    it("handles objects with boolean values", () => {
      const result = cn({ foo: true, bar: false, baz: true });
      expect(result).toBe("foo baz");
    });

    it("handles complex Tailwind class conflicts", () => {
      const result = cn(
        "text-sm text-red-500",
        "text-blue-500",
        "bg-white",
        "bg-black"
      );
      expect(result).toBe("text-sm text-blue-500 bg-black");
    });

    it("preserves classes with modifiers", () => {
      const result = cn("hover:bg-blue-500", "focus:bg-red-500");
      expect(result).toBe("hover:bg-blue-500 focus:bg-red-500");
    });

    it("handles responsive modifiers correctly", () => {
      const result = cn("md:px-4", "lg:px-6", "md:px-8");
      expect(result).toBe("lg:px-6 md:px-8");
    });
  });
});
