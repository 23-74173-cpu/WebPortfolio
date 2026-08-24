import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import BackgroundLayer from './components/BackgroundLayer'
import Cursor from './components/Cursor'
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

  return (
    <ThemeProvider>
      <ScrollProgress />
      <BackgroundLayer />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </ThemeProvider>
  )
}
