import { stats } from '../data/content'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center px-5 pt-28 sm:pt-32 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(42,125,225,0.06)_0%,_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(42,125,225,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(42,125,225,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
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
            John Eduard De Villa
          </h1>
          <p className="font-body text-sm sm:text-base mt-1 text-dim">
            Full-stack Developer &middot; Nasugbu, Batangas
          </p>
        </div>

        <div className="mt-6 motion-safe:animate-boot-in opacity-0" style={{ animationDelay: '700ms' }}>
          <p className="text-sm sm:text-base font-body leading-relaxed max-w-xl mx-auto text-dim">
            From EHR schema design to IoT sensor pipelines. I build production systems for real clients while finishing my degree.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4 motion-safe:animate-boot-in opacity-0" style={{ animationDelay: '900ms' }}>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-signal text-paper text-sm font-medium rounded hover:bg-signal-dark transition-colors font-body"
          >
            View Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 border text-sm font-medium rounded hover:border-safety hover:text-safety transition-colors font-body"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--text-ultra-subtle)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Resume
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-pulse-slow"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-ultra-faint)]">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
