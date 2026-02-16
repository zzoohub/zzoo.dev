import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TagFilter } from "./tag-filter";

describe("TagFilter", () => {
  const mockTags = ["TypeScript", "React", "Next.js"];
  let mockOnTagChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnTagChange = vi.fn();
  });

  it("renders all tags", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders the all label", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="Show All"
      />
    );

    expect(screen.getByText("Show All")).toBeInTheDocument();
  });

  it("renders with custom all label", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="전체"
      />
    );

    expect(screen.getByText("전체")).toBeInTheDocument();
  });

  it("renders empty state with no tags", () => {
    render(
      <TagFilter
        tags={[]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(1);
  });

  it("marks all button as selected when activeTag is null", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const allButton = screen.getByText("All");
    expect(allButton).toHaveAttribute("aria-selected", "true");
  });

  it("marks specific tag as selected when activeTag is set", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="React"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const reactButton = screen.getByText("React");
    expect(reactButton).toHaveAttribute("aria-selected", "true");
  });

  it("marks all button as not selected when a tag is active", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="TypeScript"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const allButton = screen.getByText("All");
    expect(allButton).toHaveAttribute("aria-selected", "false");
  });

  it("calls onTagChange with null when all button is clicked", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="TypeScript"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const allButton = screen.getByText("All");
    fireEvent.click(allButton);

    expect(mockOnTagChange).toHaveBeenCalledWith(null);
    expect(mockOnTagChange).toHaveBeenCalledTimes(1);
  });

  it("calls onTagChange with tag name when tag button is clicked", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const reactButton = screen.getByText("React");
    fireEvent.click(reactButton);

    expect(mockOnTagChange).toHaveBeenCalledWith("React");
    expect(mockOnTagChange).toHaveBeenCalledTimes(1);
  });

  it("calls onTagChange with different tag when another tag is clicked", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="React"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const nextButton = screen.getByText("Next.js");
    fireEvent.click(nextButton);

    expect(mockOnTagChange).toHaveBeenCalledWith("Next.js");
  });

  it("renders all buttons as tabs with correct role", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4); // 1 all + 3 tags
  });

  it("renders tablist container", () => {
    const { container } = render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toBeInTheDocument();
  });

  it("has correct aria-label on tablist", () => {
    const { container } = render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveAttribute("aria-label", "Filter by tag");
  });

  it("applies active styling to selected tag", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="TypeScript"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const activeButton = screen.getByText("TypeScript");
    expect(activeButton).toHaveClass("bg-primary");
    expect(activeButton).toHaveClass("text-primary-foreground");
  });

  it("applies inactive styling to unselected tags", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="TypeScript"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const inactiveButton = screen.getByText("React");
    expect(inactiveButton).toHaveClass("border");
    expect(inactiveButton).toHaveClass("border-border");
  });

  it("handles clicking the same active tag", () => {
    render(
      <TagFilter
        tags={mockTags}
        activeTag="React"
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const reactButton = screen.getByText("React");
    fireEvent.click(reactButton);

    expect(mockOnTagChange).toHaveBeenCalledWith("React");
  });

  it("renders single tag correctly", () => {
    render(
      <TagFilter
        tags={["Solo"]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getByText("Solo")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("handles many tags", () => {
    const manyTags = Array.from({ length: 20 }, (_, i) => `Tag${i + 1}`);
    render(
      <TagFilter
        tags={manyTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getAllByRole("tab")).toHaveLength(21); // 1 all + 20 tags
  });

  it("preserves tag order", () => {
    const orderedTags = ["Zebra", "Apple", "Mango"];
    render(
      <TagFilter
        tags={orderedTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[1]).toHaveTextContent("Zebra");
    expect(tabs[2]).toHaveTextContent("Apple");
    expect(tabs[3]).toHaveTextContent("Mango");
  });

  it("handles tags with special characters", () => {
    render(
      <TagFilter
        tags={["C++", "C#", "F#"]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getByText("C++")).toBeInTheDocument();
    expect(screen.getByText("C#")).toBeInTheDocument();
    expect(screen.getByText("F#")).toBeInTheDocument();
  });

  it("handles tags with spaces", () => {
    render(
      <TagFilter
        tags={["Machine Learning", "Web Development"]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("handles very long tag names", () => {
    const longTag = "This is a very long tag name that might wrap";
    render(
      <TagFilter
        tags={[longTag]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    expect(screen.getByText(longTag)).toBeInTheDocument();
  });

  it("applies correct CSS classes for layout", () => {
    const { container } = render(
      <TagFilter
        tags={mockTags}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const wrapper = container.querySelector('[role="tablist"]');
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("flex-wrap");
    expect(wrapper).toHaveClass("gap-2");
  });

  it("applies transition classes to buttons", () => {
    render(
      <TagFilter
        tags={["Test"]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const button = screen.getByText("Test");
    expect(button).toHaveClass("transition-colors");
    expect(button).toHaveClass("duration-150");
  });

  it("renders buttons with correct size classes", () => {
    render(
      <TagFilter
        tags={["Test"]}
        activeTag={null}
        onTagChange={mockOnTagChange}
        allLabel="All"
      />
    );

    const button = screen.getByText("Test");
    expect(button).toHaveClass("rounded-full");
    expect(button).toHaveClass("px-3");
    expect(button).toHaveClass("py-1");
    expect(button).toHaveClass("text-sm");
  });
});
