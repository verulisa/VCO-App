import sharp from "sharp";
import { fileURLToPath } from "node:url";

// The festival's real logo (public/brand/logo.jpg).
const source = fileURLToPath(new URL("../public/brand/logo.jpg", import.meta.url));

const targets = [
  { file: "public/icons/pwa-192x192.png", size: 192 },
  { file: "public/icons/pwa-512x512.png", size: 512 },
  { file: "public/icons/maskable-512x512.png", size: 512 },
  { file: "public/icons/apple-touch-icon.png", size: 180 },
  { file: "public/icons/favicon-32x32.png", size: 32 },
  { file: "public/icons/favicon-16x16.png", size: 16 },
];

for (const t of targets) {
  await sharp(source).resize(t.size, t.size).png().toFile(t.file);
  console.log("wrote", t.file);
}
