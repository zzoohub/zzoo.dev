import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCTA } from "./product-cta";

const primaryBtn = { label: "Get Started", url: "https://example.com/start" };
const secondaryBtn = { label: "Learn More", url: "https://example.com/docs" };

describe("ProductCTA", () => {
  describe("null rendering", () => {
    it("returns null when neither primary nor secondary is provided", () => {
      const { container } = render(<ProductCTA heading="Get Started Today" />);
      expect(container.firstChild).toBeNull();
    });

    it("returns null when both primary and secondary are explicitly undefined", () => {
      const { container } = render(
        <ProductCTA heading="CTA" primary={undefined} secondary={undefined} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("rendering with primary only", () => {
    it("renders the heading", () => {
      render(<ProductCTA heading="Start Your Journey" primary={primaryBtn} />);
      expect(screen.getByText("Start Your Journey")).toBeInTheDocument();
    });

    it("renders heading as h2", () => {
      render(<ProductCTA heading="Get Started" primary={primaryBtn} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Get Started");
    });

    it("renders primary button with correct label", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      expect(screen.getByText("Get Started")).toBeInTheDocument();
    });

    it("renders primary button as link with correct href", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      const link = screen.getByRole("link", { name: /Get Started/i });
      expect(link).toHaveAttribute("href", "https://example.com/start");
    });

    it("renders primary link with target blank", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      const link = screen.getByRole("link", { name: /Get Started/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders primary link with rel noopener noreferrer", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      const link = screen.getByRole("link", { name: /Get Started/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not render secondary button when not provided", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      expect(screen.queryByText("Learn More")).not.toBeInTheDocument();
    });
  });

  describe("rendering with secondary only", () => {
    it("renders heading", () => {
      render(<ProductCTA heading="Resources" secondary={secondaryBtn} />);
      expect(screen.getByText("Resources")).toBeInTheDocument();
    });

    it("renders secondary button with correct label", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      expect(screen.getByText("Learn More")).toBeInTheDocument();
    });

    it("renders secondary button as link with correct href", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      const link = screen.getByRole("link", { name: /Learn More/i });
      expect(link).toHaveAttribute("href", "https://example.com/docs");
    });

    it("renders secondary link with target blank", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      const link = screen.getByRole("link", { name: /Learn More/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders secondary link with rel noopener noreferrer", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      const link = screen.getByRole("link", { name: /Learn More/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not render primary button when not provided", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    });
  });

  describe("rendering with both primary and secondary", () => {
    it("renders both buttons", () => {
      render(
        <ProductCTA heading="CTA" primary={primaryBtn} secondary={secondaryBtn} />
      );
      expect(screen.getByText("Get Started")).toBeInTheDocument();
      expect(screen.getByText("Learn More")).toBeInTheDocument();
    });

    it("renders two link elements", () => {
      render(
        <ProductCTA heading="CTA" primary={primaryBtn} secondary={secondaryBtn} />
      );
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });

    it("primary link has correct href", () => {
      render(
        <ProductCTA heading="CTA" primary={primaryBtn} secondary={secondaryBtn} />
      );
      const primaryLink = screen.getByRole("link", { name: /Get Started/i });
      expect(primaryLink).toHaveAttribute("href", "https://example.com/start");
    });

    it("secondary link has correct href", () => {
      render(
        <ProductCTA heading="CTA" primary={primaryBtn} secondary={secondaryBtn} />
      );
      const secondaryLink = screen.getByRole("link", { name: /Learn More/i });
      expect(secondaryLink).toHaveAttribute("href", "https://example.com/docs");
    });
  });

  describe("section structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("renders button container with flex layout", () => {
      const { container } = render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      const flexContainer = container.querySelector("div.flex");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders ExternalLink icon inside primary link", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      const primaryLink = screen.getByRole("link", { name: /Get Started/i });
      const icon = primaryLink.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders ExternalLink icon inside secondary link", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      const secondaryLink = screen.getByRole("link", { name: /Learn More/i });
      const icon = secondaryLink.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies font-bold to heading", () => {
      render(<ProductCTA heading="CTA Heading" primary={primaryBtn} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("font-bold");
    });

    it("applies primary button styling classes", () => {
      render(<ProductCTA heading="CTA" primary={primaryBtn} />);
      const link = screen.getByRole("link", { name: /Get Started/i });
      expect(link).toHaveClass("bg-primary");
      expect(link).toHaveClass("rounded-lg");
      expect(link).toHaveClass("inline-flex");
    });

    it("applies secondary button styling classes", () => {
      render(<ProductCTA heading="CTA" secondary={secondaryBtn} />);
      const link = screen.getByRole("link", { name: /Learn More/i });
      expect(link).toHaveClass("border");
      expect(link).toHaveClass("rounded-lg");
      expect(link).toHaveClass("inline-flex");
    });
  });
});
