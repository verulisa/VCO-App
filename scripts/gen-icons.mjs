import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync(new URL("./icon-source.svg", import.meta.url));

const targets = [
  { file: "public/icons/pwa-192x192.png", size: 192 },
  { file: "public/icons/pwa-512x512.png", size: 512 },
  { file: "public/icons/maskable-512x512.png", size: 512 },
  { file: "public/icons/apple-touch-icon.png", size: 180 },
  { file: "public/icons/favicon-32x32.png", size: 32 },
  { file: "public/icons/favicon-16x16.png", size: 16 },
];

for (const t of targets) {
  await sharp(svg, { density: 384 }).resize(t.size, t.size).png().toFile(t.file);
  console.log("wrote", t.file);
}
