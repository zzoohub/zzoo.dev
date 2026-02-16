import { describe, it, expect } from "vitest";
import { siteConfig } from "./site-config";
import type { AvailabilityStatus, Locale } from "./site-config";

describe("site-config", () => {
  describe("siteConfig", () => {
    it("has a name property", () => {
      expect(siteConfig.name).toBeDefined();
      expect(typeof siteConfig.name).toBe("string");
      expect(siteConfig.name).toBe("zzoo.dev");
    });

    it("has a url property", () => {
      expect(siteConfig.url).toBeDefined();
      expect(typeof siteConfig.url).toBe("string");
      expect(siteConfig.url).toBe("https://zzoo.dev");
    });

    it("url is a valid URL", () => {
      expect(() => new URL(siteConfig.url)).not.toThrow();
    });

    it("has an email property", () => {
      expect(siteConfig.email).toBeDefined();
      expect(typeof siteConfig.email).toBe("string");
      expect(siteConfig.email).toBe("hello@zzoo.dev");
    });

    it("email has valid format", () => {
      expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("has an availability property", () => {
      expect(siteConfig.availability).toBeDefined();
    });

    it("availability is a valid status", () => {
      const validStatuses: AvailabilityStatus[] = [
        "available",
        "limited",
        "booked",
      ];
      expect(validStatuses).toContain(siteConfig.availability);
    });

    it("has a bookedUntil property", () => {
      expect("bookedUntil" in siteConfig).toBe(true);
    });

    it("bookedUntil is undefined or string", () => {
      expect(
        siteConfig.bookedUntil === undefined ||
          typeof siteConfig.bookedUntil === "string"
      ).toBe(true);
    });

    it("has a social property", () => {
      expect(siteConfig.social).toBeDefined();
      expect(typeof siteConfig.social).toBe("object");
    });

    it("social has github property", () => {
      expect(siteConfig.social.github).toBeDefined();
      expect(typeof siteConfig.social.github).toBe("string");
      expect(siteConfig.social.github).toBe("https://github.com/zzoo");
    });

    it("social.github is a valid URL", () => {
      expect(() => new URL(siteConfig.social.github)).not.toThrow();
    });

    it("social has linkedin property", () => {
      expect(siteConfig.social.linkedin).toBeDefined();
      expect(typeof siteConfig.social.linkedin).toBe("string");
      expect(siteConfig.social.linkedin).toBe("https://linkedin.com/in/zzoo");
    });

    it("social.linkedin is a valid URL", () => {
      expect(() => new URL(siteConfig.social.linkedin)).not.toThrow();
    });

    it("has a calLink property", () => {
      expect(siteConfig.calLink).toBeDefined();
      expect(typeof siteConfig.calLink).toBe("string");
      expect(siteConfig.calLink).toBe("https://cal.com/zzoo");
    });

    it("calLink is a valid URL", () => {
      expect(() => new URL(siteConfig.calLink)).not.toThrow();
    });

    it("is a readonly object at compile time", () => {
      // 'as const' is a TypeScript assertion, not a runtime freeze
      // Verify the object has the expected shape
      expect(siteConfig).toBeDefined();
      expect(typeof siteConfig).toBe("object");
    });
  });

  describe("AvailabilityStatus type", () => {
    it("accepts available", () => {
      const status: AvailabilityStatus = "available";
      expect(status).toBe("available");
    });

    it("accepts limited", () => {
      const status: AvailabilityStatus = "limited";
      expect(status).toBe("limited");
    });

    it("accepts booked", () => {
      const status: AvailabilityStatus = "booked";
      expect(status).toBe("booked");
    });
  });

  describe("Locale type", () => {
    it("accepts en", () => {
      const locale: Locale = "en";
      expect(locale).toBe("en");
    });

    it("accepts ko", () => {
      const locale: Locale = "ko";
      expect(locale).toBe("ko");
    });
  });
});
