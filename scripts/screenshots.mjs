#!/usr/bin/env node
/**
 * Captures screenshots of reducibl.com routes after Jekyll build.
 *
 * Prerequisites (one-time):
 *   npm init -y && npm i -D playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   bundle exec jekyll build     # build to _site/
 *   node scripts/screenshots.mjs
 */
import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

const CONFIG = {
  project: "reducibl",
  buildDir: path.join(PROJECT_ROOT, "_site"),
  screenshotDir: path.join(PROJECT_ROOT, "screenshots"),
  viewport: { width: 1280, height: 800 },
  routes: [
    { path: "/", name: "home" },
    { path: "/writing", name: "writing" },
    { path: "/buildlogs", name: "buildlogs" },
    { path: "/offers/ai-architecture-audit", name: "offer-audit" },
    { path: "/offers/mcp-server-sprint", name: "offer-mcp" },
  ],
};

// ── Minimal static file server ──────────────────────────────────────

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon",
  ".xml": "application/xml",
};

function resolveFile(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(root, decoded),
    path.join(root, decoded, "index.html"),
    path.join(root, decoded + ".html"),
    path.join(root, decoded + "/index.html"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function startServer(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const filePath = resolveFile(root, req.url || "/");
      if (!filePath) { res.writeHead(404); res.end("Not found"); return; }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(CONFIG.buildDir)) {
    console.error(`Build dir not found: ${CONFIG.buildDir}`);
    console.error("Run 'bundle exec jekyll build' first.");
    process.exit(1);
  }

  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);

  const { server, port } = await startServer(CONFIG.buildDir);
  console.log(`Serving ${CONFIG.buildDir} on port ${port}`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: CONFIG.viewport });

  for (const route of CONFIG.routes) {
    const url = `http://localhost:${port}${route.path}`;
    console.log(`  ${CONFIG.project}:${route.name} → ${url}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(500);
      const filename = `${CONFIG.project}-${route.name}-${date}.png`;
      await page.screenshot({
        path: path.join(CONFIG.screenshotDir, filename),
        fullPage: true,
      });
      console.log(`    saved ${filename}`);
    } catch (err) {
      console.warn(`    SKIP ${route.name}: ${err.message}`);
    }
  }

  await browser.close();
  server.close();
  console.log(`\nDone. ${CONFIG.routes.length} screenshot(s) → ${CONFIG.screenshotDir}/`);
}

main().catch((err) => { console.error(err); process.exit(1); });
