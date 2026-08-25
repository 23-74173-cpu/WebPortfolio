import { useState, useEffect, useLayoutEffect } from 'react'
import { personal, stats } from '../data/content'
import { prefersReducedMotion } from '../lib/motion'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  // Pre-zero the counter overlays before first paint (layout effect) so the
  // deferred GSAP init later counts them up; skipped under reduced motion so
  // the static target value is shown.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const systems = document.querySelector('[data-hero-count="systems"]')
    const clients = document.querySelector('[data-hero-count="clients"]')
    if (systems) systems.textContent = '0'
    if (clients) clients.textContent = '0'
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col items-center justify-center px-5 pt-20 sm:pt-24 pb-24 overflow-hidden"
      style={{
        transition: 'opacity 400ms ease-out',
        opacity: mounted ? 1 : 0,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--orb-1), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: '0.03',
            backgroundImage: `
              linear-gradient(var(--hero-grid) 1px, transparent 1px),
              linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="hero-orb hero-orb--1" style={{ width: '600px', height: '600px', top: '-10%', left: '-5%', background: 'radial-gradient(circle, var(--orb-1), transparent 60%)' }} />
        <div className="hero-orb hero-orb--2" style={{ width: '400px', height: '400px', bottom: '-5%', right: '-5%', background: 'radial-gradient(circle, var(--orb-2), transparent 60%)' }} />
        <div className="hero-orb hero-orb--3" style={{ width: '350px', height: '350px', top: '40%', left: '60%', background: 'radial-gradient(circle, var(--orb-3), transparent 60%)' }} />
      </div>

      <div className="relative text-center max-w-3xl">
        <div className="flex items-baseline justify-center gap-6 sm:gap-10 motion-safe:animate-boot-in motion-safe:opacity-0">
          <div className="text-right">
            <span className="block text-6xl sm:text-7xl md:text-8xl font-bold font-display leading-none tracking-tight relative" style={{ color: 'var(--text-body)' }}>
              <span className="invisible">{stats.systemsShipped}</span>
              <span data-hero-count="systems" data-count={stats.systemsShipped} className="absolute inset-0">{stats.systemsShipped}</span>
            </span>
            <span className="font-mono text-xs sm:text-sm mt-1 block text-dim">
              SYSTEMS SHIPPED
            </span>
          </div>
          <span className="text-4xl sm:text-5xl md:text-6xl font-body font-thin text-dim">/</span>
          <div className="text-left">
            <span className="block text-6xl sm:text-7xl md:text-8xl font-bold text-safety font-display leading-none tracking-tight relative">
              <span className="invisible">{stats.clients}</span>
              <span data-hero-count="clients" data-count={stats.clients} className="absolute inset-0">{stats.clients}</span>
            </span>
            <span className="font-mono text-xs sm:text-sm mt-1 block text-dim">
              CLIENTS SERVED
            </span>
          </div>
        </div>

        <div className="mt-8 motion-safe:animate-boot-in motion-safe:opacity-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-body font-semibold" style={{ color: 'var(--text-body)' }}>
            {personal.name}
          </h1>
          <p className="font-body text-sm sm:text-base mt-1 text-dim">
            {personal.title} &middot; {personal.location}
          </p>
        </div>

        <div className="mt-6 motion-safe:animate-boot-in motion-safe:opacity-0">
          <p className="text-sm sm:text-base font-body leading-relaxed max-w-xl mx-auto text-dim">
            From EHR schema design to IoT sensor pipelines. I build production systems for real clients while finishing my degree.
          </p>
        </div>
      </div>

      <div
        data-hero-arrow
        className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-bounce-subtle"
        aria-hidden="true"
        style={{
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-ultra-faint)]">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}