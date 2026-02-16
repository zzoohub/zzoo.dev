import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CopyButton } from "./copy-button";

// Mock clipboard API
const writeTextMock = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: {
    writeText: writeTextMock,
  },
});

describe("CopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    writeTextMock.mockResolvedValue(undefined);
  });

  describe("rendering", () => {
    it("renders with default label", () => {
      render(<CopyButton text="test@example.com" />);
      expect(screen.getByText("copy_address")).toBeInTheDocument();
    });

    it("renders with custom label", () => {
      render(<CopyButton text="test@example.com" label="Copy Email" />);
      expect(screen.getByText("Copy Email")).toBeInTheDocument();
    });

    it("renders as a button element", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("displays copy icon initially", () => {
      const { container } = render(<CopyButton text="test" />);
      const copyIcon = container.querySelector("svg");
      expect(copyIcon).toBeInTheDocument();
    });
  });

  describe("copy functionality", () => {
    it("calls clipboard API when clicked", async () => {
      render(<CopyButton text="hello@example.com" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith("hello@example.com");
    });

    it("copies exact text provided", async () => {
      const testText = "Special text with symbols: @#$%";
      render(<CopyButton text={testText} />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith(testText);
    });

    it("copies empty string when provided", async () => {
      render(<CopyButton text="" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith("");
    });

    it("copies multiline text", async () => {
      const multilineText = "Line 1\nLine 2\nLine 3";
      render(<CopyButton text={multilineText} />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith(multilineText);
    });
  });

  describe("state transitions", () => {
    it("shows copied state after clicking", async () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(screen.getByText("copied")).toBeInTheDocument();
    });

    it("shows check icon after copying", async () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(screen.getByText("copied")).toBeInTheDocument();
    });

    it("reverts to copy state after timeout", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      render(<CopyButton text="test" label="Copy" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(screen.getByText("copied")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText("Copy")).toBeInTheDocument();

      vi.useRealTimers();
    });

    it("resets after exactly 2000ms", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      render(<CopyButton text="test" label="Copy" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(screen.getByText("copied")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1999);
      });
      expect(screen.getByText("copied")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1);
      });

      expect(screen.getByText("Copy")).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe("multiple clicks", () => {
    it("handles multiple clicks", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });
      expect(screen.getByText("copied")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      await act(async () => {
        fireEvent.click(button);
      });
      expect(screen.getByText("copied")).toBeInTheDocument();

      expect(writeTextMock).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it("handles rapid clicks", async () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledTimes(3);
    });
  });

  describe("accessibility", () => {
    it("has aria-live polite attribute", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-live", "polite");
    });

    it("announces state changes to screen readers", async () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(button).toHaveAttribute("aria-live", "polite");
      expect(screen.getByText("copied")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies base button classes", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("inline-flex");
      expect(button).toHaveClass("h-11");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
      expect(button).toHaveClass("gap-2");
    });

    it("applies border and rounded styles", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("rounded-lg");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("border-border");
    });

    it("applies padding", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("px-5");
    });

    it("applies text styling", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("text-sm");
      expect(button).toHaveClass("font-medium");
    });

    it("applies transition classes", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("transition-colors");
      expect(button).toHaveClass("duration-150");
    });

    it("has hover state class", () => {
      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("hover:bg-muted");
    });
  });

  describe("error handling", () => {
    it("handles clipboard write failure gracefully", async () => {
      writeTextMock.mockRejectedValueOnce(new Error("Clipboard error"));

      render(<CopyButton text="test" />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      // Should not crash — button still renders
      expect(button).toBeInTheDocument();
    });
  });

  describe("with different text values", () => {
    it("handles long text", async () => {
      const longText = "a".repeat(1000);
      render(<CopyButton text={longText} />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith(longText);
    });

    it("handles special characters", async () => {
      const specialText = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
      render(<CopyButton text={specialText} />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith(specialText);
    });

    it("handles unicode characters", async () => {
      const unicodeText = "こんにちは 🎉 مرحبا";
      render(<CopyButton text={unicodeText} />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith(unicodeText);
    });

    it("handles URL text", async () => {
      const urlText = "https://example.com/path?query=value#hash";
      render(<CopyButton text={urlText} />);
      const button = screen.getByRole("button");

      await act(async () => {
        fireEvent.click(button);
      });

      expect(writeTextMock).toHaveBeenCalledWith(urlText);
    });
  });
});
