import sharp from "sharp";
import path from "path";

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#09090b"/>
  <text x="600" y="280" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="bold" fill="#fafafa">zzoo.dev</text>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#a1a1aa">Solopreneur Developer</text>
</svg>`;

const outPath = path.join(process.cwd(), "public", "og-default.png");

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`OG image written to ${outPath}`);
