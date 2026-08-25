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

    // Section sweep divider: a one-shot signal-blue beam that sweeps across a
    // section boundary the first time the section is entered. Driven by the
    // onEnter of the existing reveal ScrollTriggers below (no standalone
    // triggers) and fires exactly once per section.
    const attachSweep = (section, triggerVars) => {
      if (!section) return triggerVars
      let beam = section.querySelector('.sweep-divider')
      if (!beam) {
        beam = document.createElement('span')
        beam.className = 'sweep-divider'
        beam.setAttribute('aria-hidden', 'true')
        section.appendChild(beam)
      }
      const play = () => {
        if (beam.dataset.played === 'true') return
        beam.dataset.played = 'true'
        gsap.timeline({ defaults: { overwrite: 'auto' } })
          .to(beam, { scaleX: 1, opacity: 0.8, duration: 0.5, ease: 'power2.out' })
          .to(beam, { opacity: 0, duration: 0.5, ease: 'power1.out', clearProps: 'transform,opacity' })
      }
      return { ...triggerVars, onEnter: () => play() }
    }

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

    // Section reveals. Each section gets a distinct, one-shot entrance so
    // arrivals feel considered rather than uniform. All inside the existing
    // reveal ScrollTriggers (no standalone instances), same easing family
    // (power2.out), durations within 0.4-0.7s.
    const revealSection = (id, { y = 20, duration = 0.7, stagger = 0.12 } = {}) => {
      const section = document.querySelector(id)
      if (!section) return
      const q = gsap.utils.selector(section)
      gsap.from(q('.section-label, .section-heading, [data-reveal]'), {
        opacity: 0,
        y,
        duration,
        ease: 'power2.out',
        stagger,
        scrollTrigger: attachSweep(section, { trigger: section, start: 'top 82%', once: true }),
      })
    }

    // About: fade + translateY like before, but with a top-edge glow fading in
    // just ahead of the content, reading as "arriving from above the fold".
    const about = document.querySelector('#about')
    if (about) {
      const qAbout = gsap.utils.selector(about)
      let topGlow = about.querySelector('.about-top-glow')
      if (!topGlow) {
        topGlow = document.createElement('span')
        topGlow.className = 'about-top-glow'
        topGlow.setAttribute('aria-hidden', 'true')
        about.appendChild(topGlow)
      }
      const tl = gsap.timeline({ scrollTrigger: attachSweep(about, { trigger: about, start: 'top 82%', once: true }) })
      tl.fromTo(topGlow, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(qAbout('.section-label, .section-heading, [data-reveal]'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
          },
          0.05
        )
    }

    // Contact: fade + translateY from above (negative), settling downward, to
    // close the page rather than repeat About's upward arrival.
    revealSection('#contact', { y: -20, duration: 0.6, stagger: 0.12 })

    // Skills: heading, then each group's pills cascade in — plus the section
    // container settling scaleY(0.98 -> 1) so the whole panel arrives as the
    // pills cascade.
    const skills = document.querySelector('#skills')
    if (skills) {
      const q = gsap.utils.selector(skills)
      const contents = q('.skill-card-content')
      const tl = gsap.timeline({ scrollTrigger: attachSweep(skills, { trigger: skills, start: 'top 78%', once: true }) })
      tl.from(skills, { scaleY: 0.98, transformOrigin: 'top center', duration: 0.7, ease: 'power2.out' }, 0)
      tl.from(q('.section-label, .section-heading'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      }, 0.1)
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

    const projects = document.querySelector('#projects')
    const timeline = document.querySelector('#experience')
    const certs = document.querySelector('#certifications')

    // Projects keeps the working one-shot reveal; no pinning is used here.
    if (projects) {
      gsap.from('.project-card-content', {
        opacity: 0,
        y: 36,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power2.out',
        scrollTrigger: attachSweep(projects, { trigger: projects, start: 'top 78%', once: true }),
      })
    }

    // Timeline is a native horizontal strip. Its heading, line, and dots reveal
    // once, while the strip itself remains user-scrollable on every viewport.
    if (timeline) {
      const tq = gsap.utils.selector(timeline)
      const wrap = timeline.querySelector('.timeline-horizontal')
      const line = timeline.querySelector('.timeline-line')
      const dots = gsap.utils.toArray('.timeline-dot', wrap)
      if (wrap && line && dots.length) {
        const tl = gsap.timeline({ scrollTrigger: attachSweep(timeline, { trigger: timeline, start: 'top 82%', once: true }) })
        tl.from(tq('.section-label, .section-heading'), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
        }, 0)
        tl.fromTo(line, { transformOrigin: 'left center', scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.6 }, 0.2)
        dots.forEach((dot, i) => {
          tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.35 + i * 0.08)
        })
      }
    }

    // Certifications: mirror Projects' card entrance but lighter — shorter
    // distance and stagger, reading as a smaller version of the same scheme.
    if (certs) {
      const q = gsap.utils.selector(certs)
      const tl = gsap.timeline({ scrollTrigger: attachSweep(certs, { trigger: certs, start: 'top 80%', once: true }) })
      tl.from(q('.section-label, .section-heading'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      }).from(q('.cert-card-content'), {
        opacity: 0,
        y: 16,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
      }, '-=0.3')
    }
  }, document.body)

  return () => {
    ctx.revert()
  }
}
