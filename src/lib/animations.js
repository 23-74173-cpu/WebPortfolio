import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

// Module-level state for the Projects pin so it can be torn down and rebuilt
// when the expanded set changes (dynamic card count).
let _projectsST = null
let _projectsTL = null

// Called by Projects.jsx (via useLayoutEffect) after the expanded/collapsed
// DOM update commits.  Kills the old pin, rebuilds it for the current card
// count, then tells ScrollTrigger to recalculate every pin spacer on the page
// (fixes the overlap with Timeline that follows).
export function refreshProjectsPin() {
  _projectsST?.kill()
  _projectsTL?.kill()
  _projectsST = null
  _projectsTL = null
  _buildProjectsPin()
  ScrollTrigger.refresh()
}

// Teardown helper for React unmount (refreshProjectsPin creates animations
// outside the gsap.context, so ctx.revert() won't catch them).
export function cleanupProjectsPin() {
  _projectsST?.kill()
  _projectsTL?.kill()
  _projectsST = null
  _projectsTL = null
}

function _buildProjectsPin() {
  // Kill any existing pin first (guards against double-init when
  // initAnimations and a useLayoutEffect refresh overlap).
  _projectsST?.kill()
  _projectsTL?.kill()
  _projectsST = null
  _projectsTL = null

  const projectsPinWrap = document.querySelector('#projects-pin-wrap')
  if (!projectsPinWrap || window.innerWidth < 768) return
  // Under reduced motion the initial pin is never created (initAnimations
  // returns early).  Don't create one from refreshProjectsPin either —
  // expanded cards should remain a plain scrollable list.
  if (prefersReducedMotion()) return

  const allCards = gsap.utils.selector(projectsPinWrap)('.project-card')
  if (allCards.length <= 1) return

  const expanded = !!window.__projectsExpanded
  const featuredCount = gsap.utils.selector(projectsPinWrap)('.project-card--featured').length
  const stackingCount = expanded ? allCards.length : Math.min(featuredCount, allCards.length)

  const firstCardHeight = allCards[0].offsetHeight || 400
  const overlapPx = Math.round(firstCardHeight * 0.75)

  const stackingDist = Math.max(0, stackingCount - 1) * window.innerHeight * 0.8
  const restGrid = projectsPinWrap.querySelector('#projects-rest')
  const restHeight = expanded && restGrid ? restGrid.scrollHeight : 0

  const getPinDistance = () => stackingDist + restHeight

  const st = ScrollTrigger.create({
    trigger: projectsPinWrap,
    start: 'top top',
    end: () => `+=${getPinDistance()}`,
    pin: true,
    pinSpacing: true,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const section = document.querySelector('#projects')
      if (!section) return
      const stackFraction = stackingDist / (stackingDist + restHeight || 1)
      const shouldShow = expanded || self.progress >= stackFraction * 0.95
      section.classList.toggle('projects-expand-ready', shouldShow)
    },
  })

  _projectsTL = gsap.timeline({ scrollTrigger: st })

  for (let i = 1; i < stackingCount; i++) {
    const segDuration = 1 / (stackingCount - 1)
    const segStart = (i - 1) * segDuration
    _projectsTL.fromTo(allCards[i],
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: () => -overlapPx * i,
        duration: segDuration,
        ease: 'power2.out',
      },
      segStart,
    )
  }

  _projectsST = st
}

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
      gsap.fromTo(q('.section-label, .section-heading, [data-reveal]'),
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power2.out',
          stagger,
          clearProps: 'transform,opacity',
          scrollTrigger: attachSweep(section, { trigger: section, start: 'top 82%', once: true }),
        },
      )
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
      tl.fromTo(topGlow, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'opacity' }, 0)
        .fromTo(qAbout('.section-label, .section-heading, [data-reveal]'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
            clearProps: 'transform,opacity',
          },
          0.05
        )
      // Skill cards cascade within the merged About section
      const skillContents = qAbout('.skill-card-content')
      skillContents.forEach((content, i) => {
        tl.fromTo(content,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' },
          0.3 + i * 0.12
        )
        tl.fromTo(content.querySelectorAll('.skill-pill'),
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
          0.35 + i * 0.12
        )
      })
    }

    // Contact: fade + translateY from above (negative), settling downward, to
    // close the page rather than repeat About's upward arrival.
    revealSection('#contact', { y: -20, duration: 0.6, stagger: 0.12 })

    const projects = document.querySelector('#projects')
    const projectsPinWrap = document.querySelector('#projects-pin-wrap')
    const timeline = document.querySelector('#experience')
    const certs = document.querySelector('#certifications')

    // Projects stacked-card reveal: pin the wrapper and animate cards 1..N
    // upward to stack over card 0 as the user scrolls.  Built as a separate
    // function so it can be torn down and rebuilt by refreshProjectsPin() when
    // the expanded card set changes.
    if (projectsPinWrap && window.innerWidth >= 768) {
      _buildProjectsPin()
      // Sweep divider: one-shot beam on section enter (decorative, not tied to pin).
      if (projects) {
        const sweepCfg = attachSweep(projects, { trigger: projects, start: 'top 82%', once: true })
        ScrollTrigger.create(sweepCfg)
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
        gsap.fromTo(tq('.section-label, .section-heading'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.12,
            clearProps: 'transform,opacity',
            scrollTrigger: attachSweep(timeline, { trigger: timeline, start: 'top 82%', once: true }),
          },
        )

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
          tl.fromTo(line, { transformOrigin: 'left center', scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', ease: 'power2.out', duration: 0.6, clearProps: 'transform' }, 0)
          dots.forEach((dot, i) => {
            tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out', clearProps: 'transform,opacity' }, 0.35 + i * 0.08)
          })
        })
      }
    }

    // Certifications: mirror Projects' card entrance but lighter — shorter
    // distance and stagger, reading as a smaller version of the same scheme.
    if (certs) {
      const q = gsap.utils.selector(certs)
      const tl = gsap.timeline({ scrollTrigger: attachSweep(certs, { trigger: certs, start: 'top 80%', once: true }) })
      tl.fromTo(q('.section-label, .section-heading'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, clearProps: 'transform,opacity' }
      ).fromTo(q('.cert-card-content'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', clearProps: 'transform,opacity' },
        '-=0.3'
      )
    }
  }, document.body)

  return () => {
    responsiveMedia.revert()
    ctx.revert()
  }
}
