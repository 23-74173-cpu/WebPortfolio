import { useInView } from '../hooks/useInView'
import { certifications } from '../data/content'

export default function Certifications() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section
      id="certifications"
      ref={ref}
      className="py-28 sm:py-36 px-5 transition-all duration-500 ease-out"
      style={{
        backgroundColor: 'var(--bg-section-alt)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Certifications</span>
        <h2 className="section-heading mt-3">
          Industry credentials
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {certifications.map((group) => (
            <div
              key={group.title}
              className="rounded-lg p-6 sm:p-7 transition-all duration-150 hover:bg-[var(--card-hover-bg)] hover:border-[var(--card-hover-border)] hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5 cursor-default"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--bg-card-border)',
                backdropFilter: 'blur(4px)',
              }}
            >
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
          ))}
        </div>
      </div>
    </section>
  )
}
