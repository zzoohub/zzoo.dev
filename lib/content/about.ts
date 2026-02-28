import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { AboutData } from "./types";
import { contentDir, resolveContentLocale } from "./utils";

export function getAboutContent(locale: string): AboutData | null {
  const dir = path.join(contentDir, "about");
  const effectiveLocale = resolveContentLocale(dir, locale);
  const filePath = path.join(dir, `${effectiveLocale}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    experience: (data.experience ?? []) as AboutData["experience"],
    content,
  };
}
