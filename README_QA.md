QA Screenshot Runner

Prerequisites:

- Node.js (>=16) and npm installed.

How to run:

1. Install dev dependencies:

```bash
npm install
```

2. Serve the site locally from the project root:

```bash
npm start
# serves at http://localhost:8080
```

3. In a separate terminal, run the QA screenshot script:

```bash
npm run qa:screenshots
```

The screenshots will be saved to `tests/screenshots/`.

Notes:

- If you prefer, pass a URL to the script: `node scripts/qa-screenshots.js https://your-site.com`.
- Puppeteer will download a Chromium binary on first install; this may take a little time.

Image optimization:

Run the script to generate resized `logo` variants (JPEG + WebP):

```bash
npm run images:optimize
```

Generated images will be placed in `assets/images/optimized/`.
