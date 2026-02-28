import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductHero } from "./product-hero";

// Mock next/image since it requires a Next.js environment
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    className,
    priority,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? "true" : undefined}
      sizes={sizes}
      className={className}
      data-priority={priority ? "true" : undefined}
    />
  ),
}));

describe("ProductHero", () => {
  describe("tagline", () => {
    it("renders the tagline text", () => {
      render(<ProductHero tagline="The best tool for developers" title="My Product" />);
      expect(screen.getByText("The best tool for developers")).toBeInTheDocument();
    });

    it("renders tagline in a paragraph element", () => {
      const { container } = render(
        <ProductHero tagline="Amazing tagline" title="Product" />
      );
      const p = container.querySelector("p");
      expect(p).toHaveTextContent("Amazing tagline");
    });

    it("applies text-lg and font-medium classes to tagline", () => {
      const { container } = render(
        <ProductHero tagline="Tagline text" title="Product" />
      );
      const p = container.querySelector("p");
      expect(p).toHaveClass("text-lg");
      expect(p).toHaveClass("font-medium");
    });

    it("applies text-primary class to tagline", () => {
      const { container } = render(
        <ProductHero tagline="Tagline" title="Product" />
      );
      const p = container.querySelector("p");
      expect(p).toHaveClass("text-primary");
    });
  });

  describe("CTA buttons", () => {
    it("does not render CTA container when neither ctaPrimary nor ctaSecondary provided", () => {
      const { container } = render(<ProductHero tagline="Tagline" title="Product" />);
      const ctaContainer = container.querySelector("div.flex");
      expect(ctaContainer).not.toBeInTheDocument();
    });

    it("renders primary CTA button when ctaPrimary is provided", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Get Started", url: "https://example.com/start" }}
        />
      );
      expect(screen.getByText("Get Started")).toBeInTheDocument();
    });

    it("renders primary CTA as link with correct href", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Try Now", url: "https://example.com/try" }}
        />
      );
      const link = screen.getByRole("link", { name: /Try Now/i });
      expect(link).toHaveAttribute("href", "https://example.com/try");
    });

    it("renders primary CTA link with target blank", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Start", url: "https://example.com" }}
        />
      );
      const link = screen.getByRole("link", { name: /Start/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders primary CTA link with rel noopener noreferrer", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Start", url: "https://example.com" }}
        />
      );
      const link = screen.getByRole("link", { name: /Start/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders secondary CTA when ctaSecondary is provided", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Learn More", url: "https://example.com/docs" }}
        />
      );
      expect(screen.getByText("Learn More")).toBeInTheDocument();
    });

    it("renders secondary CTA as link with correct href", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Docs", url: "https://example.com/docs" }}
        />
      );
      const link = screen.getByRole("link", { name: /Docs/i });
      expect(link).toHaveAttribute("href", "https://example.com/docs");
    });

    it("renders secondary CTA link with target blank", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Docs", url: "https://example.com/docs" }}
        />
      );
      const link = screen.getByRole("link", { name: /Docs/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders secondary CTA link with rel noopener noreferrer", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Docs", url: "https://example.com/docs" }}
        />
      );
      const link = screen.getByRole("link", { name: /Docs/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders both CTA buttons when both provided", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Primary", url: "https://example.com/primary" }}
          ctaSecondary={{ label: "Secondary", url: "https://example.com/secondary" }}
        />
      );
      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });

    it("renders two links when both CTA provided", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Primary", url: "https://example.com/p" }}
          ctaSecondary={{ label: "Secondary", url: "https://example.com/s" }}
        />
      );
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });

    it("renders CTA container when only primary provided", () => {
      const { container } = render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Start", url: "https://example.com" }}
        />
      );
      const flexContainer = container.querySelector("div.flex");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders CTA container when only secondary provided", () => {
      const { container } = render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Learn", url: "https://example.com" }}
        />
      );
      const flexContainer = container.querySelector("div.flex");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders ExternalLink icon inside primary CTA link", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Start", url: "https://example.com" }}
        />
      );
      const link = screen.getByRole("link", { name: /Start/i });
      const icon = link.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders ExternalLink icon inside secondary CTA link", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Docs", url: "https://example.com/docs" }}
        />
      );
      const link = screen.getByRole("link", { name: /Docs/i });
      const icon = link.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("applies primary button styling to ctaPrimary link", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaPrimary={{ label: "Start", url: "https://example.com" }}
        />
      );
      const link = screen.getByRole("link", { name: /Start/i });
      expect(link).toHaveClass("bg-primary");
      expect(link).toHaveClass("rounded-lg");
    });

    it("applies secondary button styling to ctaSecondary link", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          ctaSecondary={{ label: "Docs", url: "https://example.com" }}
        />
      );
      const link = screen.getByRole("link", { name: /Docs/i });
      expect(link).toHaveClass("border");
      expect(link).toHaveClass("rounded-lg");
    });
  });

  describe("hero image", () => {
    it("does not render image when heroImage is not provided", () => {
      const { container } = render(<ProductHero tagline="Tagline" title="Product" />);
      const img = container.querySelector("img");
      expect(img).not.toBeInTheDocument();
    });

    it("renders image when heroImage is provided", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="My Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
    });

    it("sets image src to heroImage", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="My Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/images/hero.jpg");
    });

    it("sets image alt to the title", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="My Amazing Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "My Amazing Product");
    });

    it("sets fill on the image", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("data-fill", "true");
    });

    it("sets priority on the image", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("data-priority", "true");
    });

    it("sets sizes on the image", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("sizes");
    });

    it("wraps image in a container div with aspect-video", () => {
      const { container } = render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          heroImage="/images/hero.jpg"
        />
      );
      const imageContainer = container.querySelector("div.aspect-video");
      expect(imageContainer).toBeInTheDocument();
    });

    it("applies rounded-lg to image container", () => {
      const { container } = render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          heroImage="/images/hero.jpg"
        />
      );
      const imageContainer = container.querySelector("div.aspect-video");
      expect(imageContainer).toHaveClass("rounded-lg");
      expect(imageContainer).toHaveClass("overflow-hidden");
    });

    it("applies object-cover class to image", () => {
      render(
        <ProductHero
          tagline="Tagline"
          title="Product"
          heroImage="/images/hero.jpg"
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveClass("object-cover");
    });
  });

  describe("section structure", () => {
    it("renders within a section element", () => {
      const { container } = render(<ProductHero tagline="Tagline" title="Product" />);
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("applies mt-6 class to section", () => {
      const { container } = render(<ProductHero tagline="Tagline" title="Product" />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("mt-6");
    });
  });

  describe("combined props", () => {
    it("renders tagline, CTAs, and image together", () => {
      render(
        <ProductHero
          tagline="The ultimate solution"
          title="Super Product"
          heroImage="/images/super-hero.jpg"
          ctaPrimary={{ label: "Buy Now", url: "https://shop.example.com" }}
          ctaSecondary={{ label: "Learn More", url: "https://example.com" }}
        />
      );
      expect(screen.getByText("The ultimate solution")).toBeInTheDocument();
      expect(screen.getByText("Buy Now")).toBeInTheDocument();
      expect(screen.getByText("Learn More")).toBeInTheDocument();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("renders tagline without CTAs or image", () => {
      const { container } = render(
        <ProductHero tagline="Minimal hero" title="Product" />
      );
      const links = container.querySelectorAll("a");
      const imgs = container.querySelectorAll("img");
      expect(screen.getByText("Minimal hero")).toBeInTheDocument();
      expect(links.length).toBe(0);
      expect(imgs.length).toBe(0);
    });
  });
});
