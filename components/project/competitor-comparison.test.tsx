import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompetitorComparison } from "./competitor-comparison";

const baseCompetitors = [
  { name: "Competitor A", differentiator: "We are faster and cheaper" },
  { name: "Competitor B", differentiator: "We have better UX design" },
];

describe("CompetitorComparison", () => {
  describe("rendering", () => {
    it("renders the heading", () => {
      render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="How We Compare"
          vsLabel="vs."
        />
      );
      expect(screen.getByText("How We Compare")).toBeInTheDocument();
    });

    it("renders heading as h2", () => {
      render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Comparison");
    });

    it("renders within a section element", () => {
      const { container } = render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      expect(container.querySelector("section")).toBeInTheDocument();
    });

    it("renders a card for each competitor", () => {
      const { container } = render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      const cards = container.querySelectorAll("div.rounded-lg");
      expect(cards.length).toBe(baseCompetitors.length);
    });

    it("renders each competitor name with vsLabel prefix", () => {
      render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      expect(screen.getByText("vs. Competitor A")).toBeInTheDocument();
      expect(screen.getByText("vs. Competitor B")).toBeInTheDocument();
    });

    it("renders each competitor differentiator", () => {
      render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      expect(screen.getByText("We are faster and cheaper")).toBeInTheDocument();
      expect(screen.getByText("We have better UX design")).toBeInTheDocument();
    });
  });

  describe("vsLabel", () => {
    it("uses custom vsLabel text", () => {
      render(
        <CompetitorComparison
          competitors={[{ name: "CompetitorX", differentiator: "Better" }]}
          heading="Compare"
          vsLabel="compared to"
        />
      );
      expect(screen.getByText("compared to CompetitorX")).toBeInTheDocument();
    });

    it("uses empty vsLabel when provided empty string", () => {
      render(
        <CompetitorComparison
          competitors={[{ name: "Solo", differentiator: "Different" }]}
          heading="Compare"
          vsLabel=""
        />
      );
      // The rendered text is "{vsLabel} {name}" = " Solo" (space + name)
      const nameEl = screen.getByText((content) => content.includes("Solo"));
      expect(nameEl).toBeInTheDocument();
    });

    it("uses Korean vsLabel", () => {
      render(
        <CompetitorComparison
          competitors={[{ name: "경쟁사", differentiator: "더 빠름" }]}
          heading="비교"
          vsLabel="대비"
        />
      );
      expect(screen.getByText("대비 경쟁사")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders no cards when competitors array is empty", () => {
      const { container } = render(
        <CompetitorComparison
          competitors={[]}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      const cards = container.querySelectorAll("div.rounded-lg");
      expect(cards.length).toBe(0);
    });

    it("renders a single competitor correctly", () => {
      render(
        <CompetitorComparison
          competitors={[{ name: "Only Competitor", differentiator: "Only differentiator" }]}
          heading="Compare"
          vsLabel="vs."
        />
      );
      expect(screen.getByText("vs. Only Competitor")).toBeInTheDocument();
      expect(screen.getByText("Only differentiator")).toBeInTheDocument();
    });

    it("renders many competitors", () => {
      const manyCompetitors = Array.from({ length: 5 }, (_, i) => ({
        name: `Comp ${i + 1}`,
        differentiator: `Differentiator ${i + 1}`,
      }));
      render(
        <CompetitorComparison
          competitors={manyCompetitors}
          heading="All Comparisons"
          vsLabel="vs."
        />
      );
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`vs. Comp ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Differentiator ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe("styling", () => {
    it("applies font-bold to heading", () => {
      render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("font-bold");
    });

    it("applies tracking-tight to heading", () => {
      render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Comparison"
          vsLabel="vs."
        />
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("tracking-tight");
    });

    it("applies text-sm to competitor name label", () => {
      render(
        <CompetitorComparison
          competitors={[{ name: "CompA", differentiator: "Diff" }]}
          heading="Compare"
          vsLabel="vs."
        />
      );
      const nameEl = screen.getByText("vs. CompA");
      expect(nameEl).toHaveClass("text-sm");
    });

    it("applies font-medium to competitor name label", () => {
      render(
        <CompetitorComparison
          competitors={[{ name: "CompA", differentiator: "Diff" }]}
          heading="Compare"
          vsLabel="vs."
        />
      );
      const nameEl = screen.getByText("vs. CompA");
      expect(nameEl).toHaveClass("font-medium");
    });

    it("applies rounded-lg to competitor cards", () => {
      const { container } = render(
        <CompetitorComparison
          competitors={[{ name: "CompA", differentiator: "Diff" }]}
          heading="Compare"
          vsLabel="vs."
        />
      );
      const card = container.querySelector("div.rounded-lg");
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("border");
    });

    it("applies space-y-4 to the list container", () => {
      const { container } = render(
        <CompetitorComparison
          competitors={baseCompetitors}
          heading="Compare"
          vsLabel="vs."
        />
      );
      const listContainer = container.querySelector("div.space-y-4");
      expect(listContainer).toBeInTheDocument();
    });
  });
});
