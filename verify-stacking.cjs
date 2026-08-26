const { chromium } = require('playwright')

async function verify() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Scroll to the exact pin start of Projects
  const pinWrapTop = await page.evaluate(() => {
    const el = document.querySelector('#projects-pin-wrap')
    return el ? el.getBoundingClientRect().top + window.scrollY : 0
  })
  console.log('Projects pin-wrap top:', pinWrapTop)

  // Scroll to just before the pin starts
  await page.evaluate((y) => window.scrollTo(0, y - 100), pinWrapTop)
  await page.waitForTimeout(500)
  await page.screenshot({ path: '/tmp/projects-before-pin.png' })
  console.log('Screenshot: before pin')

  // Scroll to pin start
  await page.evaluate((y) => window.scrollTo(0, y), pinWrapTop)
  await page.waitForTimeout(500)
  await page.screenshot({ path: '/tmp/projects-at-pin.png' })
  console.log('Screenshot: at pin start')

  // Scroll halfway through the pin (card 1 should be stacking over card 0)
  const pinDist = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    return (cards.length - 1) * window.innerHeight
  })
  console.log('Pin distance:', pinDist)

  await page.evaluate(({ y, d }) => window.scrollTo(0, y + d * 0.5), { y: pinWrapTop, d: pinDist })
  await page.waitForTimeout(500)

  const midStack = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    return Array.from(cards).map((c, i) => {
      const r = c.getBoundingClientRect()
      const t = window.getComputedStyle(c).transform
      return { index: i, top: Math.round(r.top), transform: t }
    })
  })
  console.log('Mid-stack card positions:', JSON.stringify(midStack, null, 2))
  await page.screenshot({ path: '/tmp/projects-mid-stack.png' })
  console.log('Screenshot: mid-stack')

  // Scroll to end of pin (card 2 should be stacked over card 1)
  await page.evaluate(({ y, d }) => window.scrollTo(0, y + d), { y: pinWrapTop, d: pinDist })
  await page.waitForTimeout(500)

  const endStack = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    return Array.from(cards).map((c, i) => {
      const r = c.getBoundingClientRect()
      const t = window.getComputedStyle(c).transform
      return { index: i, top: Math.round(r.top), transform: t }
    })
  })
  console.log('End-stack card positions:', JSON.stringify(endStack, null, 2))
  await page.screenshot({ path: '/tmp/projects-end-stack.png' })
  console.log('Screenshot: end-stack')

  // Contact: scroll to Contact and verify centering stays
  await page.evaluate(() => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(500)
  await page.screenshot({ path: '/tmp/contact-final.png' })

  // Scroll down a bit to check Contact stays centered
  await page.evaluate(() => window.scrollBy(0, 200))
  await page.waitForTimeout(300)
  const contactOffset2 = await page.evaluate(() => {
    const section = document.querySelector('#contact')
    const content = section?.querySelector('.max-w-6xl')
    if (!section || !content) return null
    const sR = section.getBoundingClientRect()
    const cR = content.getBoundingClientRect()
    return Math.abs((cR.top + cR.height / 2) - (sR.top + sR.height / 2))
  })
  console.log('Contact centering offset after scroll:', contactOffset2)
  await page.screenshot({ path: '/tmp/contact-scrolled.png' })

  await browser.close()
  console.log('\nDone.')
}

verify().catch(e => { console.error(e); process.exit(1) })
