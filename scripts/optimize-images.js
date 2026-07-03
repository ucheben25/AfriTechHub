const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const srcDir = path.resolve(__dirname, "..", "assets", "images");
const outDir = path.resolve(srcDir, "optimized");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Only process logos and top-level images by default
const files = [path.join(srcDir, "logos", "logo.jpg")].filter((f) =>
  fs.existsSync(f),
);

(async () => {
  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const img = sharp(file);
    // Generate multiple sizes and webp
    const sizes = [48, 96, 192, 384];
    for (const size of sizes) {
      const outPathJpg = path.join(outDir, `${base}-${size}.jpg`);
      const outPathWebp = path.join(outDir, `${base}-${size}.webp`);
      await img
        .resize(size, size, { fit: "cover" })
        .jpeg({ quality: 82 })
        .toFile(outPathJpg);
      await img
        .resize(size, size, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(outPathWebp);
      console.log(`Wrote ${outPathJpg}`);
      console.log(`Wrote ${outPathWebp}`);
    }
  }
  console.log("Image optimization complete.");
})();
