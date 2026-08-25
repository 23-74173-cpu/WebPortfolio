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
  const responsiveMedia = gsap.matchMedia()
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
    // Now includes the merged Skills grid — the card-pill cascade targets
    // .skill-card-content / .skill-pill selectors within #about.
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
      // Skill cards cascade within the merged About section
      const skillContents = qAbout('.skill-card-content')
      skillContents.forEach((content, i) => {
        tl.from(content, { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out' }, 0.3 + i * 0.12)
        tl.from(content.querySelectorAll('.skill-pill'), {
          opacity: 0,
          y: 8,
          duration: 0.35,
          stagger: 0.03,
          ease: 'power2.out',
        }, 0.35 + i * 0.12)
      })
    }

    // Contact: fade + translateY from above (negative), settling downward, to
    // close the page rather than repeat About's upward arrival.
    revealSection('#contact', { y: -20, duration: 0.6, stagger: 0.12 })

    const projects = document.querySelector('#projects')
    const projectsPinWrap = document.querySelector('#projects-pin-wrap')
    const timeline = document.querySelector('#experience')
    const certs = document.querySelector('#certifications')

    // Projects scroll-lock: pin just the featured cards wrapper and reveal
    // cards one at a time as the user scrolls. Pin range is proportional to
    // the number of featured cards so each card gets ~1 viewport height of
    // scroll distance.
    if (projectsPinWrap) {
      const featuredCards = gsap.utils.selector(projectsPinWrap)('.project-card--featured')
      if (featuredCards.length) {
        const getPinDistance = () => featuredCards.length * window.innerHeight
        const tl = gsap.timeline({
          scrollTrigger: attachSweep(projects, {
            trigger: projectsPinWrap,
            start: 'top top',
            end: () => `+=${getPinDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
          }),
        })
        featuredCards.forEach((card, i) => {
          const segmentStart = i / featuredCards.length
          const segmentEnd = (i + 1) / featuredCards.length
          tl.fromTo(card,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: segmentEnd - segmentStart, ease: 'power2.out' },
            segmentStart,
          )
        })
      }
    }

    // Timeline uses native horizontal scrolling on small viewports and a
    // pinned horizontal-scroll sequence on desktop. The pin range is derived
    // from the actual overflow distance, never a hardcoded viewport estimate.
    if (timeline) {
      const tq = gsap.utils.selector(timeline)
      const wrap = timeline.querySelector('.timeline-horizontal')
      const track = timeline.querySelector('.timeline-track')
      const inner = timeline.querySelector('.timeline-track-inner')
      const line = timeline.querySelector('.timeline-line')
      const dots = gsap.utils.toArray('.timeline-dot', wrap)
      const items = gsap.utils.toArray('.timeline-item', wrap)
      if (wrap && line && dots.length) {
        // Heading fires once on scroll-into-view — separate from the scrub
        // timeline so it doesn't hijack pin-range positions.
        gsap.from(tq('.section-label, .section-heading'), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: attachSweep(timeline, { trigger: timeline, start: 'top 82%', once: true }),
        })

        responsiveMedia.add('(min-width: 768px)', () => {
          if (!track || !inner) return
          const getDistance = () => Math.max(0, inner.scrollWidth - track.clientWidth)
          if (getDistance() === 0) return
          const tl = gsap.timeline({
            scrollTrigger: attachSweep(timeline, {
              trigger: timeline,
              start: 'top top',
              end: () => `+=${getDistance()}`,
              pin: timeline,
              pinSpacing: true,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const progress = self.progress
                const trackWidth = inner.scrollWidth - track.clientWidth
                const scrolled = progress * trackWidth
                const trackCenter = scrolled + track.clientWidth / 2
                let activeIdx = 0
                let minDist = Infinity
                items.forEach((item, i) => {
                  const itemCenter = item.offsetLeft + item.offsetWidth / 2
                  const dist = Math.abs(itemCenter - trackCenter)
                  if (dist < minDist) { minDist = dist; activeIdx = i }
                })
                dots.forEach((dot, i) => {
                  dot.classList.toggle('timeline-dot--active', i === activeIdx)
                })
              },
            }),
          })
          tl.fromTo(inner, { x: 0 }, { x: () => -getDistance(), ease: 'none', duration: 1 }, 0)
          tl.fromTo(line, { transformOrigin: 'left center', scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.6 }, 0)
        })

        responsiveMedia.add('(max-width: 767px)', () => {
          const tl = gsap.timeline({ scrollTrigger: attachSweep(timeline, { trigger: timeline, start: 'top 82%', once: true }) })
          tl.fromTo(line, { transformOrigin: 'left center', scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.6 }, 0)
          dots.forEach((dot, i) => {
            tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.35 + i * 0.08)
          })
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
    responsiveMedia.revert()
    ctx.revert()
  }
}
