import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AvailabilityBadge } from "./availability-badge";

// Mock the site config module with a mutable object
const mockConfig = {
  name: "zzoo.dev",
  url: "https://zzoo.dev",
  email: "hello@zzoo.dev",
  availability: "available" as "available" | "limited" | "booked",
  bookedUntil: undefined as string | undefined,
  social: {
    github: "https://github.com/zzoo",
    linkedin: "https://linkedin.com/in/zzoo",
  },
  calLink: "https://cal.com/zzoo",
};

vi.mock("@/lib/site-config", () => ({
  get siteConfig() {
    return mockConfig;
  },
}));

describe("AvailabilityBadge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfig.availability = "available";
    mockConfig.bookedUntil = undefined;
  });

  describe("rendering with different statuses", () => {
    it("renders with available status", () => {
      render(<AvailabilityBadge />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("available")).toBeInTheDocument();
    });

    it("renders with limited status", () => {
      mockConfig.availability = "limited";
      render(<AvailabilityBadge />);
      expect(screen.getByText("limited")).toBeInTheDocument();
    });

    it("renders with booked status and date", () => {
      mockConfig.availability = "booked";
      mockConfig.bookedUntil = "2024-06-01";
      render(<AvailabilityBadge />);
      expect(screen.getByText("Booked until 2024-06-01")).toBeInTheDocument();
    });

    it("renders with booked status and empty date", () => {
      mockConfig.availability = "booked";
      mockConfig.bookedUntil = "";
      render(<AvailabilityBadge />);
      expect(screen.getByText(/Booked until/)).toBeInTheDocument();
    });

    it("renders with booked status and undefined date", () => {
      mockConfig.availability = "booked";
      mockConfig.bookedUntil = undefined;
      render(<AvailabilityBadge />);
      expect(screen.getByText(/Booked until/)).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders with default medium size", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("px-3");
      expect(badge).toHaveClass("py-1");
      expect(badge).toHaveClass("text-sm");
    });

    it("renders with small size", () => {
      render(<AvailabilityBadge size="sm" />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("px-2.5");
      expect(badge).toHaveClass("py-0.5");
      expect(badge).toHaveClass("text-xs");
    });

    it("renders with medium size explicitly", () => {
      render(<AvailabilityBadge size="md" />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("px-3");
      expect(badge).toHaveClass("py-1");
      expect(badge).toHaveClass("text-sm");
    });

    it("renders with large size", () => {
      render(<AvailabilityBadge size="lg" />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("px-4");
      expect(badge).toHaveClass("py-2");
      expect(badge).toHaveClass("text-base");
    });
  });

  describe("dot indicator", () => {
    it("renders green dot for available status", () => {
      const { container } = render(<AvailabilityBadge />);
      const dot = container.querySelector(".bg-green-500");
      expect(dot).toBeInTheDocument();
    });

    it("renders amber dot for limited status", () => {
      mockConfig.availability = "limited";
      const { container } = render(<AvailabilityBadge />);
      const dot = container.querySelector(".bg-amber-500");
      expect(dot).toBeInTheDocument();
    });

    it("renders red dot for booked status", () => {
      mockConfig.availability = "booked";
      mockConfig.bookedUntil = "2024-06-01";
      const { container } = render(<AvailabilityBadge />);
      const dot = container.querySelector(".bg-red-500");
      expect(dot).toBeInTheDocument();
    });

    it("dot has aria-hidden attribute", () => {
      const { container } = render(<AvailabilityBadge />);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toBeInTheDocument();
    });

    it("dot is pulsing", () => {
      const { container } = render(<AvailabilityBadge />);
      const dot = container.querySelector(".animate-pulse");
      expect(dot).toBeInTheDocument();
    });

    it("dot is rounded", () => {
      const { container } = render(<AvailabilityBadge />);
      const dot = container.querySelector(".rounded-full");
      expect(dot).toBeInTheDocument();
    });

    it("small dot size for sm variant", () => {
      const { container } = render(<AvailabilityBadge size="sm" />);
      const dot = container.querySelector(".h-1\\.5");
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveClass("w-1.5");
    });

    it("medium dot size for md variant", () => {
      const { container } = render(<AvailabilityBadge size="md" />);
      const dot = container.querySelector(".h-2");
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveClass("w-2");
    });

    it("large dot size for lg variant", () => {
      const { container } = render(<AvailabilityBadge size="lg" />);
      const dot = container.querySelector(".h-2\\.5");
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveClass("w-2.5");
    });
  });

  describe("accessibility", () => {
    it("has role status", () => {
      render(<AvailabilityBadge />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has aria-live polite", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveAttribute("aria-live", "polite");
    });

    it("renders as a span element", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge.tagName).toBe("SPAN");
    });
  });

  describe("styling", () => {
    it("applies base classes", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("inline-flex");
      expect(badge).toHaveClass("items-center");
      expect(badge).toHaveClass("gap-2");
      expect(badge).toHaveClass("rounded-full");
      expect(badge).toHaveClass("border");
      expect(badge).toHaveClass("border-border");
    });

    it("applies inline-flex layout", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("inline-flex");
    });

    it("applies items-center alignment", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("items-center");
    });

    it("applies gap between dot and text", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("gap-2");
    });

    it("applies rounded-full shape", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("rounded-full");
    });

    it("applies border styling", () => {
      render(<AvailabilityBadge />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("border");
      expect(badge).toHaveClass("border-border");
    });
  });

  describe("integration", () => {
    it("renders complete badge with all elements", () => {
      const { container } = render(<AvailabilityBadge size="md" />);

      // Check container
      const badge = screen.getByRole("status");
      expect(badge).toBeInTheDocument();

      // Check dot
      const dot = container.querySelector(".bg-green-500");
      expect(dot).toBeInTheDocument();

      // Check text
      expect(screen.getByText("available")).toBeInTheDocument();
    });

    it("updates when status changes", () => {
      const { rerender } = render(<AvailabilityBadge />);

      // Change to limited
      mockConfig.availability = "limited";

      rerender(<AvailabilityBadge />);
      expect(screen.getByText("limited")).toBeInTheDocument();
    });
  });
});
