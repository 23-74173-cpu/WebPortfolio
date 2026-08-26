const { chromium } = require('playwright')

async function verify() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const results = []
  function log(msg) { console.log(msg); results.push(msg) }

  // ─────────────────────────────────────────────────
  // 1. PROJECTS STACKING — 1280×720 @ 100%
  // ─────────────────────────────────────────────────
  log('\n══ 1. PROJECTS STACKING — 1280×720 @ 100% ══')
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const pinWrapTop = await page.evaluate(() => {
    const el = document.querySelector('#projects-pin-wrap')
    return el ? el.getBoundingClientRect().top + window.scrollY : 0
  })
  log(`pin-wrap top: ${pinWrapTop}px`)

  const cardCount = await page.evaluate(() =>
    document.querySelectorAll('.project-card--featured').length
  )
  log(`Featured cards: ${cardCount}`)

  // --- At pin start ---
  await page.evaluate((y) => window.scrollTo(0, y - 50), pinWrapTop)
  await page.waitForTimeout(400)
  await page.screenshot({ path: '/tmp/v-01-projects-before-pin.png' })

  await page.evaluate((y) => window.scrollTo(0, y), pinWrapTop)
  await page.waitForTimeout(400)
  await page.screenshot({ path: '/tmp/v-02-projects-at-pin.png' })

  // --- Mid-stack (50%) ---
  const pinDist = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    return (cards.length - 1) * window.innerHeight
  })
  log(`Pin distance: ${pinDist}px`)

  await page.evaluate(({ y, d }) => window.scrollTo(0, y + d * 0.5), { y: pinWrapTop, d: pinDist })
  await page.waitForTimeout(400)

  const mid = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    return Array.from(cards).map((c, i) => ({
      index: i,
      top: Math.round(c.getBoundingClientRect().top),
      transform: getComputedStyle(c).transform,
      opacity: getComputedStyle(c).opacity,
    }))
  })
  log('Mid-stack: ' + JSON.stringify(mid))
  await page.screenshot({ path: '/tmp/v-03-projects-mid-stack.png' })

  // --- End-stack (100%) ---
  await page.evaluate(({ y, d }) => window.scrollTo(0, y + d), { y: pinWrapTop, d: pinDist })
  await page.waitForTimeout(400)

  const end = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    return Array.from(cards).map((c, i) => ({
      index: i,
      top: Math.round(c.getBoundingClientRect().top),
      transform: getComputedStyle(c).transform,
      opacity: getComputedStyle(c).opacity,
    }))
  })
  log('End-stack: ' + JSON.stringify(end))
  await page.screenshot({ path: '/tmp/v-04-projects-end-stack.png' })

  // --- Verify stacked positions ---
  const overlap = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    if (cards.length < 2) return null
    const r0 = cards[0].getBoundingClientRect()
    const r1 = cards[1].getBoundingClientRect()
    return { card0Top: Math.round(r0.top), card1Top: Math.round(r1.top), gap: Math.round(r1.top - r0.top) }
  })
  log('Card gap at end-stack: ' + JSON.stringify(overlap))

  // Check numbered indicators exist and are visible
  const indicators = await page.evaluate(() => {
    const els = document.querySelectorAll('.project-card-number')
    return Array.from(els).map((el, i) => ({
      index: i,
      text: el.textContent,
      opacity: getComputedStyle(el).opacity,
    }))
  })
  log('Numbered indicators: ' + JSON.stringify(indicators))

  // Verify card 0 has no transform (anchor)
  const card0Transform = mid[0]?.transform
  const card0IsAnchor = card0Transform === 'none' || card0Transform === 'matrix(1, 0, 0, 1, 0, 0)'
  log(`Card 0 is anchor (no transform): ${card0IsAnchor}`)

  // Verify cards 1+ have translateY
  const cardsMoved = mid.slice(1).every(c => c.transform.includes('-'))
  log(`Cards 1+ have negative translateY: ${cardsMoved}`)

  await page.close()

  // ─────────────────────────────────────────────────
  // 2. PROJECTS ZOOM-LEVEL VERIFICATION
  // ─────────────────────────────────────────────────
  log('\n══ 2. PROJECTS ZOOM-LEVEL VERIFICATION ══')
  for (const zoom of [1.0, 0.9, 0.8]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    })
    const pg = await ctx.newPage()
    await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await pg.waitForTimeout(1000)

    // Set page zoom
    await pg.evaluate((z) => {
      document.body.style.zoom = z
    }, zoom)
    await pg.waitForTimeout(500)

    const top = await pg.evaluate(() => {
      const el = document.querySelector('#projects-pin-wrap')
      return el ? el.getBoundingClientRect().top + window.scrollY : 0
    })

    const pd = await pg.evaluate(() => {
      const cards = document.querySelectorAll('.project-card--featured')
      return (cards.length - 1) * window.innerHeight
    })

    // Scroll to mid
    await pg.evaluate(({ y, d }) => window.scrollTo(0, y + d * 0.5), { y: top, d: pd })
    await pg.waitForTimeout(400)

    const cards = await pg.evaluate(() => {
      const cards = document.querySelectorAll('.project-card--featured')
      return Array.from(cards).map((c, i) => ({
        index: i,
        top: Math.round(c.getBoundingClientRect().top),
        transform: getComputedStyle(c).transform,
        fullyVisible: c.getBoundingClientRect().bottom <= window.innerHeight,
      }))
    })

    const allVisible = cards.every(c => c.fullyVisible)
    const card0Anchor = cards[0].transform === 'none' || cards[0].transform === 'matrix(1, 0, 0, 1, 0, 0)'
    const restMoved = cards.slice(1).every(c => c.transform.includes('-'))

    log(`Zoom ${(zoom * 100).toFixed(0)}%: cards=${cards.length} anchor=${card0Anchor} moved=${restMoved} allVisible=${allVisible}`)

    await pg.screenshot({ path: `/tmp/v-05-projects-zoom-${(zoom * 100).toFixed(0)}.png` })
    await ctx.close()
  }

  // ─────────────────────────────────────────────────
  // 3. CONTACT CENTERING — MULTIPLE VIEWPORTS
  // ─────────────────────────────────────────────────
  log('\n══ 3. CONTACT CENTERING — MULTIPLE VIEWPORTS ══')
  for (const { w, h, name } of [
    { w: 320, h: 568, name: 'iphone-se' },
    { w: 768, h: 1024, name: 'ipad' },
    { w: 1280, h: 720, name: 'desktop' },
    { w: 1920, h: 1080, name: 'large-desktop' },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    const pg = await ctx.newPage()
    await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await pg.waitForTimeout(1000)

    // Scroll to Contact
    await pg.evaluate(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' })
    })
    await pg.waitForTimeout(500)

    // Measure centering
    const centering = await pg.evaluate(() => {
      const section = document.querySelector('#contact')
      const content = section?.querySelector('.max-w-6xl') || section?.querySelector('[class*="max-w"]')
      if (!section || !content) return { error: 'elements not found' }
      const sR = section.getBoundingClientRect()
      const cR = content.getBoundingClientRect()
      const sectionCenter = sR.top + sR.height / 2
      const contentCenter = cR.top + cR.height / 2
      return {
        sectionHeight: Math.round(sR.height),
        sectionCenter: Math.round(sectionCenter),
        contentCenter: Math.round(contentCenter),
        offset: Math.abs(Math.round(contentCenter - sectionCenter)),
        viewportHeight: window.innerHeight,
      }
    })
    log(`${name} (${w}×${h}): center offset = ${centering.offset}px`)

    // Check after scroll
    await pg.evaluate(() => window.scrollBy(0, 150))
    await pg.waitForTimeout(300)
    const centeringAfter = await pg.evaluate(() => {
      const section = document.querySelector('#contact')
      const content = section?.querySelector('.max-w-6xl') || section?.querySelector('[class*="max-w"]')
      if (!section || !content) return null
      const sR = section.getBoundingClientRect()
      const cR = content.getBoundingClientRect()
      return Math.abs(Math.round((cR.top + cR.height / 2) - (sR.top + sR.height / 2)))
    })
    log(`${name} (${w}×${h}): center offset after scroll = ${centeringAfter}px`)

    await pg.screenshot({ path: `/tmp/v-06-contact-${name}.png` })
    await ctx.close()
  }

  await browser.close()
  log('\n══ ALL CHECKS COMPLETE ══')
}

verify().catch(e => { console.error(e); process.exit(1) })
