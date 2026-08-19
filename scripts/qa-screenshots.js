const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const outDir = path.resolve(__dirname, "..", "tests", "screenshots");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const viewports = [
    { name: "desktop", width: 1366, height: 768 },
    { name: "laptop", width: 1440, height: 900 },
    { name: "tablet-landscape", width: 1024, height: 768 },
    { name: "tablet-portrait", width: 768, height: 1024 },
    { name: "mobile-x", width: 375, height: 812 },
    { name: "mobile-android", width: 360, height: 800 },
  ];

  const url = process.argv[2] || "http://localhost:8080";
  console.log(`Capturing screenshots of ${url}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(url, { waitUntil: "networkidle2" });
    const file = path.join(outDir, `${vp.name}-${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Saved ${file}`);
  }

  await browser.close();
  console.log("All screenshots captured.");
})();
