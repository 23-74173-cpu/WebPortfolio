import { useState, useEffect } from 'react'
import { personal, stats } from '../data/content'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[85svh] flex flex-col items-center justify-center px-5 pt-20 sm:pt-24 pb-24 overflow-hidden"
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
        <div className="flex items-baseline justify-center gap-6 sm:gap-10 motion-safe:animate-boot-in opacity-0" style={{ animationDelay: '0ms' }}>
          <div className="text-right">
            <span className="block text-6xl sm:text-7xl md:text-8xl font-bold font-display leading-none tracking-tight" style={{ color: 'var(--text-body)' }}>
              {stats.systemsShipped}
            </span>
            <span className="font-mono text-xs sm:text-sm mt-1 block text-dim">
              SYSTEMS SHIPPED
            </span>
          </div>
          <span className="text-4xl sm:text-5xl md:text-6xl font-body font-thin text-dim">/</span>
          <div className="text-left">
            <span className="block text-6xl sm:text-7xl md:text-8xl font-bold text-safety font-display leading-none tracking-tight">
              {stats.sprintsLeft}
            </span>
            <span className="font-mono text-xs sm:text-sm mt-1 block text-dim">
              SPRINTS LEFT
            </span>
          </div>
        </div>

        <div className="mt-8 motion-safe:animate-boot-in opacity-0" style={{ animationDelay: '500ms' }}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-body font-semibold" style={{ color: 'var(--text-body)' }}>
            {personal.name}
          </h1>
          <p className="font-body text-sm sm:text-base mt-1 text-dim">
            {personal.title} &middot; {personal.location}
          </p>
        </div>

        <div className="mt-6 motion-safe:animate-boot-in opacity-0" style={{ animationDelay: '700ms' }}>
          <p className="text-sm sm:text-base font-body leading-relaxed max-w-xl mx-auto text-dim">
            From EHR schema design to IoT sensor pipelines. I build production systems for real clients while finishing my degree.
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 motion-safe:animate-bounce-subtle"
        aria-hidden="true"
        style={{
          opacity: pastHero ? 0 : 1,
          pointerEvents: pastHero ? 'none' : 'auto',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-ultra-faint)]">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
