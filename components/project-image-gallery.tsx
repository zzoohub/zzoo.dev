"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-4/3 w-[min(100%,24rem)] shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image
              src={src}
              alt={`${alt} — ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 24rem"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => scroll("left")}
            className={cn(
              "absolute top-1/2 left-2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-1.5 shadow-sm backdrop-blur-sm transition-opacity",
              canScrollLeft
                ? "opacity-100 hover:bg-muted"
                : "pointer-events-none opacity-0"
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => scroll("right")}
            className={cn(
              "absolute top-1/2 right-2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-1.5 shadow-sm backdrop-blur-sm transition-opacity",
              canScrollRight
                ? "opacity-100 hover:bg-muted"
                : "pointer-events-none opacity-0"
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}
