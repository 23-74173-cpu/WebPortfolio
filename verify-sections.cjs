const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  // Check section stoppers exist
  const stopperCount = await page.locator('.section-stopper').count();
  console.log(`✓ Section stoppers: ${stopperCount}`);

  // Check scroll-snap on main
  const snapType = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? getComputedStyle(main).scrollSnapType : 'none';
  });
  console.log(`✓ Scroll snap type: ${snapType}`);

  // Scroll to projects section
  await page.evaluate(() => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);

  // Title should be visible before pin
  const titleBefore = await page.locator('#projects-pin-wrap .section-label').isVisible();
  console.log(`✓ Title visible before pin: ${titleBefore}`);

  // Scroll down to trigger pin
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(800);

  // Title should still be visible after pin
  const titleAfter = await page.locator('#projects-pin-wrap .section-label').isVisible();
  console.log(`✓ Title visible after pin: ${titleAfter}`);

  // Check title position — should be near top
  const titleBox = await page.locator('#projects-pin-wrap .section-heading').boundingBox();
  if (titleBox) {
    console.log(`✓ Title heading position: top=${Math.round(titleBox.y)}, height=${Math.round(titleBox.height)}`);
  }

  // Scroll further
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
  await page.waitForTimeout(800);

  const titleDeep = await page.locator('#projects-pin-wrap .section-label').isVisible();
  console.log(`✓ Title visible deep in scroll: ${titleDeep}`);

  await browser.close();
  console.log('\nDone.');
})();
