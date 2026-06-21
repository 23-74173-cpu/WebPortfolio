import { useInView } from '../hooks/useInView'
import { personal } from '../data/content'

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section
      id="about"
      ref={ref}
      className="py-28 sm:py-36 px-5 transition-all duration-500 ease-out"
      style={{
        backgroundColor: 'var(--bg-body)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="section-label">About</span>
        <div className="mt-6 grid md:grid-cols-5 gap-10 md:gap-16">
          <div className="md:col-span-3" style={{ transitionDelay: '100ms' }}>
            <h2 className="section-heading leading-tight">
              I build for clients,&nbsp;<br className="hidden sm:block" />
              <span className="text-signal">not&nbsp;grades</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base font-body leading-relaxed text-dim">
              {personal.summary}
            </p>
            <p className="mt-4 text-sm sm:text-base font-body leading-relaxed text-dim">
              {personal.approach}
            </p>
          </div>

          <div className="md:col-span-2 md:pl-10" style={{ borderLeft: '1px solid var(--about-sidebar-border)', transitionDelay: '200ms' }}>
            <h3 className="text-xs font-mono tracking-wider uppercase mb-4 text-dim">Current Status</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-mono text-extra-faint">Education</dt>
                <dd className="text-sm font-body mt-0.5" style={{ color: 'var(--text-body)' }}>{personal.education}</dd>
              </div>
              <div>
                <dt className="text-xs font-mono text-extra-faint">Location</dt>
                <dd className="text-sm font-body mt-0.5" style={{ color: 'var(--text-body)' }}>{personal.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-mono text-extra-faint">Workflow</dt>
                <dd className="text-sm font-body mt-0.5" style={{ color: 'var(--text-body)' }}>Solo, end-to-end, AI-assisted</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
