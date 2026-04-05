import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoEmbed } from "./video-embed";

describe("VideoEmbed", () => {
  describe("URL validation - returns null for non-YouTube embed URLs", () => {
    it("returns null for a non-YouTube URL", () => {
      const { container } = render(
        <VideoEmbed url="https://vimeo.com/123456" title="Vimeo Video" />
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null for a YouTube watch URL (not embed)", () => {
      const { container } = render(
        <VideoEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Watch Video"
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null for a malformed URL that throws during parsing", () => {
      const { container } = render(
        <VideoEmbed url="://invalid-url" title="Bad URL" />
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null for an empty string URL", () => {
      const { container } = render(<VideoEmbed url="" title="Empty URL" />);
      expect(container.firstChild).toBeNull();
    });

    it("returns null for a plain string that is not a URL", () => {
      const { container } = render(
        <VideoEmbed url="not-a-url-at-all" title="Not URL" />
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null for a YouTube URL without /embed/ path", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/channel/abc" title="Channel" />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("valid YouTube embed URLs - renders iframe", () => {
    it("renders for www.youtube.com embed URL", () => {
      const { container } = render(
        <VideoEmbed
          url="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Test Video"
        />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toBeInTheDocument();
    });

    it("renders for youtube.com (without www) embed URL", () => {
      const { container } = render(
        <VideoEmbed
          url="https://youtube.com/embed/abc123"
          title="Test Video"
        />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toBeInTheDocument();
    });

    it("sets the iframe src to the provided url", () => {
      const { container } = render(
        <VideoEmbed
          url="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Test Video"
        />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("sets the iframe title to the provided title", () => {
      render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="My Demo Video" />
      );
      const iframe = screen.getByTitle("My Demo Video");
      expect(iframe).toBeInTheDocument();
    });

    it("sets allowFullScreen attribute on iframe", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("allowfullscreen");
    });

    it("sets loading to lazy on iframe", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("loading", "lazy");
    });

    it("sets the allow attribute with media permissions", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const iframe = container.querySelector("iframe");
      const allow = iframe?.getAttribute("allow");
      expect(allow).toContain("accelerometer");
      expect(allow).toContain("autoplay");
      expect(allow).toContain("clipboard-write");
      expect(allow).toContain("encrypted-media");
      expect(allow).toContain("gyroscope");
      expect(allow).toContain("picture-in-picture");
    });

    it("wraps iframe in a container div", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const wrapper = container.querySelector("div");
      expect(wrapper).toBeInTheDocument();
      const iframe = wrapper?.querySelector("iframe");
      expect(iframe).toBeInTheDocument();
    });

    it("applies aspect-video class to container", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("aspect-video");
    });

    it("applies rounded-lg class to container", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("rounded-lg");
    });

    it("applies overflow-hidden to container", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("overflow-hidden");
    });

    it("applies relative positioning to container", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("relative");
    });

    it("applies absolute inset-0 to iframe", () => {
      const { container } = render(
        <VideoEmbed url="https://www.youtube.com/embed/abc123" title="Video" />
      );
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveClass("absolute");
      expect(iframe).toHaveClass("inset-0");
    });
  });

  describe("with different valid URLs", () => {
    it("renders with a different YouTube embed URL", () => {
      const url = "https://www.youtube.com/embed/xyz789";
      const { container } = render(<VideoEmbed url={url} title="Another Video" />);
      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("src", url);
    });

    it("renders with a different title", () => {
      render(
        <VideoEmbed
          url="https://www.youtube.com/embed/abc123"
          title="Product Demo 2024"
        />
      );
      expect(screen.getByTitle("Product Demo 2024")).toBeInTheDocument();
    });
  });
});
