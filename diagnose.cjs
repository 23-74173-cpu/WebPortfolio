const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/joed/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('=== Navigating to site ===');
  await page.goto('http://localhost:4180', { waitUntil: 'networkidle' });
  // Wait for boot loader to fade and React to hydrate
  await page.waitForTimeout(2000);

  console.log('\n=== CONSOLE ERRORS ON LOAD ===');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : 'None');

  // Screenshot hero
  await page.screenshot({ path: '/tmp/ss-01-hero.png', fullPage: false });
  console.log('\nScreenshot: /tmp/ss-01-hero.png (hero viewport)');

  // =============================================
  // ISSUE 1: PROJECTS CARDS INVISIBLE ON ENTRY
  // =============================================
  console.log('\n=== ISSUE 1: PROJECTS CARD VISIBILITY ===');

  // Test A: Normal scroll from top to Projects
  console.log('\n--- Test A: Normal scroll to Projects ---');
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1500);
  const projectsCardsA = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured');
    return Array.from(cards).map((c, i) => {
      const cs = getComputedStyle(c);
      return {
        index: i,
        opacity: cs.opacity,
        visibility: cs.visibility,
        display: cs.display,
        transform: cs.transform,
        inlineStyle: c.style.cssText,
        offsetParent: c.offsetParent?.tagName || 'null',
        rect: c.getBoundingClientRect(),
      };
    });
  });
  console.log('Cards after normal scroll to #projects:', JSON.stringify(projectsCardsA, null, 2));
  await page.screenshot({ path: '/tmp/ss-02-projects-normal.png', fullPage: false });
  console.log('Screenshot: /tmp/ss-02-projects-normal.png');

  // Test B: Reload while at Projects position
  console.log('\n--- Test B: Hard reload at Projects ---');
  // First scroll to projects
  await page.evaluate(() => window.scrollTo(0, document.getElementById('projects').offsetTop));
  await page.waitForTimeout(500);
  // Reload
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Now check if we're at projects (scrollRestoration is manual, so we should be at top)
  // Let's force scroll to projects
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1500);
  const projectsCardsB = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured');
    return Array.from(cards).map((c, i) => {
      const cs = getComputedStyle(c);
      return {
        index: i,
        opacity: cs.opacity,
        transform: cs.transform,
        inlineStyle: c.style.cssText,
      };
    });
  });
  console.log('Cards after reload+scroll to projects:', JSON.stringify(projectsCardsB, null, 2));
  await page.screenshot({ path: '/tmp/ss-03-projects-reload.png', fullPage: false });
  console.log('Screenshot: /tmp/ss-03-projects-reload.png');

  // Test C: Click Projects nav from Hero
  console.log('\n--- Test C: Click Projects nav from Hero ---');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(1500);
  const projectsCardsC = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured');
    return Array.from(cards).map((c, i) => {
      const cs = getComputedStyle(c);
      return {
        index: i,
        opacity: cs.opacity,
        transform: cs.transform,
        inlineStyle: c.style.cssText,
      };
    });
  });
  console.log('Cards after nav click to projects:', JSON.stringify(projectsCardsC, null, 2));
  await page.screenshot({ path: '/tmp/ss-04-projects-navclick.png', fullPage: false });
  console.log('Screenshot: /tmp/ss-04-projects-navclick.png');

  // =============================================
  // ISSUE 2: ABOUT/SKILLS SECTION JITTER
  // =============================================
  console.log('\n=== ISSUE 2: ABOUT/SKILLS SECTION ===');

  // Scroll to About and check for jank indicators
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(2000);

  // Check all animated elements for non-composited properties
  const aboutAnimatedElements = await page.evaluate(() => {
    const about = document.getElementById('about');
    if (!about) return { error: 'about section not found' };
    const results = [];
    const allChildren = about.querySelectorAll('*');
    for (const el of allChildren) {
      const cs = getComputedStyle(el);
      const inline = el.style.cssText;
      if (inline && (inline.includes('opacity') || inline.includes('transform') || inline.includes('visibility'))) {
        results.push({
          tag: el.tagName,
          class: el.className?.substring?.(0, 80),
          inlineStyle: inline.substring(0, 200),
          computedTransform: cs.transform,
          computedOpacity: cs.opacity,
          willChange: cs.willChange,
        });
      }
    }
    return results;
  });
  console.log('About section animated elements with inline styles:', JSON.stringify(aboutAnimatedElements, null, 2));

  // Check for GSAP pin-spacers around About or nearby sections
  const pinSpacers = await page.evaluate(() => {
    const spacers = document.querySelectorAll('.pin-spacer');
    return Array.from(spacers).map(s => ({
      id: s.id,
      class: s.className,
      inlineStyle: s.style.cssText.substring(0, 300),
      rect: s.getBoundingClientRect(),
      computedWidth: getComputedStyle(s).width,
      computedDisplay: getComputedStyle(s).display,
      computedPosition: getComputedStyle(s).position,
    }));
  });
  console.log('\nGSAP pin-spacers on page:', JSON.stringify(pinSpacers, null, 2));

  await page.screenshot({ path: '/tmp/ss-05-about.png', fullPage: false });
  console.log('Screenshot: /tmp/ss-05-about.png');

  // =============================================
  // ISSUE 3: CONTENT CENTERING
  // =============================================
  console.log('\n=== ISSUE 3: CONTENT CENTERING ===');

  const sections = ['about', 'projects', 'experience', 'certifications', 'contact'];
  for (const sectionId of sections) {
    const data = await page.evaluate((id) => {
      const section = document.getElementById(id);
      if (!section) return { error: `${id} not found` };

      const result = { id };

      // Walk up every ancestor to body
      let el = section;
      const ancestors = [];
      while (el && el !== document.body) {
        const cs = getComputedStyle(el);
        ancestors.push({
          tag: el.tagName,
          id: el.id,
          class: (el.className || '').substring(0, 100),
          display: cs.display,
          position: cs.position,
          width: cs.width,
          maxWidth: cs.maxWidth,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          flexDirection: cs.flexDirection,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          gridTemplateColumns: cs.gridTemplateColumns,
          inlineTransform: el.style.transform || 'none',
          inlineWidth: el.style.width || 'none',
          inlineMargin: el.style.margin || 'none',
        });
        el = el.parentElement;
      }
      result.ancestors = ancestors;

      // Check the max-w container specifically
      const maxWContainer = section.querySelector('[class*="max-w"]');
      if (maxWContainer) {
        const cs = getComputedStyle(maxWContainer);
        result.maxWContainer = {
          class: maxWContainer.className.substring(0, 150),
          width: cs.width,
          maxWidth: cs.maxWidth,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          boxSizing: cs.boxSizing,
          inlineTransform: maxWContainer.style.transform || 'none',
          inlineWidth: maxWContainer.style.width || 'none',
        };
      }

      return result;
    }, sectionId);
    console.log(`\n--- Section: ${sectionId} ---`);
    console.log(JSON.stringify(data, null, 2));
  }

  // Take full-page screenshot
  await page.screenshot({ path: '/tmp/ss-06-fullpage.png', fullPage: true });
  console.log('\nScreenshot: /tmp/ss-06-fullpage.png (full page)');

  // Take viewport screenshots at key sections
  for (const sectionId of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }, sectionId);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/ss-07-${sectionId}.png`, fullPage: false });
    console.log(`Screenshot: /tmp/ss-07-${sectionId}.png`);
  }

  // Check for ScrollTrigger.refresh() availability and state
  const stState = await page.evaluate(() => {
    if (typeof gsap !== 'undefined' && gsap.globalTimeline) {
      return { gsapAvailable: true };
    }
    // Check if GSAP is available via the animations module
    return { gsapAvailable: false, note: 'GSAP may be lazy-loaded' };
  });
  console.log('\nGSAP state:', JSON.stringify(stState));

  await browser.close();
  console.log('\n=== DIAGNOSIS COMPLETE ===');
})().catch(e => {
  console.error('Script error:', e);
  process.exit(1);
});
