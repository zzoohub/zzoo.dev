import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./section";

describe("Section", () => {
  it("renders children", () => {
    render(
      <Section>
        <div>Test content</div>
      </Section>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders without optional props", () => {
    const { container } = render(
      <Section>
        <p>Content only</p>
      </Section>
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(
      <Section label="Featured">
        <div>Content</div>
      </Section>
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const labels = container.querySelectorAll("p.text-sm");
    expect(labels.length).toBe(0);
  });

  it("renders title when provided", () => {
    render(
      <Section title="Section Title">
        <div>Content</div>
      </Section>
    );
    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });

  it("renders title as h2", () => {
    render(
      <Section title="Main Title">
        <div>Content</div>
      </Section>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Main Title");
  });

  it("does not render title when not provided", () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const headings = container.querySelectorAll("h2");
    expect(headings.length).toBe(0);
  });

  it("renders subtitle when provided", () => {
    render(
      <Section subtitle="This is a subtitle">
        <div>Content</div>
      </Section>
    );
    expect(screen.getByText("This is a subtitle")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const subtitles = container.querySelectorAll("p.text-lg");
    expect(subtitles.length).toBe(0);
  });

  it("renders all optional props together", () => {
    render(
      <Section label="Projects" title="My Work" subtitle="Recent projects">
        <div>Project list</div>
      </Section>
    );
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("My Work")).toBeInTheDocument();
    expect(screen.getByText("Recent projects")).toBeInTheDocument();
    expect(screen.getByText("Project list")).toBeInTheDocument();
  });

  it("applies correct CSS classes to section", () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("pt-8");
    expect(section).toHaveClass("pb-16");
  });

  it("applies correct CSS classes to label", () => {
    render(
      <Section label="Label">
        <div>Content</div>
      </Section>
    );
    const label = screen.getByText("Label");
    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-medium");
    expect(label).toHaveClass("uppercase");
    expect(label).toHaveClass("tracking-wider");
  });

  it("applies correct CSS classes to title", () => {
    render(
      <Section title="Title">
        <div>Content</div>
      </Section>
    );
    const title = screen.getByText("Title");
    expect(title).toHaveClass("text-2xl");
    expect(title).toHaveClass("font-bold");
  });

  it("applies correct CSS classes to subtitle", () => {
    render(
      <Section subtitle="Subtitle">
        <div>Content</div>
      </Section>
    );
    const subtitle = screen.getByText("Subtitle");
    expect(subtitle).toHaveClass("text-lg");
    expect(subtitle).toHaveClass("text-muted-foreground");
  });

  it("renders multiple children", () => {
    render(
      <Section>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </Section>
    );
    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
    expect(screen.getByText("Third child")).toBeInTheDocument();
  });

  it("renders nested components", () => {
    render(
      <Section title="Parent">
        <div>
          <h3>Nested heading</h3>
          <p>Nested paragraph</p>
        </div>
      </Section>
    );
    expect(screen.getByText("Nested heading")).toBeInTheDocument();
    expect(screen.getByText("Nested paragraph")).toBeInTheDocument();
  });

  it("renders as semantic section element", () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});
