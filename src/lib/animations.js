import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

// Single scroll-driven animation system. Dynamically imported (idle-loaded) so
// GSAP never touches the critical path. Replaces the old useInView reveals and
// the raw rAF scroll listeners (Hero/ScrollProgress/BackToTop/Navbar) with one
// ScrollTrigger-backed implementation.
//
// Functional scroll UI (progress bar, back-to-top, navbar bg, hero scroll
// hint) is always wired up - even under prefers-reduced-motion. Decorative
// reveals / counter / timeline scrub are skipped under reduced motion so all
// content simply remains in its natural visible state.
//
// Callers: only React unmount cleanup matters here (this is a single-page app).
export function initAnimations() {
  const ctx = gsap.context(() => {
    // ---- Functional scroll UI (always) ----
    const progressBar = document.querySelector('[data-scroll-progress]')
    if (progressBar) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set(progressBar, { scaleX: self.progress }),
      })
    }

    const backToTop = document.querySelector('[data-back-to-top]')
    if (backToTop) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const visible = self.scroll() > window.innerHeight * 0.8
          gsap.set(backToTop, {
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 10,
            pointerEvents: visible ? 'auto' : 'none',
          })
        },
      })
    }

    const nav = document.querySelector('[data-nav]')
    if (nav) {
      ScrollTrigger.create({
        start: 40,
        end: 'max',
        onUpdate: (self) => {
          const scrolled = self.scroll() > 40
          gsap.set(nav, {
            backgroundColor: scrolled ? 'var(--bg-navbar)' : 'transparent',
            borderBottom: scrolled ? '1px solid var(--bg-navbar-border)' : 'none',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
          })
        },
      })
    }

    const heroArrow = document.querySelector('[data-hero-arrow]')
    if (heroArrow) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const pastHero = self.scroll() > window.innerHeight * 0.85
          gsap.set(heroArrow, {
            opacity: pastHero ? 0 : 1,
            pointerEvents: pastHero ? 'none' : 'auto',
          })
        },
      })
    }

    // ---- Decorative animations (skipped entirely under reduced motion) ----
    if (prefersReducedMotion()) return

    // Hero stat counters: count up on load, staggered. The visible number is an
    // absolute overlay above an invisible anchor of the target value so text
    // width never changes mid-count (no layout shift / CLS).
    const counter = (el, delay) => {
      const target = Number(el.dataset.count)
      const state = { value: 0 }
      gsap.to(state, {
        value: target,
        duration: 1.4,
        delay,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => { if (el) el.textContent = String(state.value) },
      })
    }
    const systemsEl = document.querySelector('[data-hero-count="systems"]')
    const clientsEl = document.querySelector('[data-hero-count="clients"]')
    if (systemsEl) counter(systemsEl, 0)
    if (clientsEl) counter(clientsEl, 0.15)

    // Section reveals (label + heading + [data-reveal] content), one-time.
    const revealSection = (id) => {
      const section = document.querySelector(id)
      if (!section) return
      const q = gsap.utils.selector(section)
      gsap.from(q('.section-label, .section-heading, [data-reveal]'), {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      })
    }
    revealSection('#about')
    revealSection('#contact')

    // Skills: heading, then each group's pills cascade in.
    const skills = document.querySelector('#skills')
    if (skills) {
      const q = gsap.utils.selector(skills)
      const contents = q('.skill-card-content')
      const tl = gsap.timeline({ scrollTrigger: { trigger: skills, start: 'top 78%', once: true } })
      tl.from(q('.section-label, .section-heading'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      })
      contents.forEach((content, i) => {
        tl.from(content, { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out' }, 0.2 + i * 0.12)
        tl.from(content.querySelectorAll('.skill-pill'), {
          opacity: 0,
          y: 8,
          duration: 0.35,
          stagger: 0.03,
          ease: 'power2.out',
        }, 0.25 + i * 0.12)
      })
    }

    // Projects: stagger the featured card content in.
    const projects = document.querySelector('#projects')
    if (projects) {
      gsap.from('.project-card-content', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: projects, start: 'top 78%', once: true },
      })
    }

    // Timeline: one-time heading reveal + scrub-tied line/dot draw-in.
    const timeline = document.querySelector('#experience')
    if (timeline) {
      const tq = gsap.utils.selector(timeline)
      gsap.from(tq('.section-label, .section-heading'), {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: timeline, start: 'top 82%', once: true },
      })
      const wrap = timeline.querySelector('.timeline-scrub')
      const line = timeline.querySelector('.timeline-line')
      const dots = gsap.utils.toArray('.timeline-dot', wrap)
      if (wrap && line && dots.length) {
        const total = dots.length
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrap, start: 'top 72%', end: 'bottom 65%', scrub: 0.6 },
        })
        tl.fromTo(line, { transformOrigin: 'top', scaleY: 0 }, { scaleY: 1, ease: 'none', duration: total }, 0)
        dots.forEach((dot, i) => {
          tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out' }, i)
        })
      }
    }

    // Certifications: heading + 2-card stagger.
    const certs = document.querySelector('#certifications')
    if (certs) {
      const q = gsap.utils.selector(certs)
      const tl = gsap.timeline({ scrollTrigger: { trigger: certs, start: 'top 80%', once: true } })
      tl.from(q('.section-label, .section-heading'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      }).from(q('.cert-card-content'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.35')
    }
  }, document.body)

  return () => ctx.revert()
}