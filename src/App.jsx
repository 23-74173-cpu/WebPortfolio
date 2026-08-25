import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import BackgroundLayer from './components/BackgroundLayer'
import Cursor from './components/Cursor'
import TechMarquee from './components/TechMarquee'
import { PaletteProvider } from './components/PaletteManager'
import { ThemeProvider } from './components/ThemeTransition'

export default function App() {
  // GSAP + ScrollTrigger are code-split and initialized during idle (after the
  // first paint) so they stay off the critical main-thread path while still
  // running the hero counters on load. This is the single scroll system.
  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    const start = () => {
      import('./lib/animations')
        .then((m) => { if (!disposed) cleanup = m.initAnimations() })
        .catch(() => {})
    }
    if (typeof requestIdleCallback === 'function') requestIdleCallback(start, { timeout: 800 })
    else setTimeout(start, 200)
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  // Console easter egg: styled, in keeping with the site's restrained tone.
  useEffect(() => {
    console.log(
      '%cjoed%c·%cportfolio',
      'color:#5A9DEF;font-weight:700;font-size:14px',
      'color:#8A94A6;font-size:14px',
      'color:#F4F7FA;font-weight:700;font-size:14px'
    )
    console.log(
      '%cReact 19 · Vite · Tailwind · GSAP — press %c⌘K%c to jump around.',
      'color:#8A94A6;font-size:12px',
      'color:#5A9DEF;font-weight:700;',
      'color:#8A94A6;font-size:12px;'
    )
  }, [])

  // Page is interactive: let the boot loader (if shown) fade out.
  useEffect(() => {
    window.__appReady?.()
  }, [])

  return (
    <ThemeProvider>
      <PaletteProvider>
        <ScrollProgress />
        <BackgroundLayer />
        <Cursor />
        <Navbar />
        <main>
          <Hero />
          <About />
          <TechMarquee />
          <Projects />
          <Timeline />
          <Certifications />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </PaletteProvider>
    </ThemeProvider>
  )
}
