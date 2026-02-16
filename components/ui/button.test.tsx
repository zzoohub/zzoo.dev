import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders as a button element by default", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("renders button text", () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("applies default variant styles", () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
      expect(button).toHaveClass("text-primary-foreground");
    });

    it("applies destructive variant styles", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
      expect(button).toHaveClass("text-white");
    });

    it("applies outline variant styles", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("bg-background");
    });

    it("applies secondary variant styles", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary");
      expect(button).toHaveClass("text-secondary-foreground");
    });

    it("applies ghost variant styles", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("applies link variant styles", () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary");
      expect(button).toHaveClass("underline-offset-4");
    });

    it("defaults to default variant when not specified", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-variant", "default");
    });
  });

  describe("sizes", () => {
    it("applies default size styles", () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9");
      expect(button).toHaveClass("px-4");
    });

    it("applies xs size styles", () => {
      render(<Button size="xs">Extra Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-6");
      expect(button).toHaveClass("text-xs");
    });

    it("applies sm size styles", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8");
    });

    it("applies lg size styles", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-6");
    });

    it("applies icon size styles", () => {
      render(<Button size="icon">X</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-9");
    });

    it("applies icon-xs size styles", () => {
      render(<Button size="icon-xs">X</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-6");
    });

    it("applies icon-sm size styles", () => {
      render(<Button size="icon-sm">X</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-8");
    });

    it("applies icon-lg size styles", () => {
      render(<Button size="icon-lg">X</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-10");
    });

    it("defaults to default size when not specified", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-size", "default");
    });
  });

  describe("data attributes", () => {
    it("sets data-slot attribute", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("sets data-variant attribute", () => {
      render(<Button variant="destructive">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-variant", "destructive");
    });

    it("sets data-size attribute", () => {
      render(<Button size="lg">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-size", "lg");
    });
  });

  describe("custom className", () => {
    it("merges custom className with base classes", () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("inline-flex");
    });

    it("allows className to override variant classes", () => {
      render(<Button className="bg-blue-500">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-blue-500");
    });
  });

  describe("disabled state", () => {
    it("applies disabled styles when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:pointer-events-none");
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("is actually disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("is not disabled by default", () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });
  });

  describe("event handling", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("passes event to onClick handler", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "click",
        })
      );
    });
  });

  describe("base styles", () => {
    it("applies base layout classes", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("inline-flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("applies gap class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("gap-2");
    });

    it("applies whitespace class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("whitespace-nowrap");
    });

    it("applies rounded class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-md");
    });

    it("applies text size class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm");
    });

    it("applies font weight class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("font-medium");
    });

    it("applies transition class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-all");
    });
  });

  describe("accessibility", () => {
    it("applies outline-none class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("outline-none");
    });

    it("has focus-visible styles", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-visible:border-ring");
    });
  });

  describe("type attribute", () => {
    it("accepts type button", () => {
      render(<Button type="button">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("accepts type submit", () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("accepts type reset", () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("combination of props", () => {
    it("combines variant and size", () => {
      render(
        <Button variant="destructive" size="lg">
          Delete
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
      expect(button).toHaveClass("h-10");
    });

    it("combines variant, size, and className", () => {
      render(
        <Button variant="outline" size="sm" className="w-full">
          Full Width
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("h-8");
      expect(button).toHaveClass("w-full");
    });

    it("combines all props", () => {
      const handleClick = vi.fn();
      render(
        <Button
          variant="secondary"
          size="lg"
          className="custom"
          onClick={handleClick}
          disabled={false}
          type="submit"
        >
          Submit
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("custom");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).not.toBeDisabled();
    });
  });

  describe("aria attributes", () => {
    it("accepts aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();
    });

    it("accepts aria-describedby", () => {
      render(<Button aria-describedby="description">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("shrink behavior", () => {
    it("applies shrink-0 class", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shrink-0");
    });
  });
});
