import { useMouseGlow } from '../hooks/useMouseGlow'
import { certifications } from '../data/content'

export default function Certifications() {
  return (
    <section
      id="certifications"
      style={{ backgroundColor: 'var(--bg-section-alt)' }}
    >
      <div className="min-h-svh">
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-28">
          <span className="section-label">Certifications</span>
          <h2 className="section-heading mt-3">
            Industry credentials
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            {certifications.map((group) => (
              <CertCard key={group.title} group={group} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CertCard({ group }) {
  const { glowRef, glowPos, glowVisible, glowHandlers } = useMouseGlow()

  return (
    <div
      ref={glowRef}
      {...glowHandlers}
      className="relative overflow-hidden rounded-lg p-6 sm:p-7 transition-all duration-150 hover:bg-[var(--card-hover-bg)] hover:border-[var(--card-hover-border)] hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5 cursor-default"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--bg-card-border)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className={`card-glow ${glowVisible ? 'card-glow--visible' : ''}`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(var(--glow-radius) circle at ${glowPos.x}% ${glowPos.y}%, var(--glow-color), transparent 40%)`,
        }}
      />
      <div className="relative z-[1] cert-card-content">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-1 h-6 rounded-full bg-signal" aria-hidden="true" />
          <h3 className="text-sm font-mono tracking-wider uppercase" style={{ color: 'var(--text-body)' }}>
            {group.title}
          </h3>
        </div>
        <ul className="space-y-3">
          {group.items.map((item) => (
            <li key={item} className="text-sm font-body pl-4 relative" style={{ color: 'var(--text-muted)' }}>
              <span className="absolute left-0 top-[0.55em] w-1.5 h-[1.5px] bg-signal/50" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}