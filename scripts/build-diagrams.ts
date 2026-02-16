import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_DIR = path.join(process.cwd(), "public", "diagrams");

function isD2Installed(): boolean {
  try {
    execFileSync("d2", ["--version"], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function findD2Files(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      results.push(...findD2Files(fullPath));
    } else if (entry.endsWith(".d2")) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildDiagrams() {
  const files = findD2Files(CONTENT_DIR);
  if (files.length === 0) {
    console.log("[build-diagrams] No .d2 files found, skipping.");
    return;
  }

  if (!isD2Installed()) {
    console.warn("[build-diagrams] d2 CLI not found. Skipping diagram compilation.");
    console.warn("[build-diagrams] Install d2: https://d2lang.com/tour/install");
    console.warn("[build-diagrams] Pre-compiled SVGs in public/diagrams/ will be used instead.");
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const inputPath of files) {
    const name = path.basename(inputPath, ".d2");

    const themes: [string, string][] = [["light", "0"], ["dark", "200"]];
    for (const [theme, themeId] of themes) {
      const outputPath = path.join(OUTPUT_DIR, `${name}-${theme}.svg`);
      try {
        execFileSync("d2", [`--theme=${themeId}`, inputPath, outputPath], {
          stdio: "pipe",
        });
        console.log(`[build-diagrams] Built ${name}-${theme}.svg`);
      } catch (err) {
        console.warn(
          `[build-diagrams] Failed to build ${name}-${theme}.svg:`,
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  console.log("[build-diagrams] Done.");
}

buildDiagrams();
