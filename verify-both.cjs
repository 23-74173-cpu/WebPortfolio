const { chromium } = require('playwright')

async function verify() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // === TEST 1: Contact section centering ===
  console.log('\n=== TEST 1: Contact centering ===')

  // Scroll to Contact
  await page.evaluate(() => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(500)

  const contactBox = await page.evaluate(() => {
    const section = document.querySelector('#contact')
    const content = section?.querySelector('.max-w-6xl')
    if (!section || !content) return null
    const sR = section.getBoundingClientRect()
    const cR = content.getBoundingClientRect()
    return {
      sectionTop: sR.top,
      sectionHeight: sR.height,
      contentTop: cR.top,
      contentHeight: cR.height,
      contentCenterY: cR.top + cR.height / 2,
      sectionCenterY: sR.top + sR.height / 2,
      offset: Math.abs((cR.top + cR.height / 2) - (sR.top + sR.height / 2)),
      classes: section.className,
    }
  })
  console.log('Contact section:', JSON.stringify(contactBox, null, 2))

  if (contactBox) {
    const isCentered = contactBox.offset < 50
    console.log(`Content centered within section: ${isCentered ? 'YES' : 'NO'} (offset: ${contactBox.offset.toFixed(1)}px)`)
    console.log(`Section has flex centering: ${contactBox.classes.includes('flex') ? 'YES' : 'NO'}`)
  }

  // Take screenshot of Contact
  await page.screenshot({ path: '/tmp/contact-centered.png', fullPage: false })

  // Scroll down to see if Contact stays visible while there's space
  const contactAfterScroll = await page.evaluate(() => {
    const section = document.querySelector('#contact')
    const content = section?.querySelector('.max-w-6xl')
    if (!section || !content) return null
    const sR = section.getBoundingClientRect()
    const cR = content.getBoundingClientRect()
    return {
      sectionTop: sR.top,
      sectionBottom: sR.bottom,
      contentTop: cR.top,
      contentVisible: cR.top < window.innerHeight && cR.bottom > 0,
      viewportHeight: window.innerHeight,
    }
  })
  console.log('Contact after scroll into view:', JSON.stringify(contactAfterScroll, null, 2))

  // === TEST 2: Projects stacked cards ===
  console.log('\n=== TEST 2: Projects stacked cards ===')

  // Scroll to Projects
  await page.evaluate(() => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(500)

  const projectsInfo = await page.evaluate(() => {
    const section = document.querySelector('#projects')
    const pinWrap = document.querySelector('#projects-pin-wrap')
    const cards = document.querySelectorAll('.project-card--featured')
    const numbers = document.querySelectorAll('.project-card-number')

    const cardData = Array.from(cards).map((c, i) => {
      const r = c.getBoundingClientRect()
      return {
        index: i,
        top: r.top,
        height: r.height,
        dataIndex: c.dataset.cardIndex,
      }
    })

    return {
      sectionExists: !!section,
      pinWrapExists: !!pinWrap,
      cardCount: cards.length,
      numberedIndicators: numbers.length,
      cards: cardData,
      sectionClasses: section?.className || '',
      pinWrapClasses: pinWrap?.className || '',
    }
  })
  console.log('Projects info:', JSON.stringify(projectsInfo, null, 2))

  // Scroll slowly through Projects to trigger the pin
  console.log('\nScrolling through Projects to test stacking...')
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 300))
    await page.waitForTimeout(200)
  }

  const afterScroll = await page.evaluate(() => {
    const cards = document.querySelectorAll('.project-card--featured')
    const cardData = Array.from(cards).map((c, i) => {
      const r = c.getBoundingClientRect()
      const transform = window.getComputedStyle(c).transform
      return {
        index: i,
        top: r.top,
        transform: transform,
      }
    })
    return { cards: cardData, scrollY: window.scrollY }
  })
  console.log('After scroll through Projects:', JSON.stringify(afterScroll, null, 2))

  // Take screenshot after scroll
  await page.screenshot({ path: '/tmp/projects-stacked.png', fullPage: false })

  // === TEST 3: Nav click to Contact stays centered ===
  console.log('\n=== TEST 3: Nav click to Contact ===')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)

  // Click the Contact nav link
  const navContact = await page.$('a[href="#contact"]')
  if (navContact) {
    await navContact.click()
    await page.waitForTimeout(1500) // wait for smooth scroll

    const afterNavClick = await page.evaluate(() => {
      const section = document.querySelector('#contact')
      const content = section?.querySelector('.max-w-6xl')
      if (!section || !content) return null
      const sR = section.getBoundingClientRect()
      const cR = content.getBoundingClientRect()
      return {
        sectionInView: sR.top < window.innerHeight && sR.bottom > 0,
        contentCenterY: cR.top + cR.height / 2,
        sectionCenterY: sR.top + sR.height / 2,
        offset: Math.abs((cR.top + cR.height / 2) - (sR.top + sR.height / 2)),
        scrollY: window.scrollY,
      }
    })
    console.log('After nav click to Contact:', JSON.stringify(afterNavClick, null, 2))
  }

  await browser.close()
  console.log('\nDone.')
}

verify().catch(e => { console.error(e); process.exit(1) })
