import fs from "fs";
import path from "path";
import type { Testimonial } from "./types";
import { contentDir } from "./utils";

export function getTestimonials(): Testimonial[] {
  const filePath = path.join(contentDir, "testimonials.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
