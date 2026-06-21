import { chromium } from 'playwright';
import url from 'url';
import path from 'path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch({ headless: true });
  const widths = { 1280: 800, 1440: 900, 1920: 1080 };

  for (const [w, h] of Object.entries(widths)) {
    const page = await browser.newPage({ viewport: { width: Number(w), height: h } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Capture just the footer area
    const footer = await page.locator('footer');
    await footer.screenshot({ path: `/tmp/footer-${w}.png` });
    await page.close();
  }

  await browser.close();
  console.log('Screenshots saved to /tmp/footer-*.png');
}

main().catch(console.error);
