import { useInView } from '../hooks/useInView'
import { useMouseGlow } from '../hooks/useMouseGlow'
import { timeline } from '../data/content'

export default function Timeline() {
  const [ref, inView] = useInView({ threshold: 0.05 })

  return (
    <section
      id="experience"
      ref={ref}
      className="py-28 sm:py-36 px-5 transition-all duration-500 ease-out"
      style={{
        backgroundColor: 'var(--bg-body)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <span className="section-label">Experience</span>
        <h2 className="section-heading mt-3">
          Timeline
        </h2>

        <div className="mt-14 relative">
          <div className="timeline-line" aria-hidden="true" />

          <div className="space-y-10">
            {timeline.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item, index }) {
  const [ref, inView] = useInView({ threshold: 0.15 })
  const { glowRef, glowPos, glowVisible, glowHandlers } = useMouseGlow()

  return (
    <div
      ref={ref}
      className="relative pl-10 motion-safe:opacity-0 transition-all duration-500 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div
        className={`timeline-dot ${item.type === 'education' ? 'timeline-dot--active' : ''}`}
        aria-hidden="true"
        style={{
          top: '4px',
          borderColor: item.type === 'education' ? 'var(--accent)' : 'var(--text-faint)',
          backgroundColor: item.type === 'education'
            ? 'var(--accent)'
            : 'var(--bg-body)',
        }}
      />

      <div
        ref={glowRef}
        {...glowHandlers}
        className="relative overflow-hidden rounded-lg p-5 border transition-all duration-150 hover:scale-[1.01]"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--bg-card-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <div
          className={`card-glow ${glowVisible ? 'card-glow--visible' : ''}`}
          aria-hidden="true"
          style={{
            background: `radial-gradient(var(--glow-radius) circle at ${glowPos.x}% ${glowPos.y}%, var(--glow-color), transparent 40%)`,
          }}
        />
        <div className="relative z-[1]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="font-mono text-[11px] tracking-wider"
              style={{ color: 'var(--accent)' }}
            >
              {item.year}
            </span>
            <span
              className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: 'var(--text-faint)',
                backgroundColor: 'var(--bg-tag-dim)',
              }}
            >
              {item.type === 'education' ? 'Education' : 'Freelance'}
            </span>
          </div>

          <h3
            className="text-base sm:text-lg font-display mt-2 leading-snug"
            style={{ color: 'var(--text-body)' }}
          >
            {item.title}
          </h3>

          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            {item.subtitle}
          </p>

          <p
            className="text-sm font-body mt-2 leading-relaxed"
            style={{ color: 'var(--text-dim)' }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}
