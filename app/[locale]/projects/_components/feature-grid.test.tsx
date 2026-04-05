import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureGrid } from "./feature-grid";

const baseFeatures = [
  { title: "Fast", description: "Lightning fast performance" },
  { title: "Secure", description: "End-to-end encryption", icon: "shield" },
];

describe("FeatureGrid", () => {
  describe("rendering", () => {
    it("renders the heading", () => {
      render(<FeatureGrid features={baseFeatures} heading="Key Features" />);
      expect(screen.getByText("Key Features")).toBeInTheDocument();
    });

    it("renders heading as h2", () => {
      render(<FeatureGrid features={baseFeatures} heading="Our Features" />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Our Features");
    });

    it("renders all feature titles", () => {
      render(<FeatureGrid features={baseFeatures} heading="Features" />);
      expect(screen.getByText("Fast")).toBeInTheDocument();
      expect(screen.getByText("Secure")).toBeInTheDocument();
    });

    it("renders all feature descriptions", () => {
      render(<FeatureGrid features={baseFeatures} heading="Features" />);
      expect(screen.getByText("Lightning fast performance")).toBeInTheDocument();
      expect(screen.getByText("End-to-end encryption")).toBeInTheDocument();
    });

    it("renders feature titles as h3", () => {
      render(
        <FeatureGrid
          features={[{ title: "My Feature", description: "Desc" }]}
          heading="Features"
        />
      );
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("My Feature");
    });

    it("renders within a section element", () => {
      const { container } = render(
        <FeatureGrid features={baseFeatures} heading="Features" />
      );
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("renders a grid container", () => {
      const { container } = render(
        <FeatureGrid features={baseFeatures} heading="Features" />
      );
      const grid = container.querySelector("div.grid");
      expect(grid).toBeInTheDocument();
    });

    it("renders a card div for each feature", () => {
      const { container } = render(
        <FeatureGrid
          features={[
            { title: "Feature A", description: "Desc A" },
            { title: "Feature B", description: "Desc B" },
          ]}
          heading="Features"
        />
      );
      const cards = container.querySelectorAll("div.rounded-lg");
      expect(cards.length).toBe(2);
    });
  });

  describe("icon rendering", () => {
    it("renders an icon container when icon is provided and recognized", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Feature", description: "Desc", icon: "shield" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("does not render an icon container when icon is not provided", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "No Icon", description: "Desc" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).not.toBeInTheDocument();
    });

    it("does not render an icon when icon key is not in iconMap", () => {
      const { container } = render(
        <FeatureGrid
          features={[
            { title: "Unknown Icon", description: "Desc", icon: "nonexistent-icon" },
          ]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).not.toBeInTheDocument();
    });

    it("renders icon for known icon key: camera", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Camera", description: "Desc", icon: "camera" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: search-x", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Search", description: "Desc", icon: "search-x" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: user", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "User", description: "Desc", icon: "user" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: zap", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Speed", description: "Desc", icon: "zap" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: globe", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Global", description: "Desc", icon: "globe" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: code", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Code", description: "Desc", icon: "code" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: lock", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Lock", description: "Desc", icon: "lock" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });

    it("renders icon for known icon key: layers", () => {
      const { container } = render(
        <FeatureGrid
          features={[{ title: "Layers", description: "Desc", icon: "layers" }]}
          heading="Features"
        />
      );
      const iconWrapper = container.querySelector("div.mb-3");
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders nothing in grid when features array is empty", () => {
      const { container } = render(
        <FeatureGrid features={[]} heading="Features" />
      );
      const cards = container.querySelectorAll("div.rounded-lg");
      expect(cards.length).toBe(0);
    });

    it("renders a single feature correctly", () => {
      render(
        <FeatureGrid
          features={[{ title: "Only Feature", description: "Only Desc" }]}
          heading="Features"
        />
      );
      expect(screen.getByText("Only Feature")).toBeInTheDocument();
      expect(screen.getByText("Only Desc")).toBeInTheDocument();
    });

    it("renders many features", () => {
      const manyFeatures = Array.from({ length: 9 }, (_, i) => ({
        title: `Feature ${i + 1}`,
        description: `Description ${i + 1}`,
      }));
      render(<FeatureGrid features={manyFeatures} heading="Many Features" />);
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(`Feature ${i}`)).toBeInTheDocument();
      }
    });

    it("renders features with mixed icon and no-icon", () => {
      const { container } = render(
        <FeatureGrid
          features={[
            { title: "With Icon", description: "Has icon", icon: "zap" },
            { title: "No Icon", description: "No icon" },
          ]}
          heading="Features"
        />
      );
      const iconWrappers = container.querySelectorAll("div.mb-3");
      expect(iconWrappers.length).toBe(1);
    });
  });

  describe("styling", () => {
    it("applies font-bold to heading", () => {
      render(<FeatureGrid features={baseFeatures} heading="Features" />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("font-bold");
    });

    it("applies tracking-tight to heading", () => {
      render(<FeatureGrid features={baseFeatures} heading="Features" />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("tracking-tight");
    });

    it("applies text-sm to feature description", () => {
      render(
        <FeatureGrid
          features={[{ title: "Feature", description: "My description" }]}
          heading="Features"
        />
      );
      const desc = screen.getByText("My description");
      expect(desc).toHaveClass("text-sm");
    });

    it("applies font-semibold to feature title (h3)", () => {
      render(
        <FeatureGrid
          features={[{ title: "Feature Title", description: "Desc" }]}
          heading="Features"
        />
      );
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveClass("font-semibold");
    });
  });
});
