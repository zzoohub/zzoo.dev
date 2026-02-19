import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");
const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "projects");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".gif"]);
const SAFE_SLUG = /^[a-zA-Z0-9_-]+$/;

function copyImages() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log("[copy-images] No content/projects directory found, skipping.");
    return;
  }

  let copied = 0;

  for (const slug of fs.readdirSync(CONTENT_DIR)) {
    if (!SAFE_SLUG.test(slug)) continue;

    const imagesDir = path.join(CONTENT_DIR, slug, "images");
    if (!fs.existsSync(imagesDir) || !fs.lstatSync(imagesDir).isDirectory()) {
      continue;
    }

    const destDir = path.join(OUTPUT_DIR, slug);
    fs.mkdirSync(destDir, { recursive: true });

    for (const file of fs.readdirSync(imagesDir)) {
      if (!IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;

      const src = path.join(imagesDir, file);
      const dest = path.join(destDir, file);
      fs.copyFileSync(src, dest);
      console.log(`[copy-images] ${slug}/${file}`);
      copied++;
    }
  }

  if (copied === 0) {
    console.log("[copy-images] No images found, skipping.");
  } else {
    console.log(`[copy-images] Done. Copied ${copied} image(s).`);
  }
}

copyImages();
