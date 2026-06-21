import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const server = await createServer({
    root: __dirname,
    server: { port: 5173 },
  });
  await server.listen();

  const browser = await chromium.launch({ headless: true });

  for (const width of [1280, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `/tmp/footer-${width}.png`, fullPage: false });
    // Scroll to footer for a crop
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/footer-scrolled-${width}.png`, fullPage: false });
    await context.close();
  }

  await browser.close();
  await server.close();
}

main();
