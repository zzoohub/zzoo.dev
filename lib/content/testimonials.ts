import fs from "fs";
import path from "path";
import { z } from "zod";
import type { Testimonial } from "./types";
import { testimonialSchema } from "./schemas";
import { contentDir } from "./utils";

export function getTestimonials(): Testimonial[] {
  const filePath = path.join(contentDir, "testimonials.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return z.array(testimonialSchema).parse(JSON.parse(raw));
}
