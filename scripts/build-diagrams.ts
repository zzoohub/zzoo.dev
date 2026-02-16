import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const DIAGRAMS_DIR = path.join(process.cwd(), "content", "diagrams");
const OUTPUT_DIR = path.join(process.cwd(), "public", "diagrams");

function isD2Installed(): boolean {
  try {
    execFileSync("d2", ["--version"], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function buildDiagrams() {
  if (!fs.existsSync(DIAGRAMS_DIR)) {
    console.log("[build-diagrams] No content/diagrams directory found, skipping.");
    return;
  }

  const files = fs.readdirSync(DIAGRAMS_DIR).filter((f) => f.endsWith(".d2"));
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

  for (const file of files) {
    const name = file.replace(/\.d2$/, "");
    const inputPath = path.join(DIAGRAMS_DIR, file);

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
