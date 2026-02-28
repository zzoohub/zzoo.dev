import type { Testimonial as TestimonialType } from "@/lib/types";

export function Testimonial({ testimonial }: { testimonial: TestimonialType }) {
  return (
    <blockquote className="mx-auto max-w-2xl text-center">
      <p className="text-lg italic text-foreground md:text-xl leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <footer className="mt-4 text-sm text-muted-foreground">
        <strong className="font-medium text-foreground">
          {testimonial.authorName}
        </strong>
        <br />
        {testimonial.authorRole}, {testimonial.authorCompany}
      </footer>
    </blockquote>
  );
}
